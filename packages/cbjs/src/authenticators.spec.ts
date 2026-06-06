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
import { describe, expect, it } from 'vitest';

import {
  type Authenticator,
  CertificateAuthenticator,
  JwtAuthenticator,
  PasswordAuthenticator,
} from './authenticators.js';

describe('JwtAuthenticator', () => {
  it('stores the token it was constructed with', () => {
    const auth = new JwtAuthenticator('header.payload.signature');
    expect(auth.token).toBe('header.payload.signature');
  });

  it('is a valid member of the Authenticator union', () => {
    const authenticators: Authenticator[] = [
      new PasswordAuthenticator('user', 'pass'),
      new CertificateAuthenticator('/cert.pem', '/key.pem'),
      new JwtAuthenticator('token'),
    ];
    expect(authenticators[2]).toBeInstanceOf(JwtAuthenticator);
  });
});

describe('PasswordAuthenticator.ldapCompatible', () => {
  it('pins the PLAIN sasl mechanism (preserved through the mTLS credential refactor)', () => {
    const auth = PasswordAuthenticator.ldapCompatible('user', 'pass');
    expect(auth.username).toBe('user');
    expect(auth.password).toBe('pass');
    expect(auth.allowed_sasl_mechanisms).toEqual(['PLAIN']);
  });
});
