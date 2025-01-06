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
  CouchbaseClusterSearchIndexConfig,
  getCouchbaseClusterChanges,
} from '@cbjsdev/deploy';
import { ServerFeatures, whoami } from '@cbjsdev/http-client';
import {
  getApiConfig,
  getConnectionParams,
  getRandomId,
  invariant,
  sleep,
} from '@cbjsdev/shared';

import { serverSupportsFeatures } from '../../cbjs/utils/serverFeature.js';
import { apiConfig } from '../setupTests.js';

describe.runIf(
  serverSupportsFeatures(
    ServerFeatures.ScopeSearch,
    ServerFeatures.ScopeSearchIndexManagement
  )
)('applyCouchbaseClusterChanges', { sequential: true, timeout: 180_000 }, async () => {
  if (process.env.GITHUB_ACTIONS === 'true') {
    await sleep(15_000);
  }

  const bucketName = 'cbjs_' + getRandomId();
  const scopeName = getRandomId();
  const collectionName1 = getRandomId();
  const collectionName2 = getRandomId();

  afterAll(async () => {
    const params = getConnectionParams();
    const cluster = await connect(params.connectionString, params.credentials);
    await cluster.buckets().dropBucket(bucketName);

    const users = await cluster.users().getAllUsers();

    for (const user of users) {
      if (user.username.startsWith('cbjsUser_')) {
        await cluster.users().dropUser(user.username);
      }
    }

    await cluster.closeGracefully();

    // All this keyspace activity tends to mess up with the stability of the db
    // So we give it time to chill a bit
    await sleep(10_000);
  });

  const clusterConfig: CouchbaseClusterConfig = {
    users: [
      {
        username: 'cbjsUser_a',
        password: 'cbjsPassword_a',
        roles: [{ name: 'bucket_full_access', bucket: bucketName }],
      },
      {
        username: 'cbjsUser_b',
        password: 'cbjsPassword_b',
        roles: [{ name: 'admin' }],
      },
      {
        username: 'cbjsUser_c',
        password: 'cbjsPassword_c',
      },
    ],
    keyspaces: {
      [bucketName]: {
        ramQuotaMB: 100,
        numReplicas: 0,
        scopes: {
          [scopeName]: {
            searchIndexes: {
              searchIndex1: searchIndexConfigFn1(collectionName1),
            },
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
    },
  };

  it('should apply all the changes from scratch', async ({ expect }) => {
    const params = getConnectionParams();
    const cluster = await connect(params.connectionString, params.credentials);

    const changes = getCouchbaseClusterChanges({}, clusterConfig);

    console.log(
      `The following changes have been detected in the cluster : \n\t${changes.map((c) => JSON.stringify(c)).join('\n\t')}`
    );

    await applyCouchbaseClusterChanges(cluster, getApiConfig(false), changes, {
      timeout: 45_000,
    });

    // Check keyspaces //
    await expect(cluster.buckets().getBucket(bucketName)).resolves.toBeDefined();

    const scopes = await cluster.bucket(bucketName).collections().getAllScopes();
    const scope = scopes.find((s) => s.name === scopeName);

    expect(scope).toBeDefined();

    invariant(scope);

    expect(scope.collections.find((c) => c.name === collectionName1)).toBeDefined();
    expect(scope.collections.find((c) => c.name === collectionName2)).toBeDefined();

    // Check indexes //
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

    // Check search indexes //

    const searchIndexes = await cluster
      .bucket(bucketName)
      .scope(scopeName)
      .searchIndexes()
      .getAllIndexes();

    expect(searchIndexes.find((i) => i.name === 'searchIndex1')).toBeDefined();

    // Check users //
    const users = await cluster.users().getAllUsers();

    const userA = users.find((u) => u.username === 'cbjsUser_a');
    const userB = users.find((u) => u.username === 'cbjsUser_b');
    const userC = users.find((u) => u.username === 'cbjsUser_c');

    expect(userA).toBeDefined();
    expect(userA?.domain).toEqual('local');
    expect(userA?.roles).toEqual([{ name: 'bucket_full_access', bucket: bucketName }]);

    expect(userB).toBeDefined();
    expect(userB?.domain).toEqual('local');
    expect(userB?.roles).toEqual([{ name: 'admin' }]);

    expect(userC).toBeDefined();
    expect(userC?.domain).toEqual('local');
    expect(userC?.roles).toEqual([]);

    await cluster.closeGracefully();
  });

  it('should create, update or delete users when they change', async ({ expect }) => {
    const params = getConnectionParams();
    const cluster = await connect(params.connectionString, params.credentials);

    const nextUsers: CouchbaseClusterConfig['users'] = [
      {
        username: 'cbjsUser_a',
        // Role change
        roles: [{ name: 'data_reader', bucket: bucketName, scope: '*', collection: '*' }],
      },
      {
        username: 'cbjsUser_b',
        password: 'cbjsPassword_b2', // Password is updated
        roles: [{ name: 'admin' }],
      },
      {
        username: 'cbjsUser_e', // New user
        password: 'cbjsPassword_e',
      },
    ];

    const nextConfig: CouchbaseClusterConfig = {
      ...clusterConfig,
      users: nextUsers,
    };

    const changes = getCouchbaseClusterChanges(clusterConfig, nextConfig);

    console.log(
      `The following changes have been detected in the cluster : \n\t${changes.map((c) => JSON.stringify(c)).join('\n\t')}`
    );

    await applyCouchbaseClusterChanges(cluster, apiConfig, changes);

    const users = await cluster.users().getAllUsers();

    const userA = users.find((u) => u.username === 'cbjsUser_a');
    const userB = users.find((u) => u.username === 'cbjsUser_b');
    const userC = users.find((u) => u.username === 'cbjsUser_c');
    const userE = users.find((u) => u.username === 'cbjsUser_e');

    expect(userA).toBeDefined();
    expect(userA?.domain).toEqual('local');
    expect(userA?.roles).toEqual([
      { name: 'data_reader', bucket: bucketName, scope: '*', collection: '*' },
    ]);

    expect(userB).toBeDefined();
    expect(userB?.domain).toEqual('local');
    expect(userB?.roles).toEqual([{ name: 'admin' }]);

    await expect(
      whoami({
        ...apiConfig,
        credentials: {
          username: 'cbjsUser_b',
          password: 'cbjsPassword_b2',
        },
      })
    ).resolves.toBeDefined();

    expect(userC).toBeUndefined();

    expect(userE).toBeDefined();
    expect(userE?.roles).toEqual([]);

    clusterConfig.users = nextUsers;
  });

  it('should drop and create indexes when they change', async ({ expect }) => {
    const params = getConnectionParams();
    const cluster = await connect(params.connectionString, params.credentials);

    const nextClusterConfig: CouchbaseClusterConfig = {
      ...clusterConfig,
      keyspaces: {
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
      },
    };

    const changes = getCouchbaseClusterChanges(clusterConfig, nextClusterConfig);

    console.log(
      `The following changes have been detected in the cluster : \n\t${changes.map((c) => JSON.stringify(c)).join('\n\t')}`
    );

    await applyCouchbaseClusterChanges(cluster, getApiConfig(false), changes, {
      timeout: 45_000,
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

    clusterConfig.keyspaces = nextClusterConfig.keyspaces;
  });

  it('should upsert search indexes when they change', async ({ expect }) => {
    const params = getConnectionParams();
    const cluster = await connect(params.connectionString, params.credentials);

    const nextClusterConfig: CouchbaseClusterConfig = {
      ...clusterConfig,
      keyspaces: {
        [bucketName]: {
          ramQuotaMB: 100,
          numReplicas: 0,
          scopes: {
            [scopeName]: {
              searchIndexes: {
                searchIndex1: searchIndexConfigFn2(collectionName1),
              },
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
      },
    };

    const changes = getCouchbaseClusterChanges(clusterConfig, nextClusterConfig);

    console.log(
      `The following changes have been detected in the cluster : \n\t${changes.map((c) => JSON.stringify(c)).join('\n\t')}`
    );

    await applyCouchbaseClusterChanges(cluster, getApiConfig(false), changes, {
      timeout: 30_000,
    });

    const searchIndexes = await cluster
      .bucket(bucketName)
      .scope(scopeName)
      .searchIndexes()
      .getAllIndexes();

    const searchIndex1 = searchIndexes.find((i) => i.name === 'searchIndex1');

    expect(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      searchIndex1?.params.mapping.types[`${scopeName}.${collectionName1}`].properties
        .operations.properties.a.properties.op.fields[0].type
    ).toEqual('number');
  });
});

const searchIndexConfigFn1: (
  collectionName: string
) => CouchbaseClusterSearchIndexConfig =
  (collectionName) =>
  ({ sourceName, scopeName }) => ({
    name: 'searchIndex1',
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
        default_mapping: {
          dynamic: false,
          enabled: false,
        },
        default_type: '_default',
        docvalues_dynamic: false,
        index_dynamic: false,
        store_dynamic: false,
        type_field: '_type',
        types: {
          [`${scopeName}.${collectionName}`]: {
            dynamic: false,
            enabled: true,
            properties: {
              operations: {
                dynamic: false,
                enabled: true,
                properties: {
                  a: {
                    dynamic: false,
                    enabled: true,
                    properties: {
                      op: {
                        enabled: true,
                        dynamic: false,
                        fields: [
                          {
                            analyzer: 'keyword',
                            index: true,
                            name: 'op',
                            store: true,
                            type: 'text',
                          },
                        ],
                      },
                    },
                  },
                },
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

const searchIndexConfigFn2: (
  collectionName: string
) => CouchbaseClusterSearchIndexConfig =
  (collectionName) =>
  ({ sourceName, scopeName }) => ({
    name: 'searchIndex1',
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
        default_mapping: {
          dynamic: false,
          enabled: false,
        },
        default_type: '_default',
        docvalues_dynamic: false,
        index_dynamic: false,
        store_dynamic: false,
        type_field: '_type',
        types: {
          [`${scopeName}.${collectionName}`]: {
            dynamic: false,
            enabled: true,
            properties: {
              operations: {
                dynamic: false,
                enabled: true,
                properties: {
                  a: {
                    dynamic: false,
                    enabled: true,
                    properties: {
                      op: {
                        enabled: true,
                        dynamic: false,
                        fields: [
                          {
                            analyzer: 'keyword',
                            index: true,
                            name: 'op',
                            store: true,
                            type: 'number',
                          },
                        ],
                      },
                    },
                  },
                },
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
