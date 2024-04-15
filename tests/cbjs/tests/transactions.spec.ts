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
import {
  BucketNotFoundError,
  DocumentExistsError,
  DocumentNotFoundError,
  KeyValueErrorContext,
  ParsingFailureError,
  TransactionFailedError,
  TransactionOperationFailedError,
} from '@cbjsdev/cbjs';
import { invariant, sleep } from '@cbjsdev/shared';
import { createCouchbaseTest } from '@cbjsdev/vitest';
import { describe } from 'vitest';

import { ServerFeatures, serverSupportsFeatures } from '../utils/serverFeature';

describe.runIf(serverSupportsFeatures(ServerFeatures.Transactions)).shuffle(
  'transactions',
  async () => {
    const test = await createCouchbaseTest(async ({ serverTestContext }) => {
      await sleep(2000);
      await serverTestContext.collection.queryIndexes().createPrimaryIndex();
    });

    test(
      'should work with a simple transaction',
      async function ({ expect, serverTestContext, useDocumentKey }) {
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
      },
      { timeout: 15_000 }
    );

    test(
      'should be able to check if a document exists within transaction',
      async function ({ expect, serverTestContext, useDocumentKey }) {
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
      },
      { timeout: 15_000 }
    );

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

        await expect(
          attempt.query(
            `SELECT op FROM ${serverTestContext.getKeyspacePath()} WHERE META().id IN $1`,
            {
              parameters: [[testDocKey1, testDocKey2]],
            }
          )
        ).resolves.toEqual(
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
  },
  { timeout: 15_000 }
);
