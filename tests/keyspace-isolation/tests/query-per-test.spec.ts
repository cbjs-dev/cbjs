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
import { beforeAll, describe, it } from 'vitest';

import { MutationState } from '@cbjsdev/cbjs';
import { setKeyspaceIsolation } from '@cbjsdev/vitest';
import { setKeyspaceIsolationIndexes } from '@cbjsdev/vitest';

describe('query per test', { timeout: 20_000 }, () => {
  beforeAll(() => {
    setKeyspaceIsolation('per-test');
    setKeyspaceIsolationIndexes([
      'CREATE INDEX idx_book_count ON store.library.borrowers (user_id, book_count)',
    ]);
  });

  it('should create the indexes of a query', async ({ expect, getCluster }) => {
    const cluster = await getCluster();
    await cluster.query('SELECT * FROM store.library.borrowers');

    const indexes = await cluster
      .bucket('store')
      .scope('library')
      .collection('borrowers')
      .queryIndexes()
      .getAllIndexes();

    const indexExists = indexes.some((i) => i.name === 'idx_book_count');
    expect(indexExists).toBe(true);
  });

  it('should isolate a query', async ({ expect, getCluster }) => {
    const cluster = await getCluster();

    const result = await cluster
      .bucket('store')
      .scope('library')
      .collection('borrowers')
      .insert('testDoc', {
        title: 'test query',
      });

    const { rows } = await cluster.query('SELECT * FROM store.library.borrowers', {
      consistentWith: new MutationState(result.token),
    });

    expect(rows).toHaveLength(1);
  });
});
