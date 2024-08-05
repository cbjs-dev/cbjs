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
import { describe, it } from 'vitest';

import { DocDef } from '@cbjsdev/shared';

import { CollectionContainingDocDef } from '../../../clusterTypes/clusterTypes.js';
import { MutateInSpec } from '../../../sdspecs.js';
import { ChainableMutateIn } from './ChainableMutateIn.js';

type BookId = `book::${number}`;
type Book = {
  title: string;
  description?: string;
  authors: string[];
  metadata: {
    tags: string[];
  };
};

type UserId = `user::${number}`;
type User = {
  name: string;
  mood?: string;
  borrowing: Record<
    string,
    {
      borrowedAt: number;
      expectedReturnAt: number;
    }
  >;
};

type UserClusterTypes = {
  store: {
    library: {
      books: [DocDef<BookId, Book>];
      user: [DocDef<UserId, User>];
    };
  };
};

describe('ChainableMutateIn', function () {
  it('should return all the specs, in order, when the getter is called', ({ expect }) => {
    const collection: CollectionContainingDocDef<
      UserClusterTypes,
      DocDef<BookId, Book>
    > = true as any;
    const specs = ChainableMutateIn.for(collection, 'book::001', {})
      .arrayAppend('authors', 'Jonathan')
      .replace('title', 'Hello')
      .getSpecs();

    expect(specs).toStrictEqual([
      MutateInSpec.arrayAppend('authors', 'Jonathan'),
      MutateInSpec.replace('title', 'Hello'),
    ]);
  });

  it('should be able to store the instance in a variable and add add more spec later', ({
    expect,
  }) => {
    const collection: CollectionContainingDocDef<
      UserClusterTypes,
      DocDef<BookId, Book>
    > = true as any;

    const chainableMutate = ChainableMutateIn.for(
      collection,
      'book::001',
      {}
    ).arrayAppend('authors', 'Jonathan');

    void chainableMutate.replace('title', 'Hello');

    expect(chainableMutate.getSpecs()).toStrictEqual([
      MutateInSpec.arrayAppend('authors', 'Jonathan'),
      MutateInSpec.replace('title', 'Hello'),
    ]);
  });

  it('should raise a ts error when a non-array value is given with multi=true', ({
    expect,
  }) => {
    const collection: CollectionContainingDocDef<
      UserClusterTypes,
      DocDef<BookId, Book>
    > = true as any;
    const specs = ChainableMutateIn.for(collection, 'book::001', {})
      .arrayAppend('authors', ['Jonathan'], { multi: true })
      .getSpecs();

    expect(specs).toStrictEqual([
      MutateInSpec.arrayAppend('authors', ['Jonathan'], { multi: true }),
    ]);
  });
});
