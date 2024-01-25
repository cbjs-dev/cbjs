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

export { ServerTestContext } from './ServerTestContext';

export {
  createCouchbaseTest,
  FixtureWithCouchbase,
  couchbaseFixture,
  CouchbaseTestContext,
  CouchbaseFixtures,
} from './extendedTests/createCouchbaseTest';

export { FixtureContext, TestFixtures } from './fixtures/types'

export { FixtureFunctionValue } from './fixtures/FixtureFunctionValue';

export { getDefaultServerTestContext, createServerTestContext } from './context';
export { cleanupCouchbaseAfterEach, cleanupCouchbaseAfterAll } from './hook';
export { setTestLogger, getTestLogger } from './logger';

export * from './matchers';
export * from './utils/getRandomId';

export * from './fixtures/couchbase/analytics';
export * from './fixtures/couchbase/kv';
export * from './fixtures/couchbase/query';
export * from './fixtures/couchbase/rbac';
export * from './fixtures/couchbase/search';
export * from './fixtures/couchbase/views';