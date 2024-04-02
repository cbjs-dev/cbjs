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

import { BucketName, CollectionDocumentBag, DocDef, ScopeName } from '@cbjsdev/shared';

import { Bucket } from '../bucket';
import { Collection } from '../collection';
import { Scope } from '../scope';
import {
  AugmentClusterTypes,
  ClusterBucket,
  ClusterCollection,
  ClusterScope,
  ExtractCollectionDocumentBag,
  ValidateCollectionContainsAll,
  ValidateCollectionContainsAny,
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

describe('ClusterBucket', () => {
  it('should be extended by a Bucket that is within the described keyspace', () => {
    type UserBucket = Bucket<UserClusterTypes, 'BucketOne'>;

    // Positive
    expectTypeOf<UserBucket>().toMatchTypeOf<ClusterBucket>();
    expectTypeOf<UserBucket>().toMatchTypeOf<ClusterBucket<UserClusterTypes>>();
    expectTypeOf<UserBucket>().toMatchTypeOf<
      ClusterBucket<UserClusterTypes, 'BucketOne'>
    >();

    // Negative
    expectTypeOf<UserBucket>().not.toMatchTypeOf<ClusterBucket<NonNullable<unknown>>>();
    expectTypeOf<UserBucket>().not.toMatchTypeOf<
      ClusterBucket<UserClusterTypes, 'BucketTwo'>
    >();
  });
});

describe('ClusterScope', () => {
  it('should be extended by a Scope that is within the described keyspace', () => {
    type UserScope = Scope<UserClusterTypes, 'BucketOne', 'ScopeOne'>;

    // Positive
    expectTypeOf<UserScope>().toMatchTypeOf<ClusterScope>();
    expectTypeOf<UserScope>().toMatchTypeOf<ClusterScope<UserClusterTypes>>();
    expectTypeOf<UserScope>().toMatchTypeOf<
      ClusterScope<UserClusterTypes, 'BucketOne'>
    >();
    expectTypeOf<UserScope>().toMatchTypeOf<
      ClusterScope<UserClusterTypes, 'BucketOne', 'ScopeOne'>
    >();

    // Negative
    expectTypeOf<UserScope>().not.toMatchTypeOf<ClusterScope<NonNullable<unknown>>>();
    expectTypeOf<UserScope>().not.toMatchTypeOf<
      ClusterScope<UserClusterTypes, 'BucketTwo'>
    >();
    expectTypeOf<UserScope>().not.toMatchTypeOf<
      ClusterScope<UserClusterTypes, 'BucketOne', 'ScopeTwo'>
    >();
  });
});

describe('ClusterCollection', () => {
  it('should be extended by a Collection that is within the described keyspace', () => {
    type UserCollection = Collection<
      UserClusterTypes,
      'BucketOne',
      'ScopeOne',
      'CollectionOne'
    >;

    // Positive
    expectTypeOf<UserCollection>().toMatchTypeOf<ClusterCollection>();
    expectTypeOf<UserCollection>().toMatchTypeOf<ClusterCollection<UserClusterTypes>>();
    expectTypeOf<UserCollection>().toMatchTypeOf<
      ClusterCollection<UserClusterTypes, 'BucketOne'>
    >();
    expectTypeOf<UserCollection>().toMatchTypeOf<
      ClusterCollection<UserClusterTypes, 'BucketOne', 'ScopeOne'>
    >();
    expectTypeOf<UserCollection>().toMatchTypeOf<
      ClusterCollection<UserClusterTypes, 'BucketOne', 'ScopeOne', 'CollectionOne'>
    >();

    // Negative
    expectTypeOf<UserCollection>().not.toMatchTypeOf<
      ClusterCollection<NonNullable<unknown>>
    >();
    expectTypeOf<UserCollection>().not.toMatchTypeOf<
      ClusterCollection<UserClusterTypes, 'BucketTwo'>
    >();
    expectTypeOf<UserCollection>().not.toMatchTypeOf<
      ClusterCollection<UserClusterTypes, 'BucketOne', 'ScopeTwo'>
    >();
    expectTypeOf<UserCollection>().not.toMatchTypeOf<
      ClusterCollection<UserClusterTypes, 'BucketOne', 'ScopeOne', 'CollectionFour'>
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
