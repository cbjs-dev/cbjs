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
import { type If, IsAny, IsNever, Primitive } from '../../misc/index.js';
import { Keyspace } from '../utils/index.js';
import {
  ClusterTypesOptions,
  CouchbaseClusterTypes,
  DefaultClusterTypes,
  GetKeyspaceOptions,
  IsDefaultClusterTypes,
} from './cluster.types.js';
import { BucketName, CollectionName, ScopeName } from './keyspace.types.js';
import { LookupInMacroShape } from './lookupInMacro.types.js';
import {
  DocumentPath,
  type ExtractPathToArray,
  type ExtractPathToObject,
} from './utils/index.js';

export type OperationPath<Doc, Path> = If<
  IsFuzzyDocument<Doc>,
  string | LookupInMacroShape,
  Path
>;

export type DocDef<
  Key extends string = string,
  Body = any,
  Path extends string = DocumentPath<Body>,
> = Key extends unknown
  ? {
      Key: Key;
      Body: Body;
      Path: Path;
      LookupPath: {
        get: DocDefLookupPath<'get', Body, Path>;
        exists: DocDefLookupPath<'exists', Body, Path>;
        count: DocDefLookupPath<'count', Body, Path>;
      };
    }
  : never;

// prettier-ignore
export type DocDefLookupPath<SpecName extends 'get' | 'exists' | 'count', Body, Path extends string> =
  SpecName extends 'get' ? OperationPath<Body, Path | LookupInMacroShape | ''> :
  SpecName extends 'exist' ? OperationPath<Body, Path | LookupInMacroShape> :
  SpecName extends 'count' ? If<
    IsFuzzyDocument<Body>,
    string | LookupInMacroShape<'$document'>,
    | ExtractPathToObject<Body, Path | ''>
    | ExtractPathToArray<Body, Path | ''>
    | LookupInMacroShape<'$document'>
  > : never
;

type MutationSpecName =
  | 'insert'
  | 'upsert'
  | 'remove'
  | 'arrayInsert'
  | 'arrayAppend'
  | 'arrayPrepend'
  | 'increment'
  | 'decrement';

// export type DocDefMutationPath<SpecName extends MutationSpecName, Body, Path> =
//   SpecName extends 'insert' ?  :
//   never
// ;

export type DocDefKeyShape = { Key: string };
export type DocDefBodyShape = { Body: any };
export type DocDefPathShape = { Path: string };
export type DocDefBodyPathShape = { Path: string; Body: any };
export type DocDefKeyBodyShape = { Key: string; Body: any };
export type DocDefKeyBodyPathShape = { Key: string; Path: string; Body: any };
export type DocDefLookupGetPathShape = {
  LookupPath: { get: string | LookupInMacroShape };
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
    readonly [DocDef] :
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
 * Return `true` if sub-document information cannot be inferred from `T`.
 */
// prettier-ignore
export type IsFuzzyDocument<T> =
  IsNever<keyof T> extends true ? true :
  string extends keyof T ? true :
  symbol extends keyof T ? true :
  T extends ReadonlyArray<unknown> ? false :
  number extends keyof T ? true :
  false
;

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
 * Subset of Json types that extend `object`.
 */
export type JsonObject = Exclude<Json, Primitive>;

/**
 * Extract definitions of documents on which you can perform sub-document operations.
 */
// prettier-ignore
export type ObjectDocumentDef<Def extends DocDefBodyShape> =
  Def extends unknown ?
    Def['Body'] extends object ?
      Def :
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
                MatchDocDefKeyAlways<Key, Defs> :
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
export type MatchDocDefKeyAlways<
  Key extends string,
  Defs,
> =
  Defs extends ReadonlyArray<unknown> ?
    Defs[number] extends infer Def extends DocDefKeyShape ?
      Def extends unknown ?
        Key extends Def['Key'] ?
          Def :
        never :
      never :
    never :
  never
;

// prettier-ignore
export type MatchDocDefKeyByDelimiter<
  Key extends string,
  CompareSet,
  Options extends { keyDelimiter: string }
> = MatchDocDefKeyByDelimiterTRE<Key, CompareSet, Options, never>;

// prettier-ignore
export type MatchDocDefKeyByDelimiterTRE<
  Key extends string,
  CompareSet,
  Options extends { keyDelimiter: string },
  Acc extends DocDefKeyShape
> =
  CompareSet extends [infer HeadDocDef extends DocDefKeyShape, ...infer Rest] ?
    Key extends HeadDocDef['Key'] ?
      // If it matches a longer template, it means it's not the more precise template
      Key extends `${HeadDocDef['Key']}${Options['keyDelimiter']}${string}` ?
        MatchDocDefKeyByDelimiterTRE<Key, Rest, Options, Acc> :
        MatchDocDefKeyByDelimiterTRE<Key, Rest, Options, Acc | HeadDocDef> :
      MatchDocDefKeyByDelimiterTRE<Key, Rest, Options, Acc> :
    Acc
  ;

// prettier-ignore
export type MatchDocDefKeyFirstMatch<Key extends string, CompareSet> =
  CompareSet extends [infer HeadDocDef extends DocDefKeyShape, ...infer Rest] ?
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
      Defs[number] extends infer Def extends DocDefBodyShape ?
        Def extends unknown ?
          Def['Body'] extends Body ?
            Def :
          never :
        never :
      never :
    never :
  never
;
