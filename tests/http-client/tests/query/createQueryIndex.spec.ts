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

import { createQueryIndex } from '@cbjsdev/http-client';
import { createCouchbaseTest, getRandomId } from '@cbjsdev/vitest';

describe('createQueryIndex', { timeout: 40_000 }, async () => {
  const test = await createCouchbaseTest();

  test('create a collection index', async ({ expect, serverTestContext, apiConfig }) => {
    const indexName = `cbjs_${getRandomId()}`;
    const ks = {
      bucket: serverTestContext.bucket.name,
      scope: serverTestContext.scope.name,
      collection: serverTestContext.defaultCollection.name,
    };

    await expect(
      createQueryIndex(apiConfig, indexName, ks, { keys: ['name'] })
    ).resolves.toEqual(
      expect.arrayContaining([
        {
          id: expect.any(String),
          name: indexName,
          state: 'online',
        },
      ])
    );
  });
});
