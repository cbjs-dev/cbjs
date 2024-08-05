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
  BucketName,
  CollectionName,
  CouchbaseClusterTypes,
  DefaultClusterTypes,
  DefaultCollectionName,
  DefaultScopeCollectionName,
  DefaultScopeName,
  DocDef,
  DocDefMatchingKey,
  DocumentBag,
  IsNever,
  Keyspace,
  KeyspaceDocDef,
  KeyspaceDocDefArray,
  MissingDefaultCollection,
  MissingDefaultScope,
  ObjectDocumentDef,
  Pretty,
  ScopeName,
  WildcardFallback,
} from '@cbjsdev/shared';

import { Bucket } from '../bucket.js';
import type { Collection } from '../collection.js';
import type { Scope } from '../scope.js';

/**
 * Collection's documents types, as a CollectionDocumentBag.
 */
// prettier-ignore
export type CT<Instance> =
  Instance extends Collection<infer T, infer B, infer S, infer C> ?
    DocumentBag<KeyspaceDocDef<T, B, S, C>> :
  never
;

// prettier-ignore
export type CollectionDocDef<Instance> =
  Instance extends Collection<infer T, infer B, infer S, infer C> ?
    B extends BucketName<T> ?
      S extends ScopeName<T, WildcardFallback<B, BucketName<T>>> ?
        C extends CollectionName<
          T,
          WildcardFallback<B, BucketName<T>>,
          WildcardFallback<S, ScopeName<T, WildcardFallback<B, BucketName<T>>>>
        > ?
          KeyspaceDocDef<T, B, S, C> :
        never :
      never :
    never :
  never
;

// prettier-ignore
export type CollectionDocDefMatchingKey<Instance, Key extends string> =
  Instance extends Collection<infer T, infer B, infer S, infer C> ?
    DocDefMatchingKey<Key, T, B, S, C> :
  never
;

/**
 * Infer the keyspace from a Collection instance type.
 */
// prettier-ignore
export type CollectionKeyspace<Instance> =
  Instance extends Collection<infer T, infer B, infer S, infer C> ?
    T extends CouchbaseClusterTypes ?
      B extends BucketName<T> ?
        S extends ScopeName<T, B> ?
          C extends CollectionName<T, B, S> ?
            { clusterTypes: T; bucket: B; scope: S; collection: C; } :
          never :
        never :
      never :
    never :
  never
;

export type ExtractClusterTypes<T> =
  T extends Bucket<infer ClusterTypes>
    ? ClusterTypes
    : T extends Scope<infer ClusterTypes>
      ? ClusterTypes
      : T extends Collection<infer ClusterTypes>
        ? ClusterTypes
        : never;

// prettier-ignore
export type ExtractCollectionJsonDocDef<Instance, Key extends string> =
  Instance extends Collection<infer T, infer B, infer S, infer C> ?
    ObjectDocumentDef<DocDefMatchingKey<Key, T, B, S, C>> :
  never
;

// prettier-ignore
export type ExtractCollectionJsonDocBody<Instance, Key extends string> =
  Instance extends Collection<infer T, infer B, infer S, infer C> ?
    ObjectDocumentDef<DocDefMatchingKey<Key, T, B, S, C>>['Body'] :
  never
;

export type ExtractCollectionJsonDocKey<Instance> = ObjectDocumentDef<
  CollectionDocDef<Instance>
>['Key'];

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

export type AnyBucket = Bucket<any, any>;
export type AnyScope = Scope<any, any, any>;
export type AnyCollection = Collection<any, any, any, any>;

/**
 * @alias ClusterCollection
 * @deprecated use {@link ClusterCollection} instead.
 */
export type CollectionAmong<
  T extends CouchbaseClusterTypes = DefaultClusterTypes,
  B extends BucketName<T> = BucketName<T>,
  S extends ScopeName<T, B> = ScopeName<T, B>,
  C extends CollectionName<T, B, S> = CollectionName<T, B, S>,
> = ClusterCollection<T, B, S, C>;

/**
 * Represent a union of {@link Collection} within a Bucket, Scope and/or a subset of Collection.
 */
// prettier-ignore
export type ClusterCollection<
  T extends CouchbaseClusterTypes = never,
  B extends BucketName<T> = never,
  S extends ScopeName<T, B> = never,
  C extends CollectionName<T, B, S> = never,
> =
  IsNever<T> extends true ?
    AnyCollection :
  Keyspace<T, B, S, C> extends infer KS extends Keyspace<T, B, S, C> ?
    KS extends unknown ?
      KS['bucket'] extends infer KSB extends BucketName<T> ?
        KS['scope'] extends infer KSS extends ScopeName<T, KSB> ?
          KS['collection'] extends infer KSC extends CollectionName<T, KSB, KSS> ?
            Collection<T, KSB, KSS, KSC> :
          never :
        never :
      never :
    never :
  never
;

/**
 * Represent a union of {@link Scope} within a Bucket, and/or a subset of Scope.
 */
// prettier-ignore
export type ClusterScope<
  T extends CouchbaseClusterTypes = never,
  B extends BucketName<T> = never,
  S extends ScopeName<T, B> = never,
> =
  IsNever<T> extends true ?
    AnyScope :
  Keyspace<T, B, S> extends infer KS extends Keyspace<T, B, S> ?
      KS extends unknown ?
        KS['bucket'] extends infer KSB extends BucketName<T> ?
          KS['scope'] extends infer KSS extends ScopeName<T, KSB> ?
          Scope<T, KSB, KSS> :
        never :
      never :
    never :
  never
;

/**
 * Represent a union of {@link Bucket} within a cluster.
 */
// prettier-ignore
export type ClusterBucket<
  T extends CouchbaseClusterTypes = never,
  B extends BucketName<T> = never,
> =
  IsNever<T> extends true ?
    AnyBucket :
  Keyspace<T, B> extends infer KS extends Keyspace<T, B> ?
    KS extends unknown ?
      KS['bucket'] extends infer KSB extends BucketName<T> ?
        Bucket<T, KSB> :
      never :
    never :
  never
;

/**
 * Represent {@link Collection}s that may contain the given document definitions.
 */
// prettier-ignore
export type CollectionContainingDocDef<
  T extends CouchbaseClusterTypes,
  ExpectedDocDef extends DocDef,
> =
  ClusterCollection<T> extends infer AllCollections ?
    AllCollections extends unknown ?
      ExpectedDocDef extends CT<AllCollections>['Document'] ?
        AllCollections :
      never :
    never :
  never
;

/**
 * Represent {@link Collection}s that may contain the given document bodies.
 */
export type CollectionContainingDocBody<T extends CouchbaseClusterTypes, ExpectedDoc> =
  ClusterCollection<T> extends infer AllCollections
    ? AllCollections extends unknown
      ? CT<AllCollections>['Document']['Body'] extends ExpectedDoc
        ? AllCollections
        : never
      : never
    : never;

export type CollectionMatchingDocDef<
  T extends CouchbaseClusterTypes,
  ExpectedDocDefs extends DocDef<string, any>,
> =
  ClusterCollection<T> extends infer AllCollections extends AnyCollection
    ? AllCollections extends unknown
      ? ExpectedDocDefs extends unknown
        ? CollectionDocDef<AllCollections> extends infer CollectionDocDefs extends DocDef
          ? CollectionDocDefs extends unknown
            ? CollectionDocDefs['Key'] extends ExpectedDocDefs['Key']
              ? CollectionDocDefs['Body'] extends ExpectedDocDefs['Body']
                ? AllCollections
                : never
              : never
            : never
          : never
        : never
      : never
    : never;

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
        ? Collection<T, B, DefaultScopeName, DefaultCollectionName>
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
      ? Collection<T, B, DefaultScopeName, C>
      : MissingDefaultScope<B>
    : never;
