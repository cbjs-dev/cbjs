/*
 * Copyright (c) 2023-Present Jonathan MASSUCHETTI <jonathan.massuchetti@dappit.fr>.
 * Copyright (c) 2013-Present Couchbase Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* eslint-disable @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access */
import { describe } from 'vitest';

import {
  Cas,
  DurabilityImpossibleError,
  InvalidDurabilityPersistToLevel,
  InvalidDurabilityReplicateToLevel,
  MutateInSpec,
  MutationToken,
} from '@cbjs/cbjs';
import { getPool } from '@cbjs/http-client';
import { hasOwn, invariant } from '@cbjs/shared';
import { createCouchbaseTest, ServerTestContext } from '@cbjs/vitest';

import { apiConfig } from '../setupTests';

export type NodeCallback<T> = (...args: [null, T] | [Error, null]) => void;

describe.shuffle('kv durability', async () => {
  const replicaNumber = (await getPool(apiConfig).then((p) => p.nodes.length)) - 1;

  const test = await createCouchbaseTest(async ({ useDocumentKey }) => {
    return {
      testDocKey: useDocumentKey(),
    };
  });

  type Case = {
    operationName: string;
    operation: (
      stc: ServerTestContext,
      args: [string, any?, any?, NodeCallback<unknown>?]
    ) => Promise<{ cas: Cas; token?: MutationToken }>;
    getResultValue?: (result: any) => unknown;
    initialValue?: unknown;
    operationArg?: unknown;
    expected?: unknown;
  };

  const testCases: Case[] = [
    {
      operationName: 'increment',
      operation: (stc, args) => stc.collection.binary().increment(...args),
      getResultValue: (doc) => doc.value,
      initialValue: 14,
      operationArg: 3,
      expected: 17,
    },
    {
      operationName: 'decrement',
      operation: (stc, args) => stc.collection.binary().decrement(...args),
      getResultValue: (doc) => doc.value,
      initialValue: 14,
      operationArg: 4,
      expected: 10,
    },
    {
      operationName: 'append',
      operation: (stc, args) => stc.collection.binary().append(...args),
      initialValue: 14,
      operationArg: 'after',
      expected: Buffer.from('14after'),
    },
    {
      operationName: 'prepend',
      operation: (stc, args) => stc.collection.binary().prepend(...args),
      initialValue: 14,
      operationArg: 'before',
      expected: Buffer.from('before14'),
    },
    {
      operationName: 'insert',
      operation: (stc, args) => stc.collection.insert(...args),
      operationArg: 'insert',
      expected: 'insert',
    },
    {
      operationName: 'upsert',
      operation: (stc, args) => stc.collection.upsert(...args),
      initialValue: 'initialValue',
      operationArg: 'upsert',
      expected: 'upsert',
    },
    {
      operationName: 'replace',
      operation: (stc, args) => stc.collection.replace(...args),
      initialValue: 'initialValue',
      operationArg: 'replace',
      expected: 'replace',
    },
    {
      operationName: 'remove',
      operation: (stc, args) => {
        args.splice(1, 1);
        return stc.collection.remove(...(args as [string, any?, any?]));
      },
      initialValue: 'initialValue',
    },
    {
      operationName: 'mutateIn',
      operation: (stc, args) => stc.collection.mutateIn(...args),
      initialValue: {
        int: 14,
        str: 'hello',
        arr: [1, 2, 3],
      },
      operationArg: [
        MutateInSpec.increment('int', 3),
        MutateInSpec.upsert('str', 'newStr'),
        MutateInSpec.insert('newProp', 'newPropValue'),
        MutateInSpec.arrayAppend('arr', 4),
        MutateInSpec.arrayAppend('arr', [5, 6], { multi: true }),
      ],
      expected: {
        int: 17,
        str: 'newStr',
        newProp: 'newPropValue',
        arr: [1, 2, 3, 4, 5, 6],
      },
    },
  ];

  for (const testCase of testCases) {
    test(`should ${testCase.operationName} successfully`, async function ({
      serverTestContext,
      expect,
      testDocKey,
    }) {
      const { operation, operationArg, expected, initialValue, getResultValue } =
        testCase;

      if (initialValue) {
        await serverTestContext.collection.insert(testDocKey, initialValue);
      }

      const res = await operation(serverTestContext, [testDocKey, operationArg]);

      expect(res.cas).toBeNonZeroCAS();
      expect(res.token).toBeMutationToken();

      if (getResultValue) {
        expect(getResultValue(res)).toEqual(expected);
      }

      if (hasOwn(testCase, 'expected')) {
        const resultGet = await serverTestContext.collection.get(testDocKey);
        expect(resultGet.value).toEqual(expected);
      }
    });

    test(`should ${testCase.operationName} successfully with callback`, async function ({
      serverTestContext,
      expect,
      testDocKey,
    }) {
      expect.hasAssertions();

      const { operation, operationArg, expected, initialValue, getResultValue } =
        testCase;

      if (initialValue) {
        await serverTestContext.collection.insert(testDocKey, initialValue);
      }

      const res = await operation(serverTestContext, [
        testDocKey,
        operationArg,
        (err: unknown, res: unknown) => {
          if (err) return;

          invariant(hasOwn(res, 'cas'));
          invariant(hasOwn(res, 'token'));

          expect(res.cas).toBeNonZeroCAS();
          expect(res.token).toBeMutationToken();
        },
      ]);

      expect(res.cas).toBeNonZeroCAS();
      expect(res.token).toBeMutationToken();

      if (getResultValue) {
        expect(getResultValue(res)).toEqual(expected);
      }

      if (hasOwn(testCase, 'expected')) {
        const resultGet = await serverTestContext.collection.get(testDocKey);
        expect(resultGet.value).toEqual(expected);
      }
    });

    test(`should ${testCase.operationName} successfully with options and callback`, async function ({
      serverTestContext,
      expect,
      testDocKey,
    }) {
      expect.hasAssertions();

      const { operation, operationArg, expected, initialValue, getResultValue } =
        testCase;

      if (initialValue) {
        await serverTestContext.collection.insert(testDocKey, initialValue);
      }

      const res = await operation(serverTestContext, [
        testDocKey,
        operationArg,
        { timeout: 2000 },
        (err: unknown, res: unknown) => {
          if (err) return;

          invariant(hasOwn(res, 'cas'));
          invariant(hasOwn(res, 'token'));

          expect(res.cas).toBeNonZeroCAS();
          expect(res.token).toBeMutationToken();
        },
      ]);

      expect(res.cas).toBeNonZeroCAS();
      expect(res.token).toBeMutationToken();

      if (getResultValue) {
        expect(getResultValue(res)).toEqual(expected);
      }

      if (hasOwn(testCase, 'expected')) {
        const resultGet = await serverTestContext.collection.get(testDocKey);
        expect(resultGet.value).toEqual(expected);
      }
    });

    test(`should ${testCase.operationName} successfully with server durability`, async function ({
      serverTestContext,
      expect,
      testDocKey,
    }) {
      expect.hasAssertions();

      const { operation, operationArg, expected, initialValue, getResultValue } =
        testCase;

      if (initialValue) {
        await serverTestContext.collection.insert(testDocKey, initialValue);
      }

      const res = await operation(serverTestContext, [
        testDocKey,
        operationArg,
        { durabilityLevel: 1 },
      ]);

      expect(res.cas).toBeNonZeroCAS();
      expect(res.token).toBeMutationToken();

      if (getResultValue) {
        expect(getResultValue(res)).toEqual(expected);
      }

      if (hasOwn(testCase, 'expected')) {
        const resultGet = await serverTestContext.collection.get(testDocKey);
        expect(resultGet.value).toEqual(expected);
      }
    });

    test(`should ${testCase.operationName} successfully with client durability`, async function ({
      serverTestContext,
      expect,
      testDocKey,
    }) {
      expect.hasAssertions();

      const { operation, operationArg, expected, initialValue, getResultValue } =
        testCase;

      if (initialValue) {
        await serverTestContext.collection.insert(testDocKey, initialValue);
      }

      const res = await operation(serverTestContext, [
        testDocKey,
        operationArg,
        { durabilityReplicateTo: replicaNumber, durabilityPersistTo: 1 },
      ]);

      expect(res.cas).toBeNonZeroCAS();
      expect(res.token).toBeMutationToken();

      if (getResultValue) {
        expect(getResultValue(res)).toEqual(expected);
      }

      if (hasOwn(testCase, 'expected')) {
        const resultGet = await serverTestContext.collection.get(testDocKey);
        expect(resultGet.value).toEqual(expected);
      }
    });

    test(`should throw DurabilityImpossibleError during ${testCase.operationName} when durabilityReplicateTo is higher than the number of replica available`, async function ({
      serverTestContext,
      expect,
      testDocKey,
    }) {
      expect.hasAssertions();

      const { operation, operationArg, initialValue } = testCase;

      if (initialValue) {
        await serverTestContext.collection.insert(testDocKey, initialValue);
      }

      try {
        await operation(serverTestContext, [
          testDocKey,
          operationArg,
          {
            durabilityReplicateTo: replicaNumber + 1,
            durabilityPersistTo: 1,
          },
        ]);
      } catch (err) {
        expect(err).toBeInstanceOf(DurabilityImpossibleError);
        invariant(err instanceof DurabilityImpossibleError);
        // TODO uncomment once the issue is fixed: JSCBC-1228.
        // expect(err.context).toBeInstanceOf(KeyValueErrorContext);
      }
    });

    test(`should throw InvalidDurabilityReplicateToLevel during ${testCase.operationName} when durabilityReplicateTo value is illegal`, async function ({
      serverTestContext,
      expect,
      testDocKey,
    }) {
      expect.hasAssertions();

      const { operation, operationArg, initialValue } = testCase;

      if (initialValue) {
        await serverTestContext.collection.insert(testDocKey, initialValue);
      }

      await expect(
        operation(serverTestContext, [
          testDocKey,
          operationArg,
          {
            durabilityReplicateTo: 4, // max supported is 3
            durabilityPersistTo: 1,
          },
        ])
      ).rejects.toThrowError(InvalidDurabilityReplicateToLevel);
    });

    test(`should throw InvalidDurabilityPersistToLevel during ${testCase.operationName} when durabilityPersistTo value is illegal`, async function ({
      serverTestContext,
      expect,
      testDocKey,
    }) {
      expect.hasAssertions();

      const { operation, operationArg, initialValue } = testCase;

      if (initialValue) {
        await serverTestContext.collection.insert(testDocKey, initialValue);
      }

      await expect(
        operation(serverTestContext, [
          testDocKey,
          operationArg,
          {
            durabilityReplicateTo: replicaNumber,
            durabilityPersistTo: 6,
          },
        ])
      ).rejects.toThrowError(InvalidDurabilityPersistToLevel);
    });

    test(`should throw InvalidDurabilityLevel during ${testCase.operationName} when durabilityLevel value is illegal`, async function ({
      serverTestContext,
      expect,
      testDocKey,
    }) {
      expect.hasAssertions();

      const { operation, operationArg, initialValue } = testCase;

      if (initialValue) {
        await serverTestContext.collection.insert(testDocKey, initialValue);
      }

      await expect(
        operation(serverTestContext, [
          testDocKey,
          operationArg,
          {
            durabilityLevel: 5,
            durabilityPersistTo: 6,
          },
        ])
      ).rejects.toThrowError(InvalidDurabilityPersistToLevel);
    });
  }
});
