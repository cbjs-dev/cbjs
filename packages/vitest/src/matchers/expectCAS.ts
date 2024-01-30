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
import { expect } from 'vitest';

import { CouchbaseCas } from '@cbjs/cbjs';

expect.extend({
  toBeNonZeroCAS(received) {
    const { isNot } = this;
    const failure = {
      message: () =>
        `expected ${received} ${isNot ? 'to not be' : 'to be'} a Non-Zero CAS`,
      pass: false,
    };

    if (typeof received !== 'object' || received.toJSON === undefined || received.toString === undefined) {
      return failure;
    }

    if (CouchbaseCas.isZeroCas(received)) {
      return failure;
    }

    return {
      message: () => `Non-Zero CAS`,
      pass: true,
    };
  },

  toBeZeroCAS(received) {
    const { isNot } = this;
    const failure = {
      message: () => `expected ${received} ${isNot ? 'to not be' : 'to be'} a Zero CAS`,
      pass: false,
    };

    if (typeof received !== 'object' || received.toJSON === undefined || received.toString === undefined) {
      return failure;
    }

    if (!CouchbaseCas.isZeroCas(received)) {
      return failure;
    }

    return {
      message: () => `Zero CAS`,
      pass: true,
    };
  },
});

export interface ExpectCAS<R = unknown> {
  toBeNonZeroCAS(): R;
  toBeZeroCAS(): R;
}