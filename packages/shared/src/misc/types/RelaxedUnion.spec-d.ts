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

import { RelaxedUnion } from './RelaxedUnion';

describe('RelaxedUnion', () => {
  it('should return the given type when there is no union', () => {
    expectTypeOf<RelaxedUnion<{ title: string }>>().toEqualTypeOf<{ title: string }>();
  });

  it('should make non-shared properties optional', () => {
    expectTypeOf<
      RelaxedUnion<{ title: string } | { description: string }>
    >().toEqualTypeOf<{ title?: string; description?: string }>();
  });

  it('should make a union of shared properties', () => {
    expectTypeOf<RelaxedUnion<{ sales: number } | { sales: number[] }>>().toEqualTypeOf<{
      sales: number | number[];
    }>();
  });
});
