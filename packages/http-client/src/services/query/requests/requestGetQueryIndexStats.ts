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
import 'node-fetch';

import { Keyspace, quoteIdentifier } from '@cbjsdev/shared';

import { CouchbaseHttpApiConfig } from '../../../types.js';
import { apiGET } from '../../../utils/apiGET.js';

export async function requestGetQueryIndexStats(
  params: CouchbaseHttpApiConfig,
  indexName: string,
  keyspace: Keyspace
) {
  // For whatever reason, the scope and collection do not support backticks.
  return await apiGET(
    { ...params },
    `/api/v1/stats/${quoteIdentifier(keyspace.bucket)}.${keyspace.scope}.${keyspace.collection}/${indexName}`,
    'indexer'
  );
}
