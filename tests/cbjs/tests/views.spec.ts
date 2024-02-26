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

import {
  DesignDocument,
  DesignDocumentNotFoundError,
  DesignDocumentView,
  HttpErrorContext,
} from '@cbjsdev/cbjs';
import { waitForViewDesignDocument } from '@cbjsdev/http-client';
import { invariant } from '@cbjsdev/shared';
import { createCouchbaseTest } from '@cbjsdev/vitest';

import { useSampleData } from '../fixtures/useSampleData';
import { ServerFeatures, serverSupportsFeatures } from '../utils/serverFeature';
import { waitFor } from '../utils/waitFor';

describe
  .runIf(serverSupportsFeatures(ServerFeatures.Views))
  .shuffle('views', async () => {
    const buildDesignDocument = (testUid: string, docId: string, viewName: string) => {
      return new DesignDocument({
        name: `dev_${docId}`,
        views: {
          [viewName]: new DesignDocumentView({
            map: `
          function(doc, meta){
            if(meta.id.indexOf("${testUid}")==0){
              emit(meta.id);
            }
          }
          `,
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

    test(
      'should successfully create an index',
      async function ({ serverTestContext, docId, viewName, useSampleData }) {
        const sampleData = await useSampleData(serverTestContext.dco);
        await serverTestContext.b
          .viewIndexes()
          .upsertDesignDocument(buildDesignDocument(sampleData.testUid, docId, viewName));
      },
      { timeout: 60_000 }
    );

    test('should successfully publish an index', async function ({
      serverTestContext,
      docId,
      viewName,
      apiConfig,
      useSampleData,
    }) {
      const sampleData = await useSampleData(serverTestContext.dco);
      const doc = buildDesignDocument(sampleData.testUid, docId, viewName);

      await serverTestContext.b.viewIndexes().upsertDesignDocument(doc);
      await waitForViewDesignDocument(apiConfig, serverTestContext.b.name, doc.name);
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
      },
      { timeout: 20_000 }
    );

    test(
      'should see test data correctly with a new connection',
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
      },
      { timeout: 10_000 }
    );

    test('should successfully drop an index', async function ({
      serverTestContext,
      apiConfig,
      viewName,
      docId,
      useSampleData,
    }) {
      const sampleData = await useSampleData(serverTestContext.dco);
      const doc = buildDesignDocument(sampleData.testUid, docId, viewName);
      await serverTestContext.b.viewIndexes().upsertDesignDocument(doc);
      await serverTestContext.b.viewIndexes().dropDesignDocument(doc.name);

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
