/*
 * Copyright (c) 2023-Present Jonathan MASSUCHETTI <jonathan.massuchetti@dappit.fr>.
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
import { afterAll, beforeAll, describe, test } from 'vitest';

import { invariant, Keyspace } from '@cbjsdev/shared';
import {
  getCurrentTaskAsyncContext,
  KeyspaceIsolationPool,
  setKeyspaceIsolation,
} from '@cbjsdev/vitest/internal';

describe.sequential('keyspace isolation scope', () => {
  const pool = new KeyspaceIsolationPool();

  afterAll(async () => {
    await pool.destroyProvisionedBuckets();
  });

  describe('per-test', () => {
    beforeAll(() => {
      setKeyspaceIsolation('per-test');
    });

    let isolatedKeyspaceTestA: Keyspace | undefined = undefined;

    test('test a should create its own isolation', async () => {
      const { taskId } = getCurrentTaskAsyncContext();

      isolatedKeyspaceTestA = await pool.requireKeyspaceIsolation(taskId, {
        bucket: 'b',
        scope: 's',
        collection: 'c',
      });
    });

    test('test b should create its own isolation', async ({ expect }) => {
      const { taskId, keyspaceIsolationRealm } = getCurrentTaskAsyncContext();
      invariant(keyspaceIsolationRealm);

      const testIsolatedKeyspace = await pool.requireKeyspaceIsolation(taskId, {
        bucket: 'b',
        scope: 's',
        collection: 'c',
      });

      expect(testIsolatedKeyspace).not.toEqual(isolatedKeyspaceTestA);
    });
  });

  describe('per-suite', () => {
    beforeAll(() => {
      setKeyspaceIsolation('per-suite');
    });

    let isolatedKeyspaceSuiteA: Keyspace | undefined = undefined;
    let isolatedKeyspaceSuiteB: Keyspace | undefined = undefined;

    describe('suite a', () => {
      test('should isolate the required keyspace', async ({ expect }) => {
        const { taskId } = getCurrentTaskAsyncContext();

        isolatedKeyspaceSuiteA = await pool.requireKeyspaceIsolation(taskId, {
          bucket: 'b',
          scope: 's',
          collection: 'c',
        });
      });

      test('should reuse the keyspace isolation of the previous test', async ({
        expect,
      }) => {
        const { taskId, keyspaceIsolationRealm } = getCurrentTaskAsyncContext();
        invariant(keyspaceIsolationRealm);

        const testIsolatedKeyspace = await pool.requireKeyspaceIsolation(taskId, {
          bucket: 'b',
          scope: 's',
          collection: 'c',
        });

        expect(isolatedKeyspaceSuiteA).toEqual(testIsolatedKeyspace);
      });
    });

    describe('suite b', () => {
      test('should isolate the required keyspace', async ({ expect }) => {
        const { taskId } = getCurrentTaskAsyncContext();

        isolatedKeyspaceSuiteB = await pool.requireKeyspaceIsolation(taskId, {
          bucket: 'b',
          scope: 's',
          collection: 'c',
        });
      });

      test('should reuse the keyspace isolation of the previous test', async ({
        expect,
      }) => {
        const { taskId, keyspaceIsolationRealm } = getCurrentTaskAsyncContext();
        invariant(keyspaceIsolationRealm);

        const testIsolatedKeyspace = await pool.requireKeyspaceIsolation(taskId, {
          bucket: 'b',
          scope: 's',
          collection: 'c',
        });

        expect(isolatedKeyspaceSuiteB).toEqual(testIsolatedKeyspace);
        expect(isolatedKeyspaceSuiteB).not.toEqual(isolatedKeyspaceSuiteA);
      });
    });
  });

  describe('local', () => {
    beforeAll(() => {
      setKeyspaceIsolation('local');
    });

    let sharedIsolatedKeyspace: Keyspace | undefined = undefined;

    describe('suite a', () => {
      test('test a: should isolate the required keyspace', async () => {
        const { taskId } = getCurrentTaskAsyncContext();

        sharedIsolatedKeyspace = await pool.requireKeyspaceIsolation(taskId, {
          bucket: 'b',
          scope: 's',
          collection: 'c',
        });
      });

      test('test b: should reuse the shared keyspace isolation', async ({ expect }) => {
        const { taskId, keyspaceIsolationRealm } = getCurrentTaskAsyncContext();
        invariant(keyspaceIsolationRealm);

        const testIsolatedKeyspace = await pool.requireKeyspaceIsolation(taskId, {
          bucket: 'b',
          scope: 's',
          collection: 'c',
        });

        expect(testIsolatedKeyspace).toEqual(sharedIsolatedKeyspace);
      });
    });

    describe('suite b', () => {
      test('test a: should reuse the shared keyspace isolation', async ({ expect }) => {
        const { taskId } = getCurrentTaskAsyncContext();

        const testIsolatedKeyspace = await pool.requireKeyspaceIsolation(taskId, {
          bucket: 'b',
          scope: 's',
          collection: 'c',
        });

        expect(testIsolatedKeyspace).toEqual(sharedIsolatedKeyspace);
      });

      test('test b: should reuse the shared keyspace isolation', async ({ expect }) => {
        const { taskId, keyspaceIsolationRealm } = getCurrentTaskAsyncContext();
        invariant(keyspaceIsolationRealm);

        const testIsolatedKeyspace = await pool.requireKeyspaceIsolation(taskId, {
          bucket: 'b',
          scope: 's',
          collection: 'c',
        });

        expect(testIsolatedKeyspace).toEqual(sharedIsolatedKeyspace);
      });
    });
  });
});
