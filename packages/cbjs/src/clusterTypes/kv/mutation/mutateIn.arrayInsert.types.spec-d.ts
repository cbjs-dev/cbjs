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
  AnyDocDef,
  AssertTests,
  BuildOptionalProperties,
  BuildReadonlyArrayProperties,
  BuildReadonlyProperties,
  If,
  IsFuzzyDocument,
  MakeTestPaths,
  TestDocRequiredProperties,
} from '@cbjsdev/shared';

import { connect } from '../../../couchbase.js';
import { DocDef } from '../../clusterTypes.js';
import type { MutateInArrayInsertPath } from './mutationOperations.types.js';

describe('mutateIn arrayInsert', async () => {
  type TestDoc = TestDocRequiredProperties &
    BuildOptionalProperties<TestDocRequiredProperties> &
    BuildReadonlyProperties<TestDocRequiredProperties> &
    BuildReadonlyArrayProperties<TestDocRequiredProperties>;

  type TestDocDef = DocDef<string, TestDoc>;

  type TestPaths<
    Def extends AnyDocDef,
    T extends Record<MakeTestPaths<Def['Body']>, boolean>,
  > = {
    [Path in keyof T]: [
      T[Path],
      Path extends MutateInArrayInsertPath<Def> ? true : false,
    ];
  };

  it('should only accept paths to array to which you may push element at the given index', function () {
    type Test = TestPaths<
      TestDocDef,
      {
        '': false;
        'String': false;
        'Number': false;
        'NonMatchingTuple': false;
        'NonMatchingTuple[0]': false;
        'NonMatchingTuple[1]': false;
        'NonMatchingTuple[2]': false;
        'NonMatchingTuple[-1]': false;
        'ArrayKnownLength': false;
        'ArrayKnownLength[0]': false;
        'ArrayKnownLength[1]': false;
        'ArrayKnownLength[2]': false;
        'ArrayKnownLength[-1]': false;
        'ArrayUnknownLength': false;
        'ArrayUnknownLength[0]': true;
        'ArrayUnknownLength[1]': true;
        'ArrayUnknownLength[2]': true;
        'ArrayUnknownLength[-1]': true;
        'ArrayHeadRest': false;
        'ArrayHeadRest[0]': true;
        'ArrayHeadRest[1]': true;
        'ArrayHeadRest[2]': true;
        'ArrayHeadRest[-1]': true;
        'ArrayHeadRestIncompatibleTail': false;
        'ArrayHeadRestIncompatibleTail[0]': true;
        'ArrayHeadRestIncompatibleTail[1]': true;
        'ArrayHeadRestIncompatibleTail[2]': true;
        'ArrayHeadRestIncompatibleTail[-1]': true;
        'ArrayTailRest': false;
        'ArrayTailRest[0]': true;
        'ArrayTailRest[1]': true;
        'ArrayTailRest[2]': true;
        'ArrayTailRest[-1]': true;
        'ArrayTailRestIncompatibleHead': false;
        'ArrayTailRestIncompatibleHead[0]': true;
        'ArrayTailRestIncompatibleHead[1]': true;
        'ArrayTailRestIncompatibleHead[2]': true;
        'ArrayTailRestIncompatibleHead[-1]': true;
        'OptionalString': false;
        'OptionalNumber': false;
        'OptionalNonMatchingTuple': false;
        'OptionalNonMatchingTuple[0]': false;
        'OptionalNonMatchingTuple[1]': false;
        'OptionalNonMatchingTuple[2]': false;
        'OptionalNonMatchingTuple[-1]': false;
        'OptionalArrayKnownLength': false;
        'OptionalArrayKnownLength[0]': false;
        'OptionalArrayKnownLength[1]': false;
        'OptionalArrayKnownLength[2]': false;
        'OptionalArrayKnownLength[-1]': false;
        'OptionalArrayUnknownLength': false;
        'OptionalArrayUnknownLength[0]': true;
        'OptionalArrayUnknownLength[1]': true;
        'OptionalArrayUnknownLength[2]': true;
        'OptionalArrayUnknownLength[-1]': true;
        'OptionalArrayHeadRest': false;
        'OptionalArrayHeadRest[0]': true;
        'OptionalArrayHeadRest[1]': true;
        'OptionalArrayHeadRest[2]': true;
        'OptionalArrayHeadRest[-1]': true;
        'OptionalArrayHeadRestIncompatibleTail': false;
        'OptionalArrayHeadRestIncompatibleTail[0]': true;
        'OptionalArrayHeadRestIncompatibleTail[1]': true;
        'OptionalArrayHeadRestIncompatibleTail[2]': true;
        'OptionalArrayHeadRestIncompatibleTail[-1]': true;
        'OptionalArrayTailRest': false;
        'OptionalArrayTailRest[0]': true;
        'OptionalArrayTailRest[1]': true;
        'OptionalArrayTailRest[2]': true;
        'OptionalArrayTailRest[-1]': true;
        'OptionalArrayTailRestIncompatibleHead': false;
        'OptionalArrayTailRestIncompatibleHead[0]': true;
        'OptionalArrayTailRestIncompatibleHead[1]': true;
        'OptionalArrayTailRestIncompatibleHead[2]': true;
        'OptionalArrayTailRestIncompatibleHead[-1]': true;
        'ReadonlyPropertyString': false;
        'ReadonlyPropertyNumber': false;
        'ReadonlyPropertyNonMatchingTuple': false;
        'ReadonlyPropertyNonMatchingTuple[0]': false;
        'ReadonlyPropertyNonMatchingTuple[1]': false;
        'ReadonlyPropertyNonMatchingTuple[2]': false;
        'ReadonlyPropertyNonMatchingTuple[-1]': false;
        'ReadonlyPropertyArrayKnownLength': false;
        'ReadonlyPropertyArrayKnownLength[0]': false;
        'ReadonlyPropertyArrayKnownLength[1]': false;
        'ReadonlyPropertyArrayKnownLength[2]': false;
        'ReadonlyPropertyArrayKnownLength[-1]': false;
        'ReadonlyPropertyArrayUnknownLength': false;
        'ReadonlyPropertyArrayUnknownLength[0]': true;
        'ReadonlyPropertyArrayUnknownLength[1]': true;
        'ReadonlyPropertyArrayUnknownLength[2]': true;
        'ReadonlyPropertyArrayUnknownLength[-1]': true;
        'ReadonlyPropertyArrayHeadRest': false;
        'ReadonlyPropertyArrayHeadRest[0]': true;
        'ReadonlyPropertyArrayHeadRest[1]': true;
        'ReadonlyPropertyArrayHeadRest[2]': true;
        'ReadonlyPropertyArrayHeadRest[-1]': true;
        'ReadonlyPropertyArrayHeadRestIncompatibleTail': false;
        'ReadonlyPropertyArrayHeadRestIncompatibleTail[0]': true;
        'ReadonlyPropertyArrayHeadRestIncompatibleTail[1]': true;
        'ReadonlyPropertyArrayHeadRestIncompatibleTail[2]': true;
        'ReadonlyPropertyArrayHeadRestIncompatibleTail[-1]': true;
        'ReadonlyPropertyArrayTailRest': false;
        'ReadonlyPropertyArrayTailRest[0]': true;
        'ReadonlyPropertyArrayTailRest[1]': true;
        'ReadonlyPropertyArrayTailRest[2]': true;
        'ReadonlyPropertyArrayTailRest[-1]': true;
        'ReadonlyPropertyArrayTailRestIncompatibleHead': false;
        'ReadonlyPropertyArrayTailRestIncompatibleHead[0]': true;
        'ReadonlyPropertyArrayTailRestIncompatibleHead[1]': true;
        'ReadonlyPropertyArrayTailRestIncompatibleHead[2]': true;
        'ReadonlyPropertyArrayTailRestIncompatibleHead[-1]': true;
        'ReadonlyNonMatchingTuple': false;
        'ReadonlyNonMatchingTuple[0]': false;
        'ReadonlyNonMatchingTuple[1]': false;
        'ReadonlyNonMatchingTuple[2]': false;
        'ReadonlyNonMatchingTuple[-1]': false;
        'ReadonlyArrayKnownLength': false;
        'ReadonlyArrayKnownLength[0]': false;
        'ReadonlyArrayKnownLength[1]': false;
        'ReadonlyArrayKnownLength[2]': false;
        'ReadonlyArrayKnownLength[-1]': false;
        'ReadonlyArrayUnknownLength': false;
        'ReadonlyArrayUnknownLength[0]': false;
        'ReadonlyArrayUnknownLength[1]': false;
        'ReadonlyArrayUnknownLength[2]': false;
        'ReadonlyArrayUnknownLength[-1]': false;
        'ReadonlyArrayHeadRest': false;
        'ReadonlyArrayHeadRest[0]': false;
        'ReadonlyArrayHeadRest[1]': false;
        'ReadonlyArrayHeadRest[2]': false;
        'ReadonlyArrayHeadRest[-1]': false;
        'ReadonlyArrayHeadRestIncompatibleTail': false;
        'ReadonlyArrayHeadRestIncompatibleTail[0]': false;
        'ReadonlyArrayHeadRestIncompatibleTail[1]': false;
        'ReadonlyArrayHeadRestIncompatibleTail[2]': false;
        'ReadonlyArrayHeadRestIncompatibleTail[-1]': false;
        'ReadonlyArrayTailRest': false;
        'ReadonlyArrayTailRest[0]': false;
        'ReadonlyArrayTailRest[1]': false;
        'ReadonlyArrayTailRest[2]': false;
        'ReadonlyArrayTailRest[-1]': false;
        'ReadonlyArrayTailRestIncompatibleHead': false;
        'ReadonlyArrayTailRestIncompatibleHead[0]': false;
        'ReadonlyArrayTailRestIncompatibleHead[1]': false;
        'ReadonlyArrayTailRestIncompatibleHead[2]': false;
        'ReadonlyArrayTailRestIncompatibleHead[-1]': false;
      }
    >;

    type TestResult = AssertTests<Test>;
    expectTypeOf<TestResult>().toEqualTypeOf<true>();

    type TestArrDoc = TestPaths<
      DocDef<string, string[]>,
      {
        '': false;
        '[0]': true;
        '[1]': true;
        '[2]': true;
        '[-1]': true;
      }
    >;

    type TestArrDocResult = AssertTests<TestArrDoc>;
    expectTypeOf<TestArrDocResult>().toEqualTypeOf<true>();
  });

  it('should not offer a nested prop that is not an array', () => {
    it('should not offer a nested prop that is not an array', async () => {
      type UserClusterTypes = {
        b: {
          s: {
            c: [
              DocDef<
                `book::${string}`,
                {
                  body: { title: string; expectedBenefits?: string };
                  metadata: { tags: string[] };
                }
              >,
            ];
          };
        };
      };

      const cluster = await connect<UserClusterTypes>('couchbase://127.0.0.1');

      type OperationPath<Doc, Path extends string> = If<
        IsFuzzyDocument<Doc>,
        string,
        Path
      >;

      type TestDocDef = DocDef<string, { metadata: { tags: string[] } }>;
      type TestDocDef2 = DocDef<string, { authors: string[] }>;
      type T =
        // | (MutateInArrayInsertPath<TestDocDef> & NonNullable<unknown>)
        // | ExtractPathToInsertableArrayIndex<TestDocDef['Body'], TestDocDef['Path']>
        // | If<true, `authors[${number}]`, 'nope'>
        `metadata.tags[${string}]` | 'metadata.tags[1]' | 'authors[1]';

      type ExtractPathToArray<Path> = Path extends `${string}[${number}]` ? Path : never;

      type MetaRepro<Path> = Path extends unknown
        ? ExtractPathToArray<Path> extends infer TP
          ? (TP & NonNullable<unknown>) | 'metadata.tags[1]'
          : never
        : never;

      type TR = MetaRepro<`metadata.tags[${number}]`>;

      const t: T = 'metadata.tags[1]';

      const collection = cluster.bucket('b').scope('s').collection('c');
      // await collection.mutateIn('book::001').arrayInsert('');
    });
  });
});
