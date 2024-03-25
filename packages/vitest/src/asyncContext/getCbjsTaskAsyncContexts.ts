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

import { CbjsTaskAsyncContextData } from './CbjsTaskAsyncContextData';
import { getCbjsContextTracking } from './getCbjsContextTracking';
import { getParentTower } from './getParentTower';

/**
 *
 * Returns the contexts of the task's parents.
 *
 * @param eid Execution context id from which to retrieve parent contexts.
 * Default to the current context id.
 */

export function getCbjsTaskAsyncContexts(
  eid?: number
): [CbjsTaskAsyncContextData, ...CbjsTaskAsyncContextData[]] {
  const contextTracking = getCbjsContextTracking();

  return getParentTower(eid ?? executionAsyncId()) // all parents
    .filter((p) => contextTracking.taskAsyncIdReversedMap.has(p)) // pick parents that are tasks
    .map((p) => contextTracking.contextMap.get(p)!) as [
    CbjsTaskAsyncContextData,
    ...CbjsTaskAsyncContextData[],
  ]; // get parent contexts
}
