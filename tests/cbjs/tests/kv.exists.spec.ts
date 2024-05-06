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
import { beforeEach, describe, vi } from 'vitest';

import { ServerFeatures } from '@cbjsdev/http-client';
import { waitFor } from '@cbjsdev/shared';
import { createCouchbaseTest, TestFixtures } from '@cbjsdev/vitest';

import { serverSupportsFeatures } from '../utils/serverFeature.js';
import { getLargeTestDocument } from './kv._helpers.js';

describe
  .runIf(serverSupportsFeatures(ServerFeatures.GetMeta))
  .shuffle('kv exists', async () => {
    const test = await createCouchbaseTest(({ useDocumentKey }) => {
      return {
        testDocKey: useDocumentKey(),
        testDocContent: getLargeTestDocument(),
      };
    });

    beforeEach<TestFixtures<typeof test>>(
      async ({ serverTestContext, testDocKey, testDocContent }) => {
        await serverTestContext.collection.upsert(testDocKey, testDocContent);
      }
    );

    test('should check the existence of a document', async function ({
      serverTestContext,
      expect,
      testDocKey,
    }) {
      const resultExists = await serverTestContext.collection.exists(testDocKey);
      expect(resultExists.exists).toBe(true);
      expect(resultExists.cas).toBeNonZeroCAS();

      const resultMissing = await serverTestContext.collection.exists('missingDoc');
      expect(resultMissing.exists).toBe(false);
      expect(resultMissing.cas).toBeZeroCAS();
    });

    test('should perform basic exists with callback', async function ({
      serverTestContext,
      expect,
      testDocKey,
    }) {
      expect.hasAssertions();
      const successCallback = vi.fn();

      await serverTestContext.collection.exists(testDocKey, (err, res) => {
        if (err) return;
        expect(res.exists).toBe(true);
        expect(res.cas).toBeNonZeroCAS();
        successCallback();
      });

      await waitFor(() => {
        expect(successCallback).toHaveBeenCalled();
      });
    });

    test('should perform basic exists with options and callback', async function ({
      serverTestContext,
      expect,
      testDocKey,
    }) {
      expect.hasAssertions();
      const successCallback = vi.fn();

      await serverTestContext.collection.exists(
        testDocKey,
        { timeout: 2000 },
        (err, res) => {
          if (err) return;
          expect(res.exists).toBe(true);
          expect(res.cas).toBeNonZeroCAS();
          successCallback();
        }
      );

      await waitFor(() => {
        expect(successCallback).toHaveBeenCalled();
      });
    });

    test('should perform errored exists with callback', async function ({
      serverTestContext,
      expect,
    }) {
      expect.hasAssertions();
      const errorCallback = vi.fn();

      await serverTestContext.defaultCollection
        .exists('missingDocKey', (err, res) => {
          expect(err).toBeInstanceOf(Error);
          expect(res).toBeNull();
          errorCallback();
        })
        .catch(() => {
          /* we are simply waiting for the error */
        });

      await waitFor(() => expect(errorCallback).toHaveBeenCalled(), { timeout: 100 });
    });
  });
