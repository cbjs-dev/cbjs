/*
 * Copyright (c) 2023-Present Jonathan MASSUCHETTI <jonathan.massuchetti@dappit.fr>.
 * Copyright (c) 2013-Present Couchbase Inc.
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

type ClosableCluster = {
  closeGracefully(): Promise<void>;
};

/**
 * The clusters that have been connected and not closed yet.
 */
const openClusters = new Set<ClosableCluster>();

/**
 * @internal
 */
export function registerOpenCluster(cluster: ClosableCluster): void {
  openClusters.add(cluster);
}

/**
 * @internal
 */
export function unregisterOpenCluster(cluster: ClosableCluster): void {
  openClusters.delete(cluster);
}

/**
 * Gracefully close every cluster that is still open.
 *
 * Leaving a connection open when the process exits lets the native addon tear itself
 * down on its own, which is known to crash the process. This is mostly useful to shut
 * down a short lived process - such as a test worker - that does not keep track of the
 * connections it has opened.
 *
 * @internal
 */
export async function closeAllClusters(): Promise<void> {
  await Promise.allSettled([...openClusters].map((cluster) => cluster.closeGracefully()));
}
