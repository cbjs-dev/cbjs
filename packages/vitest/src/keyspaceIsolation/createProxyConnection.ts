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

import { proxifyFunction } from '../utils/proxifyFunction';
import { KeyspaceIsolationMap } from './KeyspaceIsolationMap';

export function createProxyConnection(conn: CppConnection) {
  const isolationMap = new KeyspaceIsolationMap();

  return new Proxy(conn, {
    get: (target, prop: keyof CppConnection, receiver: CppConnection) => {
      const value = target[prop];

      // Future proofing
      if (!(value instanceof Function)) {
        return value;
      }

      if (prop === 'openBucket') {
        return proxifyFunction(target, receiver, target[prop], (bucketName, cb) => {
          const bucketIsolatedName = isolationMap.isolateBucket(bucketName);
          console.log(bucketIsolatedName);
          return [bucketIsolatedName, cb] as const;
        });
      }

      return proxifyFunction(target, receiver, target[prop]);
    },
  });
}
