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

import {
  CollectionContainingDocDef,
  DocDef,
} from '../../../clusterTypes/clusterTypes.js';
import { MutateInUpsertValue } from '../../../clusterTypes/kv/mutation/mutationOperations.types.js';
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
  mood?: 'good' | 'bad';
  metadata: {
    tags: string[];
  };
  borrowing: Record<
    string,
    {
      borrowedAt: number;
      expectedReturnAt: number;
    }
  >;
};

type EventId = `event::${number}`;
type Event = {
  body:
    | {
        type: 'a';
        payload: 'pa';
      }
    | {
        type: 'b';
        payload: 'pb';
      };
};

type UserClusterTypes = {
  store: {
    library: {
      books: [DocDef<BookId, Book>];
      user: [DocDef<UserId, User>];
      events: [DocDef<EventId, Event>];
    };
  };
};

describe('ChainableMutateIn', function () {
  it('should accept any member of a union as a value', ({ expect }) => {
    const collection: CollectionContainingDocDef<
      UserClusterTypes,
      DocDef<EventId, Event>
    > = true as any;

    void ChainableMutateIn.for(collection, 'event::001', {}).upsert('body', {
      type: 'a',
      payload: 'pa',
    });
  });

  it('should raise a ts error when a non-array value is given with multi=true', ({
    expect,
  }) => {
    const collection: CollectionContainingDocDef<
      UserClusterTypes,
      DocDef<BookId, Book>
    > = true as any;

    void ChainableMutateIn.for(collection, 'book::001', {})
      // @ts-expect-error the value MUST be an array
      .arrayAppend('authors', 'Jonathan', { multi: true });
  });

  it('should throw TS error when the path is illegal', () => {
    type Doc = { releases: [string, ...number[]] };
    type CT = {
      store: { library: { books: [DocDef<BookId, Doc>] } };
    };

    const collection: CollectionContainingDocDef<CT, DocDef<BookId, Doc>> = true as any;

    const specs = ChainableMutateIn.for(collection, 'book::001', {})
      // @ts-expect-error cannot insert at this path
      .arrayInsert('releases[0]', 0)
      .getSpecs();
  });
});
