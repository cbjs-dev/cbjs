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
import { beforeEach, describe, expectTypeOf } from 'vitest';

import {
  DocumentNotFoundError,
  LookupInReplicaResult,
  LookupInSpec,
  PathNotFoundError,
} from '@cbjsdev/cbjs';
import { ChainableLookupIn } from '@cbjsdev/cbjs/internal';
import { getPool, ServerFeatures } from '@cbjsdev/http-client';
import { invariant } from '@cbjsdev/shared';
import { createCouchbaseTest, TestFixtures } from '@cbjsdev/vitest';

import { apiConfig } from '../setupTests.js';
import { serverSupportsFeatures } from '../utils/serverFeature.js';

describe
  .runIf(serverSupportsFeatures(ServerFeatures.SubdocReadReplica))
  .shuffle('kv lookupInAllReplicas', async () => {
    const test = await createCouchbaseTest(async ({ useDocumentKey }) => {
      return {
        testDocKey: useDocumentKey(),
        testDocContent: {
          int: 14,
          anotherInt: 2,
          str: 'hello',
          arr: [1, 2, 3],
        },
        replicaNumber: (await getPool(apiConfig).then((p) => p.nodes.length)) - 1,
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

    test('should lookupInAllReplicas given specs', async ({
      serverTestContext,
      testDocKey,
      expect,
    }) => {
      const result = await serverTestContext.collection.lookupInAllReplicas(testDocKey, [
        LookupInSpec.get('str'),
        LookupInSpec.get('int'),
        LookupInSpec.get('missingPath'),
        LookupInSpec.exists('missingPath'),
      ]);

      expect(result).toBeInstanceOf(Array);
      expect(result[0]).toBeInstanceOf(LookupInReplicaResult);
      expect(result[0].content).toHaveLength(4);

      expect(result[0].content[0].error).toBeNull();
      expect(result[0].content[0].value).toEqual('hello');

      expect(result[0].content[1].error).toBeNull();
      expect(result[0].content[1].value).toEqual(14);

      expect(result[0].content[2].error).toBeInstanceOf(PathNotFoundError);
      expect(result[0].content[2].error).toHaveProperty('context', undefined);
      expect(result[0].content[2].value).toBeUndefined();

      expect(result[0].content[3].error).toBeNull();
      expect(result[0].content[3].value).toEqual(false);
    });

    test('should lookupInAllReplicas given specs with options', async ({
      serverTestContext,
      testDocKey,
      expect,
    }) => {
      const result = await serverTestContext.collection.lookupInAllReplicas(
        testDocKey,
        [
          LookupInSpec.get('str'),
          LookupInSpec.get('int'),
          LookupInSpec.get('missingPath'),
          LookupInSpec.exists('missingPath'),
        ],
        { timeout: 200 }
      );

      expect(result).toBeInstanceOf(Array);
      expect(result[0].content).toBeInstanceOf(Array);
      expect(result[0].content).toHaveLength(4);
    });

    test('should lookupInAllReplicas given specs with callback', async ({
      serverTestContext,
      testDocKey,
      expect,
    }) => {
      const result = await serverTestContext.collection.lookupInAllReplicas(
        testDocKey,
        [
          LookupInSpec.get('str'),
          LookupInSpec.get('int'),
          LookupInSpec.get('missingPath'),
          LookupInSpec.exists('missingPath'),
        ],
        (err, res) => {
          expectTypeOf(err).toEqualTypeOf<Error | null>();
          if (err) return;

          expectTypeOf(res).toEqualTypeOf<
            LookupInReplicaResult<[any, any, any, boolean]>[]
          >();
        }
      );

      expect(result).toBeInstanceOf(Array);
      expect(result[0].content).toBeInstanceOf(Array);
      expect(result[0].content).toHaveLength(4);
    });

    test('should lookupInAllReplicas given specs with options and callback', async ({
      serverTestContext,
      testDocKey,
      expect,
    }) => {
      const result = await serverTestContext.collection.lookupInAllReplicas(
        testDocKey,
        [
          LookupInSpec.get('str'),
          LookupInSpec.get('int'),
          LookupInSpec.get('missingPath'),
          LookupInSpec.exists('missingPath'),
        ],
        { timeout: 200 },
        (err, res) => {
          expectTypeOf(err).toEqualTypeOf<Error | null>();
          if (err) return;

          expectTypeOf(res).toEqualTypeOf<
            LookupInReplicaResult<[any, any, any, boolean]>[]
          >();
        }
      );

      expect(result).toBeInstanceOf(Array);
      expect(result[0].content).toBeInstanceOf(Array);
      expect(result[0].content).toHaveLength(4);
    });

    test('should perform the lookupInAllReplicas using ChainableLookupIn instance specs', async ({
      serverTestContext,
      testDocKey,
      expect,
    }) => {
      const lookup = serverTestContext.collection
        .lookupInAllReplicas(testDocKey)
        .get('str')
        .get('int')
        .get('missingPath')
        .exists('missingPath');

      expect(lookup).toBeInstanceOf(ChainableLookupIn);

      const result = await lookup;

      expect(result).toBeInstanceOf(Array);
      expect(result[0].content).toBeInstanceOf(Array);
      expect(result[0].content).toHaveLength(4);
    });

    test('should perform the lookupInAllReplicas using ChainableLookupIn instance specs with options', async ({
      serverTestContext,
      testDocKey,
      expect,
    }) => {
      const lookup = serverTestContext.collection
        .lookupInAllReplicas(testDocKey, { timeout: 200 })
        .get('str')
        .get('int')
        .get('missingPath')
        .exists('missingPath');

      expect(lookup).toBeInstanceOf(ChainableLookupIn);

      const result = await lookup;

      expect(result).toBeInstanceOf(Array);
      expect(result[0].content).toBeInstanceOf(Array);
      expect(result[0].content).toHaveLength(4);
    });

    test('should throw DocumentNotFoundError when lookupInAllReplicas a missing document', async ({
      serverTestContext,
      expect,
    }) => {
      expect.hasAssertions();

      try {
        await serverTestContext.collection.lookupInAllReplicas('missingDoc', [
          LookupInSpec.get('str'),
        ]);
      } catch (err) {
        expect(err).toBeInstanceOf(DocumentNotFoundError);
        invariant(err instanceof DocumentNotFoundError);
        // Issue JSCBC-1228
        // expect(err.context).toBeInstanceOf(KeyValueErrorContext);
      }
    });

    test.runIf(serverSupportsFeatures(ServerFeatures.Xattr))(
      'should not be able to lookup `revid` with accessDeleted',
      async ({ serverTestContext, testDocKey, expect }) => {
        await serverTestContext.collection.remove(testDocKey);

        await expect(
          serverTestContext.collection.lookupInAllReplicas(
            testDocKey,
            [LookupInSpec.exists('$document.revid', { xattr: true })],
            {
              // @ts-expect-error invalid option
              accessDeleted: true,
            }
          )
        ).rejects.toThrowError(DocumentNotFoundError);
      }
    );

    test('should return an array of array of values when using ChainableLookupIn.values()', async ({
      serverTestContext,
      testDocKey,
      expect,
    }) => {
      const result = await serverTestContext.collection
        .lookupInAllReplicas(testDocKey)
        .get('str')
        .get('int')
        .get('missingPath')
        .exists('missingPath')
        .values();

      expect(result).toEqual([['hello', 14, undefined, false]]);
    });

    test('should throw during lookupInAllReplica if a spec fails and throwOnSpecError is true', async ({
      serverTestContext,
      testDocKey,
      expect,
    }) => {
      await expect(
        serverTestContext.collection.lookupInAllReplicas(
          testDocKey,
          [
            LookupInSpec.get('str'),
            LookupInSpec.get('int'),
            LookupInSpec.get('missingPath'),
            LookupInSpec.exists('missingPath'),
          ],
          { throwOnSpecError: true }
        )
      ).rejects.toThrowError(PathNotFoundError);
    });
  });
