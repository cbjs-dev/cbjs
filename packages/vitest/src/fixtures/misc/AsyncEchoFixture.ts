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

export class AsyncEchoFixture<in out T> extends FixtureFunctionValue<
  [T],
  Promise<T>,
  UnknownContext
> {
  public readonly fixtureName = 'EchoFixture';

  use(ctx: FixtureContext<null>, echo: T): Promise<T> {
    return Promise.resolve(echo);
  }
}
