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

import { waitForQueryIndex } from '@cbjsdev/http-client';
import { getRandomId, sleep } from '@cbjsdev/shared';
import { createCouchbaseTest } from '@cbjsdev/vitest';

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
    { timeout: 30_000 },
    async ({ expect, serverTestContext, apiConfig, useCollection }) => {
      const indexName = getRandomId();

      // A dedicated collection, because the index service only builds one index
      // at a time per keyspace : a build still running would make the next
      // `createIndex` hang or fail with a transient error.
      const collectionName = await useCollection();
      const collection = serverTestContext.s.collection(collectionName);
      const keyspace = {
        bucket: serverTestContext.bucket.name,
        scope: serverTestContext.scope.name,
        collection: collectionName,
      };

      // Wait for bucket to be visible by the query service
      await sleep(200);

      await collection.queryIndexes().createIndex(indexName, ['name']);

      await expect(
        waitForQueryIndex(apiConfig, indexName, keyspace, {
          awaitMutations: false,
          timeout: 14_000,
        })
      ).resolves.toBeUndefined();
    }
  );

  test(
    'wait for the index to have no remaining mutations',
    { timeout: 60_000, retry: 1 },
    async ({ expect, serverTestContext, apiConfig, useCollection }) => {
      const indexName = getRandomId();

      // See above : the index build must not compete with another one.
      const collectionName = await useCollection();
      const collection = serverTestContext.s.collection(collectionName);
      const keyspace = {
        bucket: serverTestContext.bucket.name,
        scope: serverTestContext.scope.name,
        collection: collectionName,
      };

      await Promise.all(
        Array(300)
          .fill(null)
          .map(() =>
            collection.insert(`indexMe_${getRandomId()}`, {
              name: 'test',
            })
          )
      );

      await collection.queryIndexes().createIndex(indexName, ['name']);

      await expect(
        waitForQueryIndex(apiConfig, indexName, keyspace, { timeout: 55_000 })
      ).resolves.toBeUndefined();
    }
  );
});
