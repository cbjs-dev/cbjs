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

import { CouchbaseCas } from './CouchbaseCas';

describe('CouchbaseCas', () => {
  it('should be able to create a CAS 0', ({ expect }) => {
    const cas = CouchbaseCas.from('0');
    expect(cas.toString()).toEqual('0');
    expect(cas.toJSON()).toEqual('0');
  });

  it('should be able to create a non-zero CAS from a string', ({ expect }) => {
    const cas = CouchbaseCas.from('1701642881274413056');
    expect(cas.toString()).toEqual('1701642881274413056');
    expect(cas.toJSON()).toEqual('1701642881274413056');
  });

  it('should be able to create a non-zero CAS from a bigint', ({ expect }) => {
    const cas = CouchbaseCas.from(1701642881274413056n);
    expect(cas.toString()).toEqual('1701642881274413056');
    expect(cas.toJSON()).toEqual('1701642881274413056');
  });

  it('should be able to create a non-zero CAS from a number', ({ expect }) => {
    const cas = CouchbaseCas.from(100);
    expect(cas.toString()).toEqual('100');
    expect(cas.toJSON()).toEqual('100');
  });

  // While it should be an implementation detail, the NAPI bindings rely on it.
  it('should have a `raw` property', ({ expect }) => {
    expect(CouchbaseCas.from(0)).toHaveProperty('raw');
  });
});
