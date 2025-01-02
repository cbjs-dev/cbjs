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

import { isPartialKeyspace, Keyspace } from '@cbjsdev/shared';

import { getQuerySearchIndexes } from '../services/index.js';
import { CouchbaseHttpApiConfig } from '../types.js';
import { HttpClientQueryIndex } from '../types/HttpClient/index.js';
import { waitOptionsModerate } from './options.js';
import { WaitForOptions } from './types.js';

export type WaitForSearchIndexOptions = WaitForOptions & {
  /**
   * Wait for the index to have been built.
   *
   * @default true
   */
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

  const { expectMissing, awaitMutations } = resolvedOptions;

  return await retry(async () => {
    const indexes = await getQuerySearchIndexes(apiConfig, {
      ...keyspace,
      index: indexName,
    });
    const index = indexes[0] as HttpClientQueryIndex | undefined;

    if (!index && !expectMissing) throw new Error('Search index is not visible yet');
    if (index && expectMissing) throw new Error('Search index still exists');

    if (!awaitMutations || expectMissing) {
      return;
    }

    if (index?.state !== 'online') {
      throw new Error('Search index still being built');
    }
  }, resolvedOptions);
}
