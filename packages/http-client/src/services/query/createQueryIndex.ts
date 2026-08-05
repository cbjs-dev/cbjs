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

import { CouchbaseHttpApiConfig } from '../../types.js';
import { ApiQueryResponseBody } from '../../types/Api/index.js';
import { createHttpError } from '../../utils/createHttpError.js';
import {
  buildCreateQueryIndexStatement,
  CreateQueryIndexStatementConfig,
} from './buildCreateQueryIndexStatement.js';
import { requestExecuteStatement } from './requests/requestExecuteStatement.js';

/**
 * Create a query index.
 */
export async function createQueryIndex(
  params: CouchbaseHttpApiConfig,
  indexName: string,
  keyspace: Keyspace,
  config: CreateQueryIndexStatementConfig,
  options?: CreateQueryIndexOptions
): Promise<CreateQueryIndexResponse['results']> {
  const { deferred = false } = options ?? {};

  const query = buildCreateQueryIndexStatement(indexName, keyspace, config, {
    deferred,
  });

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
