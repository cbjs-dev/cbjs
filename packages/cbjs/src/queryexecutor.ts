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
import { CouchbaseClusterTypes, If, invariant } from '@cbjsdev/shared';

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
  static execute<TRow = any, WithMetrics extends boolean = false>(
    exec: (
      callback: (err: CppError | null, resp: CppQueryResponse | undefined) => void
    ) => void,
    parser?: (value: string) => any
  ): StreamableRowPromise<
    QueryResult<TRow, WithMetrics>,
    TRow,
    QueryMetaData<WithMetrics>
  > {
    const emitter = new StreamableRowPromise<
      QueryResult<TRow, WithMetrics>,
      TRow,
      QueryMetaData<WithMetrics>
    >((rows, meta) => {
      return new QueryResult<TRow, WithMetrics>({
        rows: rows,
        meta: meta,
      });
    });

    exec((cppErr, resp) => {
      const err = errorFromCpp(cppErr);
      if (err) {
        emitter.emit('error', err);
        emitter.emit('end');
        return;
      }

      invariant(resp);

      const rowParser = parser ?? JSON.parse;

      for (const row of resp.rows) {
        try {
          const parsedRow = rowParser(row) as TRow;
          emitter.emit('row', parsedRow);
        } catch (err) {
          if (err instanceof Error) {
            emitter.emit('error', err);
          } else {
            emitter.emit('error', new Error('Row parser error', { cause: err }));
          }

          emitter.emit('end');
        }
      }

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

        const meta = new QueryMetaData<WithMetrics>({
          requestId: metaData.request_id,
          clientContextId: metaData.client_context_id,
          status: metaData.status as QueryStatus,
          signature: metaData.signature ? JSON.parse(metaData.signature) : undefined,
          warnings,
          metrics: metrics as If<WithMetrics, QueryMetrics, undefined>,
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
  query<TRow = any, WithMetrics extends boolean = false>(
    query: string,
    options: QueryOptions<T, WithMetrics>
  ): StreamableRowPromise<QueryResult<TRow>, TRow, QueryMetaData> {
    const timeout = options.timeout ?? this._cluster.queryTimeout;
    const rowParser = options.queryResultParser ?? this._cluster.queryResultParser;

    let hookReturnValue: unknown;

    try {
      hookReturnValue = this._cluster.hooks?.onQueryStart?.({
        statement: query,
        options,
      });
    } catch (err) {
      this._cluster.hooks?.onHookError?.(err);
    }

    const result = QueryExecutor.execute((callback) => {
      this._cluster.conn.query(
        {
          statement: query,
          client_context_id: options.clientContextId,
          adhoc: options.adhoc ?? false,
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
    }, rowParser);

    if (this._cluster.hooks?.onQueryEnd) {
      void result
        .then((r) => {
          try {
            this._cluster.hooks?.onQueryEnd?.(
              {
                statement: query,
                options,
                result: r,
              },
              hookReturnValue
            );
          } catch (err) {
            this._cluster.hooks?.onHookError?.(err);
          }
        })
        .catch((err) => {
          try {
            this._cluster.hooks?.onQueryEnd?.(
              {
                statement: query,
                options,
                error: err,
              },
              hookReturnValue
            );
          } catch (err) {
            this._cluster.hooks?.onHookError?.(err);
          }
        });
    }

    return result;
  }
}
