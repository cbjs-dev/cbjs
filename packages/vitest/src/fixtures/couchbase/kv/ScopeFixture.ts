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
import { waitForScope } from '@cbjsdev/http-client';

import { CouchbaseTestContext } from '../../../extendedTests/createCouchbaseTest';
import { FixtureFunctionValue } from '../../FixtureFunctionValue';
import { FixtureContext } from '../../types';

type ScopeFixtureParams = {
  scopeName?: string;
  bucketName?: string;
};

export class ScopeFixture extends FixtureFunctionValue<
  [ScopeFixtureParams?],
  Promise<string>,
  CouchbaseTestContext
> {
  public readonly fixtureName = 'ScopeFixture';
  private scopeName?: string;
  private bucketName?: string;

  async use(
    { serverTestContext, logger, apiConfig }: FixtureContext<CouchbaseTestContext>,
    params: ScopeFixtureParams = {}
  ) {
    await serverTestContext.start();
    this.scopeName = params.scopeName ?? serverTestContext.newUid();

    const bucket = params.bucketName
      ? serverTestContext.c.bucket(params.bucketName)
      : serverTestContext.b;
    this.bucketName = bucket.name;

    logger?.debug(`Creating scope ${this.scopeName} within '${this.bucketName}'`);

    await bucket.collections().createScope(this.scopeName);
    await waitForScope(apiConfig, this.bucketName, this.scopeName);

    return this.scopeName;
  }

  override async cleanup({
    serverTestContext,
    apiConfig,
  }: FixtureContext<CouchbaseTestContext>) {
    if (!this.scopeName || !this.bucketName) return;
    await serverTestContext.c
      .bucket(this.bucketName)
      .collections()
      .dropScope(this.scopeName);

    await waitForScope(apiConfig, this.bucketName, this.scopeName, {
      expectMissing: true,
    });
  }
}
