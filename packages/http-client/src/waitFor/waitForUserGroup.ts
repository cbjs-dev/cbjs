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
import promiseRetry from 'promise-retry';

import { getPoolNodes } from '../services';
import { requestGetUserGroup } from '../services/rbac/requests/requestGetUserGroup';
import { CouchbaseHttpApiConfig } from '../types';
import { mapNodes } from '../utils/mapNodes';
import { getStandardRetryProfile } from '../utils/retryProfiles';
import { WaitForOptions } from './types';

export async function waitForUserGroup(
  apiConfig: CouchbaseHttpApiConfig,
  name: string,
  options: WaitForOptions = { timeout: 10_000 }
): Promise<void> {
  const timeout = options.timeout || 10_000;
  const expectMissing = options.expectMissing || false;
  const retryProfile = getStandardRetryProfile({ timeout });

  return promiseRetry(retryProfile, async (retry) => {
    const poolNodes = apiConfig.poolNodes ?? (await getPoolNodes(apiConfig));

    const requests = mapNodes(poolNodes, ({ hostname }) =>
      requestGetUserGroup({ ...apiConfig, hostname, poolNodes }, name)
    );

    const responses = await Promise.all(requests);
    const visible = responses.every((r) => r.status === 200);

    if (!expectMissing && !visible) retry('UserGroup is not visible yet');
    if (expectMissing && visible) retry('UserGroup is still visible');
  });
}
