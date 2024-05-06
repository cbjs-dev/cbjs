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

import { QueryMetaData, QueryProfileMode, QueryResult, QueryStatus } from '@cbjsdev/cbjs';
import { ServerFeatures } from '@cbjsdev/http-client';
import { keyspacePath } from '@cbjsdev/shared';
import { createCouchbaseTest, getDefaultServerTestContext } from '@cbjsdev/vitest';

import { useSampleData } from '../fixtures/useSampleData.js';
import { serverSupportsFeatures } from '../utils/serverFeature.js';

describe.runIf(serverSupportsFeatures(ServerFeatures.Query))(
  'query request',
  { timeout: 60_000 },
  async () => {
    const test = await createCouchbaseTest({
      useSampleData,
    });

    const serverTestContext = getDefaultServerTestContext();

    const cases = [
      {
        name: 'cluster level',
        dataCollection: serverTestContext.defaultCollection,
        indexKeyspace: { bucketName: serverTestContext.bucket.name },
        dataKeyspacePath: keyspacePath(serverTestContext.bucket.name),
      },
      {
        name: 'collection level',
        dataCollection: serverTestContext.collection,
        indexKeyspace: {
          bucketName: serverTestContext.bucket.name,
          scopeName: serverTestContext.scope.name,
          collectionName: serverTestContext.collection.name as string,
        },
        dataKeyspacePath: serverTestContext.getKeyspacePath(),
      },
    ];

    describe.each(cases)(
      '$name',
      ({ dataCollection, indexKeyspace, dataKeyspacePath }) => {
        test('should see test data correctly', async function ({
          serverTestContext,
          expect,
          useSampleData,
          usePrimaryIndex,
        }) {
          const { testUid, sampleSize } = await useSampleData(dataCollection);
          await usePrimaryIndex(indexKeyspace, {
            waitIndexTimeout: 20_000,
          });

          const result = await serverTestContext.cluster.query(
            `SELECT * FROM ${dataKeyspacePath} WHERE testUid=$1`,
            {
              parameters: [testUid],
            }
          );

          expect(result.rows).toHaveLength(sampleSize);
          expect(result.meta).toHaveProperty('requestId');
        });

        test('should see test data correctly with a new connection', async function ({
          serverTestContext,
          expect,
          useSampleData,
          usePrimaryIndex,
        }) {
          const { testUid, sampleSize } = await useSampleData(dataCollection);
          await usePrimaryIndex(indexKeyspace);

          const result = await serverTestContext.cluster.query(
            `SELECT * FROM ${dataKeyspacePath} WHERE testUid=$1`,
            {
              parameters: [testUid],
            }
          );

          expect(result.rows).toHaveLength(sampleSize);
          expect(result.meta).toHaveProperty('requestId');
        });

        test('should stream test data correctly', async function ({
          serverTestContext,
          expect,
          useSampleData,
          usePrimaryIndex,
        }) {
          const { testUid, sampleSize } = await useSampleData(dataCollection);
          await usePrimaryIndex(indexKeyspace);

          const streamQuery = (qs: string) => {
            return new Promise<QueryResult<unknown>>((resolve, reject) => {
              const rowsOut: unknown[] = [];
              let metaOut: QueryMetaData | undefined = undefined;

              void serverTestContext.cluster
                .query(qs)
                .on('row', (row) => {
                  rowsOut.push(row);
                })
                .on('meta', (meta) => {
                  metaOut = meta;
                })
                .on('end', () => {
                  resolve({
                    rows: rowsOut,
                    meta: metaOut!,
                  });
                })
                .on('error', (err) => {
                  reject(err);
                });
            });
          };

          const result = await streamQuery(
            `SELECT * FROM ${dataKeyspacePath} WHERE testUid='${testUid}'`
          );

          expect(result.rows).toHaveLength(sampleSize);
          expect(result.meta).toHaveProperty('requestId');
        });

        test('should work with parameters correctly', async function ({
          serverTestContext,
          expect,
          useSampleData,
          usePrimaryIndex,
        }) {
          const { testUid, sampleSize } = await useSampleData(dataCollection);
          await usePrimaryIndex(indexKeyspace);

          const result = await serverTestContext.cluster.query(
            `SELECT * FROM ${dataKeyspacePath} WHERE testUid=$2`,
            {
              parameters: [undefined, testUid],
            }
          );

          expect(result.rows).toHaveLength(sampleSize);
          expect(result.meta).toHaveProperty('requestId');
        });

        test('should work with named parameters correctly', async function ({
          serverTestContext,
          expect,
          useSampleData,
          usePrimaryIndex,
        }) {
          const { testUid, sampleSize } = await useSampleData(dataCollection);
          await usePrimaryIndex(indexKeyspace);

          const result = await serverTestContext.cluster.query(
            `SELECT * FROM ${dataKeyspacePath} WHERE testUid=$tuid`,
            {
              parameters: { tuid: testUid },
            }
          );

          expect(result.rows).toHaveLength(sampleSize);
          expect(result.meta).toHaveProperty('requestId');
        });

        test('should filter undefined named parameters', async function ({
          serverTestContext,
          expect,
          useSampleData,
          usePrimaryIndex,
        }) {
          const { testUid, sampleSize } = await useSampleData(dataCollection);
          await usePrimaryIndex(indexKeyspace);

          const result = await serverTestContext.cluster.query(
            `SELECT * FROM ${dataKeyspacePath} WHERE testUid=$tuid`,
            {
              parameters: { tuid: testUid, ignoreMe: undefined },
            }
          );

          expect(result.rows).toHaveLength(sampleSize);
          expect(result.meta).toHaveProperty('requestId');
        });

        test('should work with lots of options specified', async function ({
          serverTestContext,
          expect,
          useSampleData,
          usePrimaryIndex,
        }) {
          const { testUid, sampleSize } = await useSampleData(dataCollection);
          await usePrimaryIndex(indexKeyspace);

          const result = await serverTestContext.cluster.query(
            `SELECT * FROM ${dataKeyspacePath} WHERE testUid=$1`,
            {
              parameters: [testUid],
              adhoc: true,
              clientContextId: 'hello-world',
              maxParallelism: 10,
              pipelineBatch: 10,
              pipelineCap: 10,
              scanCap: 10,
              readOnly: true,
              profile: QueryProfileMode.Timings,
              metrics: true,
            }
          );

          expect(result.rows).toHaveLength(sampleSize);
          expect(result.meta).toHaveProperty('requestId');
          expect(result.meta.clientContextId).toEqual('hello-world');
          expect(result.meta.status).toEqual(QueryStatus.Success);
          expect(result.meta.signature).not.toBeNull();
          expect(result.meta.signature).toBeTypeOf('object');
          expect(result.meta.metrics).not.toBeNull();
          expect(result.meta.metrics).toBeTypeOf('object');
          expect(result.meta.profile).not.toBeNull();
          expect(result.meta.profile).toBeTypeOf('object');
        });
      }
    );
  }
);
