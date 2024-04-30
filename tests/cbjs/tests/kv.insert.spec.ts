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

import { DocumentExistsError, KeyValueErrorContext } from '@cbjsdev/cbjs';
import { invariant, waitFor } from '@cbjsdev/shared';
import { createCouchbaseTest } from '@cbjsdev/vitest';

import { getLargeTestDocument } from './kv._helpers.js';

describe.shuffle('kv insert', async () => {
  const test = await createCouchbaseTest(({ useDocumentKey }) => {
    return {
      testDocKey: useDocumentKey(),
      testDocContent: getLargeTestDocument(),
    };
  });

  test('should perform inserts correctly', async function ({
    serverTestContext,
    expect,
    testDocKey,
    testDocContent,
  }) {
    const res = await serverTestContext.collection.insert(testDocKey, testDocContent);
    expect(res.cas).toBeNonZeroCAS();
    expect(res.token).toBeMutationToken();
  });

  test('should throw a DocumentExistsError when inserting an existing doc key', async function ({
    serverTestContext,
    expect,
    testDocKey,
    testDocContent,
  }) {
    expect.hasAssertions();
    await serverTestContext.collection.insert(testDocKey, testDocContent);

    try {
      await serverTestContext.collection.insert(testDocKey, 'differentContent');
    } catch (err) {
      expect(err).toBeInstanceOf(DocumentExistsError);
      invariant(err instanceof DocumentExistsError);
      expect(err.context).toBeInstanceOf(KeyValueErrorContext);
    }
  });

  test('should perform inserts with callback', async function ({
    serverTestContext,
    expect,
    testDocKey,
    testDocContent,
  }) {
    expect.hasAssertions();

    await serverTestContext.collection.insert(testDocKey, testDocContent, (err, res) => {
      expect(err).toBeNull();
      expect(res?.cas).toBeNonZeroCAS();
      expect(res?.token).toBeMutationToken();
    });
  });

  test('should insert successfully using options and callback', async function ({
    serverTestContext,
    expect,
    testDocKey,
    testDocContent,
  }) {
    expect.hasAssertions();
    await serverTestContext.collection.insert(
      testDocKey,
      testDocContent,
      { expiry: 1 },
      (err, res) => {
        expect(err).toBeNull();
        expect(res?.cas).toBeNonZeroCAS();
        expect(res?.token).toBeMutationToken();
      }
    );

    await expect(serverTestContext.collection.get(testDocKey)).resolves.toBeDefined();
  });

  test('should throw a DocumentExistsError when inserting an existing doc key with callback', async function ({
    serverTestContext,
    expect,
    testDocKey,
    testDocContent,
  }) {
    expect.hasAssertions();
    const catchCallback = vi.fn();

    await serverTestContext.collection.insert(testDocKey, testDocContent);
    await serverTestContext.collection
      .insert(testDocKey, testDocContent, (err, res) => {
        expect(res).toBeNull();
        expect(err).toBeInstanceOf(DocumentExistsError);
        invariant(err instanceof DocumentExistsError);
        expect(err.context).toBeInstanceOf(KeyValueErrorContext);

        // JSCBC-1232
        // expect(err.context.bucket).toEqual(serverTestContext.bucket.name);
        // expect(err.context.scope).toEqual(serverTestContext.scope.name);
        // expect(err.context.collection).toEqual(serverTestContext.collection.name);

        catchCallback();
      })
      .catch(() => {
        /* we are simply waiting for the error */
      });

    await waitFor(() => expect(catchCallback).toHaveBeenCalled(), { timeout: 100 });
  });

  test('should insert with expiry successfully', async function ({
    serverTestContext,
    expect,
    testDocKey,
    testDocContent,
  }) {
    const res = await serverTestContext.collection.insert(testDocKey, testDocContent, {
      expiry: 1,
    });

    expect(res.cas).toBeNonZeroCAS();
    expect(res.token).toBeMutationToken();

    await waitFor(async () => {
      await expect(serverTestContext.collection.get(testDocKey)).rejects.toThrowError();
    });
  });
});
