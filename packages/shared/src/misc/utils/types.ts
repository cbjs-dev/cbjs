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

export type IsUnion<T> = [T] extends [UnionToIntersection<T>] ? false : true;

/**
 * Merge all intersections, giving a more human-friendly format.
 */
export type Pretty<T> = {
  [Key in keyof T]: T[Key];
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
} & NonNullable<unknown>;

/**
 * Node.js primitive types.
 */
export type Primitive = string | number | undefined | null | boolean | bigint;

/**
 * Return true if any of the given element of the tuple is `true`.
 */
export type Or<T extends boolean[]> = true extends T[number] ? true : false;

/**
 * Return true if all of the given element of the tuple are `true`.
 */
export type And<T extends boolean[]> = T[number] extends true ? true : false;

/**
 * Negate the given type argument.
 */
export type Not<T extends boolean> = T extends true ? false : true;

/**
 * Return `Then` if `Case` if true, false otherwise.
 */
export type If<Case extends boolean, Then, Else = never> = Case extends true
  ? Then
  : Else;

/**
 * Return `true` if `X` extends `Y`.
 */
export type Extends<X, Y> = X extends Y ? true : false;

/**
 * Return `T` if it extends `U`, otherwise fallback to `V`.
 */
export type Try<T, U, V = never> = T extends U ? T : V;

/**
 * Same as {@link Try} but `never` triggers the fallback.
 */
export type TrySafe<T, U, V = never> = IsNever<T> extends true ? V : T extends U ? T : V;

/**
 * Return true if T is `never`.
 */
export type IsNever<T> = [T] extends [never] ? true : false;

/**
 * Return true if T is `any`.
 */
export type IsAny<T> = 1 extends 2 & T ? true : false;

/**
 * Return true if the two given types are exactly the same.
 */
export type IsExactly<X, Y> =
  (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? true : false;

/**
 * UnionToIntersection<{ foo: string } | { bar: string }> =
 *  { foo: string } & { bar: string }.
 */
export type UnionToIntersection<U> = (U extends unknown ? (arg: U) => 0 : never) extends (
  arg: infer I
) => 0
  ? I
  : never;

/**
 * LastInUnion<1 | 2> = 2.
 */
type LastInUnion<U> =
  UnionToIntersection<U extends unknown ? (x: U) => 0 : never> extends (x: infer L) => 0
    ? L
    : never;

/**
 * UnionToTuple<1 | 2> = [1, 2].
 */
export type UnionToTuple<U, Last = LastInUnion<U>> = [U] extends [never]
  ? readonly []
  : readonly [...UnionToTuple<Exclude<U, Last>>, Last];

/**
 * Extract the string up the delimiter.
 * The delimiter can be escaped if surrounded by `LiteralWrapper`.
 */
// prettier-ignore
export type CaptureUntil<
  T extends string,
  Delimiter extends string,
  LiteralWrapper extends string,
> =
  T extends `${infer Head}${LiteralWrapper}${infer Tail}` ?
    Head extends `${infer SubstringHead}${Delimiter}${string}` ?
      SubstringHead :
    Tail extends `${infer LiteralSubstring}${LiteralWrapper}${infer AfterLiteralSubstring}` ?
      AfterLiteralSubstring extends `${infer SubstringTail}${Delimiter}${string}` ?
        `${Head}${LiteralWrapper}${LiteralSubstring}${LiteralWrapper}${SubstringTail}` :
      `${Head}${LiteralWrapper}${LiteralSubstring}${LiteralWrapper}` :
    never :
  T extends `${infer Head}${Delimiter}${string}` ?
    Head :
  T
;

/**
 * Split a string into a tuple using `Delimiter`.
 * The delimiter can be escaped if surrounded by `LiteralWrapper`.
 */
export type Split<
  T extends string,
  Delimiter extends string,
  LiteralWrapper extends string,
> = SplitTRE<T, Delimiter, LiteralWrapper, []>;

// prettier-ignore
export type SplitTRE<
  T extends string,
  Delimiter extends string,
  LiteralWrapper extends string,
  Acc extends ReadonlyArray<string>
> =
  CaptureUntil<T, Delimiter, LiteralWrapper> extends infer FirstChunk extends string ?
    T extends `${FirstChunk}${Delimiter}${infer Rest}` ?
      SplitTRE<Rest, Delimiter, LiteralWrapper, [...Acc, FirstChunk]> :
    [...Acc, FirstChunk] :
  Acc
;

/**
 * Join a tuple of string into a string.
 */
export type Join<
  Tuple extends ReadonlyArray<unknown>,
  Glue extends string,
  InitialString extends string = '',
> = Tuple extends readonly [
  infer Head extends string,
  ...infer Rest extends ReadonlyArray<string>,
]
  ? InitialString extends ''
    ? Join<Rest, Glue, `${Head}`>
    : Join<Rest, Glue, `${InitialString}${Glue}${Head}`>
  : InitialString;

export type NonVoid<T> = T extends void ? never : T;

export type Class<Instance> = new (...args: never[]) => Instance;

export type InstanceOf<T> = T extends Class<infer Instance> ? Instance : never;

export type OptionalProps<T extends NonNullable<unknown>, K extends keyof T> = Pretty<
  T extends unknown ? Omit<T, K> & Partial<Pick<T, K>> : never
>;

export type RequiredProps<T, K extends keyof T> = Pretty<
  Omit<T, K> & Required<Pick<T, K>>
>;

export type PromiseValue<T> = T extends Promise<infer V> ? V : T;

/**
 * Artificially block TS from inferring the given type parameter, stopping union creation
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type NoInfer<T> = [T][T extends any ? 0 : never];
