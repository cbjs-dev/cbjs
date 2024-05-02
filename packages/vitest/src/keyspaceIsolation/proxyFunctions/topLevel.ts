/*
 * Copyright (c) 2023-Present Jonathan MASSUCHETTI <jonathan.massuchetti@dappit.fr>.
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
import { getCurrentTaskAsyncContext } from '../../asyncContext/getCurrentTaskAsyncContext.js';
import { getTaskLogger } from '../../asyncContext/getTaskLogger.js';
import { TransformArgsMap } from '../types.js';

export const transformArgs = {
  openBucket: async (isolationPool, bucketName, cb) => {
    getTaskLogger()?.trace('TransformArgs - openBucket - require isolated keyspace.');
    const isolatedKeyspace = await isolationPool.requireKeyspaceIsolation(
      getCurrentTaskAsyncContext().taskId,
      { bucket: bucketName }
    );

    getTaskLogger()?.trace(
      'TransformArgs - openBucket - isolated keyspace received: %o',
      isolatedKeyspace
    );
    return [isolatedKeyspace.bucket, cb];
  },
  ping: async (isolationPool, options, cb) => {
    const nextOptions = { ...options };

    if (nextOptions.bucket_name) {
      const isolatedKeyspace = await isolationPool.requireKeyspaceIsolation(
        getCurrentTaskAsyncContext().taskId,
        { bucket: nextOptions.bucket_name }
      );

      nextOptions.bucket_name = isolatedKeyspace.bucket;
    }

    return [nextOptions, cb];
  },
  scan: async (isolationPool, bucket, scope, collection, ...rest) => {
    const isolatedKeyspace = await isolationPool.requireKeyspaceIsolation(
      getCurrentTaskAsyncContext().taskId,
      { bucket, scope, collection }
    );

    return [
      isolatedKeyspace.bucket,
      isolatedKeyspace.scope,
      isolatedKeyspace.collection,
      ...rest,
    ];
  },
} as const satisfies Partial<TransformArgsMap>;
