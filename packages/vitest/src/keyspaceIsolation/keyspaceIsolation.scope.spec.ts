/* eslint-disable no-restricted-imports */
import { beforeAll, beforeEach, describe, expect, test } from 'vitest';

import { getKeyspaceIsolation } from './getKeyspaceIsolation';
import { KeyspaceIsolationMap } from './KeyspaceIsolationMap';
import { setKeyspaceIsolation } from './setKeyspaceIsolation';

/* eslint-disable no-restricted-imports */

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

describe('keyspace isolation scope', () => {
  describe('undefined keyspace isolation', () => {
    beforeAll(() => {
      expect(getKeyspaceIsolation()).toHaveProperty('level', 'collection');
      expect(getKeyspaceIsolation()).toHaveProperty('scope', false);
      expect(getKeyspaceIsolation()).toHaveProperty('map', null);
    });

    test('inherited undefined isolation map', () => {
      expect(getKeyspaceIsolation()).toHaveProperty('level', 'collection');
      expect(getKeyspaceIsolation()).toHaveProperty('scope', false);
      expect(getKeyspaceIsolation()).toHaveProperty('map', null);
    });
  });

  describe('suite keyspace isolation scope: local', () => {
    let rootSuiteIsolationMap: KeyspaceIsolationMap | null = null;

    beforeAll(() => {
      setKeyspaceIsolation('local');

      expect(getKeyspaceIsolation()).toHaveProperty('level', 'collection');
      expect(getKeyspaceIsolation()).toHaveProperty('scope', 'local');
      expect(getKeyspaceIsolation().map).toBeInstanceOf(KeyspaceIsolationMap);

      rootSuiteIsolationMap = getKeyspaceIsolation().map;
    });

    test('test should have the same isolation map object as the direct parent', () => {
      expect(getKeyspaceIsolation().map).not.toBeNull();
      expect(getKeyspaceIsolation().map).toBe(rootSuiteIsolationMap);
    });

    describe('child suite', () => {
      beforeAll(() => {
        expect(getKeyspaceIsolation()).toHaveProperty('level', 'collection');
        expect(getKeyspaceIsolation()).toHaveProperty('scope', 'local');
        expect(getKeyspaceIsolation().map).toBeInstanceOf(KeyspaceIsolationMap);
        expect(getKeyspaceIsolation().map).toBe(rootSuiteIsolationMap);
      });

      beforeEach(() => {
        expect(getKeyspaceIsolation().map).not.toBeNull();
        expect(getKeyspaceIsolation().map).toBe(rootSuiteIsolationMap);
        expect(getKeyspaceIsolation().map).toBeInstanceOf(KeyspaceIsolationMap);
      });

      test('test should have the same isolation map object as the direct parent suite', () => {
        expect(getKeyspaceIsolation().map).not.toBeNull();
        expect(getKeyspaceIsolation().map).toBeInstanceOf(KeyspaceIsolationMap);
        expect(getKeyspaceIsolation().map).toBe(rootSuiteIsolationMap);
      });

      test('test can overwrite the isolation scope', () => {
        setKeyspaceIsolation('per-test');

        expect(getKeyspaceIsolation().map).not.toBeNull();
        expect(getKeyspaceIsolation().map).toBeInstanceOf(KeyspaceIsolationMap);
        expect(getKeyspaceIsolation().map).not.toBe(rootSuiteIsolationMap);
      });
    });

    describe('another child suite', () => {
      beforeAll(() => {
        expect(getKeyspaceIsolation()).toHaveProperty('level', 'collection');
        expect(getKeyspaceIsolation()).toHaveProperty('scope', 'local');
        expect(getKeyspaceIsolation().map).toBeInstanceOf(KeyspaceIsolationMap);
        expect(getKeyspaceIsolation().map).toBe(rootSuiteIsolationMap);
      });

      beforeEach(() => {
        expect(getKeyspaceIsolation().map).not.toBeNull();
        expect(getKeyspaceIsolation().map).toBe(rootSuiteIsolationMap);
        expect(getKeyspaceIsolation().map).toBeInstanceOf(KeyspaceIsolationMap);
      });

      test('test should have the same isolation map object as the direct parent suite', () => {
        expect(getKeyspaceIsolation().map).not.toBeNull();
        expect(getKeyspaceIsolation().map).toBeInstanceOf(KeyspaceIsolationMap);
        expect(getKeyspaceIsolation().map).toBe(rootSuiteIsolationMap);
      });
    });

    describe('child suite redefining a local scope', () => {
      let childSuiteLocalScopeMap: KeyspaceIsolationMap | null = null;

      beforeAll(() => {
        setKeyspaceIsolation('local');

        expect(getKeyspaceIsolation()).toHaveProperty('level', 'collection');
        expect(getKeyspaceIsolation()).toHaveProperty('scope', 'local');
        expect(getKeyspaceIsolation().map).toBeInstanceOf(KeyspaceIsolationMap);
        expect(getKeyspaceIsolation().map).not.toBe(rootSuiteIsolationMap);

        childSuiteLocalScopeMap = getKeyspaceIsolation().map;
      });

      beforeEach(() => {
        expect(getKeyspaceIsolation().map).not.toBeNull();
        expect(getKeyspaceIsolation().map).toBe(childSuiteLocalScopeMap);
        expect(getKeyspaceIsolation().map).toBeInstanceOf(KeyspaceIsolationMap);
      });

      test('test should have the same isolation map object as the direct parent suite', () => {
        expect(getKeyspaceIsolation().map).not.toBeNull();
        expect(getKeyspaceIsolation().map).toBeInstanceOf(KeyspaceIsolationMap);
        expect(getKeyspaceIsolation().map).toBe(childSuiteLocalScopeMap);
      });
    });
  });

  describe('suite keyspace isolation scope: per-suite', () => {
    let rootSuiteIsolationMap: KeyspaceIsolationMap | null = null;
    let childSuiteIsolationMap: KeyspaceIsolationMap | null = null;
    let anotherChildSuiteIsolationMap: KeyspaceIsolationMap | null = null;

    beforeAll(() => {
      setKeyspaceIsolation('per-suite');

      expect(getKeyspaceIsolation()).toHaveProperty('level', 'collection');
      expect(getKeyspaceIsolation()).toHaveProperty('scope', 'per-suite');
      expect(getKeyspaceIsolation().map).toBeInstanceOf(KeyspaceIsolationMap);

      rootSuiteIsolationMap = getKeyspaceIsolation().map;
    });

    test('test should have the same isolation map object as the direct parent', () => {
      expect(getKeyspaceIsolation().map).not.toBeNull();
      expect(getKeyspaceIsolation().map).toBe(rootSuiteIsolationMap);
    });

    describe('child suite', () => {
      beforeAll(() => {
        setKeyspaceIsolation('per-suite');

        expect(getKeyspaceIsolation()).toHaveProperty('level', 'collection');
        expect(getKeyspaceIsolation()).toHaveProperty('scope', 'per-suite');
        expect(getKeyspaceIsolation().map).toBeInstanceOf(KeyspaceIsolationMap);
        expect(getKeyspaceIsolation().map).not.toBe(rootSuiteIsolationMap);

        childSuiteIsolationMap = getKeyspaceIsolation().map;
      });

      beforeEach(() => {
        expect(getKeyspaceIsolation().map).not.toBeNull();
        expect(getKeyspaceIsolation().map).toBe(childSuiteIsolationMap);
        expect(getKeyspaceIsolation().map).toBeInstanceOf(KeyspaceIsolationMap);
      });

      test('test should have the same isolation map object as the direct parent suite', () => {
        expect(getKeyspaceIsolation().map).not.toBeNull();
        expect(getKeyspaceIsolation().map).toBeInstanceOf(KeyspaceIsolationMap);
        expect(getKeyspaceIsolation().map).toBe(childSuiteIsolationMap);
      });

      test('test can overwrite the isolation scope', () => {
        setKeyspaceIsolation('per-test');

        expect(getKeyspaceIsolation().map).not.toBeNull();
        expect(getKeyspaceIsolation().map).toBeInstanceOf(KeyspaceIsolationMap);
        expect(getKeyspaceIsolation().map).not.toBe(childSuiteIsolationMap);
      });
    });

    describe('another child suite', () => {
      beforeAll(() => {
        setKeyspaceIsolation('per-suite');

        expect(getKeyspaceIsolation()).toHaveProperty('level', 'collection');
        expect(getKeyspaceIsolation()).toHaveProperty('scope', 'per-suite');
        expect(getKeyspaceIsolation().map).toBeInstanceOf(KeyspaceIsolationMap);
        expect(getKeyspaceIsolation().map).not.toBe(rootSuiteIsolationMap);
        expect(getKeyspaceIsolation().map).not.toBe(childSuiteIsolationMap);

        anotherChildSuiteIsolationMap = getKeyspaceIsolation().map;
      });

      beforeEach(() => {
        expect(getKeyspaceIsolation().map).not.toBeNull();
        expect(getKeyspaceIsolation().map).toBe(anotherChildSuiteIsolationMap);
        expect(getKeyspaceIsolation().map).toBeInstanceOf(KeyspaceIsolationMap);
      });

      test('test should have the same isolation map object as the direct parent suite', () => {
        expect(getKeyspaceIsolation().map).not.toBeNull();
        expect(getKeyspaceIsolation().map).toBeInstanceOf(KeyspaceIsolationMap);
        expect(getKeyspaceIsolation().map).toBe(anotherChildSuiteIsolationMap);
      });
    });
  });

  describe('suite keyspace isolation scope: per test', () => {
    beforeAll(() => {
      setKeyspaceIsolation('per-test');

      expect(getKeyspaceIsolation()).toHaveProperty('level', 'collection');
      expect(getKeyspaceIsolation()).toHaveProperty('scope', 'per-test');
      expect(getKeyspaceIsolation().map).toBeNull();
    });

    beforeEach(() => {
      expect(getKeyspaceIsolation().map).not.toBeNull();
      // toBeInstanceOf does not work as expected ; weird;
      expect(getKeyspaceIsolation().map).toHaveProperty('isolateBucketName');
    });

    test('test should have its own isolation map object', () => {
      expect(getKeyspaceIsolation().map).not.toBeNull();
      expect(getKeyspaceIsolation().map).toHaveProperty('isolateBucketName');
    });
  });
});
