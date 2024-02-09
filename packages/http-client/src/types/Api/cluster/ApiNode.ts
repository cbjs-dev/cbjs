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
import { ServiceName } from '@cbjs/shared';

export type ApiNode = {
  clusterMembership: string;
  recoveryType: string;
  status: 'healthy' | (string & NonNullable<unknown>);
  otpNode: string;
  thisNode: true;
  hostname: `${string}:${number}`;
  nodeUUID: string;
  clusterCompatibility: number;
  version: string;
  os: string;
  cpuCount: number;
  ports: {
    direct: number;
    httpsCAPI: number;
    httpsMgmt: number;
    distTCP: number;
    distTLS: number;
  };
  services: [ServiceName, ...ServiceName[]];
  nodeEncryption: boolean;
  addressFamilyOnly: boolean;
  configuredHostname: `${string}:${number}`;
  addressFamily: string;
  externalListeners: [
    {
      afamily: string;
      nodeEncryption: boolean;
    },
  ];
  serverGroup: string;
  couchApiBase: `http://${string}:${number}${string}`;
  couchApiBaseHTTPS: `https://${string}:${number}${string}`;
  nodeHash: number;
  systemStats: {
    cpu_utilization_rate: number;
    cpu_stolen_rate: number;
    swap_total: number;
    swap_used: number;
    mem_total: number;
    mem_free: number;
    mem_limit: number;
    cpu_cores_available: number;
    allocstall: number;
  };
  interestingStats: {
    cmd_get: number;
    couch_docs_actual_disk_size: number;
    couch_docs_data_size: number;
    couch_spatial_data_size: number;
    couch_spatial_disk_size: number;
    couch_views_actual_disk_size: number;
    couch_views_data_size: number;
    curr_items: number;
    curr_items_tot: number;
    ep_bg_fetched: number;
    get_hits: number;
    mem_used: number;
    ops: number;
    vb_active_num_non_resident: number;
    vb_replica_curr_items: number;
  };
  uptime: `${number}`;
  memoryTotal: number;
  memoryFree: number;
  mcdMemoryReserved: number;
  mcdMemoryAllocated: number;
};
