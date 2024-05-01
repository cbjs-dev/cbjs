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
import { FixtureFunctionValue } from '../FixtureFunctionValue.js';
import { FixtureContext, UnknownContext } from '../types.js';

export type FailFixtureParams = {
  useFailsWithReason?: string;
  cleanupFailsWithReason?: string;
};

export class FailureFixture extends FixtureFunctionValue<
  [FailFixtureParams],
  Promise<string>,
  UnknownContext
> {
  public readonly fixtureName = 'FailFixture';
  private useFailsWithReason?: string;
  private cleanupFailsWithReason?: string;

  async use(
    { logger }: FixtureContext<null>,
    params: FailFixtureParams
  ): Promise<string> {
    this.useFailsWithReason = params.useFailsWithReason;
    this.cleanupFailsWithReason = params.cleanupFailsWithReason;

    if (!params.useFailsWithReason) {
      return 'success';
    }

    logger?.debug(`FailFixture usage should fail with: ${params.useFailsWithReason}`);

    return await (async () => {
      throw new Error(params.useFailsWithReason);
    })();
  }

  override async cleanup({ logger }: FixtureContext<null>) {
    if (!this.cleanupFailsWithReason) return;

    logger?.debug(`FailFixture cleanup should fail with: ${this.cleanupFailsWithReason}`);

    return await (async () => {
      throw new Error(this.cleanupFailsWithReason);
    })();
  }
}
