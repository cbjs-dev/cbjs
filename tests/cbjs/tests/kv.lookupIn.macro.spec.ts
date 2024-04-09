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
import { beforeEach, describe } from 'vitest';

import { LookupInMacro, LookupInSpec } from '@cbjsdev/cbjs';
import { invariant } from '@cbjsdev/shared';
import { createCouchbaseTest, TestFixtures } from '@cbjsdev/vitest';

import { ServerFeatures, serverSupportsFeatures } from '../utils/serverFeature';

describe
  .runIf(serverSupportsFeatures(ServerFeatures.Xattr))
  .shuffle('kv lookupIn macro', async () => {
    const test = await createCouchbaseTest(async ({ useDocumentKey }) => {
      return {
        testDocKey: useDocumentKey(),
        testDocContent: {
          int: 14,
          anotherInt: 2,
          str: 'hello',
          arr: [1, 2, 3],
        },
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

    test(`should retrieve LookupInMacro values`, async ({
      serverTestContext,
      testDocKey,
      expect,
    }) => {
      const { content: docContent } = await serverTestContext.collection
        .lookupIn(testDocKey)
        .get(LookupInMacro.Document, { xattr: true });

      const [{ value: macroDocument }] = docContent;

      invariant(macroDocument);

      const res = await serverTestContext.collection.lookupIn(testDocKey, [
        LookupInSpec.get(LookupInMacro.Cas, { xattr: true }),
        LookupInSpec.get(LookupInMacro.Expiry, { xattr: true }),
        LookupInSpec.get(LookupInMacro.IsDeleted, { xattr: true }),
        LookupInSpec.get(LookupInMacro.LastModified, { xattr: true }),
        LookupInSpec.get(LookupInMacro.RevId, { xattr: true }),
        LookupInSpec.get(LookupInMacro.SeqNo, { xattr: true }),
        LookupInSpec.get(LookupInMacro.ValueSizeBytes, { xattr: true }),
      ]);

      const [
        { value: macroCas },
        { value: macroExpiry },
        { value: macroIsDeleted },
        { value: macroLastModified },
        { value: macroRevId },
        { value: macroSeqNo },
        { value: macroValueSizeBytes },
      ] = res.content;

      expect(macroCas).toEqual(macroDocument.CAS);
      expect(macroExpiry).toEqual(macroDocument.exptime);
      expect(macroIsDeleted).toEqual(macroDocument.deleted);
      expect(macroLastModified).toEqual(macroDocument.last_modified);
      expect(macroRevId).toEqual(macroDocument.revid);
      expect(macroSeqNo).toEqual(macroDocument.seqno);
      expect(macroValueSizeBytes).toEqual(macroDocument.value_bytes);

      expect(macroCas?.startsWith('0x')).toBe(true);
      expect(macroSeqNo?.startsWith('0x')).toBe(true);
    });

    test(`should retrieve LookupInMacro values using a chained lookup`, async ({
      serverTestContext,
      testDocKey,
      expect,
    }) => {
      const { content: docContent } = await serverTestContext.collection
        .lookupIn(testDocKey)
        .get(LookupInMacro.Document, { xattr: true });

      const [{ value: macroDocument }] = docContent;

      invariant(macroDocument);

      const res = await serverTestContext.collection
        .lookupIn(testDocKey)
        .get(LookupInMacro.Cas, { xattr: true })
        .get(LookupInMacro.Expiry, { xattr: true })
        .get(LookupInMacro.IsDeleted, { xattr: true })
        .get(LookupInMacro.LastModified, { xattr: true })
        .get(LookupInMacro.RevId, { xattr: true })
        .get(LookupInMacro.SeqNo, { xattr: true })
        .get(LookupInMacro.ValueSizeBytes, { xattr: true });
      const [
        { value: macroCas },
        { value: macroExpiry },
        { value: macroIsDeleted },
        { value: macroLastModified },
        { value: macroRevId },
        { value: macroSeqNo },
        { value: macroValueSizeBytes },
      ] = res.content;

      expect(macroCas).toEqual(macroDocument.CAS);
      expect(macroExpiry).toEqual(macroDocument.exptime);
      expect(macroIsDeleted).toEqual(macroDocument.deleted);
      expect(macroLastModified).toEqual(macroDocument.last_modified);
      expect(macroRevId).toEqual(macroDocument.revid);
      expect(macroSeqNo).toEqual(macroDocument.seqno);
      expect(macroValueSizeBytes).toEqual(macroDocument.value_bytes);

      expect(macroCas?.startsWith('0x')).toBe(true);
      expect(macroSeqNo?.startsWith('0x')).toBe(true);
    });
  });
