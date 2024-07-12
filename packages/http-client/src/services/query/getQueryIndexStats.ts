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
import JSONBigint from 'json-bigint';

import { Keyspace } from '@cbjsdev/shared';

import { CouchbaseHttpApiConfig } from '../../types.js';
import { HttpClientQueryIndexStats } from '../../types/HttpClient/HttpClientQueryIndexStats.js';
import { requestGetQueryIndexStats } from './requests/requestGetQueryIndexStats.js';

export async function getQueryIndexStats(
  apiConfig: CouchbaseHttpApiConfig,
  indexName: string,
  keyspace: Keyspace
): Promise<HttpClientQueryIndexStats> {
  const response = await requestGetQueryIndexStats(apiConfig, indexName, keyspace);
  const responseBody = await response.text();

  const parsedStats = JSONBigint.parse(responseBody) as Record<
    string,
    HttpClientQueryIndexStats
  >;

  return parsedStats[
    `${keyspace.bucket}:${keyspace.scope}:${keyspace.collection}:${indexName}`
  ];
}
