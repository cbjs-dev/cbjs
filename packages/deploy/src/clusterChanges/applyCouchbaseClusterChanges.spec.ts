import { beforeEach, describe, it, vi } from 'vitest';

import { CouchbaseHttpApiConfig, waitForCollection } from '@cbjsdev/http-client';

import { applyCouchbaseClusterChanges } from './applyCouchbaseClusterChanges.js';
import { CouchbaseClusterChange } from './types.js';

vi.mock('@cbjsdev/http-client', () => ({
  createQueryIndex: vi.fn(),
  updateQueryIndex: vi.fn(),
  updateUserPassword: vi.fn(),
  waitForBucket: vi.fn(),
  waitForCollection: vi.fn(),
  waitForQueryIndex: vi.fn(),
  waitForScope: vi.fn(),
  waitForSearchIndex: vi.fn(),
  waitForUser: vi.fn(),
  whoami: vi.fn(),
}));

const apiConfig: CouchbaseHttpApiConfig = {
  hostname: 'localhost',
  secure: false,
  credentials: {
    username: 'Administrator',
    password: 'password',
  },
};

function createClusterMock(collections: { scope: string; name: string }[]) {
  const collectionManager = {
    getAllScopes: vi.fn().mockResolvedValue([
      {
        name: 'scope1',
        collections: collections.map(({ scope, name }) => ({ name, scopeName: scope })),
      },
    ]),
    createCollection: vi.fn().mockResolvedValue(undefined),
    dropCollection: vi.fn().mockResolvedValue(undefined),
  };

  return {
    cluster: {
      bucket: vi.fn().mockReturnValue({ collections: () => collectionManager }),
    },
    collectionManager,
  };
}

describe('applyCouchbaseClusterChanges', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => undefined);

    return () => {
      vi.restoreAllMocks();
    };
  });

  it('should wait for the collection to be missing after dropping it', async ({
    expect,
  }) => {
    const { cluster, collectionManager } = createClusterMock([
      { scope: 'scope1', name: 'collection1' },
    ]);

    const changes: CouchbaseClusterChange[] = [
      {
        type: 'dropCollection',
        bucket: 'bucket1',
        scope: 'scope1',
        name: 'collection1',
      },
    ];

    await applyCouchbaseClusterChanges(cluster as never, apiConfig, changes);

    expect(collectionManager.dropCollection).toHaveBeenCalledWith(
      'collection1',
      'scope1',
      expect.anything()
    );
    expect(waitForCollection).toHaveBeenCalledWith(
      apiConfig,
      'bucket1',
      'scope1',
      'collection1',
      expect.objectContaining({ expectMissing: true })
    );
  });

  it('should wait for the collection to be visible after creating it', async ({
    expect,
  }) => {
    const { cluster } = createClusterMock([]);

    const changes: CouchbaseClusterChange[] = [
      {
        type: 'createCollection',
        bucket: 'bucket1',
        scope: 'scope1',
        name: 'collection1',
      },
    ];

    await applyCouchbaseClusterChanges(cluster as never, apiConfig, changes);

    expect(waitForCollection).toHaveBeenCalledWith(
      apiConfig,
      'bucket1',
      'scope1',
      'collection1',
      expect.not.objectContaining({ expectMissing: true })
    );
  });
});
