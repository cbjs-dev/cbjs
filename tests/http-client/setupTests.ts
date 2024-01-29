import { getApiConfig, getConnectionParams, hasOwn } from '@cbjs/shared';
import {
  cleanupCouchbaseAfterAll,
  cleanupCouchbaseAfterEach,
  setTestLogger,
} from '@cbjs/vitest';
import { afterAll, afterEach, beforeAll, beforeEach } from 'vitest';

import { testLogger } from './setupLogger';
import { initTestCluster } from './utils/initTestCluster';

setTestLogger(testLogger);

export const connectionParams = getConnectionParams();
export const apiConfig = getApiConfig();

beforeAll(async ({ filepath }) => {
  testLogger.info(`Executing test file: ${filepath}`);
  await initTestCluster();
}, 60_000);

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
