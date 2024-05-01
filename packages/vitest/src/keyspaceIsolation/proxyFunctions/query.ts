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
import { Keyspace, parseKeyspacePath, resolveKeyspace } from '@cbjsdev/shared';

import { getCurrentTaskAsyncContext } from '../../asyncContext/getCurrentTaskAsyncContext.js';
import { getQueryKeyspaces } from '../../parser/getQueryKeyspaces.js';
import { TransformArgsMap } from '../types.js';

export const transformArgs = {
  query: async (isolationPool, options, cb) => {
    const { query_context } = options;

    let queryContextKeyspace: Pick<Keyspace, 'bucket' | 'scope'> | undefined = undefined;

    if (query_context) {
      const [queryContextBucket, queryContextScope] = parseKeyspacePath(
        query_context
      ) as [string, string];
      queryContextKeyspace = {
        bucket: queryContextBucket,
        scope: queryContextScope,
      };
    }

    const queryKeyspaces = getQueryKeyspaces(options.statement);
    const keyspacesToIsolate = queryKeyspaces.map((k) =>
      resolveKeyspace(k.keyspaceParts, queryContextKeyspace)
    );

    const isolatedKeyspaces = await Promise.all(
      keyspacesToIsolate.map((k) =>
        isolationPool.requireKeyspaceIsolation(getCurrentTaskAsyncContext().taskId, k)
      )
    );

    // TODO modify the query statement to use the isolated keyspaces
    return [options, cb];
  },
} as const satisfies Partial<TransformArgsMap>;
