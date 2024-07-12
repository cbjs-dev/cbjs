/*
 * Copyright (c) 2023-Present Jonathan MASSUCHETTI.
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
import { describe } from 'vitest';

import { getQueryIndexRemainingMutations } from '@cbjsdev/http-client';
import { waitFor } from '@cbjsdev/shared';
import { createCouchbaseTest, getRandomId } from '@cbjsdev/vitest';

describe('getQueryIndexRemainingMutations', async () => {
  const test = await createCouchbaseTest();

  test(
    'wait for the index to have no remaining mutations',
    { timeout: 25_000, repeats: 2 },
    async ({ expect, serverTestContext, apiConfig }) => {
      const indexName = getRandomId();

      // We wait for the bucket to be visible by the indexer
      await waitFor(() =>
        serverTestContext.collection
          .queryIndexes()
          .createIndex(indexName, ['createdAt', 'name'])
      );

      // We have to generate a large amount of documents in order to make sure the stats
      // are updated before all documents are absorbed.
      const docsInsertion = Promise.all(
        Array(150000)
          .fill(null)
          .map((_, i) =>
            serverTestContext.collection.insert(
              `indexMe_${getRandomId()}${getRandomId()}`,
              {
                name: Math.random().toString(16),
                createdAt: Date.now(),
              }
            )
          )
      );

      await waitFor(async () => {
        const result = await getQueryIndexRemainingMutations(
          apiConfig,
          indexName,
          serverTestContext.getKeyspace()
        );

        expect(result).toBeGreaterThan(0);
      });

      await docsInsertion;

      await waitFor(async () => {
        const result = await getQueryIndexRemainingMutations(
          apiConfig,
          indexName,
          serverTestContext.getKeyspace()
        );

        expect(result).toEqual(0);
      });
    }
  );
});
