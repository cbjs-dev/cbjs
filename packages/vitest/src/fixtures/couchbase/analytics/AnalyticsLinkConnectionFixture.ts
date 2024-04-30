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

export type AnalyticsLinkConnectionFixtureParams = {
  dataverseName: string;
  linkName?: string;
};

export class AnalyticsLinkConnectionFixture extends FixtureFunctionValue<
  [AnalyticsLinkConnectionFixtureParams?],
  Promise<string>,
  CouchbaseTestContext
> {
  public readonly fixtureName = 'AnalyticsLinkConnectionFixture';
  private dataverseName?: string;
  private linkName?: string;

  async use(
    { serverTestContext, logger }: FixtureContext<CouchbaseTestContext>,
    params: AnalyticsLinkConnectionFixtureParams
  ): Promise<string> {
    this.dataverseName = params.dataverseName;
    this.linkName = params.linkName ?? `${params.dataverseName}.Local`;

    logger?.debug(
      `AnalyticsLinkConnectionFixture: ${this.linkName} in ${this.dataverseName}`
    );

    await serverTestContext.c.analyticsIndexes().connectLink(this.linkName);

    return this.linkName;
  }

  override async cleanup({ serverTestContext }: FixtureContext<CouchbaseTestContext>) {
    if (!this.dataverseName || !this.linkName) return;

    await serverTestContext.c.analyticsIndexes().disconnectLink(this.linkName);
  }
}
