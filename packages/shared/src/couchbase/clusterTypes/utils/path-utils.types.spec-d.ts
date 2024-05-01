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

import { Json } from '../document.types.js';
import {
  DocumentPath,
  MaybeMissing,
  PathTargetExpression,
  PathToClosestProperty,
  PathToParentAccessor,
  PathToParentProperty,
  PathToParentPropertyOrSelf,
  SubDocument,
  TargetableArrayIndexes,
} from './path-utils.types.js';

describe('DocumentPath', function () {
  type Doc = {
    rootProperty: number;
    obj: {
      requiredString: string;
      requiredFixedLengthArray: [string, string];
      requiredArrayOfObjects: Array<{ aop: string }>;
      requiredFixedLengthArrayOfObjects: [{ aop1: string }, { aop2: number }];
      mixed: { prop: string } | string[];
      optionalArray?: string[];
    };
  };

  it('should return a union of all the path to access all elements of the object', function () {
    expectTypeOf<DocumentPath<Doc>>().toEqualTypeOf<
      | 'rootProperty'
      | 'obj'
      | 'obj.requiredString'
      | 'obj.requiredFixedLengthArray'
      | 'obj.requiredFixedLengthArray[0]'
      | 'obj.requiredFixedLengthArray[1]'
      | 'obj.requiredFixedLengthArray[-1]'
      | 'obj.requiredArrayOfObjects'
      | `obj.requiredArrayOfObjects[${number}]`
      | `obj.requiredArrayOfObjects[${number}].aop`
      | `obj.optionalArray`
      | `obj.optionalArray[${number}]`
      | `obj.requiredFixedLengthArrayOfObjects`
      | `obj.requiredFixedLengthArrayOfObjects[0]`
      | `obj.requiredFixedLengthArrayOfObjects[1]`
      | `obj.requiredFixedLengthArrayOfObjects[0].aop1`
      | `obj.requiredFixedLengthArrayOfObjects[1].aop2`
      | `obj.requiredFixedLengthArrayOfObjects[-1]`
      | `obj.requiredFixedLengthArrayOfObjects[-1].aop2`
      | `obj.mixed`
      | `obj.mixed[${number}]`
      | `obj.mixed.prop`
    >();
  });

  it('should return never if the input type is not an object', function () {
    // @ts-expect-error DocumentPath should not accept a string as generic argument
    expectTypeOf<DocumentPath<'stringDoc'>>().toBeNever();

    // @ts-expect-error DocumentPath should not accept a number as generic argument
    expectTypeOf<DocumentPath<42>>().toBeNever();
  });

  it('should return `string` if the input type is `any` or `object`', function () {
    expectTypeOf<DocumentPath<any>>().toEqualTypeOf<string>();
    expectTypeOf<DocumentPath<object>>().toEqualTypeOf<string>();
  });

  it('should perform only one iteration of circular references', function () {
    type Tree = {
      nodes: Tree[];
      leafs: string[];
    };

    type DeepStringArray = (string | DeepStringArray)[];

    expectTypeOf<DocumentPath<{ metadata: { extra: Json } }>>().toEqualTypeOf<
      | 'metadata'
      | 'metadata.extra'
      | `metadata.extra[${number}]`
      | `metadata.extra[${number}]${string}`
      | `metadata.extra.${string}`
      | `metadata.extra.${string}${string}`
    >();

    expectTypeOf<DocumentPath<{ relationships: Tree }>>().toEqualTypeOf<
      | 'relationships'
      | `relationships.nodes`
      | `relationships.nodes[${number}]`
      | `relationships.nodes[${number}]${string}`
      | `relationships.leafs`
      | `relationships.leafs[${number}]`
    >();

    expectTypeOf<DocumentPath<DeepStringArray>>().toEqualTypeOf<
      `[${number}]` | `[${number}][${number}]` | `[${number}][${number}]${string}`
    >();
  });
});

describe('SubDocument', function () {
  type Doc = {
    rootProperty: number;
    obj: {
      requiredString: string;
      requiredFixedLengthArray: [string, number];
      requiredArrayOfObjects: Array<{ aop: string }>;
      requiredFixedLengthArrayOfObjects: [{ aop1: string }, { aop2: number }];
      mixed: { prop: string } | string[];
      optionalArray?: string[];
      nestedArray: string[][];
    };
  };

  it('should return the type at the path', function () {
    expectTypeOf<SubDocument<Doc, ''>>().toEqualTypeOf<Doc>();
    expectTypeOf<SubDocument<Doc, 'rootProperty'>>().toEqualTypeOf<number>();
    expectTypeOf<SubDocument<Doc, 'obj'>>().toEqualTypeOf<Doc['obj']>();
    expectTypeOf<SubDocument<Doc, 'obj.requiredString'>>().toEqualTypeOf<string>();
    expectTypeOf<SubDocument<Doc, 'obj.requiredFixedLengthArray'>>().toEqualTypeOf<
      [string, number]
    >();
    expectTypeOf<
      SubDocument<Doc, 'obj.requiredFixedLengthArray[0]'>
    >().toEqualTypeOf<string>();
    expectTypeOf<
      SubDocument<Doc, 'obj.requiredFixedLengthArray[1]'>
    >().toEqualTypeOf<number>();
    expectTypeOf<SubDocument<Doc, 'obj.requiredArrayOfObjects'>>().toEqualTypeOf<
      Array<{ aop: string }>
    >();
    expectTypeOf<
      SubDocument<Doc, `obj.requiredArrayOfObjects[${number}]`>
    >().toEqualTypeOf<{ aop: string } | undefined>();
    expectTypeOf<
      SubDocument<Doc, `obj.requiredArrayOfObjects[${number}].aop`>
    >().toEqualTypeOf<string | undefined>();
    expectTypeOf<SubDocument<Doc, `obj.optionalArray`>>().toEqualTypeOf<
      string[] | undefined
    >();
    expectTypeOf<SubDocument<Doc, `obj.optionalArray[${number}]`>>().toEqualTypeOf<
      string | undefined
    >();
    expectTypeOf<
      SubDocument<Doc, `obj.requiredFixedLengthArrayOfObjects`>
    >().toEqualTypeOf<[{ aop1: string }, { aop2: number }]>();
    expectTypeOf<
      SubDocument<Doc, `obj.requiredFixedLengthArrayOfObjects[0]`>
    >().toEqualTypeOf<{ aop1: string }>();
    expectTypeOf<
      SubDocument<Doc, `obj.requiredFixedLengthArrayOfObjects[1]`>
    >().toEqualTypeOf<{ aop2: number }>();
    expectTypeOf<
      SubDocument<Doc, `obj.requiredFixedLengthArrayOfObjects[0].aop1`>
    >().toEqualTypeOf<string>();
    expectTypeOf<
      SubDocument<Doc, `obj.requiredFixedLengthArrayOfObjects[1].aop2`>
    >().toEqualTypeOf<number>();
    expectTypeOf<SubDocument<Doc, `obj.mixed`>>().toEqualTypeOf<
      { prop: string } | string[]
    >();
    expectTypeOf<SubDocument<Doc, `obj.mixed[${number}]`>>().toEqualTypeOf<
      string | undefined
    >();
    expectTypeOf<SubDocument<Doc, `obj.mixed.prop`>>().toEqualTypeOf<string>();
    expectTypeOf<SubDocument<Doc, `obj.nestedArray`>>().toEqualTypeOf<string[][]>();
    expectTypeOf<SubDocument<Doc, `obj.nestedArray[0]`>>().toEqualTypeOf<
      string[] | undefined
    >();
    expectTypeOf<SubDocument<Doc, `obj.nestedArray[0][0]`>>().toEqualTypeOf<
      string | undefined
    >();
  });

  it('should return the array indexes for an array document', function () {
    expectTypeOf<SubDocument<string[], ''>>().toEqualTypeOf<string[]>();
    expectTypeOf<SubDocument<string[], '[0]'>>().toEqualTypeOf<string | undefined>();
    expectTypeOf<SubDocument<string[], `[${number}]`>>().toEqualTypeOf<
      string | undefined
    >();

    expectTypeOf<SubDocument<[string], ''>>().toEqualTypeOf<[string]>();
    expectTypeOf<SubDocument<[string], '[0]'>>().toEqualTypeOf<string>();
  });
});

describe('MaybeMissing', function () {
  it('should return `true` if `T` is a union that includes `undefined`', function () {
    expectTypeOf<MaybeMissing<string>>().toEqualTypeOf<false>();
    expectTypeOf<MaybeMissing<string | undefined>>().toEqualTypeOf<true>();
  });

  it('should return `true` for all keys of a tuple', function () {
    expectTypeOf<MaybeMissing<[string], 0>>().toEqualTypeOf<false>();
    expectTypeOf<MaybeMissing<[string, number], 1>>().toEqualTypeOf<false>();
    expectTypeOf<MaybeMissing<[string, number], 2>>().toEqualTypeOf<true>();
    expectTypeOf<MaybeMissing<[string, number], -1>>().toEqualTypeOf<true>();
  });

  it('should return `true` for all the keys of the static part of an array', function () {
    expectTypeOf<MaybeMissing<[string, ...string[]], 0>>().toEqualTypeOf<false>();
    expectTypeOf<MaybeMissing<[string, string, ...string[]], 1>>().toEqualTypeOf<false>();
    expectTypeOf<MaybeMissing<[...string[], string], 0>>().toEqualTypeOf<false>();
    expectTypeOf<MaybeMissing<[...string[], string, string], 1>>().toEqualTypeOf<false>();

    expectTypeOf<MaybeMissing<[string, ...string[]], 1>>().toEqualTypeOf<true>();
    expectTypeOf<MaybeMissing<[...string[], string], 1>>().toEqualTypeOf<true>();
  });

  it('should return true/false regardless of the subdocument type', function () {
    expectTypeOf<MaybeMissing<[string | undefined], 0>>().toEqualTypeOf<false>();
  });
});

describe('PathToClosestProperty', function () {
  it('should return the path to the closest property', function () {
    expectTypeOf<
      PathToClosestProperty<'path.to.array'>
    >().toEqualTypeOf<'path.to.array'>();
    expectTypeOf<
      PathToClosestProperty<'path.to.array[-1]'>
    >().toEqualTypeOf<'path.to.array'>();
    expectTypeOf<
      PathToClosestProperty<'path.to.array[0]'>
    >().toEqualTypeOf<'path.to.array'>();
    expectTypeOf<
      PathToClosestProperty<'path.to.array[+1]'>
    >().toEqualTypeOf<'path.to.array'>();
    expectTypeOf<
      PathToClosestProperty<`path.to.array[${number}]`>
    >().toEqualTypeOf<'path.to.array'>();
    expectTypeOf<
      PathToClosestProperty<`path.to.array[${number}].prop`>
    >().toEqualTypeOf<`path.to.array[${number}].prop`>();
    expectTypeOf<
      PathToClosestProperty<'path.to.array[42].prop'>
    >().toEqualTypeOf<'path.to.array[42].prop'>();
    expectTypeOf<
      PathToClosestProperty<'path.to.array[42].prop[1]'>
    >().toEqualTypeOf<'path.to.array[42].prop'>();
    expectTypeOf<
      PathToClosestProperty<'path.to.array[42].prop[13][37]'>
    >().toEqualTypeOf<'path.to.array[42].prop'>();
    expectTypeOf<PathToClosestProperty<`array[${number}]`>>().toEqualTypeOf<'array'>();
    expectTypeOf<
      PathToClosestProperty<`array[${number}].prop`>
    >().toEqualTypeOf<`array[${number}].prop`>();
    expectTypeOf<PathToClosestProperty<`array[0][${number}]`>>().toEqualTypeOf<'array'>();
    expectTypeOf<PathToClosestProperty<'prop'>>().toEqualTypeOf<'prop'>();

    expectTypeOf<
      PathToClosestProperty<'path.to.array' | 'path.to.array[0].prop'>
    >().toEqualTypeOf<'path.to.array' | 'path.to.array[0].prop'>();
  });
});

describe('PathToParentProperty', function () {
  it('should extract the path to the closest parent property', function () {
    expectTypeOf<PathToParentProperty<'path'>>().toBeNever();
    expectTypeOf<PathToParentProperty<'path.to.array'>>().toEqualTypeOf<'path.to'>();
    expectTypeOf<PathToParentProperty<'path.to.array[-1]'>>().toEqualTypeOf<'path.to'>();
    expectTypeOf<
      PathToParentProperty<`path.to.array[${number}]`>
    >().toEqualTypeOf<'path.to'>();
    expectTypeOf<
      PathToParentProperty<`path.to.array[0].prop[0].prop[1]`>
    >().toEqualTypeOf<'path.to.array[0].prop'>();
    expectTypeOf<
      PathToParentProperty<`path.to.array[42][${number}]`>
    >().toEqualTypeOf<'path.to'>();
    expectTypeOf<
      PathToParentProperty<'path.to.array[42].prop'>
    >().toEqualTypeOf<'path.to.array'>();
  });
});

describe('PathToParentPropertyOrSelf', function () {
  it('should extract the path to the closest parent property or the same path if no parent exists', function () {
    expectTypeOf<PathToParentPropertyOrSelf<'path'>>().toEqualTypeOf<'path'>();
    expectTypeOf<
      PathToParentPropertyOrSelf<'path.to.array'>
    >().toEqualTypeOf<'path.to'>();
    expectTypeOf<
      PathToParentPropertyOrSelf<'path.to.array[-1]'>
    >().toEqualTypeOf<'path.to'>();
    expectTypeOf<
      PathToParentPropertyOrSelf<`path.to.array[${number}]`>
    >().toEqualTypeOf<'path.to'>();
    expectTypeOf<
      PathToParentPropertyOrSelf<'path.to.array[42].prop'>
    >().toEqualTypeOf<'path.to.array'>();
  });
});

describe('PathToParentAccessor', function () {
  it('should extract the path to the closest parent property', function () {
    expectTypeOf<PathToParentAccessor<'path'>>().toBeNever();
    expectTypeOf<PathToParentAccessor<'path.to.array'>>().toEqualTypeOf<'path.to'>();
    expectTypeOf<
      PathToParentAccessor<'path.to.array[-1]'>
    >().toEqualTypeOf<'path.to.array'>();
    expectTypeOf<
      PathToParentAccessor<`path.to.array[${number}]`>
    >().toEqualTypeOf<'path.to.array'>();
    expectTypeOf<
      PathToParentAccessor<`path.to.array[0].prop[0].prop[1]`>
    >().toEqualTypeOf<'path.to.array[0].prop[0].prop'>();
    expectTypeOf<
      PathToParentAccessor<`path.to.array[42][${number}]`>
    >().toEqualTypeOf<'path.to.array[42]'>();
    expectTypeOf<
      PathToParentAccessor<'path.to.array[42].prop'>
    >().toEqualTypeOf<'path.to.array[42]'>();
  });
});

describe('PathTargetExpression', function () {
  it('should return the expression of the targeted property', function () {
    expectTypeOf<PathTargetExpression<'path'>>().toEqualTypeOf<'path'>();
    expectTypeOf<PathTargetExpression<'path.to.array'>>().toEqualTypeOf<'array'>();
    expectTypeOf<
      PathTargetExpression<'path.to.array[-1]'>
    >().toEqualTypeOf<'array[-1]'>();
    expectTypeOf<
      PathTargetExpression<`path.to.array[${number}]`>
    >().toEqualTypeOf<`array[${number}]`>();
    expectTypeOf<
      PathTargetExpression<`path.to.array[${number}][1]`>
    >().toEqualTypeOf<`array[${number}][1]`>();
    expectTypeOf<PathTargetExpression<'path.to.array[0].prop'>>().toEqualTypeOf<'prop'>();
    expectTypeOf<
      PathTargetExpression<'path.to.array[0][1].prop'>
    >().toEqualTypeOf<'prop'>();
  });
});

describe('TargetableArrayIndexes', function () {
  it('should return a union of the keys of a fixed-length array and -1', function () {
    expectTypeOf<TargetableArrayIndexes<[string, number]>>().toEqualTypeOf<0 | 1 | -1>();
  });

  it('should return a union of `number` and -1 for a variable-length array', function () {
    // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
    expectTypeOf<TargetableArrayIndexes<string[]>>().toEqualTypeOf<number | -1>();
    expectTypeOf<TargetableArrayIndexes<Array<{ foo: string }>>>().toEqualTypeOf<
      // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
      number | -1
    >();
  });
});
