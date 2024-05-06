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
import { CppConnection, CppQueryContext } from '@cbjsdev/cbjs/internal';
import { QueryContext, resolveKeyspace } from '@cbjsdev/shared';

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
import { getCurrentTaskAsyncContext } from '../../asyncContext/getCurrentTaskAsyncContext.js';
import { KeyspaceIsolationPool } from '../KeyspaceIsolationPool.js';

function queryContextFromOptions(
  cppQueryContext: CppQueryContext | undefined | null
): QueryContext | undefined {
  if (!cppQueryContext) {
    return undefined;
  }

  return {
    bucket: cppQueryContext.bucket_name,
    scope: cppQueryContext.scope_name,
  };
}

const managementQueryIndexMethods = [
  'managementQueryIndexBuild',
  'managementQueryIndexCreate',
  'managementQueryIndexDrop',
  'managementQueryIndexBuildDeferred',
  'managementQueryIndexGetAll',
  'managementQueryIndexGetAllDeferred',
] as const satisfies ReadonlyArray<keyof CppConnection>;

type Params = Parameters<CppConnection[(typeof managementQueryIndexMethods)[number]]>;

async function managementQueryIndexTransformMethod(
  isolationPool: KeyspaceIsolationPool,
  ...args: Params
) {
  const [options, ...rest] = args;
  const requestedKeyspace = {
    bucket: options.bucket_name,
    scope: options.scope_name,
    collection: options.collection_name,
  };

  const queryContext = queryContextFromOptions(options.query_ctx);
  const resolvedKeyspace = resolveKeyspace(requestedKeyspace, queryContext);

  const isolatedKeyspace = await isolationPool.requireKeyspaceIsolation(
    getCurrentTaskAsyncContext().taskId,
    resolvedKeyspace
  );

  if (options.query_ctx.bucket_name !== '') {
    return [
      {
        ...options,
        collection_name: isolatedKeyspace.collection ?? '',
        query_ctx: {
          bucket_name: isolatedKeyspace.bucket,
          scope_name: isolatedKeyspace.scope ?? '',
        },
      },
      ...rest,
    ];
  }

  return [
    {
      ...options,
      bucket_name: isolatedKeyspace.bucket,
      scope_name: isolatedKeyspace.scope ?? '',
      collection_name: isolatedKeyspace.collection ?? '',
    },
    ...rest,
  ];
}

export const transformArgs = Object.fromEntries(
  managementQueryIndexMethods.map((methodName) => [
    methodName,
    managementQueryIndexTransformMethod,
  ])
) as Record<
  (typeof managementQueryIndexMethods)[number],
  typeof managementQueryIndexTransformMethod
>;
