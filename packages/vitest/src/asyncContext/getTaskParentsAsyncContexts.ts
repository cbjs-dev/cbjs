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
import { invariant } from '@cbjsdev/shared';

import { CbjsTaskContextData } from './CbjsTaskContextData.js';
import { getCbjsContextTracking } from './getCbjsContextTracking.js';
import { getTaskAsyncContext } from './getTaskAsyncContext.js';

/**
 *
 * Returns the context of all the tasks that are parent to the given task id.
 * The context of the given task is included.
 *
 * @param taskId Task id from which to retrieve parent contexts.
 */

export function getTaskParentsAsyncContexts(
  taskId: string
): [CbjsTaskContextData, ...CbjsTaskContextData[]] {
  const { taskAsyncIdMap, contextMap } = getCbjsContextTracking();

  const taskAsyncId = taskAsyncIdMap.get(taskId);
  invariant(taskAsyncId, 'Missing task async id');

  const taskContext = contextMap.get(taskAsyncId);
  invariant(taskContext, 'Missing task async context');

  const { task } = contextMap.get(taskAsyncId)!;

  const contexts = [taskContext] as [CbjsTaskContextData, ...CbjsTaskContextData[]];

  let currentTask = task;

  while (currentTask) {
    if (currentTask.suite === undefined) {
      return contexts;
    }

    contexts.push(getTaskAsyncContext(currentTask.suite.id));
    currentTask = currentTask.suite;
  }

  return contexts;
}
