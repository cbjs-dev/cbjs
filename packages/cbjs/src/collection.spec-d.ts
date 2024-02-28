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
import { describe, expectTypeOf, it, test } from 'vitest';

import { DocDef } from './clusterTypes';
import { connect } from './couchbase';
import { LookupInResult, LookupInResultEntry, MutateInResult } from './crudoptypes';
import { LookupInSpec, MutateInSpec } from './sdspecs';
import { ChainableLookupIn } from './services/kv/lookupIn/ChainableLookupIn';
import { ChainableMutateIn } from './services/kv/mutateIn/ChainableMutateIn';

type TestDoc = {
  title: string;
  authors: [string, ...string[]];
  sales: number;
  metadata: {
    tags: string[];
  };
};

type UserClusterTypes = {
  test: {
    _default: {
      _default: DocDef<`book::${string}`, TestDoc>;
    };
  };
};

/**
 * Here we test the API types, so essentially the overloads
 * and the return types from a high-level perspective.
 * The tests of the inferred types and done in the clusterTypes directory
 */

describe('Collection', async () => {
  const cluster = await connect<UserClusterTypes>('');
  const collection = cluster.bucket('test').defaultCollection();

  describe('lookupIn', async () => {
    it('should have the correct return type', async () => {
      expectTypeOf(collection.lookupIn('book::001')).toEqualTypeOf<
        ChainableLookupIn<typeof collection, 'lookupIn', 'book::001', []>
      >();

      expectTypeOf(collection.lookupIn('book::001', { timeout: 200 })).toEqualTypeOf<
        ChainableLookupIn<typeof collection, 'lookupIn', 'book::001', []>
      >();

      expectTypeOf(
        collection.lookupIn('book::001', [LookupInSpec.get('title')])
      ).toEqualTypeOf<Promise<LookupInResult<[string]>>>();

      expectTypeOf(
        collection.lookupIn('book::001', [LookupInSpec.get('title')], { timeout: 200 })
      ).toEqualTypeOf<Promise<LookupInResult<[string]>>>();
    });

    it('should narrow the type of the callback arguments', async () => {
      expectTypeOf(
        collection.lookupIn(
          'book::001',
          [LookupInSpec.get('title')],
          { timeout: 200 },
          (err, res) => {
            expectTypeOf(err).toEqualTypeOf<Error | null>();
            expectTypeOf(res).toEqualTypeOf<LookupInResult<[string]> | null>();

            if (err) return;

            expectTypeOf(res).toEqualTypeOf<LookupInResult<[string]>>();
          }
        )
      ).resolves.toEqualTypeOf<LookupInResult<[string]>>();

      expectTypeOf(
        collection.lookupIn('book::001', [LookupInSpec.get('title')], (err, res) => {
          expectTypeOf(err).toEqualTypeOf<Error | null>();
          expectTypeOf(res).toEqualTypeOf<LookupInResult<[string]> | null>();

          if (err) return;

          expectTypeOf(res).toEqualTypeOf<LookupInResult<[string]>>();
        })
      ).resolves.toEqualTypeOf<LookupInResult<[string]>>();
    });

    it('should narrow the type of LookupInResult properties', async () => {
      const { content } = await collection.lookupIn('book::001', [
        LookupInSpec.get('title'),
      ]);
      const [title] = content;
      expectTypeOf(title).toEqualTypeOf<
        LookupInResultEntry<string, null> | LookupInResultEntry<undefined, Error>
      >();

      if (title.error) return;

      expectTypeOf(title.value).toEqualTypeOf<string>();
    });
  });

  test('mutateIn', () => {
    expectTypeOf(collection.mutateIn('book::001')).toEqualTypeOf<
      ChainableMutateIn<typeof collection, 'book::001', []>
    >();

    expectTypeOf(collection.mutateIn('book::001', { timeout: 200 })).toEqualTypeOf<
      ChainableMutateIn<typeof collection, 'book::001', []>
    >();

    expectTypeOf(
      collection.mutateIn('book::001', [
        MutateInSpec.upsert('title', 'Hi'),
        MutateInSpec.increment('sales', 1),
      ])
    ).toEqualTypeOf<Promise<MutateInResult<[undefined, number]>>>();

    expectTypeOf(
      collection.mutateIn(
        'book::001',
        [MutateInSpec.upsert('title', 'Hi'), MutateInSpec.increment('sales', 1)],
        { timeout: 200 }
      )
    ).toEqualTypeOf<Promise<MutateInResult<[undefined, number]>>>();

    expectTypeOf(
      collection.mutateIn(
        'book::001',
        [MutateInSpec.upsert('title', 'Hi'), MutateInSpec.increment('sales', 1)],
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
        [MutateInSpec.upsert('title', 'Hi'), MutateInSpec.increment('sales', 1)],
        (err, res) => {
          expectTypeOf(err).toEqualTypeOf<Error | null>();
          if (err) return;
          expectTypeOf(res).toEqualTypeOf<MutateInResult<[undefined, number]>>();
        }
      )
    ).resolves.toEqualTypeOf<MutateInResult<[undefined, number]>>();

    it('should accept any path and any value when given an array of typeless specs', async function () {
      const cluster = await connect('couchbase://127.0.0.1');
      const collection = cluster.bucket('test').defaultCollection();

      await collection.mutateIn('test__document', [
        MutateInSpec.upsert('what', 'foo'),
        MutateInSpec.arrayInsert('what', 'foo'),
        MutateInSpec.insert('does_not_exists', 'foo'),
        MutateInSpec.remove('does_not_exists'),
        MutateInSpec.replace('does_not_exists', 'bar'),
        MutateInSpec.arrayAppend('does_not_exists', 'bar'),
        MutateInSpec.arrayPrepend('does_not_exists', 'bar'),
        MutateInSpec.arrayInsert('does_not_exists[0]', 'bar'),
        MutateInSpec.arrayAddUnique('does_not_exists[0]', 'bar'),
      ]);
    });
  });
});
