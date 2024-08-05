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
import { Use } from '@vitest/runner';
import { TaskContext, Test, TestAPI } from 'vitest';

import { cbjsTest } from '../extendedTests/cbjsTest.js';
import {
  useApiConfig,
  useDocumentKey,
  useLogger,
  useServerTestContext,
} from './couchbase/index.js';

/**
 * Represents the value of the fixture within the test.
 */
export type CbjsFixtureUseValue<T> = T extends (
  ctx: never,
  use: (v: infer UseValue) => Promise<void>
) => Promise<void>
  ? UseValue
  : never;

/**
 * Represent the context available within a {@link cbjsTest}.
 *
 * @internal
 */
export type CbjsTestContext = {
  serverTestContext: CbjsFixtureUseValue<typeof useServerTestContext>;
  logger: CbjsFixtureUseValue<typeof useLogger>;
  apiConfig: CbjsFixtureUseValue<typeof useApiConfig>;
  useDocumentKey: CbjsFixtureUseValue<typeof useDocumentKey>;
};

/**
 * Utility type to create a fixture function that has access to the context of a {@link cbjsTest}.
 */
export type CbjsFixtureFn<UseValue> = (
  ctx: TaskContext<Test> & CbjsTestContext,
  use: Use<UseValue>
) => Promise<void>;

/**
 * All the fixtures available inside a cbjsTest.
 *
 * @example
 * beforeEach<CbjsTestContext<typeof test>(() => { ... });
 */
export type CbjsExtendedTestContext<T> =
  T extends TestAPI<infer F extends TaskContext<Test>> ? F : never;
