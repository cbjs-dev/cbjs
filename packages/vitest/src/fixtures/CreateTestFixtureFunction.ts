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
import type { TaskContext } from 'vitest';
import { registerContextCleanupAction, registerTestCleanupAction } from '../hook';

import { getTestLogger } from '../logger';
import type { Class } from '@cbjs/shared';
import { FixtureFunctionValue } from './FixtureFunctionValue';
import type { FixtureContext, UnknownContext } from './types';

export class CreateTestFixtureFunction<
  Args extends ReadonlyArray<unknown>,
  UseValue,
  Context extends UnknownContext
> {
  protected taskName?: string;
  protected taskType: 'suite' | 'test' = 'suite';

  constructor(
    protected fixtureClass: Class<FixtureFunctionValue<Args, UseValue, Context>>,
    protected context: Context,
    protected args: Args
  ) {}

  get(): UseValue {
    const fixtureInstance = new this.fixtureClass();

    const ctx = {
      ...this.context,
      logger: getTestLogger(),
    } as FixtureContext<Context>;

    this.registerFixtureCleanup(ctx, fixtureInstance);

    return fixtureInstance.use(ctx, ...this.args);
  }

  /**
   * @internal
   */
  getFixtureFunction() {
    return async ({ task }: TaskContext, use: (f: UseValue) => Promise<void>) => {
      this.taskType = 'test';
      this.taskName = task.name;

      await use(await this.get());
    };
  }

  private registerFixtureCleanup(
    ctx: FixtureContext<Context>,
    fixtureInstance: FixtureFunctionValue<Args, UseValue, Context>
  ) {
    const registerCleanUpAction =
      this.taskType === 'suite'
        ? registerContextCleanupAction
        : registerTestCleanupAction;

    if (fixtureInstance.cleanup === undefined) {
      getTestLogger()?.trace(`no cleanup action for ${fixtureInstance.fixtureName}`);
      return;
    }

    registerCleanUpAction(`${fixtureInstance.fixtureName}`, async () => {
      getTestLogger()?.trace(`Cleanup of ${fixtureInstance.fixtureName} called`);
      return fixtureInstance.cleanup?.(ctx);
    });
  }
}
