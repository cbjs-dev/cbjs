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

import { arrayLastElement } from './arrayLastElement.js';

describe('arrayLastElement', () => {
  it('should return the type of the last element of a tuple', () => {
    expectTypeOf(arrayLastElement(['a', 1])).toEqualTypeOf<1>();
  });

  it('should return the type of the last element of each tuple of a union', () => {
    const arr: [bar: string] | [foo: number, bar: string] = ['hi'];
    expectTypeOf(arrayLastElement(arr)).toEqualTypeOf<string>();
  });

  it('should return the trailing type of an array with unknown length', () => {
    expectTypeOf(arrayLastElement([1, 2, 3] as number[])).toEqualTypeOf<number>();
    expectTypeOf(arrayLastElement(['a', 2, 3] as [string, ...number[]])).toEqualTypeOf<
      string | number
    >();
  });
});
