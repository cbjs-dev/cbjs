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

import { CouchbaseCas } from '@cbjsdev/cbjs';
import { createCouchbaseTest, getRandomId } from '@cbjsdev/vitest';

describe('CouchbaseCas', { timeout: 20_000 }, async () => {
  const test = await createCouchbaseTest();

  test('CouchbaseCas.isCasInput should accept a value returned by a KV get', async ({
    expect,
    serverTestContext,
  }) => {
    const testDocId = getRandomId();
    await serverTestContext.collection.insert(testDocId, { a: 'a' });
    const { cas } = await serverTestContext.collection.get(testDocId);

    expect(CouchbaseCas.isCasInput(cas)).toBe(true);
  });
});
