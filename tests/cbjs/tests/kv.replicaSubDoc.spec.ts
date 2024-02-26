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

import {
  DocumentNotFoundError,
  DocumentUnretrievableError,
  DurabilityLevel,
  KeyValueErrorContext,
  LookupInSpec,
} from '@cbjsdev/cbjs';
import { getPool } from '@cbjsdev/http-client';
import { invariant } from '@cbjsdev/shared';
import { createCouchbaseTest, TestFixtures } from '@cbjsdev/vitest';

import { apiConfig } from '../setupTests';
import { ServerFeatures, serverSupportsFeatures } from '../utils/serverFeature';
import { getLargeTestDocument } from './kv._helpers';

describe
  .runIf(
    serverSupportsFeatures(ServerFeatures.Replicas, ServerFeatures.SubdocReadReplica)
  )
  .shuffle('kv replica', async () => {
    const test = await createCouchbaseTest(async ({ useDocumentKey }) => {
      return {
        testDocKey: useDocumentKey(),
        testDocContent: getLargeTestDocument(),
        replicaNumber: await getPool(apiConfig).then((p) => p.nodes.length),
      };
    });

    beforeEach<TestFixtures<typeof test>>(async function ({
      serverTestContext,
      testDocKey,
      testDocContent,
    }) {
      await serverTestContext.collection.upsert(testDocKey, testDocContent, {
        durabilityLevel: DurabilityLevel.MajorityAndPersistOnMaster,
      });
    });

    test('should lookupInAnyReplica successfully', async function ({
      expect,
      serverTestContext,
      testDocKey,
    }) {
      const res = await serverTestContext.collection.lookupInAnyReplica(testDocKey, [
        LookupInSpec.get('str'),
        LookupInSpec.get('int'),
        LookupInSpec.exists('missingPath'),
      ]);

      expect(res.content).toBeInstanceOf(Array);
      expect(res.content).toHaveLength(3);

      expect(res.content[0].error).toBeNull();
      expect(res.content[0].value).toEqual('hello');

      expect(res.content[1].error).toBeNull();
      expect(res.content[1].value).toEqual(14);

      expect(res.content[2].error).toBeNull();
      expect(res.content[2].value).toEqual(false);
    });

    test('should lookupInAnyReplica with callback successfully', async function ({
      expect,
      serverTestContext,
      testDocKey,
    }) {
      expect.hasAssertions();

      await serverTestContext.collection.lookupInAnyReplica(
        testDocKey,
        [
          LookupInSpec.get('str'),
          LookupInSpec.get('int'),
          LookupInSpec.exists('missingPath'),
        ],
        (err, res) => {
          if (err) return;

          expect(res.cas).toBeNonZeroCAS();
          expect(res.isReplica).toBeTypeOf('boolean');

          expect(res.content[0]).toEqual('hello');
          expect(res.content[1]).toEqual(14);
          expect(res.content[2]).toEqual(false);
        }
      );
    });

    test('should throw DocumentUnretrievableError when lookupInAnyReplica a missing document', async function ({
      expect,
      serverTestContext,
    }) {
      expect.hasAssertions();

      try {
        await serverTestContext.collection.lookupInAllReplicas('missingDoc', [
          LookupInSpec.get('str'),
          LookupInSpec.get('int'),
          LookupInSpec.exists('missingPath'),
        ]);
      } catch (err) {
        expect(err).toBeInstanceOf(DocumentUnretrievableError);
        invariant(err instanceof DocumentUnretrievableError);
        expect(err.context).toBeInstanceOf(KeyValueErrorContext);
      }
    });

    test('should lookupInAllReplica successfully', async function ({
      expect,
      serverTestContext,
      testDocKey,
    }) {
      const res = await serverTestContext.collection.lookupInAllReplicas(testDocKey, [
        LookupInSpec.get('str'),
        LookupInSpec.get('int'),
        LookupInSpec.exists('missingPath'),
      ]);

      expect(res).toBeInstanceOf(Array);
      expect(res.find((r) => r.isReplica)).toHaveLength(1);

      res.forEach((replicaResult) => {
        expect(replicaResult.content).toBeInstanceOf(Array);
        expect(replicaResult.content).toHaveLength(3);

        expect(replicaResult.content[0].error).toBeNull();
        expect(replicaResult.content[0].value).toEqual('hello');

        expect(replicaResult.content[1].error).toBeNull();
        expect(replicaResult.content[1].value).toEqual(14);

        expect(replicaResult.content[2].error).toBeNull();
        expect(replicaResult.content[2].value).toEqual(false);
      });
    });

    test('should lookupInAllReplica with callback successfully', async function ({
      expect,
      serverTestContext,
      testDocKey,
    }) {
      expect.hasAssertions();

      await serverTestContext.collection.lookupInAllReplicas(
        testDocKey,
        [
          LookupInSpec.get('str'),
          LookupInSpec.get('int'),
          LookupInSpec.exists('missingPath'),
        ],
        (err, res) => {
          if (err) return;

          expect(res).toBeInstanceOf(Array);
          expect(res.find((r) => r.isReplica)).toHaveLength(1);

          res.forEach((replicaResult) => {
            expect(replicaResult.content).toBeInstanceOf(Array);
            expect(replicaResult.content).toHaveLength(3);

            expect(replicaResult.content[0].error).toBeNull();
            expect(replicaResult.content[0].value).toEqual('hello');

            expect(replicaResult.content[1].error).toBeNull();
            expect(replicaResult.content[1].value).toEqual(14);

            expect(replicaResult.content[2].error).toBeNull();
            expect(replicaResult.content[2].value).toEqual(false);
          });
        }
      );
    });

    test('should throw DocumentNotFoundError when lookupInAllReplica a missing document', async function ({
      expect,
      serverTestContext,
    }) {
      expect.hasAssertions();

      try {
        await serverTestContext.collection.lookupInAllReplicas('missingDoc', [
          LookupInSpec.get('str'),
          LookupInSpec.get('int'),
          LookupInSpec.exists('missingPath'),
        ]);
      } catch (err) {
        expect(err).toBeInstanceOf(DocumentNotFoundError);
        invariant(err instanceof DocumentNotFoundError);
        expect(err.context).toBeInstanceOf(KeyValueErrorContext);
      }
    });
  });
