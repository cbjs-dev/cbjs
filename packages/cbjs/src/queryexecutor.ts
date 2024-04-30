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
import { CouchbaseClusterTypes, invariant } from '@cbjsdev/shared';

import { CppError, CppQueryResponse } from './binding.js';
import {
  errorFromCpp,
  mutationStateToCpp,
  queryProfileToCpp,
  queryScanConsistencyToCpp,
} from './bindingutilities.js';
import { Cluster } from './cluster.js';
import {
  QueryMetaData,
  QueryMetrics,
  QueryOptions,
  QueryResult,
  QueryStatus,
  QueryWarning,
} from './querytypes.js';
import { StreamableRowPromise } from './streamablepromises.js';

/**
 * @internal
 */
export class QueryExecutor<T extends CouchbaseClusterTypes = CouchbaseClusterTypes> {
  private _cluster: Cluster<T>;

  /**
   * @internal
   */
  constructor(cluster: Cluster<T>) {
    this._cluster = cluster;
  }

  /**
   * @internal
   */
  static execute<TRow = any>(
    exec: (
      callback: (err: CppError | null, resp: CppQueryResponse | undefined) => void
    ) => void
  ): StreamableRowPromise<QueryResult<TRow>, TRow, QueryMetaData> {
    const emitter = new StreamableRowPromise<QueryResult<TRow>, TRow, QueryMetaData>(
      (rows, meta) => {
        return new QueryResult({
          rows: rows,
          meta: meta,
        });
      }
    );

    exec((cppErr, resp) => {
      const err = errorFromCpp(cppErr);
      if (err) {
        emitter.emit('error', err);
        emitter.emit('end');
        return;
      }

      invariant(resp);

      resp.rows.forEach((row) => {
        emitter.emit('row', JSON.parse(row));
      });

      {
        const metaData = resp.meta;

        let warnings: QueryWarning[];
        if (metaData.warnings) {
          warnings = metaData.warnings.map(
            (warningData) =>
              new QueryWarning({
                code: warningData.code,
                message: warningData.message,
              })
          );
        } else {
          warnings = [];
        }

        let metrics: QueryMetrics | undefined;
        if (metaData.metrics) {
          const metricsData = metaData.metrics;

          metrics = new QueryMetrics({
            elapsedTime: metricsData.elapsed_time,
            executionTime: metricsData.execution_time,
            sortCount: metricsData.sort_count || 0,
            resultCount: metricsData.result_count || 0,
            resultSize: metricsData.result_size || 0,
            mutationCount: metricsData.mutation_count || 0,
            errorCount: metricsData.error_count || 0,
            warningCount: metricsData.warning_count || 0,
          });
        } else {
          metrics = undefined;
        }

        const meta = new QueryMetaData({
          requestId: metaData.request_id,
          clientContextId: metaData.client_context_id,
          status: metaData.status as QueryStatus,
          signature: metaData.signature ? JSON.parse(metaData.signature) : undefined,
          warnings: warnings,
          metrics: metrics,
          profile: metaData.profile ? JSON.parse(metaData.profile) : undefined,
        });

        emitter.emit('meta', meta);
      }

      emitter.emit('end');
      return;
    });

    return emitter;
  }

  /**
   * @internal
   */
  query<TRow = any>(
    query: string,
    options: QueryOptions
  ): StreamableRowPromise<QueryResult<TRow>, TRow, QueryMetaData> {
    const timeout = options.timeout ?? this._cluster.queryTimeout;

    return QueryExecutor.execute((callback) => {
      this._cluster.conn.query(
        {
          statement: query,
          client_context_id: options.clientContextId,
          adhoc: options.adhoc !== false,
          metrics: options.metrics ?? false,
          readonly: options.readOnly ?? false,
          flex_index: options.flexIndex ?? false,
          preserve_expiry: options.preserveExpiry ?? false,
          use_replica: options.useReplica,
          max_parallelism: options.maxParallelism,
          scan_cap: options.scanCap,
          scan_wait: options.scanWait,
          pipeline_batch: options.pipelineBatch,
          pipeline_cap: options.pipelineCap,
          scan_consistency: queryScanConsistencyToCpp(options.scanConsistency),
          mutation_state: mutationStateToCpp(options.consistentWith).tokens,
          timeout: timeout,
          query_context: options.queryContext,
          profile: queryProfileToCpp(options.profile),
          raw: options.raw
            ? Object.fromEntries(
                Object.entries(options.raw)
                  .filter(([, v]) => v !== undefined)
                  .map(([k, v]) => [k, JSON.stringify(v)])
              )
            : {},
          positional_parameters:
            options.parameters && Array.isArray(options.parameters)
              ? options.parameters.map((v) => JSON.stringify(v ?? null))
              : [],
          named_parameters:
            options.parameters && !Array.isArray(options.parameters)
              ? Object.fromEntries(
                  Object.entries(options.parameters as { [key: string]: any })
                    .filter(([, v]) => v !== undefined)
                    .map(([k, v]) => [k, JSON.stringify(v)])
                )
              : {},
          body_str: '',
        },
        callback
      );
    });
  }
}
