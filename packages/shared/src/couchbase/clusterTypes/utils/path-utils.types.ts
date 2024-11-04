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

/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
import type { And, IsExactly, IsNever, Not } from '../../../misc/index.js';
import type { IsFuzzyDocument } from '../document.types.js';
import type {
  ArrayAppendElement,
  ArrayIndexes,
  ArrayInfo,
  ArrayInfoShape,
  ArrayLastElement,
  ArrayPrependElement,
  IsArrayLengthFixed,
  ResolveIndex,
} from './array-utils.types.js';
import type { OptionalKeys, WritableKeys } from './misc-utils.types.js';

type AccessibleKey = string | number;

// prettier-ignore
export type FriendlyPathToArrayIndex<Path> =
  Path extends unknown ?
    Path extends `${infer PathToArray}[${infer Index extends number}]` ?
      number extends Index ?
        Path | `${PathToArray}[]` :
        Path :
      Path :
    never
;

// There is no 'arrayAddUnique' because it's the same as 'arrayAppend'.
export type KvOperation =
  | 'get' // LookupIn
  | 'exists'
  | 'count'
  | 'upsert' // MutateIn
  | 'replace'
  | 'remove'
  | 'arrayAppend'
  | 'arrayPrepend'
  | 'arrayInsert'
  | 'binary';

type CodeCompletionBagShape = [KvOperation, string, unknown][];
export type UnionToTree<T> = {
  [Op in T extends [string, string, unknown?] ? T[0] : never]: Extract<
    T,
    [Op, string, unknown?]
  >;
};

// prettier-ignore
type MergeCodeCompletionTrees<T, U> = {
  [Op in keyof T | keyof U ]:
  | (Op extends keyof T ? T[Op] : never)
  | (Op extends keyof U ? U[Op] : never)
};

// TODO remove that type
type FuzzyBag<Op> = Op extends
  | 'get'
  | 'insert'
  | 'upsert'
  | 'replace'
  | 'remove'
  | 'arrayAppend'
  | 'arrayPrepend'
  | 'arrayInsert'
  | 'increment'
  | 'decrement'
  ? [Op, string, any]
  : [Op, string];

type CodeCompletionOptions = {
  friendlyArray: boolean;
  friendlyRecord: boolean;
};

// prettier-ignore
export type OpCodeCompletionPath<Op extends KvOperation, Doc> =
  DocumentCodeCompletion<Op, Doc>[1];

// prettier-ignore
export type OpCodeCompletionValue<Op extends KvOperation, Doc, Path> = DocumentCodeCompletion<Op, Doc>[2];

type T = OpCodeCompletionValue<'get', any, 'title'>;
// type TDCC = DocumentCodeCompletion<'get', any>;
// type TDCCE = Extract<DocumentCodeCompletion<'get', any>, ['get', string, unknown]>[2];

type CodeCompletionTreeShape = Partial<{
  [Op in KvOperation]: {
    [path: string]: unknown;
  };
}>;

// prettier-ignore
export type DocumentCodeCompletion<Op, T> =
  T extends object ?
    IsFuzzyDocument<T> extends false ?
      BuildBag<Op, '', T, CodeCompletion<Op, '', T, T>> :
    FuzzyBag<Op> :
  never
;

// prettier-ignore
type BuildBag<Op, PathToT extends string, T, UnionStack> =
  T extends ReadonlyArray<unknown> ?
    keyof T extends infer Index ?
      Index extends keyof T & number ?
        BuildBag<Op, `${PathToT}[${Index}]`, T[Index], UnionStack | CodeCompletion<Op, `${PathToT}[${Index}]`, T, T[Index]>> :
      never :
    never :

  T extends Record<string, unknown> ?
    keyof T extends infer Key ?
      Key extends keyof T & string ?
        PathToT extends '' ?
          BuildBag<Op, Key, T[Key], UnionStack | CodeCompletion<Op, `${Key}.`, T, T[Key]>> :
        BuildBag<Op, `${PathToT}.${Key}`, T[Key], UnionStack | CodeCompletion<Op, `${PathToT}.${Key}`, T, T[Key]>> :
      never :
    never :

  UnionStack | CodeCompletion<Op, PathToT, T, T>
;

/**
 * Code completion for an array document.
 */
// prettier-ignore
type CodeCompletion<CCT extends CodeCompletionTreeShape, Op, Path extends string, Parent, T> =
  T extends ReadonlyArray<unknown> | Record<string, unknown> ?
    Op extends 'get' ?
      GetCodeCompletion<CCT, Path, T> :
    Op extends 'exists' ?
      ExistsCodeCompletion<Path, T> :
    Op extends 'count' ?
      CountCodeCompletion<Path, Parent> :

    Op extends 'upsert' ?
      UpsertCodeCompletion<Path, T> :
    Op extends 'replace' ?
      ReplaceCodeCompletion<Path, T> :
    Op extends 'remove' ?
      RemoveCodeCompletion<Path, T> :

    Op extends 'arrayAppend' ?
      ArrayAppendCodeCompletion<Path, T> :
    Op extends 'arrayPrepend' ?
      ArrayPrependCodeCompletion<Path, T> :
    Op extends 'arrayInsert' ?
      ArrayInsertCodeCompletion<Path, T> :
    never :

  Op extends 'binary' ?
    BinaryCodeCompletion<Path, T> :
  never
;

// # Don't forget to add the '.' after the path to an object's property, before passing
// # it to Completion functions

// prettier-ignore
export type GetCodeCompletion<CCT extends CodeCompletionTreeShape, PathPrefix extends string, T> =
  T extends ReadonlyArray<unknown> ?
    ArrayIndexes<T> extends infer Index ?
      Index extends number ?
        CCT & {
          get: {
            [K in `${PathPrefix}[${Index}]`]: T[ResolveIndex<T, Index>];
          } & {
            [K in `${PathPrefix}[-1]`]: ArrayLastElement<T>;
          }
        } :
      never :
    never :
  keyof T extends infer Key ?
    Key extends keyof T & AccessibleKey ?
      ['get', `${PathPrefix}${Key}`, Exclude<T[Key], undefined>] :
    never :
  never
;

// prettier-ignore
export type ExistsCodeCompletion<PathPrefix extends string, T> =
  GetCodeCompletion<PathPrefix, T> extends readonly ['get', infer P, unknown] ?
    P extends string ?
      ['exists', P] :
    never :
  never
;

// prettier-ignore
export type CountCodeCompletion<PathPrefix extends string, T> =
  T extends ReadonlyArray<unknown> | Record<string, unknown> ?
    PathPrefix extends `${infer Dotless}.` ?
      ['count', Dotless] :
    ['count', PathPrefix] :
  never
;

// prettier-ignore
export type ArrayAppendCodeCompletion<PathPrefix, T> =
  T extends ReadonlyArray<unknown> ?
    ArrayAppendElement<T> extends infer Element ?
      IsNever<Element> extends true ?
        never :
      ['arrayAppend', PathPrefix, Element] :
    never :
  never
;

// prettier-ignore
export type ArrayPrependCodeCompletion<PathPrefix, T> =
  T extends ReadonlyArray<unknown> ?
    ArrayPrependElement<T> extends infer Element ?
      IsNever<Element> extends true ?
        never :
      ['arrayPrepend', PathPrefix, Element] :
    never :
  never
;

// prettier-ignore
export type ArrayInsertCodeCompletion<PathPrefix extends string, T> =
  T extends ReadonlyArray<unknown> ?
    IsArrayLengthFixed<T> extends true ?
      never :
    ArrayInfo<T> extends infer ArrInfo extends ArrayInfoShape ?
      ArrInfo['OptionalIndexes'] extends infer Index extends number ?
        ['arrayInsert', `${PathPrefix}[${Index}]`, ArrInfo['RestElement']] :
      never :
    never :
  never
;

// prettier-ignore
export type ReplaceCodeCompletion<PathPrefix extends string, T> =
  // Array
  T extends ReadonlyArray<unknown> ?
    IsExactly<T, Readonly<T>> extends true ?
      never :
    | ['replace', `${PathPrefix}[-1]`, Exclude<ArrayLastElement<T>, undefined>]
    | (
      ArrayIndexes<T> extends infer Index ?
        Index extends number ?
          | ['replace', `${PathPrefix}[${Index}]`, Exclude<T[Index], undefined>]
          :
        never :
      never
    ) :

  // Object
  WritableKeys<T> extends infer Key ?
    Key extends keyof T & AccessibleKey ?
      ['replace', `${PathPrefix}${Key}`, Exclude<T[Key], undefined>] :
    never :
  never
;

// prettier-ignore
export type RemoveCodeCompletion<PathPrefix extends string, T> =
  // Array
  T extends ReadonlyArray<unknown> ?
    IsArrayLengthFixed<T> extends true ?
      never :
    ArrayInfo<T> extends infer Info extends ArrayInfoShape ?
      Info['OptionalIndexes'] extends infer Index extends number ?
        And<[Info['IsTailStatic'], Not<IsExactly<Info['RestElement'], Info['StaticSlice'][number]>>]> extends true ?
          ['remove', `${PathPrefix}[${Index}]`] :
        ['remove', `${PathPrefix}[-1]`] | ['remove', `${PathPrefix}[${Index}]`] :
      never :
    never :

  // Object
  OptionalKeys<T> extends infer Key ?
    Key extends AccessibleKey ?
      ['remove', `${PathPrefix}${Key}`] :
    never :
  never
;

// prettier-ignore
export type UpsertCodeCompletion<PathPrefix extends string, T> =
  ReplaceCodeCompletion<PathPrefix, T> extends infer RCC ?
    RCC extends readonly ['replace', infer P, infer V] ?
      ['upsert', P, V] :
    never :
  never
;

// prettier-ignore
export type BinaryCodeCompletion<PathPrefix extends string, T> =
  number extends T ?
    PathPrefix extends `${infer Dotless}.` ?
      ['binary', Dotless] :
    ['binary', PathPrefix] :
  never
;
