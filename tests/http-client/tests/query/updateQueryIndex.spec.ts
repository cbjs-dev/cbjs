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

import { createQueryIndex, updateQueryIndex } from '@cbjsdev/http-client';
import { createCouchbaseTest, getRandomId } from '@cbjsdev/vitest';

// requires a multi-node cluster
describe.skip('updateQueryIndex', { timeout: 80_000 }, async () => {
  const test = await createCouchbaseTest();

  test('update a collection index', async ({ expect, serverTestContext, apiConfig }) => {
    const indexName = `cbjs_${getRandomId()}`;
    const ks = {
      bucket: serverTestContext.bucket.name,
      scope: serverTestContext.scope.name,
      collection: serverTestContext.defaultCollection.name,
    };

    await createQueryIndex(apiConfig, indexName, ks, { keys: ['name'] });

    await expect(
      updateQueryIndex(apiConfig, indexName, ks, {
        action: 'replica_count',
        num_replica: 1,
      })
    ).resolves.toEqual([]);
  });
});
