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
  CouchbaseClusterConfig,
  CouchbaseClusterSearchIndexConfig,
  getCouchbaseClusterChanges,
  getCouchbaseKeyspaceChanges,
} from '@cbjsdev/deploy';
import { ServerFeatures } from '@cbjsdev/http-client';
import { getApiConfig, getConnectionParams, getRandomId, sleep } from '@cbjsdev/shared';

import { serverSupportsFeatures } from '../../cbjs/utils/serverFeature.js';

describe.runIf(
  serverSupportsFeatures(
    ServerFeatures.ScopeSearch,
    ServerFeatures.ScopeSearchIndexManagement
  )
)('buildCouchbaseClusterConfig', { sequential: true, timeout: 180_000 }, async () => {
  if (process.env.GITHUB_ACTIONS === 'true') {
    await sleep(15_000);
  }

  const bucketName = 'cbjs_' + getRandomId();
  const scopeName = getRandomId();
  const collectionName1 = getRandomId();
  const collectionName2 = getRandomId();

  const searchIndexConfigFn: CouchbaseClusterSearchIndexConfig = ({
    sourceName,
    scopeName,
  }) => ({
    name: 'si_test',
    type: 'fulltext-index',
    params: {
      doc_config: {
        docid_prefix_delim: '',
        docid_regexp: '',
        mode: 'scope.collection.type_field',
        type_field: 'type',
      },
      mapping: {
        default_analyzer: 'standard',
        default_datetime_parser: 'dateTimeOptional',
        default_field: '_all',
        default_mapping: { dynamic: false, enabled: false },
        default_type: '_default',
        docvalues_dynamic: false,
        index_dynamic: false,
        store_dynamic: false,
        type_field: '_type',
        types: {
          [`${scopeName}.${collectionName1}`]: {
            dynamic: false,
            enabled: true,
            properties: {
              title: {
                enabled: true,
                dynamic: false,
                fields: [
                  {
                    index: true,
                    name: 'title',
                    store: true,
                    type: 'text',
                  },
                ],
              },
            },
          },
        },
      },
      store: {
        indexType: 'scorch',
        segmentVersion: 15,
      },
    },
    sourceType: 'gocbcore',
    sourceName: sourceName,
    sourceParams: {},
    planParams: {
      maxPartitionsPerPIndex: 1024,
      indexPartitions: 1,
      numReplicas: 0,
    },
  });

  const clusterConfig: CouchbaseClusterConfig = {
    users: [],
    keyspaces: {
      [bucketName]: {
        ramQuotaMB: 100,
        numReplicas: 0,
        scopes: {
          [scopeName]: {
            searchIndexes: {
              si_test: searchIndexConfigFn,
            },
            collections: {
              [collectionName1]: {
                indexes: {
                  idx_title: {
                    keys: ['title'],
                  },
                  idx_title_status: {
                    keys: ['title', 'status'],
                    where: '`type` = "article"',
                  },
                },
              },
              [collectionName2]: {
                indexes: {
                  idx_group: {
                    keys: ['groupId'],
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

  it('should detect buckets, scopes, collections, query indexes and search indexes', async ({
    expect,
  }) => {
    const params = getConnectionParams();
    const cluster = await connect(params.connectionString, params.credentials);

    const config = await buildCouchbaseClusterConfig(cluster, {
      buckets: [bucketName],
    });

    // Bucket
    const bucket = config.keyspaces[bucketName];
    expect(bucket).toBeDefined();
    expect(bucket.ramQuotaMB).toBe(100);
    expect(bucket.numReplicas).toBe(0);

    // Default scope and collection are always present
    expect(bucket.scopes._default).toBeDefined();
    expect(bucket.scopes._default.collections._default).toBeDefined();

    // Custom scope
    const scope = bucket.scopes[scopeName];
    expect(scope).toBeDefined();

    // Collections
    expect(scope.collections[collectionName1]).toBeDefined();
    expect(scope.collections[collectionName2]).toBeDefined();

    // Query indexes — collection1
    const c1Indexes = scope.collections[collectionName1].indexes;
    expect(c1Indexes).toBeDefined();

    expect(c1Indexes!.idx_title).toBeDefined();
    expect(c1Indexes!.idx_title.keys).toEqual(['title']);

    expect(c1Indexes!.idx_title_status).toBeDefined();
    expect(c1Indexes!.idx_title_status.keys).toEqual(['title', 'status']);
    expect(c1Indexes!.idx_title_status.where).toBeDefined();

    // Query indexes — collection2
    const c2Indexes = scope.collections[collectionName2].indexes;
    expect(c2Indexes).toBeDefined();
    expect(c2Indexes!.idx_group).toBeDefined();
    expect(c2Indexes!.idx_group.keys).toEqual(['groupId']);

    // Search indexes
    const searchIndexes = scope.searchIndexes;
    expect(searchIndexes).toBeDefined();
    expect(searchIndexes!.si_test).toBeDefined();
    expect(typeof searchIndexes!.si_test).toBe('function');

    const indexDef = searchIndexes!.si_test({
      sourceName: bucketName,
      bucketName,
      scopeName,
    });

    expect(indexDef.name).toBe('si_test');
    expect(indexDef.type).toBe('fulltext-index');
    expect(indexDef.sourceName).toBe(bucketName);

    // Users array is always present
    expect(Array.isArray(config.users)).toBe(true);

    await cluster.closeGracefully();
  });

  it('should only include filtered buckets', async ({ expect }) => {
    const params = getConnectionParams();
    const cluster = await connect(params.connectionString, params.credentials);

    const config = await buildCouchbaseClusterConfig(cluster, {
      buckets: [bucketName],
    });

    expect(Object.keys(config.keyspaces)).toEqual([bucketName]);

    await cluster.closeGracefully();
  });

  it('should produce no keyspace changes when diffed against itself', async ({
    expect,
  }) => {
    const params = getConnectionParams();
    const cluster = await connect(params.connectionString, params.credentials);

    const config = await buildCouchbaseClusterConfig(cluster, {
      buckets: [bucketName],
    });

    const changes = getCouchbaseKeyspaceChanges(config, config);
    expect(changes).toEqual([]);

    await cluster.closeGracefully();
  });
});
