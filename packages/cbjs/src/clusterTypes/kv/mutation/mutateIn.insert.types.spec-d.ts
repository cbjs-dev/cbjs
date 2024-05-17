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
  ClusterTypes,
  DocDef,
  MakeTestPaths,
  SubDocument,
  TestDocRequiredProperties,
  ValidatePathToOptionalProperty,
} from '@cbjsdev/shared';

import { connect } from '../../../couchbase.js';
import type {
  MutateInInsertFunction,
  MutateInInsertPath,
  ValidateMutateInInsertPath,
} from './mutationOperations.types.js';

describe('mutateIn insert', async () => {
  type TestDoc = TestDocRequiredProperties &
    BuildOptionalProperties<TestDocRequiredProperties> &
    BuildReadonlyProperties<TestDocRequiredProperties> &
    BuildReadonlyArrayProperties<TestDocRequiredProperties>;

  type TestPaths<Doc extends object, T extends Record<MakeTestPaths<Doc>, boolean>> = {
    [Path in keyof T]: [T[Path], Path extends MutateInInsertPath<Doc> ? true : false];
  };

  it('should only accept insertable paths with the appropriate value', () => {
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

  it('should accept insertable paths of objects', async () => {
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

    type UserClusterTypes = ClusterTypes<{
      test: {
        _default: {
          _default: [DocDef<MonumentId, Monument>];
        };
      };
    }>;

    const cluster = await connect<UserClusterTypes>('...');
    const collection = cluster.bucket('test').defaultCollection();

    void collection
      .mutateIn('monument::001')
      // @ts-expect-error invalid path - cannot insert a required property
      .insert('visitors')
      // @ts-expect-error invalid path - the property does not exist
      .insert('visitors.visitor::001.missingProperty')
      // @ts-expect-error invalid path - cannot insert a required property within a record
      .insert('visitors.visitor::001.enteredAt', 1)
      // @ts-expect-error invalid path - cannot insert a required property within an array
      .insert('historicalReferences.persons[0].name', 'John')
      // @ts-expect-error invalid path - cannot insert a required property within a dictionary
      .insert('openings.periods', {
        summer: { openAt: '09:00', closeAt: '17:00' },
        winter: { openAt: '09:00', closeAt: '17:00' },
      })

      .insert('openings', {
        periods: {
          default: { openAt: '09:00', closeAt: '17:00' },
        },
      })

      .insert('openings.periods.summer', {
        openAt: '09:00',
        closeAt: '17:00',
      })
      .insert('visitors.visitor::001', { enteredAt: 1 })
      .insert('visitors.visitor::001.leftAt', 1)
      .insert('historicalReferences.persons[0].surname', 'The Dude');
  });
});
