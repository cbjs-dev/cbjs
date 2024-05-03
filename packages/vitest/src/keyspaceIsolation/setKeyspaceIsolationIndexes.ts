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
import { invariant, keyspacePath } from '@cbjsdev/shared';

import { getCbjsContextTracking } from '../asyncContext/getCbjsContextTracking.js';
import { getQueryKeyspaces } from '../parser/index.js';

// TODO create the index when the associated keyspace is created ? Or only when a query is thrown at it ? Probably better !
export function setKeyspaceIsolationIndexes(indexes: string[]) {
  const { indexesDefinition } = getCbjsContextTracking();

  indexesDefinition.clear();

  for (const index of indexes) {
    const keyspaces = getQueryKeyspaces(index);
    invariant(
      keyspaces.length === 1,
      'More than one keyspace found in the index creation statement.'
    );

    indexesDefinition.set(keyspacePath(...keyspaces[0].keyspaceParts), index);
  }
}
