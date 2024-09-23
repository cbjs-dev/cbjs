import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    workspace: './vitest.workspace.ts',
    pool: 'threads',
    minWorkers: 1,
    maxWorkers: 1,
    sequence: {
      setupFiles: 'list',
      hooks: 'stack',
    },
    reporters: ['default', 'html'],
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
