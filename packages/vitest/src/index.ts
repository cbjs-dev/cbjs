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

export { ServerTestContext } from './ServerTestContext.js';

export {
  createCouchbaseTest,
  FixtureWithCouchbase,
  couchbaseFixture,
  CouchbaseTestContext,
  CouchbaseFixtures,
} from './extendedTests/createCouchbaseTest.js';

export { FixtureContext, TestFixtures } from './fixtures/types.js';

export { FixtureFunctionValue } from './fixtures/FixtureFunctionValue.js';

export { getDefaultServerTestContext, createServerTestContext } from './context.js';
export { cleanupCouchbaseAfterEach, cleanupCouchbaseAfterAll } from './hook.js';
export { CbjsVitestLogger, setVitestLogger, getVitestLogger } from './logger.js';

export * from './matchers/index.js';
export * from './utils/getRandomId.js';

export * from './fixtures/couchbase/analytics/index.js';
export * from './fixtures/couchbase/kv/index.js';
export * from './fixtures/couchbase/query/index.js';
export * from './fixtures/couchbase/rbac/index.js';
export * from './fixtures/couchbase/search/index.js';
export * from './fixtures/couchbase/views/index.js';

export { runWithoutKeyspaceIsolation } from './keyspaceIsolation/runWithoutKeyspaceIsolation.js';
export { setKeyspaceIsolation } from './keyspaceIsolation/setKeyspaceIsolation.js';
export { getKeyspaceIsolation } from './keyspaceIsolation/getKeyspaceIsolation.js';
