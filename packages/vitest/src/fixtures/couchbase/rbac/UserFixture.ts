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
import { IUser } from '@cbjs/cbjs';
import { waitForUser } from '@cbjs/http-client';
import { OptionalProps } from '@cbjs/shared';

import { CouchbaseTestContext } from '../../../extendedTests/createCouchbaseTest';
import { getRandomId } from '../../../utils/getRandomId';
import { FixtureFunctionValue } from '../../FixtureFunctionValue';
import { FixtureContext } from '../../types';

export type UserFixtureParams = OptionalProps<IUser, 'username'>;

export class UserFixture extends FixtureFunctionValue<
  [UserFixtureParams?],
  Promise<{
    username: string;
    password: string;
  }>,
  CouchbaseTestContext
> {
  public readonly fixtureName = 'UserFixture';
  private username?: string;
  private password?: string;

  override async use(
    { serverTestContext, logger, apiConfig }: FixtureContext<CouchbaseTestContext>,
    params: UserFixtureParams = {}
  ) {
    await serverTestContext.start();
    this.username = params.username || serverTestContext.newUid();
    this.password = params.password || getRandomId();

    await serverTestContext.c.users().upsertUser({
      ...params,
      username: this.username,
      password: this.password,
    });

    logger?.trace(`Creating user '${this.username}'`);

    await waitForUser(apiConfig, this.username, 'local');
    return {
      username: this.username,
      password: this.password,
    };
  }

  override async cleanup({
    serverTestContext,
    apiConfig,
    logger,
  }: FixtureContext<CouchbaseTestContext>) {
    if (!this.username) return;
    await serverTestContext.c.users().dropUser(this.username);
    await waitForUser(apiConfig, this.username, 'local', { expectMissing: true });
  }
}
