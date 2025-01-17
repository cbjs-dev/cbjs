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
import { afterAll, beforeAll, describe } from 'vitest';

import {
  HighlightStyle,
  HttpErrorContext,
  SearchIndexNotFoundError,
  SearchQuery,
} from '@cbjsdev/cbjs';
import {
  ServerFeatures,
  waitForCollection,
  waitForSearchIndex,
} from '@cbjsdev/http-client';
import { getRandomId, invariant, waitFor } from '@cbjsdev/shared';
import { createCouchbaseTest, getDefaultServerTestContext } from '@cbjsdev/vitest';

import { getSearchIndexConfig } from '../data/searchIndexConfig.js';
import { useSampleData } from '../fixtures/useSampleData.js';
import { serverSupportsFeatures } from '../utils/serverFeature.js';

describe.runIf(serverSupportsFeatures(ServerFeatures.Search))(
  'search',
  { sequential: true },
  async () => {
    const serverTestContext = getDefaultServerTestContext();

    const collectionName = `cbjs_${getRandomId()}`;
    const scopeName = `cbjs_${getRandomId()}`;
    const indexName1 = `cbjs_${getRandomId()}`;

    const test = await createCouchbaseTest({
      useSampleData,
      collectionName,
    });

    beforeAll(async () => {
      const apiConfig = await serverTestContext.getApiConfig();
      await serverTestContext.bucket.collections().createScope(scopeName);
      await serverTestContext.bucket
        .collections()
        .createCollection(collectionName, scopeName);

      await waitForCollection(
        apiConfig,
        serverTestContext.bucket.name,
        scopeName,
        collectionName
      );
    });

    afterAll(async () => {
      await serverTestContext.bucket.collections().dropScope(scopeName);
    });

    test(
      'should successfully create an index',
      { timeout: 25_000 },
      async ({ apiConfig, serverTestContext }) => {
        const indexConfig = getSearchIndexConfig(indexName1, {
          bucket: serverTestContext.bucket.name,
          scope: scopeName,
          collection: collectionName,
        });

        await waitFor(
          async () => {
            await serverTestContext.cluster.searchIndexes().upsertIndex(indexConfig);
          },
          { timeout: 10_000, retryInterval: 1_000 }
        );

        await waitForSearchIndex(apiConfig, indexName1);
      }
    );

    test(
      'should successfully get all indexes',
      { timeout: 30_000 },
      async ({ apiConfig, serverTestContext, expect }) => {
        expect.hasAssertions();

        const indexName2 = `cbjs_${getRandomId()}`;

        const indexConfig = getSearchIndexConfig(indexName2, {
          bucket: serverTestContext.bucket.name,
          scope: scopeName,
          collection: collectionName,
        });

        await waitFor(
          async () => {
            await serverTestContext.cluster.searchIndexes().upsertIndex(indexConfig);
          },
          { timeout: 10_000, retryInterval: 1_000 }
        );

        await waitFor(
          async () => {
            const indexes = await serverTestContext.cluster
              .searchIndexes()
              .getAllIndexes();

            expect(indexes).toEqual(
              expect.arrayContaining([
                expect.objectContaining({
                  name: indexName1,
                }),
                expect.objectContaining({
                  name: indexName2,
                }),
              ])
            );
            expect(indexes.length).toBeGreaterThanOrEqual(2);
          },
          { retryInterval: 5_000 }
        );

        await serverTestContext.cluster.searchIndexes().dropIndex(indexName2);
      }
    );

    test(
      'should successfully get an index',
      { timeout: 60_000 },
      async ({ serverTestContext, expect }) => {
        expect.hasAssertions();

        await waitFor(
          async () => {
            const index = await serverTestContext.cluster
              .searchIndexes()
              .getIndex(indexName1);

            expect(index).toEqual(
              expect.objectContaining({
                name: indexName1,
              })
            );
          },
          { retryInterval: 5_000 }
        );
      }
    );

    test(
      'should see test data correctly',
      { timeout: 60_000 },
      async ({ serverTestContext, useSampleData, expect }) => {
        expect.hasAssertions();

        const collection = serverTestContext.bucket
          .scope(scopeName)
          .collection(collectionName);

        const sampleData = await useSampleData(collection);

        await waitFor(
          async () => {
            const result = await serverTestContext.cluster.searchQuery(
              indexName1,
              SearchQuery.term(sampleData.testUid).field('testUid'),
              { explain: true, fields: ['name'] }
            );

            expect(result.rows).toHaveLength(sampleData.sampleSize);

            result.rows.forEach((row) => {
              expect(row.index).toBeTypeOf('string');
              expect(row.id).toBeTypeOf('string');
              expect(row.score).toBeTypeOf('number');
            });
          },
          { timeout: 40_000, retryInterval: 100 }
        );
      }
    );

    test(
      'should include the locations and fragments',
      { timeout: 60_000 },
      async ({ serverTestContext, useDocumentKey, useSearchIndex, expect }) => {
        expect.hasAssertions();

        const collection = serverTestContext.bucket
          .scope(scopeName)
          .collection(collectionName);

        const testDocKey = useDocumentKey();
        const testDocBody = {
          title: 'Couchbase',
          tagline: 'No Equal - The Cloud database for modern applications',
          description:
            'Couchbase is a NoSQL, distributed database focused on performances at scale.',
        };

        await collection.insert(testDocKey, testDocBody);

        let searchIndexName = '';

        await waitFor(
          async () => {
            searchIndexName = await useSearchIndex(
              {
                type: 'fulltext-index',
                sourceType: 'couchbase',
                sourceName: serverTestContext.bucket.name,
                params: {
                  doc_config: {
                    docid_prefix_delim: '',
                    docid_regexp: '',
                    mode: 'scope.collection.type_field',
                    type_field: 'type',
                  },
                  mapping: {
                    analysis: {},
                    default_analyzer: 'en',
                    default_datetime_parser: 'dateTimeOptional',
                    default_field: '_all',
                    default_mapping: {
                      dynamic: false,
                      enabled: false,
                    },
                    default_type: '_default',
                    docvalues_dynamic: false,
                    index_dynamic: false,
                    store_dynamic: false,
                    type_field: '_type',
                    types: {
                      [`${collection.scope.name}.${collection.name}`]: {
                        dynamic: false,
                        enabled: true,
                        properties: {
                          title: {
                            dynamic: false,
                            enabled: true,
                            fields: [
                              {
                                include_term_vectors: true,
                                index: true,
                                name: 'title',
                                store: true,
                                type: 'text',
                              },
                            ],
                          },
                          description: {
                            dynamic: false,
                            enabled: true,
                            fields: [
                              {
                                include_in_all: true,
                                include_term_vectors: true,
                                index: true,
                                name: 'description',
                                store: true,
                                type: 'text',
                              },
                            ],
                          },
                        },
                      },
                    },
                  },
                  store: {
                    indexType: 'scorch',
                    segmentVersion: 15,
                  },
                },
                sourceParams: {},
              },
              { waitSearchIndexTimeout: 55_000 }
            );
          },
          { timeout: 21_000, retryInterval: 5_000 }
        );

        await waitFor(
          async () => {
            const result = await serverTestContext.cluster.searchQuery(
              searchIndexName,
              new SearchQuery({
                match: 'database scale',
                fields: ['title', 'description'],
                analyzer: 'en',
                operator: 'or',
              }),
              {
                includeLocations: true,
                fields: ['title', 'description'],
                highlight: {
                  style: HighlightStyle.HTML,
                },
              }
            );

            expect(result.rows).toHaveLength(1);

            result.rows.forEach((row) => {
              expect(row).toHaveProperty('index');
              expect(row).toHaveProperty('id');
              expect(row).toHaveProperty('score');
              expect(row).toHaveProperty('explanation', undefined);

              expect(row.locations).toEqual(
                expect.arrayContaining([
                  expect.objectContaining({
                    field: 'description',
                    term: 'scale',
                    position: 11,
                    start_offset: 70,
                    end_offset: 75,
                    array_positions: undefined,
                  }),
                ])
              );

              expect(row.fields).toEqual({
                title: testDocBody.title,
                description: testDocBody.description,
              });

              expect(row.fragments).toEqual({
                description: [
                  'Couchbase is a NoSQL, distributed <mark>database</mark> focused on performances at <mark>scale</mark>.',
                ],
              });
            });
          },
          { timeout: 40_000 }
        );
      }
    );

    test('should throw a SearchIndexNotFoundError when dropping a missing index', async ({
      serverTestContext,
      expect,
    }) => {
      expect.hasAssertions();

      try {
        await serverTestContext.cluster.searchIndexes().dropIndex('missingIndex');
      } catch (err) {
        expect(err).toBeInstanceOf(SearchIndexNotFoundError);
        invariant(err instanceof SearchIndexNotFoundError);
        expect(err.context).toBeInstanceOf(HttpErrorContext);
      }
    });

    test(
      'should disable scoring',
      { timeout: 60_000 },
      async ({
        apiConfig,
        serverTestContext,
        expect,
        useCollection,
        useSearchIndex,
        useSampleData,
      }) => {
        expect.hasAssertions();

        const collection = serverTestContext.bucket
          .scope(scopeName)
          .collection(collectionName);

        const sampleData = await useSampleData(collection);

        await waitFor(
          async () => {
            const result = await serverTestContext.cluster.searchQuery(
              indexName1,
              SearchQuery.term(sampleData.testUid).field('testUid'),
              { disableScoring: true }
            );

            expect(result.rows).toBeInstanceOf(Array);
            expect(result.rows).toHaveLength(sampleData.sampleSize);

            result.rows.forEach((row) => {
              expect(row.index).toBeTypeOf('string');
              expect(row.id).toBeTypeOf('string');
              expect(row.score).toEqual(0);
            });
          },
          { timeout: 40_000 }
        );
      }
    );
  }
);
