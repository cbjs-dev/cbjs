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
import type { TaskContext, Test } from 'vitest';

import type { Class } from '@cbjs/shared';

import { registerTestCleanupAction } from '../hook';
import { getTestLogger } from '../logger';
import { CreateTestFixtureFunction } from './CreateTestFixtureFunction';
import {
  FixtureFunctionValue,
  isFixtureFunctionValueClass,
} from './FixtureFunctionValue';
import { FixturePlainValue, isFixturePlainValueClass } from './FixturePlainValue';
import type { FixtureContext, TestFixtureFn, UnknownContext } from './types';

export function useFixture<
  FixtureClass extends Class<FixtureFunctionValue<Args, UseValue, Context>>,
  Args extends ReadonlyArray<unknown>,
  UseValue,
  Context extends UnknownContext,
>(
  ctx: Context,
  fixtureClass: FixtureClass
): [
  (...args: Args) => CreateTestFixtureFunction<Args, UseValue, Context>,
  TestFixtureFn<Args, UseValue>,
];

export function useFixture<
  FixtureClass extends Class<FixturePlainValue<UseValue, Context>>,
  UseValue,
  Context extends UnknownContext,
>(ctx: Context, fixtureClass: FixtureClass): [UseValue, UseValue];

export function useFixture<
  FixtureClass extends
    | Class<FixtureFunctionValue<Args, UseValue, Context>>
    | Class<FixturePlainValue<UseValue, Context>>,
  Args extends ReadonlyArray<unknown>,
  UseValue,
  Context extends UnknownContext,
>(
  ctx: Context,
  fixtureClass: FixtureClass
): [
  ((...args: Args) => CreateTestFixtureFunction<Args, UseValue, Context>) | UseValue,
  TestFixtureFn<Args, UseValue> | UseValue,
] {
  const suiteFixture = getSuiteFixture(ctx, fixtureClass);

  const testFixture = async function (
    { task }: TaskContext<Test>,
    use: (f: (...args: Args) => UseValue) => Promise<void>
  ) {
    await use(function (...args: Args) {
      const fixtureInstance = new fixtureClass();
      const augmentedCtx = {
        ...ctx,
        logger: getTestLogger(),
      } as FixtureContext<Context>;

      if (fixtureInstance.cleanup) {
        registerTestCleanupAction(`${fixtureInstance.fixtureName}`, async () => {
          return fixtureInstance.cleanup?.(augmentedCtx);
        });
      }

      return fixtureInstance.use(augmentedCtx, ...args);
    });
  };

  return [
    suiteFixture as
      | ((...args: Args) => CreateTestFixtureFunction<Args, UseValue, Context>)
      | UseValue,
    testFixture as TestFixtureFn<Args, UseValue>,
  ];
}

function getSuiteFixture<
  Args extends ReadonlyArray<unknown>,
  UseValue,
  Context extends UnknownContext,
>(
  ctx: Context,
  fixtureClass:
    | Class<FixtureFunctionValue<Args, UseValue, Context>>
    | Class<FixturePlainValue<UseValue, Context>>
): ((...args: Args) => CreateTestFixtureFunction<Args, UseValue, Context>) | UseValue {
  switch (true) {
    case isFixturePlainValueClass(fixtureClass): {
      const fixtureInstance = new fixtureClass();
      const augmentedCtx = {
        ...ctx,
        logger: getTestLogger(),
      } as FixtureContext<Context>;
      return fixtureInstance.use(augmentedCtx);
    }

    case isFixtureFunctionValueClass(fixtureClass): {
      return function (...args: Args) {
        return new CreateTestFixtureFunction(
          fixtureClass as Class<FixtureFunctionValue<Args, UseValue, Context>>,
          ctx,
          args
        );
      } as (...args: Args) => CreateTestFixtureFunction<Args, UseValue, Context>;
    }
  }

  throw new Error(`Invalid fixture: ${fixtureClass}`);
}
