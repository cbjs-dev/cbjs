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
import { CouchbaseHttpApiConfig } from '../../types.js';
import { ApiSearchGetIndex } from '../../types/Api/index.js';
import { createHttpError } from '../../utils/createHttpError.js';
import { requestGetSearchIndex } from './requests/requestGetSearchIndex.js';

export async function getSearchIndex(params: CouchbaseHttpApiConfig, indexName: string) {
  const response = await requestGetSearchIndex(params, indexName);

  if (response.status !== 200) {
    throw await createHttpError('GET', response);
  }

  return (await response.json()) as ApiSearchGetIndex;
}
