/*
 * Copyright (c) 2023-Present Jonathan MASSUCHETTI <jonathan.massuchetti@dappit.fr>.
 * Copyright (c) 2013-Present Couchbase Inc.
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
import { describe, expectTypeOf, test } from 'vitest';

import { Collection } from './collection';
import { LookupInResult, MutateInResult } from './crudoptypes';
import { LookupInSpec, MutateInSpec } from './sdspecs';
import { ChainableLookupIn } from './services/kv/lookupIn/ChainableLookupIn';
import { ChainableMutateIn } from './services/kv/mutateIn/ChainableMutateIn';

describe('Collection', () => {
  test('lookupIn', () => {
    const collection: Collection = true as any;

    expectTypeOf(collection.lookupIn('book::001')).toEqualTypeOf<
      ChainableLookupIn<typeof collection, 'lookupIn', 'book::001', []>
    >();

    expectTypeOf(collection.lookupIn('book::001', { timeout: 200 })).toEqualTypeOf<
      ChainableLookupIn<typeof collection, 'lookupIn', 'book::001', []>
    >();

    expectTypeOf(
      collection.lookupIn('book::001', [LookupInSpec.get('title')])
    ).toEqualTypeOf<Promise<LookupInResult<[any]>>>();

    expectTypeOf(
      collection.lookupIn('book::001', [LookupInSpec.get('title')], { timeout: 200 })
    ).toEqualTypeOf<Promise<LookupInResult<[any]>>>();

    expectTypeOf(
      collection.lookupIn(
        'book::001',
        [LookupInSpec.get('title')],
        { timeout: 200 },
        (err, res) => {
          expectTypeOf(err).toEqualTypeOf<Error | null>();
          if (err) return;
          expectTypeOf(res).toEqualTypeOf<LookupInResult<[any]>>();
        }
      )
    ).resolves.toEqualTypeOf<LookupInResult<[any]>>();

    expectTypeOf(
      collection.lookupIn('book::001', [LookupInSpec.get('title')], (err, res) => {
        expectTypeOf(err).toEqualTypeOf<Error | null>();
        if (err) return;
        expectTypeOf(res).toEqualTypeOf<LookupInResult<[any]>>();
      })
    ).resolves.toEqualTypeOf<LookupInResult<[any]>>();
  });

  test('mutateIn', () => {
    const collection: Collection = true as any;

    expectTypeOf(collection.mutateIn('book::001')).toEqualTypeOf<
      ChainableMutateIn<typeof collection, 'book::001', []>
    >();

    expectTypeOf(collection.mutateIn('book::001', { timeout: 200 })).toEqualTypeOf<
      ChainableMutateIn<typeof collection, 'book::001', []>
    >();

    expectTypeOf(
      collection.mutateIn('book::001', [
        MutateInSpec.upsert('title', 'Hi'),
        MutateInSpec.increment('sales', 'Hi'),
      ])
    ).toEqualTypeOf<Promise<MutateInResult<[undefined, number]>>>();

    expectTypeOf(
      collection.mutateIn(
        'book::001',
        [MutateInSpec.upsert('title', 'Hi'), MutateInSpec.increment('sales', 'Hi')],
        { timeout: 200 }
      )
    ).toEqualTypeOf<Promise<MutateInResult<[undefined, number]>>>();

    expectTypeOf(
      collection.mutateIn(
        'book::001',
        [MutateInSpec.upsert('title', 'Hi'), MutateInSpec.increment('sales', 'Hi')],
        { timeout: 200 },
        (err, res) => {
          expectTypeOf(err).toEqualTypeOf<Error | null>();
          if (err) return;
          expectTypeOf(res).toEqualTypeOf<MutateInResult<[undefined, number]>>();
        }
      )
    ).resolves.toEqualTypeOf<MutateInResult<[undefined, number]>>();

    expectTypeOf(
      collection.mutateIn(
        'book::001',
        [MutateInSpec.upsert('title', 'Hi'), MutateInSpec.increment('sales', 'Hi')],
        (err, res) => {
          expectTypeOf(err).toEqualTypeOf<Error | null>();
          if (err) return;
          expectTypeOf(res).toEqualTypeOf<MutateInResult<[undefined, number]>>();
        }
      )
    ).resolves.toEqualTypeOf<MutateInResult<[undefined, number]>>();
  });
});
