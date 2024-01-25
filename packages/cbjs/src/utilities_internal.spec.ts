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

import { describe, expectTypeOf, it } from 'vitest';

import { toEnumMember } from './utilities_internal';

describe('utilities internal', function () {
  enum StringEnum {
    A = 'a',
    B = 'b',
  }

  enum NumberEnum {
    Zero,
    One,
  }

  it('should return the given value', function ({ expect }) {
    expect(toEnumMember(StringEnum, 'a')).toEqual('a');
    expect(toEnumMember(NumberEnum, 0)).toEqual(0);
  });

  it('should passthrough if the value is nullish', function ({ expect }) {
    expect(toEnumMember(StringEnum, undefined)).toEqual(undefined);
    expect(toEnumMember(StringEnum, null)).toEqual(null);
    expect(toEnumMember(NumberEnum, undefined)).toEqual(undefined);
    expect(toEnumMember(NumberEnum, null)).toEqual(null);
  });

  it('should throw if the value is not found', function ({ expect }) {
    expect(() => toEnumMember(StringEnum, 0)).toThrowError();
    expect(() => toEnumMember(StringEnum, 'doesNotExist')).toThrowError();
    expect(() => toEnumMember(NumberEnum, 99)).toThrowError();
    expect(() => toEnumMember(NumberEnum, 'doesNotExist')).toThrowError();
  });

  it('should have a return the value as a member of the given enum when non-nullish', function () {
    expectTypeOf(toEnumMember(StringEnum, 'a')).toEqualTypeOf(StringEnum.A);
    expectTypeOf(toEnumMember(NumberEnum, 0)).toEqualTypeOf(NumberEnum.Zero);
  });

  it('should have a return the value as self type when nullish', function () {
    expectTypeOf(toEnumMember(StringEnum, undefined)).toEqualTypeOf(undefined);
    expectTypeOf(toEnumMember(NumberEnum, null)).toEqualTypeOf(null);
  });
});
