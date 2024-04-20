/* eslint-disable @typescript-eslint/ban-ts-comment */

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
import { beforeAll, describe, it, TestContext, vi } from 'vitest';

import { Cluster } from '@cbjsdev/cbjs';
import { CppConnection } from '@cbjsdev/cbjs/internal';
import { getConnectionParams, waitFor } from '@cbjsdev/shared';

import { CbjsTestContext } from '../CbjsTestRunner';
import { TestFixtures } from '../fixtures/types';
import { connectionProxySymbol, createConnectionProxy } from './createConnectionProxy';
import { setKeyspaceIsolation } from './setKeyspaceIsolation';

vi.mock('@cbjsdev/cbjs', async (importOriginal) => {
  const { Cluster, ...rest } = await importOriginal<typeof import('@cbjsdev/cbjs')>();
  const clusterConnectionProxy = Symbol('ClusterConnectionProxy');

  Object.defineProperty(Cluster.prototype, 'conn', {
    get: function (this: {
      _conn: CppConnection;
      [clusterConnectionProxy]: CppConnection;
    }) {
      if (this[clusterConnectionProxy] === undefined) {
        this[clusterConnectionProxy] = createConnectionProxy(this._conn);
      }

      return this[clusterConnectionProxy];
    },
  });

  return {
    ...rest,
    Cluster,
  };
});

describe('mockConnection', () => {
  const test = it.extend({});

  type SuiteTestsContext = TestContext & TestFixtures<typeof test> & CbjsTestContext;

  beforeAll(() => {
    setKeyspaceIsolation('per-test');
  });

  test<SuiteTestsContext>('should mock connection when keyspaceIsolation is activated', async function ({
    expect,
  }) {
    const cluster = await Cluster.connect('couchbase://localhost', {
      ...getConnectionParams().credentials,
    });

    // @ts-ignore
    expect(cluster.conn[connectionProxySymbol]).toBe(true);
  });

  test<SuiteTestsContext>('should preserve original names in runtime objects', async function ({
    expect,
  }) {
    const cluster = await Cluster.connect('couchbase://localhost', {
      ...getConnectionParams().credentials,
    });

    const bucket = cluster.bucket('ci');
    expect(bucket.name).toEqual('ci');
  });

  test.todo<SuiteTestsContext>(
    'should isolate conn.openBucket',
    async function ({ expect }) {
      const cluster = await Cluster.connect('couchbase://localhost', {
        ...getConnectionParams().credentials,
      });

      const done = vi.fn();

      // TODO check the bucket has been isolated.
      const bucket = cluster.bucket('ci');

      await waitFor(() => {
        expect(done).toHaveBeenCalled();
      });
    }
  );
});
