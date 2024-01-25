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

/* eslint-disable prettier/prettier */
import type { TaskContext, TestAPI } from 'vitest';
import type { PromiseValue, CouchbaseLogger } from '@cbjs/shared';

import { CreateTestFixtureFunction } from './CreateTestFixtureFunction';
import { FixtureFunctionValue } from './FixtureFunctionValue';
import { FixturePlainValue } from './FixturePlainValue';

export type FixtureContext<T> = T extends UnknownContext
  ? T & { logger: CouchbaseLogger | undefined }
  : { logger: CouchbaseLogger | undefined };

export type UnknownContext = Record<keyof any, unknown>;

export type FixtureFunction<V = unknown> = (
  ctx: TaskContext,
  use: (v: V) => Promise<void>
) => Promise<void>;

export type FixtureUseValues<Fixtures extends Record<string, unknown>> = {
  [Key in keyof Fixtures]: FixtureUseValue<Fixtures[Key]>;
};

export type FixtureUseValue<T> =
  T extends (ctx: infer Ctx, use: (v: infer UseValue) => Promise<void>) => Promise<unknown> ?
    Ctx extends Record<string, any> ? UseValue : never :
  T extends CreateTestFixtureFunction<any, infer UseValue, UnknownContext> ?
    PromiseValue<UseValue> :
  T
;

export type TestFixtures<T> = T extends TestAPI<infer F> ? F : never;

export type CreateTestFixtureOf<T> =
  T extends FixtureFunctionValue<infer Args extends ReadonlyArray<unknown>, infer UseValue, infer Context> ?
    (...args: Args) => CreateTestFixtureFunction<Args, UseValue, Context> :
  T extends FixturePlainValue<infer UseValue extends unknown, UnknownContext> ?
    UseValue :
  never
;

export type TestFixtureOf<T> =
  T extends FixtureFunctionValue<infer Args extends ReadonlyArray<unknown>, infer UseValue, UnknownContext> ?
    TestFixtureFn<Args, UseValue> :
  T extends FixturePlainValue<infer UseValue, UnknownContext> ?
    TestFixtureFn<[], UseValue> :
  never
;

export type TestFixtureFn<Args extends ReadonlyArray<unknown>, UseValue> =
  Args extends unknown[] ?
    FixtureFunction<(...args: Args) => UseValue> :
  never
;
