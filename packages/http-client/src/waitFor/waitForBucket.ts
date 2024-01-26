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
import { getPoolNodes, getQueryBuckets } from '../services';
import { requestGetBucket } from '../services/kv/requests/requestGetBucket';
import { CouchbaseHttpApiConfig } from '../types';
import { ApiBucket } from '../types/Api/ApiBucket';
import { mapNodes } from '../utils/mapNodes';
import { getStandardRetryProfile } from '../utils/retryProfiles';
import { WaitForOptions } from './types';

export async function waitForBucket(
  apiConfig: CouchbaseHttpApiConfig,
  bucketName: string,
  options: WaitForOptions = { timeout: 10_000 }
): Promise<void> {
  const timeout = options.timeout || 10_000;
  const expectMissing = options.expectMissing || false;
  const retryProfile = getStandardRetryProfile({ timeout });

  return await promiseRetry(retryProfile, async (retry) => {
    const poolNodes = apiConfig.poolNodes ?? (await getPoolNodes(apiConfig));

    const requests = mapNodes(poolNodes, ({ hostname }) =>
      requestGetBucket({ ...apiConfig, hostname, poolNodes }, bucketName)
    );

    const responses = await Promise.all(requests);
    const bodies = await Promise.all(
      responses.filter((r) => r.status === 200).map((r) => r.json() as Promise<ApiBucket>)
    );

    if (!expectMissing && bodies.length === 0) retry('Bucket is not visible yet');
    if (expectMissing && bodies.length < requests.length) return;

    const ready = bodies.every(
      (b) =>
        b.nodes.length > 0 &&
        b.vBucketServerMap.serverList.length > 0 &&
        b.vBucketServerMap.vBucketMap.length > 0 &&
        b.quota.ram > 0
    );

    if (!expectMissing && !ready) {
      getHttpClientLogger()?.trace('Bucket is not ready yet');
      retry('Bucket is not ready yet');
    }
    if (expectMissing && ready) {
      getHttpClientLogger()?.trace('Bucket is still visible');
      retry('Bucket is still visible');
    }

    const queryBuckets = await getQueryBuckets(apiConfig);
    const bucketQueryVisible = queryBuckets.includes(bucketName);

    if (!expectMissing && !bucketQueryVisible) {
      getHttpClientLogger()?.trace('Bucket is not visible by the query service yet');
      retry('Bucket is not visible by the query service yet');
    }
    if (expectMissing && bucketQueryVisible) {
      getHttpClientLogger()?.trace('Bucket is still visible by the query service');
      retry('Bucket is still visible by the query service');
    }
  });
}
