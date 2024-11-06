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
import type { If, IsNever, Not } from '../../../misc/index.js';
import type { IsFuzzyDocument } from '../document.types.js';
import {
  ArrayAppendElement,
  ArrayHasAscendingInheritance,
  ArrayHasDescendingInheritance,
  ArrayInfo,
  ArrayInfoShape,
  ArrayKnownIndexes,
  ArrayLastElement,
  ArrayPrependElement,
  ArraySlice,
  IsLastElementRemovable,
  IsReadonlyArray,
  IsVariadicArray,
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
  // LookupIn
  | 'get'
  | 'exists'
  | 'count'
  | 'upsert'
  // MutateIn
  | 'replace'
  | 'remove'
  | 'arrayAppend'
  | 'arrayPrepend'
  | 'arrayInsert'
  | 'binary';

type FuzzyCC = [any, any, any];

type CodeCompletionOptions = {
  friendlyArray: boolean;
  friendlyRecord: boolean;
};

// prettier-ignore
export type OpCodeCompletionPath<Op extends KvOperation, Doc> =
  DocumentCodeCompletion<Op, Doc>;

// prettier-ignore
export type OpCodeCompletionValue<Op extends KvOperation, Doc, Path> =
  Op extends 'get' | 'upsert' | 'insert' ?
    Path extends '' ?
      Doc :
      ExtractMatchingCC<DocumentCodeCompletion<Op, Doc>, Op, Path>[2] :
    ExtractMatchingCC<DocumentCodeCompletion<Op, Doc>, Op, Path>[2]
;

// prettier-ignore
type ExtractMatchingCC<CC, UserOp, UserPath> =
  CC extends unknown ?
    CC extends [UserOp, infer Path, unknown?] ?
      UserPath extends Path ?
        CC :
      never :
    never :
  never
;

// prettier-ignore
export type DocumentCodeCompletion<Op, T> =
  T extends object ?
    IsFuzzyDocument<T> extends false ?
      Extract<BuildBag<'', T, CodeCompletionSinglePass<'', T>>, [Op, string, unknown?]> :
    FuzzyCC :
  never
;

// prettier-ignore
export type DocumentCodeCompletionAll<T> =
  T extends object ?
    IsFuzzyDocument<T> extends false ?
      BuildBag<'', T, CodeCompletionSinglePass<'', T>> :
    FuzzyCC :
  never
;

type TDCC = DocumentCodeCompletion<'upsert', { title: string }>;

// prettier-ignore
type BuildBag<PathToT extends string, T, UnionStack> =
  T extends ReadonlyArray<unknown> ?
    keyof T extends infer Index ?
      Index extends keyof T & number ?
        Exclude<T[Index], undefined> extends infer SubDoc ?
          BuildBag<`${PathToT}[${Index}]`, SubDoc, UnionStack | CodeCompletionSinglePass<`${PathToT}[${Index}]`, SubDoc>> :
        never :
      never :
    never :

  T extends Record<string, unknown> ?
    keyof T extends infer Key ?
      Key extends keyof T & string ?
        Exclude<T[Key], undefined> extends infer SubDoc ?
          BuildBag<ConcatPath<PathToT, Key>, SubDoc, UnionStack | CodeCompletionSinglePass<ConcatPath<PathToT, Key>, SubDoc>> :
        never :
      never :
    never :

  UnionStack | CodeCompletionSinglePass<PathToT, T>
;

// prettier-ignore
export type CodeCompletionSinglePass<Path extends string, T> =
  | ['get', Path, T]
  | (Path extends '' ? ['upsert', '', T] : never)
  | CCArray<Path, T>
  | CCObject<Path, T>
;

// prettier-ignore
type CCArray<Path extends string, T> =
  T extends ReadonlyArray<unknown> ?
    IsReadonlyArray<T> extends true ?
      CCReadArray<Path, T> :
    (
    | CCReadArray<Path, T>
    | CCArrayNonVariadic<Path, T>
    | CCArrayVariadic<Path, T>
    | ['upsert', Path, T]
    )
    :
  never
;

// prettier-ignore
type CCReadArray<Path extends string, T extends ReadonlyArray<unknown>> =
  | ['count', `${Path}`]
  | ['get', `${Path}[-1]`, Exclude<ArrayLastElement<T>, undefined>]
  | (
    ArrayKnownIndexes<T> extends infer IndexTuple ?
      IndexTuple extends [infer Index extends number] ?
        | ['get', `${Path}[${Index}]`, Exclude<T[Index], undefined>]
        | ['exists', `${Path}[${Index}]`]
        :
      never :
    never
    )
;

// prettier-ignore
type CCArrayNonVariadic<Path extends string, T extends ReadonlyArray<unknown>> =
  IsVariadicArray<T> extends false ?
    | ['replace', `${Path}[-1]`, ArrayLastElement<T>]
    | CCArrayBinary<Path, T>
    | (ArrayKnownIndexes<T> extends infer IndexTuple ?
      IndexTuple extends [infer Index extends keyof T & number] ?
        ['replace', `${Path}[${Index}]`, T[Index]] :
      never :
    never) :
  never
;

// TODO exclude GuaranteedIndexes from replace paths
//  find a way to express that in the tuple
//  and adjust the type in the function using the tuple
// prettier-ignore
type CCArrayVariadic<Path extends string, T extends ReadonlyArray<unknown>> =
  IsVariadicArray<T> extends true ?
    | CCArrayBinary<Path, T>
    | CCArrayReplace<Path, T>
    | CCArrayRemove<Path, T>
    | CCArrayAppend<Path, T>
    | CCArrayPrepend<Path, T>
    | CCArrayInsert<Path, T>
    :
  never
;

type CanBeNumber<T> = Not<IsNever<Extract<T, number>>>;

// prettier-ignore
type CCArrayBinary<Path extends string, T extends ReadonlyArray<unknown>> =
  | If<CanBeNumber<ArrayLastElement<T>>, ['binary', `${Path}[-1]`]>
  | (ArrayKnownIndexes<T> extends infer IndexTuple ?
      IndexTuple extends [infer Index extends number] ?
        If<CanBeNumber<T[Index]>, ['binary', `${Path}[${Index}]` ]> :
      never :
    never
    )
;

// prettier-ignore
type CCArrayReplace<Path extends string, T extends ReadonlyArray<unknown>> =
  | ['replace', `${Path}[-1]`, Exclude<ArrayLastElement<T>, undefined>]
  | (ArrayKnownIndexes<T> extends infer IndexTuple ?
      IndexTuple extends [infer Index extends number] ?
        ['replace', `${Path}[${Index}]`, Exclude<T[Index], undefined>] :
      never :
    never
    )
;

// prettier-ignore
type CCArrayRemove<Path extends string, T extends ReadonlyArray<unknown>> =
  | ['remove', `${Path}[-1]`, IsLastElementRemovable<T>]
  | (ArrayInfo<T> extends infer Info extends ArrayInfoShape ?
      Info['IsFullyStatic'] extends true ?
        never :
      ArrayKnownIndexes<T> extends infer IndexTuple ?
        IndexTuple extends [infer Index extends number] ?
          number extends Index ?
            ['remove', `${Path}[${Index}]`, true] :
          ['remove', `${Path}[${Index}]`, If<ArrayHasDescendingInheritance<ArraySlice<T, Index>>, true, false>] :
        never :
      never :
    never
    )
;

// prettier-ignore
type CCArrayAppend<Path extends string, T extends ReadonlyArray<unknown>> =
  ArrayAppendElement<T> extends infer E ?
    If<IsNever<E>, never, ['arrayAppend', Path, E]> :
  never
;

// prettier-ignore
type CCArrayPrepend<Path extends string, T extends ReadonlyArray<unknown>> =
  ArrayPrependElement<T> extends infer E ?
    If<IsNever<E>, never, ['arrayPrepend', Path, E]> :
  never
;

// prettier-ignore
type CCArrayInsert<Path extends string, T extends ReadonlyArray<unknown>> =
  ArrayInfo<T> extends infer Info extends ArrayInfoShape ?
    Info['IsFullyStatic'] extends true ?
      never :
    ArrayKnownIndexes<T> extends infer IndexTuple ?
      IndexTuple extends [infer Index extends number] ?
        number extends Index ?
          ['arrayInsert', `${Path}[${Index}]`, Info['RestElement']] :
        ['arrayInsert', `${Path}[${Index}]`, If<ArrayHasAscendingInheritance<ArraySlice<T, Index>>, Exclude<T[Index], undefined>>] :
      never :
    never :
  never
;

// prettier-ignore
type CCObject<Path extends string, T> =
  T extends Record<string, unknown> ?
    OptionalKeys<T> extends infer OptionalKey ?
      WritableKeys<T> extends infer WritableKey ?
        keyof T extends infer Key ?
          Key extends keyof T & AccessibleKey ?
            | CCObjectReadableKey<Path, T, Key>
            | (Key extends WritableKey ? CCObjectWritableKey<Path, T, Key> : never)
            | (Key extends OptionalKey & WritableKey ? CCObjectOptionalKey<Path, T, Key> : never)
            :
          never :
        never :
      never :
    never :
  never
;

// prettier-ignore
type CCObjectReadableKey<Path extends string, T, Key extends keyof T & AccessibleKey> =
  | ['get', ConcatPath<Path, Key>, Exclude<T[Key], undefined>]
  | ['exists', ConcatPath<Path, Key>]
  | ['count', Path]

// prettier-ignore
type CCObjectOptionalKey<Path extends string, T, Key extends keyof T & AccessibleKey> =
  | ['insert', ConcatPath<Path, Key>, Exclude<T[Key], undefined>]
  | ['remove', ConcatPath<Path, Key>, true]
;

// prettier-ignore
type CCObjectWritableKey<Path extends string, T, Key extends keyof T & AccessibleKey> =
  | ['upsert', ConcatPath<Path, Key>, Exclude<T[Key], undefined>]
  | ['replace', ConcatPath<Path, Key>, Exclude<T[Key], undefined>]
  | (Exclude<T[Key], undefined> extends number ? ['binary', ConcatPath<Path, Key>] : never)
;

type ConcatPath<Path extends string, Key extends AccessibleKey> = Path extends ''
  ? Key
  : `${Path}.${Key}`;

///////////////////////
// Dev utility types //
///////////////////////

/**
 * @internal
 */
export type FilterCC<CC, PathPrefix extends string> = CC extends infer Tuple
  ? Tuple extends [infer Op, infer Path, (infer Value)?]
    ? Path extends `${PathPrefix}${string}`
      ? [Op, Path, Value]
      : never
    : never
  : never;

/**
 * @internal
 */
export type UnionToTree<T> = {
  [Op in T extends [string, string, unknown?] ? T[0] : never]: Extract<
    T,
    [Op, string, unknown?]
  >;
};
