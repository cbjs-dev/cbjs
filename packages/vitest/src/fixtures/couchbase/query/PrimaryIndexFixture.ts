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
import { CreatePrimaryQueryIndexOptions } from '@cbjsdev/cbjs';

import { CouchbaseTestContext } from '../../../extendedTests/createCouchbaseTest';
import { FixtureFunctionValue } from '../../FixtureFunctionValue';
import { FixtureContext } from '../../types';

export type PrimaryIndexFixtureParams = CreatePrimaryQueryIndexOptions & {
  bucketName: string;
} & Record<string, unknown>;

export type PrimaryIndexFixtureOptions = {
  /**
   * Wait for the index to be built.
   * Set to 0 to return immediately after the index creation.
   *
   * @default: 10_000
   */
  waitIndexTimeout?: number;
};

export class PrimaryIndexFixture extends FixtureFunctionValue<
  [PrimaryIndexFixtureParams?, PrimaryIndexFixtureOptions?],
  Promise<string>,
  CouchbaseTestContext
> {
  public readonly fixtureName = 'PrimaryIndexFixture';
  private params?: PrimaryIndexFixtureParams;

  override async use(
    { serverTestContext, logger }: FixtureContext<CouchbaseTestContext>,
    params: PrimaryIndexFixtureParams,
    fixtureOptions: PrimaryIndexFixtureOptions = {}
  ) {
    await serverTestContext.start();
    const timeout = fixtureOptions?.waitIndexTimeout ?? 10_000;
    const { bucketName, ...opts } = params;

    this.params = params;

    logger?.debug(
      `Creating primary index ${
        this.params.name ? `'${this.params.name}' on` : 'on'
      } '${bucketName}'`
    );

    const indexName = opts.name ?? '#primary';

    await serverTestContext.c.queryIndexes().createPrimaryIndex(bucketName, opts);

    if (timeout > 0) {
      await serverTestContext.c
        .queryIndexes()
        .watchIndexes(bucketName, [indexName], timeout);
    }

    return indexName;
  }

  override async cleanup({ serverTestContext }: FixtureContext<CouchbaseTestContext>) {
    if (!this.params) return;
    const { bucketName } = this.params;
    await serverTestContext.c.queryIndexes().dropPrimaryIndex(bucketName, this.params);
  }
}
