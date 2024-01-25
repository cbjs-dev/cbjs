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

import { getPoolNodes } from '../services/cluster/getPoolNodes';
import { getScopes } from '../services/kv/getScopes';
import { CouchbaseApiConfig, WaitForOptions } from '../types';
import { mapNodes } from '../utils/mapNodes';
import { getStandardRetryProfile } from '../utils/retryProfiles';

export async function waitForScope(
  params: CouchbaseApiConfig,
  bucketName: string,
  scopeName: string,
  options: WaitForOptions = { timeout: 10_000 }
) {
  const timeout = options.timeout || 10_000;
  const expectMissing = options.expectMissing || false;

  return promiseRetry(getStandardRetryProfile({ timeout }), async (retry) => {
    const poolNodes = await getPoolNodes(params);

    const requests = mapNodes(poolNodes, ({ hostname }) =>
      getScopes({ ...params, hostname }, bucketName)
    );

    const responses = await Promise.all(requests);
    const visible = responses.every((r) => r.scopes.find((s) => s.name === scopeName));

    if (!expectMissing && !visible) retry('Scope is not visible yet');
    if (expectMissing && visible) retry('Scope is still visible');
  });
}
