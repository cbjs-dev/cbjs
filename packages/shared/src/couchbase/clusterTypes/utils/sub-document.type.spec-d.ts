import { describe, expectTypeOf, it } from 'vitest';

import { SubDocument } from './sub-document.type.js';

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
    events:
      | {
          type: 'a';
          mixed: string;
          propA: {
            title: string;
          };
        }
      | {
          type: 'b';
          mixed: number;
          propB: {
            status: string;
          };
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
    >().toEqualTypeOf<{ aop: string }>();
    expectTypeOf<
      SubDocument<Doc, `obj.requiredArrayOfObjects[${number}].aop`>
    >().toEqualTypeOf<string>();
    expectTypeOf<SubDocument<Doc, `obj.optionalArray`>>().toEqualTypeOf<
      string[] | undefined
    >();
    expectTypeOf<
      SubDocument<Doc, `obj.optionalArray[${number}]`>
    >().toEqualTypeOf<string>();
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
    expectTypeOf<SubDocument<Doc, `obj.mixed[${number}]`>>().toEqualTypeOf<string>();
    expectTypeOf<SubDocument<Doc, `obj.mixed.prop`>>().toEqualTypeOf<string>();
    expectTypeOf<SubDocument<Doc, `obj.nestedArray`>>().toEqualTypeOf<string[][]>();
    expectTypeOf<SubDocument<Doc, `obj.nestedArray[0]`>>().toEqualTypeOf<string[]>();
    expectTypeOf<SubDocument<Doc, `obj.nestedArray[0][0]`>>().toEqualTypeOf<string>();
  });

  it('should return the array indexes for an array document', function () {
    expectTypeOf<SubDocument<string[], ''>>().toEqualTypeOf<string[]>();
    expectTypeOf<SubDocument<string[], '[0]'>>().toEqualTypeOf<string>();
    expectTypeOf<SubDocument<string[], `[${number}]`>>().toEqualTypeOf<string>();

    expectTypeOf<SubDocument<[string], ''>>().toEqualTypeOf<[string]>();
    expectTypeOf<SubDocument<[string], '[0]'>>().toEqualTypeOf<string>();
  });

  it('should return the type of a property held in a single member of a union', () => {
    type Test = SubDocument<Doc, 'events.propB.status'>;
    expectTypeOf<Test>().toEqualTypeOf<string>();
  });

  it('should return never for a property of another member of the union', () => {
    type Test = SubDocument<Doc, 'events.propB.title'>;
    expectTypeOf<Test>().toBeNever();
  });

  it('should return a union of all the types of the property in every member of the union', () => {
    type Test = SubDocument<Doc, 'events.mixed'>;
    expectTypeOf<Test>().toEqualTypeOf<string | number>();
  });
});
