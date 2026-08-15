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
import { CouchbaseHttpApiConfig } from '../../types.js';
import {
  extractNodeServiceAddresses,
  NodeServiceAddress,
} from '../../utils/extractNodeServiceAddresses.js';
import { getNodeServices } from './getNodeServices.js';

/**
 * Address of the HTTP API of every node running the index service.
 *
 * The index service publishes its own API on port 9102 / 19102 and it is the only
 * source for some index metadata, such as the number of centroids of a vector
 * index. That node may not be the one you are connected to, hence the lookup.
 *
 * The result is empty when no node publishes that API on the network you are
 * reaching the cluster from : a node that omits `indexHttp` / `indexHttps` from
 * the ports of the network you reached it on is skipped.
 *
 * On Capella, nodes advertise their `svc-*.cloud.couchbase.com` hostnames on the
 * default network - no external alternate address is declared - and they do
 * publish `indexHttps` on 19102, so the lookup resolves as it does on a
 * self-managed cluster. Reaching that port is then a network matter : your
 * allow list, VPC peering or private endpoint must let it through.
 */
export async function getIndexServiceAddresses(
  apiConfig: Omit<CouchbaseHttpApiConfig, 'poolNodes'>,
  poolName = 'default'
): Promise<NodeServiceAddress[]> {
  const nodeServices = await getNodeServices(apiConfig, poolName);
  const portName = apiConfig.secure ? 'indexHttps' : 'indexHttp';

  return extractNodeServiceAddresses(nodeServices, portName, apiConfig.hostname);
}
