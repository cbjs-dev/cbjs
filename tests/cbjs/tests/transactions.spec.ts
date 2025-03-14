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

import {
  BucketNotFoundError,
  DocumentExistsError,
  DocumentNotFoundError,
  DocumentUnretrievableError,
  FeatureNotAvailableError,
  keyspacePath,
  KeyValueErrorContext,
  ParsingFailureError,
  RawBinaryTranscoder,
  TransactionFailedError,
  TransactionOperationFailedError,
} from '@cbjsdev/cbjs';
import { ServerFeatures } from '@cbjsdev/http-client';
import { getConnectionParams, invariant, waitFor } from '@cbjsdev/shared';
import { createCouchbaseTest } from '@cbjsdev/vitest';

import { serverSupportsFeatures } from '../utils/serverFeature.js';

describe
  .runIf(serverSupportsFeatures(ServerFeatures.Transactions))
  .shuffle('transactions', { timeout: 40_000, retry: 1 }, async () => {
    const test = await createCouchbaseTest(async ({ serverTestContext }) => {
      await waitFor(
        () => serverTestContext.collection.queryIndexes().createPrimaryIndex(),
        {
          retryInterval: 2_000,
        }
      );
    });

    test('should work with a simple transaction', async function ({
      expect,
      serverTestContext,
      useDocumentKey,
    }) {
      const testDocKeyIns = useDocumentKey();
      const testDocKeyRep = useDocumentKey();
      const testDocKeyRem = useDocumentKey();

      await serverTestContext.collection.insert(testDocKeyRep, {
        op: 'testDocKeyRep.kv.insert',
      });
      await serverTestContext.collection.insert(testDocKeyRem, {
        op: 'testDocKeyRem.kv.insert',
      });

      await serverTestContext.cluster.transactions().run(
        async (attempt) => {
          await attempt.insert(serverTestContext.collection, testDocKeyIns, {
            op: 'testDocKeyIns.tx.kv.insert',
          });

          const testDocRep = await attempt.get(
            serverTestContext.collection,
            testDocKeyRep
          );
          await attempt.replace(testDocRep, { op: 'testDocKeyRep.tx.kv.replace' });

          const testDocRem = await attempt.get(
            serverTestContext.collection,
            testDocKeyRem
          );
          await attempt.remove(testDocRem);

          // our changes should be visible within the transaction (Read Your Own Write)
          await expect(
            attempt.get(serverTestContext.collection, testDocKeyIns)
          ).resolves.toEqual(
            expect.objectContaining({
              content: { op: 'testDocKeyIns.tx.kv.insert' },
            })
          );

          await expect(
            attempt.get(serverTestContext.collection, testDocKeyRep)
          ).resolves.toEqual(
            expect.objectContaining({
              content: { op: 'testDocKeyRep.tx.kv.replace' },
            })
          );

          await expect(
            attempt.get(serverTestContext.collection, testDocKeyRem)
          ).rejects.toThrowError();
        },
        { timeout: 5000 }
      );

      await expect(serverTestContext.collection.get(testDocKeyIns)).resolves.toEqual(
        expect.objectContaining({
          content: { op: 'testDocKeyIns.tx.kv.insert' },
        })
      );

      await expect(serverTestContext.collection.get(testDocKeyRep)).resolves.toEqual(
        expect.objectContaining({
          content: { op: 'testDocKeyRep.tx.kv.replace' },
        })
      );

      await expect(
        serverTestContext.collection.get(testDocKeyRem)
      ).rejects.toThrowError();
    });

    test('should be able to check if a document exists within transaction', async function ({
      expect,
      serverTestContext,
      useDocumentKey,
    }) {
      const testDocKeyExists = useDocumentKey();

      await serverTestContext.collection.insert(testDocKeyExists, {
        op: 'testDocKeyExists.kv.exists',
      });

      await serverTestContext.cluster.transactions().run(
        async (attempt) => {
          const docExists = await attempt.exists(
            serverTestContext.collection,
            testDocKeyExists
          );

          expect(docExists.exists).toBe(true);
          expect(docExists.cas).toBeNonZeroCAS();

          const missingDocExists = await attempt.exists(
            serverTestContext.collection,
            'missingDoc'
          );

          expect(missingDocExists.exists).toBe(false);
          expect(missingDocExists.cas).toBeUndefined();
        },
        { timeout: 5000 }
      );
    });

    test('should work with query', async function ({
      expect,
      serverTestContext,
      useDocumentKey,
    }) {
      const testDocKey1 = useDocumentKey();
      const testDocKey2 = useDocumentKey();

      await serverTestContext.co.insert(testDocKey1, { op: 'testDocKey1.kv.insert' });

      await serverTestContext.c.transactions().run(async (attempt) => {
        const testDoc2 = await attempt.insert(serverTestContext.co, testDocKey2, {
          op: 'testDocKey2.tx.kv.insert',
        });

        const result = await attempt.query(
          `SELECT op FROM ${serverTestContext.getKeyspacePath()} WHERE META().id IN $1`,
          {
            parameters: [[testDocKey1, testDocKey2]],
          }
        );

        expect(result.rows).toHaveLength(2);
        expect(result.rows).toContainEqual({ op: 'testDocKey1.kv.insert' });
        expect(result.rows).toContainEqual({ op: 'testDocKey2.tx.kv.insert' });

        const testDoc1 = await attempt.get(serverTestContext.co, testDocKey1);

        await attempt.replace(testDoc1, { op: 'testDocKey1.tx.kv.replace' });
        await attempt.replace(testDoc2, { op: 'testDocKey2.tx.kv.replace' });
      });

      await expect(serverTestContext.co.get(testDocKey1)).resolves.toEqual(
        expect.objectContaining({
          content: { op: 'testDocKey1.tx.kv.replace' },
        })
      );

      await expect(serverTestContext.co.get(testDocKey2)).resolves.toEqual(
        expect.objectContaining({
          content: { op: 'testDocKey2.tx.kv.replace' },
        })
      );
    });

    /**
     * ? Not supported yet
     */
    test.fails(
      'should be able to perform a scoped query',
      async function ({ expect, serverTestContext, useDocumentKey }) {
        const testDocKey1 = useDocumentKey();
        const testDocKey2 = useDocumentKey();

        await serverTestContext.co.insert(testDocKey1, { op: 'testDocKey1.kv.insert' });
        await serverTestContext.co.insert(testDocKey2, { op: 'testDocKey2.kv.insert' });

        await serverTestContext.c.transactions().run(async (attempt) => {
          const result = await attempt.query(
            `SELECT op FROM ${serverTestContext.collection.name} WHERE META().id IN $1`,
            {
              parameters: [[testDocKey1, testDocKey2]],
              // @ts-expect-error Parameter has been removed by 4ff62b8f because the option is not supported yet
              scope: serverTestContext.scope,
            }
          );

          expect(result.rows).toHaveLength(2);
          expect(result.rows).toContainEqual({ op: 'testDocKey1.kv.insert' });
          expect(result.rows).toContainEqual({ op: 'testDocKey2.tx.kv.insert' });
        });
      }
    );

    test('should insert in Query mode', async function ({
      expect,
      serverTestContext,
      useDocumentKey,
    }) {
      const testDocKey1 = useDocumentKey();
      const testDocKey2 = useDocumentKey();

      await serverTestContext.co.insert(testDocKey1, { op: 'testDocKey1.kv.insert' });

      await serverTestContext.c.transactions().run(async (attempt) => {
        await expect(
          attempt.query(
            `SELECT op FROM ${serverTestContext.getKeyspacePath()} WHERE META().id IN $1`,
            {
              parameters: [[testDocKey1]],
            }
          )
        ).resolves.toEqual(
          expect.objectContaining({
            rows: [{ op: 'testDocKey1.kv.insert' }],
          })
        );

        await attempt.insert(serverTestContext.co, testDocKey2, {
          op: 'testDocKey2.tx.kv.insert',
        });
      });

      await expect(serverTestContext.co.get(testDocKey2)).resolves.toEqual(
        expect.objectContaining({
          content: { op: 'testDocKey2.tx.kv.insert' },
        })
      );
    });

    test('should remove in Query mode', async function ({
      expect,
      serverTestContext,
      useDocumentKey,
    }) {
      const testDocKey1 = useDocumentKey();
      const testDocKey2 = useDocumentKey();

      await serverTestContext.co.insert(testDocKey1, { op: 'testDocKey1.kv.insert' });

      await serverTestContext.c.transactions().run(async (attempt) => {
        await attempt.insert(serverTestContext.co, testDocKey2, {
          op: 'testDocKey2.tx.kv.insert',
        });

        const result = await attempt.query(
          `SELECT op FROM ${serverTestContext.getKeyspacePath()} WHERE META().id IN $1`,
          {
            parameters: [[testDocKey1, testDocKey2]],
          }
        );

        expect(result).toEqual(
          expect.objectContaining({
            rows: expect.arrayContaining([
              { op: 'testDocKey1.kv.insert' },
              { op: 'testDocKey2.tx.kv.insert' },
            ]),
          })
        );

        const remDoc = await attempt.get(serverTestContext.co, testDocKey1);
        await attempt.remove(remDoc);
      });

      await expect(serverTestContext.collection.get(testDocKey1)).rejects.toThrowError(
        DocumentNotFoundError
      );
    });

    test('should throw a TransactionFailedError when the lambda throws on the user side', async function ({
      expect,
      serverTestContext,
      useDocumentKey,
    }) {
      const testDocKeyIns = useDocumentKey();
      const testDocKeyRep = useDocumentKey();
      const testDocKeyRem = useDocumentKey();

      await serverTestContext.co.insert(testDocKeyRep, { op: 'testDocKeyRep.kv.insert' });
      await serverTestContext.co.insert(testDocKeyRem, { op: 'testDocKeyRem.kv.insert' });

      let numAttempts = 0;
      try {
        await serverTestContext.c.transactions().run(async (attempt) => {
          numAttempts++;

          await attempt.insert(serverTestContext.co, testDocKeyIns, {
            op: 'testDocKeyIns.tx.kv.insert',
          });

          const repDoc = await attempt.get(serverTestContext.co, testDocKeyRep);
          await attempt.replace(repDoc, { op: 'testDocKeyRep.tx.kv.replace' });

          const remDoc = await attempt.get(serverTestContext.co, testDocKeyRem);
          await attempt.remove(remDoc);

          throw new Error('application failure');
        });
      } catch (err) {
        expect(err).toBeInstanceOf(TransactionFailedError);
        invariant(err instanceof TransactionFailedError);
        expect(err.cause.message).toEqual('application failure');
      }

      expect(numAttempts).toEqual(1);

      await expect(serverTestContext.co.get(testDocKeyIns)).rejects.toThrowError();

      await expect(serverTestContext.co.get(testDocKeyRep)).resolves.toEqual(
        expect.objectContaining({
          content: { op: 'testDocKeyRep.kv.insert' },
        })
      );

      await expect(serverTestContext.co.get(testDocKeyRem)).resolves.toEqual(
        expect.objectContaining({
          content: { op: 'testDocKeyRem.kv.insert' },
        })
      );
    });

    test('should commit with query', async function ({
      expect,
      serverTestContext,
      useDocumentKey,
    }) {
      const testDocIns = useDocumentKey();
      const testDocRep = useDocumentKey();
      const testDocRem = useDocumentKey();

      await serverTestContext.co.insert(testDocRep, { op: 'testDocKeyRep.kv.insert' });
      await serverTestContext.co.insert(testDocRem, { foo: 'testDocKeyRem.kv.insert' });

      await serverTestContext.c.transactions().run(async (attempt) => {
        await attempt.query(
          `INSERT INTO ${serverTestContext.getKeyspacePath()} VALUES ($1, $2)`,
          {
            parameters: [testDocIns, { op: 'testDocKeyIns.tx.n1ql.insert' }],
          }
        );

        await attempt.query(
          `UPDATE ${serverTestContext.getKeyspacePath()} SET op="testDocKeyRep.tx.n1ql.update" WHERE META().id = $1`,
          {
            parameters: [testDocRep],
          }
        );

        await attempt.query(
          `DELETE FROM ${serverTestContext.getKeyspacePath()} WHERE META().id = $1`,
          {
            parameters: [testDocRem],
          }
        );
      });

      await expect(serverTestContext.co.get(testDocIns)).resolves.toEqual(
        expect.objectContaining({
          content: { op: 'testDocKeyIns.tx.n1ql.insert' },
        })
      );

      await expect(serverTestContext.co.get(testDocRep)).resolves.toEqual(
        expect.objectContaining({
          content: { op: 'testDocKeyRep.tx.n1ql.update' },
        })
      );

      await expect(serverTestContext.co.get(testDocRem)).rejects.toThrowError(
        DocumentNotFoundError
      );
    });

    test('should rollback after query', async function ({
      serverTestContext,
      expect,
      useDocumentKey,
    }) {
      const testDocIns = useDocumentKey();
      const testDocRep = useDocumentKey();
      const testDocRem = useDocumentKey();

      await serverTestContext.co.insert(testDocRep, { foo: 'bar' });
      await serverTestContext.co.insert(testDocRem, { foo: 'bar' });

      let numAttempts = 0;
      try {
        await serverTestContext.c.transactions().run(async (attempt) => {
          numAttempts++;

          await attempt.query(
            `INSERT INTO ${serverTestContext.getKeyspacePath()} VALUES ($1, $2)`,
            {
              parameters: [testDocIns, { foo: 'baz' }],
            }
          );

          await attempt.query(
            `UPDATE ${serverTestContext.getKeyspacePath()} SET foo="baz" WHERE META().id = $1`,
            {
              parameters: [testDocRep],
            }
          );

          await attempt.query(
            `DELETE FROM ${serverTestContext.getKeyspacePath()} WHERE META().id = $1`,
            {
              parameters: [testDocRem],
            }
          );

          throw new Error('application failure');
        });
      } catch (err) {
        expect(err).toBeInstanceOf(TransactionFailedError);
        invariant(err instanceof TransactionFailedError);
        expect(err.cause?.message, 'application failure');
      }

      expect(numAttempts).toEqual(1);

      await expect(serverTestContext.co.get(testDocIns)).rejects.toThrowError();

      await expect(serverTestContext.co.get(testDocRep)).resolves.toEqual(
        expect.objectContaining({
          content: { foo: 'bar' },
        })
      );

      await expect(serverTestContext.co.get(testDocRem)).resolves.toEqual(
        expect.objectContaining({
          content: { foo: 'bar' },
        })
      );
    });

    // This tests fails for a mysterious reason. The transaction commit never returns.
    test.skip('should throw TransactionOperationFailedError and TransactionFailedError when replacing with bad CAS', async function ({
      expect,
      serverTestContext,
      useDocumentKey,
    }) {
      const testDocKey = useDocumentKey();
      const collection = serverTestContext.collection;
      await collection.upsert(testDocKey, { op: 'testDocKey.kv.upsert' });

      // txn will retry until timeout
      let numAttempts = 0;
      try {
        await serverTestContext.cluster.transactions().run(
          async (attempt) => {
            numAttempts++;
            const testDoc = await attempt.get(collection, testDocKey);
            await attempt.replace(testDoc, { op: 'testDocKey.tx.kv.replace' });

            try {
              // This should fail due to CAS Mismatch
              // Note that atm the cause is set as unknown in the txn lib
              await attempt.replace(testDoc, { op: 'testDocKey.tx.kv.replace2' });
            } catch (err) {
              // expect(err).toBeInstanceOf(TransactionOperationFailedError);
              // invariant(err instanceof TransactionOperationFailedError);
              // expect(err.cause?.message, 'unknown');
            }
          },
          { timeout: 2000 }
        );
      } catch (err) {
        expect(err).toBeInstanceOf(TransactionFailedError);
        invariant(err instanceof TransactionFailedError);
        expect(err.cause?.message, 'unknown');
      }

      expect(numAttempts).toBeGreaterThan(1);

      await expect(serverTestContext.co.get(testDocKey)).resolves.toEqual(
        expect.objectContaining({
          content: { op: 'testDocKey.kv.upsert' },
        })
      );
    });

    // This tests fails for a mysterious reason. The transaction commit never returns.
    test.skip('should throw TransactionOperationFailedError and TransactionFailedError when removing with bad CAS', async function ({
      expect,
      serverTestContext,
      useDocumentKey,
    }) {
      const testDocKey = useDocumentKey();

      await serverTestContext.co.upsert(testDocKey, { op: 'testDocKey.kv.upsert' });

      // txn will retry until timeout
      let numAttempts = 0;
      try {
        await serverTestContext.c.transactions().run(
          async (attempt) => {
            numAttempts++;
            const remDoc = await attempt.get(serverTestContext.co, testDocKey);
            await attempt.replace(remDoc, { op: 'testDocKey.tx.kv.replace' });
            // This should fail due to CAS Mismatch
            // Note that atm the cause is set as unknown in the txn lib
            try {
              await attempt.remove(remDoc);
            } catch (err) {
              expect(err).toBeInstanceOf(TransactionOperationFailedError);
              invariant(err instanceof TransactionOperationFailedError);
              expect(err.cause?.message, 'unknown');
            }
          },
          { timeout: 2000 }
        );
      } catch (err) {
        expect(err).toBeInstanceOf(TransactionFailedError);
        invariant(err instanceof TransactionFailedError);
        expect(err.cause?.message, 'unknown');
      }

      expect(numAttempts).toBeGreaterThan(1);

      // the txn should fail, so doc should exist
      await expect(serverTestContext.co.get(testDocKey)).resolves.toEqual(
        expect.objectContaining({
          content: { foo: 'bar' },
        })
      );
    });

    test('should throw a DocumentNotFoundError and TransactionFailedError when getting a missing doc', async function ({
      serverTestContext,
      expect,
    }) {
      let numAttempts = 0;

      try {
        await serverTestContext.c.transactions().run(
          async (attempt) => {
            numAttempts++;
            await attempt.get(serverTestContext.co, 'missingDoc');
          },
          { timeout: 2000 }
        );
      } catch (err) {
        expect(err).toBeInstanceOf(TransactionFailedError);
        invariant(err instanceof TransactionFailedError);
        expect(err.cause).toBeInstanceOf(DocumentNotFoundError);
        invariant(err.cause instanceof DocumentNotFoundError);
        expect(err.cause.message.includes('document not found'));

        expect(err.context).toBeUndefined();
      }

      expect(numAttempts).toEqual(1);
    });

    test('should throw a DocumentExistsError and TransactionFailedError when inserting an existing doc key', async function ({
      expect,
      serverTestContext,
      useDocumentKey,
    }) {
      const testDocIns = useDocumentKey();

      await serverTestContext.co.insert(testDocIns, { foo: 'bar' });

      let numAttempts = 0;

      await expect(
        serverTestContext.c.transactions().run(
          async (attempt) => {
            numAttempts++;

            try {
              await attempt.insert(serverTestContext.co, testDocIns, { foo: 'baz' });
            } catch (err) {
              invariant(err instanceof Error);
              expect(err.cause).toBeInstanceOf(DocumentExistsError);
              invariant(err.cause instanceof DocumentExistsError);
              expect(err.cause.message).toContain('document exists');
              expect(err.cause.context).toBeInstanceOf(KeyValueErrorContext);
            }

            throw new Error('success');
          },
          { timeout: 2000 }
        )
      ).rejects.toThrowError(TransactionFailedError);

      numAttempts = 0;
      try {
        await serverTestContext.c.transactions().run(
          async (attempt) => {
            numAttempts++;
            await attempt.insert(serverTestContext.co, testDocIns, { foo: 'baz' });
          },
          { timeout: 2000 }
        );
      } catch (err) {
        expect(err).toBeInstanceOf(TransactionFailedError);
        invariant(err instanceof TransactionFailedError);
        expect(err.cause).toBeInstanceOf(DocumentExistsError);
        invariant(err.cause instanceof DocumentExistsError);
        expect(err.cause.message).toContain('document exists');

        // JSCBC-1231
        // expect(err.cause.context).toBeInstanceOf(KeyValueErrorContext);

        expect(err.context).toBeUndefined();
      }

      expect(numAttempts).toEqual(1);
    });

    test('should throw a ParsingFailureError and TransactionFailedError when executing an invalid n1ql query', async function ({
      expect,
      serverTestContext,
    }) {
      let numAttempts = 0;

      try {
        await serverTestContext.c.transactions().run(
          async (attempt) => {
            numAttempts++;
            await attempt.query('Invalid query statement');
          },
          { timeout: 2000 }
        );
      } catch (err) {
        expect(err).toBeInstanceOf(TransactionFailedError);
        invariant(err instanceof TransactionFailedError);
        expect(err.cause).toBeInstanceOf(ParsingFailureError);
        invariant(err.cause instanceof ParsingFailureError);
        expect(err.cause.message).toContain('parsing failure');
        expect(err.context).toBeUndefined();
      }
      expect(numAttempts).toEqual(1);
    });

    test('should throw a BucketNotFoundError if metadata collection bucket does not exist', async ({
      serverTestContext,
      expect,
    }) => {
      const cluster = await serverTestContext.newConnection(undefined, {
        transactions: {
          metadataCollection: {
            bucket: 'no-bucket',
            scope: '_default',
            collection: '_default',
          },
        },
      });

      expect(() => cluster.transactions()).toThrowError(BucketNotFoundError);
    });

    test.runIf(serverSupportsFeatures(ServerFeatures.BinaryTransactions))(
      'should successfully mutate and get a binary document within the transaction lambda',
      async ({ serverTestContext, expect, useDocumentKey }) => {
        const testDocKey = useDocumentKey();
        const testBinVal = Buffer.from(
          '00092bc691fb824300a6871ceddf7090d7092bc691fb824300a6871ceddf7090d7',
          'hex'
        );
        const nextBinVal = Buffer.from('666f6f62617262617a', 'hex');

        await serverTestContext.cluster.transactions().run(
          async (attempt) => {
            await attempt.insert(serverTestContext.collection, testDocKey, testBinVal);
            const resultGet = await attempt.get(serverTestContext.collection, testDocKey);
            const resultReplace = await attempt.replace(resultGet, nextBinVal);

            expect(resultReplace.cas).not.toEqual(resultGet.cas);
          },
          { timeout: 5000 }
        );
      }
    );

    test.runIf(serverSupportsFeatures(ServerFeatures.BinaryTransactions))(
      'should use the given transcoder',
      async ({ serverTestContext, expect, useDocumentKey }) => {
        const testDocKey = useDocumentKey();
        const testBinVal = Buffer.from(
          '00092bc691fb824300a6871ceddf7090d7092bc691fb824300a6871ceddf7090d7',
          'hex'
        );
        const nextBinVal = Buffer.from('666f6f62617262617a', 'hex');

        const transcoder = new RawBinaryTranscoder();

        const encodeSpy = vi.spyOn(transcoder, 'encode');
        const decodeSpy = vi.spyOn(transcoder, 'decode');

        await serverTestContext.cluster.transactions().run(
          async (attempt) => {
            await attempt.insert(serverTestContext.collection, testDocKey, testBinVal, {
              transcoder,
            });
            const resultGet = await attempt.get(
              serverTestContext.collection,
              testDocKey,
              {
                transcoder,
              }
            );
            expect(resultGet.content).toEqual(testBinVal);

            const resultReplace = await attempt.replace(resultGet, nextBinVal, {
              transcoder,
            });

            expect(resultReplace.cas).not.toEqual(resultGet.cas);
          },
          { timeout: 5000 }
        );

        expect(encodeSpy).toHaveBeenCalledTimes(2); // insert + replace
        expect(decodeSpy).toHaveBeenCalledTimes(1); // get
      }
    );

    test.skipIf(serverSupportsFeatures(ServerFeatures.BinaryTransactions))(
      'should throw a FeatureNotAvailableError when attempting to insert a binary document within the transaction lambda',
      async ({ serverTestContext, expect, useDocumentKey }) => {
        const testDocKey = useDocumentKey();
        const testBinVal = Buffer.from(
          '00092bc691fb824300a6871ceddf7090d7092bc691fb824300a6871ceddf7090d7',
          'hex'
        );
        let numAttempts = 0;

        try {
          await serverTestContext.cluster.transactions().run(
            async (attempt) => {
              numAttempts++;
              await attempt.insert(serverTestContext.collection, testDocKey, testBinVal);
            },
            { timeout: 5_000 }
          );
        } catch (err) {
          expect(err).toBeInstanceOf(TransactionFailedError);
          invariant(err instanceof TransactionFailedError);
          expect(err.cause).toBeInstanceOf(FeatureNotAvailableError);
        }

        expect(numAttempts).toEqual(1);
      }
    );

    test('should be able to use the fluid API', async ({
      serverTestContext,
      expect,
      useDocumentKey,
    }) => {
      const testDocKey = useDocumentKey();
      const testDocValue = { title: 'Hi' };

      await serverTestContext.collection.insert(testDocKey, testDocValue);
      const ks = serverTestContext.getKeyspace();

      await serverTestContext.cluster.transactions().run(
        async (ctx) => {
          const { content } = await ctx
            .bucket(ks.bucket)
            .scope(ks.scope)
            .collection(ks.collection)
            .get(testDocKey);

          expect(content).toEqual(testDocValue);
        },
        { timeout: 5000 }
      );
    });

    test('should be able to store reference to collection context when using the fluid API', async ({
      serverTestContext,
      expect,
      useDocumentKey,
    }) => {
      const testDocKey = useDocumentKey();
      const testDocValue = { title: 'Hi' };

      await serverTestContext.collection.insert(testDocKey, testDocValue);
      const ks = serverTestContext.getKeyspace();

      await serverTestContext.cluster.transactions().run(
        async (ctx) => {
          // ! The order is very important
          // ! We want to make sure that calling for a new collection context
          // ! does not alter the other collection context
          const collectionContext = ctx
            .bucket(ks.bucket)
            .scope(ks.scope)
            .collection(ks.collection);

          const anotherCollectionContext = ctx
            .bucket(ks.bucket)
            .scope(ks.scope)
            .collection('collection1');

          const { content } = await collectionContext.get(testDocKey);

          expect(content).toEqual(testDocValue);
        },
        { timeout: 5000 }
      );
    });

    test('should be able to perform a query with a query context', async ({
      serverTestContext,
      expect,
    }) => {
      expect.hasAssertions();

      await serverTestContext.c.transactions().run(async (ctx) => {
        try {
          await expect(
            ctx.query(
              `SELECT * FROM ${keyspacePath(serverTestContext.collection.name)}`,
              {
                queryContext: keyspacePath(
                  serverTestContext.bucket.name,
                  serverTestContext.scope.name
                ),
              }
            )
          ).resolves.toBeDefined();
        } catch (err) {
          expect.fail(`Error during the execution of the query: ${err}`);
        }
      });
    });

    test('should use the cluster custom row parser', async ({
      expect,
      serverTestContext,
      useDocumentKey,
    }) => {
      expect.hasAssertions();

      const docKey = useDocumentKey();

      const { cas: insertCas } = await serverTestContext.collection.insert(docKey, {
        title: 'cbjs',
      });

      const params = getConnectionParams();
      const newConnection = await serverTestContext.newConnection(params, {
        queryResultParser: JSONBigint.parse,
      });

      await newConnection.transactions().run(async (ctx) => {
        const queryResult = await ctx.query<{ cas: bigint }>(
          `SELECT META().cas AS cas FROM ${serverTestContext.getKeyspacePath()} USE KEYS $1`,
          {
            parameters: [docKey],
          }
        );
        const { cas: queryCas } = queryResult.rows[0];
        expect(insertCas.toString()).toEqual(queryCas.toString());
      });
    });

    test('should use the given custom row parser', async ({
      expect,
      serverTestContext,
      useDocumentKey,
    }) => {
      expect.hasAssertions();

      const docKey = useDocumentKey();

      const { cas: insertCas } = await serverTestContext.collection.insert(docKey, {
        title: 'cbjs',
      });

      await serverTestContext.c.transactions().run(async (ctx) => {
        const queryResult = await ctx.query<{ cas: bigint }>(
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

    test('should provide the lambda stack trace when a TransactionFailedError is thrown', async ({
      expect,
      serverTestContext,
    }) => {
      expect.hasAssertions();

      try {
        await serverTestContext.cluster.transactions().run(async (ctx) => {
          await ctx.get(serverTestContext.collection, 'missingDocKey');
        });
      } catch (err) {
        expect(err).toBeInstanceOf(TransactionFailedError);
        invariant(err instanceof TransactionFailedError);
        expect(err.stack).toContain('TransactionFailedError');
        expect(err.stack).toContain('document not found');
      }
    });

    test.runIf(serverSupportsFeatures(ServerFeatures.ServerGroups))(
      'should throw when getting the document from the preferred group server when no preferred group has been defined',
      async ({ expect, serverTestContext }) => {
        expect.hasAssertions();

        try {
          await expect(
            serverTestContext.cluster.transactions().run(async (ctx) => {
              await expect(
                ctx.getReplicaFromPreferredServerGroup(
                  serverTestContext.collection,
                  'missingDocKey'
                )
              ).rejects.toThrowError(DocumentUnretrievableError);
            })
          ).rejects.toThrowError();
        } catch (err) {
          expect(err).toBeInstanceOf(TransactionFailedError);
          invariant(err instanceof TransactionFailedError);
          expect(err.stack).toContain('TransactionFailedError');
          expect(err.stack).toContain('document not found');
          expect(err.cause).toBeInstanceOf(DocumentUnretrievableError);
        }
      }
    );
  });
