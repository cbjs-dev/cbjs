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
import { describe } from 'vitest';

import { ServiceType } from '@cbjs/cbjs';
import { createCouchbaseTest } from '@cbjs/vitest';

describe('diagnostics', async function () {
  const test = await createCouchbaseTest();

  test('should fetch diagnostics data from a cluster with open bucket successfully', async function ({
    expect,
    serverTestContext,
  }) {
    await expect(serverTestContext.cluster.diagnostics()).resolves.toEqual({
      id: expect.stringContaining(''),
      version: 2,
      sdk: expect.stringContaining('cxx'),
      services: expect.objectContaining({
        kv: expect.arrayContaining([]),
      }),
    });
  });

  test('should fetch diagnostics data on a fresh connection successfully', async function ({
    expect,
    serverTestContext,
  }) {
    const cluster = await serverTestContext.newConnection();
    await expect(cluster.diagnostics()).resolves.toEqual({
      id: expect.any(String),
      version: 2,
      sdk: expect.stringContaining('cxx'),
      services: expect.objectContaining({
        kv: expect.any(Array),
      }),
    });
  });

  test('should ping a cluster successfully', async function ({
    expect,
    serverTestContext,
  }) {
    await expect(
      serverTestContext.cluster.ping({
        serviceTypes: [ServiceType.KeyValue],
      })
    ).resolves.toEqual({
      id: expect.stringContaining(''),
      version: 2,
      sdk: expect.stringContaining('cxx'),
      services: expect.objectContaining({
        kv: expect.arrayContaining([]),
      }),
    });
  });

  test('should ping a bucket successfully', async function ({
    expect,
    serverTestContext,
  }) {
    await expect(
      serverTestContext.cluster.ping({
        serviceTypes: [ServiceType.KeyValue],
      })
    ).resolves.toEqual({
      id: expect.stringContaining(''),
      version: 2,
      sdk: expect.stringContaining('cxx'),
      services: expect.objectContaining({
        kv: expect.arrayContaining([]),
      }),
    });
  });
});
