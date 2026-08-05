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
  canonicalizeIndexConfigs,
  CouchbaseClusterConfig,
  getCouchbaseClusterChanges,
} from '@cbjsdev/deploy';
import { getApiConfig, getConnectionParams, getRandomId, sleep } from '@cbjsdev/shared';

describe('canonicalizeIndexConfigs', { sequential: true, timeout: 180_000 }, async () => {
  if (process.env.GITHUB_ACTIONS === 'true') {
    await sleep(15_000);
  }

  const bucketName = 'cbjs_' + getRandomId();
  const scopeName = getRandomId();
  const collectionName = getRandomId();

  // Expressions the server re-prints from its AST: operands flipped, functions
  // lowercased, paths quoted, precedence parenthesized, string literals requoted.
  const clusterConfig: CouchbaseClusterConfig = {
    users: [],
    keyspaces: {
      [bucketName]: {
        ramQuotaMB: 100,
        numReplicas: 0,
        scopes: {
          [scopeName]: {
            collections: {
              [collectionName]: {
                indexes: {
                  idx_expressions: {
                    keys: [
                      'type',
                      'OBJECT_LENGTH(timeEntries) > 0',
                      'body.email DESC',
                      'DISTINCT ARRAY v.x FOR v IN arr END',
                    ],
                    where: "type = 'new' AND archived = false OR priority > 2",
                  },
                },
              },
            },
          },
        },
      },
    },
  };

  beforeAll(async () => {
    const params = getConnectionParams();
    const cluster = await connect(params.connectionString, params.credentials);

    const changes = getCouchbaseClusterChanges({}, clusterConfig);
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

  it('should report a phantom change without canonicalization', async ({ expect }) => {
    const params = getConnectionParams();
    const cluster = await connect(params.connectionString, params.credentials);

    const currentConfig = await buildCouchbaseClusterConfig(cluster, {
      buckets: [bucketName],
    });

    const changes = getCouchbaseClusterChanges(currentConfig, clusterConfig);

    expect(changes).toContainEqual(
      expect.objectContaining({ type: 'recreateIndex', name: 'idx_expressions' })
    );

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

    const canonicalConfig = await canonicalizeIndexConfigs(
      getApiConfig(false),
      currentConfig,
      clusterConfig
    );

    const changes = getCouchbaseClusterChanges(currentConfig, canonicalConfig);

    expect(changes.filter((c) => c.type.toLowerCase().includes('index'))).toEqual([]);

    await cluster.closeGracefully();
  });

  it('should still report a change when the index definition really changed', async ({
    expect,
  }) => {
    const params = getConnectionParams();
    const cluster = await connect(params.connectionString, params.credentials);

    const currentConfig = await buildCouchbaseClusterConfig(cluster, {
      buckets: [bucketName],
    });

    const nextConfig = structuredClone(clusterConfig);
    const nextIndexes =
      nextConfig.keyspaces[bucketName].scopes[scopeName].collections[collectionName]
        .indexes;
    nextIndexes!.idx_expressions.where =
      "type = 'archived' AND archived = false OR priority > 2";

    const canonicalConfig = await canonicalizeIndexConfigs(
      getApiConfig(false),
      currentConfig,
      nextConfig
    );

    const changes = getCouchbaseClusterChanges(currentConfig, canonicalConfig);

    expect(changes).toContainEqual(
      expect.objectContaining({
        type: 'recreateIndex',
        name: 'idx_expressions',
        changedProperties: ['where'],
      })
    );

    await cluster.closeGracefully();
  });

  it('should reject an invalid index definition at diff time', async ({ expect }) => {
    const params = getConnectionParams();
    const cluster = await connect(params.connectionString, params.credentials);

    const currentConfig = await buildCouchbaseClusterConfig(cluster, {
      buckets: [bucketName],
    });

    const nextConfig = structuredClone(clusterConfig);
    const nextIndexes =
      nextConfig.keyspaces[bucketName].scopes[scopeName].collections[collectionName]
        .indexes;
    nextIndexes!.idx_expressions.keys = ['OBJECT_LENGTH(timeEntries'];

    await expect(
      canonicalizeIndexConfigs(getApiConfig(false), currentConfig, nextConfig)
    ).rejects.toThrowError(`#idx_expressions`);

    await cluster.closeGracefully();
  });
});
