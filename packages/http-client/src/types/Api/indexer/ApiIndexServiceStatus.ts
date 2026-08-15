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
import { IndexStorageMode } from '@cbjsdev/shared';

/**
 * Options an index was created with, as reported by the index service.
 *
 * Only vector indexes report a non-empty object today.
 */
export type ApiIndexServiceIndexOptions = {
  /**
   * Number of dimensions of the indexed vector.
   */
  dimension?: number;
  /**
   * Quantization of the vector index, i.e. `SQ8`, `PQ32x8`.
   */
  quantization?: string;
  scanNProbes?: number;
  /**
   * Similarity function, i.e. `DOT`, `L2_SQUARED`, `COSINE`.
   */
  similarityDistance?: string;
  /**
   * Number of documents the training of the index has been performed on.
   */
  trainlist?: number;
} & Record<string, unknown>;

/**
 * Status of a single index, as reported by the index service.
 */
export type ApiIndexServiceIndexStatus = {
  defnId: bigint;
  instId: bigint;
  name: string;
  bucket: string;
  scope: string;
  collection: string;
  secExprs: string[];
  /**
   * Present on partial indexes only.
   */
  where?: string;
  /**
   * Storage engine backing the index, such as `plasma`.
   *
   * The management API reports the very same value under the name `storageMode`.
   */
  indexType: IndexStorageMode;
  isPrimary?: boolean;
  /**
   * @since Couchbase Server 8.0
   */
  isVectorIndex?: boolean;
  /**
   * Position of the vector expression within `secExprs`, `-1` when the index
   * indexes no vector.
   *
   * @since Couchbase Server 8.0
   */
  vectorPos?: number;
  /**
   * Reported on vector indexes only.
   *
   * @since Couchbase Server 8.0
   */
  with?: ApiIndexServiceIndexOptions;
  status: 'Ready' | 'Created' | 'Building' | 'Error' | (string & NonNullable<unknown>);
  /**
   * Query statement to create the index.
   */
  definition: string;
  /**
   * List of hosts in the format "hostname:port".
   */
  hosts: string[];
  /**
   * From 0 to 100.
   */
  completion: number;
  /**
   * From 0 to 100.
   */
  progress: number;
  scheduled: boolean;
  partitioned: boolean;
  numPartition: number;
  partitionMap: Record<string, number[]>;
  numReplica: number;
  indexName: string;
  replicaId: number;
  stale: boolean;
  /**
   * Date time in the `Thu Aug  6 21:00:02 UTC 2026` format, or "NA" if never.
   */
  lastScanTime: 'NA' | (string & NonNullable<unknown>);
  /**
   * @since Couchbase Server 7.6
   */
  alternateShardIds?: Record<string, string[]>;
  /**
   * @since Couchbase Server 8.0
   */
  graphProgress?: number;
  /**
   * Number of centroids the IVF vector index has been trained with.
   *
   * This is the only place the server exposes it: neither `system:indexes` nor the
   * cluster manager `/indexStatus` carries it. Absent until the index is trained,
   * and on any index that is not a vector index.
   *
   * @since Couchbase Server 8.0
   */
  numCentroids?: number;
  /**
   * Number of centroids per partition, keyed by partition id.
   *
   * @since Couchbase Server 8.0
   */
  numCentroidsPerPartn?: Record<string, number>;
};

/**
 * Response body of `GET /getIndexStatus` on the index service.
 */
export type ApiIndexServiceStatus = {
  code: 'success' | (string & NonNullable<unknown>);
  status: ApiIndexServiceIndexStatus[];
  error?: string;
};
