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
import { IsNever, Pretty } from '../../misc';
import { DocDef } from './document.types';
import { BucketName, CollectionName, DefaultCollectionName, DefaultScopeName, ScopeName } from './keyspace.types';

export const clusterTypeOptionsSymbol: unique symbol = Symbol('clusterType');

export type ClusterTypesOptionsSymbol = typeof clusterTypeOptionsSymbol;

export type ClusterTypesOptions =
  | {
      keyMatchingStrategy: 'always' | 'firstMatch';
    }
  | {
      keyMatchingStrategy: 'delimiter';
      keyDelimiter: string;
    };

/**
 * Basic structure for cluster types.
 */
// prettier-ignore
export type CouchbaseClusterTypes = { [options in ClusterTypesOptionsSymbol]?: ClusterTypesOptions } & {
  [bucket: string]: { [options in ClusterTypesOptionsSymbol]?: ClusterTypesOptions } & {
    [scope: string]: { [options in ClusterTypesOptionsSymbol]?: ClusterTypesOptions } & {
      [collection: string]: { [options in ClusterTypesOptionsSymbol]?: ClusterTypesOptions } | ReadonlyArray<DocDef>;
    };
  };
};

/**
 * Default types used when the end dev don't define their owns.
 */
// prettier-ignore
export type DefaultClusterTypes = {
  [bucket in string]: {
      [scope in
        // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
        | DefaultScopeName
        | NonNullable<string>
      ]: {
          [collection in
            // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
            | DefaultCollectionName
            | NonNullable<string>
          ]: [ DocDef<string, any> ];
        };
    };
};

export type IsClusterTypesOptions<T> = ClusterTypesOptionsSymbol extends keyof T ? true : false;

export type KeyspaceOptions<T extends ClusterTypesOptions> = {
  [key in keyof T | ClusterTypesOptionsSymbol]: key extends keyof T ? T[key] : true;
};

// prettier-ignore
type Merge<T, U> =
  IsNever<T> extends true ?
    U :
  IsNever<U> extends true ?
    T :
  Pretty<Pick<T, Exclude<keyof T, keyof U>> & U>
;

// prettier-ignore
export type MergeOptions<T extends ReadonlyArray<unknown>> =
  T extends [infer A, ...infer Rest] ?
    A extends ClusterTypesOptions ?
      Merge<A, MergeOptions<Rest>> :
    Merge<never, MergeOptions<Rest>> :
  never
;

// prettier-ignore
export type ClusterTypes<
  OptionsOrDef extends ClusterTypesOptions | CouchbaseClusterTypes,
  KeyspaceDef extends CouchbaseClusterTypes = never
> =
  OptionsOrDef extends ClusterTypesOptions ?
    KeyspaceDef & { [clusterTypeOptionsSymbol]: OptionsOrDef }:
  OptionsOrDef
;

// prettier-ignore
export type BucketTypes<
  OptionsOrDef extends ClusterTypesOptions | CouchbaseClusterTypes[string],
  KeyspaceDef extends CouchbaseClusterTypes[string] = never
> =
  OptionsOrDef extends ClusterTypesOptions ?
    KeyspaceDef & { [clusterTypeOptionsSymbol]: OptionsOrDef }:
  OptionsOrDef
;

// prettier-ignore
export type ScopeTypes<
  OptionsOrDef extends ClusterTypesOptions | CouchbaseClusterTypes[string][string],
  KeyspaceDef extends CouchbaseClusterTypes[string][string] = never
> =
  OptionsOrDef extends ClusterTypesOptions ?
    KeyspaceDef & { [clusterTypeOptionsSymbol]: OptionsOrDef }:
  OptionsOrDef
;

// prettier-ignore
export type CollectionTypes<
  OptionsOrDef extends ClusterTypesOptions | ReadonlyArray<DocDef>,
  DocDefs extends ReadonlyArray<DocDef> = never
> =
  OptionsOrDef extends ClusterTypesOptions ?
    { [clusterTypeOptionsSymbol]: OptionsOrDef } | DocDefs :
  OptionsOrDef
;

export type DefaultKeyspaceOptions = {
  keyMatchingStrategy: 'always';
};

// prettier-ignore
export type GetKeyspaceOptions<
  T extends CouchbaseClusterTypes,
  B extends BucketName<T>,
  S extends ScopeName<T, B>,
  C extends CollectionName<T, B, S>,
> =
  T[ClusterTypesOptionsSymbol] extends infer ClusterOptions ?
    T[B][ClusterTypesOptionsSymbol] extends infer BucketOptions ?
      T[B][S][ClusterTypesOptionsSymbol] extends infer ScopeOptions ?
        Extract<T[B][S][C], { [clusterTypeOptionsSymbol]: ClusterTypesOptions }> extends { [clusterTypeOptionsSymbol]: infer CollectionOptions } ?
          MergeOptions<[DefaultKeyspaceOptions, ClusterOptions, BucketOptions, ScopeOptions, CollectionOptions]> :
        never :
      never :
    never :
  never
;
