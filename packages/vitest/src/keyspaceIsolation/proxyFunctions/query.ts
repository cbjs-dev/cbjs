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
import {
  Keyspace,
  keyspacePath,
  parseKeyspacePath,
  PartialKeyspace,
  resolveKeyspace,
} from '@cbjsdev/shared';

import { getCurrentTaskAsyncContext } from '../../asyncContext/getCurrentTaskAsyncContext.js';
import { getQueryKeyspaces } from '../../parser/getQueryKeyspaces.js';
import { FoundKeyspace } from '../../parser/N1qlListener.js';
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

    const nextOptions = {
      ...options,
      statement: replaceKeyspaces(options.statement, queryKeyspaces, isolatedKeyspaces),
    };

    return [nextOptions, cb];
  },
} as const satisfies Partial<TransformArgsMap>;

export function replaceKeyspaces(
  statement: string,
  queryKeyspaces: FoundKeyspace[],
  isolatedKeyspaces: PartialKeyspace[]
): string {
  let cursor = 0;

  const chunks: string[] = [];

  for (let i = 0; i < queryKeyspaces.length; i++) {
    const keyspace = queryKeyspaces[i];
    const isolatedKeyspace = isolatedKeyspaces[i];
    const { keyspacePosition } = keyspace;

    const [start, end] = keyspacePosition;

    chunks.push(statement.substring(cursor, start));
    chunks.push(keyspacePath(isolatedKeyspace));

    cursor = end;
  }

  chunks.push(statement.substring(cursor));

  return chunks.join('');
}
