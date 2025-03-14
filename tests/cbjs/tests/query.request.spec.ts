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
import JSONBigint from 'json-bigint';
import { describe, vi } from 'vitest';

import { QueryMetaData, QueryProfileMode, QueryResult, QueryStatus } from '@cbjsdev/cbjs';
import { ServerFeatures } from '@cbjsdev/http-client';
import { getConnectionParams, keyspacePath } from '@cbjsdev/shared';
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
        test(
          'should see test data correctly',
          { retry: 1 },
          async function ({ serverTestContext, expect, useSampleData, usePrimaryIndex }) {
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
          }
        );

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

    describe('hooks', () => {
      test('should call onQueryStart and onQueryEnd', async ({
        expect,
        serverTestContext,
        useDocumentKey,
      }) => {
        const mockOnQueryStart = vi.fn().mockReturnValue('mockStartReturn');
        const mockOnQueryEnd = vi.fn();

        const params = getConnectionParams();
        const newConnection = await serverTestContext.newConnection(params, {
          hooks: {
            onQueryStart: mockOnQueryStart,
            onQueryEnd: mockOnQueryEnd,
          },
        });

        const collection = newConnection
          .bucket(serverTestContext.bucket.name)
          .scope(serverTestContext.scope.name)
          .collection(serverTestContext.collection.name);

        const docKey = useDocumentKey();
        await collection.insert(docKey, {
          title: 'cbjs',
        });

        const statement = `SELECT META().cas AS cas FROM ${serverTestContext.getKeyspacePath()} USE KEYS $1`;
        const options = {
          parameters: [docKey],
        };
        const queryResult = await newConnection.query<{ cas: bigint }>(
          statement,
          options
        );

        expect(mockOnQueryStart).toHaveBeenCalledWith({
          statement,
          options,
        });

        expect(mockOnQueryEnd).toHaveBeenCalledWith(
          {
            statement,
            options,
            result: queryResult,
          },
          'mockStartReturn'
        );
      });

      test('should call onQueryEnd with the error when the query throws', async ({
        expect,
        serverTestContext,
      }) => {
        expect.hasAssertions();
        const mockOnQueryEnd = vi.fn();

        const params = getConnectionParams();
        const newConnection = await serverTestContext.newConnection(params, {
          hooks: {
            onQueryEnd: mockOnQueryEnd,
          },
        });

        const statement = `SELECT INVALID QUERY`;

        try {
          await newConnection.query(statement);
        } catch (err) {
          expect(mockOnQueryEnd).toHaveBeenCalledWith(
            {
              statement,
              options: {},
              error: err,
            },
            undefined
          );
        }
      });

      test('should call onHookError when either onQueryStart or onQueryEnd throws', async ({
        expect,
        serverTestContext,
      }) => {
        const mockOnHookError = vi.fn();

        const params = getConnectionParams();
        const newConnection = await serverTestContext.newConnection(params, {
          hooks: {
            onHookError: mockOnHookError,
            onQueryStart: () => {
              throw new Error('onQueryStart failed');
            },
            onQueryEnd: () => {
              throw new Error('onQueryEnd failed');
            },
          },
        });

        const statement = `SELECT 1 as foo`;
        await newConnection.query(statement);

        expect(mockOnHookError).toHaveBeenCalledTimes(2);
      });
    });

    describe('row parser', () => {
      test('should use the cluster custom row parser for cluster level query', async ({
        expect,
        serverTestContext,
        useDocumentKey,
      }) => {
        const docKey = useDocumentKey();

        const params = getConnectionParams();
        const newConnection = await serverTestContext.newConnection(params, {
          queryResultParser: JSONBigint.parse,
        });

        const collection = newConnection
          .bucket(serverTestContext.bucket.name)
          .scope(serverTestContext.scope.name)
          .collection(serverTestContext.collection.name);

        const { cas: insertCas } = await collection.insert(docKey, {
          title: 'cbjs',
        });

        const queryResult = await newConnection.query<{ cas: bigint }>(
          `SELECT META().cas AS cas FROM ${serverTestContext.getKeyspacePath()} USE KEYS $1`,
          {
            parameters: [docKey],
          }
        );
        const { cas: queryCas } = queryResult.rows[0];

        expect(insertCas.toString()).toEqual(queryCas.toString());
      });

      test('should use the cluster custom row parser for collection level query', async ({
        expect,
        serverTestContext,
        useDocumentKey,
      }) => {
        const docKey = useDocumentKey();

        const params = getConnectionParams();
        const newConnection = await serverTestContext.newConnection(params, {
          queryResultParser: JSONBigint.parse,
        });

        const scope = newConnection
          .bucket(serverTestContext.bucket.name)
          .scope(serverTestContext.scope.name);

        const { cas: insertCas } = await scope
          .collection(serverTestContext.collection.name)
          .insert(docKey, {
            title: 'cbjs',
          });

        const queryResult = await scope.query<{ cas: bigint }>(
          `SELECT META().cas AS cas FROM ${serverTestContext.getKeyspacePath()} USE KEYS $1`,
          {
            parameters: [docKey],
          }
        );
        const { cas: queryCas } = queryResult.rows[0];

        expect(insertCas.toString()).toEqual(queryCas.toString());
      });

      test('should use the given custom row parser for collection level query', async ({
        expect,
        serverTestContext,
        useDocumentKey,
      }) => {
        const docKey = useDocumentKey();

        const { cas: insertCas } = await serverTestContext.collection.insert(docKey, {
          title: 'cbjs',
        });

        const queryResult = await serverTestContext.scope.query<{ cas: bigint }>(
          `SELECT META().cas AS cas FROM ${serverTestContext.getKeyspacePath()} USE KEYS $1`,
          {
            parameters: [docKey],
            queryResultParser: JSONBigint.parse,
          }
        );
        const { cas: queryCas } = queryResult.rows[0];

        expect(insertCas.toString()).toEqual(queryCas.toString());
      });

      test('should use the given custom row parser for cluster level query', async ({
        expect,
        serverTestContext,
        useDocumentKey,
      }) => {
        const docKey = useDocumentKey();

        const { cas: insertCas } = await serverTestContext.collection.insert(docKey, {
          title: 'cbjs',
        });

        const queryResult = await serverTestContext.cluster.query<{ cas: bigint }>(
          `SELECT META().cas AS cas FROM ${serverTestContext.getKeyspacePath()} USE KEYS $1`,
          {
            parameters: [docKey],
            queryResultParser: JSONBigint.parse,
          }
        );
        const { cas: queryCas } = queryResult.rows[0];

        expect(insertCas.toString()).toEqual(queryCas.toString());
      });
    });
  }
);
