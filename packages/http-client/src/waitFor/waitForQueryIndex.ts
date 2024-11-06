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

import { Keyspace, Pretty } from '@cbjsdev/shared';

import { getQueryIndexes } from '../services/index.js';
import { getQueryIndexRemainingMutations } from '../services/query/getQueryIndexRemainingMutations.js';
import { CouchbaseHttpApiConfig } from '../types.js';
import { waitOptionsModerate } from './options.js';
import { WaitForOptions } from './types.js';

export type WaitForQueryIndexOptions = Pretty<
  WaitForOptions & {
    /**
     * Wait for the index to have processed all mutations.
     * @default true
     */
    awaitMutations?: boolean;
  }
>;

/**
 * Wait for the query index to be visible by the query service and wait until no mutations are remaining.
 *
 * You can opt-out waiting for mutations by passing `{ awaitMutations: false }`.
 *
 * @param apiConfig
 * @param indexName
 * @param keyspace
 * @param options
 */
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
    const indexes = await getQueryIndexes(apiConfig, keyspace);
    const indexExists = indexes.some((index) => index.name === indexName);

    if (!indexExists && !expectMissing) throw new Error('Query index is not visible yet');
    if (indexExists && expectMissing) throw new Error('Query index still exists');

    if (!awaitMutations || expectMissing) {
      return;
    }

    const remainingMutations = await getQueryIndexRemainingMutations(
      apiConfig,
      indexName,
      keyspace
    );

    if (!expectMissing && remainingMutations > 0) {
      throw new Error('Query index has pending mutations');
    }
  }, resolvedOptions);
}
