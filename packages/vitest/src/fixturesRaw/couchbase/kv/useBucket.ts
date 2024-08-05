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
import { Use } from '@vitest/runner';
import { TaskContext, Test } from 'vitest';

import { ICreateBucketSettings } from '@cbjsdev/cbjs';
import { waitForBucket } from '@cbjsdev/http-client';
import { ReplicaNumber } from '@cbjsdev/shared';

import { BucketFixtureParams } from '../../../fixtures/couchbase/kv/index.js';
import { CbjsTestContext } from '../../types.js';

export const useBucket = async (
  {
    task,
    logger,
    serverTestContext,
    apiConfig,
  }: TaskContext<Test> &
    Pick<CbjsTestContext, 'logger' | 'serverTestContext' | 'apiConfig'>,
  use: Use<(opts?: BucketFixtureParams) => Promise<string>>
) => {
  let bucketName = `cbjs_${serverTestContext.newUid()}`;
  await use(async (opts = {}) => {
    const givenName = opts.bucketName ?? opts.name;
    if (givenName) {
      bucketName = givenName;
    }

    const baseBucketConfig = {
      name: bucketName,
      storageBackend: opts.storageBackend ?? 'couchstore',
      ramQuotaMB: opts.ramQuotaMB ?? (opts.storageBackend === 'magma' ? 1024 : 100),
      numReplicas: 0 as ReplicaNumber,
    } satisfies ICreateBucketSettings;

    const bucketConfig = {
      ...baseBucketConfig,
      ...opts,
    };

    logger?.debug(`Creating bucket '${bucketConfig.name}`, bucketConfig);

    await serverTestContext.c.buckets().createBucket(bucketConfig);
    await waitForBucket(apiConfig, bucketName);
    return bucketName;
  });

  await serverTestContext.c.buckets().dropBucket(bucketName);
  await waitForBucket(apiConfig, bucketName, { expectMissing: true });
};
