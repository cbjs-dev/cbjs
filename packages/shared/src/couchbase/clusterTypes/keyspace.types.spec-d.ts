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

import type { CouchbaseClusterTypes, DefaultClusterTypes } from './cluster.types.js';
import type { DocDef } from './document.types.js';
import type {
  BucketName,
  CollectionName,
  QueryContext,
  ScopeName,
} from './keyspace.types.js';

type Doc<T extends string> = { [K in T]: string };

type UserClusterTypes = {
  '@options': { keyMatchingStrategy: 'firstMatch' };
  'BucketOne': {
    '@options': { keyMatchingStrategy: 'firstMatch' };
    'ScopeOne': {
      '@options': { keyMatchingStrategy: 'firstMatch' };
      'CollectionOne': [DocDef<string, Doc<'b1s1c1d1'>>, DocDef<string, Doc<'b1s1c1d2'>>];
      'CollectionFour': [
        DocDef<string, Doc<'b1s1c4d1'>>,
        DocDef<string, Doc<'b1s1c4d2'>>,
      ];
    };
    'ScopeTwo': {
      CollectionOne: [DocDef<string, Doc<'b1s2c1d1'>>, DocDef<string, Doc<'b1s2c1d2'>>];
      CollectionTwo: [DocDef<string, Doc<'b1s2c2d1'>>, DocDef<string, Doc<'b1s2c2d2'>>];
    };
  };
  'BucketTwo': {
    ScopeOne: {
      CollectionSix: [DocDef<string, Doc<'b2s1c6d1'>>, DocDef<string, Doc<'b2s1c6d2'>>];
    };
    ScopeThree: NonNullable<unknown>;
    ScopeFour: NonNullable<unknown>;
  };
};

describe('BucketName', () => {
  it('should describe the bucket names', () => {
    expectTypeOf<BucketName<UserClusterTypes>>().toEqualTypeOf<
      'BucketOne' | 'BucketTwo'
    >();
  });

  it('should fallback bucket name to string', () => {
    expectTypeOf<BucketName<CouchbaseClusterTypes>>().toEqualTypeOf<string>();
  });
});

describe('ScopeName', () => {
  it('should describe the scope names', () => {
    expectTypeOf<ScopeName<UserClusterTypes, 'BucketOne'>>().toEqualTypeOf<
      'ScopeOne' | 'ScopeTwo'
    >();
    expectTypeOf<ScopeName<UserClusterTypes, 'BucketOne' | 'BucketTwo'>>().toEqualTypeOf<
      'ScopeOne' | 'ScopeTwo' | 'ScopeThree' | 'ScopeFour'
    >();
    expectTypeOf<ScopeName<UserClusterTypes>>().toEqualTypeOf<
      'ScopeOne' | 'ScopeTwo' | 'ScopeThree' | 'ScopeFour'
    >();
  });

  it('should fallback scope name to string', () => {
    expectTypeOf<ScopeName<CouchbaseClusterTypes>>().toEqualTypeOf<string>();
  });
});

describe('CollectionName', () => {
  it('should give a union of collections name', () => {
    // Whole cluster
    expectTypeOf<CollectionName<UserClusterTypes>>().toEqualTypeOf<
      'CollectionOne' | 'CollectionFour' | 'CollectionTwo' | 'CollectionSix'
    >();

    // Single bucket
    expectTypeOf<CollectionName<UserClusterTypes, 'BucketOne'>>().toEqualTypeOf<
      'CollectionOne' | 'CollectionFour' | 'CollectionTwo'
    >();

    // Union of buckets
    expectTypeOf<
      CollectionName<UserClusterTypes, 'BucketOne' | 'BucketTwo'>
    >().toEqualTypeOf<
      'CollectionOne' | 'CollectionFour' | 'CollectionTwo' | 'CollectionSix'
    >();

    // Single bucket & scope
    expectTypeOf<
      CollectionName<UserClusterTypes, 'BucketOne', 'ScopeOne'>
    >().toEqualTypeOf<'CollectionOne' | 'CollectionFour'>();

    // Single bucket, union of scopes
    expectTypeOf<
      CollectionName<UserClusterTypes, 'BucketOne', 'ScopeOne' | 'ScopeTwo'>
    >().toEqualTypeOf<'CollectionOne' | 'CollectionFour' | 'CollectionTwo'>();

    // Union of buckets, single scope
    expectTypeOf<
      CollectionName<UserClusterTypes, 'BucketOne' | 'BucketTwo', 'ScopeOne'>
    >().toEqualTypeOf<'CollectionOne' | 'CollectionFour' | 'CollectionSix'>();

    // Union of buckets, union of scopes
    expectTypeOf<
      CollectionName<UserClusterTypes, 'BucketOne' | 'BucketTwo', 'ScopeOne' | 'ScopeTwo'>
    >().toEqualTypeOf<
      'CollectionOne' | 'CollectionTwo' | 'CollectionFour' | 'CollectionSix'
    >();

    // Empty scope
    expectTypeOf<
      CollectionName<UserClusterTypes, 'BucketTwo', 'ScopeThree'>
    >().toEqualTypeOf<never>();
  });

  it('should fallback to string when given the default cluster types', () => {
    expectTypeOf<CollectionName<CouchbaseClusterTypes>>().toEqualTypeOf<string>();
  });
});

describe('QueryContext', () => {
  it('should give a union of all possible query contexts', () => {
    expectTypeOf<QueryContext<UserClusterTypes>>().toEqualTypeOf<
      | 'BucketOne'
      | 'BucketOne.ScopeOne'
      | 'BucketOne.ScopeTwo'
      | 'BucketTwo'
      | 'BucketTwo.ScopeOne'
      | 'BucketTwo.ScopeThree'
      | 'BucketTwo.ScopeFour'
    >();

    expectTypeOf<QueryContext<DefaultClusterTypes>>().toEqualTypeOf<string>();
  });
});
