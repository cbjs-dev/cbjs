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

import { getIndexServiceStatus, waitForCollection } from '@cbjsdev/http-client';
import { waitFor } from '@cbjsdev/shared';
import { createCouchbaseTest } from '@cbjsdev/vitest';

describe('getIndexServiceStatus', { timeout: 40_000, retry: 2 }, async () => {
  const test = await createCouchbaseTest();

  test('should return the status of the indexes of the cluster', async ({
    expect,
    useIndex,
    serverTestContext,
    apiConfig,
  }) => {
    await waitForCollection(
      apiConfig,
      serverTestContext.bucket.name,
      serverTestContext.scope.name,
      serverTestContext.collection.name
    );

    const name = await useIndex({
      bucketName: serverTestContext.bucket.name,
      scopeName: serverTestContext.scope.name,
      collectionName: serverTestContext.collection.name,
      fields: ['name'],
    });

    await waitFor(async () => {
      const indexServiceStatus = await getIndexServiceStatus(apiConfig);

      expect(indexServiceStatus.code).toEqual('success');

      const index = indexServiceStatus.status.find((i) => i.name === name);

      expect(index).toEqual(
        expect.objectContaining({
          name,
          bucket: serverTestContext.bucket.name,
          scope: serverTestContext.scope.name,
          collection: serverTestContext.collection.name,
          // Only the index service reports those.
          vectorPos: -1,
          defnId: expect.any(BigInt),
          progress: expect.any(Number),
        })
      );
    });
  });
});
