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
import { executionAsyncId } from 'node:async_hooks';
import { setImmediate } from 'timers/promises';
// eslint-disable-next-line no-restricted-imports
import { beforeAll, beforeEach, describe, expect, it, TestContext } from 'vitest';

import { getCbjsAsyncContexts } from '../asyncContext/getCbjsAsyncContexts';
import { getCurrentCbjsAsyncContext } from '../asyncContext/getCurrentCbjsAsyncContext';
import { appendLog, CbjsTestContext } from '../CbjsTestRunner';
import { TestFixtures } from '../fixtures/types';

describe('cbjsContext', { concurrent: true }, () => {
  appendLog('cbjsContext process.pid', process.pid);
  const test = it.extend({});

  type SuiteTestsContext = TestContext & TestFixtures<typeof test> & CbjsTestContext;

  beforeAll((suite) => {
    expect(getCurrentCbjsAsyncContext().taskName).toEqual(suite.name);
  });

  beforeEach<SuiteTestsContext>(async ({ task, expect }) => {
    expect(getCurrentCbjsAsyncContext().taskName).toEqual(task.name);
    appendLog('beforeEach eid', executionAsyncId());
    appendLog('beforeEach async', getCbjsAsyncContexts());
  });

  test<SuiteTestsContext>('the first test task should access the right context', async function ({
    task,
    expect,
  }) {
    expect(getCurrentCbjsAsyncContext()).toBeDefined();
    expect(getCurrentCbjsAsyncContext().taskName).toEqual(task.name);

    // Artificially make the test async
    await setImmediate();
  });

  test<SuiteTestsContext>('the second test task should access the right context', async function ({
    task,
    expect,
  }) {
    expect(getCurrentCbjsAsyncContext()).toBeDefined();
    expect(getCurrentCbjsAsyncContext().taskName).toEqual(task.name);

    // Artificially make the test async
    await setImmediate();
  });
});
