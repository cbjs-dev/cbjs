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
import { retry } from 'ts-retry-promise';

import { isKeyspaceNotFoundError, isRebalanceInProgressError } from '@cbjsdev/shared';

/**
 * Run an operation, retrying it for as long as the cluster has not caught up with the
 * keyspace the test just created. Any other error is thrown immediately.
 *
 * Two services lag behind, each in its own way :
 *
 * - the indexer refuses every index mutation while a rebalance is in progress, and
 *   creating the context bucket puts the cluster into a short one ;
 * - the query service refreshes its own view of the keyspaces periodically, so it answers
 *   `Keyspace not found in CB datastore` for a collection the cluster manager has created
 *   already - waiting on the cluster manager therefore proves nothing.
 */
export async function retryWhileClusterCatchesUp<T>(fn: () => Promise<T>): Promise<T> {
  return retry(fn, {
    retries: 15,
    delay: 1_000,
    timeout: 30_000,
    retryIf: (err) => isRebalanceInProgressError(err) || isKeyspaceNotFoundError(err),
  });
}
