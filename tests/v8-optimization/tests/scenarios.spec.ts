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
import { createCouchbaseTest } from '@cbjs/vitest';
import { glob } from 'glob';
import { describe } from 'vitest';

import { runCase } from '../utils/runCase';

describe('optimization', async () => {
  const test = await createCouchbaseTest();
  const pathToCases = 'tests/cases/';
  const cases = await glob(`${pathToCases}/**/*`);

  for (const caseFilePath of cases) {
    test(`${caseFilePath.substring(pathToCases.length)} should be optimized`, async ({
      expect,
      serverTestContext,
    }) => {
      const isOptimized = await runCase(
        caseFilePath.substring(pathToCases.length),
        serverTestContext.bucket.name
      );
      expect(isOptimized).toBe(true);
    });
  }
});
