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

import { createCouchbaseTest, TestFixtures } from '@cbjsdev/vitest';

import { ServerFeatures, serverSupportsFeatures } from '../utils/serverFeature';
import { waitFor } from '../utils/waitFor';
import {
  getBinaryTestDocument,
  getLargeTestDocument,
  getUtf8TestDocument,
} from './kv._helpers';

describe.shuffle('kv get', async () => {
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

  beforeEach<TestFixtures<typeof test>>(
    async ({ serverTestContext, testKeyA, testObjVal }) => {
      await serverTestContext.collection.upsert(testKeyA, testObjVal);
    }
  );

  const errorTranscoder = {
    encode: () => {
      throw new Error('encode error');
    },
    decode: () => {
      throw new Error('decode error');
    },
  };

  test('should perform basic gets', async function ({
    serverTestContext,
    expect,
    testKeyA,
    testObjVal,
  }) {
    await serverTestContext.collection.upsert(testKeyA, testObjVal);
    const res = await serverTestContext.collection.get(testKeyA);
    expect(res.value).toStrictEqual(testObjVal);

    // Support legacy API
    expect(res.value).toStrictEqual(res.content);
  });

  test('should fetch utf8 documents', async function ({
    serverTestContext,
    expect,
    testKeyUtf8,
    testUtf8Val,
  }) {
    await serverTestContext.collection.upsert(testKeyUtf8, testUtf8Val);
    const res = await serverTestContext.collection.get(testKeyUtf8);
    expect(res.value).toStrictEqual(testUtf8Val);
  });

  test('should fetch binary documents', async function ({
    serverTestContext,
    expect,
    testKeyBin,
    testBinVal,
  }) {
    await serverTestContext.collection.upsert(testKeyBin, testBinVal);
    const res = await serverTestContext.collection.get(testKeyBin);
    expect(res.value).toStrictEqual(testBinVal);
  });

  test('should not crash on transcoder errors', async function ({
    serverTestContext,
    expect,
    testKeyA,
    testObjVal,
  }) {
    await serverTestContext.collection.upsert(testKeyA, testObjVal);

    await expect(
      serverTestContext.collection.get(testKeyA, {
        transcoder: errorTranscoder,
      })
    ).rejects.toThrowError('decode error');
  });

  test('should perform basic gets with callback', async function ({
    serverTestContext,
    expect,
    testKeyA,
    testObjVal,
  }) {
    expect.hasAssertions();

    await serverTestContext.collection.get(testKeyA, (err, res) => {
      if (err) {
        return;
      }

      expect(res.content).toStrictEqual(testObjVal);
    });
  });

  test('should not swallow the error when a callback is given', async function ({
    serverTestContext,
    expect,
  }) {
    expect.hasAssertions();
    const opCallback = vi.fn();
    const catchCallback = vi.fn();

    try {
      await serverTestContext.co.get('missingDocKey', (err, res) => {
        expect(err).toBeDefined();
        expect(res).toBeNull();
        opCallback();
      });
    } catch (err) {
      expect(err).toBeDefined();
      catchCallback();
    }

    await waitFor(() => expect(opCallback).toHaveBeenCalled(), { timeout: 100 });
    await waitFor(() => expect(catchCallback).toHaveBeenCalled(), { timeout: 100 });
  });

  test('should perform projected gets', async function ({
    serverTestContext,
    expect,
    testKeyA,
  }) {
    const res = await serverTestContext.collection.get(testKeyA, {
      project: ['baz'],
    });
    expect(res.cas).toBeNonZeroCAS();
    expect(res.content).toEqual({ baz: 19 });

    // Support legacy API
    expect(res.value).toStrictEqual(res.content);
  });

  test('should perform projected gets with callback', async function ({
    serverTestContext,
    expect,
    testKeyA,
  }) {
    expect.hasAssertions();

    await serverTestContext.collection.get(testKeyA, { project: ['baz'] }, (err, res) => {
      if (err) {
        return;
      }

      expect(res).toBeDefined();
      expect(res.cas).toBeNonZeroCAS();
      expect(res.content).toEqual({ baz: 19 });
    });
  });

  test.runIf(serverSupportsFeatures(ServerFeatures.Xattr))(
    'should fall back to full get projection',
    async function ({ serverTestContext, expect, testKeyA }) {
      const res = await serverTestContext.collection.get(testKeyA, {
        project: [
          'c',
          'd',
          'e',
          'f',
          'g',
          'h',
          'i',
          'j',
          'k',
          'l',
          'm',
          'n',
          'o',
          'p',
          'q',
          'r',
        ],
        withExpiry: true,
      });

      expect(res.expiry).toBeTypeOf('number');
      expect(res.content).toEqual({
        c: 1,
        d: 'str',
        e: true,
        f: false,
        g: 5,
        h: 6,
        i: 7,
        j: 8,
        k: 9,
        l: 10,
        m: 11,
        n: 12,
        o: 13,
        p: 14,
        q: 15,
        r: 16,
      });

      // BUG JSCBC-784: Check to make sure that the value property
      // returns the same as the content property.
      expect(res.value).toStrictEqual(res.content);
    }
  );
});
