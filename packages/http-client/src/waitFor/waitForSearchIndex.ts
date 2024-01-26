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

import { getStatistics } from '../services';
import { CouchbaseHttpApiConfig } from '../types';
import { getStandardRetryProfile } from '../utils/retryProfiles';
import { WaitForOptions } from './types';

export async function waitForSearchIndex(
  apiConfig: CouchbaseHttpApiConfig,
  indexName: string,
  options: WaitForOptions = { timeout: 10_000 }
): Promise<void> {
  const timeout = options.timeout || 10_000;
  const expectMissing = options.expectMissing || false;
  const retryProfile = getStandardRetryProfile({ timeout });

  return promiseRetry(retryProfile, async (retry) => {
    const stats = await getStatistics(apiConfig, [
      {
        metric: [
          { label: 'name', value: 'fts_num_mutations_to_index' },
          { label: 'index', value: indexName },
        ],
        step: 1,
        start: -10,
      },
    ]);

    // Index not found
    if (stats[0].data.length === 0) {
      if (expectMissing) return;
      retry('Search index is not visible yet');
      return;
    }

    if (expectMissing) {
      retry('Search index still exists');
    }

    const values = stats[0].data[0].values;
    const remainingMutations = values[values.length - 1][1];

    if (!expectMissing && remainingMutations !== '0') {
      retry('Search index has pending mutations');
    }
  });
}
