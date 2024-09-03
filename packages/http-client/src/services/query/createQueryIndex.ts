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
import { Keyspace, keyspacePath, quoteIdentifier } from '@cbjsdev/shared';

import { CouchbaseHttpApiConfig } from '../../types.js';
import { ApiQueryResponseBody } from '../../types/Api/index.js';
import { createHttpError } from '../../utils/createHttpError.js';
import { requestExecuteStatement } from './requests/requestExecuteStatement.js';

/**
 * Create a query index.
 */
export async function createQueryIndex(
  params: CouchbaseHttpApiConfig,
  indexName: string,
  keyspace: Keyspace,
  config: {
    /**
     * The document keys to index.
     */
    keys: string[];
    /**
     * Only index documents that match this where clause.
     */
    where?: string;
    /**
     * The number of replicas of this index that should be created.
     */
    numReplicas?: number;
  },
  options?: CreateQueryIndexOptions
): Promise<CreateQueryIndexResponse['results']> {
  const { keys, where, numReplicas } = config;
  const { deferred = false } = options ?? {};

  let query = `CREATE INDEX ${quoteIdentifier(indexName)} 
     ON ${keyspacePath(keyspace)} 
       (${keys.join(',')})`;

  if (where) {
    query += ` WHERE ${where} `;
  }

  const withConfig: { num_replica?: number; defer_build?: boolean } = {};

  if (numReplicas) {
    withConfig.num_replica = numReplicas;
  }

  if (deferred) {
    withConfig.defer_build = deferred;
  }

  if (Object.keys(withConfig).length > 0) {
    query += ` WITH ${JSON.stringify(withConfig)} `;
  }

  const response = await requestExecuteStatement(params, query);

  if (response.status !== 200) {
    throw await createHttpError('GET', response);
  }

  const body = (await response.json()) as CreateQueryIndexResponse;
  return body.results;
}

export type CreateQueryIndexOptions = {
  /**
   * Specifies whether this index creation should be deferred until a later
   * point in time when they can be explicitly built together.
   */
  deferred?: boolean;
};

export type CreateQueryIndexResponse = ApiQueryResponseBody<
  Array<{ id: string; name: string; state: string }>,
  null
>;
