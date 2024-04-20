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
import { hasOwn, invariant, PartialKeyspace } from '@cbjsdev/shared';

import { getRandomId } from '../utils/getRandomId';
import { KeyspaceIsolationLevel } from './types';

/*

a suite starts, it has its isolation config (scope + level)

when a query comes in, we get all the keyspaces to isolate
assuming a collection-level of isolation,

we take from available scopes and collections, create more if needed and possible, and assign them to the current isolation scope

 */

export class KeyspaceIsolationRealm {
  public readonly rootTaskId: string;
  public readonly isolatedBuckets = new Map<
    string,
    {
      isolatedName: string;
      isolatedScopes: Map<
        string,
        {
          isolatedName: string;
          isolatedCollections: Map<string, string>;
        }
      >;
    }
  >();

  constructor(rootTaskId: string);
  constructor(
    rootTaskId: string,
    realmToClone: KeyspaceIsolationRealm,
    level: KeyspaceIsolationLevel
  );
  constructor(
    ...args:
      | [rootTaskId: string]
      | [
          rootTaskId: string,
          mapToClone: KeyspaceIsolationRealm,
          level: KeyspaceIsolationLevel,
        ]
  ) {
    const [rootTaskId, mapToClone, level] = args;

    this.rootTaskId = rootTaskId;

    if (!mapToClone || !level) return;

    if (level === 'bucket') {
      return;
    }

    mapToClone.isolatedBuckets.forEach((bucketIsolation, originalBucketName) => {
      this.isolatedBuckets.set(originalBucketName, {
        isolatedName: bucketIsolation.isolatedName,
        isolatedScopes: new Map(),
      });
    });
  }

  /**
   * Utility function that return the name with a random suffix.
   *
   * @param name
   */
  static createIsolatedName(name: string) {
    return `cbjs_${name}_${getRandomId()}`;
  }

  /**
   * Isolate a bucket if not already isolated and return its isolated name.
   */
  setIsolatedBucketName(originalBucketName: string, isolatedBucketName: string): void {
    if (this.isBucketIsolated(originalBucketName)) {
      throw new Error('Bucket is already isolated.');
    }

    this.isolatedBuckets.set(originalBucketName, {
      isolatedName: isolatedBucketName,
      isolatedScopes: new Map(),
    });
  }

  /**
   * Isolate a scope if not already isolated and return its isolated name.
   * It will isolate the bucket if it is not isolated already.
   *
   * @returns The isolated name of the scope.
   */
  setIsolatedScopeName(
    originalBucketName: string,
    originalScopeName: string,
    isolatedScopeName: string
  ): void {
    if (this.isScopeIsolated(originalBucketName, originalScopeName)) {
      throw new Error('Scope is already isolated.');
    }

    if (!this.isBucketIsolated(originalBucketName)) {
      throw new Error(
        'You must isolate the bucket before you can isolate a scope in that bucket.'
      );
    }

    const bucketIsolations = this.isolatedBuckets.get(originalBucketName);
    invariant(bucketIsolations);

    bucketIsolations.isolatedScopes.set(originalScopeName, {
      isolatedName: isolatedScopeName,
      isolatedCollections: new Map(),
    });
  }

  /**
   * Isolate a collection if not already isolated and return its isolated name.
   * It will isolate the bucket and scope if they are not isolated already.
   *
   * @param originalBucketName The original name of the bucket.
   * @param originalScopeName The original name of the scope.
   * @param originalCollectionName The original name of the collection.
   * @param isolatedCollectionName
   * @returns The isolated name of the collection.
   */
  setIsolatedCollectionName(
    originalBucketName: string,
    originalScopeName: string,
    originalCollectionName: string,
    isolatedCollectionName: string
  ): void {
    if (
      this.isCollectionIsolated(
        originalBucketName,
        originalScopeName,
        originalCollectionName
      )
    ) {
      throw new Error('Collection is already isolated.');
    }

    if (!this.isBucketIsolated(originalBucketName)) {
      throw new Error(
        'You must isolate the bucket before you can isolate a collection in that bucket.'
      );
    }

    if (!this.isScopeIsolated(originalBucketName, originalScopeName)) {
      throw new Error(
        'You must isolate the bucket before you can isolate a collection in that bucket.'
      );
    }

    const scopeIsolations = this.isolatedBuckets
      .get(originalBucketName)
      ?.isolatedScopes.get(originalScopeName);
    invariant(scopeIsolations);

    scopeIsolations.isolatedCollections.set(
      originalCollectionName,
      isolatedCollectionName
    );
  }

  /**
   * @param originalBucketName The original name of the bucket.
   * @returns The isolated name of the bucket or `undefined` is the bucket is not isolated.
   */
  getIsolatedBucketName(originalBucketName: string): string | undefined {
    if (!this.isBucketIsolated(originalBucketName)) {
      return undefined;
    }

    return this.isolatedBuckets.get(originalBucketName)?.isolatedName;
  }

  /**
   * @param originalBucketName The original name of the bucket.
   * @param originalScopeName The original name of the scope.
   * @returns The isolated name of the scope or `undefined` is the scope is not isolated.
   */
  getIsolatedScopeName(
    originalBucketName: string,
    originalScopeName: string
  ): string | undefined {
    if (!this.isScopeIsolated(originalBucketName, originalScopeName)) {
      return undefined;
    }

    return this.isolatedBuckets
      .get(originalBucketName)!
      .isolatedScopes.get(originalScopeName)!.isolatedName;
  }

  /**
   * @param originalBucketName The original name of the bucket.
   * @param originalScopeName The original name of the scope.
   * @param originalCollectionName The original name of the collection.
   * @returns The isolated name of the collection or `undefined` is the collection is not isolated.
   */
  getIsolatedCollectionName(
    originalBucketName: string,
    originalScopeName: string,
    originalCollectionName: string
  ): string | undefined {
    if (
      !this.isCollectionIsolated(
        originalBucketName,
        originalScopeName,
        originalCollectionName
      )
    ) {
      return undefined;
    }

    return this.isolatedBuckets
      .get(originalBucketName)
      ?.isolatedScopes.get(originalScopeName)
      ?.isolatedCollections.get(originalCollectionName);
  }

  getIsolatedKeyspaceNames(keyspace: PartialKeyspace) {
    if (!this.isKeyspaceIsolated(keyspace)) {
      return undefined;
    }

    return {
      bucket: this.getIsolatedBucketName(keyspace.bucket),
      scope: hasOwn(keyspace, 'scope')
        ? this.getIsolatedScopeName(keyspace.bucket, keyspace.scope)
        : undefined,
      collection: hasOwn(keyspace, 'collection')
        ? this.getIsolatedCollectionName(
            keyspace.bucket,
            keyspace.scope,
            keyspace.collection
          )
        : undefined,
    } as PartialKeyspace;
  }

  isBucketIsolated(originalBucketName: string): boolean {
    return this.isolatedBuckets.has(originalBucketName);
  }

  isScopeIsolated(originalBucketName: string, originalScopeName: string): boolean {
    return (
      this.isolatedBuckets
        .get(originalBucketName)
        ?.isolatedScopes.has(originalScopeName) === true
    );
  }

  isCollectionIsolated(
    originalBucketName: string,
    originalScopeName: string,
    originalCollectionName: string
  ): boolean {
    return (
      this.isolatedBuckets
        .get(originalBucketName)
        ?.isolatedScopes.get(originalScopeName)
        ?.isolatedCollections.has(originalCollectionName) === true
    );
  }

  isKeyspaceIsolated({ bucket, scope, collection }: PartialKeyspace) {
    if (collection) {
      return this.isCollectionIsolated(bucket, scope, collection);
    }

    if (scope) {
      return this.isScopeIsolated(bucket, scope);
    }

    return this.isBucketIsolated(bucket);
  }

  /**
   * @returns the isolated bucket name or `undefined` if it has not been isolated.
   * @param isolatedBucketName The isolated name of the bucket.
   */
  getOriginalBucketName(isolatedBucketName: string): string | undefined {
    for (const [originalBucketName, isolatedBucket] of this.isolatedBuckets.entries()) {
      if (isolatedBucket.isolatedName === isolatedBucketName) {
        return originalBucketName;
      }
    }

    return undefined;
  }

  /**
   * @returns the isolated scope name or `undefined` if it has not been isolated.
   * @param originalBucketName The non-isolated name of the bucket.
   * @param isolatedScopeName The isolated name of the scope.
   */
  getOriginalScopeName(
    originalBucketName: string,
    isolatedScopeName: string
  ): string | undefined {
    if (!this.isBucketIsolated(originalBucketName)) {
      return undefined;
    }

    for (const [originalScopeName, isolatedScope] of this.isolatedBuckets
      .get(originalBucketName)!
      .isolatedScopes.entries()) {
      if (isolatedScope.isolatedName === isolatedScopeName) {
        return originalScopeName;
      }
    }

    return undefined;
  }

  /**
   * @returns the isolated collection name or `undefined` if it has not been isolated.
   * @param originalBucketName The non-isolated name of the bucket.
   * @param originalScopeName The non-isolated name of the scope.
   * @param isolatedCollectionName The isolated name of the collection.
   */
  getOriginalCollectionName(
    originalBucketName: string,
    originalScopeName: string,
    isolatedCollectionName: string
  ): string | undefined {
    if (!this.isScopeIsolated(originalBucketName, originalScopeName)) {
      return undefined;
    }

    for (const [originalCollectionName, isolatedName] of this.isolatedBuckets
      .get(originalBucketName)!
      .isolatedScopes.get(originalScopeName)!
      .isolatedCollections.entries()) {
      if (isolatedName === isolatedCollectionName) {
        return originalCollectionName;
      }
    }

    return undefined;
  }
}
