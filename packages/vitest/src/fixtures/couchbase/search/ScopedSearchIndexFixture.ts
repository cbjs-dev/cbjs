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
import { ISearchIndex } from '@cbjsdev/cbjs';
import { waitForSearchIndex } from '@cbjsdev/http-client';
import { getRandomId, invariant, OptionalProps } from '@cbjsdev/shared';

import { CouchbaseTestContext } from '../../../extendedTests/createCouchbaseTest.js';
import { FixtureFunctionValue } from '../../FixtureFunctionValue.js';
import { FixtureContext } from '../../types.js';

export type ScopedSearchIndexFixtureParams = ISearchIndex & {
  bucketName: string;
  scopeName: string;
  collectionName: string;
};

export type ScopedSearchIndexFixtureOptions = {
  /**
   * Wait for the searchIndex to be built.
   * Set to 0 to return immediately after the searchIndex creation.
   *
   * @default: 10_000
   */
  waitSearchIndexTimeout?: number;
  awaitMutations?: boolean;
  awaitQueryVisibility?: boolean;
};

export class ScopedSearchIndexFixture extends FixtureFunctionValue<
  [ScopedSearchIndexFixtureParams, ScopedSearchIndexFixtureOptions?],
  Promise<string>,
  CouchbaseTestContext
> {
  public readonly fixtureName = 'SearchIndexFixture';
  private params?: ScopedSearchIndexFixtureParams;

  override async use(
    { serverTestContext, logger, apiConfig }: FixtureContext<CouchbaseTestContext>,
    params: ScopedSearchIndexFixtureParams,
    fixtureOptions: ScopedSearchIndexFixtureOptions = {}
  ) {
    this.params = params;

    await serverTestContext.start();
    const timeout = fixtureOptions.waitSearchIndexTimeout ?? 10_000;
    const awaitMutations = fixtureOptions.awaitMutations ?? true;
    const searchIndexName = params.name;
    const { sourceName, scopeName, collectionName } = params;

    logger?.trace(
      `Creating scoped search index '${searchIndexName}' on '${sourceName}.${scopeName}'`
    );

    await serverTestContext.c
      .bucket(sourceName)
      .scope(scopeName)
      .searchIndexes()
      .upsertIndex(this.params);

    if (timeout === 0) {
      return this.params.name;
    }

    await waitForSearchIndex(
      apiConfig,
      searchIndexName,
      {
        bucket: sourceName,
        scope: scopeName,
        collection: collectionName,
      },
      {
        timeout,
        awaitMutations,
      }
    );

    return this.params.name;
  }

  override async cleanup({
    serverTestContext,
    logger,
  }: FixtureContext<CouchbaseTestContext>) {
    if (!this.params) return;

    await serverTestContext.c
      .bucket(this.params.sourceName)
      .scope(this.params.scopeName)
      .searchIndexes()
      .dropIndex(this.params.name);
  }
}
