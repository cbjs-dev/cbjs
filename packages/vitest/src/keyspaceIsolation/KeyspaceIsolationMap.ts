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

export class KeyspaceIsolationMap {
  protected isolatedBuckets = new Map<
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
   * Isolate a bucket if not already isolated and return its isolated name.
   *
   * @param bucketName The original name of the bucket.
   * @returns The isolated name of the bucket.
   */
  isolateBucket(bucketName: string): string {
    if (this.isBucketIsolated(bucketName)) {
      return this.getIsolatedBucketName(bucketName)!;
    }

    const isolatedName = `${bucketName}_${getRandomId()}`;

    this.isolatedBuckets.set(bucketName, {
      isolatedName,
      isolatedScopes: new Map(),
    });

    return isolatedName;
  }

  /**
   * Isolate a scope if not already isolated and return its isolated name.
   * It will isolate the bucket if it is not isolated already.
   *
   * @param bucketName The original name of the bucket.
   * @param scopeName The original name of the scope.
   * @returns The isolated name of the scope.
   */
  isolateScope(bucketName: string, scopeName: string): string {
    if (this.isScopeIsolated(bucketName, scopeName)) {
      return this.getIsolatedScopeName(bucketName, scopeName)!;
    }

    this.isolateBucket(bucketName);

    const isolatedName = `${scopeName}_${getRandomId()}`;

    this.isolatedBuckets.get(bucketName)!.isolatedScopes.set(scopeName, {
      isolatedName,
      isolatedCollections: new Map(),
    });

    return isolatedName;
  }

  /**
   * Isolate a collection if not already isolated and return its isolated name.
   * It will isolate the bucket and scope if they are not isolated already.
   *
   * @param bucketName The original name of the bucket.
   * @param scopeName The original name of the scope.
   * @param collectionName The original name of the collection.
   * @returns The isolated name of the collection.
   */
  isolateCollection(
    bucketName: string,
    scopeName: string,
    collectionName: string
  ): string {
    if (this.isCollectionIsolated(bucketName, scopeName, collectionName)) {
      return this.getIsolatedCollectionName(bucketName, scopeName, collectionName)!;
    }

    this.isolateScope(bucketName, scopeName);

    const isolatedName = `${collectionName}_${getRandomId()}`;

    this.isolatedBuckets
      .get(bucketName)!
      .isolatedScopes.get(scopeName)!
      .isolatedCollections.set(collectionName, isolatedName);

    return isolatedName;
  }

  /**
   * @param bucketName The original name of the bucket.
   * @returns The isolated name of the bucket or `undefined` is the bucket is not isolated.
   */
  getIsolatedBucketName(bucketName: string): string | undefined {
    if (!this.isBucketIsolated(bucketName)) {
      return undefined;
    }

    return this.isolatedBuckets.get(bucketName)?.isolatedName;
  }

  /**
   * @param bucketName The original name of the bucket.
   * @param scopeName The original name of the scope.
   * @returns The isolated name of the scope or `undefined` is the scope is not isolated.
   */
  getIsolatedScopeName(bucketName: string, scopeName: string): string | undefined {
    if (!this.isScopeIsolated(bucketName, scopeName)) {
      return undefined;
    }

    return this.isolatedBuckets.get(bucketName)!.isolatedScopes.get(scopeName)!
      .isolatedName;
  }

  /**
   * @param bucketName The original name of the bucket.
   * @param scopeName The original name of the scope.
   * @param collectionName The original name of the collection.
   * @returns The isolated name of the collection or `undefined` is the collection is not isolated.
   */
  getIsolatedCollectionName(
    bucketName: string,
    scopeName: string,
    collectionName: string
  ): string | undefined {
    if (!this.isCollectionIsolated(bucketName, scopeName, collectionName)) {
      return undefined;
    }

    return this.isolatedBuckets
      .get(bucketName)!
      .isolatedScopes.get(scopeName)!
      .isolatedCollections.get(collectionName);
  }

  isBucketIsolated(bucketName: string): boolean {
    return this.isolatedBuckets.has(bucketName);
  }

  isScopeIsolated(bucketName: string, scopeName: string): boolean {
    return this.isolatedBuckets.get(bucketName)?.isolatedScopes.has(scopeName) === true;
  }

  isCollectionIsolated(
    bucketName: string,
    scopeName: string,
    collectionName: string
  ): boolean {
    return (
      this.isolatedBuckets
        .get(bucketName)
        ?.isolatedScopes.get(scopeName)
        ?.isolatedCollections.has(collectionName) === true
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
