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
import { connect } from '@cbjsdev/cbjs';

import {
  arkGraphPendingOperationAddManageable,
  GraphPendingOperationAddManageable,
} from './types/database/models/graph.js';
import {
  arkGraphId,
  arkGraphPendingOperationId,
  type ManageableBudgetId,
} from './types/database/models/ids.js';
import { ManageableDocument } from './types/database/models/manageable/manageable.js';
import type { PragmaClusterTypes } from './types/database/PragmaClusterTypes.js';

const cluster = await connect<PragmaClusterTypes>('');
const cb = cluster.bucket('pragma').scope('userland');

const manageableId: ManageableBudgetId = 'manageable_budget__001';

const { content } = await cb
  .collection('manageable')
  .lookupIn(manageableId, { throwOnSpecError: true })
  .get('manageableType') // string: 970 - path: 977
  .get('audit.createdBy'); // string: 971 - path: 977
// .get('audit.createdAt')
// .get('scope.organizationId')
// .get('scope.projectId')
// .get('scope.domainIds')

const graphOperation: GraphPendingOperationAddManageable =
  arkGraphPendingOperationAddManageable.assert({
    op: 'addManageable',
    happenedAt: Date.now(),
    attempt: 0,
    seqno: 0,
    payload: {
      manageableId,
    },
  });

const graphId = arkGraphId.assert('');
const graphPendingOperationId = arkGraphPendingOperationId.assert(
  `graph_pending_operation__test`
);

// await cb.collection('graph').lookupIn(graphId).get('');

await cb
  .collection('graph')
  .mutateIn(graphId)
  .insert(
    `pendingOperations.${graphPendingOperationId}`,
    arkGraphPendingOperationAddManageable.assert(graphOperation)
  );

console.log(content);
