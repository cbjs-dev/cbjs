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
import { describe, expect, it } from 'vitest';

import { ApiNodeExt, ApiNodeServices } from '../types/Api/cluster/ApiNodeServices.js';
import { extractNodeServiceAddresses } from './extractNodeServiceAddresses.js';

function createNodeServices(nodesExt: [ApiNodeExt, ...ApiNodeExt[]]): ApiNodeServices {
  return {
    rev: 1,
    revEpoch: 1,
    nodesExt,
    clusterCapabilitiesVer: [1, 0],
    clusterCapabilities: {},
    clusterUUID: 'uuid',
    clusterName: '',
  };
}

describe('extractNodeServiceAddresses', () => {
  it('should fall back to the requested hostname when the node omits its own', () => {
    const nodeServices = createNodeServices([
      {
        thisNode: true,
        services: { mgmt: 8091, indexHttp: 9102, indexHttps: 19102 },
      },
    ]);

    expect(extractNodeServiceAddresses(nodeServices, 'indexHttp', 'localhost')).toEqual([
      { hostname: 'localhost', port: 9102 },
    ]);
  });

  it('should return one address per node publishing the service', () => {
    const nodeServices = createNodeServices([
      { hostname: 'node1', services: { mgmt: 8091, indexHttp: 9102 } },
      { hostname: 'node2', services: { mgmt: 8091 } },
      { hostname: 'node3', services: { mgmt: 8091, indexHttp: 9102 } },
    ]);

    expect(extractNodeServiceAddresses(nodeServices, 'indexHttp', 'node1')).toEqual([
      { hostname: 'node1', port: 9102 },
      { hostname: 'node3', port: 9102 },
    ]);
  });

  it('should return no address when no node publishes the service', () => {
    const nodeServices = createNodeServices([
      { hostname: 'node1', services: { mgmt: 8091, kv: 11210 } },
    ]);

    expect(extractNodeServiceAddresses(nodeServices, 'indexHttp', 'node1')).toEqual([]);
  });

  it('should prefer the external alternate address and its own ports', () => {
    const nodeServices = createNodeServices([
      {
        hostname: 'cb-0000.cb.uuid.svc',
        services: { mgmtSSL: 18091, indexHttps: 19102 },
        alternateAddresses: {
          external: {
            hostname: 'cb-0000.uuid.cloud.couchbase.com',
            ports: { mgmtSSL: 18091, indexHttps: 21102 },
          },
        },
      },
    ]);

    expect(
      extractNodeServiceAddresses(nodeServices, 'indexHttps', 'uuid.cloud.couchbase.com')
    ).toEqual([{ hostname: 'cb-0000.uuid.cloud.couchbase.com', port: 21102 }]);
  });

  it('should fall back to the default network when the external address omits the service', () => {
    const nodeServices = createNodeServices([
      {
        hostname: 'cb-0000.cb.uuid.svc',
        services: { mgmtSSL: 18091, indexHttps: 19102 },
        alternateAddresses: {
          external: {
            hostname: 'cb-0000.uuid.cloud.couchbase.com',
            ports: { mgmtSSL: 18091 },
          },
        },
      },
    ]);

    expect(
      extractNodeServiceAddresses(nodeServices, 'indexHttps', 'uuid.cloud.couchbase.com')
    ).toEqual([{ hostname: 'cb-0000.cb.uuid.svc', port: 19102 }]);
  });
});
