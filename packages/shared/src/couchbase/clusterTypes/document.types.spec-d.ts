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

import { DocDef, PickCollectionDocDef } from './document.types';

type Doc<T extends string> = { [K in T]: string };
type UserClusterTypes = {
  BucketOne: {
    ScopeOne: {
      CollectionOne: DocDef<string, Doc<'b1s1c1d1'>> | DocDef<string, Doc<'b1s1c1d2'>>;
      CollectionFour: DocDef<string, Doc<'b1s1c4d1'>> | DocDef<string, Doc<'b1s1c4d2'>>;
    };
    ScopeTwo: {
      CollectionOne: DocDef<string, Doc<'b1s2c1d1'>> | DocDef<string, Doc<'b1s2c1d2'>>;
      CollectionTwo: DocDef<string, Doc<'b1s2c2d1'>> | DocDef<string, Doc<'b1s2c2d2'>>;
    };
  };
  BucketTwo: {
    ScopeOne: {
      CollectionSix: DocDef<string, Doc<'b2s1c6d1'>> | DocDef<string, Doc<'b2s1c6d2'>>;
    };
    ScopeThree: NonNullable<unknown>;
    ScopeFour: NonNullable<unknown>;
  };
};

describe('PickCollectionDocument', () => {
  it('should describe the collection documents', () => {
    expectTypeOf<
      PickCollectionDocDef<UserClusterTypes, 'BucketOne', 'ScopeOne', 'CollectionOne'>
    >().toEqualTypeOf<
      DocDef<string, Doc<'b1s1c1d1'>> | DocDef<string, Doc<'b1s1c1d2'>>
    >();

    expectTypeOf<
      PickCollectionDocDef<
        UserClusterTypes,
        'BucketOne',
        'ScopeOne',
        'CollectionOne' | 'CollectionFour'
      >
    >().toEqualTypeOf<
      | DocDef<string, Doc<'b1s1c1d1'>>
      | DocDef<string, Doc<'b1s1c1d2'>>
      | DocDef<string, Doc<'b1s1c4d1'>>
      | DocDef<string, Doc<'b1s1c4d2'>>
    >();

    expectTypeOf<
      PickCollectionDocDef<UserClusterTypes, 'BucketOne', 'ScopeOne'>
    >().toEqualTypeOf<
      | DocDef<string, Doc<'b1s1c1d1'>>
      | DocDef<string, Doc<'b1s1c1d2'>>
      | DocDef<string, Doc<'b1s1c4d1'>>
      | DocDef<string, Doc<'b1s1c4d2'>>
    >();

    expectTypeOf<
      PickCollectionDocDef<UserClusterTypes, 'BucketOne', 'ScopeOne' | 'ScopeTwo'>
    >().toEqualTypeOf<
      | DocDef<string, Doc<'b1s1c1d1'>>
      | DocDef<string, Doc<'b1s1c1d2'>>
      | DocDef<string, Doc<'b1s1c4d1'>>
      | DocDef<string, Doc<'b1s1c4d2'>>
      | DocDef<string, Doc<'b1s2c1d1'>>
      | DocDef<string, Doc<'b1s2c1d2'>>
      | DocDef<string, Doc<'b1s2c2d1'>>
      | DocDef<string, Doc<'b1s2c2d2'>>
    >();

    expectTypeOf<PickCollectionDocDef<UserClusterTypes, 'BucketOne'>>().toEqualTypeOf<
      | DocDef<string, Doc<'b1s1c1d1'>>
      | DocDef<string, Doc<'b1s1c1d2'>>
      | DocDef<string, Doc<'b1s1c4d1'>>
      | DocDef<string, Doc<'b1s1c4d2'>>
      | DocDef<string, Doc<'b1s2c1d1'>>
      | DocDef<string, Doc<'b1s2c1d2'>>
      | DocDef<string, Doc<'b1s2c2d1'>>
      | DocDef<string, Doc<'b1s2c2d2'>>
    >();

    expectTypeOf<
      PickCollectionDocDef<UserClusterTypes, 'BucketOne' | 'BucketTwo'>
    >().toEqualTypeOf<
      | DocDef<string, Doc<'b1s1c1d1'>>
      | DocDef<string, Doc<'b1s1c1d2'>>
      | DocDef<string, Doc<'b1s1c4d1'>>
      | DocDef<string, Doc<'b1s1c4d2'>>
      | DocDef<string, Doc<'b1s2c1d1'>>
      | DocDef<string, Doc<'b1s2c1d2'>>
      | DocDef<string, Doc<'b1s2c2d1'>>
      | DocDef<string, Doc<'b1s2c2d2'>>
      | DocDef<string, Doc<'b2s1c6d1'>>
      | DocDef<string, Doc<'b2s1c6d2'>>
    >();

    expectTypeOf<PickCollectionDocDef<UserClusterTypes>>().toEqualTypeOf<
      | DocDef<string, Doc<'b1s1c1d1'>>
      | DocDef<string, Doc<'b1s1c1d2'>>
      | DocDef<string, Doc<'b1s1c4d1'>>
      | DocDef<string, Doc<'b1s1c4d2'>>
      | DocDef<string, Doc<'b1s2c1d1'>>
      | DocDef<string, Doc<'b1s2c1d2'>>
      | DocDef<string, Doc<'b1s2c2d1'>>
      | DocDef<string, Doc<'b1s2c2d2'>>
      | DocDef<string, Doc<'b2s1c6d1'>>
      | DocDef<string, Doc<'b2s1c6d2'>>
    >();

    expectTypeOf<
      PickCollectionDocDef<
        UserClusterTypes,
        'BucketOne',
        'ScopeOne' | 'ScopeTwo',
        'CollectionOne'
      >
    >().toEqualTypeOf<
      | DocDef<string, Doc<'b1s1c1d1'>>
      | DocDef<string, Doc<'b1s1c1d2'>>
      | DocDef<string, Doc<'b1s2c1d1'>>
      | DocDef<string, Doc<'b1s2c1d2'>>
    >();
  });
});
