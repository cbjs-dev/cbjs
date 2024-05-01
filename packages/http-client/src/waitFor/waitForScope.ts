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

import { getPoolNodes } from '../services/index.js';
import { getScopes } from '../services/index.js';
import { CouchbaseHttpApiConfig } from '../types.js';
import { mapNodes } from '../utils/mapNodes.js';
import { waitOptionsModerate } from './options.js';
import { WaitForOptions } from './types.js';

export async function waitForScope(
  params: CouchbaseHttpApiConfig,
  bucketName: string,
  scopeName: string,
  options?: WaitForOptions
) {
  const resolvedOptions = {
    ...waitOptionsModerate,
    ...options,
  };

  const { expectMissing } = resolvedOptions;

  return await retry(async () => {
    const poolNodes = await getPoolNodes(params);

    const requests = mapNodes(poolNodes, ({ hostname }) =>
      getScopes({ ...params, hostname }, bucketName)
    );

    const responses = await Promise.all(requests);
    const visible = responses.every((r) => r.scopes.find((s) => s.name === scopeName));

    if (!expectMissing && !visible) throw new Error('Scope is not visible yet');
    if (expectMissing && visible) throw new Error('Scope is still visible');
  }, resolvedOptions);
}
