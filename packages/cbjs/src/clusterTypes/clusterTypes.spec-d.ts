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

import {
  CollectionName,
  DefaultClusterTypes,
  IsDefaultClusterTypes,
  LookupInMacroShape,
} from '@cbjsdev/shared';

import { Bucket } from '../bucket.js';
import { Collection } from '../collection.js';
import { connect } from '../couchbase.js';
import { Scope } from '../scope.js';
import {
  AnyCluster,
  ClusterBucket,
  ClusterCollection,
  ClusterScope,
  CollectionContainingDocBody,
  CollectionContainingDocDef,
  CollectionMatchingDocDef,
  DocDef,
} from './clusterTypes.js';
import { LookupInGetPath } from './kv/lookup/lookupOperations.types.js';

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
  BucketThree: {
    ScopeThree: {
      CollectionOne: [DocDef<string, Doc<'b1s1c1d1'>>, DocDef<string, Doc<'b1s1c1d2'>>];
    };
  };
};

describe('DocDef', () => {
  it('should extends DocDef', () => {
    expectTypeOf<DocDef<string, { title: string }>>().toMatchTypeOf<DocDef>();
  });
});

describe('IsDefaultClusterTypes', () => {
  it('should return true when the default cluster types are given', () => {
    expectTypeOf<IsDefaultClusterTypes<DefaultClusterTypes>>().toEqualTypeOf<true>();
  });

  it('should return true when an empty object is given', () => {
    expectTypeOf<IsDefaultClusterTypes<NonNullable<unknown>>>().toEqualTypeOf<true>();
    // eslint-disable-next-line @typescript-eslint/ban-types
    expectTypeOf<IsDefaultClusterTypes<{}>>().toEqualTypeOf<true>();
  });

  it('should return true when an object containing only options is given', () => {
    expectTypeOf<
      IsDefaultClusterTypes<{
        '@options': { keyMatchingStrategy: 'firstMatch' };
      }>
    >().toEqualTypeOf<true>();
  });

  it('should return false when at least one bucket is defined', () => {
    expectTypeOf<IsDefaultClusterTypes<{ BucketOne: never }>>().toEqualTypeOf<false>();
  });
});

describe('AnyCluster', () => {
  it('should accept any cluster object with cluster types', async () => {
    function doSomething(cluster: AnyCluster): void {
      // something
    }

    const cluster = await connect<UserClusterTypes>('...');
    doSomething(cluster);
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

  it('should produce all buckets when any or never is passed', () => {
    expectTypeOf<ClusterBucket<UserClusterTypes, any>>().toEqualTypeOf<
      | Bucket<UserClusterTypes, 'BucketOne'>
      | Bucket<UserClusterTypes, 'BucketTwo'>
      | Bucket<UserClusterTypes, 'BucketThree'>
    >();

    expectTypeOf<ClusterBucket<UserClusterTypes, never>>().toEqualTypeOf<
      | Bucket<UserClusterTypes, 'BucketOne'>
      | Bucket<UserClusterTypes, 'BucketTwo'>
      | Bucket<UserClusterTypes, 'BucketThree'>
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

  it('should produce scopes for all buckets when any or never is passed', () => {
    expectTypeOf<ClusterScope<UserClusterTypes, any, 'ScopeOne'>>().toEqualTypeOf<
      | Scope<UserClusterTypes, 'BucketOne', 'ScopeOne'>
      | Scope<UserClusterTypes, 'BucketTwo', 'ScopeOne'>
    >();

    expectTypeOf<ClusterScope<UserClusterTypes, never, 'ScopeOne'>>().toEqualTypeOf<
      | Scope<UserClusterTypes, 'BucketOne', 'ScopeOne'>
      | Scope<UserClusterTypes, 'BucketTwo', 'ScopeOne'>
    >();
  });
});

describe('ClusterCollection', () => {
  it('should be extended by a Collection that is within the described keyspace', () => {
    type T = CollectionName<UserClusterTypes, 'BucketOne'>;
    //   ^?

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

  it('should only produce collections that exist in the parent scope', () => {
    expectTypeOf<
      ClusterCollection<
        UserClusterTypes,
        'BucketOne',
        'ScopeOne' | 'ScopeTwo',
        'CollectionTwo'
      >
    >().toEqualTypeOf<
      Collection<UserClusterTypes, 'BucketOne', 'ScopeTwo', 'CollectionTwo'>
    >();
  });

  it('should produce collections for all scopes when any or never is passed', () => {
    expectTypeOf<
      ClusterCollection<UserClusterTypes, 'BucketOne', any, 'CollectionOne'>
    >().toEqualTypeOf<
      | Collection<UserClusterTypes, 'BucketOne', 'ScopeOne', 'CollectionOne'>
      | Collection<UserClusterTypes, 'BucketOne', 'ScopeTwo', 'CollectionOne'>
    >();

    expectTypeOf<
      ClusterCollection<UserClusterTypes, 'BucketOne', never, 'CollectionOne'>
    >().toEqualTypeOf<
      | Collection<UserClusterTypes, 'BucketOne', 'ScopeOne', 'CollectionOne'>
      | Collection<UserClusterTypes, 'BucketOne', 'ScopeTwo', 'CollectionOne'>
    >();
  });

  it('should produce collections for all buckets and all scopes when any or never is passed', () => {
    expectTypeOf<
      ClusterCollection<UserClusterTypes, any, any, 'CollectionOne' | 'CollectionTwo'>
    >().toEqualTypeOf<
      | Collection<UserClusterTypes, 'BucketOne', 'ScopeOne', 'CollectionOne'>
      | Collection<UserClusterTypes, 'BucketOne', 'ScopeTwo', 'CollectionOne'>
      | Collection<UserClusterTypes, 'BucketOne', 'ScopeTwo', 'CollectionTwo'>
      | Collection<UserClusterTypes, 'BucketThree', 'ScopeThree', 'CollectionOne'>
    >();

    expectTypeOf<
      ClusterCollection<UserClusterTypes, never, never, 'CollectionOne'>
    >().toEqualTypeOf<
      | Collection<UserClusterTypes, 'BucketOne', 'ScopeOne', 'CollectionOne'>
      | Collection<UserClusterTypes, 'BucketOne', 'ScopeTwo', 'CollectionOne'>
      | Collection<UserClusterTypes, 'BucketThree', 'ScopeThree', 'CollectionOne'>
    >();
  });
});

describe('CollectionContainingDocDef', () => {
  type BookId = `book::${number}`;
  type Book = { title: string; authors: string[] };

  type VegetableId = `vegetable::${number}`;
  type Vegetable = { name: string; expiry: number };

  type UserClusterTypes = {
    store: {
      library: {
        books: [DocDef<BookId, Book>];
        groceries: [DocDef<VegetableId, Vegetable>];
        wtf: [DocDef<VegetableId, Vegetable>, DocDef<BookId, Book>];
      };
    };
  };

  it('should return all collections containing any of the given definitions', () => {
    expectTypeOf<
      CollectionContainingDocDef<UserClusterTypes, DocDef<BookId, Book>>
    >().toEqualTypeOf<
      | Collection<UserClusterTypes, 'store', 'library', 'books'>
      | Collection<UserClusterTypes, 'store', 'library', 'wtf'>
    >();

    expectTypeOf<
      CollectionContainingDocDef<
        UserClusterTypes,
        DocDef<BookId, Book> | DocDef<VegetableId, Vegetable>
      >
    >().toEqualTypeOf<
      | Collection<UserClusterTypes, 'store', 'library', 'books'>
      | Collection<UserClusterTypes, 'store', 'library', 'groceries'>
      | Collection<UserClusterTypes, 'store', 'library', 'wtf'>
    >();
  });
});

describe('CollectionMatchingDocDef', () => {
  type BookId = `book::${number}`;
  type Book = { title: string; authors: string[] };

  type VegetableId = `vegetable::${number}`;
  type Vegetable = { name: string; expiry: number };

  type UserClusterTypes = {
    store: {
      library: {
        books: [DocDef<BookId, Book>];
        groceries: [DocDef<VegetableId, Vegetable>];
        wtf: [DocDef<VegetableId, Vegetable>, DocDef<BookId, Book>];
      };
    };
  };

  it('should return all collections matching any of the given definitions', () => {
    expectTypeOf<
      CollectionMatchingDocDef<UserClusterTypes, DocDef<string, { title: string }>>
    >().toEqualTypeOf<
      | Collection<UserClusterTypes, 'store', 'library', 'books'>
      | Collection<UserClusterTypes, 'store', 'library', 'wtf'>
    >();

    expectTypeOf<
      CollectionContainingDocDef<
        UserClusterTypes,
        DocDef<BookId, Book> | DocDef<VegetableId, Vegetable>
      >
    >().toEqualTypeOf<
      | Collection<UserClusterTypes, 'store', 'library', 'books'>
      | Collection<UserClusterTypes, 'store', 'library', 'groceries'>
      | Collection<UserClusterTypes, 'store', 'library', 'wtf'>
    >();
  });
});

describe('CollectionContainingDocBody', () => {
  type BookId = `book::${number}`;
  type Book = { title: string; authors: string[] };

  type VegetableId = `vegetable::${number}`;
  type Vegetable = { name: string; expiry: number };

  type UserClusterTypes = {
    store: {
      library: {
        books: [DocDef<BookId, Book>];
        groceries: [DocDef<VegetableId, Vegetable>];
        wtf: [DocDef<VegetableId, Vegetable>, DocDef<BookId, Book>];
      };
    };
  };

  it('should return all collections containing any of the given types', () => {
    expectTypeOf<
      CollectionContainingDocBody<UserClusterTypes, Book | Vegetable>
    >().toEqualTypeOf<
      | Collection<UserClusterTypes, 'store', 'library', 'books'>
      | Collection<UserClusterTypes, 'store', 'library', 'groceries'>
      | Collection<UserClusterTypes, 'store', 'library', 'wtf'>
    >();
  });

  it('should return all collections containing document that have a body that extends the given type', () => {
    expectTypeOf<
      CollectionContainingDocBody<UserClusterTypes, { title: string }>
    >().toEqualTypeOf<Collection<UserClusterTypes, 'store', 'library', 'books'>>();
  });
});
