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
import type { IsAny, IsNever, Or, Pretty } from '../../misc/index.js';
import type { AnyDocDef } from './document.types.js';
import type {
  BucketName,
  CollectionName,
  DefaultCollectionName,
  DefaultScopeName,
  ScopeName,
} from './keyspace.types.js';

type CodeCompletionOptions = {
  array?: 'strict' | 'friendly';
  record?: 'strict' | 'friendly';
  recordPlaceholder?: string;
};

export type ClusterTypesOptions =
  | {
      codeCompletion: CodeCompletionOptions;
      keyMatchingStrategy?: undefined;
    }
  | {
      codeCompletion?: CodeCompletionOptions;
      keyMatchingStrategy?: undefined;
    }
  | {
      codeCompletion?: CodeCompletionOptions;
      keyMatchingStrategy: 'always' | 'firstMatch';
    }
  | {
      codeCompletion?: CodeCompletionOptions;
      keyMatchingStrategy: 'delimiter';
      keyDelimiter: string;
    };

export type OptionsDefinition = {
  '@options'?: ClusterTypesOptions;
};

/**
 * Basic structure for cluster types.
 */
// prettier-ignore
export type CouchbaseClusterTypes = {
  [bucket: string]: BucketTypeDefinition;
} | OptionsDefinition;

type BucketTypeDefinition =
  | {
      [scope: string]: ScopeTypeDefinition;
    }
  | OptionsDefinition;

type ScopeTypeDefinition =
  | {
      [collection: string]: CollectionTypeDefinition;
    }
  | OptionsDefinition;

type CollectionTypeDefinition = ClusterTypesOptions | ReadonlyArray<AnyDocDef> | never[];

export type DefaultKeyspaceOptions = {
  keyMatchingStrategy: 'always';
  codeCompletion: {
    array: 'friendly';
    record: 'friendly';
    recordPlaceholder: '#';
  };
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
  IsDefaultClusterTypes<T> extends true ?
    DefaultKeyspaceOptions :
  T['@options'] extends infer ClusterOptions ?
    B extends keyof T ?
      Extract<T[B], OptionsDefinition> extends infer TB ?
        '@options' extends keyof TB ?
          TB['@options'] extends infer BucketOptions ?
            S extends keyof T[B] ?
              Extract<T[B][S], OptionsDefinition> extends infer TBS ?
                '@options' extends keyof TBS ?
                  Extract<T[B][S], OptionsDefinition>['@options'] extends infer ScopeOptions ?
                    C extends keyof T[B][S] ?
                      Extract<T[B][S][C], ClusterTypesOptions> extends infer CollectionOptions ?
                        MergeOptions<[DefaultKeyspaceOptions, ClusterOptions, BucketOptions, ScopeOptions, CollectionOptions]> :
                      never :
                    never :
                  never :
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
 * Default types used when the end dev don't define their owns.
 */
// prettier-ignore
export type DefaultClusterTypes =
  | { '@options': DefaultKeyspaceOptions }
  | {
      [bucket in string]: {
        // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
        [scope in DefaultScopeName | NonNullable<string>]: {
          // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
          [collection in DefaultCollectionName | NonNullable<string>]: [AnyDocDef];
        };
      };
    };

// prettier-ignore
export type IsDefaultClusterTypes<T> = Or<[IsAny<T>, IsNever<Exclude<keyof T, '@options'>>]>;
