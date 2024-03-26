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

import { getCurrentCbjsAsyncContext } from '../asyncContext/getCurrentCbjsAsyncContext';
import { proxifyFunction } from '../utils/proxifyFunction';
import { KeyspaceIsolationMap } from './KeyspaceIsolationMap';
import { transformArgs as kvTransformArgs } from './proxyFunctions/kv';
import { transformArgs as queryTransformArgs } from './proxyFunctions/query';
import { transformArgs as topLevelTransformArgs } from './proxyFunctions/topLevel';

export const connectionProxySymbol = Symbol('CppConnectionProxy');

export function createProxyConnection(conn: CppConnection) {
  const isolationMap = new KeyspaceIsolationMap();

  return new Proxy(conn, {
    get: (
      target,
      prop: keyof CppConnection | typeof connectionProxySymbol,
      receiver: CppConnection
    ) => {
      if (prop === connectionProxySymbol) {
        return true;
      }

      const value = target[prop];

      // Future proofing
      // noinspection SuspiciousTypeOfGuard
      if (!(value instanceof Function)) {
        return value;
      }

      const asyncContext = getCurrentCbjsAsyncContext();
      const shouldIsolateKeyspace =
        asyncContext && asyncContext.keyspaceIsolationScope !== false;

      if (shouldIsolateKeyspace) {
        return proxifyFunction(target, prop, receiver);
      }

      // TODO split the proxy functions by service
      // TODO create a type to make sure every method is handled
      // TODO so yes, create an array of methods to ignore/passthrough to satisfies the type

      const transformArgs = {
        ...topLevelTransformArgs,
        ...kvTransformArgs,
        ...queryTransformArgs,
      };

      const passthrough = ['connect', 'shutdown', 'httpNoop', 'diagnostics'] as const;

      type MissingHandlers = Exclude<
        keyof CppConnection,
        keyof typeof transformArgs | (typeof passthrough)[number]
      >;

      if (Object.keys(transformArgs).includes(prop)) {
        const targetMethod = prop as keyof typeof transformArgs;
        return proxifyFunction(target, targetMethod, receiver, (...args) => {
          const transformFunction = transformArgs[targetMethod] as (
            m: KeyspaceIsolationMap,
            ...tArgs: typeof args
          ) => typeof args;
          return transformFunction(isolationMap, ...args);
        });
      }

      return proxifyFunction(target, prop, receiver);
    },
  });
}
