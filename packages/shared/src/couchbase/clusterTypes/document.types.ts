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
  And,
  Extends,
  IsAny,
  IsExactly,
  IsNever,
  Or,
  Primitive,
} from '../../misc/index.js';
import { Keyspace } from '../utils/index.js';
import {
  ClusterTypesOptions,
  CouchbaseClusterTypes,
  DefaultClusterTypes,
  GetKeyspaceOptions,
  IsDefaultClusterTypes,
} from './cluster.types.js';
import { BucketName, CollectionName, ScopeName } from './keyspace.types.js';
import { DocumentPath } from './utils/index.js';

export type DocDef<Key extends string = string, Body = any> = {
  Key: Key;
  Body: Body;
  Path: DocumentPath<Body>;
};

/**
 * Union of DocDef declarations (arrays) in a collection. Distributive.
 */
// prettier-ignore
export type KeyspaceDocDefArray<
  T extends CouchbaseClusterTypes = DefaultClusterTypes,
  B extends BucketName<T> = BucketName<T>,
  S extends ScopeName<T, B> = ScopeName<T, B>,
  C extends CollectionName<T, B, S> = CollectionName<T, B, S>,
> =
  IsDefaultClusterTypes<T> extends true ?
    [DocDef] :
  Keyspace<T, B, S, C> extends infer KS extends { bucket: string; scope: string; collection: string } ?
    KS extends unknown ?
      KS['bucket'] extends infer KSB extends BucketName<T> ?
        KSB extends keyof T ?
          KS['scope'] extends infer KSS extends ScopeName<T, KSB> ?
            KSS extends keyof T[KSB] ?
              KS['collection'] extends infer KSC extends CollectionName<T, KSB, KSS> ?
                KSC extends keyof T[KSB][KSS] ?
                  Extract<T[KSB][KSS][KSC], ReadonlyArray<DocDef>> :
                never :
              never :
            never :
          never :
        never :
      never :
    never :
  never
;

/**
 * Union of DocDef in a collection. Distributive.
 */
// prettier-ignore
export type KeyspaceDocDef<
  T extends CouchbaseClusterTypes = DefaultClusterTypes,
  B extends BucketName<T> = BucketName<T>,
  S extends ScopeName<T, B> = ScopeName<T, B>,
  C extends CollectionName<T, B, S> = CollectionName<T, B, S>,
> =
  KeyspaceDocDefArray<T, B, S, C>[number]
;

/**
 * Contains the pre-computer types for the collection.
 */
export type DocumentBag<Def extends DocDef> = {
  Key: Def['Key'];
  Document: Def;
  JsonDocument: JsonDocumentDef<Def>;
  ObjectDocument: ObjectDocumentDef<Def>;
  ObjectDocumentPath: DocumentPath<ObjectDocumentDef<Def>['Body']> | '';
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
export type JsonObject = Exclude<Json, Primitive>;
export type JsonPojo = Exclude<Json, Primitive | ReadonlyArray<unknown>>;

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
// prettier-ignore
export type ObjectDocumentDef<Def extends DocDef> =
  Def extends unknown ?
    Def['Body'] extends object ?
      DocDef<Def['Key'], Def['Body']> :
    never :
  never
;

/**
 * Return all the DocDef of a keyspace that matches the given key accounting for
 * the keyMatchingStrategy of the given keyspace
 */
// prettier-ignore
export type DocDefMatchingKey<
  Key extends string,
  T extends CouchbaseClusterTypes,
  B extends BucketName<T>,
  S extends ScopeName<T, B>,
  C extends CollectionName<T, B, S>,
> =
  IsAny<T> extends true ?
    DocDef :
  IsNever<Exclude<keyof T, '@options'>> extends true ?
    DocDef :
  GetKeyspaceOptions<T, B, S, C> extends infer ResolvedOptions extends ClusterTypesOptions ?
    B extends keyof T ?
      S extends keyof T[B] ?
        C extends keyof T[B][S] ?
          T[B][S][C] extends infer Defs extends ReadonlyArray<DocDef> ?
            Key extends unknown ?
              ResolvedOptions extends { keyMatchingStrategy: 'always' } ?
                Defs[number] extends infer Def extends DocDef ?
                  Def extends unknown ?
                    Key extends Def['Key'] ?
                      Def :
                    never :
                  never :
                never :
              ResolvedOptions extends { keyDelimiter: string; keyMatchingStrategy: 'delimiter' } ?
                MatchDocDefKeyByDelimiter<Key, Defs, ResolvedOptions> :
              ResolvedOptions extends { keyMatchingStrategy: 'firstMatch' } ?
                MatchDocDefKeyFirstMatch<Key, Defs> :
              never :
            never :
          never :
        never :
      never :
    never :
  never
;

// prettier-ignore
export type MatchDocDefKeyByDelimiter<
  Key extends string,
  CompareSet extends ReadonlyArray<DocDef>,
  Options extends { keyDelimiter: string }
> =
  CompareSet extends [infer HeadDocDef extends DocDef, ...infer Rest extends ReadonlyArray<DocDef>] ?
    Key extends HeadDocDef['Key'] ?
      // If it matches a longer template, it means it's not the more precise template
      Key extends `${HeadDocDef['Key']}${Options['keyDelimiter']}${string}` ?
        MatchDocDefKeyByDelimiter<Key, Rest, Options> :
      HeadDocDef | MatchDocDefKeyByDelimiter<Key, Rest, Options> :
    MatchDocDefKeyByDelimiter<Key, Rest, Options> :
  never
;

// prettier-ignore
export type MatchDocDefKeyFirstMatch<Key extends string, CompareSet extends ReadonlyArray<DocDef>> =
  CompareSet extends [infer HeadDocDef extends DocDef, ...infer Rest extends ReadonlyArray<DocDef>] ?
    Key extends HeadDocDef['Key'] ?
      HeadDocDef :
    MatchDocDefKeyFirstMatch<Key, Rest> :
  never
;

// prettier-ignore
export type DocDefMatchingBody<
  Body,
  T extends CouchbaseClusterTypes,
  B extends BucketName<T>,
  S extends ScopeName<T, B>,
  C extends CollectionName<T, B, S>,
> =
  KeyspaceDocDefArray<T, B, S, C> extends infer Defs extends ReadonlyArray<unknown> ?
    Body extends unknown ?
      Defs[number] extends infer Def extends DocDef ?
        Def extends unknown ?
          Def['Body'] extends Body ?
            Def :
          never :
        never :
      never :
    never :
  never
;
