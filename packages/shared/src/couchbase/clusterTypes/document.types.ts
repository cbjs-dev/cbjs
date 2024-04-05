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
import { IsAny, IsExactly, IsNever, Or } from '../../misc';
import {
  BucketName,
  CollectionName,
  CouchbaseClusterTypes,
  ScopeName,
} from './keyspace.types';
import { DocumentPath } from './utils';

export type DocDef<Key extends string = string, Body = unknown> = {
  Key: Key;
  Body: Body;
};

/**
 * Union of all of `T` values. Distributive.
 *
 * @internal
 */
type UnwindUnionObjectValues<T> = T extends unknown ? T[keyof T] : never;

/**
 * Union of DocDef in a collection. Distributive.
 */
export type KeyspaceDocDef<
  T extends CouchbaseClusterTypes,
  B extends BucketName<T> = BucketName<T>,
  S extends ScopeName<T, B> = ScopeName<T, B>,
  C extends CollectionName<T, B, S> = CollectionName<T, B, S>,
> =
  B extends BucketName<T>
    ? S extends ScopeName<T, B>
      ? C extends CollectionName<T, B, S>
        ? Extract<UnwindUnionObjectValues<T[B][S]>, T[B][S][C]>
        : never
      : never
    : never;

/**
 * Contains the pre-computer types for the collection.
 */
export type DocumentBag<Def extends DocDef> = {
  Key: Def['Key'];
  Document: Def;
  JsonDocument: JsonDocumentDef<Def>;
  ObjectDocument: ObjectDocumentDef<Def>;
  ObjectDocumentPath: DocumentPath<ObjectDocumentDef<Def>['body']> | '';
};

/**
 * Return `true` if sub-document information cannot be inferred from `T`.
 */
export type IsFuzzyDocument<T> = Or<
  [
    IsExactly<T, object>,
    IsExactly<string, keyof T>,
    IsExactly<string | number, keyof T>,
    IsExactly<string | number | symbol, keyof T>,
    IsNever<keyof T>,
    IsAny<T>,
  ]
>;

/**
 * A JSON object.
 */
export type Json =
  | string
  | number
  | boolean
  | null
  | ReadonlyArray<Json>
  | { [key: string]: Json };

/**
 * Couchbase document types.
 */
export type CouchbaseDocumentTypes = {
  'JSON': Json;
  'UTF-8': string;
  'RAW': NodeJS.TypedArray;
  'PRIVATE': unknown;
};

/**
 * Subset of Json types that extend `object`.
 */
export type JsonObject = Extract<CouchbaseDocumentTypes['JSON'], object>;

/**
 * Extract definitions of JSON documents.
 */
export type JsonDocumentDef<T extends DocDef> = T extends infer Doc extends DocDef
  ? Doc['Body'] extends CouchbaseDocumentTypes['JSON']
    ? Doc
    : never
  : never;

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
export type ObjectDocumentDef<T extends DocDef> = T extends infer Doc extends DocDef
  ? Doc['Body'] extends object
    ? DocDef<Doc['Key'], Doc['Body']>
    : never
  : never;

/**
 * Extract document definitions where the body extends `E`.
 */
export type ExtractDefByBody<Def extends DocDef, Body> = Def extends unknown
  ? Def['Body'] extends infer DocBody
    ? DocBody extends Body
      ? Def
      : never
    : never
  : never;

export type ExtractDocDefByKey<
  Def extends DocDef,
  Key extends string,
> = Key extends unknown
  ? Def extends unknown
    ? Key extends Def['Key']
      ? Def
      : never
    : never
  : never;

export type ExtractDocBodyByKey<
  Def extends DocDef,
  Key extends string,
> = Key extends unknown
  ? Def extends unknown
    ? Key extends Def['Key']
      ? Def['Body']
      : never
    : never
  : never;
