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
import { describe, it } from 'vitest';

import { CouchbaseCas } from '@cbjsdev/cbjs';

import './expectCAS';

describe('toBeZeroCas', () => {
  it('should succeed when given a zero cas', ({ expect }) => {
    expect(CouchbaseCas.from(0)).toBeZeroCAS();
  });

  it.fails('should fail when given a non-zero cas', ({ expect }) => {
    expect(CouchbaseCas.from(1)).toBeZeroCAS();
  });

  it.fails('should fail when given a string', ({ expect }) => {
    expect('im not a 0 cas').toBeZeroCAS();
  });
});

describe('toBeNonZeroCas', () => {
  it('should succeed when given a non-zero cas', ({ expect }) => {
    expect(CouchbaseCas.from(1)).toBeNonZeroCAS();
  });

  it.fails('should fail when given a zero cas', ({ expect }) => {
    expect(CouchbaseCas.from(0)).toBeNonZeroCAS();
  });

  it.fails('should fail when given a string', ({ expect }) => {
    expect('im a non-zero cas').toBeNonZeroCAS();
  });
});
