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
  AssertTests,
  BuildOptionalProperties,
  BuildReadonlyArrayProperties,
  BuildReadonlyProperties,
  MakeTestPaths,
  TestDocRequiredProperties,
} from '@cbjsdev/shared';

import type {
  MutateInArrayAddUniquePath,
  MutateInArrayAppendPath,
  MutateInArrayInsertPath,
  MutateInArrayPrependPath,
  MutateInCounterPath,
  MutateInInsertPath,
  MutateInRemovePath,
  MutateInReplacePath,
  MutateInUpsertPath,
} from './mutationOperations.types.js';

describe('mutation operations', function () {
  type TestDoc = TestDocRequiredProperties &
    BuildOptionalProperties<TestDocRequiredProperties> &
    BuildReadonlyProperties<TestDocRequiredProperties> &
    BuildReadonlyArrayProperties<TestDocRequiredProperties>;

  type Paths<Doc extends object> = {
    insert: MutateInInsertPath<Doc>;
    upsert: MutateInUpsertPath<Doc>;
    replace: MutateInReplacePath<Doc>;
    remove: MutateInRemovePath<Doc>;
    arrayAppend: MutateInArrayAppendPath<Doc>;
    arrayPrepend: MutateInArrayPrependPath<Doc>;
    arrayInsert: MutateInArrayInsertPath<Doc>;
    arrayAddUnique: MutateInArrayAddUniquePath<Doc>;
    increment: MutateInCounterPath<Doc>;
    decrement: MutateInCounterPath<Doc>;
  };

  type TestPaths<
    Doc extends object,
    F extends keyof Paths<Doc>,
    T extends Record<MakeTestPaths<Doc>, boolean>,
  > = {
    [Path in keyof T]: [T[Path], Path extends Paths<Doc>[F] ? true : false];
  };

  describe('insert', function () {
    it('should only accept insertable paths', function () {
      type Test = TestPaths<
        TestDoc,
        'insert',
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
          'ArrayUnknownLength[0]': false;
          'ArrayUnknownLength[1]': false;
          'ArrayUnknownLength[2]': false;
          'ArrayUnknownLength[-1]': false;
          'ArrayHeadRest': false;
          'ArrayHeadRest[0]': false;
          'ArrayHeadRest[1]': false;
          'ArrayHeadRest[2]': false;
          'ArrayHeadRest[-1]': false;
          'ArrayHeadRestIncompatibleTail': false;
          'ArrayHeadRestIncompatibleTail[0]': false;
          'ArrayHeadRestIncompatibleTail[1]': false;
          'ArrayHeadRestIncompatibleTail[2]': false;
          'ArrayHeadRestIncompatibleTail[-1]': false;
          'ArrayTailRest': false;
          'ArrayTailRest[0]': false;
          'ArrayTailRest[1]': false;
          'ArrayTailRest[2]': false;
          'ArrayTailRest[-1]': false;
          'ArrayTailRestIncompatibleHead': false;
          'ArrayTailRestIncompatibleHead[0]': false;
          'ArrayTailRestIncompatibleHead[1]': false;
          'ArrayTailRestIncompatibleHead[2]': false;
          'ArrayTailRestIncompatibleHead[-1]': false;
          'OptionalString': true;
          'OptionalNumber': true;
          'OptionalNonMatchingTuple': true;
          'OptionalNonMatchingTuple[0]': false;
          'OptionalNonMatchingTuple[1]': false;
          'OptionalNonMatchingTuple[2]': false;
          'OptionalNonMatchingTuple[-1]': false;
          'OptionalArrayKnownLength': true;
          'OptionalArrayKnownLength[0]': false;
          'OptionalArrayKnownLength[1]': false;
          'OptionalArrayKnownLength[2]': false;
          'OptionalArrayKnownLength[-1]': false;
          'OptionalArrayUnknownLength': true;
          'OptionalArrayUnknownLength[0]': false;
          'OptionalArrayUnknownLength[1]': false;
          'OptionalArrayUnknownLength[2]': false;
          'OptionalArrayUnknownLength[-1]': false;
          'OptionalArrayHeadRest': true;
          'OptionalArrayHeadRest[0]': false;
          'OptionalArrayHeadRest[1]': false;
          'OptionalArrayHeadRest[2]': false;
          'OptionalArrayHeadRest[-1]': false;
          'OptionalArrayHeadRestIncompatibleTail': true;
          'OptionalArrayHeadRestIncompatibleTail[0]': false;
          'OptionalArrayHeadRestIncompatibleTail[1]': false;
          'OptionalArrayHeadRestIncompatibleTail[2]': false;
          'OptionalArrayHeadRestIncompatibleTail[-1]': false;
          'OptionalArrayTailRest': true;
          'OptionalArrayTailRest[0]': false;
          'OptionalArrayTailRest[1]': false;
          'OptionalArrayTailRest[2]': false;
          'OptionalArrayTailRest[-1]': false;
          'OptionalArrayTailRestIncompatibleHead': true;
          'OptionalArrayTailRestIncompatibleHead[0]': false;
          'OptionalArrayTailRestIncompatibleHead[1]': false;
          'OptionalArrayTailRestIncompatibleHead[2]': false;
          'OptionalArrayTailRestIncompatibleHead[-1]': false;
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
          'ReadonlyPropertyArrayUnknownLength[0]': false;
          'ReadonlyPropertyArrayUnknownLength[1]': false;
          'ReadonlyPropertyArrayUnknownLength[2]': false;
          'ReadonlyPropertyArrayUnknownLength[-1]': false;
          'ReadonlyPropertyArrayHeadRest': false;
          'ReadonlyPropertyArrayHeadRest[0]': false;
          'ReadonlyPropertyArrayHeadRest[1]': false;
          'ReadonlyPropertyArrayHeadRest[2]': false;
          'ReadonlyPropertyArrayHeadRest[-1]': false;
          'ReadonlyPropertyArrayHeadRestIncompatibleTail': false;
          'ReadonlyPropertyArrayHeadRestIncompatibleTail[0]': false;
          'ReadonlyPropertyArrayHeadRestIncompatibleTail[1]': false;
          'ReadonlyPropertyArrayHeadRestIncompatibleTail[2]': false;
          'ReadonlyPropertyArrayHeadRestIncompatibleTail[-1]': false;
          'ReadonlyPropertyArrayTailRest': false;
          'ReadonlyPropertyArrayTailRest[0]': false;
          'ReadonlyPropertyArrayTailRest[1]': false;
          'ReadonlyPropertyArrayTailRest[2]': false;
          'ReadonlyPropertyArrayTailRest[-1]': false;
          'ReadonlyPropertyArrayTailRestIncompatibleHead': false;
          'ReadonlyPropertyArrayTailRestIncompatibleHead[0]': false;
          'ReadonlyPropertyArrayTailRestIncompatibleHead[1]': false;
          'ReadonlyPropertyArrayTailRestIncompatibleHead[2]': false;
          'ReadonlyPropertyArrayTailRestIncompatibleHead[-1]': false;
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
    });
  });

  describe('upsert', function () {
    it('should only accept upsertable paths', function () {
      type Test = TestPaths<
        TestDoc,
        'upsert',
        {
          '': true;
          'String': true;
          'Number': true;
          'NonMatchingTuple': true;
          'NonMatchingTuple[0]': false;
          'NonMatchingTuple[1]': false;
          'NonMatchingTuple[2]': false;
          'NonMatchingTuple[-1]': false;
          'ArrayKnownLength': true;
          'ArrayKnownLength[0]': false;
          'ArrayKnownLength[1]': false;
          'ArrayKnownLength[2]': false;
          'ArrayKnownLength[-1]': false;
          'ArrayUnknownLength': true;
          'ArrayUnknownLength[0]': false;
          'ArrayUnknownLength[1]': false;
          'ArrayUnknownLength[2]': false;
          'ArrayUnknownLength[-1]': false;
          'ArrayHeadRest': true;
          'ArrayHeadRest[0]': false;
          'ArrayHeadRest[1]': false;
          'ArrayHeadRest[2]': false;
          'ArrayHeadRest[-1]': false;
          'ArrayHeadRestIncompatibleTail': true;
          'ArrayHeadRestIncompatibleTail[0]': false;
          'ArrayHeadRestIncompatibleTail[1]': false;
          'ArrayHeadRestIncompatibleTail[2]': false;
          'ArrayHeadRestIncompatibleTail[-1]': false;
          'ArrayTailRest': true;
          'ArrayTailRest[0]': false;
          'ArrayTailRest[1]': false;
          'ArrayTailRest[2]': false;
          'ArrayTailRest[-1]': false;
          'ArrayTailRestIncompatibleHead': true;
          'ArrayTailRestIncompatibleHead[0]': false;
          'ArrayTailRestIncompatibleHead[1]': false;
          'ArrayTailRestIncompatibleHead[2]': false;
          'ArrayTailRestIncompatibleHead[-1]': false;
          'OptionalString': true;
          'OptionalNumber': true;
          'OptionalNonMatchingTuple': true;
          'OptionalNonMatchingTuple[0]': false;
          'OptionalNonMatchingTuple[1]': false;
          'OptionalNonMatchingTuple[2]': false;
          'OptionalNonMatchingTuple[-1]': false;
          'OptionalArrayKnownLength': true;
          'OptionalArrayKnownLength[0]': false;
          'OptionalArrayKnownLength[1]': false;
          'OptionalArrayKnownLength[2]': false;
          'OptionalArrayKnownLength[-1]': false;
          'OptionalArrayUnknownLength': true;
          'OptionalArrayUnknownLength[0]': false;
          'OptionalArrayUnknownLength[1]': false;
          'OptionalArrayUnknownLength[2]': false;
          'OptionalArrayUnknownLength[-1]': false;
          'OptionalArrayHeadRest': true;
          'OptionalArrayHeadRest[0]': false;
          'OptionalArrayHeadRest[1]': false;
          'OptionalArrayHeadRest[2]': false;
          'OptionalArrayHeadRest[-1]': false;
          'OptionalArrayHeadRestIncompatibleTail': true;
          'OptionalArrayHeadRestIncompatibleTail[0]': false;
          'OptionalArrayHeadRestIncompatibleTail[1]': false;
          'OptionalArrayHeadRestIncompatibleTail[2]': false;
          'OptionalArrayHeadRestIncompatibleTail[-1]': false;
          'OptionalArrayTailRest': true;
          'OptionalArrayTailRest[0]': false;
          'OptionalArrayTailRest[1]': false;
          'OptionalArrayTailRest[2]': false;
          'OptionalArrayTailRest[-1]': false;
          'OptionalArrayTailRestIncompatibleHead': true;
          'OptionalArrayTailRestIncompatibleHead[0]': false;
          'OptionalArrayTailRestIncompatibleHead[1]': false;
          'OptionalArrayTailRestIncompatibleHead[2]': false;
          'OptionalArrayTailRestIncompatibleHead[-1]': false;
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
          'ReadonlyPropertyArrayUnknownLength[0]': false;
          'ReadonlyPropertyArrayUnknownLength[1]': false;
          'ReadonlyPropertyArrayUnknownLength[2]': false;
          'ReadonlyPropertyArrayUnknownLength[-1]': false;
          'ReadonlyPropertyArrayHeadRest': false;
          'ReadonlyPropertyArrayHeadRest[0]': false;
          'ReadonlyPropertyArrayHeadRest[1]': false;
          'ReadonlyPropertyArrayHeadRest[2]': false;
          'ReadonlyPropertyArrayHeadRest[-1]': false;
          'ReadonlyPropertyArrayHeadRestIncompatibleTail': false;
          'ReadonlyPropertyArrayHeadRestIncompatibleTail[0]': false;
          'ReadonlyPropertyArrayHeadRestIncompatibleTail[1]': false;
          'ReadonlyPropertyArrayHeadRestIncompatibleTail[2]': false;
          'ReadonlyPropertyArrayHeadRestIncompatibleTail[-1]': false;
          'ReadonlyPropertyArrayTailRest': false;
          'ReadonlyPropertyArrayTailRest[0]': false;
          'ReadonlyPropertyArrayTailRest[1]': false;
          'ReadonlyPropertyArrayTailRest[2]': false;
          'ReadonlyPropertyArrayTailRest[-1]': false;
          'ReadonlyPropertyArrayTailRestIncompatibleHead': false;
          'ReadonlyPropertyArrayTailRestIncompatibleHead[0]': false;
          'ReadonlyPropertyArrayTailRestIncompatibleHead[1]': false;
          'ReadonlyPropertyArrayTailRestIncompatibleHead[2]': false;
          'ReadonlyPropertyArrayTailRestIncompatibleHead[-1]': false;
          'ReadonlyNonMatchingTuple': true;
          'ReadonlyNonMatchingTuple[0]': false;
          'ReadonlyNonMatchingTuple[1]': false;
          'ReadonlyNonMatchingTuple[2]': false;
          'ReadonlyNonMatchingTuple[-1]': false;
          'ReadonlyArrayKnownLength': true;
          'ReadonlyArrayKnownLength[0]': false;
          'ReadonlyArrayKnownLength[1]': false;
          'ReadonlyArrayKnownLength[2]': false;
          'ReadonlyArrayKnownLength[-1]': false;
          'ReadonlyArrayUnknownLength': true;
          'ReadonlyArrayUnknownLength[0]': false;
          'ReadonlyArrayUnknownLength[1]': false;
          'ReadonlyArrayUnknownLength[2]': false;
          'ReadonlyArrayUnknownLength[-1]': false;
          'ReadonlyArrayHeadRest': true;
          'ReadonlyArrayHeadRest[0]': false;
          'ReadonlyArrayHeadRest[1]': false;
          'ReadonlyArrayHeadRest[2]': false;
          'ReadonlyArrayHeadRest[-1]': false;
          'ReadonlyArrayHeadRestIncompatibleTail': true;
          'ReadonlyArrayHeadRestIncompatibleTail[0]': false;
          'ReadonlyArrayHeadRestIncompatibleTail[1]': false;
          'ReadonlyArrayHeadRestIncompatibleTail[2]': false;
          'ReadonlyArrayHeadRestIncompatibleTail[-1]': false;
          'ReadonlyArrayTailRest': true;
          'ReadonlyArrayTailRest[0]': false;
          'ReadonlyArrayTailRest[1]': false;
          'ReadonlyArrayTailRest[2]': false;
          'ReadonlyArrayTailRest[-1]': false;
          'ReadonlyArrayTailRestIncompatibleHead': true;
          'ReadonlyArrayTailRestIncompatibleHead[0]': false;
          'ReadonlyArrayTailRestIncompatibleHead[1]': false;
          'ReadonlyArrayTailRestIncompatibleHead[2]': false;
          'ReadonlyArrayTailRestIncompatibleHead[-1]': false;
        }
      >;

      type TestResult = AssertTests<Test>;
      expectTypeOf<TestResult>().toEqualTypeOf<true>();
    });
  });

  describe('replace', function () {
    it('should only accept replaceable paths', function () {
      type Test = TestPaths<
        TestDoc,
        'replace',
        {
          '': false;
          'String': true;
          'Number': true;
          'NonMatchingTuple': true;
          'NonMatchingTuple[0]': true;
          'NonMatchingTuple[1]': true;
          'NonMatchingTuple[2]': false;
          'NonMatchingTuple[-1]': true;
          'ArrayKnownLength': true;
          'ArrayKnownLength[0]': true;
          'ArrayKnownLength[1]': true;
          'ArrayKnownLength[2]': false;
          'ArrayKnownLength[-1]': true;
          'ArrayUnknownLength': true;
          'ArrayUnknownLength[0]': true;
          'ArrayUnknownLength[1]': true;
          'ArrayUnknownLength[2]': true;
          'ArrayUnknownLength[-1]': true;
          'ArrayHeadRest': true;
          'ArrayHeadRest[0]': true;
          'ArrayHeadRest[1]': true;
          'ArrayHeadRest[2]': true;
          'ArrayHeadRest[-1]': true;
          'ArrayHeadRestIncompatibleTail': true;
          'ArrayHeadRestIncompatibleTail[0]': true;
          'ArrayHeadRestIncompatibleTail[1]': true;
          'ArrayHeadRestIncompatibleTail[2]': true;
          'ArrayHeadRestIncompatibleTail[-1]': true;
          'ArrayTailRest': true;
          'ArrayTailRest[0]': true;
          'ArrayTailRest[1]': true;
          'ArrayTailRest[2]': true;
          'ArrayTailRest[-1]': true;
          'ArrayTailRestIncompatibleHead': true;
          'ArrayTailRestIncompatibleHead[0]': true;
          'ArrayTailRestIncompatibleHead[1]': true;
          'ArrayTailRestIncompatibleHead[2]': true;
          'ArrayTailRestIncompatibleHead[-1]': true;
          'OptionalString': true;
          'OptionalNumber': true;
          'OptionalNonMatchingTuple': true;
          'OptionalNonMatchingTuple[0]': true;
          'OptionalNonMatchingTuple[1]': true;
          'OptionalNonMatchingTuple[2]': false;
          'OptionalNonMatchingTuple[-1]': true;
          'OptionalArrayKnownLength': true;
          'OptionalArrayKnownLength[0]': true;
          'OptionalArrayKnownLength[1]': true;
          'OptionalArrayKnownLength[2]': false;
          'OptionalArrayKnownLength[-1]': true;
          'OptionalArrayUnknownLength': true;
          'OptionalArrayUnknownLength[0]': true;
          'OptionalArrayUnknownLength[1]': true;
          'OptionalArrayUnknownLength[2]': true;
          'OptionalArrayUnknownLength[-1]': true;
          'OptionalArrayHeadRest': true;
          'OptionalArrayHeadRest[0]': true;
          'OptionalArrayHeadRest[1]': true;
          'OptionalArrayHeadRest[2]': true;
          'OptionalArrayHeadRest[-1]': true;
          'OptionalArrayHeadRestIncompatibleTail': true;
          'OptionalArrayHeadRestIncompatibleTail[0]': true;
          'OptionalArrayHeadRestIncompatibleTail[1]': true;
          'OptionalArrayHeadRestIncompatibleTail[2]': true;
          'OptionalArrayHeadRestIncompatibleTail[-1]': true;
          'OptionalArrayTailRest': true;
          'OptionalArrayTailRest[0]': true;
          'OptionalArrayTailRest[1]': true;
          'OptionalArrayTailRest[2]': true;
          'OptionalArrayTailRest[-1]': true;
          'OptionalArrayTailRestIncompatibleHead': true;
          'OptionalArrayTailRestIncompatibleHead[0]': true;
          'OptionalArrayTailRestIncompatibleHead[1]': true;
          'OptionalArrayTailRestIncompatibleHead[2]': true;
          'OptionalArrayTailRestIncompatibleHead[-1]': true;
          'ReadonlyPropertyString': false;
          'ReadonlyPropertyNumber': false;
          'ReadonlyPropertyNonMatchingTuple': false;
          'ReadonlyPropertyNonMatchingTuple[0]': true;
          'ReadonlyPropertyNonMatchingTuple[1]': true;
          'ReadonlyPropertyNonMatchingTuple[2]': false;
          'ReadonlyPropertyNonMatchingTuple[-1]': true;
          'ReadonlyPropertyArrayKnownLength': false;
          'ReadonlyPropertyArrayKnownLength[0]': true;
          'ReadonlyPropertyArrayKnownLength[1]': true;
          'ReadonlyPropertyArrayKnownLength[2]': false;
          'ReadonlyPropertyArrayKnownLength[-1]': true;
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
          'ReadonlyNonMatchingTuple': true;
          'ReadonlyNonMatchingTuple[0]': false;
          'ReadonlyNonMatchingTuple[1]': false;
          'ReadonlyNonMatchingTuple[2]': false;
          'ReadonlyNonMatchingTuple[-1]': false;
          'ReadonlyArrayKnownLength': true;
          'ReadonlyArrayKnownLength[0]': false;
          'ReadonlyArrayKnownLength[1]': false;
          'ReadonlyArrayKnownLength[2]': false;
          'ReadonlyArrayKnownLength[-1]': false;
          'ReadonlyArrayUnknownLength': true;
          'ReadonlyArrayUnknownLength[0]': false;
          'ReadonlyArrayUnknownLength[1]': false;
          'ReadonlyArrayUnknownLength[2]': false;
          'ReadonlyArrayUnknownLength[-1]': false;
          'ReadonlyArrayHeadRest': true;
          'ReadonlyArrayHeadRest[0]': false;
          'ReadonlyArrayHeadRest[1]': false;
          'ReadonlyArrayHeadRest[2]': false;
          'ReadonlyArrayHeadRest[-1]': false;
          'ReadonlyArrayHeadRestIncompatibleTail': true;
          'ReadonlyArrayHeadRestIncompatibleTail[0]': false;
          'ReadonlyArrayHeadRestIncompatibleTail[1]': false;
          'ReadonlyArrayHeadRestIncompatibleTail[2]': false;
          'ReadonlyArrayHeadRestIncompatibleTail[-1]': false;
          'ReadonlyArrayTailRest': true;
          'ReadonlyArrayTailRest[0]': false;
          'ReadonlyArrayTailRest[1]': false;
          'ReadonlyArrayTailRest[2]': false;
          'ReadonlyArrayTailRest[-1]': false;
          'ReadonlyArrayTailRestIncompatibleHead': true;
          'ReadonlyArrayTailRestIncompatibleHead[0]': false;
          'ReadonlyArrayTailRestIncompatibleHead[1]': false;
          'ReadonlyArrayTailRestIncompatibleHead[2]': false;
          'ReadonlyArrayTailRestIncompatibleHead[-1]': false;
        }
      >;

      type TestResult = AssertTests<Test>;
      expectTypeOf<TestResult>().toEqualTypeOf<true>();
    });
  });

  describe('remove', function () {
    it('should only accept removable paths', function () {
      type Test = TestPaths<
        TestDoc,
        'remove',
        {
          '': true;
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
          'OptionalString': true;
          'OptionalNumber': true;
          'OptionalNonMatchingTuple': true;
          'OptionalNonMatchingTuple[0]': false;
          'OptionalNonMatchingTuple[1]': false;
          'OptionalNonMatchingTuple[2]': false;
          'OptionalNonMatchingTuple[-1]': false;
          'OptionalArrayKnownLength': true;
          'OptionalArrayKnownLength[0]': false;
          'OptionalArrayKnownLength[1]': false;
          'OptionalArrayKnownLength[2]': false;
          'OptionalArrayKnownLength[-1]': false;
          'OptionalArrayUnknownLength': true;
          'OptionalArrayUnknownLength[0]': true;
          'OptionalArrayUnknownLength[1]': true;
          'OptionalArrayUnknownLength[2]': true;
          'OptionalArrayUnknownLength[-1]': true;
          'OptionalArrayHeadRest': true;
          'OptionalArrayHeadRest[0]': true;
          'OptionalArrayHeadRest[1]': true;
          'OptionalArrayHeadRest[2]': true;
          'OptionalArrayHeadRest[-1]': true;
          'OptionalArrayHeadRestIncompatibleTail': true;
          'OptionalArrayHeadRestIncompatibleTail[0]': true;
          'OptionalArrayHeadRestIncompatibleTail[1]': true;
          'OptionalArrayHeadRestIncompatibleTail[2]': true;
          'OptionalArrayHeadRestIncompatibleTail[-1]': true;
          'OptionalArrayTailRest': true;
          'OptionalArrayTailRest[0]': true;
          'OptionalArrayTailRest[1]': true;
          'OptionalArrayTailRest[2]': true;
          'OptionalArrayTailRest[-1]': true;
          'OptionalArrayTailRestIncompatibleHead': true;
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

      // Array document
      type TestArrDoc = TestPaths<
        string[],
        'remove',
        {
          '': true;
          '[0]': true;
          '[1]': true;
          '[2]': true;
          '[-1]': true;
        }
      >;

      type TestArrDocResult = AssertTests<TestArrDoc>;
      expectTypeOf<TestArrDocResult>().toEqualTypeOf<true>();

      // Optional object with required property
      type TestOptObjectWithRequiredProperty = TestPaths<
        { metadata?: { tags: string[] } },
        'remove',
        {
          '': true;
          'metadata': true;
          'metadata.tags': false;
          'metadata.tags[0]': true;
          'metadata.tags[1]': true;
          'metadata.tags[2]': true;
          'metadata.tags[-1]': true;
        }
      >;

      type TestOptObjectWithRequiredPropertyResult =
        AssertTests<TestOptObjectWithRequiredProperty>;
      expectTypeOf<TestOptObjectWithRequiredPropertyResult>().toEqualTypeOf<true>();
    });
  });

  describe('arrayAppend', function () {
    it('should only accept paths to array to which you can append an element', function () {
      type Test = TestPaths<
        TestDoc,
        'arrayAppend',
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
          'ArrayUnknownLength': true;
          'ArrayUnknownLength[0]': false;
          'ArrayUnknownLength[1]': false;
          'ArrayUnknownLength[2]': false;
          'ArrayUnknownLength[-1]': false;
          'ArrayHeadRest': true;
          'ArrayHeadRest[0]': false;
          'ArrayHeadRest[1]': false;
          'ArrayHeadRest[2]': false;
          'ArrayHeadRest[-1]': false;
          'ArrayHeadRestIncompatibleTail': false;
          'ArrayHeadRestIncompatibleTail[0]': false;
          'ArrayHeadRestIncompatibleTail[1]': false;
          'ArrayHeadRestIncompatibleTail[2]': false;
          'ArrayHeadRestIncompatibleTail[-1]': false;
          'ArrayTailRest': true;
          'ArrayTailRest[0]': false;
          'ArrayTailRest[1]': false;
          'ArrayTailRest[2]': false;
          'ArrayTailRest[-1]': false;
          'ArrayTailRestIncompatibleHead': true;
          'ArrayTailRestIncompatibleHead[0]': false;
          'ArrayTailRestIncompatibleHead[1]': false;
          'ArrayTailRestIncompatibleHead[2]': false;
          'ArrayTailRestIncompatibleHead[-1]': false;
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
          'OptionalArrayUnknownLength': true;
          'OptionalArrayUnknownLength[0]': false;
          'OptionalArrayUnknownLength[1]': false;
          'OptionalArrayUnknownLength[2]': false;
          'OptionalArrayUnknownLength[-1]': false;
          'OptionalArrayHeadRest': true;
          'OptionalArrayHeadRest[0]': false;
          'OptionalArrayHeadRest[1]': false;
          'OptionalArrayHeadRest[2]': false;
          'OptionalArrayHeadRest[-1]': false;
          'OptionalArrayHeadRestIncompatibleTail': false;
          'OptionalArrayHeadRestIncompatibleTail[0]': false;
          'OptionalArrayHeadRestIncompatibleTail[1]': false;
          'OptionalArrayHeadRestIncompatibleTail[2]': false;
          'OptionalArrayHeadRestIncompatibleTail[-1]': false;
          'OptionalArrayTailRest': true;
          'OptionalArrayTailRest[0]': false;
          'OptionalArrayTailRest[1]': false;
          'OptionalArrayTailRest[2]': false;
          'OptionalArrayTailRest[-1]': false;
          'OptionalArrayTailRestIncompatibleHead': true;
          'OptionalArrayTailRestIncompatibleHead[0]': false;
          'OptionalArrayTailRestIncompatibleHead[1]': false;
          'OptionalArrayTailRestIncompatibleHead[2]': false;
          'OptionalArrayTailRestIncompatibleHead[-1]': false;
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
          'ReadonlyPropertyArrayUnknownLength': true;
          'ReadonlyPropertyArrayUnknownLength[0]': false;
          'ReadonlyPropertyArrayUnknownLength[1]': false;
          'ReadonlyPropertyArrayUnknownLength[2]': false;
          'ReadonlyPropertyArrayUnknownLength[-1]': false;
          'ReadonlyPropertyArrayHeadRest': true;
          'ReadonlyPropertyArrayHeadRest[0]': false;
          'ReadonlyPropertyArrayHeadRest[1]': false;
          'ReadonlyPropertyArrayHeadRest[2]': false;
          'ReadonlyPropertyArrayHeadRest[-1]': false;
          'ReadonlyPropertyArrayHeadRestIncompatibleTail': false;
          'ReadonlyPropertyArrayHeadRestIncompatibleTail[0]': false;
          'ReadonlyPropertyArrayHeadRestIncompatibleTail[1]': false;
          'ReadonlyPropertyArrayHeadRestIncompatibleTail[2]': false;
          'ReadonlyPropertyArrayHeadRestIncompatibleTail[-1]': false;
          'ReadonlyPropertyArrayTailRest': true;
          'ReadonlyPropertyArrayTailRest[0]': false;
          'ReadonlyPropertyArrayTailRest[1]': false;
          'ReadonlyPropertyArrayTailRest[2]': false;
          'ReadonlyPropertyArrayTailRest[-1]': false;
          'ReadonlyPropertyArrayTailRestIncompatibleHead': true;
          'ReadonlyPropertyArrayTailRestIncompatibleHead[0]': false;
          'ReadonlyPropertyArrayTailRestIncompatibleHead[1]': false;
          'ReadonlyPropertyArrayTailRestIncompatibleHead[2]': false;
          'ReadonlyPropertyArrayTailRestIncompatibleHead[-1]': false;
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
        string[],
        'arrayAppend',
        {
          '': true;
          '[0]': false;
          '[1]': false;
          '[2]': false;
          '[-1]': false;
        }
      >;

      type TestArrDocResult = AssertTests<TestArrDoc>;
      expectTypeOf<TestArrDocResult>().toEqualTypeOf<true>();
    });
  });

  it('should only accept paths to array to which you can prepend an element', function () {
    type Test = TestPaths<
      TestDoc,
      'arrayPrepend',
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
        'ArrayUnknownLength': true;
        'ArrayUnknownLength[0]': false;
        'ArrayUnknownLength[1]': false;
        'ArrayUnknownLength[2]': false;
        'ArrayUnknownLength[-1]': false;
        'ArrayHeadRest': true;
        'ArrayHeadRest[0]': false;
        'ArrayHeadRest[1]': false;
        'ArrayHeadRest[2]': false;
        'ArrayHeadRest[-1]': false;
        'ArrayHeadRestIncompatibleTail': true;
        'ArrayHeadRestIncompatibleTail[0]': false;
        'ArrayHeadRestIncompatibleTail[1]': false;
        'ArrayHeadRestIncompatibleTail[2]': false;
        'ArrayHeadRestIncompatibleTail[-1]': false;
        'ArrayTailRest': true;
        'ArrayTailRest[0]': false;
        'ArrayTailRest[1]': false;
        'ArrayTailRest[2]': false;
        'ArrayTailRest[-1]': false;
        'ArrayTailRestIncompatibleHead': false;
        'ArrayTailRestIncompatibleHead[0]': false;
        'ArrayTailRestIncompatibleHead[1]': false;
        'ArrayTailRestIncompatibleHead[2]': false;
        'ArrayTailRestIncompatibleHead[-1]': false;
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
        'OptionalArrayUnknownLength': true;
        'OptionalArrayUnknownLength[0]': false;
        'OptionalArrayUnknownLength[1]': false;
        'OptionalArrayUnknownLength[2]': false;
        'OptionalArrayUnknownLength[-1]': false;
        'OptionalArrayHeadRest': true;
        'OptionalArrayHeadRest[0]': false;
        'OptionalArrayHeadRest[1]': false;
        'OptionalArrayHeadRest[2]': false;
        'OptionalArrayHeadRest[-1]': false;
        'OptionalArrayHeadRestIncompatibleTail': true;
        'OptionalArrayHeadRestIncompatibleTail[0]': false;
        'OptionalArrayHeadRestIncompatibleTail[1]': false;
        'OptionalArrayHeadRestIncompatibleTail[2]': false;
        'OptionalArrayHeadRestIncompatibleTail[-1]': false;
        'OptionalArrayTailRest': true;
        'OptionalArrayTailRest[0]': false;
        'OptionalArrayTailRest[1]': false;
        'OptionalArrayTailRest[2]': false;
        'OptionalArrayTailRest[-1]': false;
        'OptionalArrayTailRestIncompatibleHead': false;
        'OptionalArrayTailRestIncompatibleHead[0]': false;
        'OptionalArrayTailRestIncompatibleHead[1]': false;
        'OptionalArrayTailRestIncompatibleHead[2]': false;
        'OptionalArrayTailRestIncompatibleHead[-1]': false;
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
        'ReadonlyPropertyArrayUnknownLength': true;
        'ReadonlyPropertyArrayUnknownLength[0]': false;
        'ReadonlyPropertyArrayUnknownLength[1]': false;
        'ReadonlyPropertyArrayUnknownLength[2]': false;
        'ReadonlyPropertyArrayUnknownLength[-1]': false;
        'ReadonlyPropertyArrayHeadRest': true;
        'ReadonlyPropertyArrayHeadRest[0]': false;
        'ReadonlyPropertyArrayHeadRest[1]': false;
        'ReadonlyPropertyArrayHeadRest[2]': false;
        'ReadonlyPropertyArrayHeadRest[-1]': false;
        'ReadonlyPropertyArrayHeadRestIncompatibleTail': true;
        'ReadonlyPropertyArrayHeadRestIncompatibleTail[0]': false;
        'ReadonlyPropertyArrayHeadRestIncompatibleTail[1]': false;
        'ReadonlyPropertyArrayHeadRestIncompatibleTail[2]': false;
        'ReadonlyPropertyArrayHeadRestIncompatibleTail[-1]': false;
        'ReadonlyPropertyArrayTailRest': true;
        'ReadonlyPropertyArrayTailRest[0]': false;
        'ReadonlyPropertyArrayTailRest[1]': false;
        'ReadonlyPropertyArrayTailRest[2]': false;
        'ReadonlyPropertyArrayTailRest[-1]': false;
        'ReadonlyPropertyArrayTailRestIncompatibleHead': false;
        'ReadonlyPropertyArrayTailRestIncompatibleHead[0]': false;
        'ReadonlyPropertyArrayTailRestIncompatibleHead[1]': false;
        'ReadonlyPropertyArrayTailRestIncompatibleHead[2]': false;
        'ReadonlyPropertyArrayTailRestIncompatibleHead[-1]': false;
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
      string[],
      'arrayPrepend',
      {
        '': true;
        '[0]': false;
        '[1]': false;
        '[2]': false;
        '[-1]': false;
      }
    >;

    type TestArrDocResult = AssertTests<TestArrDoc>;
    expectTypeOf<TestArrDocResult>().toEqualTypeOf<true>();
  });

  describe('arrayInsert', function () {
    it('should only accept paths to array to which you may push element at the given index', function () {
      type Test = TestPaths<
        TestDoc,
        'arrayInsert',
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
        string[],
        'arrayInsert',
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
  });

  describe('arrayAddUnique', function () {
    it('should only accept paths to array to which you can append an element', function () {
      type Test = TestPaths<
        TestDoc,
        'arrayAddUnique',
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
          'ArrayUnknownLength': true;
          'ArrayUnknownLength[0]': false;
          'ArrayUnknownLength[1]': false;
          'ArrayUnknownLength[2]': false;
          'ArrayUnknownLength[-1]': false;
          'ArrayHeadRest': true;
          'ArrayHeadRest[0]': false;
          'ArrayHeadRest[1]': false;
          'ArrayHeadRest[2]': false;
          'ArrayHeadRest[-1]': false;
          'ArrayHeadRestIncompatibleTail': false;
          'ArrayHeadRestIncompatibleTail[0]': false;
          'ArrayHeadRestIncompatibleTail[1]': false;
          'ArrayHeadRestIncompatibleTail[2]': false;
          'ArrayHeadRestIncompatibleTail[-1]': false;
          'ArrayTailRest': true;
          'ArrayTailRest[0]': false;
          'ArrayTailRest[1]': false;
          'ArrayTailRest[2]': false;
          'ArrayTailRest[-1]': false;
          'ArrayTailRestIncompatibleHead': true;
          'ArrayTailRestIncompatibleHead[0]': false;
          'ArrayTailRestIncompatibleHead[1]': false;
          'ArrayTailRestIncompatibleHead[2]': false;
          'ArrayTailRestIncompatibleHead[-1]': false;
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
          'OptionalArrayUnknownLength': true;
          'OptionalArrayUnknownLength[0]': false;
          'OptionalArrayUnknownLength[1]': false;
          'OptionalArrayUnknownLength[2]': false;
          'OptionalArrayUnknownLength[-1]': false;
          'OptionalArrayHeadRest': true;
          'OptionalArrayHeadRest[0]': false;
          'OptionalArrayHeadRest[1]': false;
          'OptionalArrayHeadRest[2]': false;
          'OptionalArrayHeadRest[-1]': false;
          'OptionalArrayHeadRestIncompatibleTail': false;
          'OptionalArrayHeadRestIncompatibleTail[0]': false;
          'OptionalArrayHeadRestIncompatibleTail[1]': false;
          'OptionalArrayHeadRestIncompatibleTail[2]': false;
          'OptionalArrayHeadRestIncompatibleTail[-1]': false;
          'OptionalArrayTailRest': true;
          'OptionalArrayTailRest[0]': false;
          'OptionalArrayTailRest[1]': false;
          'OptionalArrayTailRest[2]': false;
          'OptionalArrayTailRest[-1]': false;
          'OptionalArrayTailRestIncompatibleHead': true;
          'OptionalArrayTailRestIncompatibleHead[0]': false;
          'OptionalArrayTailRestIncompatibleHead[1]': false;
          'OptionalArrayTailRestIncompatibleHead[2]': false;
          'OptionalArrayTailRestIncompatibleHead[-1]': false;
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
          'ReadonlyPropertyArrayUnknownLength': true;
          'ReadonlyPropertyArrayUnknownLength[0]': false;
          'ReadonlyPropertyArrayUnknownLength[1]': false;
          'ReadonlyPropertyArrayUnknownLength[2]': false;
          'ReadonlyPropertyArrayUnknownLength[-1]': false;
          'ReadonlyPropertyArrayHeadRest': true;
          'ReadonlyPropertyArrayHeadRest[0]': false;
          'ReadonlyPropertyArrayHeadRest[1]': false;
          'ReadonlyPropertyArrayHeadRest[2]': false;
          'ReadonlyPropertyArrayHeadRest[-1]': false;
          'ReadonlyPropertyArrayHeadRestIncompatibleTail': false;
          'ReadonlyPropertyArrayHeadRestIncompatibleTail[0]': false;
          'ReadonlyPropertyArrayHeadRestIncompatibleTail[1]': false;
          'ReadonlyPropertyArrayHeadRestIncompatibleTail[2]': false;
          'ReadonlyPropertyArrayHeadRestIncompatibleTail[-1]': false;
          'ReadonlyPropertyArrayTailRest': true;
          'ReadonlyPropertyArrayTailRest[0]': false;
          'ReadonlyPropertyArrayTailRest[1]': false;
          'ReadonlyPropertyArrayTailRest[2]': false;
          'ReadonlyPropertyArrayTailRest[-1]': false;
          'ReadonlyPropertyArrayTailRestIncompatibleHead': true;
          'ReadonlyPropertyArrayTailRestIncompatibleHead[0]': false;
          'ReadonlyPropertyArrayTailRestIncompatibleHead[1]': false;
          'ReadonlyPropertyArrayTailRestIncompatibleHead[2]': false;
          'ReadonlyPropertyArrayTailRestIncompatibleHead[-1]': false;
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
        string[],
        'arrayAddUnique',
        {
          '': true;
          '[0]': false;
          '[1]': false;
          '[2]': false;
          '[-1]': false;
        }
      >;

      type TestArrDocResult = AssertTests<TestArrDoc>;
      expectTypeOf<TestArrDocResult>().toEqualTypeOf<true>();
    });
  });

  describe('increment', function () {
    it('should allow to increment a path to a non-readonly target assignable to number', function () {
      type Test = TestPaths<
        TestDoc,
        'increment',
        {
          '': false;
          'String': false;
          'Number': true;
          'NonMatchingTuple': false;
          'NonMatchingTuple[0]': true;
          'NonMatchingTuple[1]': false;
          'NonMatchingTuple[2]': false;
          'NonMatchingTuple[-1]': false;
          'ArrayKnownLength': false;
          'ArrayKnownLength[0]': true;
          'ArrayKnownLength[1]': true;
          'ArrayKnownLength[2]': false;
          'ArrayKnownLength[-1]': true;
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
          'ArrayHeadRestIncompatibleTail[0]': false;
          'ArrayHeadRestIncompatibleTail[1]': false;
          'ArrayHeadRestIncompatibleTail[2]': false;
          'ArrayHeadRestIncompatibleTail[-1]': true;
          'ArrayTailRest': false;
          'ArrayTailRest[0]': true;
          'ArrayTailRest[1]': true;
          'ArrayTailRest[2]': true;
          'ArrayTailRest[-1]': true;
          'ArrayTailRestIncompatibleHead': false;
          'ArrayTailRestIncompatibleHead[0]': true;
          'ArrayTailRestIncompatibleHead[1]': false;
          'ArrayTailRestIncompatibleHead[2]': false;
          'ArrayTailRestIncompatibleHead[-1]': true;
          'OptionalString': false;
          'OptionalNumber': true;
          'OptionalNonMatchingTuple': false;
          'OptionalNonMatchingTuple[0]': true;
          'OptionalNonMatchingTuple[1]': false;
          'OptionalNonMatchingTuple[2]': false;
          'OptionalNonMatchingTuple[-1]': false;
          'OptionalArrayKnownLength': false;
          'OptionalArrayKnownLength[0]': true;
          'OptionalArrayKnownLength[1]': true;
          'OptionalArrayKnownLength[2]': false;
          'OptionalArrayKnownLength[-1]': true;
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
          'OptionalArrayHeadRestIncompatibleTail[0]': false;
          'OptionalArrayHeadRestIncompatibleTail[1]': false;
          'OptionalArrayHeadRestIncompatibleTail[2]': false;
          'OptionalArrayHeadRestIncompatibleTail[-1]': true;
          'OptionalArrayTailRest': false;
          'OptionalArrayTailRest[0]': true;
          'OptionalArrayTailRest[1]': true;
          'OptionalArrayTailRest[2]': true;
          'OptionalArrayTailRest[-1]': true;
          'OptionalArrayTailRestIncompatibleHead': false;
          'OptionalArrayTailRestIncompatibleHead[0]': true;
          'OptionalArrayTailRestIncompatibleHead[1]': false;
          'OptionalArrayTailRestIncompatibleHead[2]': false;
          'OptionalArrayTailRestIncompatibleHead[-1]': true;
          'ReadonlyPropertyString': false;
          'ReadonlyPropertyNumber': false;
          'ReadonlyPropertyNonMatchingTuple': false;
          'ReadonlyPropertyNonMatchingTuple[0]': true;
          'ReadonlyPropertyNonMatchingTuple[1]': false;
          'ReadonlyPropertyNonMatchingTuple[2]': false;
          'ReadonlyPropertyNonMatchingTuple[-1]': false;
          'ReadonlyPropertyArrayKnownLength': false;
          'ReadonlyPropertyArrayKnownLength[0]': true;
          'ReadonlyPropertyArrayKnownLength[1]': true;
          'ReadonlyPropertyArrayKnownLength[2]': false;
          'ReadonlyPropertyArrayKnownLength[-1]': true;
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
          'ReadonlyPropertyArrayHeadRestIncompatibleTail[0]': false;
          'ReadonlyPropertyArrayHeadRestIncompatibleTail[1]': false;
          'ReadonlyPropertyArrayHeadRestIncompatibleTail[2]': false;
          'ReadonlyPropertyArrayHeadRestIncompatibleTail[-1]': true;
          'ReadonlyPropertyArrayTailRest': false;
          'ReadonlyPropertyArrayTailRest[0]': true;
          'ReadonlyPropertyArrayTailRest[1]': true;
          'ReadonlyPropertyArrayTailRest[2]': true;
          'ReadonlyPropertyArrayTailRest[-1]': true;
          'ReadonlyPropertyArrayTailRestIncompatibleHead': false;
          'ReadonlyPropertyArrayTailRestIncompatibleHead[0]': true;
          'ReadonlyPropertyArrayTailRestIncompatibleHead[1]': false;
          'ReadonlyPropertyArrayTailRestIncompatibleHead[2]': false;
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
    });
  });

  describe('decrement', function () {
    it('should allow to decrement a path to a non-readonly target assignable to number', function () {
      type Test = TestPaths<
        TestDoc,
        'decrement',
        {
          '': false;
          'String': false;
          'Number': true;
          'NonMatchingTuple': false;
          'NonMatchingTuple[0]': true;
          'NonMatchingTuple[1]': false;
          'NonMatchingTuple[2]': false;
          'NonMatchingTuple[-1]': false;
          'ArrayKnownLength': false;
          'ArrayKnownLength[0]': true;
          'ArrayKnownLength[1]': true;
          'ArrayKnownLength[2]': false;
          'ArrayKnownLength[-1]': true;
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
          'ArrayHeadRestIncompatibleTail[0]': false;
          'ArrayHeadRestIncompatibleTail[1]': false;
          'ArrayHeadRestIncompatibleTail[2]': false;
          'ArrayHeadRestIncompatibleTail[-1]': true;
          'ArrayTailRest': false;
          'ArrayTailRest[0]': true;
          'ArrayTailRest[1]': true;
          'ArrayTailRest[2]': true;
          'ArrayTailRest[-1]': true;
          'ArrayTailRestIncompatibleHead': false;
          'ArrayTailRestIncompatibleHead[0]': true;
          'ArrayTailRestIncompatibleHead[1]': false;
          'ArrayTailRestIncompatibleHead[2]': false;
          'ArrayTailRestIncompatibleHead[-1]': true;
          'OptionalString': false;
          'OptionalNumber': true;
          'OptionalNonMatchingTuple': false;
          'OptionalNonMatchingTuple[0]': true;
          'OptionalNonMatchingTuple[1]': false;
          'OptionalNonMatchingTuple[2]': false;
          'OptionalNonMatchingTuple[-1]': false;
          'OptionalArrayKnownLength': false;
          'OptionalArrayKnownLength[0]': true;
          'OptionalArrayKnownLength[1]': true;
          'OptionalArrayKnownLength[2]': false;
          'OptionalArrayKnownLength[-1]': true;
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
          'OptionalArrayHeadRestIncompatibleTail[0]': false;
          'OptionalArrayHeadRestIncompatibleTail[1]': false;
          'OptionalArrayHeadRestIncompatibleTail[2]': false;
          'OptionalArrayHeadRestIncompatibleTail[-1]': true;
          'OptionalArrayTailRest': false;
          'OptionalArrayTailRest[0]': true;
          'OptionalArrayTailRest[1]': true;
          'OptionalArrayTailRest[2]': true;
          'OptionalArrayTailRest[-1]': true;
          'OptionalArrayTailRestIncompatibleHead': false;
          'OptionalArrayTailRestIncompatibleHead[0]': true;
          'OptionalArrayTailRestIncompatibleHead[1]': false;
          'OptionalArrayTailRestIncompatibleHead[2]': false;
          'OptionalArrayTailRestIncompatibleHead[-1]': true;
          'ReadonlyPropertyString': false;
          'ReadonlyPropertyNumber': false;
          'ReadonlyPropertyNonMatchingTuple': false;
          'ReadonlyPropertyNonMatchingTuple[0]': true;
          'ReadonlyPropertyNonMatchingTuple[1]': false;
          'ReadonlyPropertyNonMatchingTuple[2]': false;
          'ReadonlyPropertyNonMatchingTuple[-1]': false;
          'ReadonlyPropertyArrayKnownLength': false;
          'ReadonlyPropertyArrayKnownLength[0]': true;
          'ReadonlyPropertyArrayKnownLength[1]': true;
          'ReadonlyPropertyArrayKnownLength[2]': false;
          'ReadonlyPropertyArrayKnownLength[-1]': true;
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
          'ReadonlyPropertyArrayHeadRestIncompatibleTail[0]': false;
          'ReadonlyPropertyArrayHeadRestIncompatibleTail[1]': false;
          'ReadonlyPropertyArrayHeadRestIncompatibleTail[2]': false;
          'ReadonlyPropertyArrayHeadRestIncompatibleTail[-1]': true;
          'ReadonlyPropertyArrayTailRest': false;
          'ReadonlyPropertyArrayTailRest[0]': true;
          'ReadonlyPropertyArrayTailRest[1]': true;
          'ReadonlyPropertyArrayTailRest[2]': true;
          'ReadonlyPropertyArrayTailRest[-1]': true;
          'ReadonlyPropertyArrayTailRestIncompatibleHead': false;
          'ReadonlyPropertyArrayTailRestIncompatibleHead[0]': true;
          'ReadonlyPropertyArrayTailRestIncompatibleHead[1]': false;
          'ReadonlyPropertyArrayTailRestIncompatibleHead[2]': false;
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
    });
  });
});
