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

module.exports = {
  extends: ['../../.eslintrc.cjs'],
  env: {
    'browser': false,
    'es2022': false,
    'shared-node-browser': true,
  },
  rules: {
    'no-restricted-imports': [
      'error',
      {
        paths: [
          {
            name: '@cbjs/cbjs',
            message:
              'This will created a cyclic dependency. You should probably move the module to @cbjs/shared instead.',
          },
          {
            name: '@cbjs/vitest',
            message:
              'This will created a cyclic dependency. You should probably move the module to @cbjs/shared instead.',
          },
        ],
      },
    ],
  },
};
