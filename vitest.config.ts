import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    projects: ['packages/*/vitest.config.ts', 'tests/*/vitest.config.ts'],
    pool: 'forks',
    maxWorkers: 1,
    slowTestThreshold: 5_000,
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
