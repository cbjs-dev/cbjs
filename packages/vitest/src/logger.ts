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
import { Suite, Test } from 'vitest';

import { CouchbaseLogger } from '@cbjsdev/shared';

export type CbjsVitestLogger = CouchbaseLogger;

let logger: CbjsVitestLogger | undefined = undefined;
let buildTestLogger: ((test: Test) => CbjsVitestLogger) | undefined = undefined;
let buildSuiteLogger: ((suite: Suite) => CbjsVitestLogger) | undefined = undefined;

export function setVitestLogger(
  genericLogger: CbjsVitestLogger,
  createTestLogger?: (test: Test) => CbjsVitestLogger,
  createSuiteLogger?: (suite: Suite) => CbjsVitestLogger
) {
  logger = genericLogger;
  buildTestLogger = createTestLogger;
  buildSuiteLogger = createSuiteLogger;
}

export function getVitestLogger() {
  return logger;
}

export function createTestLogger(test: Test) {
  return buildTestLogger?.(test);
}

export function createSuiteLogger(suite: Suite) {
  return buildSuiteLogger?.(suite);
}

export async function flushLogger(): Promise<void> {
  return new Promise<void>((res, rej) => {
    getVitestLogger()?.flush?.((err) => {
      if (err) {
        rej(err);
        return;
      }

      res();
    });
  });
}
