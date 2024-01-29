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
import { CouchbaseHttpApiConfig } from '../../types';
import { requestAnalyticsClusterStatus } from './requests/requestAnalyticsClusterStatus';

export async function getAnalyticsClusterStatus(apiConfig: CouchbaseHttpApiConfig) {
  const response = await requestAnalyticsClusterStatus(apiConfig);

  if (response.status !== 200) {
    throw new Error(`API Error (${response.statusText}): ${await response.text()}`);
  }

  return (await response.json()) as AnalyticsClusterStatus;
}

export type AnalyticsClusterStatus = {
  authorizedNodes: string[];
  ccNodeId: string;
  nodeConfigUri: string;
  nodeDiagnosticsUri: string;
  nodeRestartUri: string;
  nodeServiceUri: string;
  nodes: Array<{
    apiBase: string;
    apiBaseHttps: string;
    nodeId: string;
    nodeName: string;
  }>;
  partitions: Array<{
    active: boolean;
    activeNodeId: string;
    iodeviceNum: number;
    nodeId: string;
    partitionId: number;
    path: string;
    pendingActivation: boolean;
  }>;
  partitionsTopology: {
    balanced: boolean;
    ccNodeId: string;
    metadataPartition: number;
    numReplicas: 0;
    partitions: Array<{
      id: `${number}`;
      master: string;
      origin: string;
      replicas: Array<{
        location: string;
        nodeId: string;
        status: 'IN_SYNC' | 'CATCHING_UP' | 'DISCONNECTED';

        /**
         * Decimal number between 0 and 1.
         *
         * @example 0.1
         */
        syncProgress: number;
      }>;
    }>;
    revision: number;
    version: number;
  };
  serviceConfigUri: string;
  serviceDiagnosticsUri: string;
  serviceRestartUri: string;
  state: 'ACTIVE' | 'REBALANCE_REQUIRED' | 'UNUSABLE' | 'SHUTTING_DOWN';
};
