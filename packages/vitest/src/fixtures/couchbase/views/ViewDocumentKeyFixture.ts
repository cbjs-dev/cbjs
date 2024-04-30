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
import { keyspacePath } from '@cbjsdev/shared';

import { CouchbaseTestContext } from '../../../extendedTests/createCouchbaseTest.js';
import { FixtureFunctionValue } from '../../FixtureFunctionValue.js';
import { FixtureContext } from '../../types.js';

export type ViewDocumentKeyFixtureParams = {
  bucketName?: string;
  docKey?: string;
};

export class ViewDocumentKeyFixture extends FixtureFunctionValue<
  [ViewDocumentKeyFixtureParams],
  Promise<string>,
  CouchbaseTestContext
> {
  public readonly fixtureName = 'ViewDocumentKeyFixture';
  private bucketName?: string;
  private docKey?: string;

  override async use(
    { serverTestContext, logger }: FixtureContext<CouchbaseTestContext>,
    opts: ViewDocumentKeyFixtureParams = {}
  ) {
    await serverTestContext.start();
    this.docKey = opts.docKey ?? serverTestContext.newUid();
    this.bucketName = opts.bucketName ?? serverTestContext.b.name;

    logger?.debug(
      `ViewDocumentKey '${this.docKey}' provided within ${keyspacePath(this.bucketName)}`
    );

    return this.docKey;
  }

  override async cleanup({ serverTestContext }: FixtureContext<CouchbaseTestContext>) {
    if (!this.docKey || !this.bucketName) return;
    await serverTestContext.c
      .bucket(this.bucketName)
      .viewIndexes()
      .dropDesignDocument(this.docKey);
  }
}
