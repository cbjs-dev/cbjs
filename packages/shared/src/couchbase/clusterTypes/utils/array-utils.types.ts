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
import { IsExactly, IsNever, Not } from '../../../misc/index.js';

/**
 * A union of all the possible types in the array.
 */
export type ArrayElement<T> = T extends ReadonlyArray<infer E> ? E : never;

/**
 * Return `true` if T is a readonly array.
 * {@link IsReadonly} will yield the same result, but `IsReadonlyArray` is cheaper.
 */
export type IsReadonlyArray<T> = T extends unknown[] ? false : true;

// prettier-ignore
type ArrayHasOptionalElement<T extends ReadonlyArray<unknown>> =
  number extends T['length'] ?
    false :
  Not<IsNever<Exclude<T[T['length']], undefined>>>
;

/**
 * Return true if the length of `T` cannot be changed.
 * = not variadic array & not readonly
 *
 * @example
 * IsArrayLengthFixed<string[]> // false
 * IsArrayLengthFixed<[string]> // true
 * IsArrayLengthFixed<[string, string?]> // false
 * IsArrayLengthFixed<[string, ...string[]]> // false
 * IsArrayLengthFixed<readonly [string, ...string[]]> // true
 */
// prettier-ignore
export type IsArrayLengthFixed<T> =
  T extends ReadonlyArray<unknown> ?
    IsReadonlyArray<T> extends true ?
      true :
    IsVariadicArray<T> extends true ?
      false :
    true :
  never
;

// prettier-ignore
export type IsVariadicArray<T extends ReadonlyArray<unknown>> =
  number extends T['length'] ?
    true :
  ArrayHasOptionalElement<T> extends true ?
    true :
  false
;

/**
 * Return true if `T` the length of the array is known.
 * This includes array with a known number of optional elements.
 *
 * @example
 * IsArrayLengthKnown<string[]> // false - length is `number`
 * IsArrayLengthKnown<[string]> // true - length is `1`
 * IsArrayLengthKnown<[string, string]> // true - length is `1 | 2`
 */
// prettier-ignore
export type IsArrayLengthKnown<T extends ReadonlyArray<unknown>> =
  number extends T['length'] ? false : true
;

/**
 * Extract all keys in a fixed-length array.
 */
// prettier-ignore
export type TupleIndexes<T extends ReadonlyArray<unknown>> =
  IsArrayLengthKnown<T> extends true ?
    ArrayInfo<T> extends infer Info extends ArrayInfoShape ?
      Exclude<Partial<T>['length'], Info['MaxLength']> :
    never :
  never
;

/**
 * Extract all the possible keys of an array.
 */
export type ArrayIndexes<T extends ReadonlyArray<unknown>> =
  IsArrayLengthKnown<T> extends false ? number : TupleIndexes<T>;

/**
 * Extract all the known array's keys, wrapping each of them in a tuple, effectively preventing the merge of the union.
 *
 * ```ts
 * ArrayKnownIndexes<string[]> // [number]
 * ArrayKnownIndexes<string, string, string[]> // [number] | [0] | [1]
 * ArrayKnownIndexes<string, number?> // [0] | [1]
 */
// prettier-ignore
export type ArrayKnownIndexes<T extends ReadonlyArray<unknown>> =
  ArrayInfo<T> extends infer Info extends ArrayInfoShape ?
    Info['IsFullyStatic'] extends true ?
      TupleIndexes<Info['StaticSlice']> extends infer Index ?
        Index extends number ?
          [Index] :
        never :
      never :
    Info['IsHeadStatic'] extends true ?
      number extends Info['OptionalIndexes'] ?
        | [number]
        | (TupleIndexes<Info['StaticSlice']> extends infer Index ?
            Index extends number ? [Index] : never :
          never
          )
      :
        ((TupleIndexes<Info['StaticSlice']> | Info['OptionalIndexes']) extends infer Index ?
          Index extends number ? [Index] : never :
        never
        )
      :
    Info['OptionalIndexes'] extends infer Index ?
      [Index] :
    [number] :
  never
;

/**
 * Return the array keys that are guaranteed to be present.
 */
// prettier-ignore
export type GuaranteedIndexes<T extends ReadonlyArray<unknown>> =
  ArrayInfo<T> extends infer Info extends ArrayInfoShape ?
    Info['IsHeadStatic'] extends true ?
      TupleIndexes<Info['StaticSlice']> :
    never :
  never
;

/**
 * Return the type of the last index of the array.
 */
// prettier-ignore
export type ArrayLastIndex<T extends ReadonlyArray<unknown>> =
  IsArrayLengthKnown<T> extends false ?
    number :
  ArrayInfo<T> extends infer Info extends ArrayInfoShape ?
    Info['LastIndex'] :
  never
;

/**
 * Return the type of the last element of the array.
 */
// prettier-ignore
export type ArrayLastElement<T> =
  T  extends ReadonlyArray<unknown> ?
    ArrayInfo<T> extends infer Info extends ArrayInfoShape ?
      Info['IsFullyStatic'] extends true ?
        T[Info['LastIndex']] :
      Info['IsHeadStatic'] extends true ?
        (Info['OptionalIndexes'] | ArrayInfo<Info['StaticSlice']>['LastIndex']) extends infer PossibleLastIndex ?
          PossibleLastIndex extends number ?
            T[PossibleLastIndex] :
          never :
        never :
      Info['IsTailStatic'] extends true ?
        Info['StaticSlice'][ArrayInfo<Info['StaticSlice']>['LastIndex']] :
      Info['RestElement'] :
    never :
  never
;

/**
 * Transform an array into a union of tuple representing its entries.
 * You can filter the type of the entries value by passing `FilterType`.
 * `FilterType` is not distributed.
 *
 * @example
 * ArrayEntries<[1, 'hi']> // [0, 1] | [1, 'hi']
 * ArrayEntries<[1, 'hi'], string> // [1, 'hi']
 */
export type ArrayEntries<T extends ReadonlyArray<unknown>, FilterType = never> =
  ArrayIndexes<T> extends infer K
    ? K extends keyof T
      ? IsNever<FilterType> extends true
        ? [K, T[K]]
        : FilterType extends T[K]
          ? [K, T[K]]
          : never
      : never
    : never;

/**
 * Return the tuple without elements to which `FilteredType` cannot be assigned.
 *
 * @example
 * TupleFilter<[string], string> // [string]
 * TupleFilter<['title'], string> // [] because `string` cannot be assigned to the literal `title`
 */
// prettier-ignore
export type TupleFilter<
  T extends ReadonlyArray<unknown>,
  FilterType = never,
  ReverseExtend extends boolean = false,
  Filtered extends ReadonlyArray<unknown> = [],
> =
  IsNever<FilterType> extends true ?
    T :
  T extends readonly [infer Head, ...infer Rest] ?
    ReverseExtend extends false ?
      FilterType extends Head ?
        TupleFilter<Rest, FilterType, ReverseExtend, [...Filtered, Head]> :
      TupleFilter<Rest, FilterType, ReverseExtend, Filtered> :
    ReverseExtend extends true ?
      Head extends FilterType ?
        TupleFilter<Rest, FilterType, ReverseExtend, [...Filtered, Head]> :
      TupleFilter<Rest, FilterType, ReverseExtend, Filtered> :
    never :
  Filtered
;

/**
 * Information about an array.
 *
 * `IsHeadStatic`: the static slice located at the beginning of the array.
 *
 * `IsTailStatic`: the static slice located at the end of the array.
 *
 * `IsFullyStatic`: the array is of fixed length. Equivalent to `IsHeadStatic & IsTailStatic`.
 *
 * `RestElement`: the type of the dynamic part of the array.
 *
 * `StaticSlice`: the static portion of the array.
 *
 * @see ArrayInfo
 * @example
 * IsHeadStatic: true; // [string, ...string[]]
 * IsTailStatic: true; // [...string[], string]
 * IsFullyStatic: true; // [string, number]
 * RestElement: number; // [string, ...number[]]
 * StaticSlice: readonly [string, number]; // [string, number, ...object[]]
 */
export type ArrayInfoShape = {
  IsFullyStatic: boolean;
  IsHeadStatic: boolean;
  IsTailStatic: boolean;
  RestElement: unknown;
  StaticSlice: ReadonlyArray<unknown>;
  MinLength: number;
  MaxLength: number;
  LastIndex: number;
  OptionalIndexes: number;
};

/**
 * Return {@link ArrayInfoShape} for the `T`.
 */
// prettier-ignore
export type ArrayInfo<
  T extends ReadonlyArray<unknown>,
  StaticEnd extends 'head' | 'tail' = never,
  StaticSlice extends ReadonlyArray<unknown> = [],
> =
  IsVariadicArray<T> extends false ?
    {
      IsFullyStatic: true;
      IsHeadStatic: true;
      IsTailStatic: true;
      RestElement: never;
      StaticSlice: T;
      MinLength: T['length'];
      MaxLength: T['length'];
      LastIndex: T extends readonly [unknown, ...infer Rest] ? Rest['length'] : never;
      OptionalIndexes: never;
    } :
  T extends readonly [infer Head, ...infer Rest] ?
    ArrayInfo<Rest, 'head', [...StaticSlice, Head]> :
  T extends readonly [...infer Rest, infer Tail] ?
    ArrayInfo<Rest, 'tail', [Tail, ...StaticSlice]> :
  {
    IsFullyStatic: false;
    IsHeadStatic: IsExactly<StaticEnd, 'head'>;
    IsTailStatic: IsExactly<StaticEnd, 'tail'>;
    RestElement: Exclude<ArrayElement<T>, undefined>;
    StaticSlice: StaticSlice;
    MinLength: StaticSlice['length'];
    MaxLength: [...T, ...StaticSlice]['length'];
    LastIndex: [...T, ...StaticSlice] extends readonly [unknown?, ...infer Rest] ? Rest['length'] : number;
    OptionalIndexes:
      number extends [...T, ...StaticSlice]['length'] ?
        number :
      [...T, ...StaticSlice] extends readonly [unknown?, ...infer Rest] ?
        Exclude<Partial<Rest>['length'], Exclude<Partial<StaticSlice>['length'], StaticSlice['length']>> :
      number
  }
;

// prettier-ignore
export type RestElement<T> =
  T extends ReadonlyArray<unknown> ?
    ArrayInfo<T> extends infer Info extends ArrayInfoShape ?
      Info['RestElement'] :
    never :
  never
;

// prettier-ignore
export type IsFullyStaticArray<T> =
  T extends ReadonlyArray<unknown> ?
    ArrayInfo<T> extends infer Info extends ArrayInfoShape ?
      Info['IsFullyStatic'] :
    never :
  never
;

// prettier-ignore
export type IsHeadStatic<T extends ReadonlyArray<unknown>> =
  ArrayInfo<T> extends infer Info extends ArrayInfoShape ?
    Info['IsHeadStatic'] :
  never
;

// prettier-ignore
export type IsTailStatic<T extends ReadonlyArray<unknown>> =
  ArrayInfo<T> extends infer Info extends ArrayInfoShape ?
    Info['IsTailStatic'] :
  never
;

/**
 * Given an array and an index, try to resolve an actual index if the given one is -1, return the given index otherwise.
 */
// prettier-ignore
export type ResolveIndex<T, K> =
  T extends ReadonlyArray<unknown> ?
    K extends -1 ?
      ArrayInfo<T> extends infer Info extends ArrayInfoShape ?
        Info['LastIndex'] :
      never :
    K :
  T extends object ?
    K :
  never
;

/**
 * Return the type of an element you can prepend to the array.
 */
// prettier-ignore
export type ArrayPrependElement<T extends ReadonlyArray<unknown>> =
  IsArrayLengthFixed<T> extends true ?
    never :
  ArrayInfo<T> extends infer Info extends ArrayInfoShape ?
    Info['IsTailStatic'] extends true ?
      Info['RestElement'] :
    Info['IsHeadStatic'] extends true ?
      TupleHasAscendingInheritance<T> extends true ?
        ArrayLastElement<Info['StaticSlice']> extends Info['RestElement'] ?
          Info['StaticSlice'][0] :
        never :
      never :
    Info['RestElement'] :
  never
;

/**
 * Return the type of an element you can append to the array.
 */
// prettier-ignore
export type ArrayAppendElement<T extends ReadonlyArray<unknown>> =
  IsArrayLengthFixed<T> extends true ?
    never :
  ArrayInfo<T> extends infer Info extends ArrayInfoShape ?
    Info['IsHeadStatic'] extends true ?
      Info['RestElement'] :
    Info['IsTailStatic'] extends true ?
      TupleHasDescendingInheritance<T> extends true ?
        Info['StaticSlice'][0] extends Info['RestElement'] ?
          ArrayLastElement<T> :
        never :
      never :
    Info['RestElement'] :
  never
;

/**
 * Returns `true` if every element type can be assigned to the next one.
 */
// prettier-ignore
export type ArrayHasAscendingInheritance<T extends ReadonlyArray<unknown>> =
  ArrayInfo<T> extends infer Info extends ArrayInfoShape ?
    Info['IsFullyStatic'] extends true ?
      TupleHasAscendingInheritance<T> :
    Info['IsHeadStatic'] extends true ?
      TupleHasAscendingInheritance<[...Info['StaticSlice'], Info['RestElement']]> :
    Info['IsTailStatic'] extends true ?
      TupleHasAscendingInheritance<[Info['RestElement'], ...Info['StaticSlice']]> :
    true :
  never
;

/**
 * Returns `true` if every element type can be assigned to the previous one.
 */
// prettier-ignore
export type ArrayHasDescendingInheritance<T> =
  T extends ReadonlyArray<unknown> ?
    ArrayInfo<T> extends infer Info extends ArrayInfoShape ?
      Info['IsFullyStatic'] extends true ?
        TupleHasDescendingInheritance<T> :
      Info['IsHeadStatic'] extends true ?
        TupleHasDescendingInheritance<[...Info['StaticSlice'], Info['RestElement']]> :
      Info['IsTailStatic'] extends true ?
        TupleHasDescendingInheritance<[Info['RestElement'], ...Info['StaticSlice']]> :
      true :
    never :
  never
;

/**
 * Returns `true` if every element type can be assigned to the next one.
 * ! Does not handle variadic arrays
 */
// prettier-ignore
export type TupleHasAscendingInheritance<T> =
  T extends readonly [infer H0, infer H1, ...infer Rest] ?
    [H0] extends [H1] ?
      TupleHasAscendingInheritance<[H1, ...Rest]> :
    false :
  true
;

/**
 * Returns `true` if every element type can be assigned to the previous one.
 * ! Does not handle variadic arrays
 */
// prettier-ignore
export type TupleHasDescendingInheritance<T> =
  T extends readonly [...infer Rest, infer T1, infer T0] ?
    [T0] extends [T1] ?
      TupleHasDescendingInheritance<[...Rest, T1]> :
    false :
  true
;

// prettier-ignore
export type ArrayMap<T extends ReadonlyArray<unknown>, Prop extends keyof ArrayElement<T>> =
  T extends [infer A, ...infer Rest] ?
    Prop extends keyof A ?
      Prop extends keyof ArrayElement<Rest> ?
        [A[Prop], ...ArrayMap<Rest, Prop>] :
      never:
    never:
  []
;

/**
 * Return a slice of an array, starting at the given index `Start` (included), up to the end of the array.
 * Start `number` will return the entire array.
 * Start `-1` will return a tuple containing the last element of the array.
 * Other negative indexes are not supported.
 *
 * ```ts
 * ArraySlice<[string, number, symbol], 1> // [number, symbol]
 * ArraySlice<[string, number, symbol], -1> // [symbol]
 * ArraySlice<[string, number, symbol], number> // [string, number, symbol]
 * ```
 */
// prettier-ignore
export type ArraySlice<T, Start> =
  number extends Start ?
    T :
  Start extends 0 ?
    T :
  Start extends -1 ?
    [ArrayLastElement<T>] :
  T extends ReadonlyArray<unknown> ?
    Start extends number ?
      ArraySliceTRE<T, Start, []> :
    never :
  never
;

// prettier-ignore
type ArraySliceTRE<T extends ReadonlyArray<unknown>, Start extends number, Drop extends ReadonlyArray<unknown>> =
  Drop['length'] extends Start ?
    T :
  T extends [unknown, ...infer Rest] ?
    ArraySliceTRE<Rest, Start, [...Drop, unknown]> :
  T
;

// prettier-ignore
export type IsFirstElementRemovable<T extends ReadonlyArray<unknown>> =
  IsHeadStatic<T> extends true ?
    ArrayHasDescendingInheritance<T> extends true ?
      true :
    false :
  true
;

// prettier-ignore
export type IsLastElementRemovable<T> =
  T  extends ReadonlyArray<unknown> ?
    IsTailStatic<T> extends true ?
      ArrayHasAscendingInheritance<T> extends true ?
        true :
      false :
    true :
  never
;

// prettier-ignore
export type DropTupleHead<T> =
  T extends [unknown, ...infer Rest] ?
    Rest :
  never
;
