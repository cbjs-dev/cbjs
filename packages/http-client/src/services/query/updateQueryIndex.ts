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
export async function updateQueryIndex(
  params: CouchbaseHttpApiConfig,
  indexName: string,
  keyspace: Keyspace,
  config: {
    action: 'move' | 'replica_count' | 'drop_replica';
    num_replica?: number;
    nodes?: string[];
    replicaId?: string;
  }
): Promise<[]> {
  const query = `ALTER INDEX ${quoteIdentifier(indexName)} 
     ON ${keyspacePath(keyspace)}
     WITH ${JSON.stringify(config)}
  `;

  const response = await requestExecuteStatement(params, query);

  if (response.status !== 200) {
    throw await createHttpError('GET', response);
  }

  const body = (await response.json()) as ApiQueryResponseBody<[], null>;
  return body.results;
}
