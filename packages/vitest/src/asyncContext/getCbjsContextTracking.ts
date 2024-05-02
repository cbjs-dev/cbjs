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
import { KeyspaceIsolationPool } from '../keyspaceIsolation/KeyspaceIsolationPool.js';
import type { CbjsTaskContextData } from './CbjsTaskContextData.js';

export type CbjsContextTracking = {
  trackingEnabled: boolean;

  /**
   * Async call stack hierarchy: <asyncId, triggerAsyncId>
   */
  parentMap: Map<number, number>;

  /**
   * Async call stack hierarchy: <triggerAsyncId, asyncId[]>
   */
  parentReversedMap: Map<number, number[]>;

  /**
   * Execution context id for each task: <taskId, asyncId>
   */
  taskAsyncIdMap: Map<string, number>;

  /**
   * Execution context id for each task: <asyncId, taskId>
   */
  taskAsyncIdReversedMap: Map<number, string>;

  /**
   * Context per scope: <asyncId, context_data>
   */
  contextMap: Map<number, CbjsTaskContextData>;

  /**
   * Keyspace isolation pool.
   */
  keyspaceIsolationPool: KeyspaceIsolationPool;
};

export function getCbjsContextTracking(): CbjsContextTracking {
  if (global.cbjsContextTracking !== undefined) {
    return global.cbjsContextTracking;
  }

  const contextTracking = {
    trackingEnabled: false,
    parentMap: new Map<number, number>(),
    parentReversedMap: new Map<number, number[]>(),
    taskAsyncIdMap: new Map<string, number>(),
    taskAsyncIdReversedMap: new Map<number, string>(),
    contextMap: new Map<number, CbjsTaskContextData>(),
    keyspaceIsolationPool: new KeyspaceIsolationPool(),
  } satisfies CbjsContextTracking;

  Object.defineProperty(global, 'cbjsContextTracking', {
    value: contextTracking,
    enumerable: false,
    configurable: false,
    writable: false,
  });

  return contextTracking;
}
