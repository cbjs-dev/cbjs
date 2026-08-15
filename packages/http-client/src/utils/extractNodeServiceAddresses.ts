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
import {
  ApiNodeServiceName,
  ApiNodeServices,
} from '../types/Api/cluster/ApiNodeServices.js';

export type NodeServiceAddress = {
  hostname: string;
  port: number;
};

/**
 * Address of every node publishing the given service.
 *
 * A node is reported through its `alternateAddresses.external` entry when it has
 * one publishing that service - on Capella, that entry holds the only address
 * resolvable from outside the deployment, and its ports are not necessarily the
 * standard ones. Otherwise the default network entry is used, falling back to
 * `defaultHostname` when the node omits its `hostname`, which the node that
 * served the request always does.
 *
 * Nodes that don't publish the service are left out ; the result is empty when
 * no node does.
 *
 * @param nodeServices Body of `GET /pools/default/nodeServices`.
 * @param service Port name, i.e. `indexHttps`. Note that services publish a
 * distinct port for TLS, i.e. `n1ql` and `n1qlSSL`.
 * @param defaultHostname Hostname the node services have been requested from.
 */
export function extractNodeServiceAddresses(
  nodeServices: ApiNodeServices,
  service: ApiNodeServiceName,
  defaultHostname: string
): NodeServiceAddress[] {
  const addresses: NodeServiceAddress[] = [];

  for (const node of nodeServices.nodesExt) {
    const external = node.alternateAddresses?.external;
    const externalPort = external?.ports?.[service];

    if (external !== undefined && externalPort !== undefined) {
      addresses.push({ hostname: external.hostname, port: externalPort });
      continue;
    }

    const port = node.services[service];

    if (port !== undefined) {
      addresses.push({ hostname: node.hostname ?? defaultHostname, port });
    }
  }

  return addresses;
}
