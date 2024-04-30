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
import { BucketName, CouchbaseClusterTypes } from '@cbjsdev/shared';

import {
  designDocumentNamespaceToCpp,
  errorFromCpp,
  viewOrderingToCpp,
  viewScanConsistencyToCpp,
} from './bindingutilities.js';
import { Bucket } from './bucket.js';
import { Cluster } from './cluster.js';
import { StreamableRowPromise } from './streamablepromises.js';
import {
  DesignDocumentNamespace,
  ViewMetaData,
  ViewQueryOptions,
  ViewResult,
  ViewRow,
} from './viewtypes.js';

/**
 * @internal
 */
export class ViewExecutor<T extends CouchbaseClusterTypes, B extends BucketName<T>> {
  private _bucket: Bucket<T, B>;

  /**
   * @internal
   */
  constructor(bucket: Bucket<T, B>) {
    this._bucket = bucket;
  }

  /**
  @internal
  */
  get _cluster(): Cluster<T> {
    return this._bucket.cluster;
  }

  /**
   * @internal
   */
  query<TValue = any, TKey = any>(
    designDoc: string,
    viewName: string,
    options: ViewQueryOptions
  ): StreamableRowPromise<ViewResult<TValue, TKey>, ViewRow<TValue, TKey>, ViewMetaData> {
    const emitter = new StreamableRowPromise<
      ViewResult<TValue, TKey>,
      ViewRow<TValue, TKey>,
      ViewMetaData
    >((rows, meta) => {
      return new ViewResult<TValue, TKey>({
        rows: rows,
        meta: meta,
      });
    });

    const timeout = options.timeout ?? this._cluster.viewTimeout;
    const raw = options.raw ?? {};
    const ns = options.namespace ?? DesignDocumentNamespace.Production;
    let fullSet = options.full_set;
    if (typeof options.fullSet !== 'undefined') {
      fullSet = options.fullSet;
    }

    this._cluster.conn.documentView(
      {
        timeout: timeout,
        bucket_name: this._bucket.name,
        document_name: designDoc,
        view_name: viewName,
        ns: designDocumentNamespaceToCpp(ns),
        limit: options.limit,
        skip: options.skip,
        consistency: viewScanConsistencyToCpp(options.scanConsistency),
        keys: options.keys ? options.keys.map((k) => JSON.stringify(k)) : [],
        key: JSON.stringify(options.key),
        start_key: options.range?.start ? JSON.stringify(options.range.start) : undefined,
        end_key: options.range?.end ? JSON.stringify(options.range.end) : undefined,
        inclusive_end: options.range?.inclusiveEnd,
        start_key_doc_id: options.idRange?.start,
        end_key_doc_id: options.idRange?.end,
        reduce: options.reduce,
        group: options.group,
        group_level: options.groupLevel,
        order: viewOrderingToCpp(options.order),
        debug: false,
        query_string: [],
        raw: raw,
        full_set: fullSet,
      },
      (cppErr, resp) => {
        const err = errorFromCpp(cppErr);
        if (err) {
          emitter.emit('error', err);
          emitter.emit('end');
          return;
        }

        resp.rows.forEach((row) => {
          emitter.emit(
            'row',
            new ViewRow<TValue, TKey>({
              value: JSON.parse(row.value) as TValue,
              id: row.id,
              key: JSON.parse(row.key),
            })
          );
        });

        {
          const metaData = resp.meta;

          const meta = new ViewMetaData({
            totalRows: metaData.total_rows,
            debug: metaData.debug_info,
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
