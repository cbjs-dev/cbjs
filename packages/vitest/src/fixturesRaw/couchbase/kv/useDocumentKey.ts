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
import { Use } from '@vitest/runner';
import { TaskContext, Test } from 'vitest';

import { Keyspace } from '@cbjsdev/cbjs';
import { hasOwn } from '@cbjsdev/shared';

import { DocumentKeyFixtureParams } from '../../../fixtures/couchbase/kv/index.js';
import { CbjsTestContext } from '../../types.js';

export const useDocumentKey = async (
  {
    task,
    logger,
    serverTestContext,
  }: TaskContext<Test> & Pick<CbjsTestContext, 'logger' | 'serverTestContext'>,
  use: Use<(opts?: DocumentKeyFixtureParams) => string>
) => {
  const instance = {
    docKey: undefined as string | undefined,
    keyspace: undefined as Keyspace | undefined,
  };

  await use((opts = {}) => {
    instance.docKey = opts.docKey ?? serverTestContext.newUid();

    if (hasOwn(opts, 'collection')) {
      instance.keyspace = {
        bucket: opts.collection.scope.bucket.name,
        scope: opts.collection.scope.name,
        collection: opts.collection.name,
      };
    }

    if (hasOwn(opts, 'bucketName')) {
      instance.keyspace = {
        bucket: opts.bucketName,
        scope: opts.scopeName,
        collection: opts.collectionName,
      };
    }

    logger?.debug(`DocumentKey '${instance.docKey}' provided`);

    return instance.docKey;
  });

  if (!instance.docKey || !instance.keyspace) return;

  await serverTestContext.cluster
    .bucket(instance.keyspace.bucket)
    .scope(instance.keyspace.scope)
    .collection(instance.keyspace.collection)
    .remove(instance.docKey);
};
