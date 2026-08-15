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
import { errorBodyCandidates } from './errorBodyCandidates.js';

/**
 * Any operation that changes the topology - creating or dropping a bucket, most notably -
 * puts the cluster into a rebalance, during which the indexer rejects every index mutation.
 *
 * The server reports it as a plain internal failure, so the only reliable marker is the
 * reason it puts in the response body.
 */
export function isRebalanceInProgressError(err: unknown): boolean {
  return errorBodyCandidates(err).some((candidate) =>
    candidate.toLowerCase().includes('rebalance in progress')
  );
}
