import { UpdateBucketSettings } from '@cbjsdev/cbjs';
import { invariant } from '@cbjsdev/shared';

import { areSameIndexKeys } from './areSameIndexKeys.js';
import {
  CouchbaseClusterBucketConfig,
  CouchbaseClusterChange,
  CouchbaseClusterChangeCreateBucket,
  CouchbaseClusterChangeCreateCollection,
  CouchbaseClusterChangeCreateIndex,
  CouchbaseClusterChangeCreateScope,
  CouchbaseClusterChangeCreateSearchIndex,
  CouchbaseClusterChangeCreateUser,
  CouchbaseClusterChangeDropCollection,
  CouchbaseClusterChangeDropIndex,
  CouchbaseClusterChangeDropScope,
  CouchbaseClusterChangeDropSearchIndex,
  CouchbaseClusterChangeDropUser,
  CouchbaseClusterChangeRecreateBucket,
  CouchbaseClusterChangeRecreateIndex,
  CouchbaseClusterChangeRecreateUser,
  CouchbaseClusterChangeUpdateBucket,
  CouchbaseClusterChangeUpdateCollection,
  CouchbaseClusterChangeUpdateIndex,
  CouchbaseClusterChangeUpdateSearchIndex,
  CouchbaseClusterChangeUpdateUser,
  CouchbaseClusterChangeUpdateUserPassword,
  CouchbaseClusterConfig,
} from './types.js';

/**
 * Return the changes required to meet the nextConfig, given the currentConfig.
 * All changes are given in the order they should be applied, in order to minimize operational risks.
 *
 * @param currentConfig
 * @param nextConfig
 */
export function getCouchbaseClusterChanges(
  currentConfig: Partial<CouchbaseClusterConfig>,
  nextConfig: Partial<CouchbaseClusterConfig>
): CouchbaseClusterChange[] {
  const changes: CouchbaseClusterChange[] = [];

  ///////////////
  // KEYSPACES //
  ///////////////
  const currentKeyspaceConfig = currentConfig.keyspaces ?? {};
  const nextKeyspaceConfig = nextConfig.keyspaces ?? {};

  const obsoleteBuckets = getObsoleteBuckets(currentKeyspaceConfig, nextKeyspaceConfig);
  const newBuckets = getNewBuckets(currentKeyspaceConfig, nextKeyspaceConfig);
  const updatedBuckets = getUpdatedBuckets(currentKeyspaceConfig, nextKeyspaceConfig);

  changes.push(...obsoleteBuckets, ...newBuckets, ...updatedBuckets);

  Object.entries(nextKeyspaceConfig).forEach(([requestedBucketName, requestedBucket]) => {
    const obsoleteScopes = getObsoleteScopes(
      currentKeyspaceConfig,
      nextKeyspaceConfig,
      requestedBucketName
    );

    const newScopes = getNewScopes(
      currentKeyspaceConfig,
      nextKeyspaceConfig,
      requestedBucketName
    );

    changes.push(...obsoleteScopes, ...newScopes);

    Object.entries(requestedBucket.scopes).forEach(
      ([requestedScopeName, requestedScope]) => {
        const obsoleteCollections = getObsoleteCollections(
          currentKeyspaceConfig,
          nextKeyspaceConfig,
          requestedBucketName,
          requestedScopeName
        );
        const newCollections = getNewCollections(
          currentKeyspaceConfig,
          nextKeyspaceConfig,
          requestedBucketName,
          requestedScopeName
        );
        const updatedCollections = getUpdatedCollections(
          currentKeyspaceConfig,
          nextKeyspaceConfig,
          requestedBucketName,
          requestedScopeName
        );

        changes.push(...obsoleteCollections, ...newCollections, ...updatedCollections);

        const obsoleteSearchIndexes = getObsoleteSearchIndexes(
          currentKeyspaceConfig,
          nextKeyspaceConfig,
          requestedBucketName,
          requestedScopeName
        );
        const newSearchIndexes = getNewSearchIndexes(
          currentKeyspaceConfig,
          nextKeyspaceConfig,
          requestedBucketName,
          requestedScopeName
        );
        const updatedSearchIndexes = getUpdatedSearchIndexes(
          currentKeyspaceConfig,
          nextKeyspaceConfig,
          requestedBucketName,
          requestedScopeName
        );

        changes.push(
          ...obsoleteSearchIndexes,
          ...newSearchIndexes,
          ...updatedSearchIndexes
        );

        Object.keys(requestedScope.collections).forEach((requestedCollectionName) => {
          const obsoleteIndexes = getObsoleteIndexes(
            currentKeyspaceConfig,
            nextKeyspaceConfig,
            requestedBucketName,
            requestedScopeName,
            requestedCollectionName
          );

          const newIndexes = getNewIndexes(
            currentKeyspaceConfig,
            nextKeyspaceConfig,
            requestedBucketName,
            requestedScopeName,
            requestedCollectionName
          );

          const updatedIndexes = getUpdatedIndexes(
            currentKeyspaceConfig,
            nextKeyspaceConfig,
            requestedBucketName,
            requestedScopeName,
            requestedCollectionName
          );

          changes.push(...obsoleteIndexes, ...newIndexes, ...updatedIndexes);
        });
      }
    );
  });

  ///////////
  // USERS //
  ///////////
  const currentUsersConfig = currentConfig.users ?? [];
  const nextUsersConfig = nextConfig.users ?? [];

  const newUsers = getNewUsers(currentUsersConfig, nextUsersConfig);
  const updatedUsers = getUpdatedUsers(currentUsersConfig, nextUsersConfig);
  const obsoleteUsers = getObsoleteUsers(currentUsersConfig, nextUsersConfig);

  changes.push(...newUsers, ...updatedUsers, ...obsoleteUsers);

  return changes;
}

/**
 * Return buckets to drop because they are no longer required.
 */
function getObsoleteBuckets(
  currentConfig: CouchbaseClusterConfig['keyspaces'],
  nextConfig: CouchbaseClusterConfig['keyspaces']
): CouchbaseClusterChange[] {
  const currentBuckets = Object.keys(currentConfig);
  const requestedBuckets = Object.keys(nextConfig);

  return currentBuckets
    .filter((b) => !requestedBuckets.includes(b))
    .map((b) => ({
      type: 'dropBucket',
      name: b,
    }));
}

/**
 * Return scopes to drop because they are no longer required.
 */
function getObsoleteScopes(
  currentConfig: CouchbaseClusterConfig['keyspaces'],
  nextConfig: CouchbaseClusterConfig['keyspaces'],
  bucketName: string
): CouchbaseClusterChangeDropScope[] {
  const currentScopes = Object.keys(currentConfig[bucketName]?.scopes || []);
  const requestedScopes = Object.keys(nextConfig[bucketName].scopes);

  return currentScopes
    .filter((b) => !requestedScopes.includes(b))
    .map((b) => ({
      type: 'dropScope',
      name: b,
      bucket: bucketName,
    }));
}

function getObsoleteCollections(
  currentConfig: CouchbaseClusterConfig['keyspaces'],
  nextConfig: CouchbaseClusterConfig['keyspaces'],
  bucketName: string,
  scopeName: string
): CouchbaseClusterChangeDropCollection[] {
  const currentCollections = Object.keys(
    currentConfig[bucketName]?.scopes[scopeName]?.collections ?? []
  );
  const requestedCollections = Object.keys(
    nextConfig[bucketName].scopes[scopeName].collections
  );

  return currentCollections
    .filter((b) => !requestedCollections.includes(b))
    .map((b) => ({
      type: 'dropCollection',
      name: b,
      bucket: bucketName,
      scope: scopeName,
    }));
}

function getNewCollections(
  currentConfig: CouchbaseClusterConfig['keyspaces'],
  nextConfig: CouchbaseClusterConfig['keyspaces'],
  bucketName: string,
  scopeName: string
): CouchbaseClusterChangeCreateCollection[] {
  const currentCollections = Object.keys(
    currentConfig[bucketName]?.scopes[scopeName]?.collections ?? []
  );
  const requestedCollections = Object.keys(
    nextConfig[bucketName].scopes[scopeName].collections
  );

  return requestedCollections
    .filter((b) => !currentCollections.includes(b))
    .map((b) => {
      const requestedCollection = nextConfig[bucketName].scopes[scopeName].collections[b];
      invariant(requestedCollection, 'Collection definition not found.');

      return {
        type: 'createCollection',
        name: b,
        bucket: bucketName,
        scope: scopeName,
        ...requestedCollection,
      };
    });
}

function getNewScopes(
  currentConfig: CouchbaseClusterConfig['keyspaces'],
  nextConfig: CouchbaseClusterConfig['keyspaces'],
  bucketName: string
): CouchbaseClusterChangeCreateScope[] {
  const currentScopes = Object.keys(currentConfig[bucketName]?.scopes || []);
  const requestedScopes = Object.keys(nextConfig[bucketName].scopes);

  return requestedScopes
    .filter((b) => !currentScopes.includes(b))
    .map((b) => ({
      type: 'createScope',
      bucket: bucketName,
      name: b,
    }));
}

function getNewBuckets(
  currentConfig: CouchbaseClusterConfig['keyspaces'],
  nextConfig: CouchbaseClusterConfig['keyspaces']
): CouchbaseClusterChangeCreateBucket[] {
  const currentBuckets = Object.keys(currentConfig);
  const requestedBuckets = Object.keys(nextConfig);

  return requestedBuckets
    .filter((b) => !currentBuckets.includes(b))
    .map((b) => ({
      type: 'createBucket',
      config: {
        ...nextConfig[b],
        name: b,
      },
    }));
}

function getUpdatedBuckets(
  currentConfig: CouchbaseClusterConfig['keyspaces'],
  nextConfig: CouchbaseClusterConfig['keyspaces']
): Array<CouchbaseClusterChangeRecreateBucket | CouchbaseClusterChangeUpdateBucket> {
  const updatableProperties = [
    'flushEnabled',
    'ramQuotaMB',
    'numReplicas',
    'replicaIndexes',
    'evictionPolicy',
    'maxExpiry',
    'compressionMode',
    'minimumDurabilityLevel',
    'historyRetentionCollectionDefault',
    'historyRetentionBytes',
    'historyRetentionDuration',
    'maxTTL',
    'durabilityMinLevel',
    'ejectionMethod',
  ] satisfies Array<keyof UpdateBucketSettings>;

  const currentBuckets = Object.keys(currentConfig);
  const requestedBuckets = Object.keys(nextConfig);

  const changes = requestedBuckets
    .map((b) => {
      if (!currentBuckets.includes(b)) {
        return;
      }

      const currentBucket = currentConfig[b];
      const requestedBucket = nextConfig[b];

      invariant(currentBucket, 'Missing current bucket definition.');
      invariant(requestedBucket, 'Missing next bucket definition.');

      const propertiesToCompare = [
        ...Object.keys(currentBucket),
        ...Object.keys(requestedBucket),
      ] as Array<keyof CouchbaseClusterBucketConfig>;

      const changedBucketProperties = propertiesToCompare.filter((propertyName) => {
        if (propertyName === 'scopes') return false;
        return currentBucket[propertyName] !== requestedBucket[propertyName];
      });

      if (changedBucketProperties.length === 0) {
        return;
      }

      const bucketCanBeUpdated = changedBucketProperties.every((p) =>
        updatableProperties.includes(p as never)
      );

      if (bucketCanBeUpdated) {
        return {
          type: 'updateBucket',
          config: {
            name: b,
            ...requestedBucket,
          },
        };
      }

      return {
        type: 'recreateBucket',
        config: {
          name: b,
          ...requestedBucket,
        },
      };
    })
    .filter((e) => e !== undefined);

  return changes as Array<
    CouchbaseClusterChangeRecreateBucket | CouchbaseClusterChangeUpdateBucket
  >;
}

function getUpdatedCollections(
  currentConfig: CouchbaseClusterConfig['keyspaces'],
  nextConfig: CouchbaseClusterConfig['keyspaces'],
  bucketName: string,
  scopeName: string
): Array<CouchbaseClusterChangeUpdateCollection> {
  const currentCollections = Object.keys(
    currentConfig[bucketName]?.scopes[scopeName]?.collections ?? []
  );
  const requestedCollections = Object.keys(
    nextConfig[bucketName].scopes[scopeName].collections
  );

  return requestedCollections
    .filter((b) => {
      if (!currentCollections.includes(b)) {
        return false;
      }

      const currentCollection =
        currentConfig[bucketName]?.scopes[scopeName]?.collections[b];
      const requestedCollection =
        nextConfig[bucketName]?.scopes[scopeName]?.collections[b];

      invariant(currentCollection, 'Missing current collection definition.');
      invariant(requestedCollection, 'Missing next collection definition.');

      const collectionHasChanged =
        currentCollection.history !== requestedCollection.history ||
        currentCollection.maxExpiry !== requestedCollection.maxExpiry;

      return collectionHasChanged;
    })
    .map((b) => {
      const requestedCollection =
        nextConfig[bucketName]?.scopes[scopeName]?.collections[b];

      invariant(requestedCollection, 'Missing next collection definition.');

      return {
        ...requestedCollection,
        type: 'updateCollection',
        name: b,
        bucket: bucketName,
        scope: scopeName,
      };
    });
}

function getObsoleteIndexes(
  currentConfig: CouchbaseClusterConfig['keyspaces'],
  nextConfig: CouchbaseClusterConfig['keyspaces'],
  bucketName: string,
  scopeName: string,
  collectionName: string
): CouchbaseClusterChangeDropIndex[] {
  const currentIndexes = Object.keys(
    currentConfig[bucketName]?.scopes[scopeName]?.collections[collectionName]?.indexes ??
      {}
  );
  const requestedIndexes = Object.keys(
    nextConfig[bucketName].scopes[scopeName].collections[collectionName]?.indexes ?? {}
  );

  return currentIndexes
    .filter((b) => !requestedIndexes.includes(b))
    .map((b) => ({
      type: 'dropIndex',
      name: b,
      bucket: bucketName,
      scope: scopeName,
      collection: collectionName,
    }));
}

function getNewIndexes(
  currentConfig: CouchbaseClusterConfig['keyspaces'],
  nextConfig: CouchbaseClusterConfig['keyspaces'],
  bucketName: string,
  scopeName: string,
  collectionName: string
): CouchbaseClusterChangeCreateIndex[] {
  const currentIndexes = Object.keys(
    currentConfig[bucketName]?.scopes[scopeName]?.collections[collectionName]?.indexes ??
      {}
  );
  const requestedIndexes = Object.keys(
    nextConfig[bucketName].scopes[scopeName].collections[collectionName]?.indexes ?? {}
  );

  return requestedIndexes
    .filter((b) => !currentIndexes.includes(b))
    .map((b) => {
      const requestedIndex =
        nextConfig[bucketName]?.scopes[scopeName]?.collections[collectionName]?.indexes?.[
          b
        ];

      invariant(requestedIndex, 'Index definition not found.');

      return {
        ...requestedIndex,
        type: 'createIndex',
        name: b,
        bucket: bucketName,
        scope: scopeName,
        collection: collectionName,
      };
    });
}

function getUpdatedIndexes(
  currentConfig: CouchbaseClusterConfig['keyspaces'],
  nextConfig: CouchbaseClusterConfig['keyspaces'],
  bucketName: string,
  scopeName: string,
  collectionName: string
): Array<CouchbaseClusterChangeRecreateIndex | CouchbaseClusterChangeUpdateIndex> {
  const requestedIndexes = Object.keys(
    nextConfig[bucketName].scopes[scopeName].collections[collectionName]?.indexes ?? {}
  );

  const changes = requestedIndexes
    .map((b) => {
      const currentIndex =
        currentConfig[bucketName]?.scopes[scopeName]?.collections[collectionName]
          ?.indexes?.[b];
      const requestedIndex =
        nextConfig[bucketName]?.scopes[scopeName]?.collections[collectionName]?.indexes?.[
          b
        ];

      if (!currentIndex) {
        return;
      }

      invariant(currentIndex, 'Current index definition not found.');
      invariant(requestedIndex, 'Requested index definition not found.');

      const indexHaveChanged =
        !areSameIndexKeys(requestedIndex.keys, currentIndex.keys) ||
        requestedIndex.where !== currentIndex.where;

      if (indexHaveChanged) {
        return {
          type: 'recreateIndex',
          name: b,
          bucket: bucketName,
          scope: scopeName,
          collection: collectionName,
          ...requestedIndex,
        } as const;
      }

      if ((requestedIndex.numReplicas ?? 0) != (currentIndex.numReplicas ?? 0)) {
        return {
          type: 'updateIndex',
          name: b,
          bucket: bucketName,
          scope: scopeName,
          collection: collectionName,
          ...requestedIndex,
        } as const;
      }
    })
    .filter((c) => c !== undefined);

  return changes as Array<
    CouchbaseClusterChangeRecreateIndex | CouchbaseClusterChangeUpdateIndex
  >;
}

function findUser(
  users: CouchbaseClusterConfig['users'][number][],
  user: CouchbaseClusterConfig['users'][number]
) {
  return users.find((u) => {
    const { username, domain = 'local' } = u;
    return username === user.username && domain === (user.domain ?? 'local');
  });
}

function getObsoleteUsers(
  currentConfig: CouchbaseClusterConfig['users'],
  nextConfig: CouchbaseClusterConfig['users']
): CouchbaseClusterChangeDropUser[] {
  const changes: CouchbaseClusterChangeDropUser[] = [];
  const requestedUsers: string[] = [];

  nextConfig.forEach(({ username, domain = 'local' }) => {
    requestedUsers.push(`${domain} ${username}`);
  });

  currentConfig.forEach((u) => {
    const { username, domain = 'local' } = u;
    if (!requestedUsers.includes(`${domain} ${username}`)) {
      changes.push({
        type: 'dropUser',
        user: {
          ...u,
          domain,
        },
      });
    }
  });

  return changes;
}

function getUpdatedUsers(
  currentConfig: CouchbaseClusterConfig['users'],
  nextConfig: CouchbaseClusterConfig['users']
): Array<
  | CouchbaseClusterChangeUpdateUser
  | CouchbaseClusterChangeRecreateUser
  | CouchbaseClusterChangeUpdateUserPassword
> {
  const changes: Array<
    | CouchbaseClusterChangeUpdateUser
    | CouchbaseClusterChangeRecreateUser
    | CouchbaseClusterChangeUpdateUserPassword
  > = [];
  const requestedUsers: string[] = [];

  nextConfig.forEach(({ username, domain = 'local' }) => {
    requestedUsers.push(`${domain} ${username}`);
  });

  currentConfig.forEach((currentUser) => {
    const { username, domain = 'local' } = currentUser;
    if (requestedUsers.includes(`${domain} ${username}`)) {
      const nextUser = findUser(nextConfig, currentUser);
      invariant(nextUser, 'Requested user definition not found.');

      if (
        currentUser.password &&
        nextUser.password &&
        nextUser.password !== currentUser.password
      ) {
        return changes.push({
          type: 'updateUserPassword',
          username: currentUser.username,
          password: currentUser.password,
          newPassword: nextUser.password,
        });
      }

      if (!currentUser.password && nextUser.password) {
        return changes.push({
          type: 'recreateUser',
          user: {
            ...nextUser,
            domain,
          },
        });
      }

      if (
        nextUser.domain !== currentUser.domain ||
        nextUser.displayName !== currentUser.displayName ||
        nextUser.groups !== currentUser.groups ||
        JSON.stringify(nextUser.roles) !== JSON.stringify(currentUser.roles)
      ) {
        return changes.push({
          type: 'updateUser',
          user: {
            ...nextUser,
            domain,
          },
        });
      }
    }
  });

  return changes;
}

function getNewUsers(
  currentConfig: CouchbaseClusterConfig['users'],
  nextConfig: CouchbaseClusterConfig['users']
): CouchbaseClusterChangeCreateUser[] {
  const changes: CouchbaseClusterChangeCreateUser[] = [];
  const existingUsers: string[] = [];

  currentConfig.forEach(({ username, domain = 'local' }) => {
    existingUsers.push(`${domain} ${username}`);
  });

  nextConfig.forEach((u) => {
    const { username, domain = 'local' } = u;
    if (!existingUsers.includes(`${domain} ${username}`)) {
      changes.push({
        type: 'createUser',
        user: {
          ...u,
          domain,
        },
      });
    }
  });

  return changes;
}

function getObsoleteSearchIndexes(
  currentConfig: CouchbaseClusterConfig['keyspaces'],
  nextConfig: CouchbaseClusterConfig['keyspaces'],
  bucketName: string,
  scopeName: string
): CouchbaseClusterChangeDropSearchIndex[] {
  const currentIndexes = Object.keys(
    currentConfig[bucketName]?.scopes[scopeName]?.searchIndexes ?? {}
  );
  const requestedIndexes = Object.keys(
    nextConfig[bucketName]?.scopes[scopeName]?.searchIndexes ?? {}
  );

  return currentIndexes
    .filter((b) => !requestedIndexes.includes(b))
    .map((b) => ({
      type: 'dropSearchIndex',
      name: b,
      bucket: bucketName,
      scope: scopeName,
    }));
}

function getNewSearchIndexes(
  currentConfig: CouchbaseClusterConfig['keyspaces'],
  nextConfig: CouchbaseClusterConfig['keyspaces'],
  bucketName: string,
  scopeName: string
): CouchbaseClusterChangeCreateSearchIndex[] {
  const currentIndexes = Object.keys(
    currentConfig[bucketName]?.scopes[scopeName]?.searchIndexes ?? {}
  );
  const requestedIndexes = Object.keys(
    nextConfig[bucketName]?.scopes[scopeName]?.searchIndexes ?? {}
  );

  return requestedIndexes
    .filter((indexConfigName) => !currentIndexes.includes(indexConfigName))
    .map((indexConfigName) => {
      const requestedIndexFn =
        nextConfig[bucketName]?.scopes[scopeName]?.searchIndexes?.[indexConfigName];

      invariant(requestedIndexFn, 'Search index definition not found.');

      return {
        type: 'createSearchIndex',
        name: indexConfigName,
        bucket: bucketName,
        scope: scopeName,
        configFn: requestedIndexFn,
        config: requestedIndexFn({
          sourceName: bucketName,
          bucketName,
          scopeName,
        }),
      };
    });
}

function getUpdatedSearchIndexes(
  currentConfig: CouchbaseClusterConfig['keyspaces'],
  nextConfig: CouchbaseClusterConfig['keyspaces'],
  bucketName: string,
  scopeName: string
): CouchbaseClusterChangeUpdateSearchIndex[] {
  const requestedIndexes = Object.keys(
    nextConfig[bucketName]?.scopes[scopeName]?.searchIndexes ?? {}
  );

  const changes = requestedIndexes
    .map((b) => {
      const currentIndexFn =
        currentConfig[bucketName]?.scopes[scopeName]?.searchIndexes?.[b];
      const requestedIndexFn =
        nextConfig[bucketName]?.scopes[scopeName]?.searchIndexes?.[b];

      if (!currentIndexFn) {
        return;
      }

      invariant(requestedIndexFn, 'Requested search index definition not found.');

      const currentIndexConfig = currentIndexFn({
        sourceName: bucketName,
        bucketName: bucketName,
        scopeName: scopeName,
      });

      const requestedIndexConfig = requestedIndexFn({
        sourceName: bucketName,
        bucketName: bucketName,
        scopeName: scopeName,
      });

      invariant(currentIndexFn, 'Current index definition not found.');
      invariant(requestedIndexFn, 'Requested index definition not found.');

      const indexHasChanged =
        JSON.stringify(currentIndexConfig) !== JSON.stringify(requestedIndexConfig);

      if (indexHasChanged) {
        return {
          type: 'updateSearchIndex',
          name: b,
          bucket: bucketName,
          scope: scopeName,
          configFn: requestedIndexFn,
          config: requestedIndexConfig,
        } satisfies CouchbaseClusterChangeUpdateSearchIndex;
      }
    })
    .filter((c) => c !== undefined);

  return changes as CouchbaseClusterChangeUpdateSearchIndex[];
}
