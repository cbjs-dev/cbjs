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
import { afterAll, beforeAll, describe, it } from 'vitest';

import { connect } from '@cbjsdev/cbjs';
import {
  applyCouchbaseClusterChanges,
  buildCouchbaseClusterConfig,
  CouchbaseClusterCollectionIndexConfig,
  CouchbaseClusterConfig,
  getCouchbaseKeyspaceChanges,
} from '@cbjsdev/deploy';
import { getApiConfig, getConnectionParams, getRandomId, sleep } from '@cbjsdev/shared';

import { serverVersionSatisfies } from '../../cbjs/utils/testConditions/serverVersionSatisfies.js';

/**
 * Vector indexes of the query service require Couchbase Server 8.0.0 or above.
 */
describe.runIf(serverVersionSatisfies('>=8.0.0'))(
  'vector query index',
  { sequential: true, timeout: 180_000 },
  async () => {
    if (process.env.GITHUB_ACTIONS === 'true') {
      await sleep(15_000);
    }

    const bucketName = 'cbjs_' + getRandomId();
    const scopeName = getRandomId();
    const collectionName = getRandomId();

    const indexes: Record<string, CouchbaseClusterCollectionIndexConfig> = {
      idx_embedding_vector: {
        keys: ['`scope`.`organizationId`', 'sourceCollection', 'vector VECTOR'],
        with: {
          dimension: 768,
          similarity: 'DOT',
          description: 'IVF,SQ8',
        },
      },
      idx_created_at: {
        keys: ['title', 'createdAt DESC'],
      },
    };

    const clusterConfig: CouchbaseClusterConfig = {
      users: [],
      keyspaces: {
        [bucketName]: {
          ramQuotaMB: 512,
          numReplicas: 0,
          scopes: {
            [scopeName]: {
              collections: {
                [collectionName]: { indexes },
              },
            },
          },
        },
      },
    };

    beforeAll(async () => {
      const params = getConnectionParams();
      const cluster = await connect(params.connectionString, params.credentials);

      const changes = getCouchbaseKeyspaceChanges({}, clusterConfig);
      await applyCouchbaseClusterChanges(cluster, getApiConfig(false), changes, {
        timeout: 45_000,
      });

      await cluster.closeGracefully();
    });

    afterAll(async () => {
      const params = getConnectionParams();
      const cluster = await connect(params.connectionString, params.credentials);
      await cluster.buckets().dropBucket(bucketName);
      await cluster.closeGracefully();
      await sleep(10_000);
    });

    it('should create the index with its "WITH" options', async ({ expect }) => {
      const params = getConnectionParams();
      const cluster = await connect(params.connectionString, params.credentials);

      const config = await buildCouchbaseClusterConfig(cluster, {
        buckets: [bucketName],
      });

      const collectionIndexes =
        config.keyspaces[bucketName].scopes[scopeName].collections[collectionName]
          .indexes;

      expect(collectionIndexes).toBeDefined();

      const vectorIndex = collectionIndexes!.idx_embedding_vector;
      expect(vectorIndex).toBeDefined();
      expect(vectorIndex.with).toMatchObject({
        dimension: 768,
        description: 'IVF,SQ8',
        // The server lowercases the similarity
        similarity: 'dot',
      });

      expect(vectorIndex.keys.at(-1)).toBe('`vector` VECTOR');

      await cluster.closeGracefully();
    });

    it('should not report any change when the very same config is deployed again', async ({
      expect,
    }) => {
      const params = getConnectionParams();
      const cluster = await connect(params.connectionString, params.credentials);

      const currentConfig = await buildCouchbaseClusterConfig(cluster, {
        buckets: [bucketName],
      });

      const currentBucket = currentConfig.keyspaces[bucketName];
      const currentCollection =
        currentBucket.scopes[scopeName].collections[collectionName];

      const nextConfig: CouchbaseClusterConfig = {
        users: [],
        keyspaces: {
          [bucketName]: {
            ...currentBucket,
            scopes: {
              ...currentBucket.scopes,
              [scopeName]: {
                collections: {
                  [collectionName]: { ...currentCollection, indexes },
                },
              },
            },
          },
        },
      };

      const changes = getCouchbaseKeyspaceChanges(currentConfig, nextConfig);
      expect(changes).toEqual([]);

      await cluster.closeGracefully();
    });
  }
);
