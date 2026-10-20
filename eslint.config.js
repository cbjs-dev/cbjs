/*
 * Copyright (c) 2023-Present Jonathan MASSUCHETTI <jonathan.massuchetti@dappit.fr>.
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
import js from '@eslint/js';
import vitest from '@vitest/eslint-plugin';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const cyclicDependencyMessage =
  'This will created a cyclic dependency. You should probably move the module to @cbjsdev/shared instead.';

export default defineConfig(
  globalIgnores(['**/dist/', '**/*.{mjs,cjs}']),
  js.configs.recommended,
  prettierRecommended,
  tseslint.configs.recommendedTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
      globals: globals.node,
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
        project: [
          './tsconfig.json',
          './packages/*/tsconfig.json',
          './tests/*/tsconfig.json',
        ],
      },
    },
    plugins: { vitest },
    rules: {
      'prettier/prettier': 'warn',
      '@typescript-eslint/array-type': 'off',
      '@typescript-eslint/require-await': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      '@typescript-eslint/restrict-template-expressions': 'off',
      '@typescript-eslint/consistent-indexed-object-style': 'off',
      '@typescript-eslint/no-base-to-string': 'off',
      '@typescript-eslint/unbound-method': 'off',
      '@typescript-eslint/non-nullable-type-assertion-style': 'off',
      '@typescript-eslint/consistent-type-definitions': ['warn', 'type'],
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          vars: 'local',
          args: 'none',
          caughtErrors: 'none',
          ignoreRestSiblings: false,
        },
      ],
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'vitest',
              importNames: ['expect'],
              message: 'Use the `expect` from the test context instead.',
            },
          ],
        },
      ],
      // Added or tightened by typescript-eslint 8 and ESLint 10. They flag code mirrored
      // from couchnode (e.g. rejecting with the raw CppError), so they only warn.
      'no-useless-assignment': 'warn',
      '@typescript-eslint/await-thenable': 'warn',
      '@typescript-eslint/no-duplicate-type-constituents': 'warn',
      '@typescript-eslint/no-empty-object-type': 'warn',
      '@typescript-eslint/no-misused-promises': 'warn',
      '@typescript-eslint/no-unnecessary-type-assertion': 'warn',
      '@typescript-eslint/no-unsafe-enum-comparison': 'warn',
      '@typescript-eslint/no-unused-expressions': 'warn',
      '@typescript-eslint/only-throw-error': 'warn',
      '@typescript-eslint/prefer-includes': 'warn',
      '@typescript-eslint/prefer-nullish-coalescing': 'warn',
      '@typescript-eslint/prefer-promise-reject-errors': 'warn',
    },
  },
  {
    files: ['packages/http-client/**'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            { name: '@cbjsdev/cbjs', message: cyclicDependencyMessage },
            { name: '@cbjsdev/vitest', message: cyclicDependencyMessage },
          ],
        },
      ],
    },
  },
  {
    files: ['packages/shared/**'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            { group: ['@cbjsdev/cbjs/*'], message: cyclicDependencyMessage },
            { group: ['@cbjsdev/http-client'], message: cyclicDependencyMessage },
            { group: ['@cbjsdev/vitest'], message: cyclicDependencyMessage },
          ],
        },
      ],
    },
  },
  {
    files: ['tests/**'],
    rules: {
      'no-undef': 'off',
    },
  }
);
