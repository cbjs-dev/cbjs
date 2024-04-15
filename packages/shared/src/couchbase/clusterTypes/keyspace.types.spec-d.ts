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
import { CouchbaseClusterTypes } from './cluster.types';

import { DocDef } from './document.types';
import { BucketName, CollectionName, ScopeName } from './keyspace.types';

type Doc<T extends string> = { [K in T]: string };
type UserClusterTypes = {
  BucketOne: {
    ScopeOne: {
      CollectionOne: [ DocDef<string, Doc<'b1s1c1d1'>>, DocDef<string, Doc<'b1s1c1d2'>> ];
      CollectionFour: [ DocDef<string, Doc<'b1s1c4d1'>>, DocDef<string, Doc<'b1s1c4d2'>> ];
    };
    ScopeTwo: {
      CollectionOne: [ DocDef<string, Doc<'b1s2c1d1'>>, DocDef<string, Doc<'b1s2c1d2'>> ];
      CollectionTwo: [ DocDef<string, Doc<'b1s2c2d1'>>, DocDef<string, Doc<'b1s2c2d2'>> ];
    };
  };
  BucketTwo: {
    ScopeOne: {
      CollectionSix: [ DocDef<string, Doc<'b2s1c6d1'>>, DocDef<string, Doc<'b2s1c6d2'>> ];
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
  it('should describe the collection names', () => {
    expectTypeOf<
      CollectionName<UserClusterTypes, 'BucketOne', 'ScopeOne'>
    >().toEqualTypeOf<'CollectionOne' | 'CollectionFour'>();

    expectTypeOf<
      CollectionName<UserClusterTypes, 'BucketOne', 'ScopeOne' | 'ScopeTwo'>
    >().toEqualTypeOf<'CollectionOne' | 'CollectionFour' | 'CollectionTwo'>();

    expectTypeOf<CollectionName<UserClusterTypes, 'BucketOne'>>().toEqualTypeOf<
      'CollectionOne' | 'CollectionFour' | 'CollectionTwo'
    >();

    expectTypeOf<
      CollectionName<UserClusterTypes, 'BucketOne' | 'BucketTwo'>
    >().toEqualTypeOf<
      'CollectionOne' | 'CollectionFour' | 'CollectionTwo' | 'CollectionSix'
    >();

    expectTypeOf<CollectionName<UserClusterTypes>>().toEqualTypeOf<
      'CollectionOne' | 'CollectionFour' | 'CollectionTwo' | 'CollectionSix'
    >();

    expectTypeOf<
      CollectionName<UserClusterTypes, 'BucketOne' | 'BucketTwo', 'ScopeOne'>
    >().toEqualTypeOf<'CollectionOne' | 'CollectionFour' | 'CollectionSix'>();
  });

  it('should fallback collection name to string', () => {
    expectTypeOf<CollectionName<CouchbaseClusterTypes>>().toEqualTypeOf<string>();
  });
});
