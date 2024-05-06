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

import { hasOwn, isPartialKeyspace, Keyspace } from '@cbjsdev/shared';

import { getSearchIndex, getStatistics, querySearchIndexes } from '../services/index.js';
import { CouchbaseHttpApiConfig } from '../types.js';
import { waitOptionsModerate } from './options.js';
import { WaitForOptions } from './types.js';

export type WaitForSearchIndexOptions = WaitForOptions & {
  awaitQueryVisibility?: boolean;
  awaitMutations?: boolean;
};

/**
 * Wait for the query index to be visible by the query service and wait until no mutations are remaining.
 * You can opt-out waiting for mutations by passing `{ awaitMutations: false }`.
 */
export async function waitForSearchIndex(
  apiConfig: CouchbaseHttpApiConfig,
  indexName: string,
  keyspace: Partial<Keyspace>,
  options?: WaitForSearchIndexOptions
): Promise<void>;
export async function waitForSearchIndex(
  apiConfig: CouchbaseHttpApiConfig,
  indexName: string,
  options?: WaitForSearchIndexOptions
): Promise<void>;
export async function waitForSearchIndex(
  apiConfig: CouchbaseHttpApiConfig,
  indexName: string,
  ...args: [Partial<Keyspace>, WaitForSearchIndexOptions?] | [WaitForSearchIndexOptions?]
): Promise<void> {
  const [keyspace, options] = isPartialKeyspace(args[0])
    ? (args as [Partial<Keyspace>, WaitForSearchIndexOptions])
    : [undefined, args[0]];

  const resolvedOptions = {
    ...waitOptionsModerate,
    ...options,
  };

  const { expectMissing, awaitMutations, awaitQueryVisibility } = resolvedOptions;

  return await retry(async () => {
    const index = awaitQueryVisibility
      ? (await querySearchIndexes(apiConfig, { index: indexName }))[0]
      : await getSearchIndex(apiConfig, indexName);

    if (!index && !expectMissing) throw new Error('Search index is not visible yet');
    if (index && expectMissing) throw new Error('Search index still exists');

    const indexReady = hasOwn(index, 'state')
      ? index.state === 'online'
      : index.planPIndexes.length > 0;

    if (!indexReady && !expectMissing) throw new Error('Search index is not ready yet');

    if (!awaitMutations) {
      return;
    }

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
      throw new Error('Search index is not visible yet');
    }

    if (expectMissing) {
      throw new Error('Search index still exists');
    }

    const values = stats[0].data[0].values;
    const remainingMutations = values[values.length - 1][1];

    if (!expectMissing && remainingMutations !== '0') {
      throw new Error('Search index has pending mutations');
    }
  }, resolvedOptions);
}
