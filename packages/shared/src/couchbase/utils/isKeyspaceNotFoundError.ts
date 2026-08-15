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
 * The query service keeps its own view of the keyspaces of the cluster and refreshes it
 * periodically, so a bucket, a scope or a collection that has just been created is not
 * visible to it right away : it rejects the statement with the N1QL error `12003`,
 * `Keyspace not found in CB datastore`.
 *
 * The SDK reports it as a `BucketNotFoundError` whichever part of the keyspace is
 * actually missing, and the cluster manager is of no help : it has created the keyspace
 * already, so waiting on it does not tell you when the query service catches up.
 */
export function isKeyspaceNotFoundError(err: unknown): boolean {
  return errorBodyCandidates(err).some((candidate) => {
    const body = candidate.toLowerCase();
    return body.includes('keyspace not found') || body.includes('"code":12003');
  });
}
