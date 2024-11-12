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
import { Extends, If, IfStrict, IsNever, Not, Split } from '../../../misc/index.js';
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
import { OptionalKeys } from './misc-utils.types.js';

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
  // MutateIn
  | 'insert'
  | 'upsert'
  | 'replace'
  | 'remove'
  | 'arrayAppend'
  | 'arrayPrepend'
  | 'arrayInsert'
  | 'binary';

type FuzzyCC = [any, any];

type CodeCompletionOptions = {
  friendlyArray: boolean;
  friendlyRecord: boolean;
};

// prettier-ignore
export type DiscardCC<Op extends KvOperation, CC> =
  Op extends 'binary' | 'remove' ?
    CC extends [string, true] ?
      CC :
    never :
  Op extends 'arrayInsert' ?
    CC extends [string, never] ?
      never :
    CC :
  CC
;

// prettier-ignore
export type OpCodeCompletionPath<Op extends KvOperation, Doc> =
  DocumentCodeCompletion<Op, Doc>[0];

// prettier-ignore
export type IsLegalPath<Op extends KvOperation, Doc, Path> =
  IsFuzzyDocument<Doc> extends true ?
    true :
  Path extends ExtractMatchingCC<Op, DocumentCodeCompletion<Op, Doc>, Path>[0] ?
    true :
  false
;

// prettier-ignore
export type OpCodeCompletionValue<Op extends KvOperation, Doc, Path> =
  Op extends 'get' | 'upsert' | 'insert' ?
    Path extends '' ?
      Doc :
    Path extends string ?
      ExtractMatchingCC<Op, DocumentCodeCompletion<Op, Doc>, Path>[1] :
    never :
  Path extends string ?
    Op extends 'binary' ?
      ExtractMatchingCC<Op, DocumentCodeCompletion<Op, Doc>, Path>[1] extends true ?
        number :
      never :
    ExtractMatchingCC<Op, DocumentCodeCompletion<Op, Doc>, Path>[1] :
  never
;

// prettier-ignore
type ExtractMatchingCC<Op extends KvOperation, CC, UserPath> =
  IsNever<CCPerfectMatchPath<CC, UserPath>> extends false ?
    DiscardCC<Op, CCPerfectMatchPath<CC, UserPath>> :
  CC extends [infer Path extends string, unknown?] ?
    Split<UserPath, '.', '`'> extends Split<Path, '.', '`'> ?
      DiscardCC<Op, CC> :
    never :
  never
;

// prettier-ignore
type CCPerfectMatchPath<CC, UserPath> =
  CC extends [infer Path extends string, unknown] ?
    Split<Path, '.', '`'> extends Split<UserPath, '.', '`'> ?
      CC :
    never :
  never
;

// prettier-ignore
export type DocumentCodeCompletion<Op extends KvOperation, T> =
  T extends object ?
    IsFuzzyDocument<T> extends false ?
      BuildBag<Op, '', T, [CodeCompletionSinglePass<Op, '', T>]>[number] :
    FuzzyCC :
  never
;

// prettier-ignore
type BuildBag<Op extends KvOperation, PathToT, T, UnionStack extends ReadonlyArray<unknown>> =
  PathToT extends string ?
    T extends ReadonlyArray<unknown> ?
      keyof T extends infer Index ?
        Index extends keyof T & number ?
          Exclude<T[Index], undefined> extends infer SubDoc ?
            BuildBag<Op, `${PathToT}[${Index}]`, SubDoc, [...UnionStack, CodeCompletionSinglePass<Op, `${PathToT}[${Index}]`, SubDoc>]> :
          never :
        never :
      never :

    T extends Record<string, unknown> ?
      keyof T extends infer Key ?
        Key extends keyof T & string ?
          Exclude<T[Key], undefined> extends infer SubDoc ?
            BuildBag<Op, ConcatPath<PathToT, Key>, SubDoc, [...UnionStack, CodeCompletionSinglePass<Op, ConcatPath<PathToT, Key>, SubDoc>]> :
          never :
        never :
      never :

    [...UnionStack, CodeCompletionSinglePass<Op, PathToT, T>] :
  never
;

// prettier-ignore
export type CodeCompletionSinglePass<Op extends KvOperation, Path, T> =
  | (Op extends 'get' ? [Path, T] : never)
  | (Op extends 'upsert' ? Path extends '' ? ['', T] : never : never)
  | CCArray<Op, Path, T>

  // # Object
  | (T extends Record<string, unknown> ?
      keyof T extends infer Key ?
        Key extends keyof T ?
          (
          | (Op extends 'get' ? [ConcatPath<Path, Key>, Exclude<T[Key], undefined>] : never)
          | (Op extends 'exists' ? [ConcatPath<Path, Key>] : never)
          | (Op extends 'count' ? [Path] : never)
          | (Op extends 'upsert' ? [ConcatPath<Path, Key>, Exclude<T[Key], undefined>] : never)
          | (Op extends 'replace' ? [ConcatPath<Path, Key>, Exclude<T[Key], undefined>] : never)
          | (Op extends 'binary' ? Exclude<T[Key], undefined> extends number ? [ConcatPath<Path, Key>, true] : never : never)
          | (undefined extends T[Key] ?
              | (Op extends 'insert' ? [ConcatPath<Path, Key>, Exclude<T[Key], undefined>] : never)
              | (Op extends 'remove' ? [ConcatPath<Path, Key>, true] : never)
              :
            Key extends OptionalKeys<T> ?
              (
                | (Op extends 'insert' ? [ConcatPath<Path, Key>, Exclude<T[Key], undefined>] : never)
                | (Op extends 'remove' ? [ConcatPath<Path, Key>, true] : never)
                ) :
              never
            )
          ) :
      never :
    never :
  never)
;

// prettier-ignore
type CCArray<Op extends KvOperation, Path, T> =
  T extends ReadonlyArray<unknown> ?
    IsReadonlyArray<T> extends true ?
      CCReadArray<Op, Path, T> :
    (
    | CCReadArray<Op, Path, T>
    | CCArrayNonVariadic<Op, Path, T>
    | CCArrayVariadic<Op, Path, T>
    | (Op extends 'upsert' ? [Path, T] : never)
    )
    :
  never
;

// prettier-ignore
type CCReadArray<Op extends KvOperation, Path, T extends ReadonlyArray<unknown>> =
  Path extends string ?
  | (Op extends 'count' ? [`${Path}`] : never)
  | (Op extends 'get' ? [`${Path}[-1]`, Exclude<ArrayLastElement<T>, undefined>] : never)
  | (
    Op extends 'get' | 'exists' ?
      ArrayKnownIndexes<T> extends infer IndexTuple ?
        IndexTuple extends [infer Index extends number] ?
          | (Op extends 'get' ? [`${Path}[${Index}]`, Exclude<T[Index], undefined>] : never)
          | (Op extends 'exists' ? [`${Path}[${Index}]`] : never)
          :
        never :
      never :
    never
    )
    :
  never
;

// prettier-ignore
type CCArrayNonVariadic<Op extends KvOperation, Path, T extends ReadonlyArray<unknown>> =
  Path extends string ?
    IsVariadicArray<T> extends false ?
      | (Op extends 'replace' ? [`${Path}[-1]`, ArrayLastElement<T>] : never)
      | (Op extends 'binary' ? CCArrayBinary<Path, T> : never)
      | (
        Op extends 'replace' ?
          ArrayKnownIndexes<T> extends infer IndexTuple ?
            IndexTuple extends [infer Index extends keyof T & number] ?
              [`${Path}[${Index}]`, T[Index]] :
            never :
          never :
        never
        ) :
    never :
  never
;

// prettier-ignore
type CCArrayVariadic<Op extends KvOperation, Path, T extends ReadonlyArray<unknown>> =
  IsVariadicArray<T> extends true ?
    | (Op extends 'binary' ? CCArrayBinary<Path, T> : never)
    | (Op extends 'replace' ? CCArrayReplace<Path, T> : never)
    | (Op extends 'remove' ? CCArrayRemove<Path, T> : never)
    | (Op extends 'arrayAppend' ? CCArrayAppend<Path, T> : never)
    | (Op extends 'arrayPrepend' ? CCArrayPrepend<Path, T> : never)
    | (Op extends 'arrayInsert' ? CCArrayInsert<Path, T> : never)
    :
  never
;

type CanBeNumber<T> = Not<IsNever<Extract<T, number>>>;

// prettier-ignore
type CCArrayBinary<Path, T extends ReadonlyArray<unknown>> =
  Path extends string ?
    ArrayKnownIndexes<T> extends infer IndexTuple ?
      Extends<[number], IndexTuple> extends infer HasRest ?
        HasRest extends true ?
          CCArrayBinary_Rest<Path, T, IndexTuple> :
        IndexTuple extends [infer Index extends number] ?
          | If<CanBeNumber<T[Index]>, [`${Path}[${Index}]`, true]>
          | If<CanBeNumber<ArrayLastElement<T>>, [`${Path}[-1]`, true]>
          :
        never :
      never :
    never :
  never
;

// prettier-ignore
type CCArrayBinary_Rest<Path, T extends ReadonlyArray<unknown>, IndexTuple> =
  Path extends string ?
    IndexTuple extends [infer Index extends number] ?
      number extends Index ?
        ArrayInfo<T> extends infer Info extends ArrayInfoShape ?
          CanBeNumber<Info['RestElement']> extends true ?
            [`${Path}[${number}]`, true] | [`${Path}[-1]`, CanBeNumber<ArrayLastElement<T>>] :
          Info['IsTailStatic'] extends true ?
            [`${Path}[-1]`, CanBeNumber<ArrayLastElement<T>>] :
          never :
        never :
      [`${Path}[${Index}]`, CanBeNumber<T[Index]>] :
    never :
  never
;

// prettier-ignore
type CCArrayReplace<Path, T extends ReadonlyArray<unknown>> =
  Path extends string ?
    | [`${Path}[-1]`, Exclude<ArrayLastElement<T>, undefined>]
    | (ArrayKnownIndexes<T> extends infer IndexTuple ?
        IndexTuple extends [infer Index extends number] ?
          [`${Path}[${Index}]`, Exclude<T[Index], undefined>] :
        never :
      never
      )
    :
  never
;

// prettier-ignore
type CCArrayRemove<Path, T extends ReadonlyArray<unknown>> =
  Path extends string ?
    | [`${Path}[-1]`, IsLastElementRemovable<T>]
    | CCArrayRemove_KnownIndexes<Path, T>
    :
  never
;

// prettier-ignore
type CCArrayRemove_KnownIndexes<Path, T extends ReadonlyArray<unknown>> =
  Path extends string ?
    ArrayInfo<T> extends infer Info extends ArrayInfoShape ?
      Info['IsFullyStatic'] extends true ?
        never :
      ArrayKnownIndexes<T> extends infer IndexTuple ?
        IndexTuple extends [infer Index extends number] ?
          number extends Index ?
            [`${Path}[${Index}]`, true] :
          [`${Path}[${Index}]`, IfStrict<ArrayHasDescendingInheritance<ArraySlice<T, Index>>, true, false>] :
        never :
      never :
    never :
  never
;

// prettier-ignore
type CCArrayAppend<Path, T extends ReadonlyArray<unknown>> =
  ArrayAppendElement<T> extends infer E ?
    IsNever<E> extends true ?
      never :
    [Path, E] :
  never
;

// prettier-ignore
type CCArrayPrepend<Path, T extends ReadonlyArray<unknown>> =
  ArrayPrependElement<T> extends infer E ?
    IsNever<E> extends true ?
      never :
    [Path, E] :
  never
;

// prettier-ignore
type CCArrayInsert<Path, T> =
  T extends ReadonlyArray<unknown> ?
    Path extends string ?
      ArrayInfo<T> extends infer Info extends ArrayInfoShape ?
        Info['IsFullyStatic'] extends true ?
          never :
        ArrayKnownIndexes<T> extends infer IndexTuple ?
          IndexTuple extends [infer Index extends number] ?
            number extends Index ?
              [`${Path}[${Index}]`, Info['RestElement']] :
            [`${Path}[${Index}]`, IfStrict<ArrayHasAscendingInheritance<ArraySlice<T, Index>>, Exclude<T[Index], undefined>>] :
          never :
        never :
      never :
    never :
  never
;

// prettier-ignore
type ConcatPath<Path, Key> =
  Key extends string ?
    Path extends '' ?
      Key :
    Path extends string ?
      `${Path}.${Key}` :
    never :
  never
;

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
