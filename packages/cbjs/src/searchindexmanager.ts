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

import {
  ApiSearchIndexDefinition,
  ApiSearchIndexSuccessfulAnalysis,
} from '@cbjsdev/http-client';
import { CouchbaseClusterTypes } from '@cbjsdev/shared';

import { CppError, CppManagementSearchIndex } from './binding.js';
import { errorFromCpp } from './bindingutilities.js';
import { Cluster } from './cluster.js';
import { SearchIndexManagementError, SearchIndexNotFoundError } from './errors.js';
import { HttpExecutor, HttpMethod, HttpServiceType } from './httpexecutor.js';
import { NodeCallback, PromiseHelper, VoidNodeCallback } from './utilities.js';

/**
 * Provides information about a search index.  This class is currently
 * incomplete and must be casted from `any` in TypeScript.
 *
 * @category Management
 */
export type ISearchIndex = ApiSearchIndexDefinition;

/**
 * This class is currently incomplete and must be casted to `any` in
 * TypeScript to be used.
 *
 * @category Management
 */
export class SearchIndex {
  /**
   * The UUID of the search index.  Used for updates to ensure consistency.
   */
  uuid?: string;

  /**
   * The name of the search index.
   */
  name: string;

  /**
   * Name of the source of the data (ie: the bucket name).
   */
  sourceName: string;

  /**
   * The type of index to use (fulltext-index or fulltext-alias).
   */
  type: string;

  /**
   * Parameters to specify such as the store type and mappins.
   */
  params: { [key: string]: any };

  /**
   * The UUID of the data source.
   */
  sourceUuid: string;

  /**
   * Extra parameters for the source.  These are usually things like advanced
   * connection options and tuning parameters.
   */
  sourceParams: { [key: string]: any };

  /**
   * The type of the source (couchbase or nil).
   */
  sourceType: string;

  /**
   * Plan properties such as the number of replicas and number of partitions.
   */
  planParams: { [key: string]: any };

  /**
   * @internal
   */
  constructor(data: SearchIndex) {
    this.uuid = data.uuid;
    this.name = data.name;
    this.sourceName = data.sourceName;
    this.type = data.type;
    this.params = data.params;
    this.sourceUuid = data.sourceUuid;
    this.sourceParams = data.sourceParams;
    this.sourceType = data.sourceType;
    this.planParams = data.planParams;
  }

  /**
   * @internal
   */
  static _toCppData(data: ISearchIndex): any {
    return {
      uuid: data.uuid,
      name: data.name,
      type: data.type,
      params_json: JSON.stringify(data.params),
      source_uuid: data.sourceUUID,
      source_name: data.sourceName,
      source_type: data.sourceType,
      source_params_json: JSON.stringify(data.sourceParams),
      plan_params_json: JSON.stringify(data.planParams),
    };
  }

  /**
   * @internal
   */
  static _fromCppData(data: CppManagementSearchIndex): SearchIndex {
    const idx = new SearchIndex({
      uuid: data.uuid,
      name: data.name,
      type: data.type,
      params: {},
      sourceUuid: data.source_uuid,
      sourceName: data.source_name,
      sourceType: data.source_type,
      sourceParams: {},
      planParams: {},
    });
    if (data.params_json) {
      idx.params = JSON.parse(data.params_json);
    }
    if (data.source_params_json) {
      idx.sourceParams = JSON.parse(data.source_params_json);
    }
    if (data.plan_params_json) {
      idx.planParams = JSON.parse(data.plan_params_json);
    }
    return idx;
  }
}

/**
 * @category Management
 */
export interface GetSearchIndexOptions {
  /**
   * The timeout for this operation, represented in milliseconds.
   */
  timeout?: number;
}

/**
 * @category Management
 */
export interface GetAllSearchIndexesOptions {
  /**
   * The timeout for this operation, represented in milliseconds.
   */
  timeout?: number;
}

/**
 * @category Management
 */
export interface UpsertSearchIndexOptions {
  /**
   * The timeout for this operation, represented in milliseconds.
   */
  timeout?: number;
}

/**
 * @category Management
 */
export interface DropSearchIndexOptions {
  /**
   * The timeout for this operation, represented in milliseconds.
   */
  timeout?: number;
}

/**
 * @category Management
 */
export interface GetSearchIndexedDocumentsCountOptions {
  /**
   * The timeout for this operation, represented in milliseconds.
   */
  timeout?: number;
}

/**
 * @category Management
 */
export interface PauseSearchIngestOptions {
  /**
   * The timeout for this operation, represented in milliseconds.
   */
  timeout?: number;
}

/**
 * @category Management
 */
export interface ResumeSearchIngestOptions {
  /**
   * The timeout for this operation, represented in milliseconds.
   */
  timeout?: number;
}

/**
 * @category Management
 */
export interface AllowSearchQueryingOptions {
  /**
   * The timeout for this operation, represented in milliseconds.
   */
  timeout?: number;
}

/**
 * @category Management
 */
export interface DisallowSearchQueryingOptions {
  /**
   * The timeout for this operation, represented in milliseconds.
   */
  timeout?: number;
}

/**
 * @category Management
 */
export interface FreezeSearchPlanOptions {
  /**
   * The timeout for this operation, represented in milliseconds.
   */
  timeout?: number;
}

/**
 * @category Management
 */
export interface UnfreezeSearchPlanOptions {
  /**
   * The timeout for this operation, represented in milliseconds.
   */
  timeout?: number;
}

/**
 * @category Management
 */
export interface AnalyzeSearchDocumentOptions {
  /**
   * The timeout for this operation, represented in milliseconds.
   */
  timeout?: number;
}

/**
 * SearchIndexManager provides an interface for managing the
 * search indexes on the cluster.
 *
 * @category Management
 */
export class SearchIndexManager<T extends CouchbaseClusterTypes = CouchbaseClusterTypes> {
  private _cluster: Cluster<T>;

  /**
   * @internal
   */
  constructor(cluster: Cluster<T>) {
    this._cluster = cluster;
  }

  private get _http() {
    return new HttpExecutor(this._cluster.conn);
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
    options?: GetSearchIndexOptions | NodeCallback<SearchIndex>,
    callback?: NodeCallback<SearchIndex>
  ): Promise<SearchIndex> {
    if (options instanceof Function) {
      callback = options;
      options = undefined;
    }
    if (!options) {
      options = {};
    }

    const timeout = options.timeout ?? this._cluster.managementTimeout;

    return PromiseHelper.wrap((wrapCallback) => {
      this._cluster.conn.managementSearchIndexGet(
        {
          index_name: indexName,
          timeout: timeout,
        },
        (cppErr, resp) => {
          const err = errorFromCpp(cppErr);
          if (err) {
            return wrapCallback(err, null);
          }
          const index = SearchIndex._fromCppData(resp.index);
          wrapCallback(null, index);
        }
      );
    }, callback);
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
    options?: GetAllSearchIndexesOptions | NodeCallback<SearchIndex[]>,
    callback?: NodeCallback<SearchIndex[]>
  ): Promise<SearchIndex[]> {
    if (options instanceof Function) {
      callback = options;
      options = undefined;
    }
    if (!options) {
      options = {};
    }

    const timeout = options.timeout ?? this._cluster.managementTimeout;

    return PromiseHelper.wrap((wrapCallback) => {
      this._cluster.conn.managementSearchIndexGetAll(
        {
          timeout: timeout,
        },
        (cppErr, resp) => {
          const err = errorFromCpp(cppErr);
          if (err) {
            return wrapCallback(err, null);
          }
          const indexes = resp.indexes.map((indexData: any) =>
            SearchIndex._fromCppData(indexData)
          );
          wrapCallback(null, indexes);
        }
      );
    }, callback);
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
    options?: UpsertSearchIndexOptions | VoidNodeCallback,
    callback?: VoidNodeCallback
  ): Promise<void> {
    if (options instanceof Function) {
      callback = options;
      options = undefined;
    }
    if (!options) {
      options = {};
    }

    const indexName = indexDefinition.name;
    const timeout = options.timeout ?? this._cluster.managementTimeout;

    return await PromiseHelper.wrapAsync(async () => {
      const res = await this._http.request({
        type: HttpServiceType.Search,
        method: HttpMethod.Put,
        path: `/api/index/${indexName}`,
        contentType: 'application/json',
        body: JSON.stringify(indexDefinition),
        timeout: timeout,
      });

      if (res.statusCode === 400) {
        const body = JSON.parse(res.body.toString()) as {
          status: 'ok' | 'fail';
          error?: string;
        };

        throw new SearchIndexManagementError(
          `failed to create index: ${body.error}`,
          undefined,
          HttpExecutor.errorContextFromResponse(res)
        );
      }

      if (res.statusCode !== 200) {
        throw new SearchIndexManagementError('failed to create index');
      }
    }, callback);
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
    options?: DropSearchIndexOptions | VoidNodeCallback,
    callback?: VoidNodeCallback
  ): Promise<void> {
    if (options instanceof Function) {
      callback = options;
      options = undefined;
    }
    if (!options) {
      options = {};
    }

    const timeout = options.timeout ?? this._cluster.managementTimeout;

    return PromiseHelper.wrapAsync(async () => {
      const res = await this._http.request({
        type: HttpServiceType.Search,
        method: HttpMethod.Delete,
        path: `/api/index/${indexName}`,
        timeout: timeout,
      });

      if (res.statusCode === 400) {
        throw new SearchIndexNotFoundError(
          indexName,
          HttpExecutor.errorContextFromResponse(res)
        );
      }

      if (res.statusCode !== 200) {
        throw new Error('failed to delete search index');
      }

      return JSON.parse(res.body.toString());
    }, callback);
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
    options?: GetSearchIndexedDocumentsCountOptions | NodeCallback<number>,
    callback?: NodeCallback<number>
  ): Promise<number> {
    if (options instanceof Function) {
      callback = options;
      options = undefined;
    }
    if (!options) {
      options = {};
    }

    const timeout = options.timeout ?? this._cluster.managementTimeout;

    return PromiseHelper.wrap((wrapCallback) => {
      this._cluster.conn.managementSearchIndexGetDocumentsCount(
        {
          index_name: indexName,
          timeout: timeout,
        },
        (cppErr, resp) => {
          const err = errorFromCpp(cppErr);
          if (err) {
            return wrapCallback(err, null);
          }
          wrapCallback(null, resp.count);
        }
      );
    }, callback);
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
    options?: PauseSearchIngestOptions | VoidNodeCallback,
    callback?: VoidNodeCallback
  ): Promise<void> {
    if (options instanceof Function) {
      callback = options;
      options = undefined;
    }
    if (!options) {
      options = {};
    }

    const timeout = options.timeout ?? this._cluster.managementTimeout;

    return PromiseHelper.wrapAsync(async () => {
      const res = await this._http.request({
        type: HttpServiceType.Search,
        method: HttpMethod.Post,
        path: `/api/index/${indexName}/ingestControl/pause`,
        timeout: timeout,
      });

      if (res.statusCode !== 200) {
        throw new Error('failed to pause search index ingestion');
      }
    }, callback);
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
    options?: ResumeSearchIngestOptions | VoidNodeCallback,
    callback?: VoidNodeCallback
  ): Promise<void> {
    if (options instanceof Function) {
      callback = options;
      options = undefined;
    }
    if (!options) {
      options = {};
    }

    const timeout = options.timeout ?? this._cluster.managementTimeout;

    return PromiseHelper.wrapAsync(async () => {
      const res = await this._http.request({
        type: HttpServiceType.Search,
        method: HttpMethod.Post,
        path: `/api/index/${indexName}/ingestControl/resume`,
        timeout: timeout,
      });

      if (res.statusCode !== 200) {
        throw new Error('failed to resume search index ingestion');
      }
    }, callback);
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
    options?: AllowSearchQueryingOptions | VoidNodeCallback,
    callback?: VoidNodeCallback
  ): Promise<void> {
    if (options instanceof Function) {
      callback = options;
      options = undefined;
    }
    if (!options) {
      options = {};
    }

    const timeout = options.timeout ?? this._cluster.managementTimeout;

    return PromiseHelper.wrapAsync(async () => {
      const res = await this._http.request({
        type: HttpServiceType.Search,
        method: HttpMethod.Post,
        path: `/api/index/${indexName}/queryControl/allow`,
        timeout: timeout,
      });

      if (res.statusCode !== 200) {
        throw new Error('failed to allow search index quering');
      }
    }, callback);
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
    options?: DisallowSearchQueryingOptions | VoidNodeCallback,
    callback?: VoidNodeCallback
  ): Promise<void> {
    if (options instanceof Function) {
      callback = options;
      options = undefined;
    }
    if (!options) {
      options = {};
    }

    const timeout = options.timeout ?? this._cluster.managementTimeout;

    return PromiseHelper.wrapAsync(async () => {
      const res = await this._http.request({
        type: HttpServiceType.Search,
        method: HttpMethod.Post,
        path: `/api/index/${indexName}/queryControl/disallow`,
        timeout: timeout,
      });

      if (res.statusCode !== 200) {
        throw new Error('failed to disallow search index quering');
      }
    }, callback);
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
    options?: FreezeSearchPlanOptions | VoidNodeCallback,
    callback?: VoidNodeCallback
  ): Promise<void> {
    if (options instanceof Function) {
      callback = options;
      options = undefined;
    }
    if (!options) {
      options = {};
    }

    const timeout = options.timeout ?? this._cluster.managementTimeout;

    return PromiseHelper.wrapAsync(async () => {
      const res = await this._http.request({
        type: HttpServiceType.Search,
        method: HttpMethod.Post,
        path: `/api/index/${indexName}/planFreezeControl/freeze`,
        timeout: timeout,
      });

      if (res.statusCode !== 200) {
        throw new Error('failed to freeze search index plan');
      }
    }, callback);
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
    document: any,
    options: AnalyzeSearchDocumentOptions,
    callback?: NodeCallback<ApiSearchIndexSuccessfulAnalysis['analyzed']>
  ): Promise<ApiSearchIndexSuccessfulAnalysis['analyzed']>;
  async analyzeDocument(
    indexName: string,
    document: any,
    callback?: NodeCallback<ApiSearchIndexSuccessfulAnalysis['analyzed']>
  ): Promise<ApiSearchIndexSuccessfulAnalysis['analyzed']>;
  async analyzeDocument(
    indexName: string,
    document: any,
    options?:
      | AnalyzeSearchDocumentOptions
      | NodeCallback<ApiSearchIndexSuccessfulAnalysis['analyzed']>,
    callback?: NodeCallback<ApiSearchIndexSuccessfulAnalysis['analyzed']>
  ): Promise<ApiSearchIndexSuccessfulAnalysis['analyzed']> {
    if (options instanceof Function) {
      callback = options;
      options = undefined;
    }
    if (!options) {
      options = {};
    }

    const timeout = options.timeout ?? this._cluster.managementTimeout;

    const analyze = promisify(
      this._cluster.conn.managementSearchIndexAnalyzeDocument
    ).bind(this._cluster.conn);

    try {
      const response = await analyze({
        index_name: indexName,
        encoded_document: JSON.stringify(document),
        timeout: timeout,
      });

      const analysisResult = JSON.parse(
        response.analysis
      ) as ApiSearchIndexSuccessfulAnalysis['analyzed'];

      if (callback) {
        callback(null, analysisResult);
      }

      return analysisResult;
    } catch (cppError: unknown) {
      const err = errorFromCpp(cppError as CppError);

      if (callback) {
        callback(err, null);
      }

      throw err;
    }
  }
}
