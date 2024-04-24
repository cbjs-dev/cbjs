/*
 * Copyright (c) 2023-Present Jonathan MASSUCHETTI <jonathan.massuchetti@dappit.fr>.
 * Copyright (c) 2013-Present Couchbase Inc.
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
import {
  ClusterAlreadyInitializedError,
  initCluster,
  setIndexerSettings,
  waitForAnalyticsCluster,
  waitForIndexer,
} from '@cbjsdev/http-client';
import { getApiConfig } from '@cbjsdev/shared';

const apiConfig = getApiConfig();

console.info('Initializing Couchbase cluster');

try {
  await initCluster(apiConfig, {
    username: apiConfig.credentials.username,
    password: apiConfig.credentials.password,
    services: ['kv', 'fts', 'cbas', 'n1ql', 'index', 'eventing'],
  });
} catch (err) {
  if (err instanceof ClusterAlreadyInitializedError) {
    console.debug(err.message);
    process.exit(0);
  }

  console.error('Failed to initialize the cluster', err);
  throw err;
}

await setIndexerSettings(apiConfig, {
  storageMode: 'plasma',
});

await waitForIndexer(apiConfig);
await waitForAnalyticsCluster(apiConfig);
