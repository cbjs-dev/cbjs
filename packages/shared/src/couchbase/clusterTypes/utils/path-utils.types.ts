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
import { IfStrict, IsNever, Not, Split, UnionKeys } from '../../../misc/index.js';
import { DefaultKeyspaceOptions } from '../cluster.types.js';
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
  IsFullyStaticArray,
  IsLastElementRemovable,
  IsTailStatic,
  RestElement,
} from './array-utils.types.js';
import { OptionalKeys } from './misc-utils.types.js';
import { IsTemplateString } from './string-utils.types.js';

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

type FuzzyCC = [false, any, any];

// prettier-ignore
export type OpCodeCompletionPath<Op extends KvOperation, Options, Doc> =
  DocumentCodeCompletion<Op, Options, Doc>[1];

// prettier-ignore
export type OpCodeCompletionValue<Op extends KvOperation, Options, Doc, Path> =
  Op extends 'get' | 'upsert' | 'insert' ?
    Path extends '' ?
      Doc :
    Path extends string ?
      ExtractMatchingCC<Op, DocumentCodeCompletion<Op, Options, Doc>, Path>[2] :
    never :
  Path extends string ?
    ExtractMatchingCC<Op, DocumentCodeCompletion<Op, Options, Doc>, Path> extends infer MatchingCC extends [unknown, unknown, unknown?] ?
      Op extends 'binary' ?
        IsNever<MatchingCC> extends true ?
          never :
        MatchingCC[2] extends true ?
          number :
        never :
      MatchingCC[2] :
    never :
  never
;

// prettier-ignore
export type ExtractMatchingCC<Op extends KvOperation, CC, UserPath> =
  IsNever<CCPerfectMatchPath<CC, UserPath>> extends false ?
    DiscardCC<Op, CCPerfectMatchPath<CC, UserPath>> :
  CC extends [unknown, infer Path extends string, unknown?] ?
    Split<UserPath, '.', '`'> extends Split<Path, '.', '`'> ?
      DiscardCC<Op, CC> :
    never :
  never
;

/**
 * Discard CC entries that are either friendly or have been flagged as illegal paths.
 *
 * @see IsLegalPath
 */
// prettier-ignore
export type DiscardCC<Op extends KvOperation, CC> =
  CC extends [true, unknown, unknown?] ?
    never :
  Op extends 'binary' | 'remove' ?
    CC extends [unknown, string, true] ?
      CC :
    never :
  Op extends 'arrayInsert' ?
    CC extends [unknown, string, never] ?
    never :
    CC :
  CC
;

// prettier-ignore
type CCPerfectMatchPath<CC, UserPath> =
  CC extends [unknown, infer Path extends string, unknown?, unknown?] ?
    Split<Path, '.', '`'> extends Split<UserPath, '.', '`'> ?
      CC :
    never :
  never
;

/**
 * When the user path matches a string template, it doesn't mean the path is valid.
 * For example, given `[string, ...number[]]` for a `binary` operation, code completion path will include `arr[${number}]`.
 * So `arr[0]` will match the path, and yet, it is not a valid path because arr[0] is not a number.
 * @returns `true` if the path is valid.
 */
// prettier-ignore
export type IsLegalPath<Op extends KvOperation, Options, Doc, Path> =
  IsFuzzyDocument<Doc> extends true ?
    true :
  Path extends ExtractMatchingCC<Op, DocumentCodeCompletion<Op, Options, Doc>, Path>[1] ?
    true :
  false
;

// prettier-ignore
type OptionFriendlyPathArrayIndex<T> =
  'codeCompletion' extends keyof T ?
    'array' extends keyof T['codeCompletion'] ?
      'friendly' extends T['codeCompletion']['array'] ?
        true :
      false :
    false :
  false
;

// prettier-ignore
type OptionFriendlyPathRecordKey<T> =
  'codeCompletion' extends keyof T ?
    'record' extends keyof T['codeCompletion'] ?
      'friendly' extends T['codeCompletion']['record'] ?
        true :
      false :
    false :
  false
;

// prettier-ignore
type OptionRecordFriendlyPlaceholder<T> =
  'codeCompletion' extends keyof T ?
    'recordPlaceholder' extends keyof T['codeCompletion'] ?
      T['codeCompletion']['recordPlaceholder'] extends string ?
        T['codeCompletion']['recordPlaceholder'] :
      '#' :
    '#' :
  '#'
;

// prettier-ignore
type PathToKey<Options, FriendlyPath, T, PathTo extends string, Key> =
  T extends ReadonlyArray<unknown> ?
    PTA<Options, FriendlyPath, PathTo, Key> :
  PTO<Options, FriendlyPath, PathTo, Key>
;

// prettier-ignore
type PTA<
  Options,
  FriendlyPath,
  PathTo extends string,
  Index,
> =
  Index extends number ?
    [FriendlyPath] extends [true] ?
      OptionFriendlyPathArrayIndex<Options> extends true ?
        [true, `${PathTo}[]`] :
      [true, `${PathTo}[${Index}]`] :
    [FriendlyPath] extends [false] ?
      [false, `${PathTo}[${Index}]`] :
    number extends Index ?
      OptionFriendlyPathArrayIndex<Options> extends true ?
        [false, `${PathTo}[${Index}]`] | [true, `${PathTo}[]`] :
      [boolean, `${PathTo}[${Index}]`] :
    [boolean, `${PathTo}[${Index}]`] :
  never
;

// prettier-ignore
type PTO<
  Options,
  FriendlyPath,
  PathTo extends string,
  Key,
> =
  [FriendlyPath] extends [true] ?
    IsTemplateString<Key> extends true ?
      [true, ConcatPath<PathTo, '#'>] :
    [true, ConcatPath<PathTo, Key>] :
  [FriendlyPath] extends [false] ?
    [false, ConcatPath<PathTo, Key>] :
  OptionFriendlyPathRecordKey<Options> extends true ?
    IsTemplateString<Key> extends true ?
      [false, ConcatPath<PathTo, Key>] | [true, ConcatPath<PathTo, '#'>] :
    [boolean, ConcatPath<PathTo, Key>] :
  [boolean, ConcatPath<PathTo, Key>]
;

// prettier-ignore
export type Keys<T> =
  T extends ReadonlyArray<unknown> ?
    ArrayKnownIndexes<T> | [-1] :
  T extends Record<string, unknown> ?
    keyof T extends infer Key ?
      Key extends unknown ?
        [Key] :
      never :
    never :
  never
;

// prettier-ignore
export type Get<T, K> =
  T extends ReadonlyArray<unknown> ?
    K extends -1 ?
      ArrayLastElement<T> :
    K extends number ?
      T[K] :
    never :
  K extends string | number ?
    Extract<T, { [Key in K]?: unknown }>[K] :
  never
;

type TG = Get<{ title?: string } | { status: string }, 'status'>;
type TTG = Extract<{ title: string } | { status: string }, { [Key in 'title']: any }>
  
// prettier-ignore
export type DocumentCodeCompletion<Op extends KvOperation, Options, T> =
  T extends object ?
    IsFuzzyDocument<T> extends false ?
      BuildBag<Op, Options, boolean, '', T, [CodeCompletion<Op, boolean, Options, never, '', T>]>[number] :
    FuzzyCC :
  never
;

type TestDoc = { title: string } | { status: string };
type TBB = BuildBag<'get', NonNullable<unknown>, false, 'events', TestDoc, []>;

// prettier-ignore
type TTK = 
  Keys<TestDoc> extends infer KeyTuple ?
    KeyTuple extends [infer Key] ?
      Get<TestDoc, Key> :
    never :
  never
;

// prettier-ignore
type BuildBag<Op extends KvOperation, Options, FriendlyPath, PathToDoc, Doc, UnionStack extends ReadonlyArray<unknown>> =
  PathToDoc extends string ?
    IsNever<Keys<Doc>> extends true ?
      UnionStack :
    Keys<Doc> extends infer KeyTuple ?
      KeyTuple extends [infer Key] ?
        Get<Doc, Key> extends infer SubDoc ?
          PathToKey<Options, FriendlyPath, Doc, PathToDoc, Key> extends infer PTK ?
            PTK extends [infer BuildFriendly, infer Path] ?
              BuildBag<Op, Options, BuildFriendly, Path, SubDoc, [
                ...UnionStack,
                CodeCompletion<Op, BuildFriendly, Doc, Key, Path, SubDoc>
              ]> :
            never :
          never :
        never :
      UnionStack :
    never :
  never
;

/**
 * ParentDocKey is the key of the parent that led to this doc.
 */
// prettier-ignore
export type CodeCompletion<Op extends KvOperation, BuildFriendly, ParentDoc, KeyToDoc, PathToDoc, Doc> =
  Op extends 'get' ?
    [BuildFriendly, PathToDoc, Exclude<Doc, undefined>] :

  Op extends 'exists' ?
    PathToDoc extends '' ?
      never :
    [BuildFriendly, PathToDoc] :

  Op extends 'count' ?
    IsCountable<Doc> extends true ?
      [BuildFriendly, PathToDoc] :
    never :

  Op extends 'upsert' ?
    IsNever<KeyToDoc> extends true ?
      [BuildFriendly, '', Doc] :
    DocIsInArray<ParentDoc, KeyToDoc> extends true ?
      never :
    [BuildFriendly, PathToDoc, Exclude<Doc, undefined>] :

  Op extends 'replace' ?
    PathToDoc extends '' ?
      never :
    [BuildFriendly, PathToDoc, Exclude<Doc, undefined>] :

  Op extends 'binary' ?
    CanHaveRest<ParentDoc> extends true ?
      Extract<ParentDoc, ReadonlyArray<unknown>> extends infer PD extends ReadonlyArray<unknown> ?
        IsNever<PD> extends false ?
          number extends PD[number] ?
            number extends KeyToDoc ?
              number extends RestElement<PD> ?
                [BuildFriendly, PathToDoc, true] :
              IsTailStatic<PD> extends true ?
                [BuildFriendly, PathToDoc, true] :
              never :
            [BuildFriendly, PathToDoc, CanBeNumber<Doc>] :
          never :
        never :
      never :
    CanBeNumber<Doc> extends true ?
      [BuildFriendly, PathToDoc, true] :
    never :

  Op extends 'insert' ?
    DocIsInArray<ParentDoc, KeyToDoc> extends true ?
      never :
    undefined extends Doc ?
      [BuildFriendly, PathToDoc, Exclude<Doc, undefined>] :
    KeyToDoc extends OptionalKeys<ParentDoc> ?
      [BuildFriendly, PathToDoc, Exclude<Doc, undefined>] :
    never :

  Op extends 'remove' ?
    undefined extends Doc ?
      [BuildFriendly, PathToDoc, true] :
    DocIsInArray<ParentDoc, KeyToDoc> extends true ?
      Extract<ParentDoc, ReadonlyArray<unknown>> extends infer PD ?
        IsFullyStaticArray<PD> extends true ?
          never :
        KeyToDoc extends -1 ?
          IsLastElementRemovable<PD> extends true ?
            [BuildFriendly, PathToDoc, true] :
          [BuildFriendly, PathToDoc, false] :
        number extends KeyToDoc ?
          [BuildFriendly, PathToDoc, true] :
        [BuildFriendly, PathToDoc, IfStrict<ArrayHasDescendingInheritance<ArraySlice<PD, KeyToDoc>>, true, false>] :
      never :
    KeyToDoc extends OptionalKeys<ParentDoc> ?
      [BuildFriendly, PathToDoc, true] :
    never :

  Op extends 'arrayAppend' ?
    CCArrayAppend<BuildFriendly, PathToDoc, Extract<Doc, ReadonlyArray<unknown>>> :

  Op extends 'arrayPrepend' ?
    CCArrayPrepend<BuildFriendly, PathToDoc, Extract<Doc, ReadonlyArray<unknown>>> :

  Op extends 'arrayInsert' ?
    CCArrayInsert<BuildFriendly, PathToDoc, Extract<Doc, ReadonlyArray<unknown>>> :

  never
;

type CanHaveRest<T> = CanHaveRest_Internal<T> extends false ? false : true;

// prettier-ignore
type CanHaveRest_Internal<T> =
  T extends ReadonlyArray<unknown> ?
    [number] extends ArrayKnownIndexes<T> ?
      true :
    false :
  false
;

// prettier-ignore
type IsCountable<T> = IsNever<Extract<T, ReadonlyArray<unknown> | Record<string, unknown>>> extends true ? false : true ;
type CanBeNumber<T> = Not<IsNever<Extract<T, number>>>;
// prettier-ignore
type CanBeArray<T> = IsNever<Extract<T, ReadonlyArray<unknown>>> extends true ? false : true ;

// prettier-ignore
type DocIsInArray<ParentDoc, KeyToDoc> =
  KeyToDoc extends number ?
    CanBeArray<ParentDoc> extends true ?
      true :
    false :
  false
;

// prettier-ignore
type CCArrayAppend<BuildFriendly, Path, T extends ReadonlyArray<unknown>> =
  ArrayAppendElement<T> extends infer E ?
    IsNever<E> extends true ?
      never :
    [BuildFriendly, Path, E] :
  never
;

// prettier-ignore
type CCArrayPrepend<BuildFriendly, Path, T extends ReadonlyArray<unknown>> =
  ArrayPrependElement<T> extends infer E ?
    IsNever<E> extends true ?
      never :
    [BuildFriendly, Path, E] :
  never
;

// prettier-ignore
type CCArrayInsert<BuildFriendly, Path, T> =
  T extends ReadonlyArray<unknown> ?
    Path extends string ?
      ArrayInfo<T> extends infer Info extends ArrayInfoShape ?
        Info['IsFullyStatic'] extends true ?
          never :
        ArrayKnownIndexes<T> extends infer IndexTuple ?
          IndexTuple extends [infer Index extends number] ?
            number extends Index ?
              [BuildFriendly, `${Path}[${Index}]`, Info['RestElement']] :
            [BuildFriendly, `${Path}[${Index}]`, IfStrict<ArrayHasAscendingInheritance<ArraySlice<T, Index>>, Exclude<T[Index], undefined>>] :
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
