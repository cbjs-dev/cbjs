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
import { hasOwn } from '@cbjs/shared';

import { CouchbaseHttpApiConfig } from '../../types';
import { ApiQueryIndex } from '../../types/Api/ApiQueryIndex';
import { ApiQueryResponseBody } from '../../types/Api/Query/ApiQueryResponseBody';
import { HttpClientQueryIndex } from '../../types/HttpClient/HttpClientQueryInex';
import { createHttpError } from '../../utils/createHttpError';
import { requestGetQueryIndexes } from './requests/requestGetQueryIndexes';

export async function getQueryIndexes(params: CouchbaseHttpApiConfig) {
  const response = await requestGetQueryIndexes(params);

  if (response.status !== 200) {
    throw await createHttpError('GET', response);
  }

  const body = (await response.json()) as ApiQueryResponseBody<ApiQueryIndex[]>;
  return body.results.map(toFriendlyFormat);
}

function toFriendlyFormat(index: ApiQueryIndex) {
  const friendly: Partial<HttpClientQueryIndex> = {};

  if (hasOwn(index, 'bucket_id')) {
    friendly.bucketName = index.bucket_id;
    friendly.scopeName = index.scope_id;
    friendly.collectionName = index.keyspace_id;
  } else {
    friendly.bucketName = index.keyspace_id;
  }

  friendly.id = index.id;
  friendly.name = index.name;
  friendly.fields = index.index_key.map((field) => {
    if (field.startsWith('`') && field.endsWith('`')) {
      return field.substring(1, field.length - 1);
    }

    return field;
  }) as [];
  friendly.isPrimary = index.is_primary ?? false;
  friendly.node = index.datastore_id;
  friendly.numReplicas = index.metadata.num_replica;
  friendly.state = index.state;
  friendly.namespace = index.namespace_id;
  friendly.using = index.using;

  return friendly;
}
