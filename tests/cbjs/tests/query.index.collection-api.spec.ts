/*
 * Copyright (c) 2023-Present Jonathan MASSUCHETTI <jonathan.massuchetti@dappit.fr>.
 * Copyright (c) 2013-Present Couchbase Inc.
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

import { HttpErrorContext, IndexExistsError, IndexNotFoundError } from '@cbjs/cbjs';
import { invariant } from '@cbjs/shared';
import { createCouchbaseTest } from '@cbjs/vitest';
import { getRandomId } from '@cbjs/vitest';
import { useSampleData } from '../fixtures/useSampleData';
import { ServerFeatures, serverSupportsFeatures } from '../utils/serverFeature';
import { sleep } from '@cbjs/shared';

describe.runIf(serverSupportsFeatures(ServerFeatures.Query, ServerFeatures.Collections))(
  'query index collection api',
  async () => {
    const test = await createCouchbaseTest({
      useSampleData
    });

    test('should successfully create & drop a primary index', async ({
      serverTestContext,
      useCollection,
    }) => {
      const indexName = getRandomId();
      const collectionName = await useCollection();
      const collection = serverTestContext.bucket.collection(collectionName);

      await sleep(500);

      await collection.queryIndexes().createPrimaryIndex({
        name: indexName,
      });

      await collection.queryIndexes().dropPrimaryIndex({
        name: indexName,
      });
    });

    test('should throw a IndexExistsError when creating a duplicate primary index with the same name', async ({
      expect,
      serverTestContext,
      useCollection,
    }) => {
      expect.hasAssertions();
      const indexName = getRandomId();
      const collectionName = await useCollection();
      const collection = serverTestContext.bucket.collection(collectionName);

      await sleep(500);

      await collection.queryIndexes().createPrimaryIndex({
        name: indexName,
      });

      try {
        await collection.queryIndexes().createPrimaryIndex({
          name: indexName,
        });
      } catch (err) {
        expect(err).toBeInstanceOf(IndexExistsError);
        invariant(err instanceof IndexExistsError);
        expect(err.context).toBeInstanceOf(HttpErrorContext);
      }
    });

    test('should successfully create & drop secondary index', async ({
      serverTestContext,
      useCollection,
    }) => {
      const indexName = getRandomId();
      const collectionName = await useCollection();
      const collection = serverTestContext.bucket.collection(collectionName);

      await sleep(500);

      await collection.queryIndexes().createIndex(indexName, ['name']);
      await collection.queryIndexes().dropIndex(indexName);
    });

    test('should throw a IndexExistsError when creating a duplicate secondary index with the same name', async ({
      expect,
      serverTestContext,
      useCollection,
    }) => {
      expect.hasAssertions();
      const indexName = getRandomId();
      const collectionName = await useCollection();
      const collection = serverTestContext.bucket.collection(collectionName);

      await sleep(500);

      await collection.queryIndexes().createIndex(indexName, ['name']);

      try {
        await collection.queryIndexes().createIndex(indexName, ['name']);
      } catch (err) {
        expect(err).toBeInstanceOf(IndexExistsError);
        invariant(err instanceof IndexExistsError);
        expect(err.context).toBeInstanceOf(HttpErrorContext);
      }
    });

    test('should successfully get all indexes', async ({
      serverTestContext,
      useCollection,
      expect,
    }) => {
      const indexName0 = getRandomId();
      const indexName1 = getRandomId();

      const collectionName = await useCollection();
      const collection = serverTestContext.bucket.collection(collectionName);

      await sleep(500);

      await collection.queryIndexes().createIndex(indexName0, ['name']);
      await collection.queryIndexes().createIndex(indexName1, ['name']);

      const indexes = await collection.queryIndexes().getAllIndexes();

      expect(indexes).toHaveLength(2);
      expect(indexes).toContainEqual(expect.objectContaining({ name: indexName0 }));
      expect(indexes).toContainEqual(expect.objectContaining({ name: indexName1 }));
    });

    test('should throw a IndexNotFoundError when watching missing indexes', async ({
      expect,
      serverTestContext,
      useCollection,
    }) => {
      expect.hasAssertions();
      const collectionName = await useCollection();
      const collection = serverTestContext.bucket.collection(collectionName);

      await sleep(500);

      try {
        await collection.queryIndexes().watchIndexes(['missingIndex'], 2000);
      } catch (err) {
        expect(err).toBeInstanceOf(IndexNotFoundError);
        invariant(err instanceof IndexNotFoundError);
        // TODO uncomment when JSCBC-1230 is fixed
        // expect(err.context).toBeInstanceOf(HttpErrorContext);
      }
    });

    test('should throw a IndexNotFoundError when droping a missing secondary index', async ({
      expect,
      serverTestContext,
      useCollection,
    }) => {
      expect.hasAssertions();
      const collectionName = await useCollection();
      const collection = serverTestContext.bucket.collection(collectionName);

      await sleep(500);

      try {
        await collection.queryIndexes().dropIndex('missingIndex');
      } catch (err) {
        expect(err).toBeInstanceOf(IndexNotFoundError);
        invariant(err instanceof IndexNotFoundError);
        expect(err.context).toBeInstanceOf(HttpErrorContext);
      }
    });

    test('should build deferred indexes', async ({
      expect,
      serverTestContext,
      useSampleData,
      useCollection,
    }) => {
      const collectionName = await useCollection();
      const collection = serverTestContext.bucket.collection(collectionName);
      await useSampleData(collection);

      await sleep(500);

      const indexName0 = getRandomId();
      const indexName1 = getRandomId();

      await collection
        .queryIndexes()
        .createIndex(indexName0, ['name'], { deferred: true });
      await collection
        .queryIndexes()
        .createIndex(indexName1, ['name'], { deferred: true });

      const indexes = await collection.queryIndexes().getAllIndexes();

      expect(indexes).toHaveLength(2);
      expect(indexes).toContainEqual(
        expect.objectContaining({ name: indexName0, state: 'deferred' })
      );
      expect(indexes).toContainEqual(
        expect.objectContaining({ name: indexName1, state: 'deferred' })
      );

      await collection.queryIndexes().buildDeferredIndexes();
      await collection.queryIndexes().watchIndexes([indexName0, indexName1], 6000);

      const indexesBuilt = await collection.queryIndexes().getAllIndexes();

      expect(indexesBuilt).toHaveLength(2);
      expect(indexesBuilt).toContainEqual(
        expect.objectContaining({ name: indexName0, state: 'online' })
      );
      expect(indexesBuilt).toContainEqual(
        expect.objectContaining({ name: indexName1, state: 'online' })
      );
    });

    test('should throw a IndexNotFoundError when dropping a missing primary index', async ({
      expect,
      serverTestContext,
      useCollection,
    }) => {
      expect.hasAssertions();
      const collectionName = await useCollection();
      const collection = serverTestContext.bucket.collection(collectionName);

      await sleep(500);

      try {
        await collection.queryIndexes().dropPrimaryIndex({
          name: 'missingIndex',
        });
      } catch (err) {
        expect(err).toBeInstanceOf(IndexNotFoundError);
        invariant(err instanceof IndexNotFoundError);
        expect(err.context).toBeInstanceOf(HttpErrorContext);
      }
    });
  },
  { timeout: 10_000 }
);
