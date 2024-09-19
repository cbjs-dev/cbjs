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
import { If, IsAny, IsExactly, IsNever, Or } from '../../misc/index.js';
import { CouchbaseClusterTypes } from './cluster.types.js';
import { DocDef } from './document.types.js';

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

export type IsKeyspaceWildcard<T> = Or<[IsAny<T>, IsNever<T>]>;
export type WildcardFallback<T, F> = If<IsKeyspaceWildcard<T>, F, T>;

// type HasOnlyOptions<T>

/**
 * Bucket names existing in the cluster.
 */
// prettier-ignore
export type BucketName<T extends CouchbaseClusterTypes> =
  IsNever<Exclude<keyof T, '@options'>> extends true ?
    string :
  Exclude<Extract<keyof T, string>, '@options'>
;

type MT = {
  '@options': { keyDelimiter: '::'; keyMatchingStrategy: 'delimiter' };
  'BucketOne': {
    ScopeOne: {
      CollectionOne: [DocDef<string, string>];
    };
  };
};
type TB = BucketName<MT>;
//    ^?

/**
 * Scope names existing in a bucket. Distributive.
 */
// prettier-ignore
export type ScopeName<
  T extends CouchbaseClusterTypes,
  B extends BucketName<T> = never
> =
  If<IsKeyspaceWildcard<B>, BucketName<T>, B> extends infer AllBuckets ?
    AllBuckets extends keyof T ?
      Extract<keyof T, string> extends '@options' ?
        string :
      Exclude<Extract<keyof T[AllBuckets], string>, '@options'> :
    string :
  never
;

/**
 * Collection names existing in a scope. Distributive.
 */
// prettier-ignore
export type CollectionName<
  T extends CouchbaseClusterTypes,
  B extends BucketName<T> = never,
  S extends ScopeName<T, B> = never,
> =
  If<IsKeyspaceWildcard<B>, BucketName<T>, B> extends infer AllBuckets ?
    AllBuckets extends BucketName<T> ?
      If<IsKeyspaceWildcard<S>, ScopeName<T, AllBuckets>, S> extends infer AllScopes ?
        IsNever<Exclude<keyof T, '@options'>> extends true ?
          string :
        AllBuckets extends keyof T ?
          AllScopes extends keyof T[AllBuckets] ?
            keyof T[AllBuckets][AllScopes] extends infer AllCollections ?
              AllCollections extends '@options' ?
                never :
              If<IsNever<AllCollections>, string, Extract<AllCollections, string>> :
            never :
          never :
        never :
      never :
    never :
  never
;

/**
 * Collection names of the default scope.
 */
// prettier-ignore
export type DefaultScopeCollectionName<
  T extends CouchbaseClusterTypes,
  B extends BucketName<T>,
> =
  B extends unknown ?
    DefaultScopeName extends ScopeName<T, B> ?
      CollectionName<T, B, DefaultScopeName> :
    never :
  never
;

// prettier-ignore
export type QueryContext<T extends CouchbaseClusterTypes> =
  BucketName<T> extends infer B extends BucketName<T> ?
    B extends unknown ?
      ScopeName<T, B> extends infer S extends string ?
        B | `${B}.${S}` :
      never :
    never :
  never
;
