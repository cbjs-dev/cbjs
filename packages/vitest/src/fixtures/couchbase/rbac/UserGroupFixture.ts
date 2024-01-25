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
import { IGroup, Role } from '@cbjs/cbjs';
import { waitForUserGroup } from '@cbjs/http-client';
import { OptionalProps } from '@cbjs/shared';

import { CouchbaseTestContext } from '../../../extendedTests/createCouchbaseTest';
import { FixtureFunctionValue } from '../../FixtureFunctionValue';
import { FixtureContext } from '../../types';
import { UserFixtureParams } from './UserFixture';

export type UserGroupFixtureParams = OptionalProps<IGroup, 'name'>;

export class UserGroupFixture extends FixtureFunctionValue<
  [UserFixtureParams?],
  Promise<string>,
  CouchbaseTestContext
> {
  public readonly fixtureName = 'UserGroupFixture';
  private name?: string;
  private roles?: (string | Role)[];

  override async use(
    { serverTestContext, logger, apiConfig }: FixtureContext<CouchbaseTestContext>,
    params: UserGroupFixtureParams = {}
  ) {
    await serverTestContext.start();
    this.name = params.name || serverTestContext.newUid();
    this.roles = params.roles || ['admin'];

    logger?.debug(
      `Creating user group '${this.name}' with roles: ${this.roles.join(', ')}`
    );

    await serverTestContext.c.users().upsertGroup({
      ...params,
      name: this.name,
      roles: this.roles,
    });

    await waitForUserGroup(apiConfig, this.name);
    return this.name;
  }

  override async cleanup({
    serverTestContext,
    apiConfig,
  }: FixtureContext<CouchbaseTestContext>) {
    if (!this.name) return;

    await serverTestContext.c.users().dropGroup(this.name);
    await waitForUserGroup(apiConfig, this.name, { expectMissing: true });
  }
}
