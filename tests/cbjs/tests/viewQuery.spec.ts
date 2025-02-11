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
import { afterEach, beforeEach, describe, RunnerTestCase } from 'vitest';

import {
  DesignDocument,
  DesignDocumentNamespace,
  DesignDocumentView,
  InvalidArgumentError,
  ViewOrdering,
  ViewRow,
} from '@cbjsdev/cbjs';
import { ServerFeatures, waitForViewDesignDocument } from '@cbjsdev/http-client';
import { arrayFirstElement, arrayLastElement, waitFor } from '@cbjsdev/shared';
import { createCouchbaseTest, TestFixtures } from '@cbjsdev/vitest';

import { useSampleData } from '../fixtures/useSampleData.js';
import { serverSupportsFeatures } from '../utils/serverFeature.js';

describe
  .runIf(serverSupportsFeatures(ServerFeatures.Views))
  .shuffle('view query', { timeout: 20_000, retry: 2 }, async () => {
    const getMapFunction = (testUid: string) => `
      function(doc, meta){
        if(meta.id.indexOf("${testUid}")==0){
          const newDoc = {
            batch: "${testUid}",
            id: meta.id,
            name: doc.name
          };
          const batches = newDoc.id.split('::')
          if (parseInt(batches[1]) < 2) {
            const key = batches[0].slice(0, 2)
            emit(key, newDoc)
          } else if (parseInt(batches[1]) >= 2 && parseInt(batches[1]) < 4) {
            const key = batches[0].slice(2, 4)
            emit(key, newDoc);
          } else if (parseInt(batches[1]) >= 4 && parseInt(batches[1]) < 6) {
            const key = batches[0].slice(4, 6)
            emit(key, newDoc);
          } else {
            const key = batches[0].slice(-2)
            emit(key, newDoc);
          }
        }
      }
    `;

    const buildDesignDocument = (
      testUid: string,
      docId: string,
      viewName: string,
      explicitNamespace = false
    ) => {
      return new DesignDocument({
        name: explicitNamespace ? docId : `dev_${docId}`,
        views: {
          [viewName]: new DesignDocumentView({
            map: getMapFunction(testUid),
          }),
        },
      });
    };

    const test = await createCouchbaseTest(({ useViewDocumentKey }) => {
      return {
        useSampleData,
        docId: useViewDocumentKey(),
        viewName: 'simple',
      };
    });

    // The view design document key fixture won't effectively drop the view at the end of the test because
    // of the automatic prefix for development/unpublished views.
    afterEach<TestFixtures<typeof test>>(
      async ({ apiConfig, serverTestContext, docId }) => {
        await Promise.allSettled([
          serverTestContext.b.viewIndexes().dropDesignDocument(docId),
          serverTestContext.b.viewIndexes().dropDesignDocument(`dev_${docId}`),
        ]);

        await waitForViewDesignDocument(apiConfig, serverTestContext.b.name, docId, {
          expectMissing: true,
        });

        await waitForViewDesignDocument(
          apiConfig,
          serverTestContext.b.name,
          `dev_${docId}`,
          {
            expectMissing: true,
          }
        );
      }
    );

    type ViewQueryContext = TestFixtures<typeof test> & {
      sampleData: { sampleSize: number; testUid: string; sampleDocKeys: string[] };
    };

    beforeEach<ViewQueryContext>(
      async ({ serverTestContext, useSampleData, docId, viewName, task }) => {
        const sampleData = await useSampleData(serverTestContext.dco);
        const doc = buildDesignDocument(sampleData.testUid, docId, viewName, true);
        await serverTestContext.b
          .viewIndexes()
          .upsertDesignDocument(doc, DesignDocumentNamespace.Development);

        (task as RunnerTestCase<ViewQueryContext>).context.sampleData = sampleData;
      }
    );

    test<ViewQueryContext>('should see test data correctly', async ({
      serverTestContext,
      expect,
      docId,
      sampleData,
      viewName,
    }) => {
      expect.hasAssertions();

      await waitFor(
        async () => {
          const res = await serverTestContext.b.viewQuery(docId, viewName, {
            namespace: DesignDocumentNamespace.Development,
            fullSet: true,
          });
          expect(res.rows).toHaveLength(sampleData.sampleSize);
          expect(res.meta).toBeDefined();

          for (const row of res.rows) {
            expect(row.id).toBeDefined();
            expect(row.key).toBeDefined();
            expect(row.value).toBeDefined();
          }
        },
        { timeout: 20_000, retryInterval: 2_000 }
      );
    });

    test<ViewQueryContext>('should receive results in ASC order', async ({
      expect,
      serverTestContext,
      docId,
      viewName,
      sampleData,
    }) => {
      expect.hasAssertions();

      await waitFor(
        async () => {
          const res = await serverTestContext.b.viewQuery(docId, viewName, {
            namespace: DesignDocumentNamespace.Development,
            order: ViewOrdering.Ascending,
          });

          const sortedKeys = getSortedSampleKeys(sampleData.sampleDocKeys);
          expect(res.rows.map((r) => r.id)).toEqual(sortedKeys);
        },
        { timeout: 20_000, retryInterval: 500 }
      );
    });

    test<ViewQueryContext>('should receive results in DESC order', async ({
      expect,
      serverTestContext,
      docId,
      viewName,
      sampleData,
    }) => {
      expect.hasAssertions();

      await waitFor(
        async () => {
          const res = await serverTestContext.b.viewQuery(docId, viewName, {
            namespace: DesignDocumentNamespace.Development,
            order: ViewOrdering.Descending,
          });

          const sortedKeys = getSortedSampleKeys(sampleData.sampleDocKeys).reverse();
          expect(res.rows.map((r) => r.id)).toEqual(sortedKeys);
        },
        { timeout: 20_000, retryInterval: 500 }
      );
    });

    test<ViewQueryContext>('should receive results using endkey and endkey_docids', async ({
      expect,
      docId,
      viewName,
      sampleData,
      serverTestContext,
    }) => {
      expect.hasAssertions();

      const testUidKeys = [...getTestUidKeys(sampleData.testUid, 2)];
      const sortedTestUidKeys = [...testUidKeys].sort();

      // get the 1st and 2nd smallest keys
      const smallestKeyIdx = testUidKeys.indexOf(sortedTestUidKeys[0]);
      const keyIdx = testUidKeys.indexOf(sortedTestUidKeys[1]);
      const key = testUidKeys[keyIdx];
      const keysAndDocIds = getKeysAndDocIds(sampleData.sampleDocKeys);
      const endKeyDocId = keysAndDocIds[key][keysAndDocIds[key].length - 1];
      const expectedCount =
        keysAndDocIds[testUidKeys[smallestKeyIdx]].length + keysAndDocIds[key].length;

      await waitFor(
        async () => {
          const res = await serverTestContext.b.viewQuery(docId, viewName, {
            namespace: DesignDocumentNamespace.Development,
            idRange: { end: endKeyDocId },
            range: { end: key },
          });

          expect(res.rows).toHaveLength(expectedCount);
          expect(res.meta).toBeDefined();

          const lastRow = arrayLastElement(res.rows);
          expect(lastRow.key).toEqual(key);
          expect(lastRow.id).toEqual(endKeyDocId);
        },
        { timeout: 20_000, retryInterval: 500 }
      );
    });

    test<ViewQueryContext>('should receive results using startkey and startkey_docids', async ({
      expect,
      docId,
      viewName,
      sampleData,
      serverTestContext,
    }) => {
      expect.hasAssertions();

      const testUidKeys = [...getTestUidKeys(sampleData.testUid, 2)];
      const sortedTestUidKeys = [...testUidKeys].sort();
      // get the largest key
      const keyIdx = testUidKeys.indexOf(sortedTestUidKeys[sortedTestUidKeys.length - 1]);
      const key = testUidKeys[keyIdx];
      const keysAndDocIds = getKeysAndDocIds(sampleData.sampleDocKeys);
      const startKeyDocId = keysAndDocIds[key][keysAndDocIds[key].length - 1];
      const expectedCount = 1;

      // run a query so we can have pagination
      await serverTestContext.b.viewQuery(docId, 'simple', {
        namespace: DesignDocumentNamespace.Development,
        limit: 2,
      });

      await waitFor(
        async () => {
          const res = await serverTestContext.b.viewQuery(docId, viewName, {
            namespace: DesignDocumentNamespace.Development,
            limit: 2,
            idRange: { start: startKeyDocId },
            range: { start: key },
          });

          expect(res.rows).toHaveLength(expectedCount);
          expect(res.meta).toBeDefined();

          const firstRow = arrayFirstElement(res.rows);
          expect(firstRow.key).toEqual(key);
          expect(firstRow.id).toEqual(startKeyDocId);
        },
        { timeout: 20_000, retryInterval: 500 }
      );
    });

    test<ViewQueryContext>('should receive results using a specific key', async ({
      expect,
      docId,
      viewName,
      sampleData,
      serverTestContext,
    }) => {
      expect.hasAssertions();

      const testUidKeys = [...getTestUidKeys(sampleData.testUid, 2)];
      const key = testUidKeys[0];
      const keysAndDocIds = getKeysAndDocIds(sampleData.sampleDocKeys);
      const expectedDocIds = keysAndDocIds[key];
      const expectedCount = expectedDocIds.length;

      await waitFor(
        async () => {
          const res = await serverTestContext.b.viewQuery<{ id: string }>(
            docId,
            viewName,
            {
              namespace: DesignDocumentNamespace.Development,
              key: key,
            }
          );

          expect(res.rows).toHaveLength(expectedCount);
          expect(res.meta).toBeDefined();

          for (const row of res.rows) {
            expect(row).toBeInstanceOf(ViewRow);
            expect(row.id).toBeTypeOf('string');
            expect(row.key).toBeTypeOf('string');
            expect(row.value).toBeTypeOf('object');
            expect(row.key).toEqual(key);
            expect(expectedDocIds).toContainEqual(row.value.id);
          }
        },
        { timeout: 20_000, retryInterval: 500 }
      );
    });

    test<ViewQueryContext>('should receive results using specific keys', async ({
      expect,
      docId,
      viewName,
      sampleData,
      serverTestContext,
    }) => {
      expect.hasAssertions();

      const testUidKeys = [...getTestUidKeys(sampleData.testUid, 2)];
      const expectedKeys = testUidKeys.slice(0, 2);
      const keysAndDocIds = getKeysAndDocIds(sampleData.sampleDocKeys);
      const expectedDocIds = keysAndDocIds[expectedKeys[0]].concat(
        keysAndDocIds[expectedKeys[1]]
      );
      const expectedCount = expectedDocIds.length;

      await waitFor(
        async () => {
          const res = await serverTestContext.b.viewQuery<{ id: string }>(
            docId,
            viewName,
            {
              namespace: DesignDocumentNamespace.Development,
              keys: expectedKeys,
            }
          );

          expect(res.rows).toHaveLength(expectedCount);
          expect(res.meta).toBeDefined();

          for (const row of res.rows) {
            expect(row).toBeInstanceOf(ViewRow);
            expect(row.id).toBeTypeOf('string');
            expect(row.key).toBeTypeOf('string');
            expect(row.value).toBeTypeOf('object');

            expect(expectedKeys).toContainEqual(row.key);
            expect(expectedDocIds).toContainEqual(row.value.id);
          }
        },
        { timeout: 20_000, retryInterval: 500 }
      );
    });

    test<ViewQueryContext>('should receive results using raw option', async ({
      expect,
      docId,
      viewName,
      sampleData,
      serverTestContext,
    }) => {
      expect.hasAssertions();

      const testUidKeys = [...getTestUidKeys(sampleData.testUid, 2)];
      const sortedTestUidKeys = [...testUidKeys].sort();
      // get the largest key
      const keyIdx = testUidKeys.indexOf(sortedTestUidKeys[sortedTestUidKeys.length - 1]);
      const key = testUidKeys[keyIdx];
      const keysAndDocIds = getKeysAndDocIds(sampleData.sampleDocKeys);
      const startKeyDocId = keysAndDocIds[key][keysAndDocIds[key].length - 1];
      const expectedCount = 1;

      // run a query so we can have pagination
      await serverTestContext.b.viewQuery(docId, 'simple', {
        namespace: DesignDocumentNamespace.Development,
        limit: 2,
      });

      await waitFor(
        async () => {
          const res = await serverTestContext.b.viewQuery(docId, viewName, {
            namespace: DesignDocumentNamespace.Development,
            raw: {
              limit: '2',
              startkey: JSON.stringify(key),
              startkey_docid: startKeyDocId,
              full_set: 'true',
            },
          });

          expect(res.rows).toHaveLength(expectedCount);
          expect(res.meta).toBeDefined();

          const firstRow = arrayFirstElement(res.rows);
          expect(firstRow.key).toEqual(key);
          expect(firstRow.id).toEqual(startKeyDocId);
        },
        { timeout: 20_000, retryInterval: 500 }
      );
    });

    test.skip<ViewQueryContext>('should throw an InvalidArgumentError when passing invalid raw option', async ({
      expect,
      docId,
      viewName,
      sampleData,
      serverTestContext,
    }) => {
      expect.hasAssertions();

      const testUidKeys = [...getTestUidKeys(sampleData.testUid, 2)];
      const sortedTestUidKeys = [...testUidKeys].sort();
      // get the largest key
      const keyIdx = testUidKeys.indexOf(sortedTestUidKeys[sortedTestUidKeys.length - 1]);
      const key = testUidKeys[keyIdx];
      const keysAndDocIds = getKeysAndDocIds(sampleData.sampleDocKeys);
      const startKeyDocId = keysAndDocIds[key][keysAndDocIds[key].length - 1];

      await expect(
        serverTestContext.b.viewQuery<{ id: string }>(docId, viewName, {
          namespace: DesignDocumentNamespace.Development,
          raw: {
            limit: '2',
            // this key should be a JSON string
            startkey: key,
            startkey_docid: startKeyDocId,
            full_set: 'true',
          },
        })
      ).rejects.toThrowError(InvalidArgumentError);
    });
  });

function* getTestUidKeys(testUid: string, keySize: number) {
  for (let i = 0; i < testUid.length; i += keySize) {
    yield testUid.slice(i, i + keySize);
  }
}

function getKeysAndDocIds(testDocKeys: string[]) {
  const keysAndDocIds = {} as Record<string, string[]>;

  for (const item of testDocKeys) {
    const tokens = item.split('::');
    const testUid = tokens[0];
    const counter = parseInt(tokens[1]);

    let key;
    if (counter < 2) {
      key = testUid.slice(0, 2);
    } else if (counter >= 2 && counter < 4) {
      key = testUid.slice(2, 4);
    } else if (counter >= 4 && counter < 6) {
      key = testUid.slice(4, 6);
    } else {
      key = testUid.slice(-2);
    }
    if (key in keysAndDocIds) {
      keysAndDocIds[key].push(item);
    } else {
      keysAndDocIds[key] = [item];
    }
  }
  return keysAndDocIds;
}

function getSortedSampleKeys(keys: string[]): string[] {
  const keysAndDocIds = getKeysAndDocIds(keys);
  return Object.keys(keysAndDocIds)
    .sort()
    .reduce((arr, key) => arr.concat(keysAndDocIds[key].sort()), [] as string[]);
}
