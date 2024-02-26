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

import { CasMismatchError, DefaultTranscoder, KeyValueErrorContext } from '@cbjsdev/cbjs';
import { invariant } from '@cbjsdev/shared';
import { createCouchbaseTest, TestFixtures } from '@cbjsdev/vitest';

import { waitFor } from '../utils/waitFor';
import { getLargeTestDocument } from './kv._helpers';

describe.shuffle('kv replace', async () => {
  const test = await createCouchbaseTest(({ useDocumentKey }) => {
    return {
      testDocKey: useDocumentKey(),
      testDocContent: getLargeTestDocument(),
    };
  });

  beforeEach<TestFixtures<typeof test>>(
    async ({ serverTestContext, testDocKey, testDocContent }) => {
      await serverTestContext.collection.upsert(testDocKey, 'initialValue');
    }
  );

  test('should replace data correctly', async function ({
    serverTestContext,
    expect,
    testDocKey,
    testDocContent,
  }) {
    const res = await serverTestContext.collection.replace(testDocKey, testDocContent);
    expect(res);
    expect(res.cas).toBeNonZeroCAS();
    expect(res.token).toBeMutationToken();

    const gres = await serverTestContext.collection.get(testDocKey);
    expect(gres.value).toStrictEqual(testDocContent);
  });

  test('should perform replace with callback', async function ({
    serverTestContext,
    expect,
    testDocKey,
    testDocContent,
  }) {
    const deepGetCallback = vi.fn();

    await serverTestContext.collection.replace(testDocKey, testDocContent, (err, res) => {
      if (err) return;

      expect(res.cas).toBeNonZeroCAS();
      expect(res.token).toBeMutationToken();

      void serverTestContext.collection.get(testDocKey, (err, res) => {
        if (err) return;
        expect(res?.value).toEqual(testDocContent);
        deepGetCallback();
      });
    });

    await waitFor(() => {
      expect(deepGetCallback).toHaveBeenCalled();
    });
  });

  test('should perform replace with options and callback', async function ({
    serverTestContext,
    expect,
    testDocKey,
    testDocContent,
  }) {
    const deepGetCallback = vi.fn();

    const tc = new DefaultTranscoder();
    await serverTestContext.collection.replace(
      testDocKey,
      testDocContent,
      { transcoder: tc },
      (err, res) => {
        if (err) return;

        expect(res.cas).toBeNonZeroCAS();
        expect(res.token).toBeMutationToken();

        void serverTestContext.collection.get(testDocKey, (err, res) => {
          if (err) return;
          expect(res?.value).toEqual(testDocContent);
          deepGetCallback();
        });
      }
    );

    await waitFor(() => {
      expect(deepGetCallback).toHaveBeenCalled();
    });
  });

  test('should cas mismatch when replacing with wrong cas', async function ({
    serverTestContext,
    expect,
    testDocKey,
    testDocContent,
  }) {
    expect.hasAssertions();
    const getRes = await serverTestContext.collection.get(testDocKey);
    await serverTestContext.collection.replace(testDocKey, 'changedValue');

    try {
      await serverTestContext.collection.replace(testDocKey, testDocContent, {
        cas: getRes.cas,
      });
    } catch (err) {
      expect(err).toBeInstanceOf(CasMismatchError);
      invariant(err instanceof CasMismatchError);
      expect(err.context).toBeInstanceOf(KeyValueErrorContext);
    }
  });
});
