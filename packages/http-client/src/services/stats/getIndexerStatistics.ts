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
import { CouchbaseHttpApiConfig } from '../../types';
import { createHttpError } from '../../utils/createHttpError';
import { requestIndexerStatistics } from './requests/requestIndexerStatistics';

export type IndexerStatistics = {
  indexer: {
    indexer_state: 'Active' | 'Pause' | 'Warmup';
    memory_quota: number;
    memory_total_storage?: number;
    memory_used?: number;
    total_indexer_gc_pause_ns?: number;
  };
};

export async function getIndexerStatistics(
  apiConfig: CouchbaseHttpApiConfig,
  skipEmpty = true
) {
  const response = await requestIndexerStatistics(apiConfig, skipEmpty);

  if (response.status !== 200) {
    throw await createHttpError('GET', response);
  }

  const stats = (await response.json()) as IndexerStatistics;

  return stats.indexer;
}
