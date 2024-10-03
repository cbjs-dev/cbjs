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
import type { IsNever, Join, Split } from '../../../misc/index.js';
import type { IsFuzzyDocument } from '../document.types.js';
import {
  GuaranteedIndexes,
  IsArrayLengthKnown,
  ResolveNegativeIndex,
  TupleIndexes,
} from './array-utils.types.js';
import type { OptionalKeys } from './misc-utils.types.js';

/**
 * Key types you can access using {@link DocumentPath}.
 */
type AccessibleKey = string | number;

/**
 * Extract all the possible keys of an array.
 */
export type TargetableArrayIndexes<T extends ReadonlyArray<unknown>> =
  IsArrayLengthKnown<T> extends false
    ? -1 | (number & unknown)
    : 0 extends TupleIndexes<T>
      ? -1 | TupleIndexes<T>
      : never;

/**
 * String literal to access an array index.
 */
type ArrayAccessor<T extends readonly unknown[], K> =
  K extends TargetableArrayIndexes<T> ? `[${K}]` : never;

/**
 * String literal to access a property.
 */
type ObjectAccessor<K, Depth extends number> = Depth extends 0
  ? `${Extract<K, string>}`
  : `.${K & string}`;

/**
 * Extract array index accessor from a union of segment.
 */
export type ExtractArrayIndexAccessor<T> = T extends `[${number}]` ? T : never;

/**
 * Return `true` if T is an array index accessor, `false` otherwise.
 */
export type IsArrayIndexAccessor<T> = T extends `[${number}]` ? true : false;

/**
 * String literal to access the next element.
 */
export type Accessor<T, K, Depth extends number> = T extends readonly unknown[]
  ? `${ArrayAccessor<T, K>}`
  : `${ObjectAccessor<K, Depth>}`;

type NextDepth<N extends number> = [
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
  21,
  22,
  23,
  24,
  25,
  26,
  27,
  28,
  29,
  30,
  31,
  32,
  33,
][N];

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

/**
 * Union of all paths to all elements of the object. Distributive.
 *
 * Note: does not include the root path '' by design.
 */
// prettier-ignore
export type DocumentPath<T> =
  T extends object ?
    IsFuzzyDocument<T> extends false ?
      BuildPath<T, Extract<keyof T, AccessibleKey>> :
    string :
  never
;

/**
 * Build the paths in a branch of the document.
 * Distributed against `T` and `Key`.
 */
// prettier-ignore
type BuildPath<T extends object, Key> =
  Key extends unknown ?
    PathAhead<T, Key, 1, Accessor<T, Key, 0>, Accessor<T, Key, 0>> :
  never
;

/**
 * Return the sub-path for the given type and keys.
 */
// prettier-ignore
type PathAhead<
  T extends object,
  Key,
  Depth extends number,
  ParentPath extends string,
  Acc
> =
  Depth extends 32 ?
    ParentPath :
  ResolveNegativeIndex<T, Key> extends infer Index extends keyof T & AccessibleKey ?
    T[Index] extends infer Doc ?
      Doc extends unknown ?
        Doc extends readonly unknown[] ?
          ArrayPath<Doc, Depth, ParentPath, Acc> :
        Doc extends object ?
          ObjectPath<Doc, Depth, ParentPath, Acc> :
        Acc | ParentPath :
      never :
    never :
  never
;

/**
 * Build the paths to an array's elements.
 */
// prettier-ignore
type ArrayPath<
  Doc extends ReadonlyArray<unknown>,
  Depth extends number,
  ParentPath extends string,
  Acc
> =
  TargetableArrayIndexes<Doc> extends infer Index ?
    Index extends keyof Doc & AccessibleKey ?
      PathAhead<
        Doc,
        Index,
        NextDepth<Depth>,
        `${ParentPath}${ArrayAccessor<Doc, Index>}`,
        Acc | ParentPath
      > :
    never:
  never
;

/**
 * Build the paths to an object's properties.
 */
// prettier-ignore
type ObjectPath<
  Doc extends object,
  Depth extends number,
  ParentPath extends string,
  Acc
> =
  keyof Doc & AccessibleKey extends infer Key ?
    Key extends keyof Doc & AccessibleKey ?
      PathAhead<
        Doc,
        Key,
        NextDepth<Depth>,
        `${ParentPath}${ObjectAccessor<keyof Doc & AccessibleKey, Depth>}`,
        Acc | ParentPath
      > :
    never :
  never
;

/**
 * Split a path into segments, if required.
 */
export type SplitIntoSegments<T extends string> = T extends string
  ? Split<T, '.', '`'> extends infer Segments extends readonly string[]
    ? SplitSegmentsAccessors<Segments>
    : never
  : T;

/**
 * Split a single segment into an ordered tuple of prop and array accessors.
 */
// prettier-ignore
export type SplitSegmentIntoAccessors<T extends string> =
  SplitSegmentIntoAccessorsTRE<T, [], `${string}`>
;

// prettier-ignore
export type SplitSegmentIntoAccessorsTRE<
  T extends string,
  Acc extends ReadonlyArray<string>,
  AccTemplate extends string,
> =
  T extends `${AccTemplate}[${infer Index extends number}][${string}]` ?
    SplitSegmentIntoAccessorsTRE<T, [...Acc, `[${Index}]`], `${AccTemplate}[${Index}]`> :
  T extends `${AccTemplate}[${infer Index extends number}]` ?
    T extends `${infer Prop}[${string}` ?
      Prop extends '' ?
        [...Acc, `[${Index}]`] :
      [Prop, ...Acc, `[${Index}]`] :
    never :
  [T]
;

/**
 * Join segments to form a path.
 */
export type JoinSegments<
  T extends readonly string[],
  InitialString extends string = '',
> = T extends [infer Head extends string, ...infer Rest extends string[]]
  ? IsArrayIndexAccessor<Head> extends true
    ? JoinSegments<Rest, `${InitialString}${Head}`>
    : InitialString extends ''
      ? JoinSegments<Rest, `${Head}`>
      : JoinSegments<Rest, `${InitialString}.${Head}`>
  : InitialString;

/**
 * Split each segment into its accessors and return a flatten tuple.
 */
type SplitSegmentsAccessors<Segments extends readonly string[]> =
  SplitSegmentsAccessorsTRE<Segments, []>;

// prettier-ignore
type SplitSegmentsAccessorsTRE<
  Segments extends readonly string[],
  Acc extends ReadonlyArray<string>,
> =
  Segments extends [infer Segment extends string, ...infer Rest extends readonly string[]] ?
    SplitSegmentsAccessorsTRE<Rest, [...Acc, ...SplitSegmentIntoAccessors<Segment>]> :
  Acc
;

/**
 * Pop element from Tuple until it finds a property accessor.
 */
export type PopUntilProperty<Tuple extends readonly string[]> = Tuple extends [
  ...infer Rest extends readonly string[],
  infer Tail,
]
  ? IsArrayIndexAccessor<Tail> extends true
    ? PopUntilProperty<Rest>
    : Tuple
  : [];

/**
 * Return `true` if `T[K]` may be undefined.
 */
// prettier-ignore
export type MaybeMissing<T, K = never> =
  undefined extends T ?
    true :
  IsNever<K> extends true ?
    false :
  T extends ReadonlyArray<unknown> ?
    K extends GuaranteedIndexes<T> ?
      false :
    true :
  K extends OptionalKeys<T> ?
    true :
  false
;

/**
 * Return <subdoc> | undefined if the subdoc may be undefined.
 */
// prettier-ignore
type SubDocumentMaybeUndefined<T, Segment extends keyof T, OrUndefined extends boolean> =
  OrUndefined extends true ?
    T[Segment] | undefined :
  MaybeMissing<T, Segment> extends true ?
    T[Segment] | undefined :
  T[Segment]
;

/**
 * Return the sub-document type from path segments.
 * Non-Distributive.
 */
// prettier-ignore
export type SubDocumentFromPathSegments<
  T,
  Segments extends ReadonlyArray<string>,
  OrUndefined extends boolean,
> =
  Segments extends [infer Segment, ...infer RestSegments extends string[]] ?
    // Object access
    Segment extends keyof T ?
      RestSegments['length'] extends 0 ?
        SubDocumentMaybeUndefined<T, Segment, OrUndefined> :
      T[Segment] extends infer NextDoc ?
        NextDoc extends unknown ?
          SubDocumentFromPathSegments<NextDoc, RestSegments, MaybeMissing<T, Segment>> :
        never :
      never :

    // Array access
    Segment extends `[${infer Index extends number}]` ?
      ResolveNegativeIndex<T, Index> extends infer ResolvedIndex extends keyof T ?
        RestSegments['length'] extends 0 ?
          SubDocumentMaybeUndefined<T, ResolvedIndex, OrUndefined> :
        SubDocumentFromPathSegments<
          T[ResolvedIndex],
          RestSegments,
          MaybeMissing<T, ResolvedIndex>
        > :
      never :
    Segment extends '' ? // Root
      T :
    never :
  never
;

/**
 * Return the type of an element at a specific path.
 */
// prettier-ignore
export type SubDocument<T, P extends string> =
  IsFuzzyDocument<T> extends true ?
    any :
  SubDocumentFromPathSegments<T, SplitIntoSegments<P>, false>
;

/**
 * Return the {@link SubDocument} at the parent accessor or the document itself if there is no parent accessor.
 */
// prettier-ignore
export type ParentDocument<Doc, DocPath extends string> =
  PathToParentAccessor<DocPath> extends infer ParentAccessor extends string ?
    [ParentAccessor] extends [never] ?
      Doc :
    SubDocument<Doc, ParentAccessor> :
  never
;

/**
 * Return the path to the closest property.
 */
export type PathToClosestProperty<T extends string> = T extends unknown
  ? JoinSegments<PopUntilProperty<SplitIntoSegments<T>>>
  : never;

/**
 * Return the path to the closest property that is required and possibly an object.
 */
// prettier-ignore
export type PathToClosestObject<Doc extends object, UserPath extends string> =
  IsNever<UserPath> extends true ?
    never :
  [Exclude<SubDocument<Doc, UserPath>, undefined>] extends [infer SubDoc] ?
    IsNever<SubDoc> extends true ?
      never :
    SubDoc extends Record<string | number, any> ?
      UserPath :
    PathToClosestObject<Doc, PathToParentAccessor<UserPath>> :
  never
;

/**
 * Return the closest ancestor property.
 *
 * @example
 * PathToParentProperty<'path.to.array'> = 'path.to'
 * PathToParentProperty<'path.to.array[-1]'> = 'path.to'
 * PathToParentProperty<`path.to.array[${number}]`> = 'path.to'
 * PathToParentProperty<`path.to.array[42][${number}]`> = 'path.to'
 * PathToParentProperty<'path.to.array[42].prop'> = 'path.to.array'
 */
export type PathToParentProperty<T extends string> =
  Split<T, '.', '`'> extends [...infer Rest extends string[], unknown]
    ? 1 extends Partial<Rest>['length']
      ? PathToClosestProperty<Join<Rest, '.'>>
      : never
    : never;

/**
 * Just like {@link PathToParentProperty} but return `T` instead of `never` if `T` doesn't have a parent property.
 */
export type PathToParentPropertyOrSelf<T extends string> =
  PathToParentProperty<T> extends infer ParentProp
    ? [ParentProp] extends [never]
      ? T
      : ParentProp
    : never;

/**
 * Return the closest ancestor expression.
 *
 * @example
 * PathToParentProperty<'path.to.array'> = 'path.to'
 * PathToParentProperty<'path.to.array[-1]'> = 'path.to.array'
 * PathToParentProperty<`path.to.array[${number}]`> = 'path.to.array'
 * PathToParentProperty<`path.to.array[42][${number}]`> = 'path.to.array[42]'
 * PathToParentProperty<'path.to.array[42].prop'> = 'path.to.array[42]'
 */
// prettier-ignore
export type PathToParentAccessor<T extends string> =
  SplitIntoSegments<T> extends [...infer Rest extends string[], unknown] ?
    Rest['length'] extends 0 ?
      never :
    JoinSegments<Rest> :
  never
;

/**
 * Return the property name or the array expression of the path.
 *
 * @example
 * PathTargetExpression<'path.to.property'> = 'property'
 * PathTargetExpression<'path.to.array'> = 'array'
 * PathTargetExpression<'path.to.array[1]'> = 'array[1]'
 */
export type PathTargetExpression<T extends string> =
  Split<T, '.', '`'> extends [...string[], infer Tail] ? Tail : never;
