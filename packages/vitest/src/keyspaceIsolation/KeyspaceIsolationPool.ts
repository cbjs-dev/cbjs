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
import { Cluster, connect } from '@cbjsdev/cbjs';
import {
  getConnectionParams,
  invariant,
  keyspacePath,
  PartialKeyspace,
} from '@cbjsdev/shared';

import { getTaskAsyncContext } from '../asyncContext';
import { flushLogger, getTestLogger } from '../logger';
import { KeyspaceIsolationRealm } from './KeyspaceIsolationRealm';
import { runWithoutKeyspaceIsolation } from './runWithoutKeyspaceIsolation';

/*

a suite starts, it has its isolation config (scope + level)

when a query comes in, we get all the keyspaces to isolate
assuming a collection-level of isolation,

we take from available scopes and collections, create more if needed and possible, and assign them to the current isolation scope

 */

type ProvisionedBucket = {
  name: string;
  exclusive?: boolean;
  allocatedToRealms: Set<KeyspaceIsolationRealm>;
  readiness: Promise<void>;
};

type ProvisionedKeyspace = {
  name: string;
  allocatedToRealm?: KeyspaceIsolationRealm;
  readiness: Promise<void>;
};

export class KeyspaceIsolationPool {
  protected clusterPromise?: Promise<Cluster>;

  /**
   * Contains names of real/isolated keyspaces.
   *
   * <bucket, <scope, collection[]>>
   */
  public readonly provisionedKeyspaces = new Map<
    ProvisionedBucket,
    Map<ProvisionedKeyspace, ProvisionedKeyspace[]>
  >();

  async requireKeyspaceIsolation<T extends PartialKeyspace>(
    taskId: string,
    requestedKeyspace: T
  ): Promise<T> {
    try {
      const { keyspaceIsolationRealm: realm, keyspaceIsolationLevel } =
        getTaskAsyncContext(taskId);
      invariant(realm, `No keyspace realm exist for task '${taskId}'.`);

      if (realm.isKeyspaceIsolated(requestedKeyspace)) {
        return realm.getIsolatedKeyspaceNames(requestedKeyspace) as T;
      }

      this.requireBucketIsolation(
        realm,
        requestedKeyspace,
        keyspaceIsolationLevel === 'bucket'
      );

      if (requestedKeyspace.scope) this.requireScopeIsolation(realm, requestedKeyspace);
      if (requestedKeyspace.collection)
        this.requireCollectionIsolation(realm, requestedKeyspace);

      const isolatedKeyspace = realm.getIsolatedKeyspaceNames(requestedKeyspace) as T;

      let readiness: Promise<void> = this.getProvisionedBucket(
        isolatedKeyspace.bucket
      ).readiness;

      if (isolatedKeyspace.scope) {
        const isolatedScope = this.getProvisionedScope(
          isolatedKeyspace.bucket,
          isolatedKeyspace.scope
        );
        readiness = isolatedScope.readiness;
      }

      if (isolatedKeyspace.collection) {
        const isolatedCollection = this.getProvisionedCollection(
          isolatedKeyspace.bucket,
          isolatedKeyspace.scope,
          isolatedKeyspace.collection
        );

        readiness = isolatedCollection.readiness;
      }

      try {
        await readiness;
      } catch (err) {
        getTestLogger()?.error('An error occurred while awaiting for the keyspace.');
      }

      return isolatedKeyspace;
    } catch (err) {
      invariant(err instanceof Error);
      throw new Error(`requireKeyspaceIsolation failed with : ${err.message}`);
    }
  }

  protected requireBucketIsolation(
    realm: KeyspaceIsolationRealm,
    requestedKeyspace: PartialKeyspace,
    exclusiveBucket: boolean
  ) {
    if (realm.isBucketIsolated(requestedKeyspace.bucket)) {
      return;
    }

    let provisionedBucket = this.getAvailableBucket(exclusiveBucket);

    if (provisionedBucket === undefined) {
      const newBucketIsolatedName = KeyspaceIsolationRealm.createIsolatedName(
        requestedKeyspace.bucket
      );

      this.provisionBucket(newBucketIsolatedName);
      provisionedBucket = this.getProvisionedBucket(newBucketIsolatedName);
    }

    invariant(provisionedBucket);
    provisionedBucket.allocatedToRealms.add(realm);
    provisionedBucket.exclusive = exclusiveBucket;

    realm.setIsolatedBucketName(requestedKeyspace.bucket, provisionedBucket.name);
  }

  protected requireScopeIsolation(
    realm: KeyspaceIsolationRealm,
    requestedKeyspace: PartialKeyspace
  ) {
    invariant(requestedKeyspace.scope);

    if (realm.isScopeIsolated(requestedKeyspace.bucket, requestedKeyspace.scope)) {
      return;
    }

    const isolatedBucketName = realm.getIsolatedBucketName(requestedKeyspace.bucket);
    invariant(isolatedBucketName);

    let provisionedScope = this.getAvailableScope(isolatedBucketName);

    if (provisionedScope === undefined) {
      const newScopeIsolatedName = KeyspaceIsolationRealm.createIsolatedName(
        requestedKeyspace.scope
      );

      this.provisionScope(isolatedBucketName, newScopeIsolatedName);
      provisionedScope = this.getProvisionedScope(
        isolatedBucketName,
        newScopeIsolatedName
      );
    }

    invariant(provisionedScope);
    provisionedScope.allocatedToRealm = realm;

    realm.setIsolatedScopeName(
      requestedKeyspace.bucket,
      requestedKeyspace.scope,
      provisionedScope.name
    );
  }

  protected requireCollectionIsolation(
    realm: KeyspaceIsolationRealm,
    requestedKeyspace: PartialKeyspace
  ) {
    invariant(requestedKeyspace.collection);

    if (
      realm.isCollectionIsolated(
        requestedKeyspace.bucket,
        requestedKeyspace.scope,
        requestedKeyspace.collection
      )
    ) {
      return;
    }

    const isolatedBucketName = realm.getIsolatedBucketName(requestedKeyspace.bucket);
    invariant(isolatedBucketName);

    const isolatedScopeName = realm.getIsolatedScopeName(
      requestedKeyspace.bucket,
      requestedKeyspace.scope
    );
    invariant(isolatedScopeName);

    let provisionedCollection = this.getAvailableCollection(
      isolatedBucketName,
      isolatedScopeName
    );

    if (provisionedCollection === undefined) {
      const newCollectionIsolatedName = KeyspaceIsolationRealm.createIsolatedName(
        requestedKeyspace.collection
      );

      this.provisionCollection(
        isolatedBucketName,
        isolatedScopeName,
        newCollectionIsolatedName
      );
      provisionedCollection = this.getProvisionedCollection(
        isolatedBucketName,
        isolatedScopeName,
        newCollectionIsolatedName
      );
    }

    invariant(provisionedCollection);
    provisionedCollection.allocatedToRealm = realm;

    realm.setIsolatedCollectionName(
      requestedKeyspace.bucket,
      requestedKeyspace.scope,
      requestedKeyspace.collection,
      provisionedCollection.name
    );
  }

  /**
   * Create a bucket and declare it in the map.
   *
   * @param bucket Isolated bucket name.
   */
  provisionBucket(bucket: string) {
    const bucketCreation = this.getCluster().then((cluster) => {
      return runWithoutKeyspaceIsolation(() => {
        return cluster
          .buckets()
          .createBucket({
            name: bucket,
            ramQuotaMB: 256,
            storageBackend: 'couchstore',
            numReplicas: 0,
            replicaIndexes: false,
            compressionMode: 'off',
            evictionPolicy: 'valueOnly',
            minimumDurabilityLevel: 'none',
          })
          .catch((err) => {
            invariant(err instanceof Error);
            getTestLogger()?.error(err.message);
          });
      });
    });

    this.provisionedKeyspaces.set(
      {
        name: bucket,
        allocatedToRealms: new Set(),
        exclusive: undefined,
        readiness: bucketCreation,
      },
      new Map()
    );
  }

  /**
   * Create a scope and declare it in the map.
   *
   * @param bucket Isolated bucket name.
   * @param scope Isolated scope name.
   */
  provisionScope(bucket: string, scope: string) {
    const provisionedBucket = this.getProvisionedBucket(bucket);

    if (!provisionedBucket) {
      throw new Error(
        `trying to provision scope "${scope}" in bucket "${bucket}" but the bucket is not provisioned.`
      );
    }

    const scopeCreation = provisionedBucket.readiness.then(async () => {
      const cluster = await this.getCluster();
      return await runWithoutKeyspaceIsolation(() =>
        cluster.bucket(bucket).collections().createScope(scope)
      );
    });

    provisionedBucket.scopes.set(
      {
        name: scope,
        allocatedToRealm: undefined,
        readiness: scopeCreation,
      },
      []
    );
  }

  /**
   * Create a collection and declare it in the map.
   *
   * @param bucket Isolated bucket name.
   * @param scope Isolated scope name.
   * @param collection Isolated collection name.
   */
  provisionCollection(bucket: string, scope: string, collection: string) {
    const provisionedScope = this.getProvisionedScope(bucket, scope);

    if (!provisionedScope) {
      throw new Error(
        `trying to provision collection ${collection} in "${keyspacePath(bucket, scope)}" but the scope is not provisioned.`
      );
    }

    const collectionCreation = provisionedScope.readiness.then(async () => {
      const cluster = await this.getCluster();
      return await runWithoutKeyspaceIsolation(() =>
        cluster.bucket(bucket).collections().createCollection({
          name: collection,
          scopeName: scope,
        })
      );
    });

    provisionedScope.collections.push({
      name: collection,
      allocatedToRealm: undefined,
      readiness: collectionCreation,
    });
  }

  async getCluster() {
    if (!this.clusterPromise) {
      const params = getConnectionParams();
      this.clusterPromise = connect(params.connectionString, params.credentials);
    }

    return await this.clusterPromise;
  }

  getAvailableBucket(exclusive: boolean) {
    for (const [provisionedBucket] of this.provisionedKeyspaces) {
      if (!exclusive) {
        return provisionedBucket;
      }

      if (exclusive && provisionedBucket.allocatedToRealms.size === 0) {
        return provisionedBucket;
      }
    }
  }

  getProvisionedBucket(bucket: string) {
    for (const [bucketStatus, scopes] of this.provisionedKeyspaces) {
      if (bucketStatus.name === bucket)
        return {
          ...bucketStatus,
          scopes,
        };
    }

    throw new Error(`bucket ${keyspacePath(bucket)} is not provisioned.`);
  }

  getAvailableScope(bucket: string) {
    for (const [bucketStatus, bucketScopes] of this.provisionedKeyspaces) {
      if (bucketStatus.name !== bucket) continue;

      for (const [provisionedScope] of bucketScopes) {
        if (provisionedScope.allocatedToRealm === undefined) return provisionedScope;
      }
    }
  }

  getProvisionedScope(bucket: string, scope: string) {
    for (const [provisionedBucket, bucketScopes] of this.provisionedKeyspaces) {
      if (provisionedBucket.name !== bucket) continue;

      for (const [provisionedScope, collections] of bucketScopes) {
        if (provisionedScope.name === scope) {
          return {
            ...provisionedScope,
            collections,
          };
        }
      }
    }

    throw new Error(`scope ${keyspacePath(bucket, scope)} is not provisioned.`);
  }

  getAvailableCollection(bucket: string, scope: string) {
    for (const [bucketStatus, bucketScopes] of this.provisionedKeyspaces) {
      if (bucketStatus.name !== bucket) continue;

      for (const [provisionedScope, scopeCollections] of bucketScopes) {
        if (provisionedScope.name !== scope) continue;

        for (const scopeCollection of scopeCollections) {
          if (scopeCollection.allocatedToRealm === undefined) return scopeCollection;
        }
      }
    }
  }

  getProvisionedCollection(bucket: string, scope: string, collection: string) {
    for (const [bucketStatus, bucketScopes] of this.provisionedKeyspaces) {
      if (bucketStatus.name !== bucket) continue;

      for (const [provisionedScope, scopeCollections] of bucketScopes) {
        if (provisionedScope.name !== scope) continue;

        for (const scopeCollection of scopeCollections) {
          if (scopeCollection.name === collection) return scopeCollection;
        }
      }
    }

    throw new Error(
      `collection ${keyspacePath(bucket, scope, collection)} is not provisioned.`
    );
  }

  releaseRealmAllocations(realm: KeyspaceIsolationRealm) {
    getTestLogger()?.debug(
      `Release allocation check for realm.rootTaskId: ${realm.rootTaskId}`
    );
    for (const [provisionedBucket, bucketScopes] of this.provisionedKeyspaces) {
      if (!provisionedBucket.allocatedToRealms.has(realm)) continue;

      getTestLogger()?.trace(
        `Bucket '${provisionedBucket.name}' is allocated to the realm, removing.`
      );
      provisionedBucket.allocatedToRealms.delete(realm);

      if (provisionedBucket.allocatedToRealms.size === 0 && provisionedBucket.exclusive) {
        getTestLogger()?.debug(
          `Bucket '${provisionedBucket.name}' no longer allocated to any realm, resetting 'exclusive' boolean.`
        );
        provisionedBucket.exclusive = undefined;
      }

      for (const [provisionedScope, provisionedCollections] of bucketScopes) {
        if (provisionedScope.allocatedToRealm !== realm) continue;

        getTestLogger()?.trace(
          `Scope '${provisionedScope.name}' is allocated to the realm, removing.`
        );
        provisionedScope.allocatedToRealm = undefined;

        for (const provisionedCollection of provisionedCollections) {
          if (provisionedCollection.allocatedToRealm !== realm) continue;

          getTestLogger()?.trace(
            `Collection '${provisionedCollection.name}' is allocated to the realm, removing.`
          );
          provisionedCollection.allocatedToRealm = undefined;
        }
      }
    }
  }

  private async destroyProvisionedBuckets() {
    if (this.clusterPromise === undefined) {
      return;
    }

    const cluster = await this.getCluster();
    const bucket = Array.from(this.provisionedKeyspaces.keys()).map((ksp) => ksp.name);

    await runWithoutKeyspaceIsolation(() =>
      Promise.all(bucket.map((b) => cluster.buckets().dropBucket(b)))
    );

    getTestLogger()?.trace(`Provisioned buckets dropped : ${bucket.join(', ')}.`);
  }

  async dispose() {
    getTestLogger()?.debug('KeyspaceIsolationPool.dispose.');
    await flushLogger();

    if (this.clusterPromise === undefined) {
      return;
    }

    const cluster = await this.getCluster();
    await this.destroyProvisionedBuckets();
    await cluster.close();

    await flushLogger();
  }
}
