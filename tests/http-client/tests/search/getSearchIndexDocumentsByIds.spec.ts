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
import { describe } from 'vitest';

import { getSearchIndexDocumentsByIds, ServerFeatures } from '@cbjsdev/http-client';
import { getRandomId, waitFor } from '@cbjsdev/shared';
import { createCouchbaseTest } from '@cbjsdev/vitest';

import { serverSupportsFeatures } from '../../utils/serverFeature.js';
import getIndexDefinition from './getIndexDefinition.js';

describe.runIf(serverSupportsFeatures(ServerFeatures.ScopeSearchIndexManagement))(
  'getSearchIndexDocumentsByIds',
  { timeout: 100_000 },
  async () => {
    const test = await createCouchbaseTest();

    test(
      'should return all the documents',
      async ({
        expect,
        useScopedSearchIndex,
        useDocumentKey,
        useScope,
        useCollection,
        serverTestContext,
        apiConfig,
      }) => {
        const scopeName = await useScope();
        const collectionName = await useCollection({ scopeName });

        const testDocKey = useDocumentKey();
        const testDocBody = {
          title: 'Couchbase',
          tagline: 'No Equal - The Cloud database for modern applications',
          description:
            'Couchbase is a NoSQL, distributed database focused on performances at scale.',
        };

        const testDocKey2 = useDocumentKey();
        const testDocBody2 = {
          title: 'Magma',
          description: 'The latest storage engine from Couchbase.',
        };

        const collection = serverTestContext.bucket
          .scope(scopeName)
          .collection(collectionName);
        await collection.insert(testDocKey, testDocBody);
        await collection.insert(testDocKey2, testDocBody2);

        const searchIndexName = `searchIndex` + getRandomId();
        const def = getIndexDefinition(searchIndexName, {
          bucket: serverTestContext.bucket.name,
          scope: scopeName,
          collection: collectionName,
        });

        const indexName = await useScopedSearchIndex(
          {
            bucketName: serverTestContext.bucket.name,
            scopeName,
            collectionName,
            ...def,
          },
          { waitSearchIndexTimeout: 100_000, awaitMutations: true }
        );

        await waitFor(
          async () => {
            const docs = await getSearchIndexDocumentsByIds(
              apiConfig,
              {
                bucket: serverTestContext.bucket.name,
                scope: scopeName,
                index: indexName,
              },
              [testDocKey, testDocKey2]
            );

            expect(docs.hits).toHaveLength(2);
          },
          { timeout: 60_000, retryInterval: 2_500 }
        );
      },
      { timeout: 100_000 }
    );
  }
);
