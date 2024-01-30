import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    workspace: './vitest.workspace.ts',
    pool: 'forks',
    minWorkers: 1,
    maxWorkers: 1,
    env: {
      CB_CONNECTION_STRING: process.env.CB_CONNECTION_STRING || 'couchbase://localhost',
      CB_USER: process.env.CB_USER || 'Administrator',
      CB_PASSWORD: process.env.CB_PASSWORD || 'password',
      DEBUG: '1',
      LOG_LEVEL: 'info',
    },
  },
});
