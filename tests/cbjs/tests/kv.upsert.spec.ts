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
import { describe, vi } from 'vitest';

import { createCouchbaseTest } from '@cbjsdev/vitest';

import { ServerFeatures, serverSupportsFeatures } from '../utils/serverFeature';
import { waitForFailure } from '../utils/waitForFailure';
import {
  getBinaryTestDocument,
  getLargeTestDocument,
  getUtf8TestDocument,
} from './kv._helpers';

describe.shuffle('kv upsert', async () => {
  const test = await createCouchbaseTest(({ useDocumentKey }) => {
    return {
      testKeyA: useDocumentKey(),
      testKeyUtf8: useDocumentKey(),
      testKeyBin: useDocumentKey(),
      testObjVal: getLargeTestDocument(),
      testUtf8Val: getUtf8TestDocument(),
      testBinVal: getBinaryTestDocument(),
    };
  });

  const errorTranscoder = {
    encode: () => {
      throw new Error('encode error');
    },
    decode: () => {
      throw new Error('decode error');
    },
  };

  test('should perform basic upserts', async function ({
    serverTestContext,
    expect,
    testKeyA,
    testObjVal,
  }) {
    const res = await serverTestContext.collection.upsert(testKeyA, testObjVal);
    expect(res.token).toBeMutationToken();
  });

  test('should perform basic upserts with callback', async function ({
    serverTestContext,
    expect,
    testKeyA,
    testObjVal,
  }) {
    expect.hasAssertions();
    await serverTestContext.collection.upsert(testKeyA, testObjVal, (err, res) => {
      if (err) return;

      expect(res?.token).toBeMutationToken();
    });
  });

  test('should upsert successfully using options and callback', async function ({
    serverTestContext,
    expect,
  }) {
    const testKeyOpts = serverTestContext.newUid();

    const successCallback = vi.fn();
    const errorCallback = vi.fn();

    // Upsert a test document
    await serverTestContext.collection.upsert(
      testKeyOpts,
      { foo: 14 },
      { expiry: 1 },
      (err, res) => {
        if (err) {
          return errorCallback();
        }

        expect(res).toBeDefined();
        successCallback();
      }
    );

    await expect(serverTestContext.collection.get(testKeyOpts)).resolves.toBeDefined();

    expect(successCallback).toHaveBeenCalled();
    expect(errorCallback).not.toHaveBeenCalled();
  });

  test('should upsert with UTF8 data properly', async function ({
    serverTestContext,
    expect,
    testKeyUtf8,
    testUtf8Val,
  }) {
    const res = await serverTestContext.collection.upsert(testKeyUtf8, testUtf8Val);
    expect(res).toBeDefined();
  });

  test('should upsert with binary data properly', async function ({
    serverTestContext,
    expect,
    testKeyBin,
    testBinVal,
  }) {
    const res = await serverTestContext.collection.upsert(testKeyBin, testBinVal);
    expect(res).toBeDefined();
  });

  test('should not crash on transcoder errors', async function ({
    serverTestContext,
    expect,
    testKeyA,
    testObjVal,
  }) {
    await expect(
      serverTestContext.collection.upsert(testKeyA, testObjVal, {
        transcoder: errorTranscoder,
      })
    ).rejects.toThrowError('encode error');
  });

  test.runIf(serverSupportsFeatures(ServerFeatures.PreserveExpiry))(
    'should preserve expiry successfully',
    async function ({ serverTestContext, expect, useDocumentKey }) {
      const docKey = useDocumentKey();
      const res = await serverTestContext.collection.insert(
        docKey,
        { foo: 14 },
        { expiry: 1 }
      );
      expect(res).toBeDefined();

      await serverTestContext.collection.upsert(
        docKey,
        { foo: 13 },
        {
          preserveExpiry: true,
        }
      );

      await expect(() =>
        waitForFailure(() => serverTestContext.collection.get(docKey))
      ).rejects.toThrowError();
    }
  );
});
