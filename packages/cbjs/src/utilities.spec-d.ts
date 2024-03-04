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

import { NodeCallback, VoidNodeCallback } from './utilities';

declare function giveMeStringCallback(cb: NodeCallback<string>): void;
declare function giveMeStringCallback(cb: VoidNodeCallback): void;

describe('utilities', () => {
  describe('NodeCallback', () => {
    it('should accept a callback with a single argument Error | null', () => {
      giveMeStringCallback((err) => {
        expectTypeOf(err).toEqualTypeOf<Error | null>();
      });
    });

    it('should accept a second argument', () => {
      giveMeStringCallback((err, res) => {
        expectTypeOf(err).toEqualTypeOf<Error | null>();
        expectTypeOf(res).toEqualTypeOf<string | null>();
      });
    });

    it('should narrow the second argument after the Error has been guarded as null', () => {
      giveMeStringCallback((err, res) => {
        if (err) return;
        expectTypeOf(res).toEqualTypeOf<string>();
      });
    });
  });
});
