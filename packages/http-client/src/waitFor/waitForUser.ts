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
import { retry } from 'ts-retry-promise';

import { invariant } from '@cbjsdev/shared';

import { getHttpClientLogger } from '../logger.js';
import { getPool } from '../services/index.js';
import { requestGetUser } from '../services/rbac/requests/requestGetUser.js';
import { CouchbaseHttpApiConfig } from '../types.js';
import { mapNodes } from '../utils/mapNodes.js';
import { WaitForOptions } from './types.js';

/**
 * Will wait for the user to be visible on all nodes and that its definition is
 * the same on all nodes. This includes the domain, groups, roles and the password.
 */
export async function waitForUser(
  apiConfig: CouchbaseHttpApiConfig,
  username: string,
  domain = 'local',
  options?: WaitForOptions
): Promise<void> {
  const defaultOptions: WaitForOptions = {
    timeout: 10_000,
    expectMissing: false,
    logger: (msg) => getHttpClientLogger()?.trace(msg),
  };

  const resolvedOptions = {
    ...defaultOptions,
    ...options,
  };

  const { expectMissing } = resolvedOptions;

  return retry(async () => {
    const poolNodes = apiConfig.poolNodes ?? (await getPool(apiConfig));

    const requests = mapNodes(poolNodes, ({ hostname }) =>
      requestGetUser({ ...apiConfig, hostname, poolNodes }, username, domain)
    );

    // We check the user is present on all nodes
    const responses = await Promise.all(requests);
    const visible = responses.every((r) => r.status === 200);

    if (!expectMissing && !visible) throw new Error('User is not visible yet');
    if (expectMissing && visible) throw new Error('User is still visible');

    // We check the user has the same definition on all nodes
    const firstNodeUser = await responses.shift()?.text();
    invariant(firstNodeUser, 'First node user not found');

    const consistentUser = responses.every(
      async (r) => (await r.text()) === firstNodeUser
    );

    if (!consistentUser) {
      throw new Error('User mismatch between nodes');
    }
  }, resolvedOptions);
}
