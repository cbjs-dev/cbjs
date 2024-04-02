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
import { CouchbaseClusterTypes } from '@cbjsdev/shared';

import {
  AnalyticsMetaData,
  AnalyticsMetrics,
  AnalyticsQueryOptions,
  AnalyticsResult,
  AnalyticsWarning,
} from './analyticstypes';
import {
  analyticsScanConsistencyToCpp,
  analyticsStatusFromCpp,
  errorFromCpp,
} from './bindingutilities';
import { Cluster } from './cluster';
import { StreamableRowPromise } from './streamablepromises';

/**
 * @internal
 */
export class AnalyticsExecutor<T extends CouchbaseClusterTypes = CouchbaseClusterTypes> {
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
  query<TRow = any>(
    query: string,
    options: AnalyticsQueryOptions
  ): StreamableRowPromise<AnalyticsResult<TRow>, TRow, AnalyticsMetaData> {
    const emitter = new StreamableRowPromise<
      AnalyticsResult<TRow>,
      TRow,
      AnalyticsMetaData
    >((rows, meta) => {
      return new AnalyticsResult({
        rows: rows,
        meta: meta,
      });
    });

    const timeout = options.timeout ?? this._cluster.analyticsTimeout;

    this._cluster.conn.analytics(
      {
        statement: query,
        timeout,
        client_context_id: options.clientContextId,
        readonly: options.readOnly ?? false,
        priority: options.priority ?? false,
        scope_qualifier: options.queryContext,
        scan_consistency: analyticsScanConsistencyToCpp(options.scanConsistency),
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
      (cppErr, resp) => {
        const err = errorFromCpp(cppErr);
        if (err) {
          emitter.emit('error', err);
          emitter.emit('end');
          return;
        }

        resp.rows.forEach((row) => {
          emitter.emit('row', JSON.parse(row));
        });

        {
          const metaData = resp.meta;

          let warnings: AnalyticsWarning[];
          if (metaData.warnings) {
            warnings = metaData.warnings.map(
              (warningData) =>
                new AnalyticsWarning({
                  code: warningData.code,
                  message: warningData.message,
                })
            );
          } else {
            warnings = [];
          }

          const metricsData = metaData.metrics;
          const metrics = new AnalyticsMetrics({
            elapsedTime: metricsData.elapsed_time,
            executionTime: metricsData.execution_time,
            resultCount: metricsData.result_count,
            resultSize: metricsData.result_size,
            errorCount: metricsData.error_count,
            processedObjects: metricsData.processed_objects,
            warningCount: metricsData.warning_count,
          });

          const meta = new AnalyticsMetaData({
            requestId: metaData.request_id,
            clientContextId: metaData.client_context_id,
            status: analyticsStatusFromCpp(metaData.status),
            signature: metaData.signature ? JSON.parse(metaData.signature) : undefined,
            warnings: warnings,
            metrics: metrics,
          });

          emitter.emit('meta', meta);
        }

        emitter.emit('end');
        return;
      }
    );

    return emitter;
  }
}
