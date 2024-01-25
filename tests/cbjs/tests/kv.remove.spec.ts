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
import { invariant } from '@cbjs/shared';
import { describe } from 'vitest';
import { createCouchbaseTest } from '@cbjs/vitest';

import { DocumentNotFoundError, KeyValueErrorContext } from '@cbjs/cbjs';
import { getLargeTestDocument } from './kv._helpers';

describe.shuffle('kv remove', async () => {
  const test = await createCouchbaseTest(({ useDocumentKey }) => {
    return {
      testKeyA: useDocumentKey(),
      testObjVal: getLargeTestDocument(),
    };
  });

  test('should perform basic removes', async function ({
    serverTestContext,
    expect,
    testKeyA,
    testObjVal,
  }) {
    await serverTestContext.collection.insert(testKeyA, testObjVal);
    const res = await serverTestContext.collection.remove(testKeyA);

    expect(res.cas).toBeNonZeroCAS();
    expect(res.token).toBeMutationToken();
  });

  test('should perform basic remove with options and callback', async function ({
    serverTestContext,
    expect,
    testKeyA,
    testObjVal,
  }) {
    expect.hasAssertions();

    await serverTestContext.collection.insert(testKeyA, testObjVal);
    await serverTestContext.collection.remove(testKeyA, { timeout: 2000 }, (err, res) => {
      if (err) return;

      expect(res.cas).toBeNonZeroCAS();
      expect(res.token).toBeMutationToken();
    });
  });

  test('should fail to perform basic remove with options and callback when the document is missing', async function ({
    serverTestContext,
    expect,
    testKeyA,
  }) {
    expect.hasAssertions();

    try {
      await serverTestContext.collection.remove(testKeyA, (err, res) => {
        if (res) return;
        expect(err).toBeInstanceOf(DocumentNotFoundError);
        invariant(err instanceof DocumentNotFoundError);
        expect(err.context).toBeInstanceOf(KeyValueErrorContext);
      });
    } catch (err) {
      expect(err).toBeInstanceOf(DocumentNotFoundError);
      invariant(err instanceof DocumentNotFoundError);
      expect(err.context).toBeInstanceOf(KeyValueErrorContext);
    }
  });
});
