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
import { invariant } from '@cbjsdev/shared';

import { TransformArgsMap } from '../types';

export const transformArgs = {
  openBucket: (isolationMap, bucketName, cb) => {
    const bucketIsolatedName = isolationMap.isolateBucketName(bucketName);
    return [bucketIsolatedName, cb];
  },
  ping: (isolationMap, options, cb) => {
    const nextOptions = { ...options };

    if (nextOptions.bucket_name) {
      nextOptions.bucket_name = isolationMap.isolateBucketName(nextOptions.bucket_name);
    }

    return [nextOptions, cb];
  },
  scan: (isolationMap, bucket, scope, collection, ...rest) => {
    isolationMap.isolateCollectionName(bucket, scope, collection);

    const isolatedKeyspace = isolationMap.getIsolatedKeyspaceNames({
      bucket,
      scope,
      collection,
    });

    invariant(isolatedKeyspace, 'keyspace is not isolated');

    return [
      isolatedKeyspace.bucket,
      isolatedKeyspace.scope,
      isolatedKeyspace.collection,
      ...rest,
    ];
  },
} as const satisfies Partial<TransformArgsMap>;
