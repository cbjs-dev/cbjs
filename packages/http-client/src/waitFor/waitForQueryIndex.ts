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

import { Keyspace } from '@cbjs/shared';

import { getStatistics } from '../services';
import { CouchbaseHttpApiConfig } from '../types';
import { waitOptionsModerate } from './options';
import { WaitForOptions } from './types';

type WaitForQueryIndexOptions = WaitForOptions & { awaitMutations?: boolean };

export async function waitForQueryIndex(
  apiConfig: CouchbaseHttpApiConfig,
  indexName: string,
  keyspace: Keyspace,
  options?: WaitForQueryIndexOptions
): Promise<void> {
  const resolvedOptions = {
    ...waitOptionsModerate,
    awaitMutations: true,
    ...options,
  };

  const { expectMissing, awaitMutations } = resolvedOptions;

  return await retry(async () => {
    const stats = await getStatistics(apiConfig, [
      {
        metric: [
          { label: 'name', value: 'index_num_docs_pending' },
          { label: 'index', value: indexName },
          ...Object.entries(keyspace).map(([label, value]) => ({
            label,
            value,
          })),
        ],
        step: 1,
        start: -10,
      },
    ]);

    // Index not found
    if (stats[0].data.length === 0) {
      if (expectMissing) return;
      throw new Error('Query index is not visible yet');
    }

    if (expectMissing) {
      throw new Error('Query index still exists');
    }

    if (!awaitMutations) {
      return;
    }

    const values = stats[0].data[0].values;
    const remainingMutations = values[values.length - 1][1];

    if (!expectMissing && remainingMutations !== '0') {
      throw new Error('Query index has pending mutations');
    }
  }, resolvedOptions);
}
