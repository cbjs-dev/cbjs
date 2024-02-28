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

import { CouchbaseError, CouchbaseSet } from '@cbjsdev/cbjs';
import { createCouchbaseTest } from '@cbjsdev/vitest';

describe.shuffle('ds set', async () => {
  const test = await createCouchbaseTest(({ useDocumentKey }) => ({
    testDocKey: useDocumentKey(),
  }));

  test('should create a set object for a non-existing document', ({
    expect,
    serverTestContext,
    testDocKey,
  }) => {
    expect(serverTestContext.collection.set(testDocKey)).toBeInstanceOf(CouchbaseSet);
  });

  test('should return the size of the set', async ({
    expect,
    serverTestContext,
    testDocKey,
  }) => {
    await serverTestContext.collection.insert(testDocKey, [10, 20, 30]);
    const set = serverTestContext.collection.set(testDocKey);

    await expect(set.size()).resolves.toEqual(3);
  });

  test('should return the values contained in the set', async ({
    expect,
    serverTestContext,
    testDocKey,
  }) => {
    await serverTestContext.collection.insert(testDocKey, [10, 20, 30]);
    const set = serverTestContext.collection.set(testDocKey);

    await expect(set.values()).resolves.toEqual([10, 20, 30]);
  });

  test('should add a value to a set', async ({
    expect,
    serverTestContext,
    testDocKey,
  }) => {
    const set = serverTestContext.collection.set(testDocKey);
    await set.add(10);
    await expect(set.size()).resolves.toBe(1);
  });

  test('should remove a value from a set', async ({
    expect,
    serverTestContext,
    testDocKey,
  }) => {
    await serverTestContext.collection.insert(testDocKey, [10, 20, 30]);
    const set = serverTestContext.collection.set(testDocKey);

    await expect(set.remove(10)).resolves.toBeUndefined();
    await expect(set.size()).resolves.toBe(2);
  });

  test('should throw CouchbaseError when removing a missing item', async ({
    expect,
    serverTestContext,
    testDocKey,
  }) => {
    await serverTestContext.collection.insert(testDocKey, [10, 20, 30]);
    const set = serverTestContext.collection.set(testDocKey);

    await expect(set.remove(99)).rejects.toThrowError(CouchbaseError);
  });

  test('should throw CouchbaseError when operating on a missing document', async ({
    expect,
    serverTestContext,
    testDocKey,
  }) => {
    const set = serverTestContext.collection.set('missingDoc');
    await expect(set.size()).rejects.toThrowError(CouchbaseError);
  });

  test('should throw CouchbaseError when getting the size of a binary document', async ({
    expect,
    serverTestContext,
    testDocKey,
  }) => {
    await serverTestContext.collection.insert(testDocKey, 'hello');
    const set = serverTestContext.collection.set(testDocKey);
    await expect(set.size()).rejects.toThrowError(CouchbaseError);
  });
});
