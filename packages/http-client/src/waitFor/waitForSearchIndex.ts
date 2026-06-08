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

import { getQuerySearchIndexes, getSearchIndexCount } from '../services/index.js';
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

  /**
   * Wait for the index to be queryable.
   *
   * An index can be visible and built yet still reject queries for a short
   * while after creation. When enabled, the wait only resolves once the index
   * actually answers queries. Set to `false` to resolve as soon as the index
   * is visible, without guaranteeing it can be queried yet.
   *
   * @default true
   */
  awaitQueryVisibility?: boolean;
};

/**
 * Wait for the search index to be ready to use: visible, built, and queryable.
 *
 * You can opt-out of waiting for the index to be built by passing
 * `{ awaitMutations: false }`, and opt-out of waiting for it to be queryable by
 * passing `{ awaitQueryVisibility: false }`.
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
  const awaitQueryVisibility = resolvedOptions.awaitQueryVisibility ?? true;

  return await retry(async () => {
    const indexes = await getQuerySearchIndexes(apiConfig, {
      ...keyspace,
      index: indexName,
    });
    const index = indexes[0] as HttpClientQueryIndex | undefined;

    if (!index && !expectMissing) throw new Error('Search index is not visible yet');
    if (index && expectMissing) throw new Error('Search index still exists');

    if (expectMissing) {
      return;
    }

    if (awaitMutations && index?.state !== 'online') {
      throw new Error('Search index still being built');
    }

    if (awaitQueryVisibility) {
      // The count endpoint only answers 200 once every pindex of the index is
      // hosted. Until then it fails with `pindex not available` — the same
      // error a real query raises — so a successful call turns "index visible"
      // into "index queryable", closing the race where a query is issued
      // against an index whose pindexes are not yet available.
      await getSearchIndexCount(
        apiConfig,
        keyspace?.bucket && keyspace.scope
          ? { bucket: keyspace.bucket, scope: keyspace.scope, index: indexName }
          : indexName
      );
    }
  }, resolvedOptions);
}
