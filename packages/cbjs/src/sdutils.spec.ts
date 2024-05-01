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
import { describe, it } from 'vitest';

import { SdUtils } from './sdutils.js';

describe('sdutils', function () {
  it('should handle base properties', function ({ expect }) {
    expect(SdUtils.insertByPath(null, 'foo', 'test')).toEqual({
      foo: 'test',
    });
  });

  it('should handle nested properties', function ({ expect }) {
    expect(SdUtils.insertByPath(null, 'foo.bar', 'test')).toEqual({
      foo: {
        bar: 'test',
      },
    });
  });

  it('should handle arrays', function ({ expect }) {
    expect(SdUtils.insertByPath(null, 'foo[0]', 'test')).toEqual({
      foo: ['test'],
    });
  });
});
