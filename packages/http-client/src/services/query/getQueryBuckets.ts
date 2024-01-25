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
import { CouchbaseApiConfig } from '../../types';
import { ApiQueryResponseBody } from '../../types/Api/Query/ApiQueryResponseBody';
import { requestExecuteStatement } from './requests/requestExecuteStatement';

/**
 * Return the list of buckets visible from the Query service.
 */
export async function getQueryBuckets(params: CouchbaseApiConfig): Promise<string[]> {
  const response = await requestExecuteStatement(
    params,
    'SELECT RAW name FROM system:keyspaces'
  );

  if (response.status !== 200) {
    throw new Error(`API Error (${response.statusText}): ${response.text()}`);
  }

  const body = (await response.json()) as ApiQueryResponseBody<string[]>;
  return body.results;
}
