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
import { StorageBackendName } from '@cbjsdev/shared';

export type ApiQueryIndexStatus = {
  storageMode: StorageBackendName;
  partitionMap: Record<string, number[]>;
  numPartition: number;
  partitioned: boolean;
  instId: bigint;
  /**
   * List of host in the format "hostname:port"
   */
  hosts: string[];
  stale: boolean;
  /**
   * From 0 to 100
   */
  progress: number;
  /**
   * Query statement to create the index
   */
  definition: string;
  status: 'Ready' | (string & NonNullable<unknown>);
  collection: string;
  scope: string;
  bucket: string;
  replicaId: number;
  numReplica: number;
  /**
   * Date time ISO or "NA" if never.
   */
  lastScanTime: 'NA' | (string & NonNullable<unknown>);
  indexName: string;
  index: string;
  id: bigint;
};
