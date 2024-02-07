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
import { test, TestAPI } from 'vitest';

import { Class, CouchbaseLogger } from '@cbjs/shared';

import { CreateTestFixtureFunction } from '../fixtures/CreateTestFixtureFunction';
import {
  FixtureFunctionValue,
  isFixtureFunctionValueClass,
} from '../fixtures/FixtureFunctionValue';
import {
  FixturePlainValue,
  isFixturePlainValueClass,
} from '../fixtures/FixturePlainValue';
import {
  CreateTestFixtureOf,
  FixtureUseValues,
  TestFixtureOf,
  UnknownContext,
} from '../fixtures/types';
import { useFixture } from '../fixtures/useFixture';
import { getTestLogger } from '../logger';

type WithLogger<T> = T & { logger: CouchbaseLogger | undefined };

export type TestBodyFixtures<T extends FixtureRecords> = {
  [K in keyof T]: TestBodyFixture<T[K]>;
};

export type TestBodyFixture<T> =
  T extends Class<
    FixtureFunctionValue<
      infer Args extends ReadonlyArray<unknown>,
      infer UseValue,
      UnknownContext
    >
  >
    ? (...args: Args) => UseValue
    : T extends Class<FixturePlainValue<infer UseValue, UnknownContext>>
      ? () => UseValue
      : T extends (ctx: any, use: (v: infer UseValue) => Promise<void>) => Promise<void>
        ? UseValue
        : T;

type CreateTestFunctionArg<
  CreateTestFixtures extends Record<string, unknown>,
  UserFixtures extends Record<string, unknown>,
> =
  | UserFixtures
  | ((args: WithLogger<CreateTestFixtures>) => Promise<UserFixtures>)
  | ((args: WithLogger<CreateTestFixtures>) => UserFixtures);

type CreateTestFixtureRecords<T extends FixtureRecords> = {
  [K in keyof T]: CreateTestFixture<T[K]>;
};

type CreateTestFixture<T> = T extends Class<infer F> ? CreateTestFixtureOf<F> : T;

type TestFixtureRecords<T extends FixtureRecords> = {
  [K in keyof T]: TestFixture<T[K]>;
};

type TestFixture<T> = T extends Class<infer F> ? TestFixtureOf<F> : T;

type FixtureRecords = Record<string, unknown>;

type CreateTestFunction<
  CreatorFixtures extends FixtureRecords,
  UserFixtures extends Record<string, unknown>,
> = UserFixtures extends undefined
  ? TestAPI<FixtureUseValues<TestFixtureRecords<CreatorFixtures>>>
  : TestAPI<FixtureUseValues<TestFixtureRecords<CreatorFixtures> & UserFixtures>>;

export function makeCreateTest<
  const FixtureContext extends UnknownContext,
  const RawCreatorFixtures extends FixtureRecords,
>(
  fn: () => Promise<{
    fixtureContext: FixtureContext;
    creatorFixtures: RawCreatorFixtures;
  }>
) {
  return async function <UserFixtures extends Record<string, any>>(
    userArg?: CreateTestFunctionArg<
      CreateTestFixtureRecords<RawCreatorFixtures>,
      UserFixtures
    >
  ): Promise<CreateTestFunction<RawCreatorFixtures, UserFixtures>> {
    const { creatorFixtures, fixtureContext } = await fn();
    const createTestFixtures: Partial<CreateTestFixtureRecords<RawCreatorFixtures>> = {};
    const testFixtures: Partial<TestFixtureRecords<RawCreatorFixtures>> = {};

    Object.entries(creatorFixtures).forEach(
      <K extends keyof RawCreatorFixtures>(entry: [K, unknown]) => {
        const [fixtureName, fixture] = entry as [K, RawCreatorFixtures[K]];

        if (isFixturePlainValueClass(fixture) || isFixtureFunctionValueClass(fixture)) {
          const [createTestFixture, testFixture] = useFixture(
            fixtureContext,
            fixture as Class<
              FixtureFunctionValue<ReadonlyArray<unknown>, unknown, FixtureContext>
            >
          );

          createTestFixtures[fixtureName] = createTestFixture as CreateTestFixture<
            RawCreatorFixtures[K]
          >;
          testFixtures[fixtureName] = testFixture as TestFixture<RawCreatorFixtures[K]>;
          return;
        }

        createTestFixtures[fixtureName] = fixture as CreateTestFixture<
          RawCreatorFixtures[K]
        >;
        testFixtures[fixtureName] = fixture as TestFixture<RawCreatorFixtures[K]>;
      }
    );

    const creatorTest = test.extend<FixtureUseValues<RawCreatorFixtures>>(
      testFixtures as never
    );

    if (userArg === undefined) {
      return creatorTest as CreateTestFunction<RawCreatorFixtures, UserFixtures>;
    }

    if (typeof userArg === 'object') {
      return creatorTest.extend<FixtureUseValues<UserFixtures>>(
        userArg
      ) as CreateTestFunction<RawCreatorFixtures, UserFixtures>;
    }

    const userFixtures =
      (await userArg({
        ...(createTestFixtures as CreateTestFixtureRecords<RawCreatorFixtures>),
        logger: getTestLogger(),
      })) || {};

    const userFixturesEntries = Object.entries(userFixtures).map(([key, value]) => {
      if (value instanceof CreateTestFixtureFunction) {
        return [key, value.getFixtureFunction()];
      }

      return [key, value];
    });

    return creatorTest.extend<FixtureUseValues<UserFixtures>>(
      Object.fromEntries(userFixturesEntries)
    ) as CreateTestFunction<RawCreatorFixtures, UserFixtures>;
  };
}
