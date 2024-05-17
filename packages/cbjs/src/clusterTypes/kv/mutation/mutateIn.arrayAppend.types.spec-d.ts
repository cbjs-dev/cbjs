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

import type { MutateInArrayAppendPath } from './mutationOperations.types.js';

describe('mutateIn arrayAppend', async () => {
  type TestDoc = TestDocRequiredProperties &
    BuildOptionalProperties<TestDocRequiredProperties> &
    BuildReadonlyProperties<TestDocRequiredProperties> &
    BuildReadonlyArrayProperties<TestDocRequiredProperties>;

  type TestPaths<Doc extends object, T extends Record<MakeTestPaths<Doc>, boolean>> = {
    [Path in keyof T]: [
      T[Path],
      Path extends MutateInArrayAppendPath<Doc> ? true : false,
    ];
  };

  it('should only accept paths to array to which you can append an element', () => {
    type Test = TestPaths<
      TestDoc,
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
