/*
 * Copyright (c) 2023-Present Jonathan MASSUCHETTI <jonathan.massuchetti@dappit.fr>.
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
import { afterAll, describe, it } from 'vitest';

import { connect } from '@cbjsdev/cbjs';
import {
  applyCouchbaseClusterChanges,
  CouchbaseClusterConfig,
  getCouchbaseClusterChanges,
} from '@cbjsdev/deploy';
import { getApiConfig, getConnectionParams, invariant, sleep } from '@cbjsdev/shared';
import { getRandomId } from '@cbjsdev/vitest';

describe('applyCouchbaseClusterChanges', { sequential: true }, async () => {
  const bucketName = 'cbjs_' + getRandomId();
  const scopeName = getRandomId();
  const collectionName1 = getRandomId();
  const collectionName2 = getRandomId();

  const params = getConnectionParams();
  const cluster = await connect(params.connectionString, params.credentials);

  afterAll(async () => {
    await cluster.buckets().dropBucket(bucketName);
    // All this keyspace activity tends to mess up with the stability of the db
    // So we give it time to chill a bit
    await sleep(10_000);
  });

  const clusterConfig: CouchbaseClusterConfig = {
    [bucketName]: {
      ramQuotaMB: 100,
      numReplicas: 0,
      scopes: {
        [scopeName]: {
          collections: {
            [collectionName1]: {
              indexes: {
                c1_title: {
                  keys: ['title'],
                },
              },
            },
            [collectionName2]: {
              indexes: {
                c2_group: {
                  keys: ['groupId'],
                },
              },
            },
          },
        },
      },
    },
  };

  it(
    'should apply all the changes from scratch',
    { timeout: 180_000 },
    async ({ expect }) => {
      const changes = getCouchbaseClusterChanges({}, clusterConfig);

      console.log(
        `The following changes have been detected in the cluster : \n\t${changes.map((c) => JSON.stringify(c)).join('\n\t')}`
      );

      await applyCouchbaseClusterChanges(cluster, getApiConfig(false), changes, {
        timeout: 30_000,
      });

      await expect(cluster.buckets().getBucket(bucketName)).resolves.toBeDefined();

      const scopes = await cluster.bucket(bucketName).collections().getAllScopes();
      const scope = scopes.find((s) => s.name === scopeName);

      expect(scope).toBeDefined();

      invariant(scope);

      expect(scope.collections.find((c) => c.name === collectionName1)).toBeDefined();
      expect(scope.collections.find((c) => c.name === collectionName2)).toBeDefined();

      const c1indexes = await cluster
        .bucket(bucketName)
        .scope(scopeName)
        .collection(collectionName1)
        .queryIndexes()
        .getAllIndexes();
      const c2indexes = await cluster
        .bucket(bucketName)
        .scope(scopeName)
        .collection(collectionName2)
        .queryIndexes()
        .getAllIndexes();

      expect(c1indexes.find((i) => i.name === 'c1_title')).toBeDefined();
      expect(c2indexes.find((i) => i.name === 'c2_group')).toBeDefined();
    }
  );

  it(
    'should drop and create indexes when they change',
    { timeout: 180_000 },
    async ({ expect }) => {
      const cluster = await connect(params.connectionString, params.credentials);

      const nextClusterConfig: CouchbaseClusterConfig = {
        [bucketName]: {
          ramQuotaMB: 100,
          numReplicas: 0,
          scopes: {
            [scopeName]: {
              collections: {
                [collectionName1]: {
                  indexes: {
                    c1_title: {
                      keys: ['title'],
                    },
                  },
                },
                [collectionName2]: {
                  indexes: {
                    c2_groupId: {
                      keys: ['groupId'],
                    },
                  },
                },
              },
            },
          },
        },
      };

      const changes = getCouchbaseClusterChanges(clusterConfig, nextClusterConfig);

      console.log(
        `The following changes have been detected in the cluster : \n\t${changes.map((c) => JSON.stringify(c)).join('\n\t')}`
      );

      await applyCouchbaseClusterChanges(cluster, getApiConfig(false), changes, {
        timeout: 30_000,
      });

      await expect(cluster.buckets().getBucket(bucketName)).resolves.toBeDefined();

      const scopes = await cluster.bucket(bucketName).collections().getAllScopes();
      const scope = scopes.find((s) => s.name === scopeName);

      expect(scope).toBeDefined();

      invariant(scope);

      expect(scope.collections.find((c) => c.name === collectionName1)).toBeDefined();
      expect(scope.collections.find((c) => c.name === collectionName2)).toBeDefined();

      const c1indexes = await cluster
        .bucket(bucketName)
        .scope(scopeName)
        .collection(collectionName1)
        .queryIndexes()
        .getAllIndexes();
      const c2indexes = await cluster
        .bucket(bucketName)
        .scope(scopeName)
        .collection(collectionName2)
        .queryIndexes()
        .getAllIndexes();

      expect(c1indexes.find((i) => i.name === 'c1_title')).toBeDefined();
      expect(c2indexes.find((i) => i.name === 'c2_group')).toBeUndefined();
      expect(c2indexes.find((i) => i.name === 'c2_groupId')).toBeDefined();
    }
  );
});
