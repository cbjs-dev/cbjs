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
import { retry } from 'ts-retry-promise';

import { CreateCollectionSettings, Scope } from '@cbjsdev/cbjs';
import { waitForCollection } from '@cbjsdev/http-client';
import { keyspacePath } from '@cbjsdev/shared';

import { CouchbaseTestContext } from '../../../extendedTests/createCouchbaseTest';
import { FixtureFunctionValue } from '../../FixtureFunctionValue';
import { FixtureContext } from '../../types';

export type CollectionFixtureParams = {
  collectionName?: string;
  scopeName?: string;
  bucketName?: string;
};

export class CollectionFixture extends FixtureFunctionValue<
  [CollectionFixtureParams?, CreateCollectionSettings?],
  Promise<string>,
  CouchbaseTestContext
> {
  public readonly fixtureName = 'CollectionFixture';
  private collectionName?: string;
  private scopeName?: string;
  private bucketName?: string;

  async use(
    { serverTestContext, apiConfig, logger }: FixtureContext<CouchbaseTestContext>,
    params: CollectionFixtureParams = {},
    settings: CreateCollectionSettings = {}
  ) {
    await serverTestContext.start();
    this.collectionName = params.collectionName ?? serverTestContext.newUid();

    const bucket = params.bucketName
      ? serverTestContext.c.bucket(params.bucketName)
      : serverTestContext.b;
    this.bucketName = params.bucketName ?? serverTestContext.b.name;
    this.scopeName = params.scopeName ?? Scope.DEFAULT_NAME;

    logger?.debug(
      `Creating collection '${keyspacePath(
        this.bucketName,
        this.scopeName,
        this.collectionName
      )}`
    );

    await bucket
      .collections()
      .createCollection(this.collectionName, this.scopeName, settings, {
        timeout: 5_000,
      });
    await waitForCollection(
      apiConfig,
      this.bucketName,
      this.scopeName,
      this.collectionName
    );

    await retry(async () => {
      const allScopes = await bucket.collections().getAllScopes();
      const scope = allScopes.find((s) => s.name === this.scopeName);
      const collectionExists = scope?.collections.some(
        (c) => c.name === this.collectionName
      );

      if (!collectionExists) throw new Error('Collection not ready yet');
    });

    return this.collectionName;
  }

  override async cleanup({
    serverTestContext,
    apiConfig,
  }: FixtureContext<CouchbaseTestContext>) {
    if (!this.scopeName || !this.bucketName || !this.collectionName) return;

    await serverTestContext.c
      .bucket(this.bucketName)
      .collections()
      .dropCollection(this.collectionName, this.scopeName);

    await waitForCollection(
      apiConfig,
      this.bucketName,
      this.scopeName,
      this.collectionName,
      { expectMissing: true }
    );
  }
}
