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
import type { CouchbaseTestContext } from '../../../extendedTests/createCouchbaseTest';
import { FixtureFunctionValue } from '../../FixtureFunctionValue';
import { FixtureContext } from '../../types';

export type DataverseFixtureParams = {
  dataverseName?: string;
};

export class DataverseFixture extends FixtureFunctionValue<
  [DataverseFixtureParams?],
  Promise<string>,
  CouchbaseTestContext
> {
  public readonly fixtureName = 'DataverseFixture';
  private dataverseName?: string;

  async use(
    { serverTestContext, logger }: FixtureContext<CouchbaseTestContext>,
    params?: DataverseFixtureParams
  ) {
    this.dataverseName = params?.dataverseName ?? `test${serverTestContext.newUid()}`;

    logger?.debug(`DataverseFixture: ${this.dataverseName}`);

    await serverTestContext.c.analyticsIndexes().createDataverse(this.dataverseName);

    return this.dataverseName;
  }

  override async cleanup({ serverTestContext }: FixtureContext<CouchbaseTestContext>) {
    if (!this.dataverseName) return;
    await serverTestContext.c.analyticsIndexes().dropDataverse(this.dataverseName);
  }
}
