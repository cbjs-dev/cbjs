import {
  AnyCluster,
  BucketSettings,
  CollectionSpec,
  FeatureNotAvailableError,
  ISearchIndex,
  ScopeSpec,
  SearchIndex,
} from '@cbjsdev/cbjs';
import { QueryIndexWithClause } from '@cbjsdev/shared';

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
 * - Scope search indexes are omitted on servers that don't support them (< 7.6).
 * - User passwords are never returned by the server; password-related diff changes will always
 *   be emitted when the target config specifies a password.
 * - Query index `numReplicas` and `with` options are read from `system:indexes`, since the
 *   index manager does not expose them.
 */
export async function buildCouchbaseClusterConfig(
  cluster: AnyCluster,
  options?: BuildCouchbaseClusterConfigOptions
): Promise<CouchbaseClusterConfig> {
  const allBuckets = await cluster.buckets().getAllBuckets();
  const buckets = options?.buckets
    ? allBuckets.filter((b) => options.buckets!.includes(b.name))
    : allBuckets;

  const indexOptions = await getIndexOptions(
    cluster,
    buckets.map((b) => b.name)
  );

  const [keyspaceEntries, users] = await Promise.all([
    Promise.all(buckets.map((b) => buildBucketEntry(cluster, b, indexOptions))),
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
  bucket: BucketSettings,
  indexOptions: IndexOptionsMap
): Promise<[string, CouchbaseClusterBucketConfig]> {
  const { name, ...settings } = bucket;
  const scopeSpecs = await cluster.bucket(name).collections().getAllScopes();

  const scopeEntries = await Promise.all(
    scopeSpecs.map((scope) => buildScopeEntry(cluster, name, scope, indexOptions))
  );

  return [name, { ...settings, scopes: Object.fromEntries(scopeEntries) }];
}

async function buildScopeEntry(
  cluster: AnyCluster,
  bucketName: string,
  scope: ScopeSpec,
  indexOptions: IndexOptionsMap
): Promise<[string, CouchbaseClusterScopeConfig]> {
  const [collectionEntries, searchIndexes] = await Promise.all([
    Promise.all(
      scope.collections.map((col) =>
        buildCollectionEntry(cluster, bucketName, scope.name, col, indexOptions)
      )
    ),
    getScopeSearchIndexes(cluster, bucketName, scope.name),
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

/**
 * Scope level search indexes only exist since server 7.6 - older servers answer the
 * management endpoint with a 404, which the SDK reports as `FeatureNotAvailableError`.
 * Such a cluster simply has no scope search index to report.
 */
async function getScopeSearchIndexes(
  cluster: AnyCluster,
  bucketName: string,
  scopeName: string
): Promise<SearchIndex[]> {
  try {
    return await cluster
      .bucket(bucketName)
      .scope(scopeName)
      .searchIndexes()
      .getAllIndexes();
  } catch (err) {
    if (err instanceof FeatureNotAvailableError) return [];
    throw err;
  }
}

async function buildCollectionEntry(
  cluster: AnyCluster,
  bucketName: string,
  scopeName: string,
  col: CollectionSpec,
  indexOptions: IndexOptionsMap
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
      secondaryIndexes.map((qi) => [
        qi.name,
        toQueryIndexConfig(
          qi,
          indexOptions.get(indexOptionsKey(bucketName, scopeName, col.name, qi.name))
        ),
      ])
    );
  }

  return [col.name, config];
}

function toQueryIndexConfig(
  qi: { indexKey: string[]; condition?: string },
  withClause: QueryIndexWithClause | undefined
): CouchbaseClusterCollectionIndexConfig {
  const config: CouchbaseClusterCollectionIndexConfig = {
    keys: qi.indexKey,
  };

  if (qi.condition) {
    config.where = qi.condition;
  }

  if (withClause) {
    config.with = withClause;

    if (withClause.num_replica !== undefined) {
      config.numReplicas = withClause.num_replica;
    }
  }

  return config;
}

type IndexOptionsMap = Map<string, QueryIndexWithClause>;

type SystemIndexRow = {
  name: string;
  bucket_id?: string;
  scope_id?: string;
  keyspace_id: string;
  with?: QueryIndexWithClause;
};

function indexOptionsKey(
  bucket: string,
  scope: string,
  collection: string,
  indexName: string
) {
  return `${bucket}/${scope}/${collection}/${indexName}`;
}

/**
 * The `WITH` options are not exposed by the index manager, so `system:indexes` is queried directly.
 */
async function getIndexOptions(
  cluster: AnyCluster,
  bucketNames: string[]
): Promise<IndexOptionsMap> {
  if (bucketNames.length === 0) return new Map();

  const { rows } = await cluster.query<SystemIndexRow>(
    'SELECT i.name, i.bucket_id, i.scope_id, i.keyspace_id, i.`with` ' +
      'FROM system:indexes AS i ' +
      'WHERE i.bucket_id IN $buckets OR (i.bucket_id IS MISSING AND i.keyspace_id IN $buckets)',
    { parameters: { buckets: bucketNames } }
  );

  const indexOptions: IndexOptionsMap = new Map();

  for (const row of rows) {
    if (!row.with) continue;

    // Indexes of the default collection are reported without `bucket_id`/`scope_id`.
    const bucket = row.bucket_id ?? row.keyspace_id;
    const scope = row.scope_id ?? '_default';
    const collection = row.bucket_id ? row.keyspace_id : '_default';

    indexOptions.set(indexOptionsKey(bucket, scope, collection, row.name), row.with);
  }

  return indexOptions;
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
