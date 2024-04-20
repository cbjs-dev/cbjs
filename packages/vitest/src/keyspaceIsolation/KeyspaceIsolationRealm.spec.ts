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

import { KeyspaceIsolationRealm } from './KeyspaceIsolationRealm';

describe('KeyspaceIsolationRealm', () => {
  it('should tell if a bucket is isolated or not', ({ expect }) => {
    const kir = new KeyspaceIsolationRealm('taskId');

    expect(kir.isBucketIsolated('b')).toBe(false);

    kir.setIsolatedBucketName('b', 'b_1');
    expect(kir.isBucketIsolated('b')).toBe(true);
  });

  it('should tell if a scope is isolated or not', ({ expect }) => {
    const kir = new KeyspaceIsolationRealm('taskId');

    expect(kir.isScopeIsolated('b', 's')).toBe(false);

    kir.setIsolatedBucketName('b', 'b_1');
    kir.setIsolatedScopeName('b', 's', 's_1');

    expect(kir.isScopeIsolated('b', 's')).toBe(true);
  });

  it('should tell if a collection is isolated or not', ({ expect }) => {
    const kir = new KeyspaceIsolationRealm('taskId');

    expect(kir.isCollectionIsolated('b', 's', 'c')).toBe(false);

    kir.setIsolatedBucketName('b', 'b_1');
    kir.setIsolatedScopeName('b', 's', 's_1');
    kir.setIsolatedCollectionName('b', 's', 'c', 'c_1');

    expect(kir.isCollectionIsolated('b', 's', 'c')).toBe(true);
  });

  it('should throw an error when isolating a bucket twice', ({ expect }) => {
    const kir = new KeyspaceIsolationRealm('taskId');
    kir.setIsolatedBucketName('b', 'b_1');
    expect(() => kir.setIsolatedBucketName('b', 'b_2')).toThrowError();

    expect(kir.getIsolatedBucketName('b')).toEqual('b_1');
  });

  it('should throw an error when isolating a scope twice', ({ expect }) => {
    const kir = new KeyspaceIsolationRealm('taskId');
    kir.setIsolatedBucketName('b', 'b_1');
    kir.setIsolatedScopeName('b', 's', 's_1');

    expect(() => kir.setIsolatedScopeName('b', 's', 's_2')).toThrowError();

    expect(kir.getIsolatedScopeName('b', 's')).toEqual('s_1');
  });

  it('should throw an error when isolating a collection twice', ({ expect }) => {
    const kir = new KeyspaceIsolationRealm('taskId');
    kir.setIsolatedBucketName('b', 'b_1');
    kir.setIsolatedScopeName('b', 's', 's_1');
    kir.setIsolatedCollectionName('b', 's', 'c', 'c_1');

    expect(() => kir.setIsolatedCollectionName('b', 's', 'c', 'c_2')).toThrowError();

    expect(kir.getIsolatedCollectionName('b', 's', 'c')).toEqual('c_1');
  });

  it('should return the original name of the bucket', ({ expect }) => {
    const kir = new KeyspaceIsolationRealm('taskId');
    kir.setIsolatedBucketName('b', 'b_1');

    expect(kir.getOriginalBucketName('b_1')).toEqual('b');
  });

  it('should return the original name of the scope', ({ expect }) => {
    const kir = new KeyspaceIsolationRealm('taskId');
    kir.setIsolatedBucketName('b', 'b_1');
    kir.setIsolatedScopeName('b', 's', 's_1');

    expect(kir.getOriginalScopeName('b', 's_1')).toEqual('s');
  });

  it('should return the original name of the collection', ({ expect }) => {
    const kir = new KeyspaceIsolationRealm('taskId');
    kir.setIsolatedBucketName('b', 'b_1');
    kir.setIsolatedScopeName('b', 's', 's_1');
    kir.setIsolatedCollectionName('b', 's', 'c', 'c_1');

    expect(kir.getOriginalCollectionName('b', 's', 'c_1')).toEqual('c');
  });
});
