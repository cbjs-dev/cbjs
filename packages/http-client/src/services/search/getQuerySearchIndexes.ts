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
import { hasOwn, invariant, Keyspace } from '@cbjsdev/shared';

import { CouchbaseHttpApiConfig } from '../../types.js';
import { ApiQueryResponseBody } from '../../types/Api/index.js';
import { HttpClientSearchIndex } from '../../types/HttpClient/HttpClientSearchIndex.js';
import { QueryResultSearchIndex } from '../../types/QueryResult/index.js';
import { createHttpError } from '../../utils/createHttpError.js';
import { requestQuerySearchIndexes } from './requests/requestQuerySearchIndexes.js';

export async function getQuerySearchIndexes(
  params: CouchbaseHttpApiConfig,
  options: Partial<Keyspace> & { index?: string } = {}
): Promise<HttpClientSearchIndex[]> {
  const response = await requestQuerySearchIndexes(params);

  if (response.status !== 200) {
    throw await createHttpError('POST', response);
  }

  const body = (await response.json()) as ApiQueryResponseBody<QueryResultSearchIndex[]>;
  const friendlyResult = body.results.map(toFriendlyFormat);

  const indexName =
    options.index && options.bucket && options.scope
      ? `${options.bucket}.${options.scope}.${options.index}`
      : options.index;

  return friendlyResult.filter((index) => {
    if (indexName && indexName !== index.name) return false;
    if (options.collection && options.collection !== index.collectionName) return false;
    if (options.scope && options.scope !== index.scopeName) return false;
    if (options.bucket && options.bucket !== index.bucketName) return false;

    return true;
  });
}

function toFriendlyFormat(index: QueryResultSearchIndex): HttpClientSearchIndex {
  invariant(index.using === 'fts');

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
    node: index.datastore_id,
    state: index.state,
    namespace: index.namespace_id,
    using: index.using,
    ...(scope as any),
  };
}
