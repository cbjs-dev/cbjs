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
import { retry } from 'ts-retry-promise';
import { TestContext } from 'vitest';

import { waitForScope } from '@cbjsdev/http-client';

import { ScopeFixtureParams } from '../../../fixtures/couchbase/kv/index.js';
import { CbjsTestContext } from '../../types.js';

export const useScope = async (
  {
    task,
    logger,
    serverTestContext,
    apiConfig,
  }: TestContext & Pick<CbjsTestContext, 'logger' | 'serverTestContext' | 'apiConfig'>,
  use: Use<(opts?: ScopeFixtureParams) => Promise<string>>
) => {
  let bucketName = serverTestContext.b.name;
  let scopeName = serverTestContext.newUid();
  await use(async (opts = {}) => {
    if (opts.bucketName) {
      bucketName = opts.bucketName;
    }

    if (opts.scopeName) {
      scopeName = opts.scopeName;
    }

    const bucket = serverTestContext.c.bucket(bucketName);

    logger?.debug(`Creating scope ${scopeName} within '${bucketName}'`);

    await bucket.collections().createScope(scopeName);
    await waitForScope(apiConfig, bucketName, scopeName);

    await retry(async () => {
      const allScopes = await bucket.collections().getAllScopes();
      const scopeExists = allScopes.some((s) => s.name === scopeName);
      if (!scopeExists) throw new Error('Scope not ready yet');
    });

    return scopeName;
  });

  await serverTestContext.c.bucket(bucketName).collections().dropScope(scopeName);

  await waitForScope(apiConfig, bucketName, scopeName, {
    expectMissing: true,
  });
};
