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
import { describe, expectTypeOf, it, test } from 'vitest';

import {
  ArrayAppendElement,
  ArrayEntries,
  ArrayIndexes,
  ArrayInfo,
  ArrayKnownIndexes,
  ArrayLastElement,
  ArrayLastIndex,
  ArrayPrependElement,
  ArraySlice,
  GuaranteedIndexes,
  IsArrayLengthFixed,
  ResolveIndex,
  TupleFilter,
  TupleHasAscendingInheritance,
  TupleHasDescendingInheritance,
  TupleIndexes,
} from './array-utils.types.js';

describe('ArrayIndexes', () => {
  it('should return all the keys of a tuple', () => {
    type Test = ArrayIndexes<[string, number]>;
    expectTypeOf<Test>().toEqualTypeOf<0 | 1>();
  });

  it('should return `number` for a variadic array', () => {
    expectTypeOf<ArrayIndexes<string[]>>().toEqualTypeOf<number>();
    expectTypeOf<ArrayIndexes<Array<{ foo: string }>>>().toEqualTypeOf<number>();
  });

  it('should return 0 | 1 |`number` for a variadic array with min length', () => {
    expectTypeOf<ArrayIndexes<[string, string, ...string[]]>>().toEqualTypeOf<number>();
  });
});

describe('ArrayKnownIndexes', () => {
  test('array', () => {
    expectTypeOf<ArrayKnownIndexes<string[]>>().toEqualTypeOf<[number]>();
  });

  test('static array', () => {
    expectTypeOf<ArrayKnownIndexes<[string, string]>>().toEqualTypeOf<[0] | [1]>();
  });

  test('array with optional element', () => {
    expectTypeOf<ArrayKnownIndexes<[string, string?]>>().toEqualTypeOf<[0] | [1]>();
  });

  test('variadic array static head', () => {
    expectTypeOf<ArrayKnownIndexes<[string, string, ...string[]]>>().toEqualTypeOf<
      [0] | [1] | [number]
    >();
  });

  test('variadic array static tail', () => {
    expectTypeOf<ArrayKnownIndexes<[...string[], string, string]>>().toEqualTypeOf<
      [number]
    >();
  });
});

describe('TupleIndexes', () => {
  it('should return all the keys of a tuple', () => {
    expectTypeOf<TupleIndexes<[string, number]>>().toEqualTypeOf<0 | 1>();
  });

  it('should return `never` for a variable-length array', () => {
    expectTypeOf<TupleIndexes<[string, ...string[]]>>().toBeNever();
    expectTypeOf<TupleIndexes<string[]>>().toBeNever();
  });
});

describe('GuaranteedIndexes', () => {
  it('should return all the keys of a tuple', () => {
    expectTypeOf<GuaranteedIndexes<[]>>().toBeNever();
    expectTypeOf<GuaranteedIndexes<[string]>>().toEqualTypeOf<0>();
    expectTypeOf<GuaranteedIndexes<[string, number]>>().toEqualTypeOf<0 | 1>();
  });

  it('should return the keys of the static part if the array have a minimum length', () => {
    expectTypeOf<GuaranteedIndexes<[string, string, ...string[]]>>().toEqualTypeOf<
      0 | 1
    >();
  });

  it('should return `never` for an array with no minimum length', () => {
    expectTypeOf<GuaranteedIndexes<string[]>>().toBeNever();
  });
});

describe('ArrayEntries', () => {
  it('should return a union of entries', () => {
    expectTypeOf<ArrayEntries<[string, number]>>().toEqualTypeOf<
      [0, string] | [1, number]
    >();
  });

  it('should return a union of entries to which you can assign the given type', () => {
    expectTypeOf<ArrayEntries<[string, number], number>>().toEqualTypeOf<[1, number]>();

    expectTypeOf<ArrayEntries<number[], number>>().toEqualTypeOf<[number, number]>();

    expectTypeOf<ArrayEntries<[string, number | undefined], number>>().toEqualTypeOf<
      [1, number | undefined]
    >();
  });
});

describe('TupleFilter', () => {
  it('should retain tuple entries to which you can assign the given type', () => {
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

  it('should retain tuple entries to which the given type can be assigned', () => {
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

describe('ResolveIndex', () => {
  it('should resolve the last element of a tuple', () => {
    expectTypeOf<ResolveIndex<[string], -1>>().toEqualTypeOf<0>();
    expectTypeOf<ResolveIndex<[string, number], -1>>().toEqualTypeOf<1>();
    expectTypeOf<ResolveIndex<readonly [string, number], -1>>().toEqualTypeOf<1>();
    expectTypeOf<ResolveIndex<[string, number?], -1>>().toEqualTypeOf<1>();
  });
});

describe('ArrayLastIndex', () => {
  it('should return the last key of the array', () => {
    expectTypeOf<ArrayLastIndex<string[]>>().toEqualTypeOf<number>();
    expectTypeOf<ArrayLastIndex<[string]>>().toEqualTypeOf<0>();
    expectTypeOf<ArrayLastIndex<[string, string]>>().toEqualTypeOf<1>();
    expectTypeOf<ArrayLastIndex<[string, number]>>().toEqualTypeOf<1>();
    expectTypeOf<ArrayLastIndex<[string, number?]>>().toEqualTypeOf<1>();
    expectTypeOf<ArrayLastIndex<[...string[], string]>>().toEqualTypeOf<number>();
    expectTypeOf<ArrayLastIndex<[string, ...string[]]>>().toEqualTypeOf<number>();
    expectTypeOf<ArrayLastIndex<[string, ...number[]]>>().toEqualTypeOf<number>();
  });
});

describe('ArrayPrependElement', () => {
  it('should return the type of element you can prepend', () => {
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

// TODO actually test all forms on array
describe('TupleHasMoonwalkingInheritance', () => {
  test('array', () => {
    type Test = TupleHasDescendingInheritance<string[]>;
    expectTypeOf<Test>().toEqualTypeOf<true>();
  });

  test('array of union', () => {
    type Test = TupleHasDescendingInheritance<(string | number)[]>;
    expectTypeOf<Test>().toEqualTypeOf<true>();
  });

  test('same type tuple', () => {
    type Test = TupleHasDescendingInheritance<[string, string]>;
    expectTypeOf<Test>().toEqualTypeOf<true>();
  });

  test('non-matching type tuple', () => {
    type Test = TupleHasDescendingInheritance<[string, number]>;
    expectTypeOf<Test>().toEqualTypeOf<false>();
  });

  test('moonwalking inheritance tuple', () => {
    type Test = TupleHasDescendingInheritance<[string | number, number]>;
    expectTypeOf<Test>().toEqualTypeOf<true>();
  });
});

describe('TupleHasAscendingInheritance', () => {
  test('array', () => {
    type Test = TupleHasAscendingInheritance<string[]>;
    expectTypeOf<Test>().toEqualTypeOf<true>();
  });

  test('array of union', () => {
    type Test = TupleHasAscendingInheritance<(string | number)[]>;
    expectTypeOf<Test>().toEqualTypeOf<true>();
  });

  test('same type tuple', () => {
    type Test = TupleHasAscendingInheritance<[string, string]>;
    expectTypeOf<Test>().toEqualTypeOf<true>();
  });

  test('non-matching type tuple', () => {
    type Test = TupleHasAscendingInheritance<[string, number]>;
    expectTypeOf<Test>().toEqualTypeOf<false>();
  });

  test('ascending inheritance tuple', () => {
    type Test = TupleHasAscendingInheritance<[number, string | number]>;
    expectTypeOf<Test>().toEqualTypeOf<true>();
  });

  test('ascending inheritance variadic array', () => {
    type Test = TupleHasAscendingInheritance<
      [number, string | number, string | number | symbol]
    >;
    expectTypeOf<Test>().toEqualTypeOf<true>();
  });
});

describe('ArrayAppendElement', () => {
  it('should return the type of element you can append', () => {
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

    expectTypeOf<
      ArrayAppendElement<[...('a' | 'b' | 'c')[], 'a', 'b', 'c']>
    >().toBeNever();

    expectTypeOf<
      ArrayAppendElement<['a', 'b', 'c', ...('a' | 'b' | 'c')[]]>
    >().toEqualTypeOf<'a' | 'b' | 'c'>();

    expectTypeOf<ArrayAppendElement<readonly [string]>>().toBeNever();
    expectTypeOf<ArrayAppendElement<readonly [...string[], string]>>().toBeNever();
    expectTypeOf<ArrayAppendElement<readonly [...number[], string]>>().toBeNever();
    expectTypeOf<ArrayAppendElement<readonly [string, ...string[]]>>().toBeNever();
    expectTypeOf<ArrayAppendElement<readonly [string, ...number[]]>>().toBeNever();
    expectTypeOf<ArrayAppendElement<readonly string[]>>().toBeNever();
  });
});

describe('ArrayInfo', () => {
  it('should return information about the static portion of the array', () => {
    expectTypeOf<ArrayInfo<[string, string]>>().toEqualTypeOf<{
      IsHeadStatic: true;
      IsTailStatic: true;
      IsFullyStatic: true;
      RestElement: never;
      StaticSlice: [string, string];
      MinLength: 2;
      MaxLength: 2;
      LastIndex: 1;
      OptionalIndexes: never;
    }>();

    expectTypeOf<ArrayInfo<[...string[], number, object]>>().toEqualTypeOf<{
      IsHeadStatic: false;
      IsTailStatic: true;
      IsFullyStatic: false;
      RestElement: string;
      StaticSlice: [number, object];
      MinLength: 2;
      MaxLength: number;
      LastIndex: number;
      OptionalIndexes: number;
    }>();

    expectTypeOf<ArrayInfo<[string, number, ...object[]]>>().toEqualTypeOf<{
      IsHeadStatic: true;
      IsTailStatic: false;
      IsFullyStatic: false;
      RestElement: object;
      StaticSlice: [string, number];
      MinLength: 2;
      MaxLength: number;
      LastIndex: number;
      OptionalIndexes: number;
    }>();

    expectTypeOf<ArrayInfo<[string, number?, number?]>>().toEqualTypeOf<{
      IsHeadStatic: true;
      IsTailStatic: false;
      IsFullyStatic: false;
      RestElement: number;
      StaticSlice: [string];
      MinLength: 1;
      MaxLength: 3;
      LastIndex: 2;
      OptionalIndexes: 1 | 2;
    }>();

    expectTypeOf<ArrayInfo<string[]>>().toEqualTypeOf<{
      IsHeadStatic: false;
      IsTailStatic: false;
      IsFullyStatic: false;
      RestElement: string;
      StaticSlice: [];
      MinLength: 0;
      MaxLength: number;
      LastIndex: number;
      OptionalIndexes: number;
    }>();

    // RO input

    expectTypeOf<ArrayInfo<readonly [string, string]>>().toEqualTypeOf<{
      IsHeadStatic: true;
      IsTailStatic: true;
      IsFullyStatic: true;
      RestElement: never;
      StaticSlice: readonly [string, string];
      MinLength: 2;
      MaxLength: 2;
      LastIndex: 1;
      OptionalIndexes: never;
    }>();

    expectTypeOf<ArrayInfo<readonly [...string[], number, object]>>().toEqualTypeOf<{
      IsHeadStatic: false;
      IsTailStatic: true;
      IsFullyStatic: false;
      RestElement: string;
      StaticSlice: [number, object];
      MinLength: 2;
      MaxLength: number;
      LastIndex: number;
      OptionalIndexes: number;
    }>();

    expectTypeOf<ArrayInfo<readonly [string, number, ...object[]]>>().toEqualTypeOf<{
      IsHeadStatic: true;
      IsTailStatic: false;
      IsFullyStatic: false;
      RestElement: object;
      StaticSlice: [string, number];
      MinLength: 2;
      MaxLength: number;
      LastIndex: number;
      OptionalIndexes: number;
    }>();

    expectTypeOf<ArrayInfo<readonly string[]>>().toEqualTypeOf<{
      IsHeadStatic: false;
      IsTailStatic: false;
      IsFullyStatic: false;
      RestElement: string;
      StaticSlice: [];
      MinLength: 0;
      MaxLength: number;
      LastIndex: number;
      OptionalIndexes: number;
    }>();
  });
});

describe('ArrayLastElement', () => {
  test('array', () => {
    type Test = ArrayLastElement<string[]>;
    expectTypeOf<Test>().toEqualTypeOf<string>();
  });

  test('readonly array', () => {
    type Test = ArrayLastElement<readonly string[]>;
    expectTypeOf<Test>().toEqualTypeOf<string>();
  });

  test('tuple', () => {
    type Test = ArrayLastElement<[string]>;
    expectTypeOf<Test>().toEqualTypeOf<string>();
  });

  test('tuple with variadic head', () => {
    type Test = ArrayLastElement<[...number[], string]>;
    expectTypeOf<Test>().toEqualTypeOf<string>();
  });

  test('tuple with variadic head same type', () => {
    type Test = ArrayLastElement<[...string[], string]>;
    expectTypeOf<Test>().toEqualTypeOf<string>();
  });

  test('tuple with variadic tail', () => {
    type Test = ArrayLastElement<[string, ...number[]]>;
    expectTypeOf<Test>().toEqualTypeOf<string | number>();
  });

  test('tuple with variadic tail same type', () => {
    type Test = ArrayLastElement<[string, ...string[]]>;
    expectTypeOf<Test>().toEqualTypeOf<string>();
  });

  test('tuple with optional element', () => {
    type Test = ArrayLastElement<[string, number?]>;
    expectTypeOf<Test>().toEqualTypeOf<string | number | undefined>();
  });
});

describe('IsArrayLengthFixed', () => {
  test('array', () => {
    type Test = IsArrayLengthFixed<string[]>;
    expectTypeOf<Test>().toEqualTypeOf<false>();
  });

  test('readonly array', () => {
    type Test = IsArrayLengthFixed<readonly string[]>;
    expectTypeOf<Test>().toEqualTypeOf<true>();
  });

  test('tuple', () => {
    type Test = IsArrayLengthFixed<[string]>;
    expectTypeOf<Test>().toEqualTypeOf<true>();
  });

  test('tuple with variadic head', () => {
    type Test = IsArrayLengthFixed<[...number[], string]>;
    expectTypeOf<Test>().toEqualTypeOf<false>();
  });

  test('tuple with variadic head same type', () => {
    type Test = IsArrayLengthFixed<[...string[], string]>;
    expectTypeOf<Test>().toEqualTypeOf<false>();
  });

  test('tuple with variadic tail', () => {
    type Test = IsArrayLengthFixed<[string, ...number[]]>;
    expectTypeOf<Test>().toEqualTypeOf<false>();
  });

  test('tuple with variadic tail same type', () => {
    type Test = IsArrayLengthFixed<[string, ...string[]]>;
    expectTypeOf<Test>().toEqualTypeOf<false>();
  });

  test('tuple with optional element', () => {
    type Test = IsArrayLengthFixed<[string, number?]>;
    expectTypeOf<Test>().toEqualTypeOf<false>();
  });
});

describe('ArraySlice', () => {
  test('array', () => {
    type Test = ArraySlice<string[], 1>;
    expectTypeOf<Test>().toEqualTypeOf<string[]>();

    type Test2 = ArraySlice<string[], -1>;
    expectTypeOf<Test2>().toEqualTypeOf<[string]>();
  });

  test('readonly array', () => {
    type Test = ArraySlice<readonly string[], 1>;
    expectTypeOf<Test>().toEqualTypeOf<readonly string[]>();
  });

  test('tuple', () => {
    type Test = ArraySlice<[string], 0>;
    expectTypeOf<Test>().toEqualTypeOf<[string]>();

    type Test2 = ArraySlice<[string], 1>;
    expectTypeOf<Test2>().toEqualTypeOf<[]>();

    type Test3 = ArraySlice<[string], -1>;
    expectTypeOf<Test3>().toEqualTypeOf<[string]>();
  });

  test('tuple with variadic head', () => {
    type Test = ArraySlice<[...number[], string], 0>;
    expectTypeOf<Test>().toEqualTypeOf<[...number[], string]>();

    type Test2 = ArraySlice<[...number[], string], 1>;
    expectTypeOf<Test2>().toEqualTypeOf<[...number[], string]>();

    type Test3 = ArraySlice<[...number[], string], -1>;
    expectTypeOf<Test3>().toEqualTypeOf<[string]>();
  });

  test('tuple with variadic head same type', () => {
    type Test = ArraySlice<[...string[], string], 1>;
    expectTypeOf<Test>().toEqualTypeOf<[...string[], string]>();
  });

  test('tuple with variadic tail', () => {
    type Test = ArraySlice<[string, ...number[]], 0>;
    expectTypeOf<Test>().toEqualTypeOf<[string, ...number[]]>();

    type Test2 = ArraySlice<[string, ...number[]], 1>;
    expectTypeOf<Test2>().toEqualTypeOf<number[]>();

    type Test3 = ArraySlice<[string, ...number[]], -1>;
    expectTypeOf<Test3>().toEqualTypeOf<[string | number]>();
  });

  test('tuple with variadic tail same type', () => {
    type Test = ArraySlice<[string, ...string[]], 1>;
    expectTypeOf<Test>().toEqualTypeOf<string[]>();
  });

  test('tuple with optional element', () => {
    type Test = ArraySlice<[string, number?], 0>;
    expectTypeOf<Test>().toEqualTypeOf<[string, number?]>();

    type Test2 = ArraySlice<[string, number?], 1>;
    expectTypeOf<Test2>().toEqualTypeOf<[number?]>();

    type Test3 = ArraySlice<[string, number?], -1>;
    expectTypeOf<Test3>().toEqualTypeOf<[string | number | undefined]>();
  });
});
