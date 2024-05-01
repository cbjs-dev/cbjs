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
import { BucketName, CouchbaseClusterTypes, ScopeName } from '@cbjsdev/shared';

import { CppSearchRequest } from './binding.js';
import {
  errorFromCpp,
  mutationStateToCpp,
  searchHighlightStyleToCpp,
  searchScanConsistencyToCpp,
} from './bindingutilities.js';
import { Cluster } from './cluster.js';
import { MatchNoneSearchQuery, SearchQuery } from './searchquery.js';
import { SearchSort } from './searchsort.js';
import {
  SearchMetaData,
  SearchQueryOptions,
  SearchRequest,
  SearchResult,
  SearchRow,
} from './searchtypes.js';
import { StreamableRowPromise } from './streamablepromises.js';

/**
 * @internal
 */
export class SearchExecutor<
  T extends CouchbaseClusterTypes = CouchbaseClusterTypes,
  B extends BucketName<T> = BucketName<T>,
  S extends ScopeName<T, B> = ScopeName<T, B>,
> {
  private cluster: Cluster<T>;
  private bucketName?: B;
  private scopeName?: S;

  /**
   * @internal
   */
  constructor(cluster: Cluster<T>);
  constructor(cluster: Cluster<T>, bucketName: B, scopeName: S);

  constructor(cluster: Cluster<T>, bucketName?: B, scopeName?: S) {
    this.cluster = cluster;
    this.bucketName = bucketName;
    this.scopeName = scopeName;
  }

  /**
   * @internal
   */
  query(
    indexName: string,
    query: SearchQuery | SearchRequest,
    options: SearchQueryOptions
  ): StreamableRowPromise<SearchResult, SearchRow, SearchMetaData> {
    const emitter = new StreamableRowPromise<SearchResult, SearchRow, SearchMetaData>(
      (rows, meta) => {
        return new SearchResult({
          rows: rows,
          meta: meta,
        });
      }
    );

    let searchQuery: SearchQuery = new MatchNoneSearchQuery();

    if (query instanceof SearchQuery) searchQuery = query;
    if (query instanceof SearchRequest)
      searchQuery = query.searchQuery ?? new MatchNoneSearchQuery();

    const timeout = options.timeout ?? this.cluster.searchTimeout;
    const searchArgs: CppSearchRequest = {
      timeout,
      index_name: indexName,
      query: JSON.stringify(searchQuery),
      limit: options.limit,
      skip: options.skip,
      explain: options.explain ?? false,
      disable_scoring: options.disableScoring ?? false,
      include_locations: options.includeLocations ?? false,
      highlight_style: searchHighlightStyleToCpp(options.highlight?.style),
      highlight_fields: options.highlight?.fields ?? [],
      fields: options.fields ?? [],
      collections: options.collections ?? [],
      scan_consistency: searchScanConsistencyToCpp(options.consistency),
      mutation_state: mutationStateToCpp(options.consistentWith).tokens,
      sort_specs:
        options.sort?.map((sort: string | SearchSort) => JSON.stringify(sort)) ?? [],
      facets: options.facets
        ? Object.fromEntries(
            Object.entries(options.facets)
              .filter(([, v]) => v !== undefined)
              .map(([k, v]) => [k, JSON.stringify(v)])
          )
        : {},
      raw: options.raw
        ? Object.fromEntries(
            Object.entries(options.raw)
              .filter(([, v]) => v !== undefined)
              .map(([k, v]) => [k, JSON.stringify(v)])
          )
        : {},
      body_str: '',
      show_request: options.showRequest ?? false,
      log_request: options.logRequest ?? false,
      log_response: options.logResponse ?? false,
    };

    if (this.bucketName && this.scopeName) {
      searchArgs.bucket_name = this.bucketName;
      searchArgs.scope_name = this.scopeName;
    }

    this.cluster.conn.search(searchArgs, (cppErr, response) => {
      if (cppErr) {
        const err = errorFromCpp(cppErr);
        emitter.emit('error', err);
        emitter.emit('end');
        return;
      }

      response.rows.forEach((row) => {
        const resultRow = new SearchRow({
          ...row,
          fields: row.fields ? JSON.parse(row.fields) : undefined,
          explanation: row.explanation ? JSON.parse(row.explanation) : undefined,
        });

        emitter.emit('row', resultRow);
      });

      const responseMetadata = new SearchMetaData({
        ...response.meta,
        facets: Object.fromEntries(
          Object.values(response.facets).map((v) => [v.name, v])
        ),
      });

      emitter.emit('meta', responseMetadata);

      emitter.emit('end');
    });

    return emitter;
  }
}
