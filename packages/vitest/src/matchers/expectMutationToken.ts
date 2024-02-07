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

/* eslint-disable @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-argument */
// eslint-disable-next-line no-restricted-imports
import { expect } from 'vitest';

expect.extend({
  toBeMutationToken(received) {
    const { isNot, equals } = this;
    const failure = {
      message: () =>
        `expected ${received.to} ${isNot ? 'to not be' : 'to be'} a MutationToken`,
      pass: false,
    };

    if (typeof received !== 'object') {
      return failure;
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const token = received.toJSON?.();

    if (token === undefined) {
      return failure;
    }

    const pass =
      equals(typeof token.partition_uuid, 'string') &&
      equals(typeof token.sequence_number, 'string') &&
      equals(typeof token.partition_id, 'number') &&
      equals(typeof token.bucket_name, 'string');

    if (pass === false) return failure;

    return {
      message: () => `MutationToken`,
      pass: true,
    };
  },
});

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export interface ExpectMutationToken<R = unknown> {
  toBeMutationToken(): R;
}
