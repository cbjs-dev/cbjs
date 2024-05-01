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

import { getCbjsContextTracking } from './getCbjsContextTracking.js';

/**
 * Get parent callers up to `stopId` - included.
 *
 * @param eid
 * @param stopId
 * @returns an array of asyncId from the closest to the `eid` to the furthest
 * @internal
 */
export function getParentTower(eid?: number, stopId?: number): [number, ...number[]] {
  const callerEid = eid ?? executionAsyncId();
  const parents: [number, ...number[]] = [callerEid];
  let parent = getCbjsContextTracking().parentMap.get(callerEid);

  while (parent) {
    if (parent === stopId) break;

    parents.push(parent);
    parent = getCbjsContextTracking().parentMap.get(parent);
  }

  return parents;
}
