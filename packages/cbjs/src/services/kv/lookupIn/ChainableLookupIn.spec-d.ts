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
import { describe, expectTypeOf, it } from 'vitest';

import { DocDef } from '../../../clusterTypes/index.js';
import { Collection } from '../../../collection.js';
import { ChainableLookupIn } from './ChainableLookupIn.js';

describe('ChainableLookupIn', function () {
  type BookDocDef = DocDef<
    `book::${string}`,
    { title: string; metadata?: { tags: string[] } }
  >;
  type UserClusterTypes = {
    store: {
      library: {
        books: [BookDocDef];
      };
    };
  };

  const collection: Collection<UserClusterTypes, 'store', 'library', 'books'> =
    true as any;

  it('should pick the correct DocDef based on the matching key', () => {
    expectTypeOf(
      ChainableLookupIn.for(collection, 'lookupIn', 'book::001', {})
    ).toEqualTypeOf<
      ChainableLookupIn<
        Collection<UserClusterTypes, 'store', 'library', 'books'>,
        'lookupIn',
        `book::001`,
        [],
        boolean,
        BookDocDef
      >
    >();
  });

  it('should match string template path', () => {
    expectTypeOf(
      ChainableLookupIn.for(collection, 'lookupIn', 'book::001', {})
    ).toEqualTypeOf<
      ChainableLookupIn<
        Collection<UserClusterTypes, 'store', 'library', 'books'>,
        'lookupIn',
        `book::001`,
        [],
        boolean,
        BookDocDef
      >
    >();
  });

  it('should have .values() return type to match the specs results', async () => {
    const resultLookupIn = await ChainableLookupIn.for(
      collection,
      'lookupIn',
      'book::001',
      {}
    )
      .get('title')
      .count('metadata.tags')
      .exists('title')
      .values();

    expectTypeOf(resultLookupIn).toEqualTypeOf<
      [string | undefined, number | undefined, boolean | undefined]
    >();

    const resultLookupInTOSE = await ChainableLookupIn.for(
      collection,
      'lookupIn',
      'book::001',
      {
        throwOnSpecError: true,
      }
    )
      .get('title')
      .count('metadata.tags')
      .exists('title')
      .values();

    expectTypeOf(resultLookupInTOSE).toEqualTypeOf<[string, number, boolean]>();

    const resultLookupInAnyReplica = await ChainableLookupIn.for(
      collection,
      'lookupInAnyReplica',
      'book::001',
      {}
    )
      .get('title')
      .count('metadata.tags')
      .exists('title')
      .values();

    expectTypeOf(resultLookupInAnyReplica).toEqualTypeOf<
      [string | undefined, number | undefined, boolean | undefined]
    >();

    const resultLookupInAnyReplicaTOSE = await ChainableLookupIn.for(
      collection,
      'lookupInAnyReplica',
      'book::001',
      {
        throwOnSpecError: true,
      }
    )
      .get('title')
      .count('metadata.tags')
      .exists('title')
      .values();

    expectTypeOf(resultLookupInAnyReplicaTOSE).toEqualTypeOf<[string, number, boolean]>();

    const resultLookupInAllReplicas = await ChainableLookupIn.for(
      collection,
      'lookupInAllReplicas',
      'book::001',
      {}
    )
      .get('title')
      .count('metadata.tags')
      .exists('title')
      .values();

    expectTypeOf(resultLookupInAllReplicas).toEqualTypeOf<
      [string | undefined, number | undefined, boolean | undefined][]
    >();

    const resultLookupInAllReplicasTOSE = await ChainableLookupIn.for(
      collection,
      'lookupInAllReplicas',
      'book::001',
      { throwOnSpecError: true }
    )
      .get('title')
      .count('metadata.tags')
      .exists('title')
      .values();

    expectTypeOf(resultLookupInAllReplicasTOSE).toEqualTypeOf<
      [string, number, boolean][]
    >();
  });
});
