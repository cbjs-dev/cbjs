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
import { Custom, ExtendedContext, TaskContext } from '@vitest/runner';
import { executionAsyncId } from 'node:async_hooks';
import { ResolvedConfig, Suite, Task, Test } from 'vitest';
import { VitestTestRunner } from 'vitest/runners';

import { invariant } from '@cbjsdev/shared';

import { CbjsAsyncContextData } from './asyncContext/CbjsAsyncContextData';
import { cbjsAsyncHooks } from './asyncContext/cbjsAsyncHooks';
import { getCbjsContextTracking } from './asyncContext/getCbjsContextTracking';
import { getChildrenTower } from './asyncContext/getChildrenTower';
import { getCurrentCbjsAsyncContext } from './asyncContext/getCurrentCbjsAsyncContext';
import { KeyspaceIsolationLevel } from './keyspaceIsolation/types';

export type CbjsTestContext = {
  cbjs: CbjsAsyncContextData;
  useKeyspaceIsolation: (isolateKeyspace: KeyspaceIsolationLevel) => void;
};

const logs: unknown[][] = [];

/**
 * DEBUG ensure logs are in order.
 * @param args
 */
export function appendLog(...args: unknown[]) {
  logs.push(args);
}

export default class CbjsTestRunner extends VitestTestRunner {
  constructor(config: ResolvedConfig) {
    cbjsAsyncHooks.enable();
    super(config);
  }

  async onBeforeCollect() {
    getCbjsContextTracking().trackingEnabled = true;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    await super.onBeforeCollect?.(); // This may be implemented by VitestTestRunner in the future.
  }

  override async onBeforeRunSuite(suite: Suite): Promise<void> {
    const suiteAsyncId = executionAsyncId();
    const contextTracking = getCbjsContextTracking();
    contextTracking.taskAsyncIdMap.set(suite.id, suiteAsyncId);
    contextTracking.taskAsyncIdReversedMap.set(suiteAsyncId, suite.id);

    const suiteContext = {
      asyncId: suiteAsyncId,
      taskName: suite.name,
    };

    const resolvedContext = {
      ...suiteContext,
    };

    /**
     * Inherit parent suite context
     * A suite is created for each file ; it has an empty id. We skip it.
     */
    if (suite.suite && suite.suite.id !== '') {
      const parentSuiteAsyncId = contextTracking.taskAsyncIdMap.get(suite.suite.id);
      invariant(parentSuiteAsyncId, `AsyncId of suite ${suite.suite.id} not found`);

      const parentSuiteContext = contextTracking.contextMap.get(parentSuiteAsyncId);
      invariant(suiteContext, `Context of suite ${suiteAsyncId} not found`);

      Object.assign(resolvedContext, parentSuiteContext, suiteContext);
    }

    contextTracking.contextMap.set(suiteAsyncId, resolvedContext as CbjsAsyncContextData);

    await super.onBeforeRunSuite(suite);
  }

  override async onBeforeRunTask(test: Test): Promise<void> {
    const testAsyncId = executionAsyncId();
    const contextTracking = getCbjsContextTracking();

    contextTracking.taskAsyncIdMap.set(test.id, testAsyncId);
    contextTracking.taskAsyncIdReversedMap.set(testAsyncId, test.id);

    const testContext = {
      asyncId: testAsyncId,
      taskName: test.name,
    };

    const suiteAsyncId = contextTracking.taskAsyncIdMap.get(test.suite.id);
    invariant(suiteAsyncId, `AsyncId of suite ${test.suite.id} not found`);

    const suiteContext = contextTracking.contextMap.get(suiteAsyncId);
    invariant(suiteContext, `Context of suite ${suiteAsyncId} not found`);

    const resolvedContext = {
      ...suiteContext,
      ...testContext,
    };

    contextTracking.contextMap.set(testAsyncId, resolvedContext as CbjsAsyncContextData);
    await super.onBeforeRunTask(test);
  }

  override async onAfterRunTask(test: Task) {
    // eslint-disable-next-line @typescript-eslint/await-thenable
    await super.onAfterRunTask(test);
    this.clearTaskContextTracking(test.id);
  }

  override async onAfterRunSuite(suite: Suite) {
    await super.onAfterRunSuite(suite);
    this.clearTaskContextTracking(suite.id);
  }

  clearTaskContextTracking(taskId: string) {
    const contextTracking = getCbjsContextTracking();
    const taskAsyncId = contextTracking.taskAsyncIdMap.get(taskId);

    invariant(taskAsyncId);

    const taskChildrenId = getChildrenTower(taskAsyncId);

    contextTracking.contextMap.delete(taskAsyncId);

    for (const taskChildId of taskChildrenId) {
      contextTracking.parentMap.delete(taskChildId);
      contextTracking.parentReversedMap.delete(taskAsyncId);
    }

    contextTracking.contextMap.delete(taskAsyncId);
    contextTracking.taskAsyncIdReversedMap.delete(taskAsyncId);
    contextTracking.taskAsyncIdMap.delete(taskId);
  }

  override async onAfterRunFiles() {
    // Debug statement
    for (const log of logs) {
      console.log(...log);
    }

    // eslint-disable-next-line @typescript-eslint/await-thenable
    await super.onAfterRunFiles();
  }

  // Executed during collection
  override extendTaskContext<T extends Test | Custom>(
    context: TaskContext<T>
  ): ExtendedContext<T> {
    const ec = super.extendTaskContext(context);

    Object.defineProperty(ec, 'useKeyspaceIsolation', {
      get() {
        return (keyspaceIsolation: boolean) => {
          getCurrentCbjsAsyncContext().keyspaceIsolation = keyspaceIsolation;
        };
      },
    });

    return ec;
  }
}