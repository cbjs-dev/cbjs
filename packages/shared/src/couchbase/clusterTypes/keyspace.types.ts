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
import { DocDef } from './document.types';

/**
 * Default scope name.
 */
export type DefaultScopeName = '_default';

/**
 * Default collection name.
 */
export type DefaultCollectionName = '_default';

/**
 * Error type for missing default scope.
 */
export type MissingDefaultScope<B extends string> =
  `The "${DefaultScopeName}" scope is missing from the types declaration of bucket "${B}".`;

/**
 * Error type for missing default collection.
 */
export type MissingDefaultCollection<B extends string> =
  `The "${DefaultCollectionName}" collection is missing from the types declaration of the ${DefaultScopeName} scope of bucket "${B}".`;

/**
 * Basic structure for cluster types.
 */
export type CouchbaseClusterTypes = {
  [bucket: string]: {
    [scope: string]: {
      [collection: string]: DocDef<string, unknown>;
    };
  };
};

/**
 * Default types used when the end dev don't define their owns.
 */
export type DefaultClusterTypes = {
  [bucket: string]: {
    // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
    [key in DefaultScopeName | NonNullable<string>]: {
      // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
      [Key in DefaultCollectionName | NonNullable<string>]: DocDef<string, any>;
    };
  };
};

/**
 * Bucket names existing in the cluster.
 */
export type BucketName<T extends CouchbaseClusterTypes> = Extract<keyof T, string>;

/**
 * Scope names existing in a bucket. Distributive.
 */
export type ScopeName<
  T extends CouchbaseClusterTypes,
  B extends BucketName<T> = BucketName<T>,
> = B extends BucketName<T> ? Extract<keyof T[B], string> : never;

/**
 * Collection names existing in a scope. Distributive.
 */
export type CollectionName<
  T extends CouchbaseClusterTypes,
  B extends BucketName<T> = BucketName<T>,
  S extends ScopeName<T, B> = ScopeName<T, B>,
> =
  B extends BucketName<T>
    ? S extends ScopeName<T, B>
      ? Extract<keyof T[B][S], string>
      : never
    : never;

/**
 * Collection names of the default scope.
 */
export type DefaultScopeCollectionName<
  T extends CouchbaseClusterTypes,
  B extends BucketName<T>,
> = B extends unknown
  ? DefaultScopeName extends ScopeName<T, B>
    ? CollectionName<T, B, DefaultScopeName>
    : never
  : never;
