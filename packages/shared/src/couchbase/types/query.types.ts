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

export type QueryScanConsistencyName = 'not_bounded' | 'request_plus';

/**
 * Similarity - or distance - function used by a vector index.
 *
 * The server stores the value lowercased, whichever case you use.
 */
export type QueryIndexVectorSimilarity =
  | 'L2'
  | 'L2_SQUARED'
  | 'EUCLIDEAN'
  | 'EUCLIDEAN_SQUARED'
  | 'DOT'
  | 'COSINE';

/**
 * Options of the `WITH` clause of a `CREATE INDEX` statement.
 *
 * The listed options are only the documented ones : any other option is accepted and
 * passed to the server as-is, so that undocumented and future options can be used.
 *
 * @example
 * const options: QueryIndexWithClause = {
 *   dimension: 768,
 *   similarity: 'DOT',
 *   description: 'IVF,SQ8',
 * };
 */
export type QueryIndexWithClause = {
  /**
   * Number of replicas of the index.
   */
  num_replica?: number;

  /**
   * Number of partitions of the index.
   */
  num_partition?: number;

  /**
   * Defer the build of the index, so that multiple indexes can be built at once, later on.
   */
  defer_build?: boolean;

  /**
   * Nodes onto which the index and its replicas must be placed.
   */
  nodes?: string[];

  /**
   * Keep the index up to date with the deleted documents' xattrs.
   */
  retain_deleted_xattr?: boolean;

  /**
   * Vector index : number of dimensions of the indexed vector.
   */
  dimension?: number;

  /**
   * Vector index : similarity - or distance - function used to compare vectors.
   *
   * Any string is accepted : the known values are only there to help you.
   */
  similarity?:
    | QueryIndexVectorSimilarity
    | Lowercase<QueryIndexVectorSimilarity>
    // eslint-disable-next-line @typescript-eslint/ban-types
    | (string & {});

  /**
   * Vector index : index type and quantization, such as `IVF,SQ8`.
   */
  description?: string;

  /**
   * Vector index : number of centroids probed during a scan.
   */
  scan_nprobes?: number;

  /**
   * Vector index : number of vectors used to train the index.
   */
  train_list?: number;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [option: string]: any;
};
