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
import { describe, it } from 'vitest';

import { PartialKeyspace } from '@cbjsdev/shared';

import { FoundKeyspace } from '../../parser/N1qlListener.js';
import { replaceKeyspaces } from './query.js';

describe('replaceKeyspaces', () => {
  it('should replace a single keyspace', ({ expect }) => {
    const statement = 'SELECT * FROM store.library.books';
    const queryKeyspaces: FoundKeyspace[] = [
      {
        namespace: undefined,
        keyspaceParts: ['store', 'library', 'books'],
        keyspacePosition: [14, 33],
      },
    ];
    const isolatedKeyspaces: PartialKeyspace[] = [
      {
        bucket: 'isolated_store',
        scope: 'isolated_library',
        collection: 'isolated_books',
      },
    ];

    expect(replaceKeyspaces(statement, queryKeyspaces, isolatedKeyspaces)).toEqual(
      'SELECT * FROM `isolated_store`.`isolated_library`.`isolated_books`'
    );
  });

  it('should replace multiple single keyspaces', ({ expect }) => {
    const statement =
      'SELECT * FROM store.library.books books LEFT JOIN store.library.borrowers borrowers ON books.borrower_id = borrowers.user_id';
    const queryKeyspaces: FoundKeyspace[] = [
      {
        namespace: undefined,
        keyspaceParts: ['store', 'library', 'books'],
        keyspacePosition: [14, 33],
      },
      {
        namespace: undefined,
        keyspaceParts: ['store', 'library', 'borrowers'],
        keyspacePosition: [50, 73],
      },
    ];
    const isolatedKeyspaces: PartialKeyspace[] = [
      {
        bucket: 'isolated_store',
        scope: 'isolated_library',
        collection: 'isolated_books',
      },
      {
        bucket: 'isolated_store',
        scope: 'isolated_library',
        collection: 'isolated_borrowers',
      },
    ];

    expect(replaceKeyspaces(statement, queryKeyspaces, isolatedKeyspaces)).toEqual(
      'SELECT * FROM `isolated_store`.`isolated_library`.`isolated_books` books LEFT JOIN `isolated_store`.`isolated_library`.`isolated_borrowers` borrowers ON books.borrower_id = borrowers.user_id'
    );
  });
});
