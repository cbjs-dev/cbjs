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
import { ICreateBucketSettings } from '@cbjs/cbjs';
import { waitForBucket } from '@cbjs/http-client';
import { OptionalProps, ReplicaNumber } from '@cbjs/shared';

import { CouchbaseTestContext } from '../../../extendedTests/createCouchbaseTest';
import { FixtureFunctionValue } from '../../FixtureFunctionValue';
import { FixtureContext } from '../../types';

export type BucketFixtureParams = OptionalProps<
  ICreateBucketSettings,
  'name' | 'ramQuotaMB'
> & { bucketName?: string };

export class BucketFixture extends FixtureFunctionValue<
  [BucketFixtureParams?],
  Promise<string>,
  CouchbaseTestContext
> {
  public readonly fixtureName = 'BucketFixture';
  private bucketName?: string;

  override async use(
    { serverTestContext, apiConfig, logger }: FixtureContext<CouchbaseTestContext>,
    params: BucketFixtureParams = {}
  ) {
    await serverTestContext.start();
    this.bucketName = params.bucketName ?? params.name ?? serverTestContext.newUid();

    const baseBucketConfig = {
      name: this.bucketName,
      storageBackend: params.storageBackend ?? 'couchstore',
      ramQuotaMB: params.ramQuotaMB ?? (params.storageBackend === 'magma' ? 1024 : 256),
      numReplicas: 0 as ReplicaNumber,
    } satisfies ICreateBucketSettings;

    const bucketConfig = {
      ...baseBucketConfig,
      ...params,
    };

    logger?.debug(`Creating bucket '${bucketConfig.name}`, bucketConfig);

    await serverTestContext.c.buckets().createBucket(bucketConfig);
    await waitForBucket(apiConfig, this.bucketName);
    return this.bucketName;
  }

  override async cleanup({
    serverTestContext,
    apiConfig,
  }: FixtureContext<CouchbaseTestContext>) {
    if (!this.bucketName) return;
    await serverTestContext.c.buckets().dropBucket(this.bucketName);
    await waitForBucket(apiConfig, this.bucketName, { expectMissing: true });
  }
}
