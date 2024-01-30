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
import { CreateQueryIndexOptions } from '@cbjs/cbjs';
import { OptionalProps } from '@cbjs/shared';

import { CouchbaseTestContext } from '../../../extendedTests/createCouchbaseTest';
import { getRandomId } from '../../../utils/getRandomId';
import { FixtureFunctionValue } from '../../FixtureFunctionValue';
import { FixtureContext } from '../../types';

export type IndexFixtureParams = CreateQueryIndexOptions & {
  /**
   * Name of the index.
   *
   * @default Auto-generated
   */
  name: string;
  bucketName: string;
  collectionName?: string;
  scopeName?: string;
  fields: string[];
};

export type IndexFixtureOptions = {
  /**
   * Wait for the index to be built.
   * Set to 0 to return immediately after the index creation.
   *
   * @default: 10_000
   */
  waitIndexTimeout?: number;
};

export class IndexFixture extends FixtureFunctionValue<
  [IndexFixtureParams, IndexFixtureOptions?],
  Promise<string>,
  CouchbaseTestContext
> {
  public readonly fixtureName = 'IndexFixture';
  private params?: IndexFixtureParams;

  override async use(
    { serverTestContext, logger }: FixtureContext<CouchbaseTestContext>,
    params: OptionalProps<IndexFixtureParams, 'name'>,
    fixtureOptions: IndexFixtureOptions = {}
  ) {
    await serverTestContext.start();
    const timeout = fixtureOptions.waitIndexTimeout ?? 10_000;
    const indexName = params.name || getRandomId();
    const { bucketName, fields, ...opts } = params;

    this.params = {
      ...params,
      name: indexName,
    };

    logger?.debug(
      `Creating secondary index ${
        this.params.name ? `'${this.params.name}' on` : 'on'
      } '${bucketName}'`
    );

    await serverTestContext.c
      .queryIndexes()
      .createIndex(bucketName, this.params.name, fields, opts);

    if (!opts.deferred && timeout > 0) {
      await serverTestContext.c
        .queryIndexes()
        .watchIndexes(bucketName, [this.params.name], timeout);
    }

    return this.params.name;
  }

  override async cleanup({ serverTestContext }: FixtureContext<CouchbaseTestContext>) {
    if (!this.params) return;
    const { bucketName, name, ...opts } = this.params;

    await serverTestContext.c.queryIndexes().dropIndex(bucketName, name, opts);
  }
}
