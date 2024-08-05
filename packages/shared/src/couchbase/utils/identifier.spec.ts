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
import { describe, expectTypeOf, it, test } from 'vitest';

import { DocDef, IsFuzzyDocument } from '../clusterTypes/index.js';
import { isValidBucketName, Keyspace, quotePath } from './identifier.js';

describe('isValidBucketName', () => {
  test('should return true with a valid identifier', ({ expect }) => {
    expect(isValidBucketName('valid')).toBeTruthy();
    expect(isValidBucketName('bond007')).toBeTruthy();
    expect(isValidBucketName('my.dad.text.like.that')).toBeTruthy();
    expect(isValidBucketName('30%_of_the_time-it.works.all.the.time')).toBeTruthy();
  });

  test('should return false with an invalid identifier', ({ expect }) => {
    expect(isValidBucketName('foo`bar')).toBeFalsy();
    expect(isValidBucketName('yo/lo')).toBeFalsy();
  });
});

type Doc<T extends string> = { [K in T]: string };

type UserClusterTypes = {
  BucketOne: {
    ScopeOne: {
      CollectionOne: [DocDef<string, Doc<'b1s1c1d1'>>, DocDef<string, Doc<'b1s1c1d2'>>];
      CollectionFour: [DocDef<string, Doc<'b1s1c4d1'>>, DocDef<string, Doc<'b1s1c4d2'>>];
    };
    ScopeTwo: {
      CollectionOne: [DocDef<string, Doc<'b1s2c1d1'>>, DocDef<string, Doc<'b1s2c1d2'>>];
      CollectionTwo: [DocDef<string, Doc<'b1s2c2d1'>>, DocDef<string, Doc<'b1s2c2d2'>>];
    };
  };
  BucketTwo: {
    ScopeOne: {
      CollectionSix: [DocDef<string, Doc<'b2s1c6d1'>>, DocDef<string, Doc<'b2s1c6d2'>>];
    };
    ScopeThree: NonNullable<unknown>;
    ScopeFour: NonNullable<unknown>;
  };
};

describe('Keyspace', () => {
  it('should return a string keyspace when no cluster types are given', () => {
    expectTypeOf<Keyspace>().toEqualTypeOf<{
      bucket: string;
      scope: string;
      collection: string;
    }>();
  });

  it('should return a union of keyspaces among the given cluster', () => {
    expectTypeOf<Keyspace<UserClusterTypes>>().toEqualTypeOf<
      | { bucket: 'BucketOne'; scope: 'ScopeOne'; collection: 'CollectionOne' }
      | { bucket: 'BucketOne'; scope: 'ScopeOne'; collection: 'CollectionFour' }
      | { bucket: 'BucketOne'; scope: 'ScopeTwo'; collection: 'CollectionOne' }
      | { bucket: 'BucketOne'; scope: 'ScopeTwo'; collection: 'CollectionTwo' }
      | { bucket: 'BucketTwo'; scope: 'ScopeOne'; collection: 'CollectionSix' }
    >();
  });

  it('should return a union of keyspaces among the given bucket names', () => {
    expectTypeOf<Keyspace<UserClusterTypes, 'BucketOne'>>().toEqualTypeOf<
      | { bucket: 'BucketOne'; scope: 'ScopeOne'; collection: 'CollectionOne' }
      | { bucket: 'BucketOne'; scope: 'ScopeOne'; collection: 'CollectionFour' }
      | { bucket: 'BucketOne'; scope: 'ScopeTwo'; collection: 'CollectionOne' }
      | { bucket: 'BucketOne'; scope: 'ScopeTwo'; collection: 'CollectionTwo' }
    >();

    expectTypeOf<Keyspace<UserClusterTypes, 'BucketOne' | 'BucketTwo'>>().toEqualTypeOf<
      | { bucket: 'BucketOne'; scope: 'ScopeOne'; collection: 'CollectionOne' }
      | { bucket: 'BucketOne'; scope: 'ScopeOne'; collection: 'CollectionFour' }
      | { bucket: 'BucketOne'; scope: 'ScopeTwo'; collection: 'CollectionOne' }
      | { bucket: 'BucketOne'; scope: 'ScopeTwo'; collection: 'CollectionTwo' }
      | { bucket: 'BucketTwo'; scope: 'ScopeOne'; collection: 'CollectionSix' }
    >();
  });

  it('should return a union of keyspaces among the given scope names', () => {
    expectTypeOf<Keyspace<UserClusterTypes, 'BucketOne', 'ScopeOne'>>().toEqualTypeOf<
      | { bucket: 'BucketOne'; scope: 'ScopeOne'; collection: 'CollectionOne' }
      | { bucket: 'BucketOne'; scope: 'ScopeOne'; collection: 'CollectionFour' }
    >();

    expectTypeOf<
      Keyspace<UserClusterTypes, 'BucketOne', 'ScopeOne' | 'ScopeTwo'>
    >().toEqualTypeOf<
      | { bucket: 'BucketOne'; scope: 'ScopeOne'; collection: 'CollectionOne' }
      | { bucket: 'BucketOne'; scope: 'ScopeOne'; collection: 'CollectionFour' }
      | { bucket: 'BucketOne'; scope: 'ScopeTwo'; collection: 'CollectionOne' }
      | { bucket: 'BucketOne'; scope: 'ScopeTwo'; collection: 'CollectionTwo' }
    >();

    expectTypeOf<Keyspace<UserClusterTypes, 'BucketTwo', 'ScopeOne'>>().toEqualTypeOf<{
      bucket: 'BucketTwo';
      scope: 'ScopeOne';
      collection: 'CollectionSix';
    }>();
  });

  it('should return a union of keyspaces among the given collection names', () => {
    expectTypeOf<
      Keyspace<UserClusterTypes, 'BucketOne', 'ScopeOne', 'CollectionOne'>
    >().toEqualTypeOf<{
      bucket: 'BucketOne';
      scope: 'ScopeOne';
      collection: 'CollectionOne';
    }>();

    expectTypeOf<
      Keyspace<
        UserClusterTypes,
        'BucketOne',
        'ScopeOne',
        'CollectionOne' | 'CollectionFour'
      >
    >().toEqualTypeOf<
      | { bucket: 'BucketOne'; scope: 'ScopeOne'; collection: 'CollectionOne' }
      | { bucket: 'BucketOne'; scope: 'ScopeOne'; collection: 'CollectionFour' }
    >();
  });

  it('should return all matching collections when a wildcard bucket is given', () => {
    expectTypeOf<
      Keyspace<UserClusterTypes, never, never, 'CollectionOne'>
    >().toEqualTypeOf<
      | {
          bucket: 'BucketOne';
          scope: 'ScopeOne';
          collection: 'CollectionOne';
        }
      | {
          bucket: 'BucketOne';
          scope: 'ScopeTwo';
          collection: 'CollectionOne';
        }
    >();

    expectTypeOf<
      Keyspace<
        UserClusterTypes,
        never,
        never,
        'CollectionOne' | 'CollectionTwo' | 'CollectionSix'
      >
    >().toEqualTypeOf<
      | { bucket: 'BucketOne'; scope: 'ScopeOne'; collection: 'CollectionOne' }
      | { bucket: 'BucketOne'; scope: 'ScopeTwo'; collection: 'CollectionOne' }
      | { bucket: 'BucketOne'; scope: 'ScopeTwo'; collection: 'CollectionTwo' }
      | { bucket: 'BucketTwo'; scope: 'ScopeOne'; collection: 'CollectionSix' }
    >();
  });

  it('should return all matching collections when a wildcard scope is given', () => {
    expectTypeOf<
      Keyspace<UserClusterTypes, 'BucketOne', never, 'CollectionOne'>
    >().toEqualTypeOf<
      | {
          bucket: 'BucketOne';
          scope: 'ScopeOne';
          collection: 'CollectionOne';
        }
      | {
          bucket: 'BucketOne';
          scope: 'ScopeTwo';
          collection: 'CollectionOne';
        }
    >();

    expectTypeOf<
      Keyspace<UserClusterTypes, 'BucketOne', never, 'CollectionOne' | 'CollectionTwo'>
    >().toEqualTypeOf<
      | { bucket: 'BucketOne'; scope: 'ScopeOne'; collection: 'CollectionOne' }
      | { bucket: 'BucketOne'; scope: 'ScopeTwo'; collection: 'CollectionOne' }
      | { bucket: 'BucketOne'; scope: 'ScopeTwo'; collection: 'CollectionTwo' }
    >();
  });
});

describe('quotePath', () => {
  describe('quotePath', () => {
    it('should correctly quote a single segment path', ({ expect }) => {
      const path = 'a';
      const result = quotePath(path);
      expect(result).toBe('`a`');
    });

    it('should correctly quote a multi-segment path', ({ expect }) => {
      const path = 'a.b.c';
      const result = quotePath(path);
      expect(result).toBe('`a`.`b`.`c`');
    });

    it('should handle paths with already quoted segments', ({ expect }) => {
      const path = '`a`.`b`.`c`';
      const result = quotePath(path);
      expect(result).toBe('`a`.`b`.`c`');
    });

    it('should handle empty string input', ({ expect }) => {
      const path = '';
      const result = quotePath(path);
      expect(result).toBe('');
    });

    it('should handle segments with backstick', ({ expect }) => {
      const path = 'wei`rd';
      const result = quotePath(path);
      expect(result).toBe('`wei\\`rd`');
    });
  });
});
