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
import { promisify } from 'node:util';
import { retry } from 'ts-retry-promise';

import { Cluster, connect, ICreateBucketSettings } from '@cbjsdev/cbjs';
import { waitForQueryIndex } from '@cbjsdev/http-client';
import {
  getConnectionParams,
  invariant,
  keyspacePath,
  PartialKeyspace,
} from '@cbjsdev/shared';

import {
  defaultBucketSettingsSymbol,
  getCbjsContextTracking,
} from '../asyncContext/getCbjsContextTracking.js';
import { getTaskAsyncContext } from '../asyncContext/getTaskAsyncContext.js';
import { getTaskLogger } from '../asyncContext/getTaskLogger.js';
import { flushLogger } from '../logger.js';
import { getIndexName } from '../parser/getIndexName.js';
import { getQueryKeyspaces } from '../parser/index.js';
import { getKeyspaceIndexes } from './getKeyspaceIndexes.js';
import { KeyspaceIsolationRealm } from './KeyspaceIsolationRealm.js';
import { replaceKeyspaces } from './proxyFunctions/query.js';
import { runWithoutKeyspaceIsolation } from './runWithoutKeyspaceIsolation.js';

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

/**
 * name: index name, or null in case of a primary index without name
 */
type ProvisionedIndex = {
  name: string | null;
  readiness: Promise<void>;
};

export class KeyspaceIsolationPool {
  protected clusterPromise?: Promise<Cluster>;

  /**
   * Contains provisioned keyspaces.
   *
   * <bucket, <scope, collection[]>>
   */
  public readonly provisionedKeyspaces = new Map<
    ProvisionedBucket,
    Map<ProvisionedKeyspace, ProvisionedKeyspace[]>
  >();

  /**
   * Contains indexes created per keyspace path.
   */
  public readonly provisionedIndexes = new Map<string, ProvisionedIndex[]>();

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
        getTaskLogger()?.error(
          'An error occurred while awaiting for the keyspace: \n%o',
          err
        );

        throw err;
      }

      return isolatedKeyspace;
    } catch (err) {
      // invariant(err instanceof Error);
      throw new Error(`requireKeyspaceIsolation failed with : ${err}`);
    }
  }

  protected requireBucketIsolation(
    realm: KeyspaceIsolationRealm,
    requestedKeyspace: PartialKeyspace,
    exclusiveBucket: boolean
  ): void {
    if (realm.isBucketIsolated(requestedKeyspace.bucket)) {
      return;
    }

    let provisionedBucket = this.getAvailableBucket(exclusiveBucket);

    if (provisionedBucket === undefined) {
      const newBucketIsolatedName = KeyspaceIsolationRealm.createIsolatedName(
        requestedKeyspace.bucket
      );

      const { bucketsSettings } = getCbjsContextTracking();
      const bucketSettings = bucketsSettings.has(requestedKeyspace.bucket)
        ? bucketsSettings.get(requestedKeyspace.bucket)
        : bucketsSettings.get(defaultBucketSettingsSymbol);

      this.provisionBucket(
        newBucketIsolatedName,
        bucketSettings as ICreateBucketSettings
      );
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
  ): void {
    invariant(requestedKeyspace.scope);

    if (realm.isScopeIsolated(requestedKeyspace.bucket, requestedKeyspace.scope)) {
      return;
    }

    const isolatedBucketName = realm.getIsolatedBucketName(requestedKeyspace.bucket);
    invariant(isolatedBucketName);

    // let provisionedScope = this.getAvailableScope(isolatedBucketName);

    const newScopeIsolatedName = KeyspaceIsolationRealm.createIsolatedName(
      requestedKeyspace.scope
    );

    this.provisionScope(isolatedBucketName, newScopeIsolatedName);
    const provisionedScope = this.getProvisionedScope(
      isolatedBucketName,
      newScopeIsolatedName
    );

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
  ): void {
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

    const newCollectionIsolatedName = KeyspaceIsolationRealm.createIsolatedName(
      requestedKeyspace.collection
    );

    this.provisionCollection(
      isolatedBucketName,
      isolatedScopeName,
      newCollectionIsolatedName
    );

    const provisionedCollection = this.getProvisionedCollection(
      isolatedBucketName,
      isolatedScopeName,
      newCollectionIsolatedName
    );

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
  provisionBucket(bucket: string, bucketSettings: Omit<ICreateBucketSettings, 'name'>) {
    const bucketCreation = this.getCluster().then((cluster) => {
      return runWithoutKeyspaceIsolation(() => {
        return cluster
          .buckets()
          .createBucket({
            ...bucketSettings,
            name: bucket,
          })
          .then(() => {
            const openBucket = promisify(cluster.conn.openBucket).bind(cluster.conn);
            return openBucket(bucket);
          })
          .catch((err) => {
            invariant(err instanceof Error);
            getTaskLogger()?.error('Provision bucket "%s" failed: %s', bucket, err);
            throw err;
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
      getTaskLogger()?.trace(
        'KeyspaceIsolationPool: clusterPromise is missing, creating a connection.'
      );

      const params = getConnectionParams();
      this.clusterPromise = connect(params.connectionString, params.credentials);

      getTaskLogger()?.trace('KeyspaceIsolationPool: connection created.');
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

  async requireIndexes(taskId: string, keyspace: PartialKeyspace) {
    const { keyspaceIsolationRealm: realm } = getTaskAsyncContext(taskId);
    invariant(realm, `No keyspace realm exist for task '${taskId}'.`);

    const isolatedKeyspace = realm.getIsolatedKeyspaceNames(keyspace);
    invariant(
      isolatedKeyspace,
      `Required to create indexes for keyspace "${keyspacePath(keyspace)}" but it is not provisioned.`
    );

    const ksPath = keyspacePath(isolatedKeyspace);

    if (!this.provisionedIndexes.has(ksPath)) {
      this.provisionedIndexes.set(ksPath, []);
    }

    const ksIndexes = this.provisionedIndexes.get(ksPath);
    invariant(ksIndexes);

    const indexStatements = getKeyspaceIndexes(keyspace);

    if (indexStatements.length === 0) {
      getTaskLogger()?.trace(`No index to create for keyspace ${ksPath}`);
      return;
    }

    getTaskLogger()?.trace(
      `Found indexes to be created:\n\t${indexStatements.join('\t')}`
    );

    const indexes = indexStatements.map((statement) => {
      const indexName = getIndexName(statement).indexName;

      if (this.isIndexProvisioned(isolatedKeyspace, indexName)) {
        return [
          indexName,
          this.getProvisionedIndex(isolatedKeyspace, indexName).readiness,
        ];
      }

      this.provisionIndex(isolatedKeyspace, indexName, statement);

      return [indexName, this.getProvisionedIndex(isolatedKeyspace, indexName).readiness];
    });

    getTaskLogger()?.trace(
      `Awaiting creation of indexes: ${indexes.map(([indexName]) => indexName).join(', ')}`
    );

    await Promise.all(indexes.map(([_, readiness]) => readiness));
  }

  provisionIndex(
    isolatedKeyspace: PartialKeyspace,
    indexName: string | null,
    indexStatement: string
  ) {
    const ksPath = keyspacePath(isolatedKeyspace);
    const indexReadiness = retry(
      async () => {
        const cluster = await this.getCluster();
        try {
          const foundKeyspaces = getQueryKeyspaces(indexStatement);
          const patchedStatement = replaceKeyspaces(indexStatement, foundKeyspaces, [
            isolatedKeyspace,
          ]);
          await cluster.query(patchedStatement);
          const bucketName = isolatedKeyspace.bucket;
          const indexesToWatch = indexName ? [indexName] : ['#primary'];
          const options = indexName ? {} : { watchPrimary: true };

          if (isolatedKeyspace.collection) {
            await cluster
              .bucket(bucketName)
              .scope(isolatedKeyspace.scope)
              .collection(isolatedKeyspace.collection)
              .queryIndexes()
              .watchIndexes(indexesToWatch, 10_000, options);
            return;
          }

          await cluster
            .queryIndexes()
            .watchIndexes(bucketName, indexesToWatch, 10_000, options);
        } catch (err) {
          getTaskLogger()?.trace(
            `Failed to create index ${indexName}, will retry.\n%s`,
            err
          );
          throw err;
        }
      },
      {
        timeout: 20_000,
        delay: 250,
        retries: 'INFINITELY',
      }
    );

    if (!this.provisionedIndexes.has(ksPath)) {
      this.provisionedIndexes.set(ksPath, []);
    }

    const ksIndexes = this.provisionedIndexes.get(ksPath);
    invariant(ksIndexes);

    ksIndexes.push({
      name: indexName,
      readiness: indexReadiness,
    });
  }

  isIndexProvisioned(
    isolatedKeyspace: PartialKeyspace,
    indexName: string | null
  ): boolean {
    return (
      this.provisionedIndexes
        .get(keyspacePath(isolatedKeyspace))
        ?.some((i) => i.name === indexName) ?? false
    );
  }

  getProvisionedIndex(
    isolatedKeyspace: PartialKeyspace,
    indexName: string | null
  ): ProvisionedIndex {
    const pi = this.provisionedIndexes
      .get(keyspacePath(isolatedKeyspace))
      ?.find((i) => i.name === indexName);

    invariant(pi, 'Provisioned index not found');
    return pi;
  }

  isKeyspaceProvisioned(keyspace: PartialKeyspace): boolean {
    if (keyspace.collection) {
      return (
        this.getProvisionedCollection(
          keyspace.bucket,
          keyspace.scope,
          keyspace.collection
        ) !== undefined
      );
    }

    if (keyspace.scope) {
      return this.getProvisionedScope(keyspace.bucket, keyspace.scope) !== undefined;
    }

    return this.getProvisionedBucket(keyspace.bucket) !== undefined;
  }

  async releaseRealm(realm: KeyspaceIsolationRealm) {
    getTaskLogger()?.debug(
      `Release allocation check for realm.rootTaskId: ${realm.rootTaskId}`
    );

    /**
     * [bucket, scope]
     */
    const scopesToDelete: [string, string][] = [];

    const keyspacesDeleted: string[] = [];

    for (const [provisionedBucket, bucketScopes] of this.provisionedKeyspaces) {
      if (!provisionedBucket.allocatedToRealms.has(realm)) continue;

      getTaskLogger()?.trace(
        `Bucket '${provisionedBucket.name}' is allocated to the realm, removing.`
      );
      provisionedBucket.allocatedToRealms.delete(realm);

      if (provisionedBucket.allocatedToRealms.size === 0 && provisionedBucket.exclusive) {
        getTaskLogger()?.trace(
          `Bucket "${provisionedBucket.name}" is no longer allocated to any realm, resetting the "exclusive" flag.`
        );
        provisionedBucket.exclusive = undefined;
      }

      for (const [provisionedScope, provisionedCollections] of bucketScopes) {
        if (provisionedScope.allocatedToRealm !== realm) {
          continue;
        }

        provisionedScope.allocatedToRealm = undefined;
        scopesToDelete.push([provisionedBucket.name, provisionedScope.name]);

        for (const pc of provisionedCollections) {
          if (pc.allocatedToRealm !== realm) {
            continue;
          }

          pc.allocatedToRealm = undefined;

          keyspacesDeleted.push(
            keyspacePath(provisionedBucket.name, provisionedScope.name, pc.name)
          );
        }
      }
    }

    keyspacesDeleted.forEach((ks) => {
      this.provisionedIndexes.delete(ks);
    });

    if (scopesToDelete.length > 0) {
      getTaskLogger()?.trace(
        `Scopes allocated to the realm will be deleted : ${scopesToDelete.map(([b, s]) => `"${keyspacePath(b, s)}"`).join(', ')}.`
      );

      const cluster = await this.getCluster();

      await Promise.all(
        scopesToDelete.map(([bucketName, scopeName]) =>
          cluster.bucket(bucketName).collections().dropScope(scopeName)
        )
      );
    }
  }

  private async destroyProvisionedBuckets() {
    if (this.clusterPromise === undefined) {
      return;
    }

    const bucketNames = Array.from(this.provisionedKeyspaces.keys()).map(
      (ksp) => ksp.name
    );
    this.provisionedKeyspaces.clear();

    getTaskLogger()?.trace(
      'KeyspaceIsolationPool: buckets to be destroyed: %o.',
      bucketNames
    );

    const cluster = await this.getCluster();

    await runWithoutKeyspaceIsolation(async () => {
      for (const bucketName of bucketNames) {
        try {
          await cluster.buckets().dropBucket(bucketName);
        } catch (err) {
          getTaskLogger()?.error(`Error while dropping bucket %s : %o`, bucketName, err);
        }
      }
    });

    getTaskLogger()?.trace(`Provisioned buckets dropped : ${bucketNames.join(', ')}.`);
  }

  async dispose() {
    try {
      getTaskLogger()?.debug('KeyspaceIsolationPool.dispose.');

      if (this.clusterPromise === undefined) {
        getTaskLogger()?.debug(
          'KeyspaceIsolationPool: no connection opened, returning immediately.'
        );
        await flushLogger();
        return;
      }

      await this.destroyProvisionedBuckets();

      if (this.clusterPromise !== undefined) {
        const cluster = await this.clusterPromise;
        await cluster.close();
        this.clusterPromise = undefined;
      }
    } catch (err) {
      getTaskLogger()?.error('Error during dispose: %o', err);
      throw err;
    } finally {
      await flushLogger();
    }
  }
}
