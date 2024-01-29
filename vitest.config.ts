import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    workspace: './vitest.workspace.ts',
    pool: 'forks',
    minWorkers: 1,
    maxWorkers: 1,
    env: {
      CONNECTION_STRING: process.env.CB_CONNECTION_STRING || 'couchbase://localhost',
      USER: process.env.CB_USER || 'Administrator',
      PASSWORD: process.env.CB_PASSWORD || 'password',
      DEBUG: '1',
      LOG_LEVEL: 'info',
    },
  },
});
