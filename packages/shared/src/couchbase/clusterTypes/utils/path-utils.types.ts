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
import type { And, Extends, If, IsNever, Join, Not, Or, Split } from '../../../misc';
import type { IsFuzzyDocument } from '../document.types';
import type {
  GuaranteedIndexes,
  IsArrayLengthKnown,
  ResolveNegativeIndex,
  TupleIndexes,
} from './array-utils.types';
import type {
  CircularReferences,
  OptionalKeys,
  ReferencesItself,
  ToNumber,
  WrapEach,
} from './misc-utils.types';

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
type ArrayAccessor<T extends readonly unknown[], K extends AccessibleKey> =
  K extends TargetableArrayIndexes<T> ? `[${K}]` : never;

/**
 * String literal to access a property.
 */
type ObjectAccessor<K extends AccessibleKey, IsRoot extends boolean> = IsRoot extends true
  ? K
  : `.${K & string}`;

/**
 * Extract array index accessor from a union of segment.
 */
export type ExtractArrayIndexAccessor<T> = T extends `[${number}]` ? T : never;

/**
 * Return `true` if T is an array index accessor, `false` otherwise.
 */
export type IsArrayIndexAccessor<T> = [ExtractArrayIndexAccessor<T>] extends [never]
  ? false
  : true;

/**
 * String literal to access the next element.
 */
type Accessor<
  T,
  K extends AccessibleKey,
  IsRoot extends boolean,
> = T extends readonly unknown[] ? ArrayAccessor<T, K> : ObjectAccessor<K, IsRoot>;

/**
 * Union of all paths to all elements of the object. Distributive.
 *
 * Note: does not include the root path '' by design.
 */
export type DocumentPath<T extends object, K = never> = T extends unknown
  ? IsFuzzyDocument<T> extends false
    ? If<IsNever<K>, keyof T, K> extends infer Key extends keyof T
      ? Key extends AccessibleKey
        ? BuildPath<T, Key, true, never>
        : never
      : never
    : string
  : never;

/**
 * Build the paths in a branch of the document.
 * Distributed against `T` and `Key`.
 */
type BuildPath<
  T extends object,
  Key extends AccessibleKey & keyof T,
  // Key,
  IsRoot extends boolean,
  PropBags extends CircularPropBag,
> = Key extends unknown
  ? CircularProp<T[Key]> extends infer PropBag extends CircularPropBag
    ? // We hit a recursive prop type
      And<[Not<IsNever<PropBag>>, Extends<PropBag, PropBags>]> extends true
      ? `${Accessor<T, Key, IsRoot>}` | `${Accessor<T, Key, IsRoot>}${string}`
      : `${Accessor<T, Key, IsRoot>}${'' | PathAhead<T, Key, PropBag | PropBags>}`
    : never
  : never;

/**
 * Return the sub-path for the given type and keys.
 */
type PathAhead<
  T extends object,
  Key extends AccessibleKey & keyof T,
  PropBags extends CircularPropBag,
> = T[ResolveNegativeIndex<T, Key>] extends infer Doc
  ? Doc extends unknown
    ? Doc extends readonly unknown[]
      ? ArrayPath<Doc, PropBags>
      : Doc extends object
        ? ObjectPath<Doc, PropBags>
        : never
    : never
  : never;

/**
 * Build the paths to an array's elements.
 */
type ArrayPath<Doc extends ReadonlyArray<unknown>, PropBags extends CircularPropBag> =
  TargetableArrayIndexes<Doc> extends infer Index extends keyof Doc & AccessibleKey
    ? BuildPath<Doc, Index, false, PropBags>
    : never;

/**
 * Build the paths to an object's properties.
 */
type ObjectPath<Doc extends object, PropBags extends CircularPropBag> = BuildPath<
  Doc,
  keyof Doc & AccessibleKey,
  false,
  PropBags
>;

/**
 * Return a prop and its circular references in a shape of {@link CircularPropBag}.
 */
type CircularProp<T> =
  CircularReferences<T> extends infer Refs
    ? IsNever<Refs> extends false
      ? ReferencesItself<T> extends true
        ? {
            Prop: T;
            Refs: Refs;
          }
        : never
      : never
    : never;

/**
 * Shape of the object returned by {@link CircularProp}.
 */
type CircularPropBag = {
  Prop: unknown;
  Refs: [unknown];
};

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
type SplitSegmentIntoAccessors<T> = T extends `${infer Prop}[${infer Accessors}]`
  ? Prop extends ''
    ? WrapEach<Split<Accessors, '][', '`'>, '[', ']'>
    : [Prop, ...WrapEach<Split<Accessors, '][', '`'>, '[', ']'>]
  : [T];

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
type SplitSegmentsAccessors<Segments extends readonly string[]> = Segments extends [
  infer Segment,
  ...infer Rest extends readonly string[],
]
  ? [...SplitSegmentIntoAccessors<Segment>, ...SplitSegmentsAccessors<Rest>]
  : [];

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
 * Return `true` is `T[K]` may be undefined.
 */
export type MaybeMissing<T, K = never> = If<
  IsNever<
    undefined extends T
      ? true
      : never | T extends ReadonlyArray<unknown>
        ? K extends GuaranteedIndexes<T>
          ? never
          : true
        : never | K extends OptionalKeys<T>
          ? true
          : never
  >,
  false,
  true
>;

/**
 * Return the type at the object key.
 */
type ObjectSubDocument<
  T,
  Segments extends ReadonlyArray<string>,
  OrUndefined extends boolean,
> = Segments extends [
  infer Segment extends string,
  ...infer RestSegments extends string[],
]
  ? Segment extends keyof T // Object access
    ? 1 extends Partial<RestSegments>['length']
      ? SubDocumentFromPathSegments<T[Segment], RestSegments, MaybeMissing<T, Segment>>
      : T[Segment] | If<Or<[OrUndefined, MaybeMissing<T, Segment>]>, undefined>
    : Segment extends ''
      ? T
      : never
  : never;

/**
 * Return the type at the array index.
 */
type ArraySubDocument<
  T,
  Segments extends ReadonlyArray<string>,
  OrUndefined extends boolean,
> = Segments extends [
  infer Segment extends string,
  ...infer RestSegments extends string[],
]
  ? Segment extends `[${infer Index}]` // Array access
    ? Extract<T, ReadonlyArray<unknown>> extends infer Arr extends ReadonlyArray<unknown>
      ? ResolveNegativeIndex<Arr, ToNumber<Index>> extends infer ResolvedIndex extends
          keyof Arr
        ? 1 extends Partial<RestSegments>['length']
          ? SubDocumentFromPathSegments<
              Arr[ResolvedIndex],
              RestSegments,
              MaybeMissing<Arr, ResolvedIndex>
            >
          :
              | Arr[ResolvedIndex]
              | If<Or<[OrUndefined, MaybeMissing<Arr, ResolvedIndex>]>, undefined>
        : never
      : never
    : never
  : never;

/**
 * Return the document itself if the segment is an empty string.
 */
type RootSubDocument<T, Segments extends ReadonlyArray<string>> = Segments extends [
  infer Segment extends string,
  ...string[],
]
  ? Segment extends ''
    ? T
    : never
  : never;

/**
 * Return the sub-document type from path segments.
 */
type SubDocumentFromPathSegments<
  T,
  Segments extends ReadonlyArray<string>,
  OrUndefined extends boolean,
> = T extends unknown
  ?
      | ObjectSubDocument<T, Segments, OrUndefined>
      | ArraySubDocument<T, Segments, OrUndefined>
      | RootSubDocument<T, Segments>
  : never;

/**
 * Return the type of an element at a specific path.
 */
export type SubDocument<T, P extends string> = T extends unknown
  ? P extends unknown
    ? SubDocumentFromPathSegments<T, SplitIntoSegments<P>, false>
    : never
  : never;

/**
 * Return the {@link SubDocument} at the parent accessor or the document itself if there is no parent accessor.
 */
export type ParentDocument<D, P extends string> =
  PathToParentAccessor<P> extends infer ParentAccessor extends string
    ? [ParentAccessor] extends [never]
      ? D
      : SubDocument<D, ParentAccessor>
    : never;

/**
 * Return the path to the closest property.
 */
export type PathToClosestProperty<T extends string> = T extends unknown
  ? JoinSegments<PopUntilProperty<SplitIntoSegments<T>>>
  : never;

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
 * PathToParentProperty<'path.to.array[-1]'> = 'path.to'
 * PathToParentProperty<`path.to.array[${number}]`> = 'path.to'
 * PathToParentProperty<`path.to.array[42][${number}]`> = 'path.to'
 * PathToParentProperty<'path.to.array[42].prop'> = 'path.to.array'
 */
export type PathToParentAccessor<T extends string> =
  SplitIntoSegments<T> extends [...infer Rest extends string[], unknown]
    ? 1 extends Partial<Rest>['length']
      ? JoinSegments<Rest>
      : never
    : never;

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
