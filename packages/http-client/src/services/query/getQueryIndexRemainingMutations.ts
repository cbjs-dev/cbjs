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
import { Keyspace } from '@cbjsdev/shared';

import { getHttpClientLogger } from '../../logger.js';
import { CouchbaseHttpApiConfig } from '../../types.js';
import { HttpClientQueryIndexStats } from '../../types/HttpClient/HttpClientQueryIndexStats.js';
import { requestGetQueryIndexStats } from './requests/requestGetQueryIndexStats.js';

/**
 * Return the number of remaining mutations.
 * The value is the sum of the queued (not sent to the indexer yet) and
 * pending mutations (currently processed by the indexer).
 *
 * @param apiConfig
 * @param indexName
 * @param keyspace
 */
export async function getQueryIndexRemainingMutations(
  apiConfig: CouchbaseHttpApiConfig,
  indexName: string,
  keyspace: Keyspace
): Promise<number> {
  const response = await requestGetQueryIndexStats(apiConfig, indexName, keyspace);
  const responseBody = await response.text();

  const parsedStats = JSON.parse(responseBody) as Record<
    string,
    HttpClientQueryIndexStats
  >;

  const indexStats =
    parsedStats[
      `${keyspace.bucket}:${keyspace.scope}:${keyspace.collection}:${indexName}`
    ];

  getHttpClientLogger()?.debug('Queued documents: %d', indexStats.num_docs_queued);
  getHttpClientLogger()?.debug('Pending documents: %d', indexStats.num_docs_pending);

  return indexStats.num_docs_pending + indexStats.num_docs_queued;
}
