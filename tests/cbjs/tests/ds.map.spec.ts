/*
 * Copyright (c) 2023-Present Jonathan MASSUCHETTI <jonathan.massuchetti@dappit.fr>.
 * Copyright (c) 2013-Present Couchbase Inc.
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
import { describe } from 'vitest';

import { CouchbaseError, CouchbaseMap } from '@cbjsdev/cbjs';
import { createCouchbaseTest } from '@cbjsdev/vitest';

describe.shuffle('ds map', async () => {
  const test = await createCouchbaseTest(({ useDocumentKey }) => ({
    testDocKey: useDocumentKey(),
  }));

  test('should create a map object for a non-existing document', ({
    expect,
    serverTestContext,
    testDocKey,
  }) => {
    expect(serverTestContext.collection.map(testDocKey)).toBeInstanceOf(CouchbaseMap);
  });

  test('should treat an existing map-like object as a map', async ({
    expect,
    serverTestContext,
    testDocKey,
  }) => {
    await serverTestContext.collection.insert(testDocKey, { a: 10, b: 20, c: 30 });
    const map = serverTestContext.collection.map(testDocKey);

    await expect(map.getAll()).resolves.toEqual({ a: 10, b: 20, c: 30 });
  });

  test('should return the size of the map', async ({
    expect,
    serverTestContext,
    testDocKey,
  }) => {
    await serverTestContext.collection.insert(testDocKey, { a: 10, b: 20, c: 30 });
    const map = serverTestContext.collection.map(testDocKey);

    await expect(map.size()).resolves.toEqual(3);
  });

  test('should retrieve an item by its key', async ({
    expect,
    serverTestContext,
    testDocKey,
  }) => {
    await serverTestContext.collection.insert(testDocKey, { a: 10, b: 20, c: 30 });
    const map = serverTestContext.collection.map(testDocKey);

    await expect(map.get('a')).resolves.toEqual(10);
  });

  test('should throw CouchbaseError when retrieving a missing key', async ({
    expect,
    serverTestContext,
    testDocKey,
  }) => {
    await serverTestContext.collection.insert(testDocKey, { a: 10, b: 20, c: 30 });
    const map = serverTestContext.collection.map(testDocKey);

    await expect(map.get('missingKey')).rejects.toThrowError(CouchbaseError);
  });

  test('should check the existence of a key', async ({
    expect,
    serverTestContext,
    testDocKey,
  }) => {
    await serverTestContext.collection.insert(testDocKey, { a: 10, b: 20, c: 30 });

    const map = serverTestContext.collection.map(testDocKey);
    await expect(map.exists('a')).resolves.toBe(true);
    await expect(map.exists('missingKey')).resolves.toBe(false);
  });

  test('should set a key and its value', async ({
    expect,
    serverTestContext,
    testDocKey,
  }) => {
    const map = serverTestContext.collection.map(testDocKey);
    await map.set('a', 10);
    await map.set('b', 20);

    await expect(map.getAll()).resolves.toEqual({ a: 10, b: 20 });
  });

  test('should remove a key from the map', async ({
    expect,
    serverTestContext,
    testDocKey,
  }) => {
    await serverTestContext.collection.insert(testDocKey, { a: 10, b: 20, c: 30 });

    const map = serverTestContext.collection.map(testDocKey);
    await expect(map.remove('a')).resolves.toBeUndefined();
  });

  test('should throw CouchbaseError when removing a non-existing key', async ({
    expect,
    serverTestContext,
    testDocKey,
  }) => {
    await serverTestContext.collection.insert(testDocKey, { a: 10, b: 20, c: 30 });

    const map = serverTestContext.collection.map(testDocKey);
    await expect(map.remove('missingKey')).rejects.toThrowError(CouchbaseError);
  });

  test('should iterate the map through an async for loop', async ({
    expect,
    serverTestContext,
    testDocKey,
  }) => {
    expect.hasAssertions();

    const obj = Object.fromEntries(
      Array(100)
        .fill(null)
        .map((v, i) => [`key${i}`, `Item ${i}`])
    );
    await serverTestContext.collection.insert(testDocKey, obj);

    const map = serverTestContext.collection.map(testDocKey);

    let i = 0;
    for await (const [item, key] of map) {
      expect(key).toEqual(`key${i}`);
      expect(item).toEqual(`Item ${i}`);
      i++;
    }

    expect(i).toEqual(100);
  });

  test('should iterate the map through an async forEach', async ({
    expect,
    serverTestContext,
    testDocKey,
  }) => {
    expect.hasAssertions();

    const entries = Array(100)
      .fill(null)
      .map((v, i) => [`key${i}`, `Item ${i}`]);
    const obj = Object.fromEntries(entries);

    await serverTestContext.collection.insert(testDocKey, obj);

    const map = serverTestContext.collection.map(testDocKey);

    let i = 0;
    await map.forEach((item, key) => {
      expect(key).toEqual(`key${i}`);
      expect(item).toEqual(`Item ${i}`);
      i++;
    });

    expect(i).toEqual(100);
  });

  test('should throw CouchbaseError when getting the size of a binary document', async ({
    expect,
    serverTestContext,
    testDocKey,
  }) => {
    await serverTestContext.collection.insert(testDocKey, 'hello');
    const map = serverTestContext.collection.map(testDocKey);
    await expect(map.size()).rejects.toThrowError(CouchbaseError);
  });
});
