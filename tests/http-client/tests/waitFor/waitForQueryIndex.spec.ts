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

import { getQueryIndexes, waitForQueryIndex } from '@cbjs/http-client';
import { sleep } from '@cbjs/shared';
import { createCouchbaseTest, getRandomId } from '@cbjs/vitest';

describe('waitForQueryIndex', async () => {
  const test = await createCouchbaseTest();

  test('fails to wait for a missing index', async ({
    expect,
    serverTestContext,
    apiConfig,
  }) => {
    await expect(
      waitForQueryIndex(
        apiConfig,
        'missingIndex',
        {
          bucket: serverTestContext.bucket.name,
          scope: serverTestContext.scope.name,
          collection: serverTestContext.collection.name,
        },
        { timeout: 1000, delay: 200 }
      )
    ).rejects.toThrowError();
  });

  test(
    'wait for the index to be created',
    async ({ expect, serverTestContext, apiConfig }) => {
      const indexName = getRandomId();

      // Wait for bucket to be visible by the query service
      await sleep(200);

      await serverTestContext.collection.queryIndexes().createIndex(indexName, ['name']);

      await expect(
        waitForQueryIndex(
          apiConfig,
          indexName,
          {
            bucket: serverTestContext.bucket.name,
            scope: serverTestContext.scope.name,
            collection: serverTestContext.collection.name,
          },
          { awaitMutations: false, timeout: 14_000 }
        )
      ).resolves.toBeUndefined();
    },
    { timeout: 15_000 }
  );

  test(
    'wait for the index to have no mutations pending',
    async ({ expect, serverTestContext, apiConfig }) => {
      const indexName = getRandomId();

      await Promise.all(
        Array(100)
          .fill(null)
          .map((_, i) =>
            serverTestContext.collection.insert(`indexMe_${i}`, {
              name: 'test',
            })
          )
      );

      await serverTestContext.collection.queryIndexes().createIndex(indexName, ['name']);

      await expect(
        waitForQueryIndex(
          apiConfig,
          indexName,
          {
            bucket: serverTestContext.bucket.name,
            scope: serverTestContext.scope.name,
            collection: serverTestContext.collection.name,
          },
          { timeout: 14_000 }
        )
      ).resolves.toBeUndefined();
    },
    { timeout: 15_000 }
  );
});
