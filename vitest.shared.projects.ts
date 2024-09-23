/*
 * Copyright (c) 2024-Present Jonathan MASSUCHETTI.
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
import { defineProject } from 'vitest/config';

export default defineProject({
  test: {
    include: ['tests/**/*.spec.ts'],
    setupFiles: ['./setupTests.ts'],
    environment: 'node',
    testTimeout: 5_000,
    hookTimeout: 30_000,
    slowTestThreshold: 5_000,
    restoreMocks: true,
    mockReset: true,
    unstubGlobals: true,
    unstubEnvs: true,
    sequence: {
      setupFiles: 'list',
      hooks: 'stack',
      shuffle: {
        tests: true,
        files: false,
      },
    },
    pool: 'forks',
    minWorkers: 1,
    maxWorkers: 1,
    env: {
      CB_CONNECTION_STRING: process.env.CB_CONNECTION_STRING ?? 'couchbase://127.0.0.1',
      CB_USER: process.env.CB_USER ?? 'Administrator',
      CB_PASSWORD: process.env.CB_PASSWORD ?? 'password',
      DEBUG: '1',
      LOG_LEVEL: 'info',
    },
  },
});
