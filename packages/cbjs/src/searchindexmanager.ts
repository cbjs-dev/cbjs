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
import { Cluster } from './cluster';
import {
  IndexNotFoundError,
  SearchIndexManagementError,
  SearchIndexNotFoundError,
} from './errors';
import { HttpExecutor, HttpMethod, HttpServiceType } from './httpexecutor';
import { NodeCallback, PromiseHelper, VoidNodeCallback } from './utilities';

/**
 * Provides information about a search index.  This class is currently
 * incomplete and must be casted from `any` in TypeScript.
 *
 * @category Management
 */
export type ISearchIndex = SearchIndexCommonConfig &
  SearchIndexConfigIndexParams &
  SearchIndexConfigSourceParams;

export type SearchIndexCommonConfig = {
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
   * The UUID of the data source.
   */
  sourceUUID?: string;

  /**
   * Plan properties such as the number of replicas and number of partitions.
   */
  planParams?: {
    hierarchyRules?: unknown;
    maxPartitionsPerPIndex?: number;
    nodePlanParams?: unknown;
    numReplicas?: number;
    indexPartitions?: number;
    planFrozen?: boolean;
  };
};

type SearchIndexConfigIndexParams =
  | {
      /**
       * The type of index to use.
       */
      type: 'fulltext-alias';

      /**
       * Parameters to specify such as the store type and mappings.
       */
      params: SearchIndexIndexParamsCommon & SearchIndexIndexParamsIndexTypeAlias;
    }
  | {
      /**
       * The type of index to use.
       */
      type: 'fulltext-index';

      /**
       * Parameters to specify such as the store type and mappings.
       */
      params: SearchIndexIndexParamsCommon & SearchIndexIndexParamsIndexTypeBleve;
    };

type SearchIndexIndexParamsCommon = {
  doc_config: {
    docid_prefix_delim?: string;
    docid_regexp?: string;
    mode:
      | 'docid_prefix'
      | 'scope.collection.type_field'
      | (string & NonNullable<unknown>);
    type_field: string;
  };
  store?: {
    kvStoreName?: string;
    indexType?: 'scorch' | (string & NonNullable<unknown>);
    segmentVersion?: number;
  };
};

type SearchIndexIndexParamsIndexTypeAlias = {
  targets: {
    [indexName: string]: {
      indexUUID: string;
    };
  };
};

type SearchIndexMappingFieldType =
  | 'text'
  | 'number'
  | 'datetime'
  | 'boolean'
  | 'disabled'
  | 'geopoint'
  | 'geoshape'
  | 'ip';

type SearchIndexMappingFieldAnalyzer =
  | 'ar'
  | 'cjk'
  | 'ckb'
  | 'da'
  | 'de'
  | 'en'
  | 'es'
  | 'fa'
  | 'fi'
  | 'fr'
  | 'he'
  | 'hi'
  | 'hr'
  | 'hu'
  | 'it'
  | 'keyword'
  | 'nl'
  | 'no'
  | 'pt'
  | 'ro'
  | 'ru'
  | 'simple'
  | 'standard'
  | 'sv'
  | 'tr'
  | 'web';

type SearchIndexIndexParamsIndexTypeBleve = {
  mapping: {
    default_mapping: {
      enabled: boolean;
      dynamic: boolean;
      default_analyzer?: string;
    };
    default_type: string;
    docvalues_dynamic?: boolean;
    default_analyzer: SearchIndexMappingFieldAnalyzer;
    default_datetime_parser: string;
    default_field: '_all' | (string & NonNullable<unknown>);
    byte_array_converter?: 'json' | (string & NonNullable<unknown>);
    analysis?: unknown;
    index_dynamic?: boolean;
    store_dynamic?: boolean;
    type_field: string;
    types: {
      [bucketName: string]: {
        dynamic: boolean;
        enabled: boolean;
        properties: {
          [name: string]: {
            enabled: boolean;
            dynamic: boolean;
            fields: Array<{
              analyzer?: SearchIndexMappingFieldAnalyzer;
              docvalues?: boolean;
              include_in_all?: boolean;
              include_term_vectors?: boolean;
              index: boolean;
              name: string;
              store: boolean;
              type: SearchIndexMappingFieldType;
            }>;
          };
        };
      };
    };
  };
};

type SearchIndexConfigSourceParams =
  | {
      /**
       * The type of the source.
       */
      sourceType: 'couchbase' | 'gocbcore';

      /**
       * Extra parameters for the source. These are usually things like advanced
       * connection options and tuning parameters.
       */
      sourceParams?: SearchIndexConfigSourceParamsCouchbase;
    }
  | {
      /**
       * The type of the source.
       */
      sourceType: 'nil';

      /**
       * Extra parameters for the source. These are usually things like advanced
       * connection options and tuning parameters.
       */
      sourceParams?: unknown;
    };

type SearchIndexConfigSourceParamsCouchbase = {
  authUser?: string;
  authPassword?: string;
  authSaslUser?: string;
  authSaslPassword?: string;
  clusterManagerBackoffFactor?: number;
  clusterManagerSleepInitMS?: number;
  clusterManagerSleepMaxMS?: number;
  dataManagerBackoffFactor?: number;
  dataManagerSleepInitMS?: number;
  dataManagerSleepMaxMS?: number;
  feedBufferSizeBytes?: number;
  feedBufferAckThreshold?: number;
};

/**
 * This class is currently incomplete and must be casted to `any` in
 * TypeScript to be used.
 *
 * @category Management
 */
export class SearchIndex {
  /**
   * The name of the search index.
   */
  name: string;

  /**
   * @internal
   */
  constructor(data: SearchIndex) {
    this.name = data.name;
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
export class SearchIndexManager {
  private _cluster: Cluster;

  /**
   * @internal
   */
  constructor(cluster: Cluster) {
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

    const timeout = options.timeout || this._cluster.managementTimeout;

    return PromiseHelper.wrapAsync(async () => {
      const res = await this._http.request({
        type: HttpServiceType.Search,
        method: HttpMethod.Get,
        path: `/api/index/${indexName}`,
        timeout: timeout,
      });

      if (res.statusCode !== 200) {
        throw new IndexNotFoundError();
      }

      const idxData = JSON.parse(res.body.toString());
      return idxData.indexDef as SearchIndex;
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

    const timeout = options.timeout || this._cluster.managementTimeout;

    return PromiseHelper.wrapAsync(async () => {
      const res = await this._http.request({
        type: HttpServiceType.Search,
        method: HttpMethod.Get,
        path: `/api/index`,
        timeout: timeout,
      });

      if (res.statusCode !== 200) {
        throw new Error('failed to fetch search indices');
      }

      const idxsData = JSON.parse(res.body.toString());
      return Object.values(idxsData.indexDefs.indexDefs) as SearchIndex[];
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
    const timeout = options.timeout || this._cluster.managementTimeout;

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
        const body = JSON.parse(res.body.toString());
        const reason = body.error;
        throw new SearchIndexManagementError(
          `failed to create index: ${reason}`,
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

    const timeout = options.timeout || this._cluster.managementTimeout;

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

    const timeout = options.timeout || this._cluster.managementTimeout;

    return PromiseHelper.wrapAsync(async () => {
      const res = await this._http.request({
        type: HttpServiceType.Search,
        method: HttpMethod.Get,
        path: `/api/index/${indexName}/count`,
        timeout: timeout,
      });

      if (res.statusCode !== 200) {
        throw new Error('failed to get search indexed documents count');
      }

      return JSON.parse(res.body.toString()).count;
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

    const timeout = options.timeout || this._cluster.managementTimeout;

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

    const timeout = options.timeout || this._cluster.managementTimeout;

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

    const timeout = options.timeout || this._cluster.managementTimeout;

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

    const timeout = options.timeout || this._cluster.managementTimeout;

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

    const timeout = options.timeout || this._cluster.managementTimeout;

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
    callback?: VoidNodeCallback
  ): Promise<void>;
  async analyzeDocument(
    indexName: string,
    document: any,
    callback?: VoidNodeCallback
  ): Promise<void>;
  async analyzeDocument(
    indexName: string,
    document: any,
    options?: AnalyzeSearchDocumentOptions | VoidNodeCallback,
    callback?: VoidNodeCallback
  ): Promise<void> {
    if (options instanceof Function) {
      callback = options;
      options = undefined;
    }
    if (!options) {
      options = {};
    }

    const timeout = options.timeout || this._cluster.managementTimeout;

    return PromiseHelper.wrapAsync(async () => {
      const res = await this._http.request({
        type: HttpServiceType.Search,
        method: HttpMethod.Post,
        path: `/api/index/${indexName}/analyzeDoc`,
        body: JSON.stringify(document),
        timeout: timeout,
      });

      if (res.statusCode !== 200) {
        throw new Error('failed to perform search index document analysis');
      }

      return JSON.parse(res.body.toString()).analyze;
    }, callback);
  }
}
