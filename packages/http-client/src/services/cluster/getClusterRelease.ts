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

import { CouchbaseApiConfig } from '../../types';
import { getPoolNodes } from './getPoolNodes';

export type ClusterReleaseFlavor = 'community' | 'enterprise';
export type ClusterRelease = {
  version: string;
  build: string;
  flavor: ClusterReleaseFlavor;
};

let clusterInfoPromise = undefined as Promise<ClusterRelease> | undefined;

export async function getClusterRelease(apiConfig: CouchbaseApiConfig): Promise<ClusterRelease> {
  if (clusterInfoPromise === undefined) {
    clusterInfoPromise = (async () => {
      const poolNodes = apiConfig.poolNodes ?? await getPoolNodes(apiConfig);
      const [version, build, flavor] = poolNodes.nodes[0].version.split('-');
      return {
        version,
        build,
        flavor: flavor as ClusterReleaseFlavor,
      };
    })();
  }

  return clusterInfoPromise;
}
