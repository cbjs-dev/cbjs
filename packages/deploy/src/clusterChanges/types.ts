import {
  IBucketSettings,
  ICreateBucketSettings,
  IUser,
  UpdateBucketSettings,
} from '@cbjsdev/cbjs';

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
  | CouchbaseClusterChangeRecreateUser
  | CouchbaseClusterChangeDropUser;

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
};

export type CouchbaseClusterChangeCreateUser = {
  type: 'createUser';
  user: IUser & { domain: string };
};

export type CouchbaseClusterChangeUpdateUser = {
  type: 'updateUser';
  user: IUser & { domain: string };
};

export type CouchbaseClusterChangeRecreateUser = {
  type: 'recreateUser';
  user: IUser & { domain: string };
};

export type CouchbaseClusterChangeDropUser = {
  type: 'dropUser';
  user: IUser & { domain: string };
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
};

export type CouchbaseClusterCollectionConfig = {
  maxExpiry?: number;
  history?: boolean;
  indexes?: Record<string, CouchbaseClusterCollectionIndexConfig>;
};

export type CouchbaseClusterCollectionIndexConfig = {
  keys: string[];
  where?: string;
  numReplicas?: number;
};
