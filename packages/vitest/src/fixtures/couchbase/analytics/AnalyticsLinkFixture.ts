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
import { IAnalyticsLink } from '@cbjsdev/cbjs';
import { ApiAnalyticsLink } from '@cbjsdev/http-client';
import { OptionalProps } from '@cbjsdev/shared';

import { CouchbaseTestContext } from '../../../extendedTests/createCouchbaseTest.js';
import { getRandomId } from '../../../utils/getRandomId.js';
import { FixtureFunctionValue } from '../../FixtureFunctionValue.js';
import { FixtureContext } from '../../types.js';

export type AnalyticsLinkFixtureParams = OptionalProps<
  ApiAnalyticsLink,
  'name' | 'scope'
>;

export class AnalyticsLinkFixture extends FixtureFunctionValue<
  [AnalyticsLinkFixtureParams],
  Promise<ApiAnalyticsLink>,
  CouchbaseTestContext
> {
  public readonly fixtureName = 'AnalyticsLinkFixture';
  private link?: ApiAnalyticsLink;

  async use(
    { serverTestContext, logger }: FixtureContext<CouchbaseTestContext>,
    params: AnalyticsLinkFixtureParams
  ): Promise<ApiAnalyticsLink> {
    this.link = {
      name: getRandomId(),
      scope: 'Default',
      ...params,
    };

    logger?.debug(`AnalyticsLinkFixture: ${this.link.name} in ${this.link.scope}`);

    await serverTestContext.c.analyticsIndexes().createLink(this.link);

    return this.link;
  }

  override async cleanup({ serverTestContext }: FixtureContext<CouchbaseTestContext>) {
    if (!this.link) return;
    const linkName = `${this.link.name}.Local`;
    await serverTestContext.c.analyticsIndexes().dropLink(linkName, this.link.scope);
  }
}
