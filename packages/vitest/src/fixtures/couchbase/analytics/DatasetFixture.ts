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
import { CouchbaseTestContext } from '../../../extendedTests/createCouchbaseTest';
import { FixtureFunctionValue } from '../../FixtureFunctionValue';
import { FixtureContext } from '../../types';

export type DatasetFixtureParams = {
  datasetName?: string;
  dataverseName?: string;
  bucketName?: string;
};

export class DatasetFixture extends FixtureFunctionValue<
  [DatasetFixtureParams],
  Promise<string>,
  CouchbaseTestContext
> {
  public readonly fixtureName = 'DatasetFixture';

  private datasetName?: string;
  private dataverseName?: string;
  private bucketName?: string;

  async use(
    { serverTestContext, logger }: FixtureContext<CouchbaseTestContext>,
    opts: DatasetFixtureParams
  ): Promise<string> {
    this.datasetName = opts.datasetName ?? serverTestContext.newUid();
    this.dataverseName = opts.dataverseName;
    this.bucketName = opts.bucketName
      ? serverTestContext.cluster.bucket(opts.bucketName).name
      : serverTestContext.bucket.name;

    logger?.debug(
      `DatasetFixture: ${this.datasetName} in ${this.dataverseName} (bucket ${this.bucketName})`
    );

    await serverTestContext.cluster
      .analyticsIndexes()
      .createDataset(this.bucketName, this.datasetName, {
        dataverseName: this.dataverseName,
      });

    return this.datasetName;
  }

  override async cleanup({
    serverTestContext,
    logger,
  }: FixtureContext<CouchbaseTestContext>) {
    if (!this.datasetName || !this.dataverseName) return;
    await serverTestContext.cluster
      .analyticsIndexes()
      .dropDataset(this.datasetName, { dataverseName: this.dataverseName });
  }
}
