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

import { ClusterTypes, DocDef } from '@cbjsdev/shared';

import { CollectionContainingDocDef } from '../../../clusterTypes/clusterTypes';
import { MutateInSpec } from '../../../sdspecs';
import { ChainableMutateIn } from './ChainableMutateIn';

type BookId = `book::${number}`;
type Book = {
  title: string;
  description?: string;
  authors: string[];
  metadata: {
    tags: string[];
  };
};

type UserClusterTypes = ClusterTypes<{
  store: {
    library: {
      books: [DocDef<BookId, Book>];
    };
  };
}>;

describe('ChainableMutateIn', function () {
  it('should return all the specs, in order, when the getter is called', function ({
    expect,
  }) {
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
});
