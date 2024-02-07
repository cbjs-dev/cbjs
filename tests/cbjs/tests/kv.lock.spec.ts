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
import { beforeEach, describe } from 'vitest';

import {
  AmbiguousTimeoutError,
  CasMismatchError,
  CouchbaseCas,
  DocumentLockedError,
  KeyValueErrorContext,
} from '@cbjs/cbjs';
import { getPool } from '@cbjs/http-client';
import { invariant } from '@cbjs/shared';
import { createCouchbaseTest, TestFixtures } from '@cbjs/vitest';

import { apiConfig } from '../setupTests';
import { serverVersionSatisfies } from '../utils/testConditions/serverVersionSatisfies';

describe.shuffle(
  'kv lock',
  async () => {
    const test = await createCouchbaseTest(async ({ useDocumentKey }) => {
      return {
        testDocKey: useDocumentKey(),
        testDocContent: { title: 'hello' },
        replicaNumber: await getPool(apiConfig).then((p) => p.nodes.length),
      };
    });

    beforeEach<TestFixtures<typeof test>>(async function ({
      serverTestContext,
      testDocKey,
      testDocContent,
    }) {
      await serverTestContext.collection.insert(testDocKey, testDocContent);
    });

    test('should be able to lock a document', async ({
      expect,
      serverTestContext,
      testDocKey,
    }) => {
      const res = await serverTestContext.collection.getAndLock(testDocKey, 2);

      expect(res.cas).toBeNonZeroCAS();
      expect(res.value).toEqual({ title: 'hello' });
    });

    test('should return an invalid CAS when getting a locked document', async ({
      expect,
      serverTestContext,
      testDocKey,
    }) => {
      const resultLock = await serverTestContext.collection.getAndLock(testDocKey, 5);
      const resultGet = await serverTestContext.collection.get(testDocKey);

      expect(CouchbaseCas.isEqual(resultLock.cas, resultGet.cas)).toBe(false);
    });

    test.runIf(serverVersionSatisfies('<= 7.2.3'))(
      'should throw AmbiguousTimeoutError when locking a document that is already locked',
      async ({ expect, serverTestContext, testDocKey }) => {
        expect.hasAssertions();
        await serverTestContext.collection.getAndLock(testDocKey, 5);

        try {
          await serverTestContext.collection.getAndLock(testDocKey, 2, {
            timeout: 2_000,
          });
        } catch (err) {
          expect(err).toBeInstanceOf(AmbiguousTimeoutError);
          invariant(err instanceof AmbiguousTimeoutError);
          expect(err.context).toBeInstanceOf(KeyValueErrorContext);
        }
      }
    );

    // Waiting for the bug to be fixed on Couchbase Server.
    test.skip('should throw DocumentLockedError when locking a document that is already locked', async ({
      expect,
      serverTestContext,
      testDocKey,
    }) => {
      await serverTestContext.collection.getAndLock(testDocKey, 5);
      await expect(
        serverTestContext.collection.getAndLock(testDocKey, 5)
      ).rejects.toThrowError(DocumentLockedError);
    });

    test('should be able to mutate a locked document with the correct CAS', async ({
      expect,
      serverTestContext,
      testDocKey,
    }) => {
      const res = await serverTestContext.collection.getAndLock(testDocKey, 5);

      const replaceResult = await serverTestContext.collection.replace(
        testDocKey,
        { title: 'Hello' },
        { cas: res.cas }
      );

      expect(replaceResult.cas).toBeNonZeroCAS();
      expect(replaceResult.token).toBeMutationToken();
    });

    test('should be able to lock a document once mutated', async ({
      expect,
      serverTestContext,
      testDocKey,
    }) => {
      const res = await serverTestContext.collection.getAndLock(testDocKey, 5);

      const replaceResult = await serverTestContext.collection.replace(
        testDocKey,
        { title: 'Hello' },
        { cas: res.cas }
      );

      expect(replaceResult.cas).toBeNonZeroCAS();
      expect(replaceResult.token).toBeMutationToken();

      await expect(
        serverTestContext.collection.getAndLock(testDocKey, 2)
      ).resolves.toBeDefined();
    });

    // Wait for Couchbase to fix this
    // For the test to be meaningful, the lock must expire after the kv operation times out.
    test.skip('should throw CasMismatchError when mutating a locked document with an incorrect CAS', async ({
      expect,
      serverTestContext,
      testDocKey,
    }) => {
      await serverTestContext.collection.getAndLock(testDocKey, 3);

      try {
        await serverTestContext.collection.replace(
          testDocKey,
          { title: 'Hello' },
          { cas: CouchbaseCas.from(100), timeout: 1_000 }
        );
      } catch (err) {
        expect(err).toBeInstanceOf(CasMismatchError);
        invariant(err instanceof CasMismatchError);
        expect(err.context).toBeInstanceOf(KeyValueErrorContext);
      }
    });

    test('should unlock the document with the correct CAS', async ({
      expect,
      serverTestContext,
      testDocKey,
    }) => {
      const res = await serverTestContext.collection.getAndLock(testDocKey, 5);
      await expect(
        serverTestContext.collection.unlock(testDocKey, res.cas)
      ).resolves.toBeUndefined();

      await expect(
        serverTestContext.collection.replace(testDocKey, { title: 'Hello' })
      ).resolves.toBeDefined();
    });

    test('should throw DocumentLockedError when unlocking a document with the wrong CAS', async ({
      expect,
      serverTestContext,
      testDocKey,
    }) => {
      await serverTestContext.collection.getAndLock(testDocKey, 5);

      try {
        await serverTestContext.collection.unlock(testDocKey, CouchbaseCas.from(100));
      } catch (err) {
        expect(err).toBeInstanceOf(DocumentLockedError);
        invariant(err instanceof DocumentLockedError);
        expect(err.context).toBeInstanceOf(KeyValueErrorContext);
      }
    });
  },
  { timeout: 20_000 }
);
