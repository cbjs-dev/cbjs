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
import { Keyspace } from '@cbjsdev/shared';

import { getRandomId } from '../utils/getRandomId';
import { KeyspaceIsolationLevel } from './types';

/*

a suite starts, it has its isolation config (scope + level)

when a query comes in, we get all the keyspaces to isolate
assuming a collection-level of isolation,

we take from available scopes and collections, create more if needed and possible, and assign them to the current isolation scope

 */

export class KeyspaceIsolationPool {
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

  /**
   * <scope, collection[]>
   */
  public readonly availableKeyspaces = new Map<string, string[]>();

  /**
   * <isolationId, <scope, collection[]>>
   */
  public readonly takenKeyspacesByIsolationId = new Map<string, Map<string, string[]>>();

  constructor();
  constructor(mapToClone: KeyspaceIsolationPool, level: KeyspaceIsolationLevel);
  constructor(
    ...args: [] | [mapToClone: KeyspaceIsolationPool, level: KeyspaceIsolationLevel]
  ) {
    if (args.length === 0) return;

    const [mapToClone, level] = args;

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

  createIsolation(isolationId: string) {
    this.takenKeyspacesByIsolationId.set(isolationId, new Map());

    return {
      isolateBucket: (originalBucketName: string) => {},
    };
  }

  /**
   * Isolate a bucket if not already isolated and return its isolated name.
   *
   * @param originalBucketName The original name of the bucket.
   * @returns The isolated name of the bucket.
   */
  isolateBucketName(originalBucketName: string): string {
    if (this.isBucketIsolated(originalBucketName)) {
      return this.getIsolatedBucketName(originalBucketName)!;
    }

    const isolatedName = `${originalBucketName}_${getRandomId()}`;

    this.isolatedBuckets.set(originalBucketName, {
      isolatedName,
      isolatedScopes: new Map(),
    });

    return isolatedName;
  }

  /**
   * Isolate a scope if not already isolated and return its isolated name.
   * It will isolate the bucket if it is not isolated already.
   *
   * @param originalBucketName The original name of the bucket.
   * @param originalScopeName The original name of the scope.
   * @returns The isolated name of the scope.
   */
  isolateScopeName(originalBucketName: string, originalScopeName: string): string {
    if (this.isScopeIsolated(originalBucketName, originalScopeName)) {
      return this.getIsolatedScopeName(originalBucketName, originalScopeName)!;
    }

    this.isolateBucketName(originalBucketName);

    const isolatedName = `${originalScopeName}_${getRandomId()}`;

    this.isolatedBuckets.get(originalBucketName)!.isolatedScopes.set(originalScopeName, {
      isolatedName,
      isolatedCollections: new Map(),
    });

    return isolatedName;
  }

  /**
   * Isolate a collection if not already isolated and return its isolated name.
   * It will isolate the bucket and scope if they are not isolated already.
   *
   * @param originalBucketName The original name of the bucket.
   * @param originalScopeName The original name of the scope.
   * @param originalCollectionName The original name of the collection.
   * @returns The isolated name of the collection.
   */
  isolateCollectionName(
    originalBucketName: string,
    originalScopeName: string,
    originalCollectionName: string
  ): string {
    if (
      this.isCollectionIsolated(
        originalBucketName,
        originalScopeName,
        originalCollectionName
      )
    ) {
      return this.getIsolatedCollectionName(
        originalBucketName,
        originalScopeName,
        originalCollectionName
      )!;
    }

    this.isolateScopeName(originalBucketName, originalScopeName);

    const isolatedName = `${originalCollectionName}_${getRandomId()}`;

    this.isolatedBuckets
      .get(originalBucketName)!
      .isolatedScopes.get(originalScopeName)!
      .isolatedCollections.set(originalCollectionName, isolatedName);

    return isolatedName;
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
      .get(originalBucketName)!
      .isolatedScopes.get(originalScopeName)!
      .isolatedCollections.get(originalCollectionName);
  }

  getIsolatedKeyspaceNames(keyspace: Keyspace) {
    if (!this.isKeyspaceIsolated(keyspace)) {
      return undefined;
    }

    return {
      bucket: this.getIsolatedBucketName(keyspace.bucket),
      scope: this.getIsolatedScopeName(keyspace.bucket, keyspace.scope),
      collection: this.getIsolatedCollectionName(
        keyspace.bucket,
        keyspace.scope,
        keyspace.collection
      ),
    } as Keyspace;
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

  isKeyspaceIsolated({ bucket, scope, collection }: Keyspace) {
    return this.isCollectionIsolated(bucket, scope, collection);
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
