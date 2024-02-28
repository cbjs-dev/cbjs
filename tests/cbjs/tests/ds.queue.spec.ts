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

import { CouchbaseError, CouchbaseQueue } from '@cbjsdev/cbjs';
import { createCouchbaseTest } from '@cbjsdev/vitest';

describe.shuffle('ds queue', async () => {
  const test = await createCouchbaseTest(({ useDocumentKey }) => ({
    testDocKey: useDocumentKey(),
  }));

  test('should create a queue object for a non-existing document', ({
    expect,
    serverTestContext,
    testDocKey,
  }) => {
    expect(serverTestContext.collection.queue(testDocKey)).toBeInstanceOf(CouchbaseQueue);
  });

  test('should return the size of the queue', async ({
    expect,
    serverTestContext,
    testDocKey,
  }) => {
    await serverTestContext.collection.insert(testDocKey, [10, 20, 30]);
    const queue = serverTestContext.collection.queue(testDocKey);

    await expect(queue.size()).resolves.toEqual(3);
  });

  test('should push a value to a queue', async ({
    expect,
    serverTestContext,
    testDocKey,
  }) => {
    const queue = serverTestContext.collection.queue(testDocKey);
    await queue.push(10);
    await expect(queue.size()).resolves.toBe(1);
  });

  test('should pop values from a queue, in order', async ({
    expect,
    serverTestContext,
    testDocKey,
  }) => {
    const queue = serverTestContext.collection.queue(testDocKey);
    await queue.push(10);
    await queue.push(20);
    await queue.push(30);

    await expect(queue.pop()).resolves.toEqual(10);
    await expect(queue.pop()).resolves.toEqual(20);
    await expect(queue.pop()).resolves.toEqual(30);

    await expect(queue.size()).resolves.toBe(0);
  });

  test('should throw CouchbaseError when poping an item from an empty, remote queue', async ({
    expect,
    serverTestContext,
    testDocKey,
  }) => {
    const queue = serverTestContext.collection.queue(testDocKey);
    await expect(queue.pop()).rejects.toThrow(CouchbaseError);
  });

  test('should throw CouchbaseError when poping an item from an empty, local queue', async ({
    expect,
    serverTestContext,
    testDocKey,
  }) => {
    const queue = serverTestContext.collection.queue(testDocKey);

    await queue.push(10);
    await queue.push(20);
    await queue.push(30);

    await queue.pop();
    await queue.pop();
    await queue.pop();

    await expect(queue.pop()).rejects.toThrow(CouchbaseError);
  });

  test('should throw CouchbaseError when getting the size of a binary document', async ({
    expect,
    serverTestContext,
    testDocKey,
  }) => {
    await serverTestContext.collection.insert(testDocKey, 'hello');
    const queue = serverTestContext.collection.queue(testDocKey);
    await expect(queue.size()).rejects.toThrowError(CouchbaseError);
  });
});
