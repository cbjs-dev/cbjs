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
import { CollectionDocDefMatchingKey, DocDef } from '../../clusterTypes.js';
import type { MutateInUpsertPath } from './mutationOperations.types.js';

describe('mutateIn upsert', async () => {
  type TestDoc = TestDocRequiredProperties &
    BuildOptionalProperties<TestDocRequiredProperties> &
    BuildReadonlyProperties<TestDocRequiredProperties> &
    BuildReadonlyArrayProperties<TestDocRequiredProperties>;

  type TestDocDef = DocDef<string, TestDoc>;

  type TestPaths<
    Def extends AnyDocDef,
    T extends Record<MakeTestPaths<Def['Body']>, boolean>,
    ActualPath = MutateInUpsertPath<NonNullable<unknown>, Def>,
  > = {
    [Path in keyof T]: [T[Path], Path extends ActualPath ? true : false];
  };

  it('should only accept upsertable paths', () => {
    type Test = TestPaths<
      TestDocDef,
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
        'ReadonlyPropertyString': true;
        'ReadonlyPropertyNumber': true;
        'ReadonlyPropertyNonMatchingTuple': true;
        'ReadonlyPropertyNonMatchingTuple[0]': false;
        'ReadonlyPropertyNonMatchingTuple[1]': false;
        'ReadonlyPropertyNonMatchingTuple[2]': false;
        'ReadonlyPropertyNonMatchingTuple[-1]': false;
        'ReadonlyPropertyArrayKnownLength': true;
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
        'ReadonlyPropertyArrayTailRestIncompatibleHead': true;
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

    type T = CollectionDocDefMatchingKey<typeof collection, 'monument::001'>;
    //   ^?

    const r = void collection.mutateIn('monument::001');
    //    ^?

    void collection
      .mutateIn('monument::001')
      // @ts-expect-error invalid path - the property does not exist
      .upsert('visitors.visitor::001.missingProperty', 1)

      .upsert('visitors', {})
      .upsert('visitors.visitor::001.enteredAt', 1)
      .upsert('historicalReferences.persons[0].name', 'John')
      .upsert('openings.periods', {
        default: { openAt: '09:00', closeAt: '21:00' },
      })

      .upsert('openings', {
        periods: {
          default: { openAt: '09:00', closeAt: '21:00' },
        },
      })
      .upsert('openings.periods.summer', { openAt: '09:00', closeAt: '22:00' })
      .upsert('visitors.visitor::001', { enteredAt: 1 })
      .upsert('visitors.visitor::001.leftAt', 2)
      // @ts-expect-error invalid path - cannot upsert at an array index
      .upsert('historicalReferences.persons[0]', { name: 'John Doe' })
      .upsert('historicalReferences.persons[0].surname', 'The Dude');
  });
});
