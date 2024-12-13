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

import { getQueryIndexStatus } from '@cbjsdev/http-client';
import { createCouchbaseTest } from '@cbjsdev/vitest';

describe('getQueryIndexStatus', { timeout: 40_000, retry: 2 }, async () => {
  const test = await createCouchbaseTest();

  test('get the status of the query index', async ({
    expect,
    useIndex,
    serverTestContext,
    apiConfig,
  }) => {
    const name = await useIndex({
      bucketName: serverTestContext.bucket.name,
      scopeName: serverTestContext.scope.name,
      collectionName: serverTestContext.collection.name,
      fields: ['name'],
    });

    await expect(
      getQueryIndexStatus(apiConfig, name, {
        bucket: serverTestContext.bucket.name,
        scope: serverTestContext.scope.name,
        collection: serverTestContext.collection.name,
      })
    ).resolves.toEqual(
      expect.objectContaining({
        progress: expect.any(Number),
        bucket: expect.any(String),
        scope: expect.any(String),
        collection: expect.any(String),
      })
    );
  });
});
