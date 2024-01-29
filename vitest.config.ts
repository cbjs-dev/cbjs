import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    workspace: './vitest.workspace.ts',
    pool: 'forks',
    minWorkers: 1,
    maxWorkers: 1,
    env: {
      CONNECTION_STRING: 'couchbase://localhost',
      // CONNECTION_STRING: 'couchbase://host.docker.internal',
      USER: 'Administrator',
      PASSWORD: 'password',
      DEBUG: '1',
      LOG_LEVEL: 'info',
    },
  },
});
