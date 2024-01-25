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

import { createCouchbaseTest } from '@cbjs/vitest';
import { getLargeTestDocument } from './kv._helpers';
import { sleep } from '@cbjs/shared';

describe.shuffle('kv touch', async () => {
  const test = await createCouchbaseTest(({ useDocumentKey }) => {
    return {
      testDocKey: useDocumentKey(),
      testDocContent: getLargeTestDocument(),
    };
  });

  test(
    'should touch a document successfully',
    async function ({ serverTestContext, expect, testDocKey, testDocContent }) {
      const res = await serverTestContext.collection.insert(testDocKey, testDocContent, {
        expiry: 2,
      });

      expect(res.cas).toBeNonZeroCAS();
      expect(res.token).toBeMutationToken();

      // Ensure the key is there
      await expect(serverTestContext.collection.get(testDocKey)).resolves.toBeDefined();

      // Touch the document
      const touchResult = await serverTestContext.collection.touch(testDocKey, 8);
      expect(touchResult.cas).toBeNonZeroCAS();

      // Check the key is there after the initial expiry value
      await sleep(4000);
      await serverTestContext.collection.get(testDocKey);

      // Check the key has expired
      await sleep(6000);
      await expect(serverTestContext.collection.get(testDocKey)).rejects.toThrowError();
    },
    { timeout: 25_000 }
  );

  test(
    'should touch and get a document successfully',
    async function ({ serverTestContext, expect, testDocKey, testDocContent }) {
      // Insert a test document
      const res = await serverTestContext.collection.insert(testDocKey, testDocContent, {
        expiry: 3,
      });

      expect(res.cas).toBeNonZeroCAS();
      expect(res.token).toBeMutationToken();

      // Ensure the key is there
      await serverTestContext.collection.get(testDocKey);

      // Touch the document
      const getAndTouchResult = await serverTestContext.collection.getAndTouch(
        testDocKey,
        8
      );

      expect(getAndTouchResult.content).toEqual(testDocContent);
      expect(getAndTouchResult.cas).toBeNonZeroCAS();

      // Support legacy API
      expect(getAndTouchResult.value, getAndTouchResult.content);

      // Check the key is there after the initial expiry value
      await sleep(4000);
      await serverTestContext.collection.get(testDocKey);

      // Check the key has expired
      await sleep(5000);
      expect(() => serverTestContext.collection.get(testDocKey)).rejects.toThrowError();
    },
    { timeout: 15_000 }
  );
});
