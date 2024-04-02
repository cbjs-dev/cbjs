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
import type {
  BucketName,
  CollectionDocumentBag,
  CollectionName,
  CouchbaseClusterTypes,
  DefaultClusterTypes,
  DefaultCollectionName,
  DefaultScopeCollectionName,
  DefaultScopeName,
  DocDef,
  ExtractDocBodyByKey,
  IsNever,
  Keyspace,
  MissingDefaultCollection,
  MissingDefaultScope,
  PickCollectionDocDef,
  Pretty,
  ScopeName,
} from '@cbjsdev/shared';

import { Bucket } from '../bucket';
import type { Collection } from '../collection';
import type { Scope } from '../scope';

export type ExtractCollectionDocumentBag<C> =
  C extends Collection<any, any, any, any, infer Bag extends CollectionDocumentBag<any>>
    ? Bag
    : never;

export type ExtractCollectionDocumentDef<C> =
  C extends Collection<any, any, any, any, CollectionDocumentBag<infer Defs>>
    ? Defs
    : never;

export type KeyspaceDocDef<
  T extends CouchbaseClusterTypes = DefaultClusterTypes,
  B extends BucketName<T> = any,
  S extends ScopeName<T, B> = any,
  C extends CollectionName<T, B, S> = any,
> = T[B][S][C];

export type ExtractCollectionJsonDocBody<C, Key extends string> = ExtractDocBodyByKey<
  ExtractCollectionDocumentBag<C>['ObjectDocument'],
  Key
>;

export type ExtractCollectionJsonDocKey<C> =
  ExtractCollectionDocumentBag<C>['ObjectDocument']['Key'];

/**
 * Construct a `CouchbaseClusterTypes` with the given bucket, scope and collection, containing the given documents.
 */
export type ClusterTypesWith<
  Doc,
  B extends string = string,
  S extends string = string,
  C extends string = string,
> = {
  [bucket in B | NonNullable<string>]: {
    [scope in S | NonNullable<string>]: {
      [collection in C | NonNullable<string>]: Doc;
    };
  };
};

/**
 * Add additional bucket, scope, collection or documents to an existing cluster types definition.
 */
export type AugmentClusterTypes<
  T extends CouchbaseClusterTypes,
  B extends string,
  S extends string = never,
  C extends string = never,
  Doc = never,
> = Pretty<
  T & {
    [AugmentedBucket in B]: {
      [AugmentedScope in S]: {
        [AugmentedCollection in C]: Doc;
      };
    };
  }
>;

/**
 * Represent any {@link Collection}.
 */
export type AnyBucket = Bucket<any, any>;
export type AnyScope = Scope<any, any, any>;
export type AnyCollection = Collection<any, any, any, any, any>;

/**
 * @alias ClusterCollection
 * @deprecated use {@link ClusterCollection} instead.
 */
export type CollectionAmong<
  T extends CouchbaseClusterTypes = never,
  B extends BucketName<T> = never,
  S extends ScopeName<T, B> = never,
  C extends CollectionName<T, B, S> = never,
> = ClusterCollection<T, B, S, C>;

/**
 * Represent a union of {@link Collection} within a Bucket, Scope and/or a subset of Collection.
 */
export type ClusterCollection<
  T extends CouchbaseClusterTypes = never,
  B extends BucketName<T> = never,
  S extends ScopeName<T, B> = never,
  C extends CollectionName<T, B, S> = never,
> =
  IsNever<T> extends true
    ? AnyCollection
    : Keyspace<T, B, S, C> extends infer KS extends Keyspace<T, B, S, C>
      ? KS extends unknown
        ? KS['bucket'] extends infer KSB extends BucketName<T>
          ? KS['scope'] extends infer KSS extends ScopeName<T, KSB>
            ? KS['collection'] extends infer KSC extends CollectionName<T, KSB, KSS>
              ? Collection<T, KSB, KSS, KSC>
              : never
            : never
          : never
        : never
      : never;

/**
 * Represent a union of {@link Scope} within a Bucket, and/or a subset of Scope.
 */
export type ClusterScope<
  T extends CouchbaseClusterTypes = never,
  B extends BucketName<T> = never,
  S extends ScopeName<T, B> = never,
> =
  IsNever<T> extends true
    ? AnyScope
    : Keyspace<T, B, S> extends infer KS extends Keyspace<T, B, S>
      ? KS extends unknown
        ? KS['bucket'] extends infer KSB extends BucketName<T>
          ? KS['scope'] extends infer KSS extends ScopeName<T, KSB>
            ? Scope<T, KSB, KSS>
            : never
          : never
        : never
      : never;

/**
 * Represent a union of {@link Bucket} within a cluster.
 */
export type ClusterBucket<
  T extends CouchbaseClusterTypes = never,
  B extends BucketName<T> = never,
> =
  IsNever<T> extends true
    ? AnyBucket
    : Keyspace<T, B> extends infer KS extends Keyspace<T, B>
      ? KS extends unknown
        ? KS['bucket'] extends infer KSB extends BucketName<T>
          ? Bucket<T, KSB>
          : never
        : never
      : never;

/**
 * Represent a {@link Collection} that may contain documents of type `Doc`.
 * IMPORTANT: This CANNOT be used as a type constraint.
 */
export type CollectionContaining<Doc extends DocDef> = Collection<
  any,
  any,
  any,
  any,
  CollectionDocumentBag<Doc>
>;

/**
 * Validate the collection types contains the given document type.
 * If `Doc` is a union, then all members must be contained within the collection.
 * To validate the collection contains any member of the union, see {@link ValidateCollectionContainsAny}.
 */
export type ValidateCollectionContainsAll<Instance, Doc> =
  Instance extends Collection<any, any, any, any, infer DocBag>
    ? DocBag extends CollectionDocumentBag<infer Def>
      ? [Doc] extends [Def['Body']]
        ? Instance
        : never
      : never
    : never;

/**
 * Validate the collection types contains the given document type.
 * If `Doc` is a union, then the collection will be validated if it contains any member of the union.
 * To validate the collection contains all members of the union, see {@link ValidateCollectionContainsAll}
 */
export type ValidateCollectionContainsAny<Instance, Doc> =
  Instance extends Collection<any, any, any, any, infer DocBag>
    ? DocBag extends CollectionDocumentBag<infer Def>
      ? Doc extends Def['Body']
        ? Instance
        : never
      : never
    : never;

/**
 * Validate the collection can contain the given data structure.
 */
export type IfCollectionContains<TargetType, CollectionInstance, Doc> =
  IsNever<ValidateCollectionContainsAny<CollectionInstance, Doc>> extends false
    ? TargetType
    : 'The collection cannot contain such document.';

/**
 * Represent the runtime type of the default {@Scope} of a bucket.
 */
export type DefaultScope<
  T extends CouchbaseClusterTypes,
  B extends BucketName<T>,
> = B extends unknown
  ? DefaultScopeName extends ScopeName<T, B>
    ? Scope<T, B, DefaultScopeName>
    : MissingDefaultScope<B>
  : never;

/**
 * Return `true` if the bucket has declared the default scope.
 */
export type HasDefaultScope<
  T extends CouchbaseClusterTypes,
  B extends BucketName<T>,
> = B extends unknown ? (DefaultScopeName extends ScopeName<T, B> ? true : false) : never;

/**
 * Represent the runtime type of a {@link Collection} instance of the default collection inside the default scope.
 * It includes check to ensure the default scope and default collection exists and returns an error type if it doesn't.
 */
export type DefaultCollection<T extends CouchbaseClusterTypes, B extends BucketName<T>> =
  B extends BucketName<T>
    ? DefaultScopeName extends ScopeName<T, B>
      ? DefaultCollectionName extends CollectionName<T, B, DefaultScopeName>
        ? Collection<
            T,
            B,
            DefaultScopeName,
            DefaultCollectionName,
            CollectionDocumentBag<
              PickCollectionDocDef<T, B, DefaultScopeName, DefaultCollectionName>
            >
          >
        : MissingDefaultCollection<B>
      : MissingDefaultScope<B>
    : never;

/**
 * Represent the runtime type of a {@link Collection} instance of a collection inside the default scope.
 * It includes check to ensure the default scope exists and returns an error type if it doesn't.
 */
export type DefaultScopeCollection<
  T extends CouchbaseClusterTypes,
  B extends BucketName<T>,
  C extends DefaultScopeCollectionName<T, B>,
> =
  B extends BucketName<T>
    ? DefaultScopeName extends ScopeName<T, B>
      ? Collection<
          T,
          B,
          DefaultScopeName,
          C,
          CollectionDocumentBag<PickCollectionDocDef<T, B, DefaultScopeName, C>>
        >
      : MissingDefaultScope<B>
    : never;
