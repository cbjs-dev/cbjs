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
import { describe, it, vi } from 'vitest';

import { retryWhileClusterCatchesUp } from './retryWhileClusterCatchesUp.js';

/**
 * Error the SDK throws when the query service has not caught up with the collection the
 * cluster manager has created already, captured on a 7.6.4 cluster.
 */
function keyspaceNotFoundError() {
  return new Error('bucket not found', {
    cause: {
      http_body:
        '{"errors":[{"code":12003,"msg":"Keyspace not found in CB datastore: default:cbjs_c72778c4._default.c72778c4_0"}]}',
    },
  });
}

describe('retryWhileClusterCatchesUp', () => {
  it('should retry while the query service ignores the fresh keyspace', async ({
    expect,
  }) => {
    const fn = vi
      .fn()
      .mockRejectedValueOnce(keyspaceNotFoundError())
      .mockResolvedValueOnce('created');

    await expect(retryWhileClusterCatchesUp(fn)).resolves.toEqual('created');
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('should retry while a rebalance is in progress', async ({ expect }) => {
    const fn = vi
      .fn()
      .mockRejectedValueOnce(new Error('Rebalance in progress'))
      .mockResolvedValueOnce('created');

    await expect(retryWhileClusterCatchesUp(fn)).resolves.toEqual('created');
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('should throw any other error right away', async ({ expect }) => {
    const fn = vi.fn().mockRejectedValue(new Error('index already exists'));

    await expect(retryWhileClusterCatchesUp(fn)).rejects.toThrowError(
      'index already exists'
    );
    expect(fn).toHaveBeenCalledTimes(1);
  });
});
