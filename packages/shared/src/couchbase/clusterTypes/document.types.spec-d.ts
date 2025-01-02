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

import type {
  DefaultClusterTypes,
  DefaultKeyspaceOptions,
  GetKeyspaceOptions,
} from './cluster.types.js';
import type {
  DocDef,
  DocDefMatchingBody,
  DocDefMatchingKey,
  IsFuzzyDocument,
  KeyspaceDocDef,
  MatchDocDefKeyByDelimiter,
  MatchDocDefKeyFirstMatch,
} from './document.types.js';

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

describe('IsFuzzyDocument', function () {
  it('should detect fuzzy document', function () {
    expectTypeOf<IsFuzzyDocument<any>>().toEqualTypeOf<true>();
    expectTypeOf<IsFuzzyDocument<object>>().toEqualTypeOf<true>();
    expectTypeOf<IsFuzzyDocument<Record<string, unknown>>>().toEqualTypeOf<true>();
    expectTypeOf<IsFuzzyDocument<Record<number, unknown>>>().toEqualTypeOf<true>();
    expectTypeOf<IsFuzzyDocument<Record<symbol, unknown>>>().toEqualTypeOf<true>();
    expectTypeOf<IsFuzzyDocument<NonNullable<unknown>>>().toEqualTypeOf<true>();
    expectTypeOf<IsFuzzyDocument<{ [key: string]: string }>>().toEqualTypeOf<true>();
    expectTypeOf<
      IsFuzzyDocument<{ [key: string]: string; title: string }>
    >().toEqualTypeOf<true>();
  });

  it('should not have false positive', function () {
    expectTypeOf<IsFuzzyDocument<Record<'test', unknown>>>().toEqualTypeOf<false>();
    expectTypeOf<IsFuzzyDocument<unknown[]>>().toEqualTypeOf<false>();
    expectTypeOf<IsFuzzyDocument<string[]>>().toEqualTypeOf<false>();
    expectTypeOf<IsFuzzyDocument<{ title: string }>>().toEqualTypeOf<false>();
  });
});

describe('PickCollectionDocument', () => {
  it('should describe the collection documents', () => {
    expectTypeOf<
      KeyspaceDocDef<UserClusterTypes, 'BucketOne', 'ScopeOne', 'CollectionOne'>
    >().toEqualTypeOf<
      DocDef<string, Doc<'b1s1c1d1'>> | DocDef<string, Doc<'b1s1c1d2'>>
    >();

    expectTypeOf<
      KeyspaceDocDef<
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
      KeyspaceDocDef<UserClusterTypes, 'BucketOne', 'ScopeOne'>
    >().toEqualTypeOf<
      | DocDef<string, Doc<'b1s1c1d1'>>
      | DocDef<string, Doc<'b1s1c1d2'>>
      | DocDef<string, Doc<'b1s1c4d1'>>
      | DocDef<string, Doc<'b1s1c4d2'>>
    >();

    expectTypeOf<
      KeyspaceDocDef<UserClusterTypes, 'BucketOne', 'ScopeOne' | 'ScopeTwo'>
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

    expectTypeOf<KeyspaceDocDef<UserClusterTypes, 'BucketOne'>>().toEqualTypeOf<
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
      KeyspaceDocDef<UserClusterTypes, 'BucketOne' | 'BucketTwo'>
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

    expectTypeOf<KeyspaceDocDef<UserClusterTypes>>().toEqualTypeOf<
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
      KeyspaceDocDef<
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

describe('GetKeyspaceOptions', () => {
  it('should return the default options when any is given as cluster types', () => {
    expectTypeOf<
      GetKeyspaceOptions<any, any, any, any>
    >().toEqualTypeOf<DefaultKeyspaceOptions>();
  });

  it('should return the default options when the default cluster types are given', () => {
    expectTypeOf<
      GetKeyspaceOptions<DefaultClusterTypes, 'b', 's', 'c'>
    >().toEqualTypeOf<DefaultKeyspaceOptions>();
  });

  it('should return the default options when none are defined', () => {
    expectTypeOf<
      GetKeyspaceOptions<
        {
          store: { library: { books: [] } };
        },
        'store',
        'library',
        'books'
      >
    >().toEqualTypeOf<DefaultKeyspaceOptions>();
  });
  it('should return the cluster options when there are no others', () => {
    expectTypeOf<
      GetKeyspaceOptions<
        {
          '@options': { keyMatchingStrategy: 'firstMatch' };
          'store': { library: { books: [] } };
        },
        'store',
        'library',
        'books'
      >
    >().toEqualTypeOf<{
      keyMatchingStrategy: 'firstMatch';
      codeCompletion: { array: 'friendly'; record: 'friendly'; recordPlaceholder: '#' };
    }>();
  });

  it('should merge cluster options and bucket options', () => {
    expectTypeOf<
      GetKeyspaceOptions<
        {
          '@options': {
            keyMatchingStrategy: 'delimiter';
            keyDelimiter: '::';
          };
          'store': {
            '@options': { keyMatchingStrategy: 'firstMatch' };
            'library': { books: [] };
          };
        },
        'store',
        'library',
        'books'
      >
    >().toEqualTypeOf<{
      keyMatchingStrategy: 'firstMatch';
      keyDelimiter: '::';
      codeCompletion: { array: 'friendly'; record: 'friendly'; recordPlaceholder: '#' };
    }>();
  });

  it('should merge cluster, bucket and scope options', () => {
    expectTypeOf<
      GetKeyspaceOptions<
        {
          '@options': {
            keyMatchingStrategy: 'delimiter';
            keyDelimiter: '::';
          };
          'store': {
            '@options': { keyMatchingStrategy: 'firstMatch' };
            'library': {
              '@options': { keyMatchingStrategy: 'always' };
              'books': [];
            };
          };
        },
        'store',
        'library',
        'books'
      >
    >().toEqualTypeOf<{
      keyMatchingStrategy: 'always';
      keyDelimiter: '::';
      codeCompletion: { array: 'friendly'; record: 'friendly'; recordPlaceholder: '#' };
    }>();
  });

  it('should merge cluster, bucket, scope and collection options', () => {
    expectTypeOf<
      GetKeyspaceOptions<
        {
          '@options': {
            keyMatchingStrategy: 'delimiter';
            keyDelimiter: '::';
          };
          'store': {
            '@options': { keyMatchingStrategy: 'firstMatch' };
            'library': {
              '@options': { keyMatchingStrategy: 'always' };
              'books':
                | {
                    keyMatchingStrategy: 'delimiter';
                    keyDelimiter: '__';
                  }
                | [];
            };
          };
        },
        'store',
        'library',
        'books'
      >
    >().toEqualTypeOf<{
      keyMatchingStrategy: 'delimiter';
      keyDelimiter: '__';
      codeCompletion: { array: 'friendly'; record: 'friendly'; recordPlaceholder: '#' };
    }>();
  });
});

describe('DocDefMatchingKey', () => {
  type BookKey = `book::${string}`;
  type BookReviewsKey = `book::${string}::reviews`;
  type BookCommentsKey = `book::${string}::comments`;
  type BookCommentsLikesKey = `book::${string}::comments::${string}::likes`;

  type BookDef = DocDef<BookKey, 'book'>;
  type BookReviewsDef = DocDef<BookReviewsKey, 'reviews'>;
  type BookCommentsDef = DocDef<BookCommentsKey, 'comments'>;
  type BookCommentsLikesDef = DocDef<BookCommentsLikesKey, 'comments::likes'>;

  type UserClusterTypes = {
    store: {
      library: {
        books: [BookReviewsDef, BookDef, BookCommentsDef, BookCommentsLikesDef];
      };
    };
  };

  it('default cluster types with specific collection', () => {
    expectTypeOf<
      DocDefMatchingKey<BookKey, DefaultClusterTypes, 'store', 'library', 'books'>
    >().toEqualTypeOf<DocDef>();
  });

  it('default cluster types with any collection', () => {
    expectTypeOf<
      DocDefMatchingKey<BookKey, any, any, any, any>
    >().toEqualTypeOf<DocDef>();
  });

  it('keyMatchingStrategy: firstMatch', () => {
    type CT = {
      '@options': { keyMatchingStrategy: 'firstMatch' };
      'store': {
        library: {
          books: [
            BookReviewsDef,
            BookDef,
            BookCommentsDef,
            BookCommentsLikesDef,
            DocDef<'yo', string[]>,
          ];
        };
      };
    };

    expectTypeOf<
      DocDefMatchingKey<BookKey, CT, 'store', 'library', 'books'>
    >().toEqualTypeOf<BookDef>();

    expectTypeOf<
      DocDefMatchingKey<BookCommentsKey, CT, 'store', 'library', 'books'>
    >().toEqualTypeOf<BookDef>();

    expectTypeOf<
      DocDefMatchingKey<BookReviewsKey, CT, 'store', 'library', 'books'>
    >().toEqualTypeOf<BookReviewsDef>();
  });

  it('keyMatchingStrategy: always', () => {
    type CT = {
      '@options': { keyMatchingStrategy: 'always' };
      'store': {
        library: {
          books: [BookReviewsDef, BookDef, BookCommentsDef, BookCommentsLikesDef];
        };
      };
    };

    expectTypeOf<
      DocDefMatchingKey<BookKey, CT, 'store', 'library', 'books'>
    >().toEqualTypeOf<BookDef>();

    expectTypeOf<
      DocDefMatchingKey<BookReviewsKey, CT, 'store', 'library', 'books'>
    >().toEqualTypeOf<BookDef | BookReviewsDef>();
  });

  it('keyMatchingStrategy: delimiter', () => {
    type CT = {
      '@options': {
        keyDelimiter: '::';
        keyMatchingStrategy: 'delimiter';
      };
      'store': {
        library: {
          books: [BookReviewsDef, BookDef, BookCommentsDef, BookCommentsLikesDef];
        };
      };
    };

    expectTypeOf<
      DocDefMatchingKey<BookKey, CT, 'store', 'library', 'books'>
    >().toEqualTypeOf<BookDef>();

    expectTypeOf<
      DocDefMatchingKey<BookReviewsKey, CT, 'store', 'library', 'books'>
    >().toEqualTypeOf<BookReviewsDef>();

    expectTypeOf<
      DocDefMatchingKey<BookCommentsKey, CT, 'store', 'library', 'books'>
    >().toEqualTypeOf<BookCommentsDef>();
  });
});

describe('KeyMatchesByDelimiter', () => {
  type Options = { keyDelimiter: '::' };
  type BookKey = `book::${string}`;
  type BookReviewsKey = `book::${string}::reviews`;
  type BookCommentsKey = `book::${string}::comments`;
  type BookCommentsLikesKey = `book::${string}::comments::${string}::likes`;

  type BookDef = DocDef<BookKey, 'book'>;
  type BookReviewsDef = DocDef<BookReviewsKey, 'reviews'>;
  type BookCommentsDef = DocDef<BookCommentsKey, 'comments'>;
  type BookCommentsLikesDef = DocDef<BookCommentsLikesKey, 'comments::likes'>;

  it('should match the closest templates', () => {
    expectTypeOf<
      MatchDocDefKeyByDelimiter<
        BookKey,
        [BookDef, BookReviewsDef, BookCommentsDef, BookCommentsLikesDef],
        Options
      >
    >().toEqualTypeOf<BookDef>();

    expectTypeOf<
      MatchDocDefKeyByDelimiter<
        BookReviewsKey,
        [BookDef, BookReviewsDef, BookCommentsDef, BookCommentsLikesDef],
        Options
      >
    >().toEqualTypeOf<BookReviewsDef>();

    expectTypeOf<
      MatchDocDefKeyByDelimiter<
        BookCommentsKey,
        [BookDef, BookReviewsDef, BookCommentsDef, BookCommentsLikesDef],
        Options
      >
    >().toEqualTypeOf<BookCommentsDef>();

    expectTypeOf<
      MatchDocDefKeyByDelimiter<
        BookCommentsLikesKey,
        [BookDef, BookReviewsDef, BookCommentsDef, BookCommentsLikesDef],
        Options
      >
    >().toEqualTypeOf<BookCommentsLikesDef>();
  });
});

describe('KeyMatchFirst', () => {
  type BookKey = `book::${string}`;
  type BookReviewsKey = `book::${string}::reviews`;
  type BookCommentsKey = `book::${string}::comments`;
  type BookCommentsLikesKey = `book::${string}::comments::${string}::likes`;

  type BookDef = DocDef<BookKey, 'book'>;
  type BookReviewsDef = DocDef<BookReviewsKey, 'reviews'>;
  type BookCommentsDef = DocDef<BookCommentsKey, 'comments'>;
  type BookCommentsLikesDef = DocDef<BookCommentsLikesKey, 'comments::likes'>;

  it('should return the first key to match', () => {
    expectTypeOf<
      MatchDocDefKeyFirstMatch<
        BookKey,
        [BookDef, BookReviewsDef, BookCommentsDef, BookCommentsLikesDef]
      >
    >().toEqualTypeOf<BookDef>();

    expectTypeOf<
      MatchDocDefKeyFirstMatch<
        BookCommentsKey,
        [BookCommentsDef, BookDef, BookReviewsDef, BookCommentsLikesDef]
      >
    >().toEqualTypeOf<BookCommentsDef>();

    expectTypeOf<
      MatchDocDefKeyFirstMatch<
        BookCommentsKey,
        [BookDef, BookReviewsDef, BookCommentsDef, BookCommentsLikesDef]
      >
    >().toEqualTypeOf<BookDef>();
  });
});

describe('DocDefMatchingBody', () => {
  type Options = { keyDelimiter: '::' };
  type BookKey = `book::${string}`;
  type BookReviewsKey = `book::${string}::reviews`;
  type BookCommentsKey = `book::${string}::comments`;
  type BookCommentsLikesKey = `book::${string}::comments::${string}::likes`;

  type BookDef = DocDef<BookKey, { title: string }>;
  type BookReviewsDef = DocDef<BookReviewsKey, Array<{ note: number; text: string }>>;
  type BookCommentsDef = DocDef<BookCommentsKey, string[]>;
  type BookCommentsLikesDef = DocDef<
    BookCommentsLikesKey,
    Array<'like' | 'love' | 'excited'>
  >;

  type UserClusterTypes = {
    store: {
      library: {
        books: [BookReviewsDef, BookDef, BookCommentsDef, BookCommentsLikesDef];
      };
    };
  };

  it('should return a union of DocDef that match the requested body', () => {
    expectTypeOf<
      DocDefMatchingBody<string[], UserClusterTypes, 'store', 'library', 'books'>
    >().toEqualTypeOf<BookCommentsDef | BookCommentsLikesDef>();
  });
});
