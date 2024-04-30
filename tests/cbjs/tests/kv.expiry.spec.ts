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

import { InvalidArgumentError, LookupInMacro } from '@cbjsdev/cbjs';
import { invariant } from '@cbjsdev/shared';
import { createCouchbaseTest } from '@cbjsdev/vitest';

import { ServerFeatures, serverSupportsFeatures } from '../utils/serverFeature.js';

describe.runIf(serverSupportsFeatures(ServerFeatures.Xattr))('kv expiry', async () => {
  const test = await createCouchbaseTest();

  const fiftyYears = 50 * 365 * 24 * 60 * 60;
  const thirtyDays = 30 * 24 * 60 * 60;
  const oneSecondAgo = Math.floor(Date.now() / 1000) - 1;
  const expiryList = [
    fiftyYears + 1,
    fiftyYears,
    thirtyDays - 1,
    thirtyDays,
    oneSecondAgo,
    60,
  ];

  test('should throw an InvalidArgumentError when upserting a document with negative expiry', async ({
    expect,
    serverTestContext,
    useDocumentKey,
  }) => {
    const docKey = useDocumentKey();
    await expect(
      serverTestContext.collection.upsert(
        docKey,
        { title: 'expiry test' },
        { expiry: -1 }
      )
    ).rejects.toThrowError(InvalidArgumentError);
  });

  expiryList.forEach((expiry) => {
    test(`should successfully upsert a document with expiry=${expiry}`, async ({
      serverTestContext,
      expect,
      useDocumentKey,
    }) => {
      const before = Math.floor(Date.now() / 1000) - 1;
      const docKey = useDocumentKey();
      await serverTestContext.collection.upsert(
        docKey,
        { title: 'expiry test' },
        { expiry }
      );

      const {
        cas,
        content: [{ value: docExpiry }],
      } = await serverTestContext.collection
        .lookupIn(docKey)
        .get(LookupInMacro.Expiry, { xattr: true });

      expect(cas).toBeNonZeroCAS();

      const after = Math.floor(Date.now() / 1000) + 1;

      invariant(docExpiry);

      expect(before + expiry).toBeLessThanOrEqual(docExpiry);
      expect(docExpiry).toBeLessThanOrEqual(expiry + after);
    });
  });
});
