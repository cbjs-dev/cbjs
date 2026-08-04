/*
 * Copyright (c) 2024-Present Jonathan MASSUCHETTI.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { defineProject } from 'vitest/config';

/**
 * Vitest 4 only forwards an allowlist of CLI options to project configs, and `typecheck`
 * is not part of it. Project configs are loaded in the CLI process, so we read the flag
 * ourselves to keep `vitest --typecheck run` working from the workspace root.
 */
const typecheckEnabled = process.argv.some(
  (arg) => arg === '--typecheck' || arg.startsWith('--typecheck.')
);

export default defineProject({
  test: {
    include: ['**/*.spec.ts'],
    typecheck: {
      enabled: typecheckEnabled,
    },
    environment: 'node',
    restoreMocks: true,
    mockReset: true,
    unstubGlobals: true,
    unstubEnvs: true,
    sequence: {
      setupFiles: 'list',
      hooks: 'stack',
    },
  },
});
