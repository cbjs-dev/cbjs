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
import { CppConnection } from '@cbjsdev/cbjs/internal';

import { CbjsTaskContextData } from '../asyncContext/CbjsTaskContextData.js';
import { getCbjsContextTracking } from '../asyncContext/getCbjsContextTracking.js';
import { getCurrentTaskAsyncContext } from '../asyncContext/getCurrentTaskAsyncContext.js';
import { getTaskLogger } from '../asyncContext/getTaskLogger.js';
import { flushLogger } from '../logger.js';
import { proxifyFunction } from '../utils/proxifyFunction.js';
import { KeyspaceIsolationPool } from './KeyspaceIsolationPool.js';
import { transformArgs as kvTransformArgs } from './proxyFunctions/kv.js';
import { transformArgs as queryTransformArgs } from './proxyFunctions/query.js';
import { transformArgs as topLevelTransformArgs } from './proxyFunctions/topLevel.js';
import { bypassIsolationALS } from './runWithoutKeyspaceIsolation.js';

export const connectionProxySymbol = Symbol('CppConnectionProxy');

export function createConnectionProxy(conn: CppConnection) {
  const isolationPool = getCbjsContextTracking().keyspaceIsolationPool;

  return new Proxy(conn, {
    get: (
      target,
      prop: keyof CppConnection | typeof connectionProxySymbol,
      receiver: CppConnection
    ) => {
      if (prop === connectionProxySymbol) {
        return true;
      }

      getTaskLogger()?.trace(`ConnectionProxy: ${prop}`);
      void flushLogger();

      const value = target[prop];

      // Future proofing
      // noinspection SuspiciousTypeOfGuard
      if (!(value instanceof Function)) {
        return value;
      }

      const bypassContext = bypassIsolationALS.getStore();

      if (bypassContext) {
        getTaskLogger()?.trace('ConnexionProxy: Bypass Context');
        return proxifyFunction(target, prop, receiver);
      }

      let asyncContext: CbjsTaskContextData | undefined = undefined;

      try {
        asyncContext = getCurrentTaskAsyncContext();
      } catch (err) {
        // no cbjs async context
      }

      const shouldIsolateKeyspace =
        asyncContext !== undefined && asyncContext.keyspaceIsolationScope !== false;

      if (!shouldIsolateKeyspace) {
        getTaskLogger()?.trace(
          'ConnexionProxy: No Async Context OR KeyspaceIsolationScope = false '
        );
        return proxifyFunction(target, prop, receiver);
      }

      const transformArgs = getAllArgsTransformFunctions();

      if (Object.keys(transformArgs).includes(prop)) {
        const targetMethod = prop as keyof typeof transformArgs;
        return proxifyFunction(target, targetMethod, receiver, (...args) => {
          const transformArgsFunction = transformArgs[targetMethod] as (
            m: KeyspaceIsolationPool,
            ...tArgs: typeof args
          ) => Promise<typeof args>;
          return transformArgsFunction(isolationPool, ...args);
        });
      }

      return proxifyFunction(target, prop, receiver);
    },
  });
}

export function getAllArgsTransformFunctions() {
  return {
    ...topLevelTransformArgs,
    ...kvTransformArgs,
    ...queryTransformArgs,
  };
}
