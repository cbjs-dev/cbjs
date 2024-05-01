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
import SegfaultHandler from 'segfault-handler';
import { ResolvedConfig, Suite, Task, Test } from 'vitest';
import { VitestTestRunner } from 'vitest/runners';

import { Cluster, connect, ConnectOptions } from '@cbjsdev/cbjs';
import { CppConnection } from '@cbjsdev/cbjs/internal';
import { getConnectionParams, invariant } from '@cbjsdev/shared';

import { cbjsAsyncHooks } from './asyncContext/cbjsAsyncHooks.js';
import type { CbjsTaskContextData } from './asyncContext/CbjsTaskContextData.js';
import { getCbjsContextTracking } from './asyncContext/getCbjsContextTracking.js';
import { getChildrenTower } from './asyncContext/getChildrenTower.js';
import { getCurrentTaskAsyncContext } from './asyncContext/getCurrentTaskAsyncContext.js';
import { getTaskAsyncContext } from './asyncContext/getTaskAsyncContext.js';
import { createConnectionProxy } from './keyspaceIsolation/createConnectionProxy.js';
import { isRealmInUse } from './keyspaceIsolation/isRealmInUse.js';
import { KeyspaceIsolationRealm } from './keyspaceIsolation/KeyspaceIsolationRealm.js';
import { createSuiteLogger, createTestLogger, getVitestLogger } from './logger.js';

SegfaultHandler.registerHandler('crash.log');

const logs: unknown[][] = [];

/**
 * DEBUG ensure logs are in order.
 * @param args
 */
export function appendLog(...args: unknown[]) {
  logs.push(args);
}

const defaultIsolationContextValues = {
  keyspaceIsolationScope: false,
  keyspaceIsolationLevel: 'collection',
  keyspaceIsolationRealm: null,
} satisfies Partial<CbjsTaskContextData>;

export default class CbjsTestRunner extends VitestTestRunner {
  protected taskConnections = new Map<string, Cluster[]>();

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
      taskId: suite.id,
      task: suite,
    } satisfies Partial<CbjsTaskContextData>;

    const resolvedContext: Partial<CbjsTaskContextData> = {
      ...suiteContext,
      ...defaultIsolationContextValues,
    };

    /**
     * Inherit parent suite context
     * A suite is created for each file ; it has an empty id. We skip it.
     */
    if (suite.suite && suite.suite.id !== '') {
      const parentSuiteAsyncId = contextTracking.taskAsyncIdMap.get(suite.suite.id);
      invariant(parentSuiteAsyncId, `AsyncId of suite ${suite.suite.id} not found`);

      const parentSuiteContext = contextTracking.contextMap.get(parentSuiteAsyncId);
      invariant(parentSuiteContext, `Context of suite ${suiteAsyncId} not found`);

      Object.assign(resolvedContext, parentSuiteContext, suiteContext);
    }

    if (resolvedContext.keyspaceIsolationScope === 'per-suite') {
      resolvedContext.keyspaceIsolationRealm = new KeyspaceIsolationRealm(suite.id);
    }

    const suiteLogger = createSuiteLogger(suite);
    if (suiteLogger) {
      resolvedContext.logger = suiteLogger;
    }

    contextTracking.contextMap.set(suiteAsyncId, resolvedContext as CbjsTaskContextData);

    await super.onBeforeRunSuite(suite);
  }

  override async onBeforeRunTask(test: Test): Promise<void> {
    const testAsyncId = executionAsyncId();
    const contextTracking = getCbjsContextTracking();

    contextTracking.taskAsyncIdMap.set(test.id, testAsyncId);
    contextTracking.taskAsyncIdReversedMap.set(testAsyncId, test.id);

    const testContext: Partial<CbjsTaskContextData> = {
      asyncId: testAsyncId,
      taskId: test.id,
      task: test,
    };

    const resolvedContext: Partial<CbjsTaskContextData> = {
      ...testContext,
      ...defaultIsolationContextValues,
    };

    if (test.suite && test.suite.id !== '') {
      const suiteAsyncId = contextTracking.taskAsyncIdMap.get(test.suite.id);
      invariant(suiteAsyncId, `AsyncId of suite ${test.suite.id} not found`);

      const suiteContext = contextTracking.contextMap.get(suiteAsyncId);
      invariant(suiteContext, `Context of suite ${suiteAsyncId} not found`);

      Object.assign(resolvedContext, suiteContext, testContext);
    }

    if (resolvedContext.keyspaceIsolationScope === 'per-test') {
      resolvedContext.keyspaceIsolationRealm = new KeyspaceIsolationRealm(test.id);
    }

    const testLogger = createTestLogger(test);
    if (testLogger) {
      resolvedContext.logger = testLogger;
    }

    contextTracking.contextMap.set(testAsyncId, resolvedContext as CbjsTaskContextData);

    await super.onBeforeRunTask(test);
  }

  override async onAfterRunTask(test: Task) {
    // eslint-disable-next-line @typescript-eslint/await-thenable
    await super.onAfterRunTask(test);

    const { keyspaceIsolationPool } = getCbjsContextTracking();
    const { keyspaceIsolationRealm } = getTaskAsyncContext(test.id);

    this.clearTaskContextTracking(test.id);

    if (keyspaceIsolationRealm && !isRealmInUse(keyspaceIsolationRealm)) {
      keyspaceIsolationPool.releaseRealmAllocations(keyspaceIsolationRealm);
    }
  }

  override async onAfterRunSuite(suite: Suite) {
    await super.onAfterRunSuite(suite);

    const { keyspaceIsolationPool } = getCbjsContextTracking();
    const { keyspaceIsolationRealm } = getTaskAsyncContext(suite.id);

    this.clearTaskContextTracking(suite.id);

    if (keyspaceIsolationRealm && !isRealmInUse(keyspaceIsolationRealm)) {
      keyspaceIsolationPool.releaseRealmAllocations(keyspaceIsolationRealm);
    }
  }

  override async onAfterRunFiles() {
    try {
      const { keyspaceIsolationPool } = getCbjsContextTracking();

      cbjsAsyncHooks.disable();

      await keyspaceIsolationPool.dispose();

      const taskConnections = Array.from(this.taskConnections.values()).flat();

      await Promise.all(taskConnections.map((c) => c.close()));

      // Debug statement
      for (const log of logs) {
        console.log(...log);
      }

      getVitestLogger()?.flush?.();
    } catch (err) {
      console.error(err);
      getVitestLogger()?.error?.(err);
    }

    // eslint-disable-next-line @typescript-eslint/await-thenable
    await super.onAfterRunFiles();
  }

  clearTaskContextTracking(taskId: string) {
    const contextTracking = getCbjsContextTracking();
    const taskAsyncId = contextTracking.taskAsyncIdMap.get(taskId);

    invariant(taskAsyncId);

    const taskChildrenIds = getChildrenTower(taskAsyncId);

    contextTracking.contextMap.delete(taskAsyncId);

    for (const taskChildId of taskChildrenIds) {
      contextTracking.parentMap.delete(taskChildId);
      contextTracking.parentReversedMap.delete(taskAsyncId);
    }

    contextTracking.contextMap.delete(taskAsyncId);
    contextTracking.taskAsyncIdReversedMap.delete(taskAsyncId);
    contextTracking.taskAsyncIdMap.delete(taskId);
  }

  override extendTaskContext<T extends Test | Custom>(
    context: TaskContext<T>
  ): ExtendedContext<T> {
    const ec = super.extendTaskContext(context);

    const { connectionString, credentials } = getConnectionParams();
    const defaultOptions = {
      ...credentials,
      timeouts: {
        connectTimeout: 500,
      },
    };

    const taskConnections = this.taskConnections;

    Object.defineProperty(ec, 'getCluster', {
      get() {
        return async (options: ConnectOptions = {}) => {
          const { connect } = await import('@cbjsdev/cbjs');
          const cluster = await connect(connectionString, {
            ...defaultOptions,
            ...options,
          });

          const clusterConnectionProxy = Symbol('ClusterConnectionProxy');

          Object.defineProperty(cluster, 'conn', {
            get(this: { _conn: CppConnection; [clusterConnectionProxy]: CppConnection }) {
              if (this[clusterConnectionProxy] === undefined) {
                this[clusterConnectionProxy] = createConnectionProxy(this._conn);
              }

              return this[clusterConnectionProxy];
            },
          });

          const { taskId } = getCurrentTaskAsyncContext();

          if (!taskConnections.has(taskId)) {
            taskConnections.set(taskId, []);
          }

          taskConnections.get(taskId)!.push(cluster);

          return cluster;
        };
      },
    });

    Object.defineProperty(ec, 'getConnectionParams', {
      get() {
        return () => getConnectionParams();
      },
    });

    return ec;
  }
}
