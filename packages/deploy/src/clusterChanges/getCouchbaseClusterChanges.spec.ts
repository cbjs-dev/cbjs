import { describe, it } from 'vitest';

import { getCouchbaseClusterChanges } from './getCouchbaseClusterChanges.js';
import { CouchbaseClusterConfig, CouchbaseClusterSearchIndexConfig } from './types.js';

describe('getCouchbaseClusterChanges', () => {
  it('should return an empty array when both currentConfig and nextConfig are empty', ({
    expect,
  }) => {
    const currentConfig = {};
    const nextConfig = {};

    const changes = getCouchbaseClusterChanges(currentConfig, nextConfig);

    expect(changes).toEqual([]);
  });

  it('should set changes in the right order', ({ expect }) => {
    const nextConfig = {
      users: [{ username: 'cbjsUser_a', password: 'cbjsUser_a' }],
      keyspaces: { bucket1: { ramQuotaMB: 100, scopes: {} } },
    };

    const changes = getCouchbaseClusterChanges({}, nextConfig);

    expect(changes).toEqual([
      { type: 'createBucket', config: { name: 'bucket1', ramQuotaMB: 100, scopes: {} } },
      {
        type: 'createUser',
        user: { username: 'cbjsUser_a', password: 'cbjsUser_a', domain: 'local' },
      },
    ]);
  });

  it('should identify obsolete and new buckets and add them to changes', ({ expect }) => {
    const currentConfig = {
      keyspaces: { bucket1: { ramQuotaMB: 100, scopes: {} } },
    };
    const nextConfig = {
      keyspaces: { bucket2: { ramQuotaMB: 100, scopes: {} } },
    };

    const changes = getCouchbaseClusterChanges(currentConfig, nextConfig);

    expect(changes).toEqual([
      { type: 'dropBucket', name: 'bucket1' },
      { type: 'createBucket', config: { name: 'bucket2', ramQuotaMB: 100, scopes: {} } },
    ]);
  });

  it('should not add drop scope nor drop collection to changes when the bucket is dropped', ({
    expect,
  }) => {
    const currentConfig = {
      keyspaces: {
        bucket1: {
          ramQuotaMB: 100,
          scopes: {
            scope1: {
              collections: {
                collection1: {},
              },
            },
          },
        },
      },
    };
    const nextConfig = {};

    const changes = getCouchbaseClusterChanges(currentConfig, nextConfig);

    expect(changes).toEqual([{ type: 'dropBucket', name: 'bucket1' }]);
  });

  it('should add updated buckets to changes when their properties are modified and updatable', ({
    expect,
  }) => {
    const currentConfig = {
      keyspaces: { bucket1: { scopes: {}, ramQuotaMB: 100 } },
    };
    const nextConfig = {
      keyspaces: { bucket1: { scopes: {}, ramQuotaMB: 200 } },
    };

    const changes = getCouchbaseClusterChanges(currentConfig, nextConfig);

    expect(changes).toEqual([
      { type: 'updateBucket', config: { name: 'bucket1', scopes: {}, ramQuotaMB: 200 } },
    ]);
  });

  it('should add buckets to recreate to changes when their properties are modified but not updatable', ({
    expect,
  }) => {
    const currentConfig: Partial<CouchbaseClusterConfig> = {
      keyspaces: {
        bucket1: { scopes: {}, ramQuotaMB: 100, storageBackend: 'couchstore' },
      },
    };
    const nextConfig: Partial<CouchbaseClusterConfig> = {
      keyspaces: { bucket1: { scopes: {}, ramQuotaMB: 100, storageBackend: 'magma' } },
    };

    const changes = getCouchbaseClusterChanges(currentConfig, nextConfig);

    expect(changes).toEqual([
      {
        type: 'recreateBucket',
        config: { name: 'bucket1', scopes: {}, ramQuotaMB: 100, storageBackend: 'magma' },
      },
    ]);
  });

  it('should identify obsolete and new scopes and add them to changes', ({ expect }) => {
    const currentConfig = {
      keyspaces: {
        bucket1: {
          ramQuotaMB: 100,
          scopes: {
            scope1: {
              collections: {},
            },
          },
        },
      },
    };
    const nextConfig = {
      keyspaces: {
        bucket1: {
          ramQuotaMB: 100,
          scopes: {
            scope2: {
              collections: {},
            },
          },
        },
      },
    };

    const changes = getCouchbaseClusterChanges(currentConfig, nextConfig);

    expect(changes).toEqual([
      { type: 'dropScope', name: 'scope1', bucket: 'bucket1' },
      { type: 'createScope', name: 'scope2', bucket: 'bucket1' },
    ]);
  });

  it('should not add drop collection to changes when the scope is dropped', ({
    expect,
  }) => {
    const currentConfig = {
      keyspaces: {
        bucket1: {
          ramQuotaMB: 100,
          scopes: {
            scope1: {
              collections: {
                collection1: {},
              },
            },
          },
        },
      },
    };
    const nextConfig = {
      keyspaces: {
        bucket1: {
          ramQuotaMB: 100,
          scopes: {},
        },
      },
    };

    const changes = getCouchbaseClusterChanges(currentConfig, nextConfig);

    expect(changes).toEqual([{ type: 'dropScope', name: 'scope1', bucket: 'bucket1' }]);
  });

  it('should identify obsolete and new collections and add them to changes', ({
    expect,
  }) => {
    const currentConfig = {
      keyspaces: {
        bucket1: {
          ramQuotaMB: 100,
          scopes: {
            scope1: {
              collections: {
                collection1: { history: true, maxExpiry: 100 },
                collection2: { history: false, maxExpiry: 200 },
              },
            },
          },
        },
      },
    };
    const nextConfig = {
      keyspaces: {
        bucket1: {
          ramQuotaMB: 100,
          scopes: {
            scope1: {
              collections: {
                collection2: { history: false, maxExpiry: 200 },
                collection3: { history: true, maxExpiry: 150 },
              },
            },
          },
        },
      },
    };

    const changes = getCouchbaseClusterChanges(currentConfig, nextConfig);

    expect(changes).toEqual([
      { type: 'dropCollection', name: 'collection1', bucket: 'bucket1', scope: 'scope1' },
      {
        type: 'createCollection',
        name: 'collection3',
        bucket: 'bucket1',
        scope: 'scope1',
        history: true,
        maxExpiry: 150,
      },
    ]);
  });

  it('should identify updated collections and add them to changes', ({ expect }) => {
    const currentConfig = {
      keyspaces: {
        bucket1: {
          ramQuotaMB: 100,
          scopes: {
            scope1: {
              collections: {
                collection1: { history: true, maxExpiry: 100 },
              },
            },
          },
        },
      },
    };
    const nextConfig = {
      keyspaces: {
        bucket1: {
          ramQuotaMB: 100,
          scopes: {
            scope1: {
              collections: {
                collection1: { history: true, maxExpiry: 200 },
              },
            },
          },
        },
      },
    };

    const changes = getCouchbaseClusterChanges(currentConfig, nextConfig);

    expect(changes).toEqual([
      {
        type: 'updateCollection',
        name: 'collection1',
        bucket: 'bucket1',
        scope: 'scope1',
        history: true,
        maxExpiry: 200,
      },
    ]);
  });

  it('should identify obsolete and new indexes and add them to changes', ({ expect }) => {
    const currentConfig: Partial<CouchbaseClusterConfig> = {
      keyspaces: {
        bucket1: {
          ramQuotaMB: 100,
          scopes: {
            scope1: {
              collections: {
                collection1: {
                  indexes: {
                    index1: {
                      keys: ['title'],
                    },
                  },
                },
              },
            },
          },
        },
      },
    };
    const nextConfig: Partial<CouchbaseClusterConfig> = {
      keyspaces: {
        bucket1: {
          ramQuotaMB: 100,
          scopes: {
            scope1: {
              collections: {
                collection1: {
                  indexes: {
                    index2: {
                      keys: ['name'],
                    },
                  },
                },
              },
            },
          },
        },
      },
    };

    const changes = getCouchbaseClusterChanges(currentConfig, nextConfig);

    expect(changes).toEqual([
      {
        type: 'dropIndex',
        name: 'index1',
        bucket: 'bucket1',
        scope: 'scope1',
        collection: 'collection1',
      },
      {
        type: 'createIndex',
        name: 'index2',
        bucket: 'bucket1',
        scope: 'scope1',
        collection: 'collection1',
        keys: ['name'],
      },
    ]);
  });

  it('should identify updated indexes that need to be recreated or simply updated', ({
    expect,
  }) => {
    const currentConfig: Partial<CouchbaseClusterConfig> = {
      keyspaces: {
        bucket1: {
          ramQuotaMB: 100,
          scopes: {
            scope1: {
              collections: {
                collection1: {
                  indexes: {
                    index1: {
                      keys: ['title'],
                    },
                    index2: {
                      keys: ['name'],
                    },
                    index3: {
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
    const nextConfig: Partial<CouchbaseClusterConfig> = {
      keyspaces: {
        bucket1: {
          ramQuotaMB: 100,
          scopes: {
            scope1: {
              collections: {
                collection1: {
                  indexes: {
                    index1: {
                      keys: ['title', 'group'],
                    },
                    index2: {
                      keys: ['name'],
                      numReplicas: 1,
                    },
                    index3: {
                      keys: ['groupId'],
                      where: 'groupId != "groupSystem"',
                    },
                  },
                },
              },
            },
          },
        },
      },
    };

    const changes = getCouchbaseClusterChanges(currentConfig, nextConfig);

    expect(changes).toEqual([
      {
        type: 'recreateIndex',
        name: 'index1',
        bucket: 'bucket1',
        scope: 'scope1',
        collection: 'collection1',
        keys: ['title', 'group'],
      },
      {
        type: 'updateIndex',
        name: 'index2',
        bucket: 'bucket1',
        scope: 'scope1',
        collection: 'collection1',
        keys: ['name'],
        numReplicas: 1,
      },
      {
        type: 'recreateIndex',
        name: 'index3',
        bucket: 'bucket1',
        scope: 'scope1',
        collection: 'collection1',
        keys: ['groupId'],
        where: 'groupId != "groupSystem"',
      },
    ]);
  });

  it('should identify users changes', ({ expect }) => {
    const currentConfig: Partial<CouchbaseClusterConfig> = {
      users: [
        {
          username: 'a',
          password: 'pa',
          roles: [{ name: 'fts_admin', bucket: 'b1' }],
        },
        {
          username: 'b',
          password: 'pb',
        },
        {
          username: 'c',
          password: 'pc',
        },
        {
          username: 'd',
          password: 'pd',
        },
        {
          username: 'f',
        },
      ],
      keyspaces: {},
    };

    const nextConfig: Partial<CouchbaseClusterConfig> = {
      users: [
        {
          username: 'a',
          roles: [{ name: 'admin' }], // Role change
        },
        {
          username: 'b',
          password: 'pb2', // Password change
        },
        {
          username: 'd',
          domain: 'ext', // Domain change
          password: 'pd',
        },
        {
          username: 'e', // New user
          password: 'pe',
        },
        {
          username: 'f',
          password: 'pf', // Password is set, previous password unknown
        },
      ],
      keyspaces: {},
    };

    const changes = getCouchbaseClusterChanges(currentConfig, nextConfig);

    // The order matters : first we create new users, then we update and finally we delete.
    expect(changes).toEqual([
      {
        type: 'createUser',
        user: {
          username: 'd',
          domain: 'ext',
          password: 'pd',
        },
      },
      {
        type: 'createUser',
        user: {
          username: 'e',
          password: 'pe',
          domain: 'local',
        },
      },
      {
        type: 'updateUser',
        user: {
          username: 'a',
          roles: [{ name: 'admin' }],
          domain: 'local',
        },
      },
      {
        type: 'updateUserPassword',
        username: 'b',
        password: 'pb',
        newPassword: 'pb2',
      },
      {
        type: 'recreateUser',
        user: {
          username: 'f',
          domain: 'local',
          password: 'pf',
        },
      },
      {
        type: 'dropUser',
        user: {
          username: 'c',
          password: 'pc',
          domain: 'local',
        },
      },
      {
        type: 'dropUser',
        user: {
          username: 'd',
          password: 'pd',
          domain: 'local',
        },
      },
    ]);
  });

  it('should identify new search indexes and add them to changes', ({ expect }) => {
    const currentConfig: Partial<CouchbaseClusterConfig> = {
      keyspaces: {
        bucket1: {
          ramQuotaMB: 100,
          scopes: {
            scope1: {
              collections: {
                collection1: {},
              },
            },
          },
        },
      },
    };
    const nextConfig: Partial<CouchbaseClusterConfig> = {
      keyspaces: {
        bucket1: {
          ramQuotaMB: 100,
          scopes: {
            scope1: {
              searchIndexes: {
                searchIndex1: searchIndexConfigFn1,
              },
              collections: {
                collection1: {},
              },
            },
          },
        },
      },
    };

    const changes = getCouchbaseClusterChanges(currentConfig, nextConfig);

    expect(changes).toEqual([
      {
        type: 'createSearchIndex',
        name: 'searchIndex1',
        bucket: 'bucket1',
        scope: 'scope1',
        configFn: searchIndexConfigFn1,
      },
    ]);
  });

  it('should identify updated search indexes and add them to changes', ({ expect }) => {
    const currentConfig: Partial<CouchbaseClusterConfig> = {
      keyspaces: {
        bucket1: {
          ramQuotaMB: 100,
          scopes: {
            scope1: {
              searchIndexes: {
                searchIndex1: searchIndexConfigFn1,
              },
              collections: {
                collection1: {},
              },
            },
          },
        },
      },
    };
    const nextConfig: Partial<CouchbaseClusterConfig> = {
      keyspaces: {
        bucket1: {
          ramQuotaMB: 100,
          scopes: {
            scope1: {
              searchIndexes: {
                searchIndex1: searchIndexConfigFn2,
              },
              collections: {
                collection1: {},
              },
            },
          },
        },
      },
    };

    const changes = getCouchbaseClusterChanges(currentConfig, nextConfig);

    expect(changes).toEqual([
      {
        type: 'updateSearchIndex',
        name: 'searchIndex1',
        bucket: 'bucket1',
        scope: 'scope1',
        configFn: searchIndexConfigFn2,
      },
    ]);
  });

  it('should identify obsolete search indexes and add them to changes', ({ expect }) => {
    const currentConfig: Partial<CouchbaseClusterConfig> = {
      keyspaces: {
        bucket1: {
          ramQuotaMB: 100,
          scopes: {
            scope1: {
              searchIndexes: {
                searchIndex1: searchIndexConfigFn1,
              },
              collections: {
                collection1: {},
              },
            },
          },
        },
      },
    };
    const nextConfig: Partial<CouchbaseClusterConfig> = {
      keyspaces: {
        bucket1: {
          ramQuotaMB: 100,
          scopes: {
            scope1: {
              collections: {
                collection1: {},
              },
            },
          },
        },
      },
    };

    const changes = getCouchbaseClusterChanges(currentConfig, nextConfig);

    expect(changes).toEqual([
      {
        type: 'dropSearchIndex',
        name: 'searchIndex1',
        bucket: 'bucket1',
        scope: 'scope1',
      },
    ]);
  });
});

const searchIndexConfigFn1: CouchbaseClusterSearchIndexConfig = ({
  sourceName,
  scopeName,
}) => ({
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
        [`${scopeName}._default`]: {
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

const searchIndexConfigFn2: CouchbaseClusterSearchIndexConfig = ({
  sourceName,
  scopeName,
}) => ({
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
        [`${scopeName}._default`]: {
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
