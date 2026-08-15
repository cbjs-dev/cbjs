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

import { isRebalanceInProgressError } from '@cbjsdev/shared';

/**
 * Run an operation, retrying it for as long as the cluster rejects it because a rebalance
 * is in progress - creating the context bucket puts the cluster into a short one, during
 * which the indexer refuses to create any index. Any other error is thrown immediately.
 */
export async function retryWhileRebalancing<T>(fn: () => Promise<T>): Promise<T> {
  return retry(fn, {
    retries: 10,
    delay: 1_000,
    timeout: 30_000,
    retryIf: isRebalanceInProgressError,
  });
}
