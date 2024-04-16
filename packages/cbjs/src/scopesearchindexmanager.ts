/*
 * Copyright (c) 2023-Present Jonathan MASSUCHETTI <jonathan.massuchetti@dappit.fr>.
 * Copyright (c) 2013-Present Couchbase Inc.
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
import { promisify } from 'node:util';

import { ApiSearchIndexSuccessfulAnalysis } from '@cbjsdev/http-client';
import { BucketName, CouchbaseClusterTypes, ScopeName } from '@cbjsdev/shared';

import { CppError } from './binding';
import { errorFromCpp } from './bindingutilities';
import { Cluster } from './cluster';
import {
  AllowSearchQueryingOptions,
  AnalyzeSearchDocumentOptions,
  DisallowSearchQueryingOptions,
  DropSearchIndexOptions,
  FreezeSearchPlanOptions,
  GetAllSearchIndexesOptions,
  GetSearchIndexedDocumentsCountOptions,
  GetSearchIndexOptions,
  ISearchIndex,
  PauseSearchIngestOptions,
  ResumeSearchIngestOptions,
  SearchIndex,
  UnfreezeSearchPlanOptions,
  UpsertSearchIndexOptions,
} from './searchindexmanager';
import { NodeCallback, VoidNodeCallback } from './utilities';
import { resolveOptionsAndCallback } from './utils/resolveOptionsAndCallback';

/**
 * SearchIndexManager provides an interface for managing the
 * search indexes on the cluster.
 *
 * @category Management
 */
export class ScopeSearchIndexManager<
  in out T extends CouchbaseClusterTypes = CouchbaseClusterTypes,
  in out B extends BucketName<T> = BucketName<T>,
  in out S extends ScopeName<T, B> = ScopeName<T, B>,
> {
  private _cluster: Cluster<T>;
  private _bucketName: B;
  private _scopeName: S;

  /**
   * @internal
   */
  constructor(cluster: Cluster<T>, bucketName: B, scopeName: S) {
    this._cluster = cluster;
    this._bucketName = bucketName;
    this._scopeName = scopeName;
  }

  /**
   * Returns an index by it's name.
   *
   * @param indexName The index to retrieve.
   * @param options Optional parameters for this operation.
   * @param callback A node-style callback to be invoked after execution.
   */
  async getIndex(
    indexName: string,
    options: GetSearchIndexOptions,
    callback?: NodeCallback<SearchIndex>
  ): Promise<SearchIndex>;
  async getIndex(
    indexName: string,
    callback?: NodeCallback<SearchIndex>
  ): Promise<SearchIndex>;
  async getIndex(
    indexName: string,
    ...args:
      | [GetSearchIndexOptions, NodeCallback<SearchIndex>?]
      | [NodeCallback<SearchIndex>?]
  ): Promise<SearchIndex> {
    const [options = {}, callback] = resolveOptionsAndCallback(args);

    const timeout = options.timeout ?? this._cluster.managementTimeout;

    const get = promisify(this._cluster.conn.managementSearchIndexGet).bind(
      this._cluster.conn
    );

    try {
      const response = await get({
        index_name: indexName,
        timeout: timeout,
        bucket_name: this._bucketName,
        scope_name: this._scopeName,
      });

      const result = SearchIndex._fromCppData(response.index);

      if (callback) {
        callback(null, result);
      }

      return result;
    } catch (cppError: unknown) {
      const err = errorFromCpp(cppError as CppError);

      if (callback) {
        callback(err, null);
      }

      throw err;
    }
  }

  /**
   * Returns a list of all existing indexes.
   *
   * @param options Optional parameters for this operation.
   * @param callback A node-style callback to be invoked after execution.
   */
  async getAllIndexes(
    options: GetAllSearchIndexesOptions,
    callback?: NodeCallback<SearchIndex[]>
  ): Promise<SearchIndex[]>;
  async getAllIndexes(callback?: NodeCallback<SearchIndex[]>): Promise<SearchIndex[]>;
  async getAllIndexes(
    ...args:
      | [GetAllSearchIndexesOptions, NodeCallback<SearchIndex[]>?]
      | [NodeCallback<SearchIndex[]>?]
  ): Promise<SearchIndex[]> {
    const [options = {}, callback] = resolveOptionsAndCallback(args);

    const timeout = options.timeout ?? this._cluster.managementTimeout;

    const getAll = promisify(this._cluster.conn.managementSearchIndexGetAll).bind(
      this._cluster.conn
    );

    try {
      const response = await getAll({
        timeout: timeout,
        bucket_name: this._bucketName,
        scope_name: this._scopeName,
      });

      const indexes = response.indexes.map((indexData) =>
        SearchIndex._fromCppData(indexData)
      );

      if (callback) {
        callback(null, indexes);
      }

      return indexes;
    } catch (cppError: unknown) {
      const err = errorFromCpp(cppError as CppError);

      if (callback) {
        callback(err, null);
      }

      throw err;
    }
  }

  /**
   * Creates or updates an existing index.
   *
   * @param indexDefinition The index to update.
   * @param options Optional parameters for this operation.
   * @param callback A node-style callback to be invoked after execution.
   */
  async upsertIndex(
    indexDefinition: ISearchIndex,
    options: UpsertSearchIndexOptions,
    callback?: VoidNodeCallback
  ): Promise<void>;
  async upsertIndex(
    indexDefinition: ISearchIndex,
    callback?: VoidNodeCallback
  ): Promise<void>;
  async upsertIndex(
    indexDefinition: ISearchIndex,
    ...args: [UpsertSearchIndexOptions, VoidNodeCallback?] | [VoidNodeCallback?]
  ): Promise<void> {
    const [options = {}, callback] = resolveOptionsAndCallback(args);

    const timeout = options.timeout ?? this._cluster.managementTimeout;

    const upsert = promisify(this._cluster.conn.managementSearchIndexUpsert).bind(
      this._cluster.conn
    );

    try {
      await upsert({
        index: SearchIndex._toCppData(indexDefinition),
        timeout: timeout,
        bucket_name: this._bucketName,
        scope_name: this._scopeName,
      });

      if (callback) {
        callback(null);
      }

      return;
    } catch (cppError: unknown) {
      const err = errorFromCpp(cppError as CppError);

      if (callback) {
        callback(err);
      }

      throw err;
    }
  }

  /**
   * Drops an index.
   *
   * @param indexName The name of the index to drop.
   * @param options Optional parameters for this operation.
   * @param callback A node-style callback to be invoked after execution.
   */
  async dropIndex(
    indexName: string,
    options: DropSearchIndexOptions,
    callback?: VoidNodeCallback
  ): Promise<void>;
  async dropIndex(indexName: string, callback?: VoidNodeCallback): Promise<void>;
  async dropIndex(
    indexName: string,
    ...args: [DropSearchIndexOptions, VoidNodeCallback?] | [VoidNodeCallback?]
  ): Promise<void> {
    const [options = {}, callback] = resolveOptionsAndCallback(args);

    const timeout = options.timeout ?? this._cluster.managementTimeout;

    const drop = promisify(this._cluster.conn.managementSearchIndexDrop).bind(
      this._cluster.conn
    );

    try {
      await drop({
        index_name: indexName,
        timeout: timeout,
        bucket_name: this._bucketName,
        scope_name: this._scopeName,
      });

      if (callback) {
        callback(null);
      }

      return;
    } catch (cppError: unknown) {
      const err = errorFromCpp(cppError as CppError);

      if (callback) {
        callback(err);
      }

      throw err;
    }
  }

  /**
   * Returns the number of documents that have been indexed.
   *
   * @param indexName The name of the index to return the count for.
   * @param options Optional parameters for this operation.
   * @param callback A node-style callback to be invoked after execution.
   */
  async getIndexedDocumentsCount(
    indexName: string,
    options: GetSearchIndexedDocumentsCountOptions,
    callback?: NodeCallback<number>
  ): Promise<number>;
  async getIndexedDocumentsCount(
    indexName: string,
    callback?: NodeCallback<number>
  ): Promise<number>;
  async getIndexedDocumentsCount(
    indexName: string,
    ...args:
      | [GetSearchIndexedDocumentsCountOptions, NodeCallback<number>?]
      | [NodeCallback<number>?]
  ): Promise<number> {
    const [options = {}, callback] = resolveOptionsAndCallback(args);

    const timeout = options.timeout ?? this._cluster.managementTimeout;

    const count = promisify(
      this._cluster.conn.managementSearchIndexGetDocumentsCount
    ).bind(this._cluster.conn);

    try {
      const response = (await count({
        index_name: indexName,
        timeout: timeout,
        bucket_name: this._bucketName,
        scope_name: this._scopeName,
      })) as { count: number };

      if (callback) {
        callback(null, response.count);
      }

      return response.count;
    } catch (cppError: unknown) {
      const err = errorFromCpp(cppError as CppError);

      if (callback) {
        callback(err, null);
      }

      throw err;
    }
  }

  /**
   * Pauses the ingestion of documents into an index.
   *
   * @param indexName The name of the index to pause.
   * @param options Optional parameters for this operation.
   * @param callback A node-style callback to be invoked after execution.
   */
  async pauseIngest(
    indexName: string,
    options: PauseSearchIngestOptions,
    callback?: VoidNodeCallback
  ): Promise<void>;
  async pauseIngest(indexName: string, callback?: VoidNodeCallback): Promise<void>;
  async pauseIngest(
    indexName: string,
    ...args: [PauseSearchIngestOptions, VoidNodeCallback?] | [VoidNodeCallback?]
  ): Promise<void> {
    const [options = {}, callback] = resolveOptionsAndCallback(args);

    const timeout = options.timeout ?? this._cluster.managementTimeout;

    const pause = promisify(this._cluster.conn.managementSearchIndexControlIngest).bind(
      this._cluster.conn
    );

    try {
      await pause({
        index_name: indexName,
        pause: true,
        timeout: timeout,
        bucket_name: this._bucketName,
        scope_name: this._scopeName,
      });

      if (callback) {
        callback(null);
      }

      return;
    } catch (cppError: unknown) {
      const err = errorFromCpp(cppError as CppError);

      if (callback) {
        callback(err);
      }

      throw err;
    }
  }

  /**
   * Resumes the ingestion of documents into an index.
   *
   * @param indexName The name of the index to resume.
   * @param options Optional parameters for this operation.
   * @param callback A node-style callback to be invoked after execution.
   */
  async resumeIngest(
    indexName: string,
    options: ResumeSearchIngestOptions,
    callback?: VoidNodeCallback
  ): Promise<void>;
  async resumeIngest(indexName: string, callback?: VoidNodeCallback): Promise<void>;
  async resumeIngest(
    indexName: string,
    ...args: [ResumeSearchIngestOptions, VoidNodeCallback?] | [VoidNodeCallback?]
  ): Promise<void> {
    const [options = {}, callback] = resolveOptionsAndCallback(args);

    const timeout = options.timeout ?? this._cluster.managementTimeout;

    const resume = promisify(this._cluster.conn.managementSearchIndexControlIngest).bind(
      this._cluster.conn
    );

    try {
      await resume({
        index_name: indexName,
        pause: false,
        timeout: timeout,
        bucket_name: this._bucketName,
        scope_name: this._scopeName,
      });

      if (callback) {
        callback(null);
      }

      return;
    } catch (cppError: unknown) {
      const err = errorFromCpp(cppError as CppError);

      if (callback) {
        callback(err);
      }

      throw err;
    }
  }

  /**
   * Enables querying of an index.
   *
   * @param indexName The name of the index to enable querying for.
   * @param options Optional parameters for this operation.
   * @param callback A node-style callback to be invoked after execution.
   */
  async allowQuerying(
    indexName: string,
    options: AllowSearchQueryingOptions,
    callback?: VoidNodeCallback
  ): Promise<void>;
  async allowQuerying(indexName: string, callback?: VoidNodeCallback): Promise<void>;
  async allowQuerying(
    indexName: string,
    ...args: [AllowSearchQueryingOptions, VoidNodeCallback?] | [VoidNodeCallback?]
  ): Promise<void> {
    const [options = {}, callback] = resolveOptionsAndCallback(args);

    const timeout = options.timeout ?? this._cluster.managementTimeout;

    const allow = promisify(this._cluster.conn.managementSearchIndexControlQuery).bind(
      this._cluster.conn
    );

    try {
      await allow({
        index_name: indexName,
        allow: true,
        timeout: timeout,
        bucket_name: this._bucketName,
        scope_name: this._scopeName,
      });

      if (callback) {
        callback(null);
      }

      return;
    } catch (cppError: unknown) {
      const err = errorFromCpp(cppError as CppError);

      if (callback) {
        callback(err);
      }

      throw err;
    }
  }

  /**
   * Disables querying of an index.
   *
   * @param indexName The name of the index to disable querying for.
   * @param options Optional parameters for this operation.
   * @param callback A node-style callback to be invoked after execution.
   */
  async disallowQuerying(
    indexName: string,
    options: DisallowSearchQueryingOptions,
    callback?: VoidNodeCallback
  ): Promise<void>;
  async disallowQuerying(indexName: string, callback?: VoidNodeCallback): Promise<void>;
  async disallowQuerying(
    indexName: string,
    ...args: [DisallowSearchQueryingOptions, VoidNodeCallback?] | [VoidNodeCallback?]
  ): Promise<void> {
    const [options = {}, callback] = resolveOptionsAndCallback(args);

    const timeout = options.timeout ?? this._cluster.managementTimeout;

    const disallow = promisify(this._cluster.conn.managementSearchIndexControlQuery).bind(
      this._cluster.conn
    );

    try {
      await disallow({
        index_name: indexName,
        allow: false,
        timeout: timeout,
        bucket_name: this._bucketName,
        scope_name: this._scopeName,
      });

      if (callback) {
        callback(null);
      }

      return;
    } catch (cppError: unknown) {
      const err = errorFromCpp(cppError as CppError);

      if (callback) {
        callback(err);
      }

      throw err;
    }
  }

  /**
   * Freezes the indexing plan for execution of queries.
   *
   * @param indexName The name of the index to freeze the plan of.
   * @param options Optional parameters for this operation.
   * @param callback A node-style callback to be invoked after execution.
   */
  async freezePlan(
    indexName: string,
    options: FreezeSearchPlanOptions,
    callback?: VoidNodeCallback
  ): Promise<void>;
  async freezePlan(indexName: string, callback?: VoidNodeCallback): Promise<void>;
  async freezePlan(
    indexName: string,
    ...args: [FreezeSearchPlanOptions, VoidNodeCallback?] | [VoidNodeCallback?]
  ): Promise<void> {
    const [options = {}, callback] = resolveOptionsAndCallback(args);

    const timeout = options.timeout ?? this._cluster.managementTimeout;

    const freeze = promisify(
      this._cluster.conn.managementSearchIndexControlPlanFreeze
    ).bind(this._cluster.conn);

    try {
      await freeze({
        index_name: indexName,
        freeze: true,
        timeout: timeout,
        bucket_name: this._bucketName,
        scope_name: this._scopeName,
      });

      if (callback) {
        callback(null);
      }

      return;
    } catch (cppError: unknown) {
      const err = errorFromCpp(cppError as CppError);

      if (callback) {
        callback(err);
      }

      throw err;
    }
  }

  /**
   * Unfreezes the indexing plan for execution of queries.
   *
   * @param indexName The name of the index to freeze the plan of.
   * @param options Optional parameters for this operation.
   * @param callback A node-style callback to be invoked after execution.
   */
  async unfreezePlan(
    indexName: string,
    options: UnfreezeSearchPlanOptions,
    callback?: VoidNodeCallback
  ): Promise<void>;
  async unfreezePlan(indexName: string, callback?: VoidNodeCallback): Promise<void>;
  async unfreezePlan(
    indexName: string,
    ...args: [UnfreezeSearchPlanOptions, VoidNodeCallback?] | [VoidNodeCallback?]
  ): Promise<void> {
    const [options = {}, callback] = resolveOptionsAndCallback(args);

    const timeout = options.timeout ?? this._cluster.managementTimeout;

    const freeze = promisify(
      this._cluster.conn.managementSearchIndexControlPlanFreeze
    ).bind(this._cluster.conn);

    try {
      await freeze({
        index_name: indexName,
        freeze: false,
        timeout: timeout,
        bucket_name: this._bucketName,
        scope_name: this._scopeName,
      });

      if (callback) {
        callback(null);
      }

      return;
    } catch (cppError: unknown) {
      const err = errorFromCpp(cppError as CppError);

      if (callback) {
        callback(err);
        return;
      }

      throw err;
    }
  }

  /**
   * Performs analysis of a specific document by an index.
   *
   * @param indexName The name of the index to use for the analysis.
   * @param document The document to analyze.
   * @param options Optional parameters for this operation.
   * @param callback A node-style callback to be invoked after execution.
   */
  async analyzeDocument(
    indexName: string,
    document: unknown,
    options: AnalyzeSearchDocumentOptions,
    callback?: NodeCallback<ApiSearchIndexSuccessfulAnalysis['analyzed']>
  ): Promise<ApiSearchIndexSuccessfulAnalysis['analyzed']>;
  async analyzeDocument(
    indexName: string,
    document: unknown,
    callback?: NodeCallback<ApiSearchIndexSuccessfulAnalysis['analyzed']>
  ): Promise<ApiSearchIndexSuccessfulAnalysis['analyzed']>;
  async analyzeDocument(
    indexName: string,
    document: unknown,
    ...args:
      | [
          AnalyzeSearchDocumentOptions,
          NodeCallback<ApiSearchIndexSuccessfulAnalysis['analyzed']>?,
        ]
      | [NodeCallback<ApiSearchIndexSuccessfulAnalysis['analyzed']>?]
  ): Promise<ApiSearchIndexSuccessfulAnalysis['analyzed']> {
    const [options = {}, callback] = resolveOptionsAndCallback(args);

    const timeout = options.timeout ?? this._cluster.managementTimeout;

    const analyze = promisify(
      this._cluster.conn.managementSearchIndexAnalyzeDocument
    ).bind(this._cluster.conn);

    try {
      const response = await analyze({
        index_name: indexName,
        encoded_document: JSON.stringify(document),
        timeout: timeout,
        bucket_name: this._bucketName,
        scope_name: this._scopeName,
      });

      const result = JSON.parse(response.analysis);

      if (callback) {
        callback(null, result);
      }

      return result;
    } catch (cppError: unknown) {
      const err = errorFromCpp(cppError as CppError);

      if (callback) {
        callback(err, null);
      }

      throw err;
    }
  }
}
