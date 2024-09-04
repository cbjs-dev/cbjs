import { UpdateBucketSettings } from '@cbjsdev/cbjs';
import { invariant } from '@cbjsdev/shared';

import { areSameIndexKeys } from './areSameIndexKeys.js';
import { CouchbaseClusterBucketConfig, CouchbaseClusterConfig } from './types.js';
import {
  CouchbaseClusterChange,
  CouchbaseClusterChangeCreateBucket,
  CouchbaseClusterChangeCreateCollection,
  CouchbaseClusterChangeCreateIndex,
  CouchbaseClusterChangeCreateScope,
  CouchbaseClusterChangeDropCollection,
  CouchbaseClusterChangeDropIndex,
  CouchbaseClusterChangeDropScope,
  CouchbaseClusterChangeRecreateBucket,
  CouchbaseClusterChangeRecreateIndex,
  CouchbaseClusterChangeUpdateBucket,
  CouchbaseClusterChangeUpdateCollection,
  CouchbaseClusterChangeUpdateIndex,
} from './types.js';

export function getCouchbaseClusterChanges(
  currentConfig: CouchbaseClusterConfig,
  nextConfig: CouchbaseClusterConfig
): CouchbaseClusterChange[] {
  const changes: CouchbaseClusterChange[] = [];

  const obsoleteBuckets = getObsoleteBuckets(currentConfig, nextConfig);
  const newBuckets = getNewBuckets(currentConfig, nextConfig);
  const updatedBuckets = getUpdatedBuckets(currentConfig, nextConfig);

  changes.push(...obsoleteBuckets, ...newBuckets, ...updatedBuckets);

  Object.entries(nextConfig).forEach(([requestedBucketName, requestedBucket]) => {
    const obsoleteScopes = getObsoleteScopes(
      currentConfig,
      nextConfig,
      requestedBucketName
    );

    const newScopes = getNewScopes(currentConfig, nextConfig, requestedBucketName);

    changes.push(...obsoleteScopes, ...newScopes);

    Object.entries(requestedBucket.scopes).forEach(
      ([requestedScopeName, requestedScope]) => {
        const obsoleteCollections = getObsoleteCollections(
          currentConfig,
          nextConfig,
          requestedBucketName,
          requestedScopeName
        );
        const newCollections = getNewCollections(
          currentConfig,
          nextConfig,
          requestedBucketName,
          requestedScopeName
        );
        const updatedCollections = getUpdatedCollections(
          currentConfig,
          nextConfig,
          requestedBucketName,
          requestedScopeName
        );

        changes.push(...obsoleteCollections, ...newCollections, ...updatedCollections);

        Object.keys(requestedScope.collections).forEach((requestedCollectionName) => {
          const obsoleteIndexes = getObsoleteIndexes(
            currentConfig,
            nextConfig,
            requestedBucketName,
            requestedScopeName,
            requestedCollectionName
          );

          const newIndexes = getNewIndexes(
            currentConfig,
            nextConfig,
            requestedBucketName,
            requestedScopeName,
            requestedCollectionName
          );

          const updatedIndexes = getUpdatedIndexes(
            currentConfig,
            nextConfig,
            requestedBucketName,
            requestedScopeName,
            requestedCollectionName
          );

          changes.push(...obsoleteIndexes, ...newIndexes, ...updatedIndexes);
        });
      }
    );
  });

  return changes;
}

/**
 * Return buckets to drop because they are no longer required.
 */
function getObsoleteBuckets(
  currentConfig: CouchbaseClusterConfig,
  nextConfig: CouchbaseClusterConfig
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
  currentConfig: CouchbaseClusterConfig,
  nextConfig: CouchbaseClusterConfig,
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
  currentConfig: CouchbaseClusterConfig,
  nextConfig: CouchbaseClusterConfig,
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
  currentConfig: CouchbaseClusterConfig,
  nextConfig: CouchbaseClusterConfig,
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
  currentConfig: CouchbaseClusterConfig,
  nextConfig: CouchbaseClusterConfig,
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
  currentConfig: CouchbaseClusterConfig,
  nextConfig: CouchbaseClusterConfig
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
  currentConfig: CouchbaseClusterConfig,
  nextConfig: CouchbaseClusterConfig
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
  currentConfig: CouchbaseClusterConfig,
  nextConfig: CouchbaseClusterConfig,
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
  currentConfig: CouchbaseClusterConfig,
  nextConfig: CouchbaseClusterConfig,
  bucketName: string,
  scopeName: string,
  collectionName: string
): CouchbaseClusterChangeDropIndex[] {
  const currentIndexes = Object.keys(
    currentConfig[bucketName]?.scopes[scopeName]?.collections[collectionName]?.indexes ??
      []
  );
  const requestedIndexes = Object.keys(
    nextConfig[bucketName].scopes[scopeName].collections[collectionName]?.indexes ?? []
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
  currentConfig: CouchbaseClusterConfig,
  nextConfig: CouchbaseClusterConfig,
  bucketName: string,
  scopeName: string,
  collectionName: string
): CouchbaseClusterChangeCreateIndex[] {
  const currentIndexes = Object.keys(
    currentConfig[bucketName]?.scopes[scopeName]?.collections[collectionName]?.indexes ??
      []
  );
  const requestedIndexes = Object.keys(
    nextConfig[bucketName].scopes[scopeName].collections[collectionName]?.indexes ?? []
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
  currentConfig: CouchbaseClusterConfig,
  nextConfig: CouchbaseClusterConfig,
  bucketName: string,
  scopeName: string,
  collectionName: string
): Array<CouchbaseClusterChangeRecreateIndex | CouchbaseClusterChangeUpdateIndex> {
  const requestedIndexes = Object.keys(
    nextConfig[bucketName].scopes[scopeName].collections[collectionName]?.indexes ?? []
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
