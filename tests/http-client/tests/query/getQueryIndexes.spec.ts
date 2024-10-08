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

import { getQueryIndexes } from '@cbjsdev/http-client';
import { createCouchbaseTest } from '@cbjsdev/vitest';

describe('getQueryIndexes', { timeout: 40_000, retry: 2 }, async () => {
  const test = await createCouchbaseTest();

  test('cluster level primary index', async ({
    expect,
    usePrimaryIndex,
    serverTestContext,
    apiConfig,
  }) => {
    const name = await usePrimaryIndex({ bucketName: serverTestContext.bucket.name });

    await expect(
      getQueryIndexes(apiConfig, { bucket: serverTestContext.bucket.name })
    ).resolves.toEqual(
      expect.arrayContaining([
        {
          id: expect.any(String),
          name,
          bucketName: serverTestContext.bucket.name,
          isPrimary: true,
          fields: [],
          node: 'http://127.0.0.1:8091',
          numReplicas: 0,
          namespace: 'default',
          state: 'online',
          using: 'gsi',
        },
      ])
    );
  });

  test('cluster level secondary index', async ({
    expect,
    useIndex,
    serverTestContext,
    apiConfig,
  }) => {
    const name = await useIndex({
      bucketName: serverTestContext.bucket.name,
      fields: ['name'],
    });

    await expect(
      getQueryIndexes(apiConfig, { bucket: serverTestContext.bucket.name })
    ).resolves.toEqual(
      expect.arrayContaining([
        {
          id: expect.any(String),
          name,
          bucketName: serverTestContext.bucket.name,
          isPrimary: false,
          fields: ['name'],
          node: 'http://127.0.0.1:8091',
          numReplicas: 0,
          namespace: 'default',
          state: 'online',
          using: 'gsi',
        },
      ])
    );
  });

  test('collection level primary index', async ({
    expect,
    usePrimaryIndex,
    serverTestContext,
    apiConfig,
  }) => {
    const name = await usePrimaryIndex({
      bucketName: serverTestContext.bucket.name,
      scopeName: serverTestContext.scope.name,
      collectionName: serverTestContext.collection.name,
    });

    await expect(
      getQueryIndexes(apiConfig, {
        bucket: serverTestContext.bucket.name,
        scope: serverTestContext.scope.name,
        collection: serverTestContext.collection.name,
      })
    ).resolves.toEqual(
      expect.arrayContaining([
        {
          id: expect.any(String),
          name,
          bucketName: serverTestContext.bucket.name,
          scopeName: serverTestContext.scope.name,
          collectionName: serverTestContext.collection.name,
          isPrimary: true,
          fields: [],
          node: 'http://127.0.0.1:8091',
          numReplicas: 0,
          namespace: 'default',
          state: 'online',
          using: 'gsi',
        },
      ])
    );
  });

  test('collection level secondary index', async ({
    expect,
    useIndex,
    serverTestContext,
    apiConfig,
    useCollection,
  }) => {
    const collectionName = await useCollection();

    const indexName1 = await useIndex({
      bucketName: serverTestContext.bucket.name,
      scopeName: serverTestContext.scope.name,
      collectionName: serverTestContext.collection.name,
      fields: ['name'],
    });

    const indexName2 = await useIndex({
      bucketName: serverTestContext.bucket.name,
      scopeName: serverTestContext.scope.name,
      collectionName,
      fields: ['name'],
    });

    // Get the indexes on a single collection
    await expect(
      getQueryIndexes(apiConfig, {
        bucket: serverTestContext.bucket.name,
        scope: serverTestContext.scope.name,
        collection: serverTestContext.collection.name,
      })
    ).resolves.toEqual(
      expect.arrayContaining([
        {
          id: expect.any(String),
          name: indexName1,
          bucketName: serverTestContext.bucket.name,
          scopeName: serverTestContext.scope.name,
          collectionName: serverTestContext.collection.name,
          isPrimary: false,
          fields: ['name'],
          node: 'http://127.0.0.1:8091',
          numReplicas: 0,
          namespace: 'default',
          state: 'online',
          using: 'gsi',
        },
      ])
    );

    // Get the indexes on all the collections of a scope
    await expect(
      getQueryIndexes(apiConfig, {
        bucket: serverTestContext.bucket.name,
        scope: serverTestContext.scope.name,
      })
    ).resolves.toEqual(
      expect.arrayContaining([
        {
          id: expect.any(String),
          name: indexName1,
          bucketName: serverTestContext.bucket.name,
          scopeName: serverTestContext.scope.name,
          collectionName: serverTestContext.collection.name,
          isPrimary: false,
          fields: ['name'],
          node: 'http://127.0.0.1:8091',
          numReplicas: 0,
          namespace: 'default',
          state: 'online',
          using: 'gsi',
        },
        {
          id: expect.any(String),
          name: indexName2,
          bucketName: serverTestContext.bucket.name,
          scopeName: serverTestContext.scope.name,
          collectionName,
          isPrimary: false,
          fields: ['name'],
          node: 'http://127.0.0.1:8091',
          numReplicas: 0,
          namespace: 'default',
          state: 'online',
          using: 'gsi',
        },
      ])
    );
  });
});
