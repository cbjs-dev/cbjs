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
import { invariant } from '@cbjs/shared';
import { beforeEach, describe } from 'vitest';
import { createCouchbaseTest, TestFixtures } from '@cbjs/vitest';

import { DocumentNotFoundError, LookupInSpec, PathNotFoundError } from '@cbjs/cbjs';
import { getPool } from '@cbjs/http-client';
import { apiConfig } from '../setupTests';
import { ServerFeatures, serverSupportsFeatures } from '../utils/serverFeature';

describe.shuffle('kv lookupIn', async () => {
  const test = await createCouchbaseTest(async ({ useDocumentKey }) => {
    return {
      testDocKey: useDocumentKey(),
      testDocContent: {
        int: 14,
        anotherInt: 2,
        str: 'hello',
        arr: [1, 2, 3],
      },
      replicaNumber: (await getPool(apiConfig).then((p) => p.nodes.length)) - 1,
    };
  });

  beforeEach<TestFixtures<typeof test>>(async function ({
    serverTestContext,
    testDocKey,
    testDocContent,
  }) {
    await serverTestContext.collection.insert(testDocKey, testDocContent, {
      timeout: 5000,
    });
  });

  test('should lookupIn given specs', async ({
    serverTestContext,
    testDocKey,
    expect,
  }) => {
    const res = await serverTestContext.collection.lookupIn(testDocKey, [
      LookupInSpec.get('str'),
      LookupInSpec.get('int'),
      LookupInSpec.get('missingPath'),
      LookupInSpec.exists('missingPath'),
    ]);

    expect(res.content).toBeInstanceOf(Array);
    expect(res.content).toHaveLength(4);

    expect(res.content[0].error).toBeNull();
    expect(res.content[0].value).toEqual('hello');

    expect(res.content[1].error).toBeNull();
    expect(res.content[1].value).toEqual(14);

    expect(res.content[2].error).toBeInstanceOf(PathNotFoundError);
    expect(res.content[2].error).toHaveProperty('context', undefined);
    expect(res.content[2].value).toBeUndefined();

    expect(res.content[3].error).toBeNull();
    expect(res.content[3].value).toEqual(false);

    // Support legacy API
    expect(res.content).toStrictEqual(res.results);
  });

  test('should throw DocumentNotFoundError when lookupIn a missing document', async ({
    serverTestContext,
    testDocKey,
    expect,
  }) => {
    expect.hasAssertions();

    try {
      await serverTestContext.collection.lookupIn('missingDoc', [
        LookupInSpec.get('str'),
      ]);
    } catch (err) {
      expect(err).toBeInstanceOf(DocumentNotFoundError);
      invariant(err instanceof DocumentNotFoundError);
      // TODO uncomment once the issue is fixed: JSCBC-1228
      // expect(err.context).toBeInstanceOf(KeyValueErrorContext);
    }
  });

  test.runIf(serverSupportsFeatures(ServerFeatures.Xattr))(
    'should be able to lookup `revid` with accessDeleted successfully',
    async ({ serverTestContext, testDocKey, expect }) => {
      await serverTestContext.collection.remove(testDocKey);

      const res = await serverTestContext.collection.lookupIn(
        testDocKey,
        [LookupInSpec.exists('$document.revid', { xattr: true })],
        {
          accessDeleted: true,
        }
      );

      expect(res.cas).toBeNonZeroCAS();
      expect(res.content[0].error).toBeNull();
      expect(res.content[0].value).toEqual(true);
    }
  );
});