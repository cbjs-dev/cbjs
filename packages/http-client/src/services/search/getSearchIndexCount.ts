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
import { createHttpError } from '../../utils/createHttpError.js';
import { requestGetScopedSearchIndexCount } from './requests/requestGetScopedSearchIndexCount.js';
import { requestGetSearchIndexCount } from './requests/requestGetSearchIndexCount.js';

export type SearchIndexCount = {
  status: string;
  count: number;
};

/**
 * Return the number of documents indexed by a search index.
 *
 * The underlying FTS count endpoint only answers with a `200` once every pindex
 * of the index is hosted and available. While the pindexes are still being
 * planned or built, it answers with a `400 pindex not available` — the exact
 * same error a real query would raise. This makes a successful call a faithful
 * probe of whether the index is actually queryable, as opposed to merely
 * visible to the query service.
 */
export async function getSearchIndexCount(
  params: CouchbaseHttpApiConfig,
  index:
    | string
    | {
        bucket: string;
        scope: string;
        index: string;
      }
): Promise<SearchIndexCount> {
  const response =
    typeof index === 'string'
      ? await requestGetSearchIndexCount(params, index)
      : await requestGetScopedSearchIndexCount(params, index);

  if (response.status !== 200) {
    throw await createHttpError('GET', response);
  }

  return (await response.json()) as SearchIndexCount;
}
