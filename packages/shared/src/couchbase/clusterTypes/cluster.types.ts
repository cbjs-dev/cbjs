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

const clusterTypeOptionsSymbol = Symbol('clusterType');

type OptionsSymbol = typeof clusterTypeOptionsSymbol;

export type ClusterTypesOptions = {
  keyDelimiter: string;
  keyMatchingStrategy: 'always' | 'bestEffort';
};

/**
 * Basic structure for cluster types.
 */
export type CouchbaseClusterTypes = { [options in OptionsSymbol]?: ClusterTypesOptions } & {
  [bucket: string]: { [options in OptionsSymbol]?: ClusterTypesOptions } & {
    [scope: string]: { [options in OptionsSymbol]?: ClusterTypesOptions } & {
      [collection: string]: DocDef;
    };
  };
};

/**
 * Default types used when the end dev don't define their owns.
 */
// prettier-ignore
export type DefaultClusterTypes = {
  [bucket in string | OptionsSymbol]: bucket extends OptionsSymbol
    ? ClusterTypesOptions
    : {
      [scope in
        // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
        | DefaultScopeName
        | NonNullable<string>
        | OptionsSymbol
      ]: scope extends OptionsSymbol
        ? ClusterTypesOptions
        : {
          [collection in
            // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
            | DefaultCollectionName
            | NonNullable<string>
            | OptionsSymbol
          ]: collection extends OptionsSymbol
            ? ClusterTypesOptions
            : DocDef<string, any>;
        };
    };
};

export type IsClusterTypesOptions<T> = OptionsSymbol extends keyof T ? true : false;

export type KeyspaceOptions<T extends ClusterTypesOptions> = {
  [key in keyof T | OptionsSymbol]: key extends keyof T ? T[key] : true;
};

type Merge<T, U> =
  IsNever<T> extends true
    ? U
    : IsNever<U> extends true
      ? T
      : Pretty<Pick<T, Exclude<keyof T, keyof U>> & U>;

type MergeOptions<T extends ReadonlyArray<unknown>> = T extends [infer A, ...infer Rest]
  ? Merge<A, MergeOptions<Rest>>
  : never;

export type GetKeyspaceOptions<
  T extends CouchbaseClusterTypes,
  B extends BucketName<T> = BucketName<T>,
  S extends ScopeName<T, B> = ScopeName<T, B>,
  C extends CollectionName<T, B, S> = CollectionName<T, B, S>,
> =
  T[OptionsSymbol] extends infer ClusterOptions ?
    T[B][OptionsSymbol] extends infer BucketOptions ?
      T[B][S][OptionsSymbol] extends infer ScopeOptions ?
        Extract<T[B][S][C], OptionsSymbol> extends infer CollectionOptions ?
          MergeOptions<[ClusterOptions, BucketOptions, ScopeOptions, CollectionOptions]> :
        never :
      never :
    never :
  never;
