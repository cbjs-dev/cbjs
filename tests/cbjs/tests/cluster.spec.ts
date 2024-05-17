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

import {
  AuthenticationFailureError,
  connectionProfiles,
  ConnectOptions,
  lcbVersion,
} from '@cbjsdev/cbjs';
import { invariant } from '@cbjsdev/shared';
import { createCouchbaseTest } from '@cbjsdev/vitest';

import { testLogger } from '../setupLogger.js';
import { connectionParams } from '../setupTests.js';
import { triggerGC } from '../utils/triggerGC.js';

describe.shuffle('cluster', { timeout: 10_000, repeats: 5 }, async () => {
  const test = await createCouchbaseTest();

  test('should queue operations until connected', async ({
    serverTestContext,
    useDocumentKey,
  }) => {
    const testDocKey = useDocumentKey();
    const cluster = await serverTestContext.newConnection();

    await cluster
      .bucket(serverTestContext.bucket.name)
      .collection(serverTestContext.collection.name)
      .insert(testDocKey, 'test');

    await cluster.closeGracefully();
  });

  test('should successfully gc connections', async ({ serverTestContext }) => {
    await serverTestContext.collection.exists('missingDoc', { timeout: 5000 });
    const cluster = await serverTestContext.newConnection();

    const collection = cluster
      .bucket(serverTestContext.bucket.name)
      .collection(serverTestContext.collection.name);

    await collection.exists('missingDoc', { timeout: 5000 });
    await cluster.closeGracefully();

    triggerGC();
  });

  test('should successfully close an unconnected cluster and error ops', async function ({
    serverTestContext,
    expect,
    useDocumentKey,
  }) {
    const testDocKey = useDocumentKey();
    const cluster = await serverTestContext.newConnection();

    const collection = cluster
      .bucket(serverTestContext.bucket.name)
      .collection(serverTestContext.collection.name);

    await cluster.closeGracefully();

    await expect(
      collection.insert(testDocKey, 'test', { timeout: 2_000 })
    ).rejects.toThrowError();
  });

  test('should error ops after close and ignore superfluous closes', async function ({
    serverTestContext,
    expect,
    useDocumentKey,
  }) {
    const testDocKey = useDocumentKey();
    const testDocKey2 = useDocumentKey();

    const cluster = await serverTestContext.newConnection();

    const collection = cluster
      .bucket(serverTestContext.bucket.name)
      .collection(serverTestContext.collection.name);

    testLogger.trace('inserted with active connection');
    await collection.insert(testDocKey, 'test', { timeout: 2_000 });

    await cluster.closeGracefully();
    await cluster.closeGracefully();
    await cluster.closeGracefully();
    await cluster.closeGracefully();

    await expect(
      collection.insert(testDocKey2, 'test', { timeout: 2_000 })
    ).rejects.toThrowError();

    await cluster.closeGracefully();
    await cluster.closeGracefully();
  });

  test('lcbVersion property should be available', function ({ expect }) {
    expect(lcbVersion).toBeTypeOf('string');
  });

  test('should throw a AuthenticationFailureError when using invalid credentials', async function ({
    serverTestContext,
    expect,
  }) {
    expect.hasAssertions();

    try {
      await serverTestContext.newConnection({
        connectionString: connectionParams.connectionString,
        credentials: {
          username: 'wrongUsername',
          password: connectionParams.credentials.password,
        },
      });
    } catch (err) {
      expect(err).toBeInstanceOf(AuthenticationFailureError);
      invariant(err instanceof AuthenticationFailureError);
      expect(err.context).toBeUndefined();
    }
  });

  test('should use wanDevelopment config profile', async function ({
    serverTestContext,
    expect,
    connectionParams,
  }) {
    connectionProfiles.resetProfiles();
    const cluster = await serverTestContext.newConnection(connectionParams, {
      configProfile: 'wanDevelopment',
    });

    expect(cluster.kvTimeout).toEqual(20000);
    expect(cluster.kvDurableTimeout).toEqual(20000);
    expect(cluster.analyticsTimeout).toEqual(120000);
    expect(cluster.managementTimeout).toEqual(120000);
    expect(cluster.queryTimeout).toEqual(120000);
    expect(cluster.searchTimeout).toEqual(120000);
    expect(cluster.viewTimeout).toEqual(120000);
    expect(cluster.bootstrapTimeout).toEqual(120000);
    expect(cluster.connectTimeout).toEqual(20000);
    expect(cluster.resolveTimeout).toEqual(20000);
  });

  test('should error when config profile is not registered', async ({
    expect,
    serverTestContext,
    connectionParams,
  }) => {
    connectionProfiles.resetProfiles();

    await expect(
      serverTestContext.newConnection(connectionParams, {
        configProfile: 'missingProfile',
      })
    ).rejects.toThrowError('missingProfile is not a registered profile.');
  });

  test('should use custom config profile', async ({
    serverTestContext,
    expect,
    connectionParams,
  }) => {
    const testProfile = {
      apply(options: ConnectOptions) {
        const timeouts = {
          kvTimeout: 5000,
          kvDurableTimeout: 10000,
          analyticsTimeout: 60000,
          managementTimeout: 60000,
          queryTimeout: 60000,
          searchTimeout: 60000,
          viewTimeout: 60000,
        };

        options.timeouts = { ...options.timeouts, ...timeouts };
      },
    };

    connectionProfiles.registerProfile('testProfile', testProfile);

    const cluster = await serverTestContext.newConnection(connectionParams, {
      configProfile: 'testProfile',
    });

    expect(cluster.kvTimeout).toEqual(5000);
    expect(cluster.kvDurableTimeout).toEqual(10000);
    expect(cluster.analyticsTimeout).toEqual(60000);
    expect(cluster.managementTimeout).toEqual(60000);
    expect(cluster.queryTimeout).toEqual(60000);
    expect(cluster.searchTimeout).toEqual(60000);
    expect(cluster.viewTimeout).toEqual(60000);
  });
});
