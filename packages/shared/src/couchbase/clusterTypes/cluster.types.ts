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
import { IsAny, IsNever, Pretty } from '../../misc/index.js';
import { DocDef, KeyspaceDocDef } from './document.types.js';
import {
  BucketName,
  CollectionName,
  DefaultCollectionName,
  DefaultScopeName,
  ScopeName,
} from './keyspace.types.js';

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
export type CouchbaseClusterTypes = {
  options?: ClusterTypesOptions;
  definitions: {
    [bucket: string]: BucketTypeDefinition;
  };
};

type BucketTypeDefinition = {
  options?: ClusterTypesOptions;
  definitions: {
    [scope: string]: ScopeTypeDefinition;
  };
};

type ScopeTypeDefinition = {
  options?: ClusterTypesOptions;
  definitions: {
    [collection: string]: CollectionTypeDefinition;
  };
};

type CollectionTypeDefinition = {
  options?: ClusterTypesOptions;
  definitions: ReadonlyArray<DocDef<string, any>>;
};

// input types //
type RawClusterTypeDefinitions = { [bucket: string]: InputBucketTypeDefinitions };

type RawBucketTypeDefinitions = { [scope: string]: InputScopeTypeDefinitions };
type InputBucketTypeDefinitions =
  | RawBucketTypeDefinitions
  | {
      options?: ClusterTypesOptions;
      definitions: RawBucketTypeDefinitions;
    };

type RawScopeTypeDefinitions = { [collection: string]: InputCollectionTypeDefinitions };
type InputScopeTypeDefinitions =
  | RawScopeTypeDefinitions
  | {
      options?: ClusterTypesOptions;
      definitions: RawScopeTypeDefinitions;
    };

type RawCollectionTypeDefinitions = ReadonlyArray<DocDef<string, any>>;
type InputCollectionTypeDefinitions =
  | RawCollectionTypeDefinitions
  | {
      options?: ClusterTypesOptions;
      definitions: RawCollectionTypeDefinitions;
    };
//////////////

/**
 * This is the public facing type to normalize the cluster types as a whole
 */
// prettier-ignore
export type ClusterTypes<
  OptionsOrDef extends ClusterTypesOptions | RawClusterTypeDefinitions,
  KeyspaceDef extends RawClusterTypeDefinitions = never
> =
  NormalizeTypesTuple<RawClusterTypeDefinitions, OptionsOrDef, KeyspaceDef> extends [infer Opts, infer Defs] ?
    {
      options: Opts;
      definitions: { [bucket in keyof Defs]:
        Defs[bucket] extends RawBucketTypeDefinitions ?
          BucketTypes<Defs[bucket]> :
        Defs[bucket]
      }
    } :
  never
;

// prettier-ignore
export type BucketTypes<
  OptionsOrDef extends ClusterTypesOptions | RawBucketTypeDefinitions,
  KeyspaceDef extends RawBucketTypeDefinitions = never
> =
  NormalizeTypesTuple<RawBucketTypeDefinitions, OptionsOrDef, KeyspaceDef> extends [infer Opts, infer Defs] ?
    {
      options: Opts;
      definitions: { [scope in keyof Defs]:
        Defs[scope] extends RawScopeTypeDefinitions ?
          ScopeTypes<Defs[scope]> :
        Defs[scope]
      }
    } :
  never
;

// prettier-ignore
export type ScopeTypes<
  OptionsOrDef extends ClusterTypesOptions | RawScopeTypeDefinitions,
  KeyspaceDef extends RawScopeTypeDefinitions = never
> =
  NormalizeTypesTuple<InputScopeTypeDefinitions, OptionsOrDef, KeyspaceDef> extends [infer Opts, infer Defs] ?
    {
      options: Opts;
      definitions: { [collection in keyof Defs]:
        Defs[collection] extends RawCollectionTypeDefinitions ?
          CollectionTypes<Defs[collection]> :
        Defs[collection]
      }
    } :
  never
;

// prettier-ignore
export type CollectionTypes<
  OptionsOrDef extends ClusterTypesOptions | ReadonlyArray<DocDef>,
  DocDefs extends ReadonlyArray<DocDef> = never
> =
  NormalizeTypesTuple<ReadonlyArray<DocDef<string, any>>, OptionsOrDef, DocDefs> extends [infer Opts, infer Defs] ?
    { options: Opts, definitions: Defs } :
  never
;

// prettier-ignore
type NormalizeTypesTuple<T, A extends ClusterTypesOptions | T , B extends T = never> =
  A extends ClusterTypesOptions ?
    B extends T ?
      [A, B] :
    never :
  A extends T ?
    [never, A] :
  never
;

export type DefaultKeyspaceOptions = {
  keyMatchingStrategy: 'always';
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
export type GetKeyspaceOptions<
  T extends CouchbaseClusterTypes,
  B extends BucketName<T>,
  S extends ScopeName<T, B>,
  C extends CollectionName<T, B, S>,
> =
  IsAny<T> extends true ?
    DefaultKeyspaceOptions :
    T['options'] extends infer ClusterOptions ?
      T['definitions'][B]['options'] extends infer BucketOptions ?
        T['definitions'][B]['definitions'][S]['options'] extends infer ScopeOptions ?
          T['definitions'][B]['definitions'][S]['definitions'][C]['options'] extends infer CollectionOptions ?
          MergeOptions<[DefaultKeyspaceOptions, ClusterOptions, BucketOptions, ScopeOptions, CollectionOptions]> :
        never :
      never :
    never :
  never
;

/**
 * Default types used when the end dev don't define their owns.
 */
// prettier-ignore
export type DefaultClusterTypes = {
  options: { keyMatchingStrategy: 'always' };
  definitions: {
    [bucket in string]: {
      definitions: {
        [scope in
          // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
          | DefaultScopeName
          | NonNullable<string>
        ]: {
          definitions: {
            [collection in
              // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
              | DefaultCollectionName
              | NonNullable<string>
            ]: { definitions: [ DocDef<string, any> ] };
          }
        };
      }
    };
  }
};
