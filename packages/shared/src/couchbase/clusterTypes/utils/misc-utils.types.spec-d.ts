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
import { describe, expectTypeOf, it } from 'vitest';

import { CaptureUntil, Split } from '../../../misc/index.js';
import { Json } from '../document.types.js';

describe('Split', function () {
  it('should return a tuple with an empty string if the string is empty', function () {
    expectTypeOf<Split<'', '.', '`'>>().toEqualTypeOf<['']>();
  });

  it('should return a tuple with two empty strings if the string solely contain the delimiter', function () {
    expectTypeOf<Split<'.', '.', '`'>>().toEqualTypeOf<['', '']>();
  });

  it('should return a tuple with all the chunks', function () {
    expectTypeOf<Split<'foo.bar', '.', '`'>>().toEqualTypeOf<['foo', 'bar']>();
    expectTypeOf<Split<'foo.`bar`', '.', '`'>>().toEqualTypeOf<['foo', '`bar`']>();
    expectTypeOf<Split<'foo.bar', '/', '`'>>().toEqualTypeOf<['foo.bar']>();
  });

  it('should not split a sub-string if it is surrounded by the literal wrapper char', function () {
    expectTypeOf<Split<'`do.not.split`', '.', '`'>>().toEqualTypeOf<['`do.not.split`']>();
    expectTypeOf<Split<'foo.`do.not.split`.bar', '.', '`'>>().toEqualTypeOf<
      ['foo', '`do.not.split`', 'bar']
    >();
  });
});

describe('CaptureUntil', function () {
  it('should capture the substring until the delimiter is found', function () {
    expectTypeOf<CaptureUntil<'foo', '.', '`'>>().toEqualTypeOf<'foo'>();
    expectTypeOf<CaptureUntil<'foo.bar', '.', '`'>>().toEqualTypeOf<'foo'>();
    expectTypeOf<CaptureUntil<'.bar', '.', '`'>>().toEqualTypeOf<''>();
  });

  it('should capture the substring with the escaping chars', function () {
    expectTypeOf<CaptureUntil<'`foo`.bar', '.', '`'>>().toEqualTypeOf<'`foo`'>();
  });

  it('should ignore the delimiter if located inside two escaping chars', function () {
    expectTypeOf<CaptureUntil<'yo`foo`.bar', '.', '`'>>().toEqualTypeOf<'yo`foo`'>();
    expectTypeOf<CaptureUntil<'`foo`lo.bar', '.', '`'>>().toEqualTypeOf<'`foo`lo'>();
    expectTypeOf<CaptureUntil<'yo`foo`lo.bar', '.', '`'>>().toEqualTypeOf<'yo`foo`lo'>();
  });
});
