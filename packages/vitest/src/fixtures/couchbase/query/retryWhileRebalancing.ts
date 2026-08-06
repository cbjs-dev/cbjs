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

import { CouchbaseError } from '@cbjsdev/cbjs';
import { hasOwn } from '@cbjsdev/shared';

/**
 * Creating the context bucket puts the cluster into a short rebalance, during which the
 * indexer refuses to create any index. The server reports it as an internal failure, so
 * the only reliable marker is the reason it puts in the response body.
 */
function isRebalanceInProgress(err: unknown): boolean {
  if (!(err instanceof CouchbaseError)) return false;

  // The reason lives in the raw response body, exposed both by the error context and by
  // the underlying cpp error kept as the cause.
  const bodies = [
    err.context && 'response_body' in err.context ? err.context.response_body : undefined,
    hasOwn(err.cause, 'http_body') ? err.cause.http_body : undefined,
  ];

  return bodies.some(
    (body) => typeof body === 'string' && body.includes('rebalance in progress')
  );
}

/**
 * Run an operation, retrying it for as long as the cluster rejects it because a rebalance
 * is in progress. Any other error is thrown immediately.
 */
export async function retryWhileRebalancing<T>(fn: () => Promise<T>): Promise<T> {
  return retry(fn, {
    retries: 10,
    delay: 1_000,
    timeout: 30_000,
    retryIf: isRebalanceInProgress,
  });
}
