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

import { CouchbaseError } from '@cbjsdev/cbjs';
import { invariant, waitFor } from '@cbjsdev/shared';
import { createCouchbaseTest } from '@cbjsdev/vitest';

describe('PromiseHelper', async () => {
  const test = await createCouchbaseTest();

  describe('wrap', async () => {
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

  describe.skip('wrapAsync', async () => {
    test('error thrown when call is awaited should contain a meaningful stack trace when a kv operation fails', async ({
      expect,
      serverTestContext,
    }) => {
      expect.hasAssertions();

      try {
        await serverTestContext.collection.getAnyReplica('missingDoc');
      } catch (err) {
        expect(err).toBeInstanceOf(CouchbaseError);
        invariant(err instanceof CouchbaseError);

        expect(err.stack).toBeTypeOf('string');
        expect(err.stack).toContain('at Collection.getAnyReplica');
      }
    });

    test('error thrown when call with callback should contain a meaningful stack trace when a kv operation fails', async ({
      expect,
      serverTestContext,
    }) => {
      expect.hasAssertions();
      const callback = vi.fn();

      async function callMe() {
        return serverTestContext.collection.getAnyReplica('missingDoc', (err, res) => {
          invariant(err instanceof CouchbaseError);
          expect(err.stack).toContain('at Collection.getAnyReplica (');
          callback();
        });
      }

      await expect(callMe()).rejects.toThrowError();

      await waitFor(() => {
        expect(callback).toHaveBeenCalled();
      });
    });
  });
});
