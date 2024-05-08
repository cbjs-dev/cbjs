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
import 'node-fetch';

import { jsonToUrlSearchParams } from '@cbjsdev/shared';

import { CouchbaseHttpApiConfig } from '../../../types.js';
import { apiPOST } from '../../../utils/apiPOST.js';

export type CouchbaseIndexerSettings = Partial<{
  indexerThreads: number;
  logLevel:
    | 'silent'
    | 'fatal'
    | 'error'
    | 'warn'
    | 'info'
    | 'verbose'
    | 'timing'
    | 'debug'
    | 'trace';
  maxRollbackPoints: number;
  memorySnapshotInterval: number;
  numReplica: number;
  redistributeIndexes: 'true' | 'false';
  stableSnapshotInterval: number;
  enablePageBloomFilter: 'true' | 'false';
  storageMode: 'plasma' | 'memory_optimized' | 'forestdb';
}>;

export async function requestSetIndexerSettings(
  apiConfig: CouchbaseHttpApiConfig,
  settings: CouchbaseIndexerSettings
) {
  return apiPOST(
    apiConfig,
    `/settings/indexes`,
    jsonToUrlSearchParams(settings),
    'management',
    undefined,
    {
      'Content-Type': 'application/x-www-form-urlencoded',
    }
  );
}
