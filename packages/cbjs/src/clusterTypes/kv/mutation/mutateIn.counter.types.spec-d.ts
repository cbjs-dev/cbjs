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
  MakeTestPaths,
  TestDocRequiredProperties,
} from '@cbjsdev/shared';

import { DocDef } from '../../clusterTypes.js';
import type { MutateInBinaryPath } from './mutationOperations.types.js';

describe('mutateIn counter', async () => {
  type TestDoc = TestDocRequiredProperties &
    BuildOptionalProperties<TestDocRequiredProperties> &
    BuildReadonlyProperties<TestDocRequiredProperties> &
    BuildReadonlyArrayProperties<TestDocRequiredProperties>;

  type TestDocDef = DocDef<string, TestDoc>;

  type TestPaths<
    Def extends AnyDocDef,
    T extends Record<MakeTestPaths<Def['Body']>, boolean>,
    ActualPath = MutateInBinaryPath<NonNullable<unknown>, Def>,
  > = {
    [Path in keyof T]: [T[Path], Path extends ActualPath ? true : false];
  };

  describe('increment', () => {
    it('should allow to increment a path to a non-readonly target assignable to number', () => {
      type Test = TestPaths<
        TestDocDef,
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
          'OptionalArrayTailRestIncompatibleHead[1]': false;
          'OptionalArrayTailRestIncompatibleHead[2]': false;
          'OptionalArrayTailRestIncompatibleHead[-1]': true;
          'ReadonlyPropertyString': false;
          'ReadonlyPropertyNumber': true;
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
          'ReadonlyPropertyArrayTailRestIncompatibleHead[1]': false;
          'ReadonlyPropertyArrayTailRestIncompatibleHead[2]': false;
          'ReadonlyPropertyArrayTailRestIncompatibleHead[-1]': true;
          'ReadonlyNonMatchingTuple': false;
          'ReadonlyNonMatchingTuple[0]': true;
          'ReadonlyNonMatchingTuple[1]': false;
          'ReadonlyNonMatchingTuple[2]': false;
          'ReadonlyNonMatchingTuple[-1]': false;
          'ReadonlyArrayKnownLength': false;
          'ReadonlyArrayKnownLength[0]': true;
          'ReadonlyArrayKnownLength[1]': true;
          'ReadonlyArrayKnownLength[2]': false;
          'ReadonlyArrayKnownLength[-1]': true;
          'ReadonlyArrayUnknownLength': false;
          'ReadonlyArrayUnknownLength[0]': true;
          'ReadonlyArrayUnknownLength[1]': true;
          'ReadonlyArrayUnknownLength[2]': true;
          'ReadonlyArrayUnknownLength[-1]': true;
          'ReadonlyArrayHeadRest': false;
          'ReadonlyArrayHeadRest[0]': true;
          'ReadonlyArrayHeadRest[1]': true;
          'ReadonlyArrayHeadRest[2]': true;
          'ReadonlyArrayHeadRest[-1]': true;
          'ReadonlyArrayHeadRestIncompatibleTail': false;
          'ReadonlyArrayHeadRestIncompatibleTail[0]': true;
          'ReadonlyArrayHeadRestIncompatibleTail[1]': true;
          'ReadonlyArrayHeadRestIncompatibleTail[2]': true;
          'ReadonlyArrayHeadRestIncompatibleTail[-1]': true;
          'ReadonlyArrayTailRest': false;
          'ReadonlyArrayTailRest[0]': true;
          'ReadonlyArrayTailRest[1]': true;
          'ReadonlyArrayTailRest[2]': true;
          'ReadonlyArrayTailRest[-1]': true;
          'ReadonlyArrayTailRestIncompatibleHead': false;
          'ReadonlyArrayTailRestIncompatibleHead[0]': true;
          'ReadonlyArrayTailRestIncompatibleHead[1]': false;
          'ReadonlyArrayTailRestIncompatibleHead[2]': false;
          'ReadonlyArrayTailRestIncompatibleHead[-1]': true;
        }
      >;

      type TestResult = AssertTests<Test>;
      expectTypeOf<TestResult>().toEqualTypeOf<true>();
    });
  });
});
