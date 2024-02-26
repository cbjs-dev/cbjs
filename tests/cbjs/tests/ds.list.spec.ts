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

import { CouchbaseError, CouchbaseList } from '@cbjsdev/cbjs';
import { createCouchbaseTest } from '@cbjsdev/vitest';

describe.shuffle('ds list', async () => {
  const test = await createCouchbaseTest(({ useDocumentKey }) => ({
    testDocKey: useDocumentKey(),
  }));

  test('should create a list object for a non-existing document', ({
    expect,
    serverTestContext,
    testDocKey,
  }) => {
    expect(serverTestContext.collection.list(testDocKey)).toBeInstanceOf(CouchbaseList);
  });

  test('should retrieve the whole list', async ({
    expect,
    serverTestContext,
    testDocKey,
  }) => {
    await serverTestContext.collection.insert(testDocKey, [10, 20, 30]);
    const list = serverTestContext.collection.list(testDocKey);

    await expect(list.getAll()).resolves.toEqual([10, 20, 30]);
  });

  test('should return the size of the list', async ({
    expect,
    serverTestContext,
    testDocKey,
  }) => {
    await serverTestContext.collection.insert(testDocKey, [10, 20, 30]);
    const list = serverTestContext.collection.list(testDocKey);

    await expect(list.size()).resolves.toEqual(3);
  });

  test('should access the index of an existing array', async ({
    expect,
    serverTestContext,
    testDocKey,
  }) => {
    await serverTestContext.collection.insert(testDocKey, [10, 20, 30]);
    const list = serverTestContext.collection.list(testDocKey);

    await expect(list.getAt(1)).resolves.toEqual(20);
    await expect(list.getAt(-1)).resolves.toEqual(30);
  });

  test('should return the index of a value inside a list', async ({
    expect,
    serverTestContext,
    testDocKey,
  }) => {
    await serverTestContext.collection.insert(testDocKey, [10, 20, 30]);

    const list = serverTestContext.collection.list(testDocKey);
    await expect(list.indexOf(10)).resolves.toBe(0);
  });

  test('should return -1 if the value is not in the list', async ({
    expect,
    serverTestContext,
    testDocKey,
  }) => {
    await serverTestContext.collection.insert(testDocKey, [10, 20, 30]);

    const list = serverTestContext.collection.list(testDocKey);
    await expect(list.indexOf('missingItem')).resolves.toBe(-1);
  });

  test('should throw CouchbaseError when accessing an invalid index', async ({
    expect,
    serverTestContext,
    testDocKey,
  }) => {
    const list = serverTestContext.collection.list(testDocKey);
    await list.push(10);
    await expect(list.getAt(99)).rejects.toThrowError(CouchbaseError);
    await expect(list.getAt(-2)).rejects.toThrowError(CouchbaseError);
  });

  test('should push a value to a list', async ({
    expect,
    serverTestContext,
    testDocKey,
  }) => {
    const list = serverTestContext.collection.list(testDocKey);
    await list.push(10);
    await expect(list.size()).resolves.toBe(1);
  });

  test('should unshift a value to a list', async ({
    expect,
    serverTestContext,
    testDocKey,
  }) => {
    const list = serverTestContext.collection.list(testDocKey);
    await list.push(20);
    await list.unshift(10);
    await expect(list.size()).resolves.toBe(2);
    await expect(list.getAt(0)).resolves.toBe(10);
    await expect(list.getAt(1)).resolves.toBe(20);
  });

  test('should remove the item at the index', async ({
    expect,
    serverTestContext,
    testDocKey,
  }) => {
    await serverTestContext.collection.insert(testDocKey, [10, 20, 30]);

    const list = serverTestContext.collection.list(testDocKey);
    await expect(list.removeAt(0)).resolves.toBeUndefined();
    await expect(list.size()).resolves.toBe(2);

    await expect(list.removeAt(-1)).resolves.toBeUndefined();
    await expect(list.size()).resolves.toBe(1);
  });

  test('should throw CouchbaseError when removing the item an a non-existing index', async ({
    expect,
    serverTestContext,
    testDocKey,
  }) => {
    await serverTestContext.collection.insert(testDocKey, [10, 20, 30]);

    const list = serverTestContext.collection.list(testDocKey);
    await expect(list.removeAt(99)).rejects.toThrowError(CouchbaseError);
  });

  test('should iterate the list through an async for loop', async ({
    expect,
    serverTestContext,
    testDocKey,
  }) => {
    expect.hasAssertions();

    const arr = Array(100)
      .fill(null)
      .map((v, i) => i);
    await serverTestContext.collection.insert(testDocKey, arr);
    const list = serverTestContext.collection.list(testDocKey);

    let i = 0;
    for await (const item of list) {
      expect(item).toEqual(i);
      i++;
    }

    expect(i).toEqual(100);
  });

  test('should iterate the list through an async forEach', async ({
    expect,
    serverTestContext,
    testDocKey,
  }) => {
    expect.hasAssertions();

    const arr = Array(100)
      .fill(null)
      .map((v, i) => i);
    await serverTestContext.collection.insert(testDocKey, arr);

    const list = serverTestContext.collection.list(testDocKey);

    let i = 0;
    await list.forEach((item) => {
      expect(item).toEqual(i);
      i++;
    });

    expect(i).toEqual(100);
  });
});
