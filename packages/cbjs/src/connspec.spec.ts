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
import { describe, it } from 'vitest';

import { invariant } from '@cbjs/shared';

import { PasswordAuthenticator } from './authenticators';
import { ConnSpec } from './connspec';

describe.shuffle('ConnSpec', function () {
  describe('stringify', function () {
    it('should stringify a connstr spec', function ({ expect }) {
      const x = new ConnSpec({
        scheme: 'https',
        hosts: [
          ['1.1.1.1', 8094],
          ['2.2.2.2', 8099],
        ],
        bucket: 'frank',
        options: {
          joe: 'bob',
          jane: 'drew',
        },
      }).toString();

      expect(x).toEqual('https://1.1.1.1:8094,2.2.2.2:8099/frank?joe=bob&jane=drew');
    });

    it('should stringify a connstr spec without a scheme', function ({ expect }) {
      const x = new ConnSpec({
        hosts: [['1.1.1.1', 8094]],
        bucket: 'frank',
        options: {
          x: 'y',
        },
      }).toString();
      expect(x).toEqual('couchbase://1.1.1.1:8094/frank?x=y');
    });

    it('should stringify a connstr spec without a bucket', function ({ expect }) {
      const x = new ConnSpec({
        scheme: 'http',
        hosts: [['1.1.1.1', 8094]],
        options: {
          x: 'y',
        },
      }).toString();
      expect(x).toEqual('http://1.1.1.1:8094?x=y');
    });

    it('should stringify a connstr spec without options', function ({ expect }) {
      const x = new ConnSpec({
        scheme: 'http',
        hosts: [['1.1.1.1', 8094]],
        bucket: 'joe',
      }).toString();
      expect(x).toEqual('http://1.1.1.1:8094/joe');
    });

    it('should stringify a connstr spec with ipv6 addresses', function ({ expect }) {
      const x = new ConnSpec({
        scheme: 'couchbase',
        hosts: [['[2001:4860:4860::8888]', 8094]],
        bucket: 'joe',
      }).toString();
      expect(x).toEqual('couchbase://[2001:4860:4860::8888]:8094/joe');
    });

    it('should correctly stringify a connstr spec with sasl_mech_force', function ({
      expect,
    }) {
      const x = new ConnSpec({
        scheme: 'couchbase',
        hosts: [['localhost', 0]],
        bucket: '',
        options: {
          sasl_mech_force: 'PLAIN',
        },
      }).toString();
      expect(x).toEqual('couchbase://localhost?sasl_mech_force=PLAIN');
    });

    it('should correctly stringify a connstr spec with allowed_sasl_mechanisms', function ({
      expect,
    }) {
      const x = new ConnSpec({
        scheme: 'couchbase',
        hosts: [['localhost', 0]],
        bucket: '',
        options: {
          allowed_sasl_mechanisms: 'PLAIN',
        },
      }).toString();
      expect(x).toEqual('couchbase://localhost?allowed_sasl_mechanisms=PLAIN');
    });
  });

  describe('parse', function () {
    it('should generate a blank spec for a blank string', function ({ expect }) {
      const x = ConnSpec.parse('');
      expect(x).toEqual({
        scheme: 'couchbase',
        hosts: [['localhost', 0]],
        bucket: '',
        options: {},
      });
    });

    it('should not parse a string with no host', function ({ expect }) {
      expect(() => {
        ConnSpec.parse('https:///shirley');
      }).toThrowError();
    });

    it('should parse a string with options', function ({ expect }) {
      const x = ConnSpec.parse('http://a/b?c=d&e=f');
      expect(x).toEqual({
        scheme: 'http',
        hosts: [['a', 0]],
        bucket: 'b',
        options: {
          c: 'd',
          e: 'f',
        },
      });
    });

    it('should parse a string with ipv6', function ({ expect }) {
      const x = ConnSpec.parse('couchbase://[2001:4860:4860::8888]:9011/b');
      expect(x).toEqual({
        scheme: 'couchbase',
        hosts: [['[2001:4860:4860::8888]', 9011]],
        bucket: 'b',
        options: {},
      });
    });

    it('should parse a string sasl_mech_force in options', function ({ expect }) {
      const x = ConnSpec.parse('couchbase://localhost?sasl_mech_force=PLAIN');
      expect(x).toEqual({
        scheme: 'couchbase',
        hosts: [['localhost', 0]],
        bucket: '',
        options: {
          sasl_mech_force: 'PLAIN',
        },
      });
    });

    it('should parse a multiple strings in sasl_mech_force in options', function ({
      expect,
    }) {
      const x = ConnSpec.parse(
        'couchbase://localhost?sasl_mech_force=SCRAM-SHA512&sasl_mech_force=SCRAM-SHA256'
      );
      expect(x).toEqual({
        scheme: 'couchbase',
        hosts: [['localhost', 0]],
        bucket: '',
        options: {
          sasl_mech_force: ['SCRAM-SHA512', 'SCRAM-SHA256'],
        },
      });
    });

    it('should parse a string allowed_sasl_mechanisms in options', function ({ expect }) {
      const x = ConnSpec.parse('couchbase://localhost?allowed_sasl_mechanisms=PLAIN');
      expect(x).toEqual({
        scheme: 'couchbase',
        hosts: [['localhost', 0]],
        bucket: '',
        options: {
          allowed_sasl_mechanisms: 'PLAIN',
        },
      });
    });

    it('should parse a multiple strings in allowed_sasl_mechanisms in options', function ({
      expect,
    }) {
      const x = ConnSpec.parse(
        'couchbase://localhost?allowed_sasl_mechanisms=SCRAM-SHA512&allowed_sasl_mechanisms=SCRAM-SHA256'
      );
      expect(x).toEqual({
        scheme: 'couchbase',
        hosts: [['localhost', 0]],
        bucket: '',
        options: {
          allowed_sasl_mechanisms: ['SCRAM-SHA512', 'SCRAM-SHA256'],
        },
      });
    });
  });

  describe('#passwordauthenticator', function () {
    it('Should have empty allowed_sasl_mechanisms by default', function ({ expect }) {
      const authenticator = new PasswordAuthenticator('user', 'password');
      expect(authenticator.allowed_sasl_mechanisms).toBeUndefined();
    });

    it('should only enable PLAIN when ldap compatible', function ({ expect }) {
      const authenticator = PasswordAuthenticator.ldapCompatible('user', 'password');

      expect(authenticator.allowed_sasl_mechanisms?.length).toStrictEqual(1);

      invariant(authenticator.allowed_sasl_mechanisms);
      expect(authenticator.allowed_sasl_mechanisms[0]).toEqual('PLAIN');
    });
  });
});
