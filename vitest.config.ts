import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    workspace: './vitest.workspace.ts',
    pool: 'threads',
    fileParallelism: false,
    minWorkers: 1,
    maxWorkers: 1,
    hookTimeout: 10_000,
    teardownTimeout: 10_000,
    disableConsoleIntercept: true,
    sequence: {
      setupFiles: 'list',
      hooks: 'stack',
    },
    env: {
      CB_CONNECTION_STRING: process.env.CB_CONNECTION_STRING ?? 'couchbase://localhost',
      CB_USER: process.env.CB_USER ?? 'Administrator',
      CB_PASSWORD: process.env.CB_PASSWORD ?? 'password',
      DEBUG: '1',
      LOG_LEVEL: 'info',
    },
    reporters: process.env.GITHUB_ACTIONS
      ? ['html', 'github-actions']
      : ['html', 'default'],
    outputFile: {
      html: './tests-report/index.html',
    },
    coverage: {
      provider: 'v8',
      reportsDirectory: './tests-report/coverage',
      reporter: ['html'],
    },
  },
});
