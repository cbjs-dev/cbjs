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
import { hasOwn, Keyspace, trimIdentifier } from '@cbjsdev/shared';

import { CouchbaseHttpApiConfig } from '../../types.js';
import { ApiQueryResponseBody } from '../../types/Api/query/ApiQueryResponseBody.js';
import { HttpClientQueryIndex } from '../../types/HttpClient/HttpClientQueryIndex.js';
import { QueryResultGsiIndex, QueryResultSearchIndex } from '../../types/QueryResult/index.js';
import { createHttpError } from '../../utils/createHttpError.js';
import { requestGetQueryIndexes } from './requests/requestGetQueryIndexes.js';

export async function getQueryIndexes(
  params: CouchbaseHttpApiConfig,
  options: Partial<Keyspace> = {}
) {
  const response = await requestGetQueryIndexes(params);

  if (response.status !== 200) {
    throw await createHttpError('GET', response);
  }

  const body = (await response.json()) as ApiQueryResponseBody<QueryResultGsiIndex[]>;
  const friendlyResult = body.results.map(toFriendlyFormat);

  return friendlyResult.filter((index) => {
    if (options.collection && options.collection !== index.collectionName) return false;
    if (options.scope && options.scope !== index.scopeName) return false;
    if (options.bucket && options.bucket !== index.bucketName) return false;

    return true;
  });
}

function toFriendlyFormat(index: QueryResultGsiIndex): HttpClientQueryIndex {
  const scope = hasOwn(index, 'bucket_id')
    ? {
        bucketName: index.bucket_id,
        scopeName: index.scope_id,
        collectionName: index.keyspace_id,
      }
    : {
        bucketName: index.keyspace_id,
      };

  return {
    id: index.id,
    name: index.name,
    isPrimary: index.is_primary ?? false,
    fields: index.index_key.map(trimIdentifier) as [string, ...string[]],
    node: index.datastore_id,
    state: index.state,
    namespace: index.namespace_id,
    numReplicas: index.metadata.num_replica,
    using: index.using,
    ...(scope as any),
  };
}
