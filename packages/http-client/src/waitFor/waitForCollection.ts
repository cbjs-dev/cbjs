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
import { getHttpClientLogger } from '../logger';

import { getPoolNodes } from '../services/cluster/getPoolNodes';
import { getCollections } from '../services/kv/getCollections';
import { CouchbaseApiConfig, WaitForOptions } from '../types';
import { ApiCollection } from '../types/Api/ApiCollection';
import { mapNodes } from '../utils/mapNodes';
import { getStandardRetryProfile } from '../utils/retryProfiles';

export async function waitForCollection(
  params: CouchbaseApiConfig,
  bucketName: string,
  scopeName: string,
  collectionName: string,
  options: WaitForOptions = { timeout: 10_000 }
) {
  const timeout = options.timeout || 10_000;
  const expectMissing = options.expectMissing || false;

  return promiseRetry(getStandardRetryProfile({ timeout }), async (retry) => {
    const poolNodes = await getPoolNodes(params);

    const requests = mapNodes(poolNodes, ({ hostname }) =>
      getCollections({ ...params, hostname }, bucketName, scopeName).catch(
        () => [] as ApiCollection[]
      )
    );

    const responses = await Promise.all(requests);
    const visible = responses.every((collections) => {
      return collections.some((c) => c.name === collectionName);
    });

    if (!expectMissing && !visible) {
      getHttpClientLogger()?.trace('Collection is not visible yet');
      retry('Collection is not visible yet');
    }

    if (expectMissing && visible) {
      getHttpClientLogger()?.trace('Collection is still visible');
      retry('Collection is still visible');
    }
  });
}
