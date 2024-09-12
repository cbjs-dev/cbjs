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
import { beforeAll, beforeEach } from 'vitest';

import { getApiConfig, getConnectionParams, hasOwn } from '@cbjsdev/shared';
import { setTestLogger } from '@cbjsdev/vitest';

import { testLogger } from './setupLogger.js';

setTestLogger(testLogger);

export const connectionParams = getConnectionParams();
export const apiConfig = getApiConfig(false);

beforeAll(async ({ filepath }) => {
  testLogger.info(`Executing test file: ${filepath}`);
});

beforeEach(({ task, onTestFailed }) => {
  onTestFailed((taskResult) => {
    const errors = taskResult.errors?.map((e) => {
      const trimmedError: Record<string, unknown> = {
        message: e.message,
        stack: e.stack,
      };

      if (hasOwn(e, 'context') && !!e.context) {
        trimmedError.context = e.context;
      }

      return trimmedError;
    });

    testLogger.error({ errors }, `Test failed: ${task.name}`);
  });
});

process.addListener('SIGABRT', (e) => {
  testLogger.error('Signal %s received', e);
});

process.addListener('uncaughtException', (e) => {
  testLogger.error('UncaughtException: %s', e);
});

process.addListener('unhandledRejection', (e) => {
  testLogger.error('UnhandledRejection: %s', e);
});
