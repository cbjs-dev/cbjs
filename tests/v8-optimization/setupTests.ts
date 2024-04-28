import { afterAll, afterEach, beforeAll, beforeEach } from 'vitest';

import { getApiConfig, hasOwn } from '@cbjsdev/shared';
import {
  cleanupCouchbaseAfterAll,
  cleanupCouchbaseAfterEach,
  setVitestLogger,
} from '@cbjsdev/vitest';

import { testLogger } from './setupLogger.js';

setVitestLogger(testLogger);

export const apiConfig = getApiConfig();

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

afterEach(async () => {
  await cleanupCouchbaseAfterEach();
});

afterAll(async () => {
  await cleanupCouchbaseAfterAll();
});
