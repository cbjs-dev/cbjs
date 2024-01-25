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

import { describe, expectTypeOf, it } from 'vitest';

import {
  ArrayAppendElement,
  ArrayEntries,
  ArrayIndexes,
  ArrayLastIndex,
  ArrayMinLength,
  ArrayPrependElement,
  GetArrayInfo,
  GuaranteedIndexes,
  IsIndexRemovalStrictlyForbidden,
  ResolveNegativeIndex,
  TupleFilter,
  TupleIndexes,
} from './array-utils.types';

describe('ArrayIndexes', function () {
  it('should return all the keys of a tuple', function () {
    expectTypeOf<ArrayIndexes<[string, number]>>().toEqualTypeOf<0 | 1>();
  });

  it('should return `number` for a variable-length array', function () {
    expectTypeOf<ArrayIndexes<string[]>>().toEqualTypeOf<number>();
    expectTypeOf<ArrayIndexes<Array<{ foo: string }>>>().toEqualTypeOf<number>();
  });
});

describe('TupleIndexes', function () {
  it('should return all the keys of a tuple', function () {
    expectTypeOf<TupleIndexes<[string, number]>>().toEqualTypeOf<0 | 1>();
  });

  it('should return `never` for a variable-length array', function () {
    expectTypeOf<TupleIndexes<[string, ...string[]]>>().toBeNever();
    expectTypeOf<TupleIndexes<string[]>>().toBeNever();
  });
});

describe('GuaranteedIndexes', function () {
  it('should return all the keys of a tuple', function () {
    expectTypeOf<GuaranteedIndexes<[]>>().toBeNever();
    expectTypeOf<GuaranteedIndexes<[string]>>().toEqualTypeOf<0>();
    expectTypeOf<GuaranteedIndexes<[string, number]>>().toEqualTypeOf<0 | 1>();
  });

  it('should return the keys of the static part if the array have a minimum length', function () {
    expectTypeOf<GuaranteedIndexes<[string, string, ...string[]]>>().toEqualTypeOf<
      0 | 1
    >();
  });

  it('should return `never` for an array with no minimum length', function () {
    expectTypeOf<GuaranteedIndexes<string[]>>().toBeNever();
  });
});

describe('ArrayEntries', function () {
  it('should return a union of entries', function () {
    expectTypeOf<ArrayEntries<[string, number]>>().toEqualTypeOf<
      [0, string] | [1, number]
    >();
  });

  it('should return a union of entries to which you can assign the given type', function () {
    expectTypeOf<ArrayEntries<[string, number], number>>().toEqualTypeOf<[1, number]>();

    expectTypeOf<ArrayEntries<number[], number>>().toEqualTypeOf<[number, number]>();

    expectTypeOf<ArrayEntries<[string, number | undefined], number>>().toEqualTypeOf<
      [1, number | undefined]
    >();
  });
});

describe('ArrayFilter', function () {
  it('should retain tuple entries to which you can assign the given type', function () {
    expectTypeOf<TupleFilter<[string, number], number>>().toEqualTypeOf<[number]>();
    expectTypeOf<TupleFilter<[number, number], number>>().toEqualTypeOf<
      [number, number]
    >();
    expectTypeOf<TupleFilter<[number, string], number>>().toEqualTypeOf<[number]>();
    expectTypeOf<TupleFilter<readonly [number, string], number>>().toEqualTypeOf<
      [number]
    >();

    expectTypeOf<TupleFilter<['title', 0], string>>().toEqualTypeOf<[]>();
    expectTypeOf<TupleFilter<['title', 0], number>>().toEqualTypeOf<[]>();
  });

  it('should retain tuple entries to which the given type can be assigned', function () {
    expectTypeOf<TupleFilter<[string, number], number, true>>().toEqualTypeOf<[number]>();
    expectTypeOf<TupleFilter<[number, number], number, true>>().toEqualTypeOf<
      [number, number]
    >();
    expectTypeOf<TupleFilter<[number, string], number, true>>().toEqualTypeOf<[number]>();
    expectTypeOf<TupleFilter<readonly [number, string], number, true>>().toEqualTypeOf<
      [number]
    >();

    expectTypeOf<TupleFilter<['title', 0], string, true>>().toEqualTypeOf<['title']>();
    expectTypeOf<TupleFilter<['title', 0], number, true>>().toEqualTypeOf<[0]>();
  });
});

describe('ResolveNegativeIndex', function () {
  it('should resolve the last element of a tuple', function () {
    expectTypeOf<ResolveNegativeIndex<[string], -1>>().toEqualTypeOf<0>();
    expectTypeOf<ResolveNegativeIndex<[string, number], -1>>().toEqualTypeOf<1>();
    expectTypeOf<
      ResolveNegativeIndex<readonly [string, number], -1>
    >().toEqualTypeOf<1>();
  });
});

describe('ArrayLastIndex', function () {
  it('should return the last key of the array', function () {
    expectTypeOf<ArrayLastIndex<string[]>>().toEqualTypeOf<number>();
    expectTypeOf<ArrayLastIndex<[string]>>().toEqualTypeOf<0>();
    expectTypeOf<ArrayLastIndex<[string, string]>>().toEqualTypeOf<1>();
    expectTypeOf<ArrayLastIndex<[string, number]>>().toEqualTypeOf<1>();
    expectTypeOf<ArrayLastIndex<[...string[], string]>>().toEqualTypeOf<number>();
    expectTypeOf<ArrayLastIndex<[string, ...string[]]>>().toEqualTypeOf<number>();
    expectTypeOf<ArrayLastIndex<[string, ...number[]]>>().toEqualTypeOf<number>();
  });
});

describe('ArrayPrependElement', function () {
  it('should return the type of element you can prepend', function () {
    expectTypeOf<ArrayPrependElement<[string]>>().toBeNever();
    expectTypeOf<ArrayPrependElement<[...string[], string]>>().toEqualTypeOf<string>();
    expectTypeOf<
      ArrayPrependElement<[...string[], string, string]>
    >().toEqualTypeOf<string>();
    expectTypeOf<ArrayPrependElement<[...(number | string)[], string]>>().toEqualTypeOf<
      number | string
    >();
    expectTypeOf<ArrayPrependElement<[string, ...string[]]>>().toEqualTypeOf<string>();
    expectTypeOf<ArrayPrependElement<[string, ...number[]]>>().toBeNever();
    expectTypeOf<ArrayPrependElement<[string, number, ...number[]]>>().toBeNever();
    expectTypeOf<ArrayPrependElement<string[]>>().toEqualTypeOf<string>();

    expectTypeOf<ArrayPrependElement<readonly [string]>>().toBeNever();
    expectTypeOf<ArrayPrependElement<readonly [...string[], string]>>().toBeNever();
    expectTypeOf<ArrayPrependElement<readonly [...number[], string]>>().toBeNever();
    expectTypeOf<ArrayPrependElement<readonly [string, ...string[]]>>().toBeNever();
    expectTypeOf<ArrayPrependElement<readonly [string, ...number[]]>>().toBeNever();
    expectTypeOf<ArrayPrependElement<readonly string[]>>().toBeNever();
  });
});

describe('ArrayAppendElement', function () {
  it('should return the type of element you can append', function () {
    expectTypeOf<ArrayAppendElement<[string]>>().toBeNever();
    expectTypeOf<ArrayAppendElement<[...string[], string]>>().toEqualTypeOf<string>();
    expectTypeOf<
      ArrayAppendElement<[...(string | number)[], string]>
    >().toEqualTypeOf<string>();
    expectTypeOf<ArrayAppendElement<[...number[], string]>>().toBeNever();
    expectTypeOf<ArrayAppendElement<[...number[], string, number]>>().toBeNever();
    expectTypeOf<ArrayAppendElement<[string, ...string[]]>>().toEqualTypeOf<string>();
    expectTypeOf<
      ArrayAppendElement<[string, string, ...string[]]>
    >().toEqualTypeOf<string>();
    expectTypeOf<ArrayAppendElement<[string, ...number[]]>>().toEqualTypeOf<number>();
    expectTypeOf<
      ArrayAppendElement<[number, string, ...number[]]>
    >().toEqualTypeOf<number>();
    expectTypeOf<ArrayAppendElement<string[]>>().toEqualTypeOf<string>();

    expectTypeOf<ArrayAppendElement<readonly [string]>>().toBeNever();
    expectTypeOf<ArrayAppendElement<readonly [...string[], string]>>().toBeNever();
    expectTypeOf<ArrayAppendElement<readonly [...number[], string]>>().toBeNever();
    expectTypeOf<ArrayAppendElement<readonly [string, ...string[]]>>().toBeNever();
    expectTypeOf<ArrayAppendElement<readonly [string, ...number[]]>>().toBeNever();
    expectTypeOf<ArrayAppendElement<readonly string[]>>().toBeNever();
  });
});

describe('GetArrayInfo', function () {
  it('should return information about the static portion of the array', function () {
    expectTypeOf<GetArrayInfo<[string, string]>>().toEqualTypeOf<{
      IsHeadStatic: true;
      IsTailStatic: true;
      IsFullyStatic: true;
      RestElement: never;
      StaticSlice: readonly [string, string];
    }>();

    expectTypeOf<GetArrayInfo<[...string[], number, object]>>().toEqualTypeOf<{
      IsHeadStatic: false;
      IsTailStatic: true;
      IsFullyStatic: false;
      RestElement: string;
      StaticSlice: readonly [number, object];
    }>();

    expectTypeOf<GetArrayInfo<[string, number, ...object[]]>>().toEqualTypeOf<{
      IsHeadStatic: true;
      IsTailStatic: false;
      IsFullyStatic: false;
      RestElement: object;
      StaticSlice: readonly [string, number];
    }>();

    expectTypeOf<GetArrayInfo<string[]>>().toEqualTypeOf<{
      IsHeadStatic: false;
      IsTailStatic: false;
      IsFullyStatic: false;
      RestElement: string;
      StaticSlice: readonly [];
    }>();

    // RO input

    expectTypeOf<GetArrayInfo<readonly [string, string]>>().toEqualTypeOf<{
      IsHeadStatic: true;
      IsTailStatic: true;
      IsFullyStatic: true;
      RestElement: never;
      StaticSlice: readonly [string, string];
    }>();

    expectTypeOf<GetArrayInfo<readonly [...string[], number, object]>>().toEqualTypeOf<{
      IsHeadStatic: false;
      IsTailStatic: true;
      IsFullyStatic: false;
      RestElement: string;
      StaticSlice: readonly [number, object];
    }>();

    expectTypeOf<GetArrayInfo<readonly [string, number, ...object[]]>>().toEqualTypeOf<{
      IsHeadStatic: true;
      IsTailStatic: false;
      IsFullyStatic: false;
      RestElement: object;
      StaticSlice: readonly [string, number];
    }>();

    expectTypeOf<GetArrayInfo<readonly string[]>>().toEqualTypeOf<{
      IsHeadStatic: false;
      IsTailStatic: false;
      IsFullyStatic: false;
      RestElement: string;
      StaticSlice: readonly [];
    }>();
  });
});

describe('ArrayMinLength', function () {
  it('should return the minimum length of the array', function () {
    expectTypeOf<ArrayMinLength<[string]>>().toEqualTypeOf<1>();
    expectTypeOf<ArrayMinLength<[...string[], string]>>().toEqualTypeOf<1>();
    expectTypeOf<ArrayMinLength<[...number[], string]>>().toEqualTypeOf<1>();
    expectTypeOf<ArrayMinLength<[string, ...string[]]>>().toEqualTypeOf<1>();
    expectTypeOf<ArrayMinLength<[string, object, ...number[]]>>().toEqualTypeOf<2>();
    expectTypeOf<ArrayMinLength<string[]>>().toEqualTypeOf<0>();

    expectTypeOf<ArrayMinLength<readonly [string]>>().toEqualTypeOf<1>();
    expectTypeOf<ArrayMinLength<readonly [...string[], string]>>().toEqualTypeOf<1>();
    expectTypeOf<ArrayMinLength<readonly [...number[], string]>>().toEqualTypeOf<1>();
    expectTypeOf<ArrayMinLength<readonly [string, ...string[]]>>().toEqualTypeOf<1>();
    expectTypeOf<ArrayMinLength<readonly [string, ...number[]]>>().toEqualTypeOf<1>();
    expectTypeOf<
      ArrayMinLength<readonly [string, object, ...number[]]>
    >().toEqualTypeOf<2>();
    expectTypeOf<ArrayMinLength<readonly string[]>>().toEqualTypeOf<0>();
  });
});

describe('IsIndexRemovalStrictlyForbidden', function () {
  it('should return true if the index not removable', function () {
    expectTypeOf<
      IsIndexRemovalStrictlyForbidden<[string], number>
    >().toEqualTypeOf<true>();
    expectTypeOf<IsIndexRemovalStrictlyForbidden<[string], 0>>().toEqualTypeOf<true>();
    expectTypeOf<IsIndexRemovalStrictlyForbidden<[string], 1>>().toEqualTypeOf<true>();
    expectTypeOf<IsIndexRemovalStrictlyForbidden<[string], -1>>().toEqualTypeOf<true>();

    expectTypeOf<
      IsIndexRemovalStrictlyForbidden<[...string[], string], number>
    >().toEqualTypeOf<false>();
    expectTypeOf<
      IsIndexRemovalStrictlyForbidden<[...string[], string], 0>
    >().toEqualTypeOf<false>();
    expectTypeOf<
      IsIndexRemovalStrictlyForbidden<[...string[], string], 1>
    >().toEqualTypeOf<false>();
    expectTypeOf<
      IsIndexRemovalStrictlyForbidden<[...string[], string], -1>
    >().toEqualTypeOf<false>();

    expectTypeOf<
      IsIndexRemovalStrictlyForbidden<[...string[], number], number>
    >().toEqualTypeOf<false>();
    expectTypeOf<
      IsIndexRemovalStrictlyForbidden<[...string[], number], 0>
    >().toEqualTypeOf<false>();
    expectTypeOf<
      IsIndexRemovalStrictlyForbidden<[...string[], number], 1>
    >().toEqualTypeOf<false>();
    expectTypeOf<
      IsIndexRemovalStrictlyForbidden<[...string[], number], -1>
    >().toEqualTypeOf<true>();

    expectTypeOf<
      IsIndexRemovalStrictlyForbidden<[string, ...string[]], number>
    >().toEqualTypeOf<false>();
    expectTypeOf<
      IsIndexRemovalStrictlyForbidden<[string, ...string[]], 0>
    >().toEqualTypeOf<false>();
    expectTypeOf<
      IsIndexRemovalStrictlyForbidden<[string, ...string[]], 1>
    >().toEqualTypeOf<false>();
    expectTypeOf<
      IsIndexRemovalStrictlyForbidden<[string, ...string[]], -1>
    >().toEqualTypeOf<false>();

    expectTypeOf<
      IsIndexRemovalStrictlyForbidden<[string, object, ...number[]], number>
    >().toEqualTypeOf<false>();
    expectTypeOf<
      IsIndexRemovalStrictlyForbidden<[string, object, ...number[]], 0>
    >().toEqualTypeOf<true>();
    expectTypeOf<
      IsIndexRemovalStrictlyForbidden<[string, object, ...number[]], 1>
    >().toEqualTypeOf<true>();
    expectTypeOf<
      IsIndexRemovalStrictlyForbidden<[string, object, ...number[]], 2>
    >().toEqualTypeOf<false>();

    expectTypeOf<
      IsIndexRemovalStrictlyForbidden<string[], number>
    >().toEqualTypeOf<false>();
    expectTypeOf<IsIndexRemovalStrictlyForbidden<string[], 0>>().toEqualTypeOf<false>();
    expectTypeOf<IsIndexRemovalStrictlyForbidden<string[], 1>>().toEqualTypeOf<false>();
    expectTypeOf<IsIndexRemovalStrictlyForbidden<string[], -1>>().toEqualTypeOf<false>();

    // RO input

    expectTypeOf<
      IsIndexRemovalStrictlyForbidden<readonly [string], number>
    >().toEqualTypeOf<true>();
    expectTypeOf<
      IsIndexRemovalStrictlyForbidden<readonly [string], 0>
    >().toEqualTypeOf<true>();
    expectTypeOf<
      IsIndexRemovalStrictlyForbidden<readonly [string], 1>
    >().toEqualTypeOf<true>();
    expectTypeOf<
      IsIndexRemovalStrictlyForbidden<readonly [string], -1>
    >().toEqualTypeOf<true>();

    expectTypeOf<
      IsIndexRemovalStrictlyForbidden<readonly [...string[], string], number>
    >().toEqualTypeOf<true>();
    expectTypeOf<
      IsIndexRemovalStrictlyForbidden<readonly [...string[], string], 0>
    >().toEqualTypeOf<true>();
    expectTypeOf<
      IsIndexRemovalStrictlyForbidden<readonly [...string[], string], 1>
    >().toEqualTypeOf<true>();
    expectTypeOf<
      IsIndexRemovalStrictlyForbidden<readonly [...string[], string], -1>
    >().toEqualTypeOf<true>();

    expectTypeOf<
      IsIndexRemovalStrictlyForbidden<readonly [...string[], number], number>
    >().toEqualTypeOf<true>();
    expectTypeOf<
      IsIndexRemovalStrictlyForbidden<readonly [...string[], number], 0>
    >().toEqualTypeOf<true>();
    expectTypeOf<
      IsIndexRemovalStrictlyForbidden<readonly [...string[], number], 1>
    >().toEqualTypeOf<true>();
    expectTypeOf<
      IsIndexRemovalStrictlyForbidden<readonly [...string[], number], -1>
    >().toEqualTypeOf<true>();

    expectTypeOf<
      IsIndexRemovalStrictlyForbidden<readonly [string, ...string[]], number>
    >().toEqualTypeOf<true>();
    expectTypeOf<
      IsIndexRemovalStrictlyForbidden<readonly [string, ...string[]], 0>
    >().toEqualTypeOf<true>();
    expectTypeOf<
      IsIndexRemovalStrictlyForbidden<readonly [string, ...string[]], 1>
    >().toEqualTypeOf<true>();
    expectTypeOf<
      IsIndexRemovalStrictlyForbidden<readonly [string, ...string[]], -1>
    >().toEqualTypeOf<true>();

    expectTypeOf<
      IsIndexRemovalStrictlyForbidden<readonly [string, object, ...number[]], number>
    >().toEqualTypeOf<true>();
    expectTypeOf<
      IsIndexRemovalStrictlyForbidden<readonly [string, object, ...number[]], 0>
    >().toEqualTypeOf<true>();
    expectTypeOf<
      IsIndexRemovalStrictlyForbidden<readonly [string, object, ...number[]], 1>
    >().toEqualTypeOf<true>();
    expectTypeOf<
      IsIndexRemovalStrictlyForbidden<readonly [string, object, ...number[]], 2>
    >().toEqualTypeOf<true>();

    expectTypeOf<
      IsIndexRemovalStrictlyForbidden<readonly string[], number>
    >().toEqualTypeOf<true>();
    expectTypeOf<
      IsIndexRemovalStrictlyForbidden<readonly string[], 0>
    >().toEqualTypeOf<true>();
    expectTypeOf<
      IsIndexRemovalStrictlyForbidden<readonly string[], 1>
    >().toEqualTypeOf<true>();
    expectTypeOf<
      IsIndexRemovalStrictlyForbidden<readonly string[], -1>
    >().toEqualTypeOf<true>();
  });
});
