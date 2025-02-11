import { afterAll, afterEach, beforeAll, beforeEach } from 'vitest';

import { hasOwn } from '@cbjsdev/shared';
import {
  cleanupCouchbaseAfterAll,
  cleanupCouchbaseAfterEach,
  setTestLogger,
} from '@cbjsdev/vitest';

import { testLogger } from './setupLogger.js';

setTestLogger(testLogger);

beforeAll(async ({ file }) => {
  testLogger.info(`Executing test file: ${file.filepath}`);
});

beforeEach(({ onTestFailed }) => {
  onTestFailed(({ task }) => {
    const errors = task.result?.errors?.map((e) => {
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
