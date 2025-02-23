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

import { connect } from '../../../couchbase.js';
import { DocDef } from '../../clusterTypes.js';
import type { MutateInReplacePath } from './mutationOperations.types.js';

describe('mutateIn replace', async () => {
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
      Path extends MutateInReplacePath<NonNullable<unknown>, Def> ? true : false,
    ];
  };

  it('should only accept replaceable paths', () => {
    type Test = TestPaths<
      TestDocDef,
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
        'ReadonlyPropertyString': true;
        'ReadonlyPropertyNumber': true;
        'ReadonlyPropertyNonMatchingTuple': true;
        'ReadonlyPropertyNonMatchingTuple[0]': true;
        'ReadonlyPropertyNonMatchingTuple[1]': true;
        'ReadonlyPropertyNonMatchingTuple[2]': false;
        'ReadonlyPropertyNonMatchingTuple[-1]': true;
        'ReadonlyPropertyArrayKnownLength': true;
        'ReadonlyPropertyArrayKnownLength[0]': true;
        'ReadonlyPropertyArrayKnownLength[1]': true;
        'ReadonlyPropertyArrayKnownLength[2]': false;
        'ReadonlyPropertyArrayKnownLength[-1]': true;
        'ReadonlyPropertyArrayUnknownLength': true;
        'ReadonlyPropertyArrayUnknownLength[0]': true;
        'ReadonlyPropertyArrayUnknownLength[1]': true;
        'ReadonlyPropertyArrayUnknownLength[2]': true;
        'ReadonlyPropertyArrayUnknownLength[-1]': true;
        'ReadonlyPropertyArrayHeadRest': true;
        'ReadonlyPropertyArrayHeadRest[0]': true;
        'ReadonlyPropertyArrayHeadRest[1]': true;
        'ReadonlyPropertyArrayHeadRest[2]': true;
        'ReadonlyPropertyArrayHeadRest[-1]': true;
        'ReadonlyPropertyArrayHeadRestIncompatibleTail': true;
        'ReadonlyPropertyArrayHeadRestIncompatibleTail[0]': true;
        'ReadonlyPropertyArrayHeadRestIncompatibleTail[1]': true;
        'ReadonlyPropertyArrayHeadRestIncompatibleTail[2]': true;
        'ReadonlyPropertyArrayHeadRestIncompatibleTail[-1]': true;
        'ReadonlyPropertyArrayTailRest': true;
        'ReadonlyPropertyArrayTailRest[0]': true;
        'ReadonlyPropertyArrayTailRest[1]': true;
        'ReadonlyPropertyArrayTailRest[2]': true;
        'ReadonlyPropertyArrayTailRest[-1]': true;
        'ReadonlyPropertyArrayTailRestIncompatibleHead': true;
        'ReadonlyPropertyArrayTailRestIncompatibleHead[0]': true;
        'ReadonlyPropertyArrayTailRestIncompatibleHead[1]': true;
        'ReadonlyPropertyArrayTailRestIncompatibleHead[2]': true;
        'ReadonlyPropertyArrayTailRestIncompatibleHead[-1]': true;
        'ReadonlyNonMatchingTuple': true;
        'ReadonlyNonMatchingTuple[0]': true;
        'ReadonlyNonMatchingTuple[1]': true;
        'ReadonlyNonMatchingTuple[2]': false;
        'ReadonlyNonMatchingTuple[-1]': true;
        'ReadonlyArrayKnownLength': true;
        'ReadonlyArrayKnownLength[0]': true;
        'ReadonlyArrayKnownLength[1]': true;
        'ReadonlyArrayKnownLength[2]': false;
        'ReadonlyArrayKnownLength[-1]': true;
        'ReadonlyArrayUnknownLength': true;
        'ReadonlyArrayUnknownLength[0]': true;
        'ReadonlyArrayUnknownLength[1]': true;
        'ReadonlyArrayUnknownLength[2]': true;
        'ReadonlyArrayUnknownLength[-1]': true;
        'ReadonlyArrayHeadRest': true;
        'ReadonlyArrayHeadRest[0]': true;
        'ReadonlyArrayHeadRest[1]': true;
        'ReadonlyArrayHeadRest[2]': true;
        'ReadonlyArrayHeadRest[-1]': true;
        'ReadonlyArrayHeadRestIncompatibleTail': true;
        'ReadonlyArrayHeadRestIncompatibleTail[0]': true;
        'ReadonlyArrayHeadRestIncompatibleTail[1]': true;
        'ReadonlyArrayHeadRestIncompatibleTail[2]': true;
        'ReadonlyArrayHeadRestIncompatibleTail[-1]': true;
        'ReadonlyArrayTailRest': true;
        'ReadonlyArrayTailRest[0]': true;
        'ReadonlyArrayTailRest[1]': true;
        'ReadonlyArrayTailRest[2]': true;
        'ReadonlyArrayTailRest[-1]': true;
        'ReadonlyArrayTailRestIncompatibleHead': true;
        'ReadonlyArrayTailRestIncompatibleHead[0]': true;
        'ReadonlyArrayTailRestIncompatibleHead[1]': true;
        'ReadonlyArrayTailRestIncompatibleHead[2]': true;
        'ReadonlyArrayTailRestIncompatibleHead[-1]': true;
      }
    >;

    type TestResult = AssertTests<Test>;
    expectTypeOf<TestResult>().toEqualTypeOf<true>();
  });

  it('should accept replaceable paths of objects', async () => {
    type VisitorId = `visitor::${string}`;
    type MonumentId = `monument::${string}`;

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

    type UserClusterTypes = {
      test: {
        _default: {
          _default: [DocDef<MonumentId, Monument>];
        };
      };
    };

    const cluster = await connect<UserClusterTypes>('...');
    const collection = cluster.bucket('test').defaultCollection();

    void collection
      .mutateIn('monument::001')
      // @ts-expect-error invalid path - the property does not exist
      .replace('visitors.visitor::001.missingProperty', 1)

      .replace('visitors', {})
      .replace('visitors.visitor::001.enteredAt', 1)
      .replace('historicalReferences.persons[0].name', 'John')
      .replace('openings.periods', {
        default: { openAt: '09:00', closeAt: '21:00' },
      })

      .replace('openings', {
        periods: {
          default: { openAt: '09:00', closeAt: '21:00' },
        },
      })
      .replace('openings.periods.summer', { openAt: '09:00', closeAt: '22:00' })
      .replace('visitors.visitor::001', { enteredAt: 1 })
      .replace('visitors.visitor::001.leftAt', 2)
      .replace('historicalReferences.persons[0]', { name: 'John Doe' })
      .replace('historicalReferences.persons[0].surname', 'The Dude');
  });
});
