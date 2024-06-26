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

import { getPool } from '../services/index.js';
import { requestGetUserGroup } from '../services/rbac/requests/requestGetUserGroup.js';
import { CouchbaseHttpApiConfig } from '../types.js';
import { mapNodes } from '../utils/mapNodes.js';
import { waitOptionsModerate } from './options.js';
import { WaitForOptions } from './types.js';

/**
 * Wait for the user group to be visible.
 */
export async function waitForUserGroup(
  apiConfig: CouchbaseHttpApiConfig,
  name: string,
  options?: WaitForOptions
): Promise<void> {
  const resolvedOptions = {
    ...waitOptionsModerate,
    ...options,
  };

  const { expectMissing } = resolvedOptions;

  return retry(async () => {
    const poolNodes = apiConfig.poolNodes ?? (await getPool(apiConfig));

    const requests = mapNodes(poolNodes, ({ hostname }) =>
      requestGetUserGroup({ ...apiConfig, hostname, poolNodes }, name)
    );

    const responses = await Promise.all(requests);
    const visible = responses.every((r) => r.status === 200);

    if (!expectMissing && !visible) throw new Error('UserGroup is not visible yet');
    if (expectMissing && visible) throw new Error('UserGroup is still visible');
  }, resolvedOptions);
}
