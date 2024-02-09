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
import { hasOwn } from '@cbjs/shared';

import { FixtureContext, UnknownContext } from './types';

export const FixtureFunctionValueSymbol: unique symbol = Symbol();

export abstract class FixtureFunctionValue<
  in Args extends ReadonlyArray<unknown>,
  out UseValue,
  in Context extends UnknownContext,
> {
  abstract fixtureName: string;

  abstract use(ctx: FixtureContext<Context>, ...args: Args): UseValue;
  async cleanup?(ctx: FixtureContext<Context>): Promise<void>;
}

Object.defineProperty(FixtureFunctionValue, FixtureFunctionValueSymbol, {
  enumerable: false,
  configurable: false,
  value: true,
  writable: false,
});

export function isFixtureFunctionValueClass(v: any): boolean {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  return v[FixtureFunctionValueSymbol] === true;
}
