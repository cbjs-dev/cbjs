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

import { getCurrentTaskAsyncContext } from '../asyncContext/getCurrentTaskAsyncContext';
import { KeyspaceIsolationPool } from './KeyspaceIsolationPool';
import { KeyspaceIsolationLevel, KeyspaceIsolationScope } from './types';

export function setKeyspaceIsolation(
  isolationScope: KeyspaceIsolationScope,
  isolationLevel: KeyspaceIsolationLevel = 'collection'
) {
  const asyncContext = getCurrentTaskAsyncContext();

  asyncContext.keyspaceIsolationScope = isolationScope;
  asyncContext.keyspaceIsolationLevel = isolationLevel;

  if (isolationLevel === 'bucket') {
    asyncContext.keyspaceIsolationMap =
      asyncContext.task.type === 'suite' ? null : new KeyspaceIsolationPool();
    return;
  }

  if (isolationScope === 'per-suite' || isolationScope === 'local') {
    invariant(
      asyncContext.task.type === 'suite',
      `You cannot define the isolation scope to "${isolationScope}" outside of a suite.`
    );

    asyncContext.keyspaceIsolationMap = new KeyspaceIsolationPool();
  }

  if (isolationScope === 'per-test') {
    asyncContext.keyspaceIsolationMap =
      asyncContext.task.type === 'suite' ? null : new KeyspaceIsolationPool();
  }
}
