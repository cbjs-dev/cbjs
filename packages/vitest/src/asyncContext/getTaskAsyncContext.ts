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

import { CbjsTaskContextData } from './CbjsTaskContextData';
import { getCbjsContextTracking } from './getCbjsContextTracking';
import { TaskContextNotFoundError } from './TaskContextNotFoundError';

/**
 *
 * Returns the context of all the tasks that are parent to the given task id.
 * The context of the given task is included.
 *
 * @param taskId Task id from which to retrieve parent contexts.
 */

export function getTaskAsyncContext(taskId: string): CbjsTaskContextData {
  const { taskAsyncIdMap, contextMap } = getCbjsContextTracking();

  const taskAsyncId = taskAsyncIdMap.get(taskId);
  invariant(taskAsyncId, `Async ID not found for task '${taskId}'`);

  const asyncContext = contextMap.get(taskAsyncId);
  if (!asyncContext) {
    throw new TaskContextNotFoundError(taskId);
  }

  return asyncContext;
}
