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
import { If, IsExactly, IsNever, IsUnion, Or } from '../../../misc/index.js';

/**
 * A union of all the possible types in the array.
 */
export type ArrayElement<T> = T extends ReadonlyArray<infer E> ? E : never;

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
    IsExactly<Readonly<T>, T> extends true ?
      true :
    number extends T['length'] ?
      false :
    IsUnion<T['length']> extends true ?
      false :
    true :
  never
;

// prettier-ignore
export type IsVariadicArray<T> =
  T extends ReadonlyArray<unknown> ?
    number extends T['length'] ?
      true :
    IsUnion<T['length']> extends true ?
      true :
    false :
  never
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
export type IsArrayLengthKnown<T> =
  T extends ReadonlyArray<unknown> ?
    number extends T['length'] ? false : true :
  never
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

type TA = ArrayIndexes<[string, number]>;
type TT = TupleIndexes<[string, number]>;
type TTT = Partial<[string, number]>['length'];
type AI = ArrayInfo<[string, number]>;

/**
 * Extract all the possible keys of an array.
 */
export type ArrayIndexes<T extends ReadonlyArray<unknown>> =
  IsArrayLengthKnown<T> extends false ? number : TupleIndexes<T>;

/**
 * Return the array keys that are guaranteed to be present.
 */
export type GuaranteedIndexes<T extends ReadonlyArray<unknown>> =
  ArrayInfo<T> extends infer Info extends ArrayInfoShape
    ? If<
        Or<[Info['IsHeadStatic'], Info['IsTailStatic']]>,
        TupleIndexes<Info['StaticSlice']>
      >
    : never;

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
export type ArrayLastElement<T extends ReadonlyArray<unknown>> = T[ArrayLastIndex<T>];

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

// prettier-ignore
export type ArrayExclude<T extends ReadonlyArray<unknown>, U> =
  T extends readonly [infer Head, ...infer Rest] ?
    [Exclude<Head, U>, ...ArrayExclude<Rest, U>] :
  []
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
      StaticSlice: Readonly<T>;
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
    StaticSlice: Readonly<StaticSlice>;
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
  K
;

/**
 * Return `true` if we know for sure cannot be removed.
 * `false` does NOT mean that removing the element is 100% safe, it just means it can
 * only be determined at runtime.
 */
export type IsIndexRemovalStrictlyForbidden<
  T extends ReadonlyArray<unknown>,
  K extends number,
> =
  IsArrayLengthFixed<T> extends true
    ? true
    : ArrayInfo<T> extends infer SliceInfo extends ArrayInfoShape
      ? SliceInfo['IsFullyStatic'] extends true
        ? true
        : SliceInfo['IsHeadStatic'] extends true
          ? K extends TupleIndexes<SliceInfo['StaticSlice']>
            ? [SliceInfo['RestElement']] extends [ArrayElement<SliceInfo['StaticSlice']>]
              ? false
              : true
            : false
          : SliceInfo['IsTailStatic'] extends true
            ? K extends -1
              ? [SliceInfo['RestElement']] extends [
                  ArrayElement<SliceInfo['StaticSlice']>,
                ]
                ? false
                : true
              : false
            : false
      : false;

/**
 * Return the type of an element you can prepend to the array.
 */
export type ArrayPrependElement<T extends ReadonlyArray<unknown>> =
  IsArrayLengthFixed<T> extends true
    ? never
    : ArrayInfo<T> extends infer Info extends ArrayInfoShape
      ? Info['IsTailStatic'] extends true
        ? Info['RestElement']
        : Info['IsHeadStatic'] extends true
          ? [ArrayElement<Info['StaticSlice']>] extends [Info['RestElement']]
            ? Info['RestElement']
            : never
          : Info['RestElement']
      : never;

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
      [ArrayElement<Info['StaticSlice']>] extends [Info['RestElement']] ?
        ArrayElement<Info['StaticSlice']> :
      never :
    Info['RestElement'] :
  never
;

/**
 * Extract arrays to which you can prepend an element out of the union.
 */
export type ExtractPrependableArray<T extends ReadonlyArray<unknown>> = T extends unknown
  ? [ArrayPrependElement<T>] extends [never]
    ? never
    : T
  : never;

/**
 * Extract arrays to which you can append an element out of the union.
 */
export type ExtractAppendableArray<T extends ReadonlyArray<unknown>> = T extends unknown
  ? [ArrayAppendElement<T>] extends [never]
    ? never
    : T
  : never;

export type DropTupleHead<T extends ReadonlyArray<unknown>> = T extends [
  unknown,
  ...infer Rest,
]
  ? Rest
  : [];

export type DropTupleTail<T extends ReadonlyArray<unknown>> = T extends [
  ...infer Rest,
  unknown,
]
  ? Rest
  : [];

export type TupleTail<T extends ReadonlyArray<unknown>> = T extends [
  ...ReadonlyArray<unknown>,
  infer Tail,
]
  ? Tail
  : never;

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
