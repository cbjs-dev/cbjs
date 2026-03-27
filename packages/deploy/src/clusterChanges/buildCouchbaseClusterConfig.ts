import {
  AnyCluster,
  BucketSettings,
  CollectionSpec,
  ISearchIndex,
  SearchIndex,
  ScopeSpec,
} from '@cbjsdev/cbjs';

import {
  CouchbaseClusterBucketConfig,
  CouchbaseClusterCollectionConfig,
  CouchbaseClusterCollectionIndexConfig,
  CouchbaseClusterConfig,
  CouchbaseClusterScopeConfig,
  CouchbaseClusterSearchIndexConfig,
} from './types.js';

export type BuildCouchbaseClusterConfigOptions = {
  /**
   * Only include the specified buckets. All buckets are included when omitted.
   */
  buckets?: string[];
};

/**
 * Build a {@link CouchbaseClusterConfig} by querying the live cluster.
 *
 * The returned config can be passed as the `currentConfig` argument
 * to {@link getCouchbaseClusterChanges} to diff against a desired state.
 *
 * @remarks
 * - Search indexes are keyed by their actual index name (the cluster has no concept of config aliases).
 * - User passwords are never returned by the server; password-related diff changes will always
 *   be emitted when the target config specifies a password.
 * - Query index `numReplicas` is not available through the SDK and is omitted from the config.
 */
export async function buildCouchbaseClusterConfig(
  cluster: AnyCluster,
  options?: BuildCouchbaseClusterConfigOptions
): Promise<CouchbaseClusterConfig> {
  const allBuckets = await cluster.buckets().getAllBuckets();
  const buckets = options?.buckets
    ? allBuckets.filter((b) => options.buckets!.includes(b.name))
    : allBuckets;

  const [keyspaceEntries, users] = await Promise.all([
    Promise.all(buckets.map((b) => buildBucketEntry(cluster, b))),
    cluster.users().getAllUsers(),
  ]);

  return {
    keyspaces: Object.fromEntries(keyspaceEntries),
    users: users.map(({ username, displayName, groups, roles, domain }) => ({
      username,
      displayName,
      groups,
      roles,
      domain,
    })),
  };
}

async function buildBucketEntry(
  cluster: AnyCluster,
  bucket: BucketSettings
): Promise<[string, CouchbaseClusterBucketConfig]> {
  const { name, ...settings } = bucket;
  const scopeSpecs = await cluster.bucket(name).collections().getAllScopes();

  const scopeEntries = await Promise.all(
    scopeSpecs.map((scope) => buildScopeEntry(cluster, name, scope))
  );

  return [name, { ...settings, scopes: Object.fromEntries(scopeEntries) }];
}

async function buildScopeEntry(
  cluster: AnyCluster,
  bucketName: string,
  scope: ScopeSpec
): Promise<[string, CouchbaseClusterScopeConfig]> {
  const [collectionEntries, searchIndexes] = await Promise.all([
    Promise.all(
      scope.collections.map((col) =>
        buildCollectionEntry(cluster, bucketName, scope.name, col)
      )
    ),
    cluster.bucket(bucketName).scope(scope.name).searchIndexes().getAllIndexes(),
  ]);

  const config: CouchbaseClusterScopeConfig = {
    collections: Object.fromEntries(collectionEntries),
  };

  if (searchIndexes.length > 0) {
    config.searchIndexes = Object.fromEntries(
      searchIndexes.map((idx) => [idx.name, toSearchIndexConfigFn(idx)])
    );
  }

  return [scope.name, config];
}

async function buildCollectionEntry(
  cluster: AnyCluster,
  bucketName: string,
  scopeName: string,
  col: CollectionSpec
): Promise<[string, CouchbaseClusterCollectionConfig]> {
  const queryIndexes = await cluster
    .bucket(bucketName)
    .scope(scopeName)
    .collection(col.name)
    .queryIndexes()
    .getAllIndexes();

  const config: CouchbaseClusterCollectionConfig = {
    maxExpiry: col.maxExpiry || undefined,
    history: col.history,
  };

  const secondaryIndexes = queryIndexes.filter((qi) => !qi.isPrimary);
  if (secondaryIndexes.length > 0) {
    config.indexes = Object.fromEntries(
      secondaryIndexes.map((qi) => [qi.name, toQueryIndexConfig(qi)])
    );
  }

  return [col.name, config];
}

function toQueryIndexConfig(
  qi: { indexKey: string[]; condition?: string }
): CouchbaseClusterCollectionIndexConfig {
  const config: CouchbaseClusterCollectionIndexConfig = {
    keys: qi.indexKey,
  };

  if (qi.condition) {
    config.where = qi.condition;
  }

  return config;
}

/**
 * Wrap a live {@link SearchIndex} into a config function.
 * Server-assigned fields (`uuid`, `sourceUUID`) are stripped to avoid phantom diffs
 * during comparison, since they change on every index mutation.
 */
function toSearchIndexConfigFn(
  searchIndex: SearchIndex
): CouchbaseClusterSearchIndexConfig {
  const config = {
    name: searchIndex.name,
    sourceName: searchIndex.sourceName,
    type: searchIndex.type,
    params: searchIndex.params,
    sourceType: searchIndex.sourceType,
    sourceParams: searchIndex.sourceParams,
    planParams: searchIndex.planParams,
  } as ISearchIndex;

  return () => config;
}
