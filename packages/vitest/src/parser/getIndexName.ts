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
import { walkN1ql } from '@cbjsdev/n1ql-parser';
import { invariant, trimIdentifier } from '@cbjsdev/shared';

import { FoundIndex, N1qlListener } from './N1qlListener.js';

export function getIndexName(query: string) {
  const listener = new N1qlListener();
  walkN1ql(query, listener);

  const foundIndexes = listener.getIndexes().map((index) => ({
    indexName: index.indexName === null ? null : trimIdentifier(index.indexName),
    indexNamePosition: index.indexNamePosition,
  })) as FoundIndex[];

  invariant(foundIndexes.length === 1, 'Expected a single index name.');

  return foundIndexes[0];
}
