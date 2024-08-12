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
import type {
  If,
  IsExactly,
  IsNever,
  Join,
  Primitive,
  TrySafe,
  UnionToTuple,
} from '../../../misc/index.js';
import { ArrayEntries, TupleFilter } from './array-utils.types.js';

/**
 * Basic string description of a type.
 * For debug purpose.
 * Distributive.
 */
export type TypeOf<T> = T extends unknown
  ? T extends string
    ? If<IsExactly<T, string>, 'string', `string::${T}`>
    : T extends boolean
      ? T extends true
        ? 'boolean::true'
        : 'boolean::false'
      : T extends null
        ? 'null'
        : T extends undefined
          ? 'undefined'
          : T extends ReadonlyArray<unknown>
            ? `array`
            : T extends { [K: keyof any]: unknown }
              ? `object(${Join<TupleFilter<UnionToTuple<keyof T>, string, true>, ', '>})`
              : 'unknownType'
  : never;

/**
 * Return the type argument wrapped into a tuple.
 * Used in order to access the original type within a distributed condition.
 *
 * @example
 * SaveIdentity<T> extends [infer Self] ?
 *   T extends unknown ?
 *     // `T` is distributed, `Self` is not
 *   never :
 * never
 */
export type SaveIdentity<T> = [T];

/**
 * Convert a string type into a number type.
 */
export type ToNumber<T> = T extends `${infer N extends number}` ? N : never;

/**
 * Wrap all the values in a tuple.
 */
export type WrapEach<
  Tuple extends ReadonlyArray<string>,
  Left extends string = '',
  Right extends string = '',
> = WrapEachTRE<Tuple, Left, Right, []>;

export type WrapEachTRE<
  Tuple extends ReadonlyArray<string>,
  Left extends string = '',
  Right extends string = '',
  Acc extends ReadonlyArray<unknown> = [],
> = Tuple extends [infer Head extends string, ...infer Rest extends ReadonlyArray<string>]
  ? WrapEachTRE<Rest, Left, Right, [...Acc, `${Left}${Head}${Right}`]>
  : Acc;

/**
 * Return a union of the required keys of the type argument.
 */
export type RequiredKeys<T> = Extract<
  {
    [K in keyof T]-?: NonNullable<unknown> extends Pick<T, K> ? never : K;
  }[keyof T],
  keyof T
>;

/**
 * Return a union of the optional keys of the type argument.
 */
export type OptionalKeys<T> = Exclude<keyof T, RequiredKeys<T>>;

/**
 * Extract writable keys of an object.
 */
export type WritableKeys<T extends object> = {
  [K in keyof T]: IsExactly<Pick<T, K>, { readonly [RO in K]: T[K] }> extends false
    ? K
    : never;
}[keyof T];
