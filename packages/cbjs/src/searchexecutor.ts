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

import { CppError } from './binding';
import {
  errorFromCpp,
  mutationStateToCpp,
  searchHighlightStyleToCpp,
  searchScanConsistencyToCpp,
} from './bindingutilities';
import { Cluster } from './cluster';
import { SearchQuery } from './searchquery';
import { SearchSort } from './searchsort';
import {
  SearchMetaData,
  SearchQueryOptions,
  SearchResult,
  SearchRow,
} from './searchtypes';
import { StreamableRowPromise } from './streamablepromises';

/**
 * @internal
 */
export class SearchExecutor {
  private _cluster: Cluster;

  /**
   * @internal
   */
  constructor(cluster: Cluster) {
    this._cluster = cluster;
  }

  /**
   * @internal
   */
  query(
    indexName: string,
    query: SearchQuery,
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

    const timeout = options.timeout || this._cluster.searchTimeout;
    const searchArgs = {
      timeout,
      index_name: indexName,
      query: JSON.stringify(query),
      limit: options.limit,
      skip: options.skip,
      explain: options.explain || false,
      disable_scoring: options.disableScoring || false,
      include_locations: options.includeLocations || false,
      highlight_style: options.highlight
        ? searchHighlightStyleToCpp(options.highlight.style)
        : undefined,
      highlight_fields:
        options.highlight && options.highlight.fields ? options.highlight.fields : [],
      fields: options.fields || [],
      collections: options.collections || [],
      scan_consistency: searchScanConsistencyToCpp(options.consistency),
      mutation_state: mutationStateToCpp(options.consistentWith).tokens,
      sort_specs: options.sort
        ? options.sort.map((sort: string | SearchSort) => JSON.stringify(sort))
        : [],
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
    };

    this._cluster.conn.search(searchArgs, (cppErr, response) => {
      if (cppErr) {
        const err = errorFromCpp(cppErr as CppError);
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