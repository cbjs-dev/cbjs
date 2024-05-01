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

import { isArray } from './isArray.js';

describe('isArray', () => {
  it('should narrow the type of unknown to unknown[]', () => {
    const arr = 'hi' as unknown;

    if (isArray(arr)) {
      expectTypeOf(arr).toEqualTypeOf<unknown[]>();
    }
  });

  it('should narrow the type of any to any[]', () => {
    const arr = 'hi' as any;

    if (isArray(arr)) {
      expectTypeOf(arr).toEqualTypeOf<any[]>();
    }
  });

  it('should narrow a union down to types that are arrays', () => {
    const arr0 = [1, 2, 3] as Record<string, unknown> | number[];

    if (isArray(arr0)) {
      expectTypeOf(arr0).toEqualTypeOf<number[]>();
    }

    const arr1 = [1, 2, 3] as Record<string, unknown> | number[] | string[];

    if (isArray(arr1)) {
      expectTypeOf(arr1).toEqualTypeOf<number[] | string[]>();
    }

    const arr2 = [1, 2, 3] as Record<string, unknown> | readonly [1, 2, 3];

    if (isArray(arr2)) {
      expectTypeOf(arr2).toEqualTypeOf<readonly [1, 2, 3]>();
    }
  });
});
