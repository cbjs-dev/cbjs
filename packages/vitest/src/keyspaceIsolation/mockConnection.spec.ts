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
import { beforeEach, describe, test, vi } from 'vitest';

import { Cluster, connect } from '@cbjsdev/cbjs';
import { CppConnection } from '@cbjsdev/cbjs/internal';
import { getConnectionParams, waitFor } from '@cbjsdev/shared';

vi.mock('@cbjsdev/cbjs', async (importOriginal) => {
  const original = await importOriginal<typeof import('@cbjsdev/cbjs')>();

  return {
    ...original,
    Cluster: vi.fn((...args: ConstructorParameters<typeof Cluster>) => {
      console.log('mocked constructor');

      const mockedCluster = new original.Cluster(...args);
      // const realConnection = mockedCluster.conn;

      // const connectionProxy = new Proxy(realConnection, {
      //   get: (target, prop: keyof CppConnection, receiver) => {
      //     const propValue = target[prop];
      //
      //     if (prop === 'openBucket') {
      //       return function (this: CppConnection, ...args: Parameters<typeof propValue>) {
      //
      //         // @ts-expect-error fuck off
      //         const result = propValue.apply(this === receiver ? target : this, args);
      //       };
      //     }
      //     return propValue;
      //   },
      // });

      // const mockedConnection = {
      //   ...realConnection,
      //   openBucket: function (...args: Parameters<typeof realConnection.openBucket>) {
      //     console.log('openBucket');
      //     realConnection.openBucket.bind(realConnection)(...args);
      //     return 'openBucket';
      //   },
      // };

      // const openBucket = realConnection.openBucket.bind(realConnection);
      //
      // Object.defineProperty(realConnection, 'openBucket', {
      //   value: function (...args: Parameters<typeof realConnection.openBucket>) {
      //     console.log('openBucket');
      //     // openBucket(...args);
      //     return 'openBucket';
      //   },
      // });

      // console.log('before define');
      //
      // Object.defineProperty(mockedCluster, 'conn', {
      //   get: () => mockedConnection,
      // });
      //
      // Object.defineProperty(mockedCluster, '_conn', {
      //   value: mockedConnection,
      // });
      //
      // console.log('after define');
      // console.log(mockedConnection);

      return mockedCluster;
    }),
  };
});

describe('mockConnection', () => {
  test('test', async ({ expect }) => {
    // const cluster = await connect(
    //   'couchbase://localhost',
    //   getConnectionParams().credentials
    // );
    // expect(cluster.conn).toEqual('_connectMocked');

    const connection = await Cluster.connect('couchbase://localhost');
    // expect(c.createCppConnection()).toEqual('_connectMocked');

    // expect(vi.isMockFunction(c), 'c is not mocked').toBe(true);
    expect(connection).toHaveProperty('openBucket');

    // const done = vi.fn();
    //
    // const pingResult = await c.ping();
    //
    // expect(pingResult).toBeDefined();

    // const result = c.conn.openBucket('ci', (err) => {
    //   expect(err).toBeNull();
    //   done();
    // });

    // await waitFor(() => {
    //   expect(done).toHaveBeenCalled();
    // });

    // expect(result).toEqual('openBucket');
  });
});
