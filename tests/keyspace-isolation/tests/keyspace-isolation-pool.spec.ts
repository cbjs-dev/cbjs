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
import { beforeAll, describe, test } from 'vitest';

import { invariant } from '@cbjsdev/shared';
import {
  getCurrentTaskAsyncContext,
  KeyspaceIsolationPool,
  setKeyspaceIsolation,
} from '@cbjsdev/vitest/internal';

describe('keyspace isolation pool', () => {
  beforeAll(() => {
    setKeyspaceIsolation('per-test');
  });

  test('should create the required bucket, scope and collection when none are provisioned', async ({
    expect,
  }) => {
    const pool = new KeyspaceIsolationPool();
    const { taskId } = getCurrentTaskAsyncContext();

    const isolatedKeyspace = await pool.requireKeyspaceIsolation(taskId, {
      bucket: 'b',
      scope: 's',
      collection: 'c',
    });

    expect(isolatedKeyspace.bucket).toEqual(expect.stringMatching(/^cbjs_b_/));
    expect(isolatedKeyspace.scope).toEqual(expect.stringMatching(/^cbjs_s_/));
    expect(isolatedKeyspace.collection).toEqual(expect.stringMatching(/^cbjs_c_/));

    await pool.dispose();
  });

  test('should fill the keyspace isolation realm when isolating a keyspace', async ({
    expect,
  }) => {
    const pool = new KeyspaceIsolationPool();
    const { taskId, keyspaceIsolationRealm } = getCurrentTaskAsyncContext();
    invariant(keyspaceIsolationRealm);

    await pool.requireKeyspaceIsolation(taskId, {
      bucket: 'b',
      scope: 's',
      collection: 'c',
    });

    expect(keyspaceIsolationRealm.isBucketIsolated('b')).toBe(true);
    expect(keyspaceIsolationRealm.isScopeIsolated('b', 's')).toBe(true);
    expect(keyspaceIsolationRealm.isCollectionIsolated('b', 's', 'c')).toBe(true);

    await pool.dispose();
  });
});
