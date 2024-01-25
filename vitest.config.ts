import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    workspace: './vitest.workspace.ts',
    minWorkers: 1,
    maxWorkers: 1,
    env: {
      CONNECTION_STRING: 'couchbase://localhost',
      USER: 'Administrator',
      PASSWORD: 'password',
      DEBUG: '1',
      LOG_LEVEL: 'info',
    },
  },
});
