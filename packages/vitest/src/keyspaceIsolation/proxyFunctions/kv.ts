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
import { DocumentId } from '@cbjsdev/cbjs';
import { CppConnection, CppDocumentId } from '@cbjsdev/cbjs/internal';

import { getCurrentTaskAsyncContext, getTaskLogger } from '../../asyncContext';
import { KeyspaceIsolationPool } from '../KeyspaceIsolationPool';

type CppConnectionScopedFunction =
  keyof CppConnection extends infer CppConnectionMethodName extends keyof CppConnection
    ? CppConnectionMethodName extends unknown
      ? CppConnection[CppConnectionMethodName] extends infer Fnc extends (
          ...args: never[]
        ) => void
        ? Fnc extends (arg0: infer Arg0, ...args: never[]) => void
          ? Arg0 extends { id: CppDocumentId }
            ? CppConnectionMethodName
            : never
          : never
        : never
      : never
    : never;

// All those methods receive an object that has the keyspace its targets, as their first argument
const scopedMethods = [
  'prepend',
  'prependWithLegacyDurability',
  'exists',
  'unlock',
  'getAllReplicas',
  'upsert',
  'upsertWithLegacyDurability',
  'getAnyReplica',
  'append',
  'appendWithLegacyDurability',
  'replace',
  'replaceWithLegacyDurability',
  'getAndTouch',
  'remove',
  'removeWithLegacyDurability',
  'get',
  'lookupInAllReplicas',
  'getProjected',
  'decrement',
  'decrementWithLegacyDurability',
  'touch',
  'lookupIn',
  'getAndLock',
  'insert',
  'insertWithLegacyDurability',
  'lookupInAnyReplica',
  'mutateIn',
  'mutateInWithLegacyDurability',
  'increment',
  'incrementWithLegacyDurability',
  'managementCollectionsManifestGet',
] as const satisfies ReadonlyArray<CppConnectionScopedFunction>;

async function scopedMethodTransformArgsFunction(
  isolationPool: KeyspaceIsolationPool,
  options: { id: DocumentId },
  ...rest: never[]
) {
  const { bucket, scope, collection, key } = options.id;

  getTaskLogger()?.trace(
    `scopedMethodTransformArgsFunction: require keyspace isolation for %o`,
    options.id
  );

  const isolatedKeyspace = await isolationPool.requireKeyspaceIsolation(
    getCurrentTaskAsyncContext().taskId,
    { bucket, scope, collection }
  );

  getTaskLogger()?.trace(
    `scopedMethodTransformArgsFunction: keyspace isolated with %o`,
    isolatedKeyspace
  );

  const isolatedDocumentId = new DocumentId(
    isolatedKeyspace.bucket,
    isolatedKeyspace.scope,
    isolatedKeyspace.collection,
    key
  );

  const nextOptions = {
    ...options,
    id: isolatedDocumentId,
  };

  getTaskLogger()?.trace(`scopedMethodTransformArgsFunction: returning new args`);

  return [nextOptions, ...rest];
}

export const transformArgs = Object.fromEntries(
  scopedMethods.map((methodName) => [methodName, scopedMethodTransformArgsFunction])
) as Record<(typeof scopedMethods)[number], typeof scopedMethodTransformArgsFunction>;
