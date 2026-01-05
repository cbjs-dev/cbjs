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
import { retry } from 'ts-retry-promise';

import { getSearchIndexDocumentsByIds } from '../services/index.js';
import { CouchbaseHttpApiConfig } from '../types.js';
import { waitOptionsModerate } from './options.js';
import { WaitForOptions } from './types.js';

export type WaitForDocumentsInSearchIndexOptions = WaitForOptions;

export async function waitForDocumentsInSearchIndex(
  apiConfig: CouchbaseHttpApiConfig,
  index:
    | string
    | {
        bucket: string;
        scope: string;
        index: string;
      },
  docIds: string[],
  options?: WaitForDocumentsInSearchIndexOptions
): Promise<void> {
  const resolvedOptions = {
    ...waitOptionsModerate,
    ...options,
  };

  const { expectMissing } = resolvedOptions;

  return await retry(async () => {
    const result = await getSearchIndexDocumentsByIds(apiConfig, index, docIds);
    const allDocsFound = result.total_hits !== docIds.length;

    if (!allDocsFound && !expectMissing)
      throw new Error('Some documents are not in the search index yet');
    if (allDocsFound && expectMissing)
      throw new Error('Some documents are still in the search index');
  }, resolvedOptions);
}
