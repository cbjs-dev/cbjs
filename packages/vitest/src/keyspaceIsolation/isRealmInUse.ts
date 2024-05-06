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
import { getCbjsContextTracking } from '../asyncContext/getCbjsContextTracking.js';
import { getTaskLogger } from '../asyncContext/getTaskLogger.js';
import { KeyspaceIsolationRealm } from './KeyspaceIsolationRealm.js';

export function isRealmInUse(realm: KeyspaceIsolationRealm) {
  const { contextMap, taskAsyncIdReversedMap } = getCbjsContextTracking();

  const asyncIds = taskAsyncIdReversedMap.keys();

  for (const asyncId of asyncIds) {
    const taskAsyncContext = contextMap.get(asyncId);
    if (taskAsyncContext?.keyspaceIsolationRealm === realm) {
      getTaskLogger()?.debug(
        `[isRealmInUse] Realm of "${taskAsyncContext.task.name}" is still in use.`
      );
      return true;
    }
  }

  getTaskLogger()?.debug(
    `[isRealmInUse] Realm.rootTaskId: ${realm.rootTaskId}" is no longer used.`
  );

  return false;
}
