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
import { HttpErrorContext, IndexExistsError, IndexNotFoundError } from '@cbjsdev/cbjs';
import { invariant, keyspacePath } from '@cbjsdev/shared';
import { createCouchbaseTest, ServerTestContext } from '@cbjsdev/vitest';
import { describe } from 'vitest';

import { useSampleData } from '../fixtures/useSampleData';
import { ServerFeatures, serverSupportsFeatures } from '../utils/serverFeature';

describe.runIf(serverSupportsFeatures(ServerFeatures.Query, ServerFeatures.Collections))(
  'query index cluster api',
  async () => {
    const test = await createCouchbaseTest({
      useSampleData,
    });

    const cases = [
      {
        name: 'cluster level',
        getDataCollection: (stc: ServerTestContext) => stc.defaultCollection,
        getIndexKeyspace: (stc: ServerTestContext) => ({
          bucketName: stc.bucket.name,
          scopeName: undefined,
          collectionName: undefined,
        }),
        getDataKeyspacePath: (stc: ServerTestContext) => keyspacePath(stc.bucket.name),
      },
      {
        name: 'collection level',
        getDataCollection: (stc: ServerTestContext) => stc.collection,
        getIndexKeyspace: (stc: ServerTestContext) => ({
          bucketName: stc.bucket.name,
          scopeName: stc.scope.name,
          collectionName: stc.collection.name,
        }),
        getDataKeyspacePath: (stc: ServerTestContext) => stc.getKeyspacePath(),
      },
    ];

    describe.each(cases)('$name', ({ getDataCollection, getIndexKeyspace }) => {
      test('should successfully create & drop a primary index', async ({
        serverTestContext,
        usePrimaryIndex,
      }) => {
        await usePrimaryIndex(getIndexKeyspace(serverTestContext));
      });

      test('should throw a IndexExistsError when creating a duplicate primary index with the same name', async function ({
        expect,
        usePrimaryIndex,
        serverTestContext,
      }) {
        expect.hasAssertions();
        const indexName = await usePrimaryIndex(getIndexKeyspace(serverTestContext));

        try {
          await usePrimaryIndex({
            ...getIndexKeyspace(serverTestContext),
            name: indexName,
          });
        } catch (err) {
          expect(err).toBeInstanceOf(IndexExistsError);
          invariant(err instanceof IndexExistsError);
          expect(err.context).toBeInstanceOf(HttpErrorContext);
        }
      });

      test('should successfully create & drop secondary index (using a new connection)', async function ({
        useIndex,
        serverTestContext,
      }) {
        await useIndex({
          ...getIndexKeyspace(serverTestContext),
          fields: ['a'],
        });
      });

      test('should throw a IndexExistsError when creating a duplicate secondary index with the same name', async function ({
        useIndex,
        expect,
        serverTestContext,
      }) {
        expect.hasAssertions();
        const indexName = await useIndex({
          ...getIndexKeyspace(serverTestContext),
          fields: ['a'],
        });

        try {
          await useIndex({
            name: indexName,
            ...getIndexKeyspace(serverTestContext),
            fields: ['a'],
          });
        } catch (err) {
          expect(err).toBeInstanceOf(IndexExistsError);
          invariant(err instanceof IndexExistsError);
          expect(err.context).toBeInstanceOf(HttpErrorContext);
        }
      });

      test('should successfully get all indexes', async function ({
        serverTestContext,
        useIndex,
        usePrimaryIndex,
        expect,
      }) {
        const primaryIndexName = await usePrimaryIndex(
          getIndexKeyspace(serverTestContext)
        );
        const secondaryIndexName = await useIndex({
          ...getIndexKeyspace(serverTestContext),
          fields: ['a'],
        });
        await expect(
          serverTestContext.cluster
            .queryIndexes()
            .getAllIndexes(serverTestContext.bucket.name)
        ).resolves.toEqual([
          expect.objectContaining({ name: primaryIndexName }),
          expect.objectContaining({ name: secondaryIndexName }),
        ]);
      });

      test('should throw a IndexNotFoundError when watching when some missing indexes', async function ({
        expect,
        serverTestContext,
      }) {
        expect.hasAssertions();

        try {
          await serverTestContext.cluster
            .queryIndexes()
            .watchIndexes(
              getIndexKeyspace(serverTestContext).bucketName,
              ['missingIndex'],
              2000
            );
        } catch (err) {
          expect(err).toBeInstanceOf(IndexNotFoundError);
          invariant(err instanceof IndexNotFoundError);
          // JSCBC-1230
          // expect(err.context).toBeInstanceOf(HttpErrorContext);
        }
      });

      test('should throw a IndexNotFoundError when dropping a missing secondary index', async function ({
        expect,
        serverTestContext,
      }) {
        expect.hasAssertions();

        try {
          await serverTestContext.cluster
            .queryIndexes()
            .dropIndex(getIndexKeyspace(serverTestContext).bucketName, 'missingIndex');
        } catch (err) {
          expect(err).toBeInstanceOf(IndexNotFoundError);
          invariant(err instanceof IndexNotFoundError);
          expect(err.context).toBeInstanceOf(HttpErrorContext);
        }
      });

      test('should build deferred indexes', async function ({
        expect,
        serverTestContext,
        useSampleData,
        useIndex,
      }) {
        await useSampleData(getDataCollection(serverTestContext) as any);

        const keyspaceProps = getIndexKeyspace(serverTestContext);

        const indexName0 = await useIndex({
          ...keyspaceProps,
          fields: ['name'],
          deferred: true,
        });

        const indexName1 = await useIndex({
          ...keyspaceProps,
          fields: ['name', 'testUid'],
          deferred: true,
        });

        const indexes = await serverTestContext.cluster
          .queryIndexes()
          .getAllIndexes(keyspaceProps.bucketName);

        expect(indexes).toHaveLength(2);
        expect(indexes).toContainEqual(
          expect.objectContaining({ name: indexName0, state: 'deferred' })
        );
        expect(indexes).toContainEqual(
          expect.objectContaining({ name: indexName1, state: 'deferred' })
        );

        await serverTestContext.cluster
          .queryIndexes()
          .buildDeferredIndexes(keyspaceProps.bucketName, {
            scopeName: keyspaceProps.scopeName,
            collectionName: keyspaceProps.collectionName,
          });

        await serverTestContext.cluster
          .queryIndexes()
          .watchIndexes(keyspaceProps.bucketName, [indexName0, indexName1], 6000);

        const indexesBuilt = await serverTestContext.cluster
          .queryIndexes()
          .getAllIndexes(keyspaceProps.bucketName);

        expect(indexesBuilt).toHaveLength(2);
        expect(indexesBuilt).toContainEqual(
          expect.objectContaining({ name: indexName0, state: 'online' })
        );
        expect(indexesBuilt).toContainEqual(
          expect.objectContaining({ name: indexName1, state: 'online' })
        );
      });

      test('should throw a IndexNotFoundError when dropping a missing primary index', async function ({
        expect,
        serverTestContext,
      }) {
        expect.hasAssertions();

        try {
          await serverTestContext.cluster
            .queryIndexes()
            .dropPrimaryIndex(getIndexKeyspace(serverTestContext).bucketName, {
              name: 'missingIndex',
            });
        } catch (err) {
          expect(err).toBeInstanceOf(IndexNotFoundError);
          invariant(err instanceof IndexNotFoundError);
          expect(err.context).toBeInstanceOf(HttpErrorContext);
        }
      });
    });
  },
  { timeout: 20_000, retry: 1 }
);
