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

import { invariant } from '@cbjsdev/shared';

import { CbjsTaskContextData } from './CbjsTaskContextData';
import { getCurrentTaskAsyncContext } from './getCurrentTaskAsyncContext';

function setAsyncContext(ctx: Partial<CbjsTaskContextData & { testValue: number }>) {
  const currentContext = getCurrentTaskAsyncContext();
  invariant(currentContext);
  Object.assign(currentContext, ctx);
}

function getAsyncContext() {
  return getCurrentTaskAsyncContext() as CbjsTaskContextData & {
    testValue: number;
  };
}

describe('cbjsContext', { concurrent: true }, () => {
  describe('context access', () => {
    beforeAll((suite) => {
      expect(getAsyncContext().task.name).toEqual(suite.name);

      setAsyncContext({
        testValue: 1,
        keyspaceIsolationScope: 'per-suite',
      });
    });

    beforeEach(async ({ task, expect }) => {
      expect(getAsyncContext().task.name).toEqual(task.name);
      expect(getAsyncContext().testValue).toEqual(1);
      expect(getAsyncContext().keyspaceIsolationScope).toEqual('per-suite');

      setAsyncContext({
        keyspaceIsolationScope: false,
      });
    });

    test('the first test task should access the right context', async function ({
      task,
      expect,
    }) {
      expect(getAsyncContext()).toBeDefined();
      expect(getAsyncContext().task.name).toEqual(task.name);
      expect(getAsyncContext().keyspaceIsolationScope).toBe(false);
      expect(getAsyncContext().testValue).toEqual(1);

      // Artificially make the test async
      await setImmediate();
    });

    test('the second test task should access the right context', async function ({
      task,
      expect,
    }) {
      expect(getAsyncContext()).toBeDefined();
      expect(getAsyncContext().task.name).toEqual(task.name);
      expect(getAsyncContext().keyspaceIsolationScope).toBe(false);
      expect(getAsyncContext().testValue).toEqual(1);

      // Artificially make the test async
      await setImmediate();
    });
  });

  describe('context inheritance', () => {
    beforeAll(() => {
      setAsyncContext({
        testValue: 1,
        keyspaceIsolationScope: 'per-suite',
      });
    });

    describe('inner suite without context overwrite', () => {
      beforeAll(() => {
        expect(getAsyncContext().testValue).toEqual(1);
      });

      beforeEach(() => {
        expect(getAsyncContext().testValue).toEqual(1);
      });

      test('should inherit outer suite context', () => {
        expect(getAsyncContext().testValue).toEqual(1);
      });
    });
  });

  describe('context merging', () => {
    beforeAll(() => {
      setAsyncContext({
        keyspaceIsolationScope: 'per-suite',
      });
    });

    describe('inner suite with updated context', () => {
      beforeAll(() => {
        expect(getAsyncContext().testValue).toBeUndefined();
        expect(getAsyncContext().keyspaceIsolationScope).toBe('per-suite');

        setAsyncContext({
          testValue: 4,
          keyspaceIsolationScope: false,
        });
      });

      test('should merge and overwrite outer suite context', () => {
        expect(getAsyncContext().testValue).toEqual(4);
        expect(getAsyncContext().keyspaceIsolationScope).toBe(false);
      });

      describe('deeper suite', () => {
        beforeAll(() => {
          expect(getAsyncContext().testValue).toEqual(4);
          expect(getAsyncContext().keyspaceIsolationScope).toBe(false);

          setAsyncContext({
            testValue: 5,
          });
        });

        test('context should be merged top down', () => {
          expect(getAsyncContext().testValue).toEqual(5);
          expect(getAsyncContext().keyspaceIsolationScope).toBe(false);
        });
      });
    });
  });
});
