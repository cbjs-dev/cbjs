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
import { setImmediate } from 'timers/promises';
// eslint-disable-next-line no-restricted-imports
import { beforeAll, beforeEach, describe, expect, test } from 'vitest';

import { getCurrentCbjsAsyncContext } from './getCurrentCbjsAsyncContext';

describe('cbjsContext', { concurrent: true }, () => {
  describe('context access', () => {
    beforeAll((suite) => {
      expect(getCurrentCbjsAsyncContext().taskName).toEqual(suite.name);

      getCurrentCbjsAsyncContext().testValue = 1;
      getCurrentCbjsAsyncContext().keyspaceIsolation = true;
    });

    beforeEach(async ({ task, expect }) => {
      expect(getCurrentCbjsAsyncContext().taskName).toEqual(task.name);
      expect(getCurrentCbjsAsyncContext().testValue).toEqual(1);
      expect(getCurrentCbjsAsyncContext().keyspaceIsolation).toEqual(true);

      getCurrentCbjsAsyncContext().keyspaceIsolation = false;
    });

    test('the first test task should access the right context', async function ({
      task,
      expect,
    }) {
      expect(getCurrentCbjsAsyncContext()).toBeDefined();
      expect(getCurrentCbjsAsyncContext().taskName).toEqual(task.name);
      expect(getCurrentCbjsAsyncContext().keyspaceIsolation).toBe(false);
      expect(getCurrentCbjsAsyncContext().testValue).toEqual(1);

      // Artificially make the test async
      await setImmediate();
    });

    test('the second test task should access the right context', async function ({
      task,
      expect,
    }) {
      expect(getCurrentCbjsAsyncContext()).toBeDefined();
      expect(getCurrentCbjsAsyncContext().taskName).toEqual(task.name);
      expect(getCurrentCbjsAsyncContext().keyspaceIsolation).toBe(false);
      expect(getCurrentCbjsAsyncContext().testValue).toEqual(1);

      // Artificially make the test async
      await setImmediate();
    });
  });

  describe('context inheritance', () => {
    beforeAll(() => {
      getCurrentCbjsAsyncContext().testValue = 1;
      getCurrentCbjsAsyncContext().keyspaceIsolation = true;
    });

    describe('inner suite without context overwrite', () => {
      beforeAll(() => {
        expect(getCurrentCbjsAsyncContext().testValue).toEqual(1);
      });

      beforeEach(() => {
        expect(getCurrentCbjsAsyncContext().testValue).toEqual(1);
      });

      test('should inherit outer suite context', () => {
        expect(getCurrentCbjsAsyncContext().testValue).toEqual(1);
      });
    });
  });

  describe('context merging', () => {
    beforeAll(() => {
      getCurrentCbjsAsyncContext().testValue = 1;
      getCurrentCbjsAsyncContext().keyspaceIsolation = true;
    });

    describe('inner suite with updated context', () => {
      beforeAll(() => {
        expect(getCurrentCbjsAsyncContext().testValue).toEqual(1);
        expect(getCurrentCbjsAsyncContext().keyspaceIsolation).toBe(true);

        getCurrentCbjsAsyncContext().keyspaceIsolation = false;
      });

      test('should merge and overwrite outer suite context', () => {
        expect(getCurrentCbjsAsyncContext().testValue).toEqual(1);
        expect(getCurrentCbjsAsyncContext().keyspaceIsolation).toBe(false);
      });

      describe('deeper suite', () => {
        beforeAll(() => {
          expect(getCurrentCbjsAsyncContext().testValue).toEqual(1);
          expect(getCurrentCbjsAsyncContext().keyspaceIsolation).toBe(false);

          getCurrentCbjsAsyncContext().testValue = 3;
        });

        test('context should be merged top down', () => {
          expect(getCurrentCbjsAsyncContext().testValue).toEqual(3);
          expect(getCurrentCbjsAsyncContext().keyspaceIsolation).toBe(false);
        });
      });
    });
  });
});
