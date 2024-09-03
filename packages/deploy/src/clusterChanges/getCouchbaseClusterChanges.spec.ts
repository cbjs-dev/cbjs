import { describe, it } from 'vitest';

import { getCouchbaseClusterChanges } from './getCouchbaseClusterChanges.js';
import { CouchbaseClusterConfig } from './types.js';

describe('getCouchbaseClusterChanges', () => {
  it('should return an empty array when both currentConfig and nextConfig are empty', ({
    expect,
  }) => {
    const currentConfig = {};
    const nextConfig = {};

    const changes = getCouchbaseClusterChanges(currentConfig, nextConfig);

    expect(changes).toEqual([]);
  });

  it('should identify obsolete and new buckets and add them to changes', ({ expect }) => {
    const currentConfig = {
      bucket1: { ramQuotaMB: 100, scopes: {} },
    };
    const nextConfig = {
      bucket2: { ramQuotaMB: 100, scopes: {} },
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
    };
    const nextConfig = {};

    const changes = getCouchbaseClusterChanges(currentConfig, nextConfig);

    expect(changes).toEqual([{ type: 'dropBucket', name: 'bucket1' }]);
  });

  it('should add updated buckets to changes when their properties are modified and updatable', ({
    expect,
  }) => {
    const currentConfig = {
      bucket1: { scopes: {}, ramQuotaMB: 100 },
    };
    const nextConfig = {
      bucket1: { scopes: {}, ramQuotaMB: 200 },
    };

    const changes = getCouchbaseClusterChanges(currentConfig, nextConfig);

    expect(changes).toEqual([
      { type: 'updateBucket', config: { name: 'bucket1', scopes: {}, ramQuotaMB: 200 } },
    ]);
  });

  it('should add buckets to recreate to changes when their properties are modified but not updatable', ({
    expect,
  }) => {
    const currentConfig: CouchbaseClusterConfig = {
      bucket1: { scopes: {}, ramQuotaMB: 100, storageBackend: 'couchstore' },
    };
    const nextConfig: CouchbaseClusterConfig = {
      bucket1: { scopes: {}, ramQuotaMB: 100, storageBackend: 'magma' },
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
      bucket1: {
        ramQuotaMB: 100,
        scopes: {
          scope1: {
            collections: {},
          },
        },
      },
    };
    const nextConfig = {
      bucket1: {
        ramQuotaMB: 100,
        scopes: {
          scope2: {
            collections: {},
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
    };
    const nextConfig = {
      bucket1: {
        ramQuotaMB: 100,
        scopes: {},
      },
    };

    const changes = getCouchbaseClusterChanges(currentConfig, nextConfig);

    expect(changes).toEqual([{ type: 'dropScope', name: 'scope1', bucket: 'bucket1' }]);
  });

  it('should identify obsolete and new collections and add them to changes', ({
    expect,
  }) => {
    const currentConfig = {
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
    };
    const nextConfig = {
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
    };
    const nextConfig = {
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
    const currentConfig: CouchbaseClusterConfig = {
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
    };
    const nextConfig: CouchbaseClusterConfig = {
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
    const currentConfig: CouchbaseClusterConfig = {
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
                },
              },
            },
          },
        },
      },
    };
    const nextConfig: CouchbaseClusterConfig = {
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
    ]);
  });
});
