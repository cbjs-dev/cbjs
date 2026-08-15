/*
 * Copyright (c) 2023-Present Jonathan MASSUCHETTI.
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
import { describe } from 'vitest';

import {
  extractNodeServiceAddresses,
  getIndexServiceAddresses,
  getNodeServices,
} from '@cbjsdev/http-client';
import { createCouchbaseTest } from '@cbjsdev/vitest';

describe('getNodeServices', async () => {
  const test = await createCouchbaseTest();

  test('should return the ports of each node', async ({ apiConfig, expect }) => {
    const nodeServices = await getNodeServices(apiConfig);

    expect(nodeServices.nodesExt.length).toBeGreaterThan(0);

    for (const node of nodeServices.nodesExt) {
      expect(node.services.mgmt).toEqual(expect.any(Number));
    }
  });

  test('should give an address for the management service', async ({
    apiConfig,
    expect,
  }) => {
    const nodeServices = await getNodeServices(apiConfig);
    const portName = apiConfig.secure ? 'mgmtSSL' : 'mgmt';

    const addresses = extractNodeServiceAddresses(
      nodeServices,
      portName,
      apiConfig.hostname
    );

    expect(addresses.length).toEqual(nodeServices.nodesExt.length);
    expect(addresses).toContainEqual({
      hostname: expect.any(String),
      port: apiConfig.secure ? 18091 : 8091,
    });
  });

  test('should give an address for the index service', async ({ apiConfig, expect }) => {
    const addresses = await getIndexServiceAddresses(apiConfig);

    expect(addresses).toContainEqual({
      hostname: expect.any(String),
      port: apiConfig.secure ? 19102 : 9102,
    });
  });
});
