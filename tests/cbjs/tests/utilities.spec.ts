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
import { setImmediate } from 'node:timers/promises';
import { describe, vi } from 'vitest';

import { connect, CouchbaseError } from '@cbjsdev/cbjs';
import { PromiseHelper } from '@cbjsdev/cbjs/internal';
import { invariant, waitFor } from '@cbjsdev/shared';
import { createCouchbaseTest } from '@cbjsdev/vitest';

describe('PromiseHelper', async () => {
  const test = await createCouchbaseTest();

  describe('wrap', async () => {
    test('should resolve with the result of the logic function', async ({ expect }) => {
      await expect(
        PromiseHelper.wrap<string>((cb) => {
          cb(null, 'Success!');
        })
      ).resolves.toEqual('Success!');
    });

    test('should throw the error of the logic function if the call is awaited', async ({
      expect,
    }) => {
      const error = new Error('Logic function error');

      await expect(
        PromiseHelper.wrap<string>((cb) => {
          cb(error, null);
        })
      ).rejects.toThrow(error);
    });

    test('should not throw the error of the logic function if the call is not awaited', async ({
      expect,
    }) => {
      const error = new Error('Logic function error');

      try {
        void PromiseHelper.wrap<string>((cb) => {
          cb(error, null);
        });
      } catch (err) {
        expect.fail('PromiseHelper.wrap has thrown while not awaited');
      }

      await setImmediate();
    });

    test('should invoke the callback with the result of the logic function', async ({
      expect,
    }) => {
      const userCallback = vi.fn();

      await PromiseHelper.wrap<string>((cb) => {
        cb(null, 'Success!');
      }, userCallback);

      expect(userCallback).toHaveBeenCalledExactlyOnceWith(null, 'Success!');
    });

    test('should invoke the callback with the error of the logic function', async ({
      expect,
    }) => {
      const userCallback = vi.fn();
      const error = new Error('Logic function error');

      void PromiseHelper.wrap<string>((cb) => {
        cb(error, null);
      }, userCallback);

      await setImmediate();

      expect(userCallback).toHaveBeenCalledExactlyOnceWith(error, null);
    });

    test('user callback error should not interrupt the execution', async ({ expect }) => {
      process.on('unhandledRejection', () => {
        // No-op but don't mark the test as failed
      });

      const userCallback = vi.fn((err, res) => {
        throw new Error('user callback error');
      });

      void PromiseHelper.wrap((cb) => {
        cb(null, 'success');
      }, userCallback);

      await setImmediate();

      expect(userCallback).toHaveBeenCalled();
    });

    test('user callback should not be called twice when it throws an error', async ({
      expect,
    }) => {
      const rejectionHandler = vi.fn();

      process.on('unhandledRejection', () => {
        rejectionHandler();
      });

      const userCallback = vi.fn((err, res) => {
        throw new Error('user callback error');
      });

      void PromiseHelper.wrap((cb) => {
        cb(null, 'success');
      }, userCallback);

      await setImmediate();

      expect(userCallback).toHaveBeenCalledOnce();
      expect(rejectionHandler).toHaveBeenCalledOnce();
    });

    test('error thrown when call is awaited should contain a valid stack when a kv operation fails', async ({
      expect,
      serverTestContext,
    }) => {
      expect.hasAssertions();

      try {
        await serverTestContext.collection.get('missingDoc');
      } catch (err) {
        expect(err).toBeInstanceOf(CouchbaseError);
        invariant(err instanceof CouchbaseError);

        expect(err.stack).toBeTypeOf('string');
        expect(err.stack).toContain('at Collection.get (');
      }
    });

    test('error thrown when call with callback should contain a valid stack when a kv operation fails', async ({
      expect,
      serverTestContext,
    }) => {
      expect.hasAssertions();
      const callback = vi.fn();

      await serverTestContext.collection
        .get('missingDoc', (err, res) => {
          invariant(err instanceof CouchbaseError);
          expect(err.stack).toContain('at Collection.get (');
          callback();
        })
        .catch(() => {
          /* we are simply waiting for the error */
        });

      await waitFor(() => {
        expect(callback).toHaveBeenCalled();
      });
    });
  });

  describe('wrapAsync', async () => {
    test('should resolve with the result of the logic function', async ({ expect }) => {
      await expect(
        PromiseHelper.wrapAsync(() => Promise.resolve('Success!'))
      ).resolves.toEqual('Success!');
    });

    test('should throw the error of the logic function if the call is awaited', async ({
      expect,
    }) => {
      const error = new Error('Logic function error');

      await expect(
        PromiseHelper.wrapAsync(() => Promise.reject<string>(error))
      ).rejects.toThrow(error);
    });

    test('should not throw the error of the logic function if the call is not awaited', async ({
      expect,
    }) => {
      const error = new Error('Logic function error');

      try {
        void PromiseHelper.wrapAsync(() => Promise.reject<string>(error));
      } catch (err) {
        expect.fail('PromiseHelper.wrapAsync has thrown while not awaited');
      }

      await setImmediate();
    });

    test('should invoke the callback with the result of the logic function', async ({
      expect,
    }) => {
      const userCallback = vi.fn();

      await PromiseHelper.wrapAsync(() => Promise.resolve('Success!'), userCallback);

      expect(userCallback).toHaveBeenCalledExactlyOnceWith(null, 'Success!');
    });

    test('should invoke the callback with the error of the logic function', async ({
      expect,
    }) => {
      const userCallback = vi.fn();
      const error = new Error('Logic function error');

      void PromiseHelper.wrapAsync(() => Promise.reject<string>(error), userCallback);

      await setImmediate();

      expect(userCallback).toHaveBeenCalledExactlyOnceWith(error, null);
    });

    test('user callback error should not interrupt the execution', async ({ expect }) => {
      process.on('unhandledRejection', () => {
        // No-op but don't mark the test as failed
      });

      const userCallback = vi.fn((err, res) => {
        throw new Error('user callback error');
      });

      void PromiseHelper.wrapAsync(() => Promise.resolve('Success!'), userCallback);

      await setImmediate();

      expect(userCallback).toHaveBeenCalled();
    });

    test('user callback should not be called twice when it throws an error', async ({
      expect,
    }) => {
      const rejectionHandler = vi.fn();

      process.on('unhandledRejection', () => {
        rejectionHandler();
      });

      const userCallback = vi.fn((err, res) => {
        throw new Error('user callback error');
      });

      void PromiseHelper.wrapAsync(() => Promise.resolve('Success!'), userCallback);

      await setImmediate();

      expect(userCallback).toHaveBeenCalledOnce();
      expect(rejectionHandler).toHaveBeenCalledOnce();
    });
  });
});
