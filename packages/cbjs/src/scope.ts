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
import {
  BucketName,
  CollectionName,
  CouchbaseClusterTypes,
  DefaultClusterTypes,
  ScopeName,
} from '@cbjsdev/shared';

import { AnalyticsExecutor } from './analyticsexecutor';
import {
  AnalyticsMetaData,
  AnalyticsQueryOptions,
  AnalyticsResult,
} from './analyticstypes';
import { CppConnection } from './binding';
import { Bucket } from './bucket';
import { Cluster } from './cluster';
import { Collection } from './collection';
import { QueryExecutor } from './queryexecutor';
import { QueryMetaData, QueryOptions, QueryResult } from './querytypes';
import { ScopeEventingFunctionManager } from './scopeeventingfunctionmanager';
import { ScopeSearchIndexManager } from './scopesearchindexmanager';
import { SearchExecutor } from './searchexecutor';
import {
  SearchMetaData,
  SearchQueryOptions,
  SearchRequest,
  SearchResult,
  SearchRow,
} from './searchtypes';
import { StreamableRowPromise } from './streamablepromises';
import { Transcoder } from './transcoders';
import { NodeCallback, PromiseHelper } from './utilities';
import { resolveOptionsAndCallback } from './utils/resolveOptionsAndCallback';

/**
 * Exposes the operations which are available to be performed against a scope.
 * Namely the ability to access to Collections for performing operations.
 *
 * @category Core
 */
export class Scope<
  in out T extends CouchbaseClusterTypes = DefaultClusterTypes,
  in out B extends BucketName<T> = BucketName<T>,
  in out S extends ScopeName<T, B> = ScopeName<T, B>,
> {
  /**
   * @internal
   */
  static readonly DEFAULT_NAME = '_default';

  readonly bucket: Bucket<T, B>;
  readonly name: S;
  readonly conn: CppConnection;

  /**
  @internal
  */
  constructor(bucket: Bucket<T, B>, scopeName: S) {
    this.bucket = bucket;
    this.name = scopeName;
    this.conn = bucket.conn;
  }

  get cluster(): Cluster<T> {
    return this.bucket.cluster;
  }

  /**
  @internal
  */
  get transcoder(): Transcoder {
    return this.bucket.transcoder;
  }

  /**
   * Creates a Collection object reference to a specific collection.
   *
   * @param collectionName The name of the collection to reference.
   */
  collection<C extends CollectionName<T, B, S>>(
    collectionName: C
  ): Collection<T, B, S, C> {
    return new Collection(this, collectionName);
  }

  /**
   * Returns a SearchIndexManager which can be used to manage the search
   * indexes of this scope.
   *
   */
  searchIndexes(): ScopeSearchIndexManager<T, B, S> {
    return new ScopeSearchIndexManager(this.cluster, this.bucket.name, this.name);
  }

  /**
   * Returns a ScopeEventingFunctionManager which can be used to manage the eventing
   * functions of this scope.
   * Uncommitted: This API is subject to change in the future.
   */
  eventingFunctions(): ScopeEventingFunctionManager<T, B, S> {
    return new ScopeEventingFunctionManager(this.cluster, this.bucket.name, this.name);
  }

  /**
   * Executes a N1QL query against the cluster scoped to this scope.
   *
   * @param statement The N1QL statement to execute.
   * @param options Optional parameters for this operation.
   * @param callback A node-style callback to be invoked after execution.
   */
  query<TRow = any>(
    statement: string,
    options: QueryOptions,
    callback?: NodeCallback<QueryResult<TRow>>
  ): StreamableRowPromise<QueryResult<TRow>, TRow, QueryMetaData>;
  query<TRow = any>(
    statement: string,
    callback?: NodeCallback<QueryResult<TRow>>
  ): StreamableRowPromise<QueryResult<TRow>, TRow, QueryMetaData>;
  query<TRow = any>(
    statement: string,
    options?: QueryOptions | NodeCallback<QueryResult<TRow>>,
    callback?: NodeCallback<QueryResult<TRow>>
  ): StreamableRowPromise<QueryResult<TRow>, TRow, QueryMetaData> {
    if (options instanceof Function) {
      callback = options;
      options = undefined;
    }
    if (!options) {
      options = {};
    }

    const bucket = this.bucket;
    const exec = new QueryExecutor(this.cluster);

    const options_ = options;
    return PromiseHelper.wrapAsync(
      () =>
        exec.query<TRow>(statement, {
          ...options_,
          queryContext: `${bucket.name}.${this.name}`,
        }),
      callback
    );
  }

  /**
   * Executes an analytics query against the cluster scoped this scope.
   *
   * @param statement The analytics statement to execute.
   * @param options Optional parameters for this operation.
   * @param callback A node-style callback to be invoked after execution.
   */
  analyticsQuery<TRow = any>(
    statement: string,
    options: AnalyticsQueryOptions,
    callback?: NodeCallback<AnalyticsResult<TRow>>
  ): StreamableRowPromise<AnalyticsResult<TRow>, TRow, AnalyticsMetaData>;
  analyticsQuery<TRow = any>(
    statement: string,
    callback?: NodeCallback<AnalyticsResult<TRow>>
  ): StreamableRowPromise<AnalyticsResult<TRow>, TRow, AnalyticsMetaData>;
  analyticsQuery<TRow = any>(
    statement: string,
    options?: AnalyticsQueryOptions | NodeCallback<AnalyticsResult<TRow>>,
    callback?: NodeCallback<AnalyticsResult<TRow>>
  ): StreamableRowPromise<AnalyticsResult<TRow>, TRow, AnalyticsMetaData> {
    if (options instanceof Function) {
      callback = options;
      options = undefined;
    }
    if (!options) {
      options = {};
    }

    const bucket = this.bucket;
    const exec = new AnalyticsExecutor(this.cluster);

    const options_ = options;
    return PromiseHelper.wrapAsync(
      () =>
        exec.query<TRow>(statement, {
          ...options_,
          queryContext: `${bucket.name}.${this.name}`,
        }),
      callback
    );
  }

  /**
   * Executes a search query against the scope.
   *
   * @param indexName The name of the index to query.
   * @param request The SearchRequest describing the search to execute.
   * @param options Optional parameters for this operation.
   * @param callback A node-style callback to be invoked after execution.
   */
  search(
    indexName: string,
    request: SearchRequest,
    options: SearchQueryOptions,
    callback?: NodeCallback<SearchResult>
  ): StreamableRowPromise<SearchResult, SearchRow, SearchMetaData>;

  /**
   * Executes a search query against the scope.
   *
   * @param indexName The name of the index to query.
   * @param request The SearchRequest describing the search to execute.
   * @param callback A node-style callback to be invoked after execution.
   */
  search(
    indexName: string,
    request: SearchRequest,
    callback?: NodeCallback<SearchResult>
  ): StreamableRowPromise<SearchResult, SearchRow, SearchMetaData>;

  search(
    indexName: string,
    request: SearchRequest,
    ...args:
      | [options: SearchQueryOptions, callback?: NodeCallback<SearchResult>]
      | [callback?: NodeCallback<SearchResult>]
  ): StreamableRowPromise<SearchResult, SearchRow, SearchMetaData> {
    const [opts = {}, cb] = resolveOptionsAndCallback(args);

    const exec = new SearchExecutor(this.cluster, this.bucket.name, this.name);

    return PromiseHelper.wrapAsync(() => exec.query(indexName, request, opts), cb);
  }
}
