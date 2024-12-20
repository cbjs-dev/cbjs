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
import { IfStrict, IsExactly } from '../../../misc/index.js';
import { IsArrayLengthKnown, ResolveIndex, TupleIndexes } from './array-utils.types.js';

/**
 * THIS IS FOR TESTS PURPOSES ONLY.
 */

export type AssertTests<T extends Record<string, readonly [boolean, boolean]>> =
  keyof T extends infer Name extends string
    ? Name extends unknown
      ? T[Name] extends [infer Expected extends boolean, infer Actual extends boolean]
        ? IfStrict<
            IsExactly<Expected, Actual>,
            true,
            {
              Name: Name;
              Expected: Expected;
              Actual: Actual;
            }
          >
        : never
      : never
    : 'Only string keys are allowed';

export type TestDocRequiredProperties = {
  String: string;
  Number: number;
  NonMatchingTuple: [number, string];
  ArrayKnownLength: [number, number];
  ArrayUnknownLength: number[];
  ArrayHeadRest: [...number[], number];
  ArrayHeadRestIncompatibleTail: [...string[], number];
  ArrayTailRest: [number, ...number[]];
  ArrayTailRestIncompatibleHead: [number, ...string[]];
};

export type BuildReadonlyProperties<T extends object> = {
  readonly [Key in Extract<keyof T, string> as `ReadonlyProperty${Key}`]: T[Key];
};

export type BuildOptionalProperties<T extends object> = {
  [Key in Extract<keyof T, string> as `Optional${Key}`]?: T[Key];
};

// prettier-ignore
export type BuildReadonlyArrayProperties<T extends object> = {
  [Key in Extract<keyof T, string> as
    T[Key] extends ReadonlyArray<unknown> ?
      `Readonly${Key}` :
    never
  ]: T[Key] extends infer Value extends ReadonlyArray<unknown>
    ? Readonly<Value>
    : T[Key];
};

/**
 * Extract all the possible keys of an array.
 */
// prettier-ignore
type TargetableArrayIndexes<T extends ReadonlyArray<unknown>> =
  IsArrayLengthKnown<T> extends false ?
    // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
    -1 | (number & unknown) :
  0 extends TupleIndexes<T> ?
    -1 | TupleIndexes<T> :
  never
;

/**
 * Union of all paths to all elements of the object.
 * NOTE : This is a modified version that uses a modified version of ArrayAccessor to generate
 * static index number instead of template literals.
 */
export type MakeTestPaths<
  T extends object,
  IsRoot extends boolean = true,
  K extends keyof T = keyof T,
> = K extends AccessibleKey
  ? `${Accessor<T, K, IsRoot>}${
      | ''
      | (ResolveIndex<T, K> extends infer Index extends keyof T
          ? T[Index] extends infer Doc
            ? Doc extends readonly unknown[]
              ? TargetableArrayIndexes<Doc> extends infer Index extends number
                ? MakeTestPaths<Doc, false, Index>
                : never
              : Doc extends object
                ? MakeTestPaths<Doc, false>
                : ''
            : never
          : never)}`
  : never;

type AccessibleKey = string | number;
type ArrayAccessor<T extends readonly unknown[], K extends AccessibleKey> =
  K extends TargetableArrayIndexes<T>
    ? number extends K
      ? '[0]' | '[1]' | '[2]' | '[-1]'
      : `[${K}]`
    : never;

type ObjectAccessor<K extends AccessibleKey, IsRoot extends boolean> = IsRoot extends true
  ? K
  : `.${K}`;

/**
 * String literal to access the next element.
 */
type Accessor<
  T,
  K extends AccessibleKey,
  IsRoot extends boolean,
> = T extends readonly unknown[] ? ArrayAccessor<T, K> : ObjectAccessor<K, IsRoot>;
