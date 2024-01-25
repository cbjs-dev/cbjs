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

export type AnalyticsLinkFixtureParams = {
  dataverseName: string;
};

export class AnalyticsLinkFixture extends FixtureFunctionValue<
  [AnalyticsLinkFixtureParams?],
  Promise<string>,
  CouchbaseTestContext
> {
  public readonly fixtureName = 'AnalyticsLinkFixture';
  private dataverseName?: string;

  async use(
    { serverTestContext, logger }: FixtureContext<CouchbaseTestContext>,
    params: AnalyticsLinkFixtureParams
  ): Promise<string> {
    this.dataverseName = params.dataverseName;
    const linkName = `${params.dataverseName}.Local`;

    logger?.debug(`AnalyticsLinkFixture: ${linkName} in ${this.dataverseName}`);

    await serverTestContext.c.analyticsIndexes().connectLink(linkName);

    return linkName;
  }

  override async cleanup({ serverTestContext }: FixtureContext<CouchbaseTestContext>) {
    if (!this.dataverseName) return;
    const linkName = `${this.dataverseName}.Local`;
    await serverTestContext.c.analyticsIndexes().disconnectLink(linkName);
    await serverTestContext.c.analyticsIndexes().dropLink(linkName, this.dataverseName);
  }
}
