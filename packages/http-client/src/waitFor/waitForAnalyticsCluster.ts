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

import { getAnalyticsClusterStatus } from '../services';
import { CouchbaseHttpApiConfig } from '../types';
import { waitOptionsModerate } from './options';
import { WaitForOptions } from './types';

export async function waitForAnalyticsCluster(
  apiConfig: CouchbaseHttpApiConfig,
  options?: WaitForOptions
): Promise<void> {
  const resolvedOptions = {
    ...waitOptionsModerate,
    ...options,
  };

  const { expectMissing } = resolvedOptions;

  return await retry(async () => {
    const clusterStatus = await getAnalyticsClusterStatus(apiConfig);

    if (clusterStatus.state !== 'ACTIVE' && !expectMissing) {
      throw new Error('Analytics cluster is not ready yet');
    }

    if (clusterStatus.state === 'ACTIVE' && expectMissing) {
      throw new Error('Analytics cluster is still running');
    }
  }, resolvedOptions);
}
