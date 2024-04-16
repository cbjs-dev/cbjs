/* eslint-disable @typescript-eslint/no-unsafe-member-access */

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
import { beforeEach, describe } from 'vitest';

import { CouchbaseCas, MutateInMacro, MutateInSpec } from '@cbjsdev/cbjs';
import { invariant } from '@cbjsdev/shared';
import { createCouchbaseTest, TestFixtures } from '@cbjsdev/vitest';

describe.shuffle('kv mutateIn macro', async () => {
  const test = await createCouchbaseTest(async ({ useDocumentKey }) => {
    return {
      testDocKey: useDocumentKey(),
      testDocContent: {},
    };
  });

  beforeEach<TestFixtures<typeof test>>(async function ({
    serverTestContext,
    testDocKey,
    testDocContent,
  }) {
    await serverTestContext.collection.insert(testDocKey, testDocContent, {
      timeout: 5000,
    });
  });

  // Issue JSCBC-1235
  test.fails(
    'correctly executes arrayAddUnique mutate-in macros',
    async ({ serverTestContext, testDocKey, expect }) => {
      await expect(
        serverTestContext.collection.mutateIn(testDocKey, [
          MutateInSpec.upsert('docMacros', [], { xattr: true }),
          MutateInSpec.arrayAddUnique('docMacros', MutateInMacro.Cas),
          MutateInSpec.arrayAddUnique('docMacros', MutateInMacro.SeqNo),
          MutateInSpec.arrayAddUnique('docMacros', MutateInMacro.ValueCrc32c),
        ])
      ).resolves.toBeDefined();
    }
  );

  const macros = [
    ['Cas', MutateInMacro.Cas],
    ['SeqNo', MutateInMacro.SeqNo],
    ['ValueCrc32c', MutateInMacro.ValueCrc32c],
  ] as const;

  macros.forEach(([name, macro]) => {
    test(`mutateIn insert MutateInMacro.${name}`, async ({
      serverTestContext,
      testDocKey,
      expect,
    }) => {
      const mutationResult = await serverTestContext.collection.mutateIn(testDocKey, [
        MutateInSpec.insert('docMacros', macro),
      ]);

      const {
        content: [docMacros],
      } = await serverTestContext.collection
        .lookupIn(testDocKey)
        .get('docMacros', { xattr: true });

      const { value: macroValue } = docMacros;

      expect(macroValue).toEqual(expect.stringMatching(/^0x/));

      if (macro._value === '${Mutation.CAS}') {
        const normalizedCas = CouchbaseCas.normalizeCas(macroValue);
        expect(normalizedCas).toBeNonZeroCAS();
        expect(CouchbaseCas.isEqual(normalizedCas, mutationResult.cas)).toBe(true);
      }
    });

    test(`mutateIn upsert MutateInMacro.${name}`, async ({
      serverTestContext,
      testDocKey,
      expect,
    }) => {
      const mutationResult = await serverTestContext.collection.mutateIn(testDocKey, [
        MutateInSpec.upsert('docMacros', macro),
      ]);

      const {
        content: [docMacros],
      } = await serverTestContext.collection
        .lookupIn(testDocKey)
        .get('docMacros', { xattr: true });

      const { value: macroValue } = docMacros;

      expect(macroValue).toEqual(expect.stringMatching(/^0x/));

      if (macro._value === '${Mutation.CAS}') {
        const normalizedCas = CouchbaseCas.normalizeCas(macroValue);
        expect(normalizedCas).toBeNonZeroCAS();
        expect(CouchbaseCas.isEqual(normalizedCas, mutationResult.cas)).toBe(true);
      }
    });

    test(`mutateIn replace MutateInMacro.${name}`, async ({
      serverTestContext,
      testDocKey,
      expect,
    }) => {
      await serverTestContext.collection.mutateIn(testDocKey, [
        MutateInSpec.insert('docMacros', macro),
      ]);

      const mutationResult = await serverTestContext.collection.mutateIn(testDocKey, [
        MutateInSpec.replace('docMacros', macro),
      ]);

      const {
        content: [docMacros],
      } = await serverTestContext.collection
        .lookupIn(testDocKey)
        .get('docMacros', { xattr: true });

      const { value: macroValue } = docMacros;

      expect(macroValue).toEqual(expect.stringMatching(/^0x/));

      if (macro._value === '${Mutation.CAS}') {
        const normalizedCas = CouchbaseCas.normalizeCas(macroValue);
        expect(normalizedCas).toBeNonZeroCAS();
        expect(CouchbaseCas.isEqual(normalizedCas, mutationResult.cas)).toBe(true);
      }
    });

    test(`mutateIn arrayAppend MutateInMacro.${name}`, async ({
      serverTestContext,
      testDocKey,
      expect,
    }) => {
      const { cas: mutationCas } = await serverTestContext.collection.mutateIn(
        testDocKey,
        [MutateInSpec.arrayAppend('docMacros', macro, { createPath: true })]
      );

      const subDoc = await serverTestContext.collection
        .lookupIn(testDocKey)
        .get('docMacros', { xattr: true });

      const {
        content: [docMacros],
      } = subDoc;

      invariant(!docMacros.error);

      const {
        value: [macroValue],
      } = docMacros;

      if (macro._value === '${Mutation.CAS}') {
        const normalizedCas = CouchbaseCas.normalizeCas(macroValue);
        expect(normalizedCas).toBeNonZeroCAS();
        expect(CouchbaseCas.isEqual(normalizedCas, mutationCas)).toBe(true);
      }
    });
  });
});
