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
import { ServiceName, jsonToUrlSearchParams } from '@cbjs/shared';
import fetch from 'cross-fetch';

import { CouchbaseHttpApiConfig } from '../../../types';
import { MANAGEMENT_PORT } from '../../../utils/ports';

export type InitClusterParams = {
  username: string;
  password: string;

  /**
   * The IP address or domain name that will be the name of the node established as a single-node cluster.
   *
   * @default 127.0.0.1
   */
  hostname?: string;
  data_path?: string;
  index_path?: string;
  cbas_path?: string;
  eventing_path?: string;
  java_home?: string;
  sendStats?: boolean;
  clusterName?: string;

  /**
   * List of services to be hosted on this cluster.
   */
  services: [ServiceName, ...ServiceName[]];
  memoryQuota?: number;
  indexMemoryQuota?: number;
  eventingMemoryQuota?: number;
  ftsMemoryQuota?: number;
  cbasMemoryQuota?: number;
  afamily?: 'ipv4' | 'ipv6';
  afamilyOnly?: boolean;
  nodeEncryption?: 'on' | 'off';
  indexerStorageMode?: 'plasma' | 'magma';
  port?: 'SAME' | number;

  /**
   * Comma separated list of hosts allowed to join the cluster.
   *
   * @since 7.1.1
   * @example *.mysubnet.org,192.168.0.0/16
   */
  allowedHosts?: string; // =<list-of-naming-conventions>
};

export async function requestInitCluster(
  { hostname, secure }: Pick<CouchbaseHttpApiConfig, 'hostname' | 'secure'>,
  initClusterParams: InitClusterParams
) {
  const protocol = secure ? 'https' : 'http';
  const url = `${protocol}://${hostname}:${MANAGEMENT_PORT}/clusterInit`;

  const services = initClusterParams.services.join(',');

  const body = {
    port: 'SAME',
    sendStats: false,
    ...initClusterParams,
    services,
  };

  const payload = jsonToUrlSearchParams(body);

  return await fetch(url, {
    method: 'POST',
    body: payload,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}
