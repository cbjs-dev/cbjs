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
import { CouchbaseTestContext } from '../../../extendedTests/createCouchbaseTest.js';
import { FixtureFunctionValue } from '../../FixtureFunctionValue.js';
import { FixtureContext } from '../../types.js';

export type AnalyticsIndexFixtureParams = {
  indexName?: string;
  dataverseName: string;
  datasetName: string;
  fields: Record<string, string>;
};

export class AnalyticsIndexFixture extends FixtureFunctionValue<
  [AnalyticsIndexFixtureParams],
  Promise<string>,
  CouchbaseTestContext
> {
  public readonly fixtureName = 'AnalyticsIndexFixture';
  private indexName?: string;
  private datasetName?: string;
  private dataverseName?: string;

  async use(
    { serverTestContext, logger }: FixtureContext<CouchbaseTestContext>,
    opts: AnalyticsIndexFixtureParams
  ): Promise<string> {
    this.indexName = opts.indexName ?? serverTestContext.newUid();
    this.datasetName = opts.datasetName;
    this.dataverseName = opts.dataverseName;

    logger?.debug(
      `AnalyticsIndexFixture: ${this.indexName} in ${this.dataverseName}.${this.datasetName}`
    );

    await serverTestContext.c
      .analyticsIndexes()
      .createIndex(this.datasetName, this.indexName, opts.fields, {
        dataverseName: this.dataverseName,
      });

    return this.indexName;
  }

  override async cleanup({ serverTestContext }: FixtureContext<CouchbaseTestContext>) {
    if (!this.datasetName || !this.indexName) return;
    await serverTestContext.cluster
      .analyticsIndexes()
      .dropIndex(this.datasetName, this.indexName, { dataverseName: this.dataverseName });
  }
}
