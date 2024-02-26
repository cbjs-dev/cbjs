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
import type { TaskContext } from 'vitest';

import type { CouchbaseApiConfig } from '@cbjsdev/shared';
import { getApiConfig, type PromiseValue } from '@cbjsdev/shared';

import { getDefaultServerTestContext } from '../context';
import {
  AnalyticsIndexFixture,
  AnalyticsLinkConnectionFixture,
  AnalyticsLinkFixture,
  DatasetFixture,
  DataverseFixture,
} from '../fixtures/couchbase/analytics';
import {
  BucketFixture,
  CollectionFixture,
  DocumentKeyFixture,
  ScopeFixture,
} from '../fixtures/couchbase/kv';
import { IndexFixture, PrimaryIndexFixture } from '../fixtures/couchbase/query';
import { UserFixture, UserGroupFixture } from '../fixtures/couchbase/rbac';
import { SearchIndexFixture } from '../fixtures/couchbase/search';
import { ViewDocumentKeyFixture } from '../fixtures/couchbase/views';
import { LoggerFixture } from '../fixtures/misc/LoggerFixture';
import { ServerTestContext } from '../ServerTestContext';
import { makeCreateTest, TestBodyFixtures } from './makeCreateTest';

const couchbaseTestFixtures = {
  useBucket: BucketFixture,
  useScope: ScopeFixture,
  useCollection: CollectionFixture,
  useViewDocumentKey: ViewDocumentKeyFixture,
  useDocumentKey: DocumentKeyFixture,
  useDataverse: DataverseFixture,
  useDataset: DatasetFixture,
  useAnalyticsIndex: AnalyticsIndexFixture,
  useAnalyticsLinkConnection: AnalyticsLinkConnectionFixture,
  useAnalyticsLink: AnalyticsLinkFixture,
  useLogger: LoggerFixture,
  useUser: UserFixture,
  useUserGroup: UserGroupFixture,
  usePrimaryIndex: PrimaryIndexFixture,
  useIndex: IndexFixture,
  useSearchIndex: SearchIndexFixture,
} as const;

export type CouchbaseTestContext = {
  serverTestContext: ServerTestContext;
  apiConfig: CouchbaseApiConfig;
};

export type CouchbaseFixtures = TestBodyFixtures<
  typeof couchbaseTestFixtures & CouchbaseTestContext
> &
  TaskContext;

export type FixtureWithCouchbase<T> = (
  fixtures: CouchbaseFixtures,
  use: (v: T) => Promise<void>
) => Promise<unknown>;

export const createCouchbaseTest = makeCreateTest(async () => {
  const apiConfig = getApiConfig();
  const serverTestContext = getDefaultServerTestContext();

  await serverTestContext.start();

  return {
    fixtureContext: {
      serverTestContext,
      apiConfig,
    },
    creatorFixtures: {
      ...couchbaseTestFixtures,
      serverTestContext,
      apiConfig,
    },
  };
});

/**
 * Wrap your fixture to inject Couchbase fixtures types and infer the result type.
 * You must return the value passed to `use` for the return type to be inferred.
 * This is a no-op at runtime.
 * @param fn
 */
export function couchbaseFixture<T extends FixtureWithCouchbase<unknown>>(fn: T) {
  return fn as FixtureWithCouchbase<PromiseValue<ReturnType<T>>>;
}
