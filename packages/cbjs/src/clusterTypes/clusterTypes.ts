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

import { IsNever, Pretty } from '@cbjs/shared';
import { Collection } from '../collection';
import { Scope } from '../scope';
import { DocumentPath } from './kv/utils/path-utils.types';

// export type DocDef<out Key extends string = string, out Body = unknown> = {
export type DocDef<Key extends string = string, Body = unknown> = {
  Key: Key;
  Body: Body;
}

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
    [key in DefaultScopeName | NonNullable<string>]: {
      [Key in DefaultCollectionName | NonNullable<string>]: DocDef<string, any>;
    }
  };
};

/**
 * Default scope name.
 */
export type DefaultScopeName = '_default';

/**
 * Default collection name.
 */
export type DefaultCollectionName = '_default';

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
> =
  B extends BucketName<T> ?
    Extract<keyof T[B], string> :
  never
;

/**
 * Collection names existing in a scope. Distributive.
 */
export type CollectionName<
  T extends CouchbaseClusterTypes,
  B extends BucketName<T> = BucketName<T>,
  S extends ScopeName<T, B> = ScopeName<T, B>,
> =
  B extends BucketName<T> ?
    S extends ScopeName<T, B> ?
      Extract<keyof T[B][S], string> :
    never :
  never
;

/**
 * Union of all of `T` values. Distributive.
 *
 * @internal
 */
type UnwindUnionObjectValues<T> = T extends unknown ? T[keyof T] : never;

/**
 * Union of documents in a collection. Distributive.
 */
export type PickCollectionDocument<
  T extends CouchbaseClusterTypes,
  B extends BucketName<T> = BucketName<T>,
  S extends ScopeName<T, B> = ScopeName<T, B>,
  C extends CollectionName<T, B, S> = CollectionName<T, B, S>,
> =
  B extends BucketName<T> ?
    S extends ScopeName<T, B> ?
      C extends CollectionName<T, B, S> ?
        Extract<UnwindUnionObjectValues<T[B][S]>, T[B][S][C]> :
      never :
    never :
  never
;

/**
 * A JSON object.
 */
export type Json = string | number | boolean | null | ReadonlyArray<Json> | { [key: string]: Json };

/**
 * Couchbase document types.
 */
export type CouchbaseDocumentTypes = {
  JSON: Json,
  'UTF-8': string,
  RAW: NodeJS.TypedArray,
  PRIVATE: unknown,
}

/**
 * Subset of Json types that extend `object`.
 */
export type JsonObject = Extract<CouchbaseDocumentTypes['JSON'], object>;

/**
 * Extract definitions of JSON documents.
 */
export type JsonDocumentDef<T extends DocDef> =
  T extends infer Doc extends DocDef ?
    Doc['Body'] extends CouchbaseDocumentTypes['JSON'] ?
      Doc :
    never :
  never
;

/**
 * Extract documents on which you can perform sub-document operations.
 *
 * @see Collection.lookupIn
 * @see Collection.mutateIn
 */
export type ObjectDocument<Doc> = Extract<Doc, object>;

/**
 * Extract definitions of documents on which you can perform sub-document operations.
 */
export type ObjectDocumentDef<T extends DocDef> =
  T extends infer Doc extends DocDef ?
    Doc['Body'] extends object ?
      DocDef<Doc['Key'], Doc['Body']> :
    never :
  never
;

/**
 * Extract document definitions where the body extends `E`.
 */
export type ExtractDefByBody<Def extends DocDef, E> =
  Def extends unknown ?
    Def['Body'] extends infer Body ?
      Body extends E ?
        Def :
      never :
    never :
  never
;

export type ExtractDefByKey<Key extends string, Def extends DocDef> =
  Key extends unknown ?
    Def extends unknown ?
      Key extends Def['Key'] ?
        Def :
      never :
    never :
  never
;

export type ExtractBodyByKey<Key extends string, Def extends DocDef> =
  Key extends unknown ?
    Def extends unknown ?
      Key extends Def['Key'] ?
        Def['Body'] :
      never :
    never :
  never
;

/**
 * Contains the pre-computer types for the collection.
 */
export type CollectionDocumentBag<Def extends DocDef> = {
  Key: Def['Key'];
  Document: Def;
  JsonDocument: JsonDocumentDef<Def>;
  ObjectDocument: ObjectDocumentDef<Def>;
  ObjectDocumentPath: DocumentPath<ObjectDocumentDef<Def>['body']> | '';
}

export type ExtractCollectionDocumentBag<C> =
  C extends Collection<any, any, any, any, infer Bag extends CollectionDocumentBag<any>> ?
    Bag :
  never
;

export type ExtractCollectionDocumentDef<C> =
  C extends Collection<any, any, any, any, CollectionDocumentBag<infer Defs>> ?
    Defs :
  never
;

/**
 * Construct a `CouchbaseClusterTypes` with the given bucket, scope and collection, containing the given documents.
 */
export type ClusterTypesWith<Doc, B extends string = string, S extends string = string, C extends string = string> = {
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
> = Pretty<T & {
  [AugmentedBucket in B]: {
    [AugmentedScope in S]: {
      [AugmentedCollection in C]: Doc;
    }
  }
}>;

/**
 * ###################
 * ## Runtime Types ##
 * ###################
 * Below are types that involve runtime, couchbase objects, such as class instances.
 */

/**
 * Error type for missing default scope.
 */
export type MissingDefaultScope<B extends string> = `The "${DefaultScopeName}" scope is missing from the types declaration of bucket "${B}".`;

/**
 * Error type for missing default collection.
 */
export type MissingDefaultCollection<B extends string> = `The "${DefaultCollectionName}" collection is missing from the types declaration of the ${DefaultScopeName} scope of bucket "${B}".`;

export type AnyCollection = Collection<any, any, any, any, any>;

/**
 * Represent a {@link Collection} within a Bucket, Scope and/or a subset of Collection.
 */
export type CollectionAmong<
  T extends CouchbaseClusterTypes = any,
  B extends BucketName<T> = any,
  S extends ScopeName<T, B> = any,
  C extends CollectionName<T, B, S> = any,
> = Collection<T, B, S, C>;

/**
 * Represent a {@link Collection} that may contain documents of type `Doc`.
 * IMPORTANT: This CANNOT be used as a type constraint.
 */
export type CollectionContaining<Doc extends DocDef> =
  Collection<any, any, any, any, CollectionDocumentBag<Doc>>
;

/**
 * Validate the collection types contains the given document type.
 * If `Doc` is a union, then all members must be contained within the collection.
 * To validate the collection contains any member of the union, see {@link ValidateCollectionContainsAny}.
 */
export type ValidateCollectionContainsAll<Instance, Doc> =
  Instance extends Collection<any, any, any, any, infer DocBag> ?
    DocBag extends CollectionDocumentBag<infer Def> ?
      [Doc] extends [Def['Body']] ?
       Instance :
      never :
    never :
  never
;

/**
 * Validate the collection types contains the given document type.
 * If `Doc` is a union, then the collection will be validated if it contains any member of the union.
 * To validate the collection contains all members of the union, see {@link ValidateCollectionContainsAll}
 */
export type ValidateCollectionContainsAny<Instance, Doc> =
  Instance extends Collection<any, any, any, any, infer DocBag> ?
    DocBag extends CollectionDocumentBag<infer Def> ?
      Doc extends Def['Body'] ?
        Instance :
      never :
    never :
  never
;

/**
 * Validate the collection can contain the given data structure.
 */
export type IfCollectionContains<TargetType, CollectionInstance, Doc> =
  IsNever<ValidateCollectionContainsAny<CollectionInstance, Doc>> extends false ?
    TargetType :
  'The collection cannot contain such document.'
;

/**
 * Represent the runtime type of the default {@Scope} of a bucket.
 */
export type DefaultScope<T extends CouchbaseClusterTypes, B extends BucketName<T>> =
  B extends unknown ?
    DefaultScopeName extends ScopeName<T, B> ?
      Scope<T, B, DefaultScopeName> :
    MissingDefaultScope<B> :
  never
;

/**
 * Return `true` if the bucket has declared the default scope.
 */
export type HasDefaultScope<T extends CouchbaseClusterTypes, B extends BucketName<T>> =
  B extends unknown ?
    DefaultScopeName extends ScopeName<T, B> ?
      true :
    false :
  never
;


/**
 * Collection names of the default scope.
 */
export type DefaultScopeCollectionName<T extends CouchbaseClusterTypes, B extends BucketName<T>> =
  B extends unknown ?
    DefaultScopeName extends ScopeName<T, B> ?
      CollectionName<T, B, DefaultScopeName> :
    never :
  never
;

/**
 * Represent the runtime type of a {@link Collection} instance of a collection inside the default scope.
 * It includes check to ensure the default scope exists and returns an error type if it doesn't.
 */
export type DefaultScopeCollection<
  T extends CouchbaseClusterTypes,
  B extends BucketName<T>,
  C extends DefaultScopeCollectionName<T, B>,
> =
  B extends BucketName<T> ?
    DefaultScopeName extends ScopeName<T, B> ?
      Collection<
        T,
        B,
        DefaultScopeName,
        C,
        CollectionDocumentBag<PickCollectionDocument<T, B, DefaultScopeName, C>>
      > :
    MissingDefaultScope<B> :
  never
;

/**
 * Represent the runtime type of a {@link Collection} instance of the default collection inside the default scope.
 * It includes check to ensure the default scope and default collection exists and returns an error type if it doesn't.
 */
export type DefaultCollection<T extends CouchbaseClusterTypes, B extends BucketName<T>> =
  B extends BucketName<T> ?
    DefaultScopeName extends ScopeName<T, B> ?
      DefaultCollectionName extends CollectionName<T, B, DefaultScopeName> ?
        Collection<
          T,
          B,
          DefaultScopeName,
          DefaultCollectionName,
          CollectionDocumentBag<PickCollectionDocument<T, B, DefaultScopeName, DefaultCollectionName>>
        > :
      MissingDefaultCollection<B> :
    MissingDefaultScope<B> :
  never
;
