/*
 * Copyright (c) 2023-Present Jonathan MASSUCHETTI.
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
import { pino, stdTimeFunctions } from 'pino';

export const testLogger = pino({
  enabled: ['1', 'true', 'yes', 'y'].includes(process.env.DEBUG ?? ''),
  level: 'trace',
  timestamp: stdTimeFunctions.isoTime,
  formatters: {
    bindings: () => {
      if (process.env.VITEST_POOL_ID) {
        return {
          VITEST_POOL_ID: process.env.VITEST_POOL_ID,
        };
      }

      return {};
    },
  },
  transport: {
    target: 'pino/file',
    options: {
      destination: `vitest-pino.log`,
      mkdir: true,
      append: true,
      sync: true,
    },
  },
});
