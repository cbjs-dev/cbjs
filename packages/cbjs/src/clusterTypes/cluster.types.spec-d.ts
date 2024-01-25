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

import { Collection } from '../collection';
import {
  AugmentClusterTypes,
  BucketName, CollectionAmong, CollectionDocumentBag,
  CollectionName,
  DocDef, ExtractCollectionDocumentBag,
  PickCollectionDocument,
  ScopeName, ValidateCollectionContainsAll, ValidateCollectionContainsAny,
} from './clusterTypes';

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

describe('ClusterTypes', () => {
  it('should describe the bucket names', () => {
    expectTypeOf<BucketName<UserClusterTypes>>().toEqualTypeOf<
      'BucketOne' | 'BucketTwo'
    >();
  });

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

  it('should describe the collection documents', () => {
    expectTypeOf<
      PickCollectionDocument<UserClusterTypes, 'BucketOne', 'ScopeOne', 'CollectionOne'>
    >().toEqualTypeOf<
      DocDef<string, Doc<'b1s1c1d1'>> | DocDef<string, Doc<'b1s1c1d2'>>
    >();

    expectTypeOf<
      PickCollectionDocument<
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
      PickCollectionDocument<UserClusterTypes, 'BucketOne', 'ScopeOne'>
    >().toEqualTypeOf<
      | DocDef<string, Doc<'b1s1c1d1'>>
      | DocDef<string, Doc<'b1s1c1d2'>>
      | DocDef<string, Doc<'b1s1c4d1'>>
      | DocDef<string, Doc<'b1s1c4d2'>>
    >();

    expectTypeOf<
      PickCollectionDocument<UserClusterTypes, 'BucketOne', 'ScopeOne' | 'ScopeTwo'>
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

    expectTypeOf<PickCollectionDocument<UserClusterTypes, 'BucketOne'>>().toEqualTypeOf<
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
      PickCollectionDocument<UserClusterTypes, 'BucketOne' | 'BucketTwo'>
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

    expectTypeOf<PickCollectionDocument<UserClusterTypes>>().toEqualTypeOf<
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
      PickCollectionDocument<
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

describe('AugmentClusterTypes', () => {
  it('should add a new bucket', () => {
    type Augmented = AugmentClusterTypes<UserClusterTypes, 'NewBucket'>;

    expectTypeOf<BucketName<Augmented>>().toEqualTypeOf<
      'BucketOne' | 'BucketTwo' | 'NewBucket'
    >();
  });

  it('should add a new scope in a single bucket', () => {
    type Augmented = AugmentClusterTypes<UserClusterTypes, 'BucketOne', 'NewScope'>;

    expectTypeOf<ScopeName<Augmented, 'BucketOne'>>().toEqualTypeOf<
      'ScopeOne' | 'ScopeTwo' | 'NewScope'
    >();
    expectTypeOf<ScopeName<Augmented, 'BucketTwo'>>().toEqualTypeOf<
      'ScopeOne' | 'ScopeThree' | 'ScopeFour'
    >();
  });

  it('should add a new scope in a union of bucket', () => {
    type Augmented = AugmentClusterTypes<
      UserClusterTypes,
      'BucketOne' | 'BucketTwo' | 'NewBucket',
      'NewScope'
    >;

    expectTypeOf<ScopeName<Augmented, 'BucketOne'>>().toEqualTypeOf<
      'ScopeOne' | 'ScopeTwo' | 'NewScope'
    >();
    expectTypeOf<ScopeName<Augmented, 'BucketTwo'>>().toEqualTypeOf<
      'ScopeOne' | 'ScopeThree' | 'ScopeFour' | 'NewScope'
    >();
    expectTypeOf<ScopeName<Augmented, 'NewBucket'>>().toEqualTypeOf<'NewScope'>();
  });
});

describe('ExtractCollectionDocumentBag', () => {
  it('should return the document types of the collection', () => {
    expectTypeOf<
      ExtractCollectionDocumentBag<
        Collection<UserClusterTypes, 'BucketOne', 'ScopeOne', 'CollectionOne'>
      >
    >().toEqualTypeOf<
      CollectionDocumentBag<
        DocDef<string, Doc<'b1s1c1d1'>> | DocDef<string, Doc<'b1s1c1d2'>>
      >
    >();
  });
});

describe('CollectionAmong', () => {
  it('should be extended by a Collection that is within the described keyspace', () => {
    type UserCollection = Collection<
      UserClusterTypes,
      'BucketOne',
      'ScopeOne',
      'CollectionOne'
    >;

    // Positive
    expectTypeOf<UserCollection>().toMatchTypeOf<CollectionAmong>();
    expectTypeOf<UserCollection>().toMatchTypeOf<CollectionAmong<UserClusterTypes>>();
    expectTypeOf<UserCollection>().toMatchTypeOf<
      CollectionAmong<UserClusterTypes, 'BucketOne'>
    >();
    expectTypeOf<UserCollection>().toMatchTypeOf<
      CollectionAmong<UserClusterTypes, 'BucketOne', 'ScopeOne'>
    >();
    expectTypeOf<UserCollection>().toMatchTypeOf<
      CollectionAmong<UserClusterTypes, 'BucketOne', 'ScopeOne', 'CollectionOne'>
    >();

    // Negative
    expectTypeOf<UserCollection>().not.toMatchTypeOf<
      CollectionAmong<NonNullable<unknown>>
    >();
    expectTypeOf<UserCollection>().not.toMatchTypeOf<
      CollectionAmong<UserClusterTypes, 'BucketTwo'>
    >();
    expectTypeOf<UserCollection>().not.toMatchTypeOf<
      CollectionAmong<UserClusterTypes, 'BucketOne', 'ScopeTwo'>
    >();
    expectTypeOf<UserCollection>().not.toMatchTypeOf<
      CollectionAmong<UserClusterTypes, 'BucketOne', 'ScopeOne', 'CollectionFour'>
    >();
  });
});

describe('ValidateCollectionContainsAll', () => {
  it('is extended by a collection that contains the docs', () => {
    type UserCollection = Collection<
      UserClusterTypes,
      'BucketOne',
      'ScopeOne',
      'CollectionOne'
    >;

    expectTypeOf<
      ValidateCollectionContainsAll<UserCollection, Doc<'b1s1c1d1'>>
    >().toEqualTypeOf<UserCollection>();
    expectTypeOf<
      ValidateCollectionContainsAll<UserCollection, Doc<'doesNotExist'>>
    >().toBeNever();
    expectTypeOf<
      ValidateCollectionContainsAll<UserCollection, Doc<'b1s1c1d1'> | Doc<'doesNotExist'>>
    >().toBeNever();
  });
});

describe('ValidateCollectionContainsAny', () => {
  it('is extended by a collection that contains the docs', () => {
    type UserCollection = Collection<
      UserClusterTypes,
      'BucketOne',
      'ScopeOne',
      'CollectionOne'
    >;

    expectTypeOf<
      ValidateCollectionContainsAny<UserCollection, Doc<'b1s1c1d1'>>
    >().toEqualTypeOf<UserCollection>();
    expectTypeOf<
      ValidateCollectionContainsAny<UserCollection, Doc<'doesNotExist'>>
    >().toBeNever();
    expectTypeOf<
      ValidateCollectionContainsAny<UserCollection, Doc<'b1s1c1d1'> | Doc<'doesNotExist'>>
    >().toEqualTypeOf<UserCollection>();
  });
});
