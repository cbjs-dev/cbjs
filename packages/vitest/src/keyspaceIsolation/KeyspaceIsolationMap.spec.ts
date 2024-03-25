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

import { KeyspaceIsolationMap } from './KeyspaceIsolationMap';

describe('KeyspaceIsolationMap', () => {
  it('should tell if a bucket is isolated or not', ({ expect }) => {
    const kim = new KeyspaceIsolationMap();

    expect(kim.isBucketIsolated('b')).toBe(false);

    kim.isolateBucketName('b');
    expect(kim.isBucketIsolated('b')).toBe(true);
  });

  it('should tell if a scope is isolated or not', ({ expect }) => {
    const kim = new KeyspaceIsolationMap();

    expect(kim.isScopeIsolated('b', 's')).toBe(false);

    kim.isolateScopeName('b', 's');
    expect(kim.isScopeIsolated('b', 's')).toBe(true);
  });

  it('should tell if a collection is isolated or not', ({ expect }) => {
    const kim = new KeyspaceIsolationMap();

    expect(kim.isCollectionIsolated('b', 's', 'c')).toBe(false);

    kim.isolateCollectionName('b', 's', 'c');
    expect(kim.isCollectionIsolated('b', 's', 'c')).toBe(true);
  });

  it('should isolate the bucket when isolating a scope', ({ expect }) => {
    const kim = new KeyspaceIsolationMap();

    kim.isolateScopeName('b', 's');

    expect(kim.isScopeIsolated('b', 's')).toBe(true);
    expect(kim.isBucketIsolated('b')).toBe(true);
  });

  it('should isolate the bucket and scope when isolating a collection', ({ expect }) => {
    const kim = new KeyspaceIsolationMap();

    kim.isolateCollectionName('b', 's', 'c');

    expect(kim.isCollectionIsolated('b', 's', 'c')).toBe(true);
    expect(kim.isScopeIsolated('b', 's')).toBe(true);
    expect(kim.isBucketIsolated('b')).toBe(true);
  });

  it('should return the isolated name of a bucket', ({ expect }) => {
    const kim = new KeyspaceIsolationMap();

    expect(kim.isolateBucketName('b')).toBeTypeOf('string');
    expect(kim.isolateBucketName('b')).not.equal('b');
  });

  it('should return the isolated name of a scope', ({ expect }) => {
    const kim = new KeyspaceIsolationMap();

    expect(kim.isolateScopeName('b', 's')).toBeTypeOf('string');
    expect(kim.isolateScopeName('b', 's')).not.equal('s');
  });

  it('should return the isolated name of a collection', ({ expect }) => {
    const kim = new KeyspaceIsolationMap();

    expect(kim.isolateCollectionName('b', 's', 'c')).toBeTypeOf('string');
    expect(kim.isolateCollectionName('b', 's', 'c')).not.equal('c');
  });

  it('should keep the existing isolated name when isolating a bucket twice', ({
    expect,
  }) => {
    const kim = new KeyspaceIsolationMap();
    const isolatedName = kim.isolateBucketName('b');

    expect(kim.isolateBucketName('b')).toEqual(isolatedName);
  });

  it('should keep the existing isolated name when isolating a scope twice', ({
    expect,
  }) => {
    const kim = new KeyspaceIsolationMap();
    const isolatedName = kim.isolateScopeName('b', 's');

    expect(kim.isolateScopeName('b', 's')).toEqual(isolatedName);
  });

  it('should keep the existing isolated name when isolating a bucket twice', ({
    expect,
  }) => {
    const kim = new KeyspaceIsolationMap();
    const isolatedName = kim.isolateCollectionName('b', 's', 'c');

    expect(kim.isolateCollectionName('b', 's', 'c')).toEqual(isolatedName);
  });

  it('should return the original name of the bucket', ({ expect }) => {
    const kim = new KeyspaceIsolationMap();
    const isolatedName = kim.isolateBucketName('b');
    kim.isolateBucketName('foo');

    expect(kim.getOriginalBucketName(isolatedName)).toEqual('b');
  });

  it('should return the original name of the scope', ({ expect }) => {
    const kim = new KeyspaceIsolationMap();
    const isolatedName = kim.isolateScopeName('b', 's');

    kim.isolateScopeName('b', 'foo');

    expect(kim.getOriginalScopeName('b', isolatedName)).toEqual('s');
  });

  it('should return the original name of the collection', ({ expect }) => {
    const kim = new KeyspaceIsolationMap();
    const isolatedName = kim.isolateCollectionName('b', 's', 'c');

    kim.isolateCollectionName('b', 's', 'foo');

    expect(kim.getOriginalCollectionName('b', 's', isolatedName)).toEqual('c');
  });

  it('should keep the existing isolated bucket name when isolating two scopes in the same bucket', ({
    expect,
  }) => {
    const kim = new KeyspaceIsolationMap();
    kim.isolateScopeName('b', 's');

    const isolatedName = kim.getIsolatedBucketName('b');

    kim.isolateScopeName('b', 'foo');

    expect(isolatedName).toEqual(kim.getIsolatedBucketName('b'));
  });

  it('should keep the existing isolated scope name when isolating two collections in the same scope', ({
    expect,
  }) => {
    const kim = new KeyspaceIsolationMap();
    kim.isolateCollectionName('b', 's', 'c');

    const isolatedName = kim.getIsolatedScopeName('b', 's');

    kim.isolateCollectionName('b', 's', 'foo');

    expect(isolatedName).toEqual(kim.getIsolatedScopeName('b', 's'));
  });
});
