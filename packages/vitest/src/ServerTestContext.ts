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
import {
  AnyCollection,
  Bucket,
  Cluster,
  Collection,
  ConnectOptions,
  CouchbaseClusterTypes,
  DefaultClusterTypes,
  DefaultCollection,
  DefaultScope,
  Scope,
  connect,
} from '@cbjs/cbjs';
import { waitForBucket, waitForCollection } from '@cbjs/http-client';
import { CouchbaseLogger, Keyspace, invariant, keyspacePath, sleep } from '@cbjs/shared';
import { ConnectionParams, getApiConfig, getConnectionParams } from '@cbjs/shared';

import { getTestLogger } from './logger';
import { getRandomId } from './utils/getRandomId';

export class ServerTestContext {
  public readonly contextNamespace: string;
  private keyCounter: number;

  private contextKeyspace: {
    cluster?: Cluster<DefaultClusterTypes>;
    bucket?: Bucket<DefaultClusterTypes, string>;
    scope?: DefaultScope<DefaultClusterTypes, string>;
    collection?: Collection<DefaultClusterTypes, string, '_default', string>;
    defaultCollection?: DefaultCollection<DefaultClusterTypes, string>;
  } = {};

  private setupPromise?: Promise<this> = undefined;
  private readonly connections: Cluster[] = [];
  public readonly logger: CouchbaseLogger | undefined;

  constructor() {
    this.contextNamespace = getRandomId();
    this.keyCounter = 0;
    this.logger = getTestLogger();
  }

  newUid() {
    return `${this.contextNamespace}_${this.keyCounter++}`;
  }

  /**
   * Return a new connection that will be closed automatically during teardown.
   */
  async newConnection(
    params?: ConnectionParams,
    opts: Omit<ConnectOptions, 'username' | 'password'> = {}
  ) {
    // The NAPI contains a bug leading to frozen connection if one is create while the previous one is not established yet
    if (this.connections.length > 0) {
      await sleep(200);
    }

    const localParams = params || getConnectionParams();
    const defaultOpts = {
      // configProfile: 'wanDevelopment',
    } satisfies ConnectOptions;

    const cluster = await connect(localParams.connectionString, {
      username: localParams.credentials.username,
      password: localParams.credentials.password,
      ...defaultOpts,
      ...opts,
    });

    this.connections.push(cluster);
    return cluster;
  }

  async start() {
    if (!this.setupPromise) {
      this.setupPromise = this.setup();
    }

    return this.setupPromise;
  }

  private async setup() {
    this.logger?.trace(`setup of '${this.contextNamespace}' started`);
    const apiConfig = getApiConfig();
    const cluster = await this.newConnection();
    const bucketName = this.contextNamespace;
    const collectionName = this.newUid();

    this.logger?.trace(
      `creating context keyspace : '${bucketName}._default.${collectionName}'`
    );

    await cluster.buckets().createBucket({
      name: bucketName,
      ramQuotaMB: 256,
      storageBackend: 'couchstore',
      numReplicas: 0,
      replicaIndexes: false,
      compressionMode: 'off',
      evictionPolicy: 'valueOnly',
      minimumDurabilityLevel: 'none',
    });

    this.logger?.trace(`waiting for bucket: '${bucketName}'`);
    await waitForBucket(apiConfig, bucketName);

    await cluster
      .bucket(bucketName)
      .collections()
      .createCollection(collectionName, Scope.DEFAULT_NAME);

    this.logger?.trace(
      `waiting for collection: '${bucketName}._default.${collectionName}'`
    );
    await waitForCollection(apiConfig, bucketName, Scope.DEFAULT_NAME, collectionName);

    this.contextKeyspace.cluster = cluster;
    this.contextKeyspace.bucket = cluster.bucket(bucketName);
    this.contextKeyspace.scope = cluster.bucket(bucketName).scope(Scope.DEFAULT_NAME);
    this.contextKeyspace.collection = cluster
      .bucket(bucketName)
      .collection(collectionName);
    this.contextKeyspace.defaultCollection = cluster
      .bucket(bucketName)
      .defaultCollection();

    this.logger?.trace(`setup of '${this.contextNamespace}' completed`);

    return this;
  }

  async cleanup() {
    this.logger?.debug('dropping context bucket');

    // We create a new connection to drop the bucket, because the test may have closed it.
    const cleanupConnection = await this.newConnection();

    await cleanupConnection.buckets().dropBucket(this.bucket.name);
    await waitForBucket(getApiConfig(), this.bucket.name, { expectMissing: true });

    this.logger?.trace('closing connections');
    await Promise.allSettled(this.connections.map((c) => c.close()));

    this.contextKeyspace.cluster = undefined;
    this.contextKeyspace.bucket = undefined;
    this.contextKeyspace.scope = undefined;
    this.contextKeyspace.collection = undefined;
    this.contextKeyspace.defaultCollection = undefined;
  }

  getKeyspace(): Keyspace {
    invariant(this.contextKeyspace.bucket, 'Bucket should already be set');
    invariant(this.contextKeyspace.scope, 'Scope should already be set');
    invariant(this.contextKeyspace.collection, 'Collection should already be set');

    return {
      bucket: this.contextKeyspace.bucket.name,
      scope: this.contextKeyspace.scope.name,
      collection: this.contextKeyspace.collection.name,
    };
  }

  getKeyspacePath() {
    return keyspacePath(this.getKeyspace());
  }

  get cluster() {
    invariant(this.contextKeyspace.cluster, 'Cluster should already be set');
    return this.contextKeyspace.cluster;
  }

  get c() {
    invariant(this.contextKeyspace.cluster, 'Cluster should already be set');
    return this.contextKeyspace.cluster;
  }

  get bucket() {
    invariant(this.contextKeyspace.bucket, 'Bucket should already be set');
    return this.contextKeyspace.bucket;
  }

  get b() {
    invariant(this.contextKeyspace.bucket, 'Bucket should already be set');
    return this.contextKeyspace.bucket;
  }

  get scope() {
    invariant(this.contextKeyspace.scope, 'Scope should already be set');
    return this.contextKeyspace.scope;
  }

  get s() {
    invariant(this.contextKeyspace.scope, 'Scope should already be set');
    return this.contextKeyspace.scope;
  }

  get collection(): AnyCollection {
    invariant(this.contextKeyspace.collection, 'Collection should already be set');
    return this.contextKeyspace.collection;
  }

  get co(): AnyCollection {
    invariant(this.contextKeyspace.collection, 'Collection should already be set');
    return this.contextKeyspace.collection;
  }

  get defaultCollection(): DefaultCollection<CouchbaseClusterTypes, string> {
    invariant(
      this.contextKeyspace.defaultCollection,
      'Default collection should already be set'
    );
    return this.contextKeyspace.defaultCollection;
  }

  get dco(): DefaultCollection<CouchbaseClusterTypes, string> {
    invariant(
      this.contextKeyspace.defaultCollection,
      'Default collection should already be set'
    );
    return this.contextKeyspace.defaultCollection;
  }
}
