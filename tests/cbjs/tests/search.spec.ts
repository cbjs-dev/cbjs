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

import {
  HighlightStyle,
  HttpErrorContext,
  SearchIndexNotFoundError,
  SearchQuery,
} from '@cbjs/cbjs';
import { invariant, sleep } from '@cbjs/shared';
import { createCouchbaseTest } from '@cbjs/vitest';

import { getSearchIndexConfig } from '../data/searchIndexConfig';
import { useSampleData } from '../fixtures/useSampleData';
import { ServerFeatures, serverSupportsFeatures } from '../utils/serverFeature';

describe
  .runIf(serverSupportsFeatures(ServerFeatures.Search))
  .shuffle('search', async () => {
    const test = await createCouchbaseTest({
      useSampleData,
    });

    test('should successfully create & drop an index', async ({
      serverTestContext,
      useSearchIndex,
      useCollection,
    }) => {
      const collection = await useCollection();
      await sleep(2_000);

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { name, ...indexConfig } = getSearchIndexConfig(
        'willBeRemovedAndRandomized',
        {
          ...serverTestContext.getKeyspace(),
          collection,
        }
      );

      await useSearchIndex(indexConfig, { waitSearchIndexTimeout: 0 });
    });

    test(
      'should successfully get all indexes',
      async ({ serverTestContext, useCollection, useSearchIndex, expect }) => {
        const collection = await useCollection();
        await sleep(2_000);

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { name, ...indexConfig } = getSearchIndexConfig(
          'willBeRemovedAndRandomized',
          {
            ...serverTestContext.getKeyspace(),
            collection,
          }
        );
        const index0 = await useSearchIndex(indexConfig, { waitSearchIndexTimeout: 0 });
        const index1 = await useSearchIndex(indexConfig, { waitSearchIndexTimeout: 0 });
        const indexes = await serverTestContext.cluster.searchIndexes().getAllIndexes();

        expect(indexes.length).toBeGreaterThanOrEqual(2);
        expect(indexes).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              name: index0,
            }),
            expect.objectContaining({
              name: index1,
            }),
          ])
        );
      },
      { timeout: 30_000 }
    );

    test('should successfully get an index', async ({
      serverTestContext,
      useCollection,
      useSearchIndex,
      expect,
    }) => {
      const collection = await useCollection();
      await sleep(2_000);

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { name, ...indexConfig } = getSearchIndexConfig(
        'willBeRemovedAndRandomized',
        {
          ...serverTestContext.getKeyspace(),
          collection,
        }
      );
      const indexName = await useSearchIndex(indexConfig, { waitSearchIndexTimeout: 0 });
      const index = await serverTestContext.cluster.searchIndexes().getIndex(indexName);

      expect(index).toEqual(
        expect.objectContaining({
          name: indexName,
        })
      );
    });

    test(
      'should see test data correctly',
      async ({
        serverTestContext,
        useCollection,
        useSearchIndex,
        useSampleData,
        expect,
      }) => {
        expect.hasAssertions();

        const collectionName = await useCollection();
        await sleep(2_000);

        const collection = serverTestContext.bucket.collection(collectionName);

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { name, ...indexConfig } = getSearchIndexConfig(
          'willBeRemovedAndRandomized',
          collection.getKeyspace()
        );

        const sampleData = await useSampleData(collection);
        const indexName = await useSearchIndex(indexConfig, {
          waitSearchIndexTimeout: 20_000,
        });

        const result = await serverTestContext.cluster.searchQuery(
          indexName,
          SearchQuery.term(sampleData.testUid).field('testUid'),
          { explain: true, fields: ['name'] }
        );

        expect(result.rows).toBeInstanceOf(Array);
        expect(result.rows).toHaveLength(sampleData.sampleSize);

        result.rows.forEach((row) => {
          expect(row.index).toBeTypeOf('string');
          expect(row.id).toBeTypeOf('string');
          expect(row.score).toBeTypeOf('number');
        });
      },
      { timeout: 40_000 }
    );

    test(
      'should include the locations and fragments',
      async ({
        serverTestContext,
        useDocumentKey,
        useCollection,
        useSearchIndex,
        expect,
      }) => {
        const testDocKey = useDocumentKey();
        const collectionName = await useCollection();
        await sleep(2_000);

        const collection = serverTestContext.bucket.collection(collectionName);

        const testDocBody = {
          title: 'Couchbase',
          tagline: 'No Equal - The Cloud database for modern applications',
          description:
            'Couchbase is a NoSQL, distributed database focused on performances at scale.',
        };

        await collection.insert(testDocKey, testDocBody);

        const searchIndexName = await useSearchIndex(
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
          { waitSearchIndexTimeout: 40_000 }
        );

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
      { timeout: 60_000 }
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
  });
