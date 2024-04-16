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
import { beforeEach, describe, vi } from 'vitest';

import { DefaultTranscoder, DurabilityLevel } from '@cbjsdev/cbjs';
import { getPool } from '@cbjsdev/http-client';
import { waitFor } from '@cbjsdev/shared';
import { createCouchbaseTest, TestFixtures } from '@cbjsdev/vitest';

import { apiConfig } from '../setupTests';
import { ServerFeatures, serverSupportsFeatures } from '../utils/serverFeature';
import { getLargeTestDocument } from './kv._helpers';

describe
  .runIf(serverSupportsFeatures(ServerFeatures.Replicas))
  .shuffle('kv get replica', async () => {
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

    test('should perform basic get all replicas', async function ({
      serverTestContext,
      replicaNumber,
      expect,
      testDocKey,
      testDocContent,
    }) {
      const res = await serverTestContext.collection.getAllReplicas(testDocKey);

      expect(res).toBeInstanceOf(Array);
      expect(res).toHaveLength(replicaNumber);

      for (const replicaResult of res) {
        expect(replicaResult.isReplica).toBeTypeOf('boolean');
        expect(replicaResult.cas).toBeNonZeroCAS();
        expect(replicaResult.content).toEqual(testDocContent);
      }
    });

    test('should perform basic get all replicas with callback', async function ({
      expect,
      testDocKey,
      testDocContent,
      serverTestContext,
      replicaNumber,
    }) {
      expect.hasAssertions();
      const callback = vi.fn();

      await serverTestContext.collection.getAllReplicas(testDocKey, (err, res) => {
        if (err) return;

        expect(res).toBeInstanceOf(Array);
        expect(res).toHaveLength(replicaNumber);

        for (const replicaResult of res) {
          expect(replicaResult.isReplica).toBeTypeOf('boolean');
          expect(replicaResult.cas).toBeNonZeroCAS();
          expect(replicaResult.content).toEqual(testDocContent);
        }

        callback();
      });

      await waitFor(() => {
        expect(callback).toHaveBeenCalled();
      });
    });

    test('should perform basic get all replicas with options and callback', async function ({
      expect,
      testDocKey,
      testDocContent,
      serverTestContext,
    }) {
      expect.hasAssertions();

      const tc = new DefaultTranscoder();
      const replicaNumber = await getPool(apiConfig).then((p) => p.nodes.length);

      await serverTestContext.collection.getAllReplicas(
        testDocKey,
        { transcoder: tc },
        (err, res) => {
          if (err) return;

          expect(res).toBeInstanceOf(Array);
          expect(res).toHaveLength(replicaNumber);

          for (const replicaResult of res) {
            expect(replicaResult.isReplica).toBeTypeOf('boolean');
            expect(replicaResult.cas).toBeNonZeroCAS();
            expect(replicaResult.content).toEqual(testDocContent);
          }
        }
      );
    });

    test('should perform basic get any replica', async function ({
      expect,
      testDocKey,
      testDocContent,
      serverTestContext,
    }) {
      const res = await serverTestContext.collection.getAnyReplica(testDocKey);

      expect(res.isReplica).toBeTypeOf('boolean');
      expect(res.cas).toBeNonZeroCAS();
      expect(res.content).toEqual(testDocContent);
    });

    test('should perform basic get any replica with callback', async function ({
      expect,
      testDocKey,
      testDocContent,
      serverTestContext,
    }) {
      expect.hasAssertions();

      await serverTestContext.collection.getAnyReplica(testDocKey, (err, res) => {
        if (err) return;

        expect(res.isReplica).toBeTypeOf('boolean');
        expect(res.cas).toBeNonZeroCAS();
        expect(res.content).toEqual(testDocContent);
      });
    });

    test('should perform basic get any replica with options and callback', async function ({
      expect,
      testDocKey,
      testDocContent,
      serverTestContext,
    }) {
      expect.hasAssertions();

      const tc = new DefaultTranscoder();
      await serverTestContext.collection.getAnyReplica(
        testDocKey,
        { transcoder: tc },
        (err, res) => {
          if (err) return;

          expect(res.isReplica).toBeTypeOf('boolean');
          expect(res.cas).toBeNonZeroCAS();
          expect(res.content).toEqual(testDocContent);
        }
      );
    });
  });
