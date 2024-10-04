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
  ExtractPathToAppendableArray,
  ExtractPathToArray,
  ExtractPathToArrayIndex,
  ExtractPathToInsertableArrayIndex,
  ExtractPathToObject,
  ExtractPathToOptionalProperty,
  ExtractPathToPojo,
  ExtractPathToPrependableArray,
  ExtractPathToRecord,
  ExtractPathToRecordEntry,
  ExtractPathToRemovableArrayIndex,
  ExtractPathToType,
  ExtractPathToWritable,
  ExtractPathToWritableArrayIndex,
  ExtractPathToWritableProperty,
  PathToMaybeUndefinedProperty,
  ValidatePathToOptionalProperty,
  ValidatePathToProperty,
} from './document-path.types.js';
import { DocumentPath } from './path-utils.types.js';
import type {
  BuildOptionalProperties,
  BuildReadonlyArrayProperties,
  TestDocRequiredProperties,
} from './test-utils.types.js';

describe('ExtractPathToWritable', function () {
  type Doc = {
    readonly roPrimitive: string;
    readonly roObject: { a: { aa: string } };
    readonly roArrayOfPrimitive: string[];
    readonly roArrayOfObject: Array<{ prop: string }>;
    readonly roReadonlyArrayOfPrimitive: ReadonlyArray<string>;

    rwPrimitive: string;
    rwObject: { a: { aa: string } };
    rwRecord: Record<string, { title: string }>;
    rwArrayOfPrimitive: string[];
    rwArrayOfObject: Array<{ prop: string }>;
    rwReadonlyArrayOfPrimitive: ReadonlyArray<string>;

    rwOptPrimitive: string;
    rwOptObject: { a: { aa: string } };
    rwOptArrayOfPrimitive: string[];
    rwOptArrayOfObject: Array<{ prop: string }>;
    rwOptReadonlyArrayOfPrimitive: ReadonlyArray<string>;
  };

  type Test = ExtractPathToWritable<Doc, DocumentPath<Doc>>;

  it('should extract path that do not target a readonly property', function () {
    expectTypeOf<Test>().toEqualTypeOf<
      | 'rwPrimitive'
      | 'rwObject'
      | 'rwObject.a'
      | 'rwObject.a.aa'
      | `rwRecord`
      | `rwRecord.${string}`
      | `rwRecord.${string}.title`
      | 'rwArrayOfPrimitive'
      | `rwArrayOfPrimitive[${number}]`
      | 'rwArrayOfObject'
      | `rwArrayOfObject[${number}]`
      | `rwArrayOfObject[${number}].prop`
      | `rwReadonlyArrayOfPrimitive`
      | 'rwOptPrimitive'
      | 'rwOptObject'
      | 'rwOptObject.a'
      | 'rwOptObject.a.aa'
      | 'rwOptArrayOfPrimitive'
      | `rwOptArrayOfPrimitive[${number}]`
      | 'rwOptArrayOfObject'
      | `rwOptArrayOfObject[${number}]`
      | `rwOptArrayOfObject[${number}].prop`
      | `rwOptReadonlyArrayOfPrimitive`
      | 'roObject.a'
      | 'roObject.a.aa'
      | `roArrayOfPrimitive[${number}]`
      | `roArrayOfObject[${number}]`
      | `roArrayOfObject[${number}].prop`
    >();
  });
});

describe('ExtractPathToType', function () {
  type Test<T, E> = ExtractPathToType<{ prop: T }, 'prop', E>;
  type ExpectedPaths = 'prop';

  it('should extract path to property for which Type extends the property type if Strict = false', function () {
    expectTypeOf<Test<string, string>>().toEqualTypeOf<ExpectedPaths>();
    expectTypeOf<Test<string | undefined, string>>().toEqualTypeOf<ExpectedPaths>();
    expectTypeOf<Test<string | undefined, undefined>>().toEqualTypeOf<ExpectedPaths>();
    expectTypeOf<Test<string | number, string>>().toEqualTypeOf<ExpectedPaths>();
    expectTypeOf<Test<string | number, number>>().toEqualTypeOf<ExpectedPaths>();
    expectTypeOf<Test<string[], string[]>>().toEqualTypeOf<ExpectedPaths>();
    expectTypeOf<Test<string[] | undefined, string[]>>().toEqualTypeOf<ExpectedPaths>();
    expectTypeOf<Test<(string | undefined)[], string[]>>().toEqualTypeOf<ExpectedPaths>();
    expectTypeOf<Test<string[], string>>().toBeNever();
    expectTypeOf<Test<string, undefined>>().toBeNever();
    expectTypeOf<Test<string, unknown>>().toBeNever();
  });

  type TestStrict<T, E> = ExtractPathToType<{ prop: T }, 'prop', E, true>;

  it('should extract path to property where Type is exactly the property type if Strict = true', function () {
    expectTypeOf<TestStrict<string, string>>().toEqualTypeOf<ExpectedPaths>();
    expectTypeOf<TestStrict<string | undefined, string>>().toBeNever();
    expectTypeOf<TestStrict<string | number, string>>().toBeNever();
    expectTypeOf<TestStrict<string | undefined, undefined>>().toBeNever();
    expectTypeOf<TestStrict<string | number, number>>().toBeNever();
    expectTypeOf<TestStrict<string[], string[]>>().toEqualTypeOf<ExpectedPaths>();
    expectTypeOf<TestStrict<string[] | undefined, string[]>>().toBeNever();
    expectTypeOf<TestStrict<(string | undefined)[], string[]>>().toBeNever();
    expectTypeOf<TestStrict<string[], string>>().toBeNever();
    expectTypeOf<TestStrict<string, undefined>>().toBeNever();
    expectTypeOf<Test<string, unknown>>().toBeNever();
  });
});

describe('ExtractPathToWritableProperty', function () {
  type Doc = {
    readonly roRootPrimitive: string;
    rwRootPrimitive: string;
    rwOpt?: string;

    rwArrayOfObject: Array<{ aop: string }>;
    rwReadonlyArrayOfObject: ReadonlyArray<{ aop: string }>;
    readonly roArrayOfObject: Array<{ aop: string }>;
    readonly roReadonlyArrayOfObject: ReadonlyArray<{ aop: string }>;
  };

  type DocPath = DocumentPath<Doc>;
  type Test = ExtractPathToWritableProperty<Doc, DocPath>;

  it('should extract path that point to a writable property', function () {
    expectTypeOf<Test>().toEqualTypeOf<
      | 'rwRootPrimitive'
      | 'rwOpt'
      | 'rwArrayOfObject'
      | `rwArrayOfObject[${number}].aop`
      | 'rwReadonlyArrayOfObject'
      | `rwReadonlyArrayOfObject[${number}].aop`
      | `roArrayOfObject[${number}].aop`
      | `roReadonlyArrayOfObject[${number}].aop`
    >();
  });
});

describe('ExtractPathToWritableArrayIndex', function () {
  type TestDoc = TestDocRequiredProperties &
    BuildOptionalProperties<TestDocRequiredProperties> &
    BuildReadonlyArrayProperties<TestDocRequiredProperties>;

  it('should extract path that point to a writable array index', function () {
    type Test = ExtractPathToWritableArrayIndex<TestDoc, DocumentPath<TestDoc>>;

    expectTypeOf<Test>().toEqualTypeOf<
      | `NonMatchingTuple[0]`
      | `NonMatchingTuple[1]`
      | `NonMatchingTuple[-1]`
      | `ArrayKnownLength[0]`
      | `ArrayKnownLength[1]`
      | `ArrayKnownLength[-1]`
      | `ArrayUnknownLength[${number}]`
      | `ArrayHeadRest[${number}]`
      | `ArrayTailRest[${number}]`
      | `ArrayTailRestIncompatibleHead[${number}]`
      | `ArrayHeadRestIncompatibleTail[${number}]`
      | `OptionalNonMatchingTuple[0]`
      | `OptionalNonMatchingTuple[1]`
      | `OptionalNonMatchingTuple[-1]`
      | `OptionalArrayKnownLength[0]`
      | `OptionalArrayKnownLength[1]`
      | `OptionalArrayKnownLength[-1]`
      | `OptionalArrayUnknownLength[${number}]`
      | `OptionalArrayHeadRest[${number}]`
      | `OptionalArrayTailRest[${number}]`
      | `OptionalArrayTailRestIncompatibleHead[${number}]`
      | `OptionalArrayHeadRestIncompatibleTail[${number}]`
    >();
  });

  it('should extract path that point to a writable array index of type number', function () {
    type Test = ExtractPathToWritableArrayIndex<TestDoc, DocumentPath<TestDoc>, number>;

    expectTypeOf<Test>().toEqualTypeOf<
      | `NonMatchingTuple[0]`
      | `ArrayKnownLength[0]`
      | `ArrayKnownLength[1]`
      | `ArrayKnownLength[-1]`
      | `ArrayUnknownLength[${number}]`
      | `ArrayHeadRest[${number}]`
      | `ArrayHeadRestIncompatibleTail[-1]`
      | `ArrayTailRest[${number}]`
      | `ArrayTailRestIncompatibleHead[0]`
      | `ArrayTailRestIncompatibleHead[-1]`
      | `OptionalNonMatchingTuple[0]`
      | `OptionalArrayKnownLength[0]`
      | `OptionalArrayKnownLength[1]`
      | `OptionalArrayKnownLength[-1]`
      | `OptionalArrayUnknownLength[${number}]`
      | `OptionalArrayHeadRest[${number}]`
      | `OptionalArrayHeadRestIncompatibleTail[-1]`
      | `OptionalArrayTailRest[${number}]`
      | `OptionalArrayTailRestIncompatibleHead[0]`
      | `OptionalArrayTailRestIncompatibleHead[-1]`
    >();

    type ArrayTwoNumberStatic = { arr: [...string[], number, number] };
    type Test2 = ExtractPathToWritableArrayIndex<
      ArrayTwoNumberStatic,
      DocumentPath<ArrayTwoNumberStatic>,
      number
    >;

    expectTypeOf<Test2>().toEqualTypeOf<`arr[${number}]`>();

    type ArrayTwoMixedStaticLastNumber = { arr: [...string[], string, number] };
    type Test3 = ExtractPathToWritableArrayIndex<
      ArrayTwoMixedStaticLastNumber,
      DocumentPath<ArrayTwoMixedStaticLastNumber>,
      number
    >;
    expectTypeOf<Test3>().toEqualTypeOf<`arr[-1]`>();

    type ArrayTwoMixedStaticNotLastNumber = { arr: [...string[], number, string] };
    type Test4 = ExtractPathToWritableArrayIndex<
      ArrayTwoMixedStaticNotLastNumber,
      DocumentPath<ArrayTwoMixedStaticNotLastNumber>,
      number
    >;
    expectTypeOf<Test4>().toEqualTypeOf<`arr[${number}]`>();
  });
});

describe('ExtractPathToInsertableArrayIndex', function () {
  type TestDoc = TestDocRequiredProperties &
    BuildOptionalProperties<TestDocRequiredProperties> &
    BuildReadonlyArrayProperties<TestDocRequiredProperties>;

  it('should extract path that point to an array index', function () {
    type Test = ExtractPathToInsertableArrayIndex<TestDoc, DocumentPath<TestDoc>>;

    expectTypeOf<Test>().toEqualTypeOf<
      | `ArrayUnknownLength[${number}]`
      | `ArrayHeadRest[${number}]`
      | `ArrayTailRest[${number}]`
      | `ArrayTailRestIncompatibleHead[${number}]`
      | `ArrayHeadRestIncompatibleTail[${number}]`
      | `OptionalArrayUnknownLength[${number}]`
      | `OptionalArrayHeadRest[${number}]`
      | `OptionalArrayTailRest[${number}]`
      | `OptionalArrayTailRestIncompatibleHead[${number}]`
      | `OptionalArrayHeadRestIncompatibleTail[${number}]`
    >();
  });
});

describe('ExtractPathToArray', function () {
  type Doc<T> = {
    readonly RoArr: T;
    RwArr: T;
    num: number;
    str: string;
  };

  type ExpectedType = 'RoArr' | 'RwArr';
  type Test<T> = ExtractPathToArray<Doc<T>, DocumentPath<Doc<T>>>;

  it('should return the paths that may point to an array', function () {
    expectTypeOf<Test<string[]>>().toEqualTypeOf<ExpectedType>();
    expectTypeOf<Test<string[] | number>>().toEqualTypeOf<ExpectedType>();
    expectTypeOf<Test<string[] | undefined>>().toEqualTypeOf<ExpectedType>();
    expectTypeOf<Test<(string | number)[] | undefined>>().toEqualTypeOf<ExpectedType>();
    expectTypeOf<Test<(string | number)[] | undefined>>().toEqualTypeOf<ExpectedType>();
    expectTypeOf<Test<[number, number]>>().toEqualTypeOf<ExpectedType>();
  });
});

describe('ExtractPathToObject', function () {
  type TestDoc = {
    primitive: string;
    arrayOfPrimitive: ReadonlyArray<string>;
    object: { objectProp: string };
    arrayOfObjects: ReadonlyArray<{ aop: string }>;
  };

  type DocPath = DocumentPath<TestDoc>;
  type Test = ExtractPathToObject<TestDoc, DocPath | ''>;

  it('should return the paths that may point to an array', function () {
    expectTypeOf<Test>().toEqualTypeOf<'' | 'object' | `arrayOfObjects[${number}]`>();
  });
});

describe('ExtractPathToArrayIndex', function () {
  type Doc<T> = {
    readonly RoArr: T;
    RwArr: T;
    num: number;
    str: string;
    nested: Array<{ arr: string[] }>;
  };

  type ExpectedType =
    | `RoArr[${number}]`
    | `RwArr[${number}]`
    | `nested[${number}]`
    | `nested[${number}].arr[${number}]`;
  type Test<T> = ExtractPathToArrayIndex<DocumentPath<Doc<T>>>;

  it('should return the paths that may point to an array index', function () {
    expectTypeOf<Test<string[]>>().toEqualTypeOf<ExpectedType>();
    expectTypeOf<Test<string[] | number>>().toEqualTypeOf<ExpectedType>();
    expectTypeOf<Test<string[] | undefined>>().toEqualTypeOf<ExpectedType>();
    expectTypeOf<Test<(string | number)[] | undefined>>().toEqualTypeOf<ExpectedType>();
    expectTypeOf<Test<(string | number)[] | undefined>>().toEqualTypeOf<ExpectedType>();
    expectTypeOf<Test<[number, number]>>().toEqualTypeOf<
      | 'RoArr[0]'
      | 'RoArr[1]'
      | 'RoArr[-1]'
      | 'RwArr[0]'
      | 'RwArr[1]'
      | 'RwArr[-1]'
      | `nested[${number}]`
      | `nested[${number}].arr[${number}]`
    >();
  });
});

describe('ExtractPathToAppendableArray', function () {
  type Doc = TestDocRequiredProperties &
    BuildReadonlyArrayProperties<TestDocRequiredProperties>;

  type Test = ExtractPathToAppendableArray<Doc, DocumentPath<Doc>>;

  it('should return the paths that may point to a appendable array', function () {
    expectTypeOf<Test>().toEqualTypeOf<
      | 'ArrayUnknownLength'
      | 'ArrayHeadRest'
      | 'ArrayTailRest'
      | 'ArrayTailRestIncompatibleHead'
    >();
  });

  it('should return the paths for an array document', function () {
    expectTypeOf<
      ExtractPathToAppendableArray<string[], DocumentPath<string[]> | ''>
    >().toEqualTypeOf<''>();
  });
});

describe('ExtractPathToPrependableArray', function () {
  type Doc = TestDocRequiredProperties &
    BuildReadonlyArrayProperties<TestDocRequiredProperties>;

  type Test = ExtractPathToPrependableArray<Doc, DocumentPath<Doc>>;

  it('should return the paths that may point to a prependable array', function () {
    expectTypeOf<Test>().toEqualTypeOf<
      | 'ArrayUnknownLength'
      | 'ArrayHeadRest'
      | 'ArrayHeadRestIncompatibleTail'
      | 'ArrayTailRest'
    >();
  });
});

describe('ExtractPathToRemovableArrayIndex', function () {
  type Doc = {
    readonly ro: string;
    rw: string;
    rwOpt?: string;

    rwArr: string[];
    rwTuple: [string, string];
    rwArrOpt?: string[];

    rwReadonlyArr: readonly string[];
    rwReadonlyTuple: readonly [string, string];
    rwReadonlyArrOpt?: readonly string[];

    readonly roArr: string[];
    readonly roTuple: [string, string];
    readonly roArrOpt?: string[];
  };

  type DocPath = DocumentPath<Doc>;
  type Test = ExtractPathToRemovableArrayIndex<Doc, DocPath>;

  it('should extract path that point to a possibly removable array index', function () {
    expectTypeOf<Test>().toEqualTypeOf<
      | `rwArr[${number}]`
      | `rwArrOpt[${number}]`
      | `roArr[${number}]`
      | `roArrOpt[${number}]`
    >();
  });
});

describe('ValidatePathToOptionalProperty', () => {
  type VisitorId = `visitor::${string}`;

  type Monument = {
    openings?: {
      periods: {
        default: { openAt: string; closeAt: string };
        summer?: { openAt: string; closeAt: string };
        winter?: { openAt: string; closeAt: string };
      };
    };
    visitors: Record<VisitorId, { enteredAt: number; leftAt?: number }>;
    historicalReferences: {
      persons?: Array<{
        name: string;
        surname?: string;
      }>;
    };
  };

  it('should return never for paths that point to non-object', () => {
    expectTypeOf<ValidatePathToOptionalProperty<Monument, 'persons[0]'>>().toBeNever();
  });

  it('should narrow string template', () => {
    expectTypeOf<
      ValidatePathToOptionalProperty<Monument, 'visitors.visitor::001'>
    >().toEqualTypeOf<'visitors.visitor::001'>();

    expectTypeOf<
      ValidatePathToOptionalProperty<Monument, 'visitors.visitor::001.enteredAt'>
    >().toBeNever();

    expectTypeOf<
      ValidatePathToOptionalProperty<Monument, 'visitors.visitor::001.leftAt'>
    >().toEqualTypeOf<'visitors.visitor::001.leftAt'>();

    expectTypeOf<
      ValidatePathToOptionalProperty<Monument, 'visitors.visitor::001.doesNotExists'>
    >().toBeNever();
  });
});

describe('ValidatePathToProperty', () => {
  type VisitorId = `visitor::${string}`;

  type Monument = {
    openings?: {
      periods: {
        default: { openAt: string; closeAt: string };
        summer?: { openAt: string; closeAt: string };
        winter?: { openAt: string; closeAt: string };
      };
    };
    visitors: Record<VisitorId, { enteredAt: number; leftAt?: number }>;
    historicalReferences: {
      persons?: Array<{
        name: string;
        surname?: string;
      }>;
    };
  };

  it('should return never for paths that point to non-object', () => {
    expectTypeOf<ValidatePathToProperty<Monument, 'persons[0]'>>().toBeNever();
  });

  it('should narrow string template', () => {
    expectTypeOf<
      ValidatePathToProperty<Monument, 'visitors.visitor::001'>
    >().toEqualTypeOf<'visitors.visitor::001'>();

    expectTypeOf<
      ValidatePathToProperty<Monument, 'visitors.visitor::001.enteredAt'>
    >().toEqualTypeOf<'visitors.visitor::001.enteredAt'>();

    expectTypeOf<
      ValidatePathToProperty<Monument, 'visitors.visitor::001.leftAt'>
    >().toEqualTypeOf<'visitors.visitor::001.leftAt'>();

    expectTypeOf<
      ValidatePathToProperty<Monument, 'visitors.visitor::001.doesNotExists'>
    >().toBeNever();
  });
});

describe('ExtractPathToOptionalProperty', () => {
  type VisitorId = `visitor::${string}`;

  type Monument = {
    openings?: {
      periods: {
        default: { openAt: string; closeAt: string };
        summer?: { openAt: string; closeAt: string };
        winter?: { openAt: string; closeAt: string };
      };
    };
    visitors: Record<VisitorId, { enteredAt: number; leftAt?: number }>;
    historicalReferences: {
      persons?: Array<{
        name: string;
        surname?: string;
      }>;
    };
  };

  it('should extract path to all optional properties', () => {
    type Result = ExtractPathToOptionalProperty<Monument>;

    expectTypeOf<Result>().toEqualTypeOf<
      | 'openings'
      | 'openings.periods.summer'
      | 'openings.periods.winter'
      | `visitors.visitor::${string}`
      | `visitors.visitor::${string}.leftAt`
      | `historicalReferences.persons`
      | `historicalReferences.persons[${number}].surname`
    >();
  });
});

describe('ExtractPathToPojo', () => {
  it('should exclude path to primitives', () => {
    expectTypeOf<ExtractPathToPojo<{ foo: string }>>().toBeNever();
    expectTypeOf<ExtractPathToPojo<{ foo: number }>>().toBeNever();
    expectTypeOf<ExtractPathToPojo<{ foo: null }>>().toBeNever();
  });

  it('should exclude path to arrays', () => {
    expectTypeOf<ExtractPathToPojo<{ foo: string[] }>>().toBeNever();
    expectTypeOf<ExtractPathToPojo<{ foo: [number] }>>().toBeNever();
    expectTypeOf<ExtractPathToPojo<{ foo: never[] }>>().toBeNever();
  });

  it('should extract path to a dictionary', () => {
    expectTypeOf<ExtractPathToPojo<{ foo: { bar: string } }>>().toEqualTypeOf<'foo'>();
    expectTypeOf<ExtractPathToPojo<{ foo?: { bar: string } }>>().toEqualTypeOf<'foo'>();
  });

  it('should extract path to dictionary value that is a pojo', () => {
    expectTypeOf<ExtractPathToPojo<{ foo: { bar: { name: string } } }>>().toEqualTypeOf<
      'foo' | 'foo.bar'
    >();
    expectTypeOf<
      ExtractPathToPojo<{ foo?: { bar?: { name?: string } } }>
    >().toEqualTypeOf<'foo' | 'foo.bar'>();
  });

  it('should extract path to dictionary value that is a record', () => {
    expectTypeOf<
      ExtractPathToPojo<{ foo: { bar: Record<`user::${string}`, number> } }>
    >().toEqualTypeOf<'foo' | 'foo.bar'>();
  });

  it('should extract path to a record', () => {
    expectTypeOf<
      ExtractPathToPojo<{ foo: Record<`user::${string}`, number> }>
    >().toEqualTypeOf<'foo'>();
  });

  it('should extract path to a record value that is a dictionary', () => {
    expectTypeOf<
      ExtractPathToPojo<{ foo: Record<`user::${string}`, { name: string }> }>
    >().toEqualTypeOf<'foo' | `foo.user::${string}`>();
  });

  it('should extract path to an array index that points to a dictionary', () => {
    expectTypeOf<
      ExtractPathToPojo<{ foo: Array<{ name: string }> }>
    >().toEqualTypeOf<`foo[${number}]`>();
  });

  it('should extract path to an array index that points to a record', () => {
    expectTypeOf<
      ExtractPathToPojo<{ foo: Array<Record<string, number>> }>
    >().toEqualTypeOf<`foo[${number}]`>();
  });
});

describe('ExtractPathToRecord', () => {
  it('should extract path to a record', () => {
    type Result = ExtractPathToRecord<{
      lastModifiedAt: number;
      sales: Record<`user::${string}`, number>;
      body: { title: string };
      subscriptions: Array<Record<`user::${string}`, string>>;
      links: Record<
        `user::${string}`,
        Record<`user::${string}`, Record<`user::${string}`, { type: 'a' | 'b' }>>
      >;
    }>;

    expectTypeOf<Result>().toEqualTypeOf<
      | 'sales'
      | `subscriptions[${number}]`
      | 'links'
      | `links.user::${string}`
      | `links.user::${string}.user::${string}`
    >();
  });
});

describe('ExtractPathToRecordEntry', () => {
  it('should extract path to a record entry', () => {
    type Result = ExtractPathToRecordEntry<{
      lastModifiedAt: number;
      sales: Record<`user::${string}`, number>;
      body: { title: string };
      subscriptions: Array<Record<`user::${string}`, string>>;
      links: Record<
        `user::${string}`,
        Record<`user::${string}`, Record<`user::${string}`, { type: 'a' | 'b' }>>
      >;
    }>;

    expectTypeOf<Result>().toEqualTypeOf<
      | `sales.user::${string}`
      | `subscriptions[${number}].user::${string}`
      | `links.user::${string}`
      | `links.user::${string}.user::${string}`
      | `links.user::${string}.user::${string}.user::${string}`
    >();
  });
});
