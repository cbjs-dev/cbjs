/*
 * Copyright (c) 2023-Present Jonathan MASSUCHETTI <jonathan.massuchetti@dappit.fr>.
 * Copyright (c) 2013-Present Couchbase Inc.
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

import { describe, test } from 'vitest';

import binding, { CppBinding } from './binding';

describe('binding', () => {
  test('error codes are unique', ({ expect }) => {
    const errorNamespaces: Array<keyof CppBinding> = [
      'errc_common',
      'errc_key_value',
      'errc_query',
      'errc_analytics',
      'errc_search',
      'errc_view',
      'errc_management',
      'errc_field_level_encryption',
      'errc_network',
    ];

    const codes: unknown[] = [];
    const duplicates: [string, unknown][] = [];

    errorNamespaces.forEach((ns) => {
      Object.entries(binding[ns]).forEach(([errKey, code]) => {
        if (codes.includes(code)) {
          duplicates.push([`${ns}.${errKey}`, code]);
          return;
        }
        codes.push(code);
      });
    });

    expect(
      duplicates,
      `Duplicate error code detected:\n${duplicates
        .map(([key, code]) => `${key}: '${code}'`)
        .join('\n')}`
    ).toHaveLength(0);
  });
});
