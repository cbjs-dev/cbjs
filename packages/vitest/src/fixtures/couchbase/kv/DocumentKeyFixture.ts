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
import { AnyCollection } from '@cbjs/cbjs';
import { keyspacePath } from '@cbjs/shared';
import { hasOwn } from '@cbjs/shared';

import { CouchbaseTestContext } from '../../../extendedTests/createCouchbaseTest';
import { FixtureFunctionValue } from '../../FixtureFunctionValue';
import { FixtureContext } from '../../types';

export type DocumentKeyFixtureParams = {
  docKey?: string;
} & (
  | Record<string, never>
  | {
      bucketName: string;
      scopeName: string;
      collectionName: string;
    }
  | { collection: AnyCollection }
);

export class DocumentKeyFixture extends FixtureFunctionValue<
  [DocumentKeyFixtureParams],
  string,
  CouchbaseTestContext
> {
  public readonly fixtureName = 'DocumentKeyFixture';
  private docKey?: string;
  private keyspace?: {
    bucket: string;
    scope: string;
    collection: string;
  };

  use(
    { serverTestContext, logger }: FixtureContext<CouchbaseTestContext>,
    opts: DocumentKeyFixtureParams = {}
  ) {
    this.docKey = opts.docKey || serverTestContext.newUid();

    if (hasOwn(opts, 'collection')) {
      this.keyspace = {
        bucket: opts.collection.scope.bucket.name,
        scope: opts.collection.scope.name,
        collection: opts.collection.name,
      };
    }

    if (hasOwn(opts, 'bucketName')) {
      this.keyspace = {
        bucket: opts.bucketName,
        scope: opts.scopeName,
        collection: opts.collectionName,
      };
    }

    logger?.debug(`DocumentKey '${this.docKey}' provided`);

    return this.docKey as string;
  }

  override async cleanup({ serverTestContext }: FixtureContext<CouchbaseTestContext>) {
    if (!this.docKey || !this.keyspace) return;

    await serverTestContext.cluster
      .bucket(this.keyspace.bucket)
      .scope(this.keyspace.scope)
      .collection(this.keyspace.collection)
      .remove(this.docKey);
  }
}
