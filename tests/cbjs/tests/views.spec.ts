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
import { afterEach, describe } from 'vitest';

import {
  DesignDocument,
  DesignDocumentNamespace,
  DesignDocumentNotFoundError,
  DesignDocumentView,
  HttpErrorContext,
} from '@cbjsdev/cbjs';
import { waitForViewDesignDocument } from '@cbjsdev/http-client';
import { invariant, waitFor } from '@cbjsdev/shared';
import { createCouchbaseTest, TestFixtures } from '@cbjsdev/vitest';

import { useSampleData } from '../fixtures/useSampleData.js';
import { ServerFeatures, serverSupportsFeatures } from '../utils/serverFeature.js';

describe
  .runIf(serverSupportsFeatures(ServerFeatures.Views))
  .shuffle('views', async () => {
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
            realm: getMapFunction(testUid),
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

    test('should successfully create an index', async function ({
      apiConfig,
      serverTestContext,
      docId,
      viewName,
      useSampleData,
    }) {
      const sampleData = await useSampleData(serverTestContext.dco);
      await serverTestContext.b
        .viewIndexes()
        .upsertDesignDocument(buildDesignDocument(sampleData.testUid, docId, viewName));

      await waitForViewDesignDocument(
        apiConfig,
        serverTestContext.b.name,
        `dev_${docId}`
      );
    });

    test('should successfully create an index using an explicit namespace', async function ({
      apiConfig,
      serverTestContext,
      docId,
      viewName,
      useSampleData,
    }) {
      const sampleData = await useSampleData(serverTestContext.dco);
      const doc = buildDesignDocument(sampleData.testUid, docId, viewName, true);
      await serverTestContext.b
        .viewIndexes()
        .upsertDesignDocument(doc, DesignDocumentNamespace.Development);

      await waitForViewDesignDocument(
        apiConfig,
        serverTestContext.b.name,
        `dev_${docId}`
      );
    });

    test(
      'should successfully get a development index (legacy)',
      { timeout: 60_000 },
      async function ({
        expect,
        apiConfig,
        serverTestContext,
        docId,
        viewName,
        useSampleData,
      }) {
        const sampleData = await useSampleData(serverTestContext.dco);
        const doc = buildDesignDocument(sampleData.testUid, docId, viewName);

        await serverTestContext.b.viewIndexes().upsertDesignDocument(doc);

        await waitForViewDesignDocument(
          apiConfig,
          serverTestContext.b.name,
          `dev_${docId}`
        );

        const res = await serverTestContext.b
          .viewIndexes()
          .getDesignDocument(`dev_${docId}`);

        expect(res).toBeInstanceOf(DesignDocument);
        expect(res.name).toEqual(docId);
        expect(res.namespace).toEqual(DesignDocumentNamespace.Development);
        expect(Object.keys(res.views)).toHaveLength(1);
        expect(Object.keys(res.views)[0]).toEqual('simple');
        expect(res.views.simple).toBeInstanceOf(DesignDocumentView);
        expect(res.views.simple.map).toEqual(getMapFunction(sampleData.testUid));
      }
    );

    test(
      'should successfully get a development index using an explicit namespace',
      { timeout: 60_000 },
      async function ({
        expect,
        apiConfig,
        serverTestContext,
        docId,
        viewName,
        useSampleData,
      }) {
        const sampleData = await useSampleData(serverTestContext.dco);
        const doc = buildDesignDocument(sampleData.testUid, docId, viewName, true);

        await serverTestContext.b
          .viewIndexes()
          .upsertDesignDocument(doc, DesignDocumentNamespace.Development);

        await waitForViewDesignDocument(
          apiConfig,
          serverTestContext.b.name,
          `dev_${docId}`
        );

        const res = await serverTestContext.b
          .viewIndexes()
          .getDesignDocument(docId, DesignDocumentNamespace.Development);

        expect(res).toBeInstanceOf(DesignDocument);
        expect(res.name).toEqual(docId);
        expect(res.namespace).toEqual(DesignDocumentNamespace.Development);
        expect(Object.keys(res.views)).toHaveLength(1);
        expect(Object.keys(res.views)[0]).toEqual('simple');
        expect(res.views.simple).toBeInstanceOf(DesignDocumentView);
        expect(res.views.simple.map).toEqual(getMapFunction(sampleData.testUid));
      }
    );

    test('should successfully publish an index (legacy)', async function ({
      serverTestContext,
      docId,
      viewName,
      apiConfig,
      useSampleData,
    }) {
      const sampleData = await useSampleData(serverTestContext.dco);
      const doc = buildDesignDocument(sampleData.testUid, docId, viewName);

      await serverTestContext.b.viewIndexes().upsertDesignDocument(doc);
      await waitForViewDesignDocument(
        apiConfig,
        serverTestContext.b.name,
        `dev_${doc.name}`
      );
      await serverTestContext.b.viewIndexes().publishDesignDocument(docId);
    });

    test('should successfully publish an index using explicit namespace', async function ({
      serverTestContext,
      docId,
      viewName,
      apiConfig,
      useSampleData,
    }) {
      const sampleData = await useSampleData(serverTestContext.dco);
      const doc = buildDesignDocument(sampleData.testUid, docId, viewName, true);

      await serverTestContext.b
        .viewIndexes()
        .upsertDesignDocument(doc, DesignDocumentNamespace.Development);
      await waitForViewDesignDocument(
        apiConfig,
        serverTestContext.b.name,
        `dev_${doc.name}`
      );

      await serverTestContext.b.viewIndexes().publishDesignDocument(docId);
    });

    test('should fail to publish a non-existent index', async function ({
      serverTestContext,
      expect,
    }) {
      await expect(
        serverTestContext.b.viewIndexes().publishDesignDocument('missingDocKey')
      ).rejects.toThrowError(DesignDocumentNotFoundError);
    });

    test(
      'should see test data correctly',
      { timeout: 20_000 },
      async function ({ serverTestContext, expect, useSampleData, docId, viewName }) {
        const sampleData = await useSampleData(serverTestContext.dco);
        const doc = buildDesignDocument(sampleData.testUid, docId, viewName);
        await serverTestContext.b.viewIndexes().upsertDesignDocument(doc);
        await serverTestContext.b.viewIndexes().publishDesignDocument(docId);

        await waitFor(
          async () => {
            const res = await serverTestContext.b.viewQuery(docId, viewName);
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
      }
    );

    test(
      'should see test data correctly with a new connection',
      { timeout: 10_000 },
      async function ({ serverTestContext, expect, docId, viewName, useSampleData }) {
        const sampleData = await useSampleData(serverTestContext.dco);
        const doc = buildDesignDocument(sampleData.testUid, docId, viewName);
        await serverTestContext.b.viewIndexes().upsertDesignDocument(doc);
        await serverTestContext.b.viewIndexes().publishDesignDocument(docId);

        const cluster = await serverTestContext.newConnection();
        const bucket = cluster.bucket(serverTestContext.b.name);

        await waitFor(async () => {
          const res = await bucket.viewQuery(docId, viewName);
          expect(res.rows).toHaveLength(sampleData.sampleSize);
          expect(res.meta).toBeDefined();

          for (const row of res.rows) {
            expect(row.id).toBeDefined();
            expect(row.key).toBeDefined();
            expect(row.value).toBeDefined();
          }
        });
      }
    );

    test('should successfully drop a development index (legacy)', async function ({
      serverTestContext,
      apiConfig,
      viewName,
      docId,
      useSampleData,
    }) {
      const sampleData = await useSampleData(serverTestContext.dco);
      const doc = buildDesignDocument(sampleData.testUid, docId, viewName);
      await serverTestContext.b.viewIndexes().upsertDesignDocument(doc);

      await waitForViewDesignDocument(
        apiConfig,
        serverTestContext.b.name,
        `dev_${doc.name}`
      );

      await serverTestContext.b.viewIndexes().dropDesignDocument(`dev_${doc.name}`);

      await waitForViewDesignDocument(apiConfig, serverTestContext.b.name, docId, {
        expectMissing: true,
      });
    });

    test('should successfully drop a development index using explicit namespace', async function ({
      serverTestContext,
      apiConfig,
      viewName,
      docId,
      useSampleData,
    }) {
      const sampleData = await useSampleData(serverTestContext.dco);
      const doc = buildDesignDocument(sampleData.testUid, docId, viewName, true);
      await serverTestContext.b
        .viewIndexes()
        .upsertDesignDocument(doc, DesignDocumentNamespace.Development);

      await waitForViewDesignDocument(
        apiConfig,
        serverTestContext.b.name,
        `dev_${doc.name}`
      );

      await serverTestContext.b
        .viewIndexes()
        .dropDesignDocument(doc.name, DesignDocumentNamespace.Development);

      await waitForViewDesignDocument(apiConfig, serverTestContext.b.name, docId, {
        expectMissing: true,
      });
    });

    test('should successfully get all indexes - fallback namespace', async function ({
      apiConfig,
      expect,
      serverTestContext,
      viewName,
      docId,
      useSampleData,
    }) {
      const emptyIndexes = await serverTestContext.b
        .viewIndexes()
        .getAllDesignDocuments();

      expect(emptyIndexes).toBeInstanceOf(Array);
      expect(emptyIndexes).toHaveLength(0);

      const sampleData = await useSampleData(serverTestContext.dco);
      const doc = buildDesignDocument(sampleData.testUid, docId, viewName);
      await serverTestContext.b.viewIndexes().upsertDesignDocument(doc);

      await waitForViewDesignDocument(
        apiConfig,
        serverTestContext.b.name,
        `dev_${docId}`
      );

      await serverTestContext.b.viewIndexes().publishDesignDocument(doc.name);

      await waitForViewDesignDocument(apiConfig, serverTestContext.b.name, docId);

      const res = await serverTestContext.b.viewIndexes().getAllDesignDocuments();

      expect(res).toBeInstanceOf(Array);
      expect(res).toHaveLength(1);
      expect(res[0]).toBeInstanceOf(DesignDocument);
    });

    test('should successfully get all indexes of a specific namespace', async function ({
      apiConfig,
      expect,
      serverTestContext,
      viewName,
      docId,
      useSampleData,
    }) {
      const emptyIndexes = await serverTestContext.b
        .viewIndexes()
        .getAllDesignDocuments(DesignDocumentNamespace.Development);

      expect(emptyIndexes).toBeInstanceOf(Array);
      expect(emptyIndexes).toHaveLength(0);

      const sampleData = await useSampleData(serverTestContext.dco);
      const doc = buildDesignDocument(sampleData.testUid, docId, viewName, true);
      await serverTestContext.b
        .viewIndexes()
        .upsertDesignDocument(doc, DesignDocumentNamespace.Development);

      await waitForViewDesignDocument(
        apiConfig,
        serverTestContext.b.name,
        `dev_${docId}`
      );

      const res = await serverTestContext.b
        .viewIndexes()
        .getAllDesignDocuments(DesignDocumentNamespace.Development);

      expect(res).toBeInstanceOf(Array);
      expect(res).toHaveLength(1);
      expect(res[0]).toBeInstanceOf(DesignDocument);
    });

    test('should successfully drop a production index (legacy)', async function ({
      serverTestContext,
      apiConfig,
      viewName,
      docId,
      useSampleData,
    }) {
      const sampleData = await useSampleData(serverTestContext.dco);
      const doc = buildDesignDocument(sampleData.testUid, docId, viewName);
      await serverTestContext.b.viewIndexes().upsertDesignDocument(doc);

      await waitForViewDesignDocument(
        apiConfig,
        serverTestContext.b.name,
        `dev_${docId}`
      );

      await serverTestContext.b.viewIndexes().publishDesignDocument(doc.name);
      await serverTestContext.b.viewIndexes().dropDesignDocument(docId);

      await waitForViewDesignDocument(apiConfig, serverTestContext.b.name, docId, {
        expectMissing: true,
      });
    });

    test('should successfully drop a production index using explicit namespace', async function ({
      serverTestContext,
      apiConfig,
      viewName,
      docId,
      useSampleData,
    }) {
      const sampleData = await useSampleData(serverTestContext.dco);
      const doc = buildDesignDocument(sampleData.testUid, docId, viewName, true);
      await serverTestContext.b
        .viewIndexes()
        .upsertDesignDocument(doc, DesignDocumentNamespace.Development);

      await waitForViewDesignDocument(
        apiConfig,
        serverTestContext.b.name,
        `dev_${docId}`
      );

      await serverTestContext.b.viewIndexes().publishDesignDocument(doc.name);
      await serverTestContext.b
        .viewIndexes()
        .dropDesignDocument(docId, DesignDocumentNamespace.Production);

      await waitForViewDesignDocument(apiConfig, serverTestContext.b.name, docId, {
        expectMissing: true,
      });
    });

    test('should fail to drop a non-existent index', async function ({
      serverTestContext,
      expect,
    }) {
      expect.hasAssertions();

      try {
        await serverTestContext.b.viewIndexes().dropDesignDocument('missingDocKey');
      } catch (err) {
        expect(err).toBeInstanceOf(DesignDocumentNotFoundError);
        invariant(err instanceof DesignDocumentNotFoundError);
        expect(err.context).toBeInstanceOf(HttpErrorContext);
      }
    });
  });
