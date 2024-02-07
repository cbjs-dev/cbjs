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
import { Buffer } from 'node:buffer';
import { beforeEach, describe, vi } from 'vitest';

import { DurabilityLevel } from '@cbjs/cbjs';
import { getPool } from '@cbjs/http-client';
import { invariant } from '@cbjs/shared';
import { createCouchbaseTest, TestFixtures } from '@cbjs/vitest';

import { apiConfig } from '../setupTests';
import { waitFor } from '../utils/waitFor';

describe.shuffle('kv binary', async () => {
  const test = await createCouchbaseTest(async ({ useDocumentKey }) => {
    return {
      testDocKey: useDocumentKey(),
      testDocContent: 14,
      replicaNumber: (await getPool(apiConfig).then((p) => p.nodes.length)) - 1,
    };
  });

  beforeEach<TestFixtures<typeof test>>(async function ({
    serverTestContext,
    testDocKey,
    testDocContent,
  }) {
    await serverTestContext.collection.insert(testDocKey, testDocContent, {
      timeout: 5000,
    });
  });

  describe('increment', function () {
    test('should increment successfully', async function ({
      serverTestContext,
      expect,
      testDocKey,
    }) {
      const res = await serverTestContext.collection.binary().increment(testDocKey, 3);

      expect(res.cas).toBeNonZeroCAS();
      expect(res.value).toEqual(17);
      expect(res.token).toBeMutationToken();

      const gres = await serverTestContext.collection.get(testDocKey);
      expect(gres.value).toEqual(17);
    });

    test('should increment successfully with server durability', async function ({
      serverTestContext,
      expect,
      testDocKey,
    }) {
      const res = await serverTestContext.collection
        .binary()
        .increment(testDocKey, 3, { durabilityLevel: DurabilityLevel.PersistToMajority });

      expect(res.cas).toBeNonZeroCAS();
      expect(res.value).toEqual(17);
      expect(res.token).toBeMutationToken();

      const gres = await serverTestContext.collection.get(testDocKey);
      expect(gres.value).toEqual(17);
    });

    test('should increment successfully with client durability', async function ({
      serverTestContext,
      expect,
      testDocKey,
      replicaNumber,
    }) {
      const res = await serverTestContext.collection.binary().increment(testDocKey, 3, {
        durabilityPersistTo: 1,
        durabilityReplicateTo: replicaNumber,
      });

      expect(res.cas).toBeNonZeroCAS();
      expect(res.value).toEqual(17);
      expect(res.token).toBeMutationToken();

      const gres = await serverTestContext.collection.get(testDocKey);
      expect(gres.value).toEqual(17);
    });

    test('should increment successfully with callback', async function ({
      serverTestContext,
      expect,
      testDocKey,
    }) {
      expect.hasAssertions();
      const successCallback = vi.fn();

      await serverTestContext.collection.binary().increment(testDocKey, 3, (err, res) => {
        if (err) return;

        expect(res.cas).toBeNonZeroCAS();
        expect(res.value).toEqual(17);
        expect(res.token).toBeMutationToken();

        void serverTestContext.collection.get(testDocKey, (err, gres) => {
          if (err) return;
          expect(gres.value).toEqual(17);
          successCallback();
        });
      });

      await waitFor(
        async () => {
          expect(successCallback).toHaveBeenCalled();
        },
        { timeout: 1_000, retryInterval: 100 }
      );
    });

    test('should increment successfully with options and callback', async function ({
      serverTestContext,
      expect,
      testDocKey,
    }) {
      expect.hasAssertions();
      const successCallback = vi.fn();

      await serverTestContext.collection
        .binary()
        .increment(testDocKey, 3, { timeout: 2000 }, (err, res) => {
          if (err) return;

          expect(res.cas).toBeNonZeroCAS();
          expect(res.value).toEqual(17);
          expect(res.token).toBeMutationToken();

          void serverTestContext.collection.get(testDocKey, (err, gres) => {
            if (err) return;
            expect(gres.value).toEqual(17);
            successCallback();
          });
        });

      await waitFor(
        async () => {
          expect(successCallback).toHaveBeenCalled();
        },
        { timeout: 1_000, retryInterval: 100 }
      );
    });
  });

  describe('decrement', function () {
    test('should decrement successfully', async function ({
      serverTestContext,
      expect,
      testDocKey,
    }) {
      const res = await serverTestContext.collection.binary().decrement(testDocKey, 4);
      expect(res.cas).toBeNonZeroCAS();
      expect(res.value).toEqual(10);
      expect(res.token).toBeMutationToken();

      const gres = await serverTestContext.collection.get(testDocKey);
      expect(gres.value).toEqual(10);
    });

    test('should decrement successfully with server durability', async function ({
      serverTestContext,
      expect,
      testDocKey,
    }) {
      const res = await serverTestContext.collection
        .binary()
        .decrement(testDocKey, 4, { durabilityLevel: DurabilityLevel.PersistToMajority });
      expect(res.cas).toBeNonZeroCAS();
      expect(res.value).toEqual(10);
      expect(res.token).toBeMutationToken();

      const gres = await serverTestContext.collection.get(testDocKey);
      expect(gres.value).toEqual(10);
    });

    test('should decrement successfully with client durability', async function ({
      serverTestContext,
      expect,
      testDocKey,
      replicaNumber,
    }) {
      const res = await serverTestContext.collection.binary().decrement(testDocKey, 4, {
        durabilityPersistTo: 1,
        durabilityReplicateTo: replicaNumber,
      });
      expect(res.cas).toBeNonZeroCAS();
      expect(res.value).toEqual(10);
      expect(res.token).toBeMutationToken();

      const gres = await serverTestContext.collection.get(testDocKey);
      expect(gres.value).toEqual(10);
    });

    test('should decrement successfully with callback', async function ({
      serverTestContext,
      expect,
      testDocKey,
    }) {
      expect.hasAssertions();
      const successCallback = vi.fn();

      await serverTestContext.collection
        .binary()
        .decrement(testDocKey, 4, { timeout: 2000 }, (err, res) => {
          if (err) return;

          expect(res.cas).toBeNonZeroCAS();
          expect(res.value).toEqual(10);
          expect(res.token).toBeMutationToken();

          void serverTestContext.collection.get(testDocKey, (err, gres) => {
            if (err) return;
            expect(gres.value).toEqual(10);
            successCallback();
          });
        });

      await waitFor(
        async () => {
          expect(successCallback).toHaveBeenCalled();
        },
        { timeout: 1_000, retryInterval: 100 }
      );
    });

    test('should decrement successfully with options and callback', async function ({
      serverTestContext,
      expect,
      testDocKey,
    }) {
      expect.hasAssertions();
      const successCallback = vi.fn();

      await serverTestContext.collection
        .binary()
        .decrement(testDocKey, 4, { timeout: 2000 }, (err, res) => {
          if (err) return;

          expect(res.cas).toBeNonZeroCAS();
          expect(res.value).toEqual(10);
          expect(res.token).toBeMutationToken();

          void serverTestContext.collection.get(testDocKey, (err, gres) => {
            if (err) return;
            expect(gres.value).toEqual(10);
            successCallback();
          });
        });

      await waitFor(
        async () => {
          expect(successCallback).toHaveBeenCalled();
        },
        { timeout: 1_000, retryInterval: 100 }
      );
    });
  });

  describe('append', function () {
    test('should append successfully', async function ({
      serverTestContext,
      expect,
      testDocKey,
    }) {
      const res = await serverTestContext.collection.binary().append(testDocKey, 'after');

      expect(res.cas).toBeNonZeroCAS();
      expect(res.token).toBeMutationToken();

      const gres = await serverTestContext.collection.get(testDocKey);

      expect(Buffer.isBuffer(gres.value)).toBe(true);
      invariant(gres.value instanceof Buffer);

      expect(gres.value.toString()).toEqual('14after');
    });

    test('should append successfully with server durability', async function ({
      serverTestContext,
      expect,
      testDocKey,
    }) {
      const res = await serverTestContext.collection
        .binary()
        .append(testDocKey, 'after', {
          durabilityLevel: DurabilityLevel.PersistToMajority,
        });

      expect(res.cas).toBeNonZeroCAS();
      expect(res.token).toBeMutationToken();

      const gres = await serverTestContext.collection.get(testDocKey);

      expect(Buffer.isBuffer(gres.value)).toBe(true);
      invariant(gres.value instanceof Buffer);

      expect(gres.value.toString()).toEqual('14after');
    });

    test('should append successfully with client durability', async function ({
      serverTestContext,
      expect,
      testDocKey,
      replicaNumber,
    }) {
      const res = await serverTestContext.collection
        .binary()
        .append(testDocKey, 'after', {
          durabilityPersistTo: 1,
          durabilityReplicateTo: replicaNumber,
        });

      expect(res.cas).toBeNonZeroCAS();
      expect(res.token).toBeMutationToken();

      const gres = await serverTestContext.collection.get(testDocKey);

      expect(Buffer.isBuffer(gres.value)).toBe(true);
      invariant(gres.value instanceof Buffer);

      expect(gres.value.toString()).toEqual('14after');
    });

    test('should append successfully with callback', async function ({
      serverTestContext,
      expect,
      testDocKey,
    }) {
      expect.hasAssertions();
      const successCallback = vi.fn();

      await serverTestContext.collection
        .binary()
        .append(testDocKey, 'after', (err, res) => {
          if (err) return;

          expect(res.cas).toBeNonZeroCAS();
          expect(res.token).toBeMutationToken();

          void serverTestContext.collection.get(testDocKey, (err, gres) => {
            if (err) return;
            expect(Buffer.isBuffer(gres.value)).toBe(true);

            invariant(gres.value instanceof Buffer);

            expect(gres.value.toString()).toEqual('14after');
            successCallback();
          });
        });

      await waitFor(
        async () => {
          expect(successCallback).toHaveBeenCalled();
        },
        { timeout: 1_000, retryInterval: 100 }
      );
    });

    test('should append successfully with options and callback', async function ({
      serverTestContext,
      expect,
      testDocKey,
    }) {
      expect.hasAssertions();
      const successCallback = vi.fn();

      await serverTestContext.collection
        .binary()
        .append(testDocKey, 'after', { timeout: 2000 }, (err, res) => {
          if (err) return;

          expect(res.cas).toBeNonZeroCAS();
          expect(res.token).toBeMutationToken();

          void serverTestContext.collection.get(testDocKey, (err, gres) => {
            if (err) return;
            expect(Buffer.isBuffer(gres.value)).toBe(true);

            invariant(gres.value instanceof Buffer);

            expect(gres.value.toString()).toEqual('14after');
            successCallback();
          });
        });

      await waitFor(
        async () => {
          expect(successCallback).toHaveBeenCalled();
        },
        { timeout: 1_000, retryInterval: 100 }
      );
    });
  });

  describe('prepend', function () {
    test('should prepend successfully', async function ({
      serverTestContext,
      expect,
      testDocKey,
    }) {
      const res = await serverTestContext.collection
        .binary()
        .prepend(testDocKey, 'before');
      expect(res.cas).toBeNonZeroCAS();
      expect(res.token).toBeMutationToken();

      const gres = await serverTestContext.collection.get(testDocKey);
      expect(Buffer.isBuffer(gres.value)).toBe(true);

      invariant(gres.value instanceof Buffer);

      expect(gres.value.toString()).toEqual('before14');
    });

    test('should prepend successfully with server durability', async function ({
      serverTestContext,
      expect,
      testDocKey,
    }) {
      const res = await serverTestContext.collection
        .binary()
        .prepend(testDocKey, 'before', {
          durabilityLevel: DurabilityLevel.PersistToMajority,
        });
      expect(res.cas).toBeNonZeroCAS();
      expect(res.token).toBeMutationToken();

      const gres = await serverTestContext.collection.get(testDocKey);
      expect(Buffer.isBuffer(gres.value)).toBe(true);

      invariant(gres.value instanceof Buffer);

      expect(gres.value.toString()).toEqual('before14');
    });

    test('should prepend successfully with client durability', async function ({
      serverTestContext,
      expect,
      testDocKey,
      replicaNumber,
    }) {
      const res = await serverTestContext.collection
        .binary()
        .prepend(testDocKey, 'before', {
          durabilityPersistTo: 1,
          durabilityReplicateTo: replicaNumber,
        });
      expect(res.cas).toBeNonZeroCAS();
      expect(res.token).toBeMutationToken();

      const gres = await serverTestContext.collection.get(testDocKey);
      expect(Buffer.isBuffer(gres.value)).toBe(true);

      invariant(gres.value instanceof Buffer);

      expect(gres.value.toString()).toEqual('before14');
    });

    test('should prepend successfully with callback', async function ({
      serverTestContext,
      expect,
      testDocKey,
    }) {
      expect.hasAssertions();
      const successCallback = vi.fn();

      await serverTestContext.collection
        .binary()
        .prepend(testDocKey, 'before', (err, res) => {
          if (err) return;

          expect(res.cas).toBeNonZeroCAS();
          expect(res.token).toBeMutationToken();

          void serverTestContext.collection.get(testDocKey, (err, gres) => {
            if (err) return;
            expect(Buffer.isBuffer(gres.value)).toBe(true);

            invariant(gres.value instanceof Buffer);

            expect(gres.value.toString()).toEqual('before14');
            successCallback();
          });
        });

      await waitFor(
        async () => {
          expect(successCallback).toHaveBeenCalled();
        },
        { timeout: 1_000, retryInterval: 100 }
      );
    });

    test('should prepend successfully with options and callback', async function ({
      serverTestContext,
      expect,
      testDocKey,
    }) {
      expect.hasAssertions();
      const successCallback = vi.fn();

      await serverTestContext.collection
        .binary()
        .prepend(testDocKey, 'before', { timeout: 2000 }, (err, res) => {
          if (err) return;

          expect(res.cas).toBeNonZeroCAS();
          expect(res.token).toBeMutationToken();

          void serverTestContext.collection.get(testDocKey, (err, gres) => {
            if (err) return;
            expect(Buffer.isBuffer(gres.value)).toBe(true);

            invariant(gres.value instanceof Buffer);

            expect(gres.value.toString()).toEqual('before14');
            successCallback();
          });
        });

      await waitFor(
        async () => {
          expect(successCallback).toHaveBeenCalled();
        },
        { timeout: 1_000, retryInterval: 100 }
      );
    });
  });
});
