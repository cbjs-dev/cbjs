import {
  IBucketSettings,
  ICreateBucketSettings,
  ISearchIndex,
  IUser,
  UpdateBucketSettings,
} from '@cbjsdev/cbjs';
import { QueryIndexWithClause } from '@cbjsdev/shared';

export type CouchbaseClusterChange =
  | CouchbaseClusterChangeCreateBucket
  | CouchbaseClusterChangeUpdateBucket
  | CouchbaseClusterChangeRecreateBucket
  | CouchbaseClusterChangeDropBucket
  | CouchbaseClusterChangeCreateScope
  | CouchbaseClusterChangeDropScope
  | CouchbaseClusterChangeCreateCollection
  | CouchbaseClusterChangeUpdateCollection
  | CouchbaseClusterChangeDropCollection
  | CouchbaseClusterChangeCreateIndex
  | CouchbaseClusterChangeDropIndex
  | CouchbaseClusterChangeRecreateIndex
  | CouchbaseClusterChangeUpdateIndex
  | CouchbaseClusterChangeCreateUser
  | CouchbaseClusterChangeUpdateUser
  | CouchbaseClusterChangeUpdateUserPassword
  | CouchbaseClusterChangeRecreateUser
  | CouchbaseClusterChangeDropUser
  | CouchbaseClusterChangeCreateSearchIndex
  | CouchbaseClusterChangeUpdateSearchIndex
  | CouchbaseClusterChangeDropSearchIndex;

export type CouchbaseClusterChangeCreateBucket = {
  type: 'createBucket';
  config: ICreateBucketSettings;
};

export type CouchbaseClusterChangeUpdateBucket = {
  type: 'updateBucket';
  config: UpdateBucketSettings;
};

export type CouchbaseClusterChangeRecreateBucket = {
  type: 'recreateBucket';
  config: ICreateBucketSettings;
};

export type CouchbaseClusterChangeDropBucket = {
  type: 'dropBucket';
  name: string;
};

export type CouchbaseClusterChangeCreateScope = {
  type: 'createScope';
  bucket: string;
  name: string;
};

export type CouchbaseClusterChangeDropScope = {
  type: 'dropScope';
  bucket: string;
  name: string;
};

export type CouchbaseClusterChangeCreateCollection = {
  type: 'createCollection';
  name: string;
  bucket: string;
  scope: string;
  maxExpiry?: number;
  history?: boolean;
};

export type CouchbaseClusterChangeUpdateCollection = {
  type: 'updateCollection';
  name: string;
  bucket: string;
  scope: string;
  maxExpiry?: number;
  history?: boolean;
};

export type CouchbaseClusterChangeDropCollection = {
  type: 'dropCollection';
  name: string;
  bucket: string;
  scope: string;
};

export type CouchbaseClusterChangeCreateIndex = {
  type: 'createIndex';
  name: string;
  bucket: string;
  scope: string;
  collection: string;
  keys: string[];
  where?: string;
  numReplicas?: number;
  with?: QueryIndexWithClause;
};

export type CouchbaseClusterChangeDropIndex = {
  type: 'dropIndex';
  name: string;
  bucket: string;
  scope: string;
  collection: string;
};

export type CouchbaseClusterChangeUpdateIndex = {
  type: 'updateIndex';
  name: string;
  bucket: string;
  scope: string;
  collection: string;
  keys: string[];
  where?: string;
  numReplicas?: number;
  with?: QueryIndexWithClause;
};

export type CouchbaseClusterChangeRecreateIndex = {
  type: 'recreateIndex';
  name: string;
  bucket: string;
  scope: string;
  collection: string;
  keys: string[];
  where?: string;
  numReplicas?: number;
  with?: QueryIndexWithClause;
};

export type CouchbaseClusterChangeCreateUser = {
  type: 'createUser';
  user: IUser & { domain: string };
};

export type CouchbaseClusterChangeUpdateUser = {
  type: 'updateUser';
  user: IUser & { domain: string };
};

export type CouchbaseClusterChangeUpdateUserPassword = {
  type: 'updateUserPassword';
  username: string;
  password: string;
  newPassword: string;
};

export type CouchbaseClusterChangeRecreateUser = {
  type: 'recreateUser';
  user: IUser & { domain: string };
};

export type CouchbaseClusterChangeDropUser = {
  type: 'dropUser';
  user: IUser & { domain: string };
};

export type CouchbaseClusterChangeCreateSearchIndex = {
  type: 'createSearchIndex';
  bucket: string;
  scope: string;
  /**
   * The config alias for the search index.
   */
  name: string;
  configFn: CouchbaseClusterSearchIndexConfig;
  config: ReturnType<CouchbaseClusterSearchIndexConfig>;
};

export type CouchbaseClusterChangeUpdateSearchIndex = {
  type: 'updateSearchIndex';
  bucket: string;
  scope: string;
  /**
   * The config alias for the search index.
   */
  name: string;
  configFn: CouchbaseClusterSearchIndexConfig;
  config: ReturnType<CouchbaseClusterSearchIndexConfig>;
};

export type CouchbaseClusterChangeDropSearchIndex = {
  type: 'dropSearchIndex';
  bucket: string;
  scope: string;
  /**
   * The config alias for the search index.
   */
  name: string;
  /**
   * The actual index name on the cluster.
   */
  indexName: string;
};

export type CouchbaseClusterConfig = {
  /**
   * The users in your cluster.
   * If the password property is set during an update, a user update will systematically be triggered.
   */
  users: Array<IUser & { domain?: string }>;
  keyspaces: Record<string, CouchbaseClusterBucketConfig>;
};

export type CouchbaseClusterBucketConfig = Omit<IBucketSettings, 'name'> & {
  scopes: Record<string, CouchbaseClusterScopeConfig>;
};

export type CouchbaseClusterScopeConfig = {
  collections: Record<string, CouchbaseClusterCollectionConfig>;
  searchIndexes?: Record<string, CouchbaseClusterSearchIndexConfig>;
};

export type CouchbaseClusterCollectionConfig = {
  maxExpiry?: number;
  history?: boolean;
  indexes?: Record<string, CouchbaseClusterCollectionIndexConfig>;
};

export type CouchbaseClusterCollectionIndexConfig = {
  /**
   * The indexed expressions.
   *
   * Modifiers are supported : `myArray VECTOR`, `title INCLUDE MISSING DESC`, ...
   */
  keys: string[];

  /**
   * Only index the documents matching this predicate.
   */
  where?: string;

  /**
   * Number of replicas of the index.
   *
   * Takes precedence over `with.num_replica`. Either way, a change of the number of
   * replicas is applied with `ALTER INDEX`, without recreating the index.
   */
  numReplicas?: number;

  /**
   * Options of the `WITH` clause, such as the vector index options.
   *
   * Only the options declared here are compared against the cluster : the server
   * reports its own defaults, which would otherwise be seen as a change on every deployment.
   * A change requires the index to be recreated.
   *
   * @example
   * {
   *   keys: ['`scope`.`organizationId`', 'sourceCollection', '`vector` VECTOR'],
   *   with: { dimension: 768, similarity: 'DOT', description: 'IVF,SQ8' },
   * }
   */
  with?: QueryIndexWithClause;
};

export type CouchbaseClusterSearchIndexConfig = (sourceParams: {
  /**
   * The name of the bucket hosting to the index.
   */
  sourceName: string;
  /**
   * Alias for `sourceName`.
   */
  bucketName: string;

  /**
   * The index's scope.
   */
  scopeName: string;
}) => ISearchIndex;
