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

import { arrayFirstElement } from './arrayFirstElement';

describe('arrayFirstElement', () => {
  it('should return the type of the first element of a tuple', () => {
    expectTypeOf(arrayFirstElement(['a', 1])).toEqualTypeOf<'a'>();
  });

  it('should return the trailing type of an array with unknown length', () => {
    expectTypeOf(arrayFirstElement([1, 2, 3] as number[])).toEqualTypeOf<number>();
    expectTypeOf(
      arrayFirstElement(['a', 2, 3] as [string, ...number[]])
    ).toEqualTypeOf<string>();
    expectTypeOf(
      arrayFirstElement([1, 2, 'a'] as [...number[], string])
    ).toEqualTypeOf<number>();
  });
});