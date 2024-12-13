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
import { ApiQueryIndexStatus } from '../../types/Api/query/ApiQueryIndexStatus.js';
import { requestGetQueryIndexesStatus } from './requests/requestGetQueryIndexesStatus.js';

export async function getQueryIndexStatus(
  apiConfig: CouchbaseHttpApiConfig,
  indexName: string,
  keyspace: Keyspace
): Promise<ApiQueryIndexStatus> {
  const response = await requestGetQueryIndexesStatus(apiConfig);
  const responseBody = await response.text();

  const parsedStats = JSONBigint.parse(responseBody) as {
    indexes: ApiQueryIndexStatus[];
    version: number;
    warnings: unknown[];
  };

  const index = parsedStats.indexes.find((i) => {
    return (
      i.bucket === keyspace.bucket &&
      i.scope === keyspace.scope &&
      i.collection === keyspace.collection &&
      i.indexName === indexName
    );
  });

  if (!index) {
    throw new Error('Index not found');
  }

  return index;
}
