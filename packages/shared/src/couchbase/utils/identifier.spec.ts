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
import { describe, it } from 'vitest';

import { isValidBucketName, parseKeyspacePath, resolveKeyspace } from './identifier';

describe('isValidBucketName', () => {
  it('should return true with a valid bucket name', ({ expect }) => {
    expect(isValidBucketName('valid')).toBe(true);
    expect(isValidBucketName('bond007')).toBe(true);
    expect(isValidBucketName('my.dad.text.like.that')).toBe(true);
    expect(isValidBucketName('30%_of_the_time-it.works.all.the.time')).toBe(true);
  });

  it('should return false with an invalid bucket name', ({ expect }) => {
    expect(isValidBucketName('.net')).toBe(false);
    expect(isValidBucketName('foo`bar')).toBe(false);
    expect(isValidBucketName('yo/lo')).toBe(false);
  });
});

describe('parseKeyspacePath', () => {
  it('should parse bucket name', ({ expect }) => {
    expect(parseKeyspacePath('store')).toEqual(['store']);
  });

  it('should parse quoted bucket name', ({ expect }) => {
    expect(parseKeyspacePath('`store`')).toEqual(['store']);
  });

  it('should parse quoted bucket name containing a dot', ({ expect }) => {
    expect(parseKeyspacePath('`this.dot`')).toEqual(['this.dot']);
  });

  it('should parse bucket name and a scope name', ({ expect }) => {
    expect(parseKeyspacePath('store.library')).toEqual(['store', 'library']);
  });

  it('should parse a quoted bucket name containing a dot and a scope name', ({
    expect,
  }) => {
    expect(parseKeyspacePath('`this.dot`.library')).toEqual(['this.dot', 'library']);
  });

  it('should parse a quoted bucket name and a quoted scope name', ({ expect }) => {
    expect(parseKeyspacePath('`store`.`library`')).toEqual(['store', 'library']);
  });

  it('should parse a quoted bucket name containing a dot and a quoted scope name', ({
    expect,
  }) => {
    expect(parseKeyspacePath('`this.dot`.`library`')).toEqual(['this.dot', 'library']);
  });

  it('should parse bucket name and a quoted scope name', ({ expect }) => {
    expect(parseKeyspacePath('store.`library`')).toEqual(['store', 'library']);
  });

  it('should parse a full path', ({ expect }) => {
    expect(parseKeyspacePath('store.library.books')).toEqual([
      'store',
      'library',
      'books',
    ]);
  });

  it('should parse a full path with quoted identifiers', ({ expect }) => {
    expect(parseKeyspacePath('`store`.`library`.`books`')).toEqual([
      'store',
      'library',
      'books',
    ]);
  });

  it('should parse a full path with bucket name containing a dot', ({ expect }) => {
    expect(parseKeyspacePath('`this.dot`.library.books')).toEqual([
      'this.dot',
      'library',
      'books',
    ]);
  });
});

describe('resolveKeyspace', () => {
  it('should return full keyspace with context untouched', ({ expect }) => {
    expect(
      resolveKeyspace(['store', 'library', 'books'], {
        bucket: 'foo',
        scope: 'bar',
      })
    ).toEqual({ bucket: 'store', scope: 'library', collection: 'books' });
  });

  it('should return apply the context to keyspace when unscoped', ({ expect }) => {
    expect(
      resolveKeyspace(['books'], {
        bucket: 'foo',
        scope: 'bar',
      })
    ).toEqual({ bucket: 'foo', scope: 'bar', collection: 'books' });
  });

  it('should return the keyspace as is when no context is provided', ({ expect }) => {
    expect(resolveKeyspace(['store', 'library', 'books'])).toEqual({
      bucket: 'store',
      scope: 'library',
      collection: 'books',
    });
  });
});
