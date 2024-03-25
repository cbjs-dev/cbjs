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

/**
 * Returns the Cbjs context tied to the task. This is NOT the resolved context.
 * What is returned is an object containing the properties set for/within this context.
 */
export function getCurrentCbjsAsyncContext(): CbjsTaskAsyncContextData {
  const { parentMap, taskAsyncIdReversedMap, contextMap } = getCbjsContextTracking();
  let asyncId: number | undefined = executionAsyncId();

  while (asyncId) {
    if (taskAsyncIdReversedMap.has(asyncId)) {
      return contextMap.get(asyncId)!;
    }
    asyncId = parentMap.get(asyncId);
  }

  throw new Error('No cbjs async context found');
}
