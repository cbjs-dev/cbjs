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

import { AnyCollection, DocDef } from '../../../clusterTypes/index.js';
import { Collection } from '../../../collection.js';
import { connect } from '../../../couchbase.js';
import { LookupInSpec } from '../../../sdspecs.js';
import { ChainableLookupIn } from './ChainableLookupIn.js';

describe('ChainableLookupIn', function () {
  it('should return all the specs, in order, when the getter is called', function ({
    expect,
  }) {
    const collection: AnyCollection = true as any;
    const specs = ChainableLookupIn.for(collection, 'lookupIn', 'book::001', {})
      .get('title')
      .count('metadata.tags')
      .exists('title')
      .getSpecs();

    expect(specs).toStrictEqual([
      LookupInSpec.get('title'),
      LookupInSpec.count('metadata.tags'),
      LookupInSpec.exists('title'),
    ]);
  });

  it('should be able to store the instance in a variable and add add more spec later', function ({
    expect,
  }) {
    const collection: AnyCollection = true as any;
    const chainableLookup = ChainableLookupIn.for(collection, 'lookupIn', 'book::001', {})
      .get('title')
      .count('metadata.tags');

    void chainableLookup.exists('title');

    expect(chainableLookup.getSpecs()).toStrictEqual([
      LookupInSpec.get('title'),
      LookupInSpec.count('metadata.tags'),
      LookupInSpec.exists('title'),
    ]);
  });

  it.skip('should pick the correct DocDef based on the matching key', ({ expect }) => {
    type BookDocDef = DocDef<`book::${string}`, { title: string }>;
    type UserClusterTypes = {
      store: {
        library: {
          books: [BookDocDef];
        };
      };
    };

    const collection: Collection<UserClusterTypes, 'store', 'library', 'books'> =
      true as any;

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
});
