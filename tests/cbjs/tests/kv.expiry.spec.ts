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
  AnyCollection,
  DocumentNotFoundError,
  InvalidArgumentError,
  LookupInMacro,
  MutateInSpec,
} from '@cbjsdev/cbjs';
import { ServerFeatures } from '@cbjsdev/http-client';
import { createCouchbaseTest } from '@cbjsdev/vitest';

import { serverSupportsFeatures } from '../utils/serverFeature.js';

describe.runIf(serverSupportsFeatures(ServerFeatures.Xattr))('kv expiry', async () => {
  const test = await createCouchbaseTest();

  const thirtyDaysInSeconds = 30 * 24 * 60 * 60;
  const fiftyYearsInSeconds = 50 * 365 * 24 * 60 * 60;
  // The server treats values <= 259200 (30 days) as relative to the current time.
  // So, the minimum expiry date is 259201 which corresponds to 1970-01-31T00:00:01Z
  const minExpiryDate = new Date('1970-01-31T00:00:01Z');
  // 2106-02-07T06:28:15Z in seconds (4294967295) is max 32-bit unsigned integer and server max expiry
  const maxExpiry = 4294967295;
  const maxExpiryDate = new Date('2106-02-07T06:28:15Z');
  const zeroSecondDate = new Date('1970-01-31T00:00:00Z');

  const expiryAsAbsoluteDate = (seconds: number) => {
    const now = new Date();
    return new Date(now.getTime() + seconds * 1000);
  };

  async function getDocExpiry(
    collection: AnyCollection,
    docKey: string
  ): Promise<number> {
    const {
      content: [{ value: docExpiry }],
    } = await collection.lookupIn(docKey).get(LookupInMacro.Expiry, { xattr: true });
    return docExpiry as number;
  }

  // -- Unix Timestamp tests --
  // The SDK does not support setting expiry as a unix timestamp directly, a Date should be used instead.
  // These tests confirm the behavior when a timestamp is passed in. The expiry will not be what a user expects
  // as an additional Math.floor(Date.now() / 1000) will be added to the expiry.
  describe('expiryUnixTimestamp', () => {
    const testCases = [
      1800, // 30 minutes
      thirtyDaysInSeconds - 1, // < 30 days expiry
      thirtyDaysInSeconds, // == 30 days expiry
      thirtyDaysInSeconds + 1, // > 30 days expiry
      thirtyDaysInSeconds * 2, // == 60 days expiry
    ];

    describe('mutation methods', () => {
      testCases.forEach((expiry) => {
        test(`insert w/ unix timestamp expiry=${expiry}`, async ({
          serverTestContext,
          expect,
          useDocumentKey,
        }) => {
          const docKey = useDocumentKey();
          const before = Math.floor(Date.now() / 1000) - 3;
          const expiryUnix = Math.floor(Date.now() / 1000) + expiry;

          const res = await serverTestContext.collection.insert(
            docKey,
            { foo: 'bar' },
            { expiry: expiryUnix }
          );
          expect(res.cas).toBeNonZeroCAS();

          const expiryRes = await getDocExpiry(serverTestContext.collection, docKey);
          const after = Math.floor(Date.now() / 1000) + 3;

          expect(expiryRes).toBeGreaterThanOrEqual(before + expiryUnix);
          expect(expiryRes).toBeLessThanOrEqual(expiryUnix + after);
        });

        test(`upsert w/ unix timestamp expiry=${expiry}`, async ({
          serverTestContext,
          expect,
          useDocumentKey,
        }) => {
          const docKey = useDocumentKey();
          const before = Math.floor(Date.now() / 1000) - 3;
          const expiryUnix = Math.floor(Date.now() / 1000) + expiry;

          const res = await serverTestContext.collection.upsert(
            docKey,
            { foo: 'bar' },
            { expiry: expiryUnix }
          );
          expect(res.cas).toBeNonZeroCAS();

          const expiryRes = await getDocExpiry(serverTestContext.collection, docKey);
          const after = Math.floor(Date.now() / 1000) + 3;

          expect(expiryRes).toBeGreaterThanOrEqual(before + expiryUnix);
          expect(expiryRes).toBeLessThanOrEqual(expiryUnix + after);
        });

        test(`increment w/ unix timestamp expiry=${expiry}`, async ({
          serverTestContext,
          expect,
          useDocumentKey,
        }) => {
          const docKey = useDocumentKey();
          const before = Math.floor(Date.now() / 1000) - 3;
          const expiryUnix = Math.floor(Date.now() / 1000) + expiry;

          const res = await serverTestContext.collection
            .binary()
            .increment(docKey, 1, { initial: 10, expiry: expiryUnix });
          expect(res.cas).toBeNonZeroCAS();

          const expiryRes = await getDocExpiry(serverTestContext.collection, docKey);
          const after = Math.floor(Date.now() / 1000) + 3;

          expect(expiryRes).toBeGreaterThanOrEqual(before + expiryUnix);
          expect(expiryRes).toBeLessThanOrEqual(expiryUnix + after);
        });

        test(`decrement w/ unix timestamp expiry=${expiry}`, async ({
          serverTestContext,
          expect,
          useDocumentKey,
        }) => {
          const docKey = useDocumentKey();
          const before = Math.floor(Date.now() / 1000) - 3;
          const expiryUnix = Math.floor(Date.now() / 1000) + expiry;

          const res = await serverTestContext.collection
            .binary()
            .decrement(docKey, 1, { initial: 10, expiry: expiryUnix });
          expect(res.cas).toBeNonZeroCAS();

          const expiryRes = await getDocExpiry(serverTestContext.collection, docKey);
          const after = Math.floor(Date.now() / 1000) + 3;

          expect(expiryRes).toBeGreaterThanOrEqual(before + expiryUnix);
          expect(expiryRes).toBeLessThanOrEqual(expiryUnix + after);
        });
      });
    });

    describe('update methods', () => {
      testCases.forEach((expiry) => {
        test(`replace w/ unix timestamp expiry=${expiry}`, async ({
          serverTestContext,
          expect,
          useDocumentKey,
        }) => {
          const docKey = useDocumentKey();
          await serverTestContext.collection.upsert(docKey, { foo: 'bar' });

          const before = Math.floor(Date.now() / 1000) - 3;
          const expiryUnix = Math.floor(Date.now() / 1000) + expiry;

          const res = await serverTestContext.collection.replace(
            docKey,
            { foo: 'bar' },
            { expiry: expiryUnix }
          );
          expect(res.cas).toBeNonZeroCAS();

          const expiryRes = await getDocExpiry(serverTestContext.collection, docKey);
          const after = Math.floor(Date.now() / 1000) + 3;

          expect(expiryRes).toBeGreaterThanOrEqual(before + expiryUnix);
          expect(expiryRes).toBeLessThanOrEqual(expiryUnix + after);
        });

        test(`mutateIn w/ unix timestamp expiry=${expiry}`, async ({
          serverTestContext,
          expect,
          useDocumentKey,
        }) => {
          const docKey = useDocumentKey();
          await serverTestContext.collection.upsert(docKey, { foo: 'bar' });

          const before = Math.floor(Date.now() / 1000) - 3;
          const expiryUnix = Math.floor(Date.now() / 1000) + expiry;

          const res = await serverTestContext.collection.mutateIn(
            docKey,
            [MutateInSpec.upsert('foo', 'world')],
            { expiry: expiryUnix }
          );
          expect(res.cas).toBeNonZeroCAS();

          const expiryRes = await getDocExpiry(serverTestContext.collection, docKey);
          const after = Math.floor(Date.now() / 1000) + 3;

          expect(expiryRes).toBeGreaterThanOrEqual(before + expiryUnix);
          expect(expiryRes).toBeLessThanOrEqual(expiryUnix + after);
        });
      });
    });

    describe('touch methods', () => {
      testCases.forEach((expiry) => {
        test(`touch w/ unix timestamp expiry=${expiry}`, async ({
          serverTestContext,
          expect,
          useDocumentKey,
        }) => {
          const docKey = useDocumentKey();
          await serverTestContext.collection.upsert(docKey, { foo: 'bar' });

          const before = Math.floor(Date.now() / 1000) - 3;
          const expiryUnix = Math.floor(Date.now() / 1000) + expiry;

          const res = await serverTestContext.collection.touch(docKey, expiryUnix);
          expect(res).toBeDefined();

          const expiryRes = await getDocExpiry(serverTestContext.collection, docKey);
          const after = Math.floor(Date.now() / 1000) + 3;

          expect(expiryRes).toBeGreaterThanOrEqual(before + expiryUnix);
          expect(expiryRes).toBeLessThanOrEqual(expiryUnix + after);
        });

        test(`getAndTouch w/ unix timestamp expiry=${expiry}`, async ({
          serverTestContext,
          expect,
          useDocumentKey,
        }) => {
          const docKey = useDocumentKey();
          await serverTestContext.collection.upsert(docKey, { foo: 'bar' });

          const before = Math.floor(Date.now() / 1000) - 3;
          const expiryUnix = Math.floor(Date.now() / 1000) + expiry;

          const res = await serverTestContext.collection.getAndTouch(docKey, expiryUnix);
          expect(res).toBeDefined();

          const expiryRes = await getDocExpiry(serverTestContext.collection, docKey);
          const after = Math.floor(Date.now() / 1000) + 3;

          expect(expiryRes).toBeGreaterThanOrEqual(before + expiryUnix);
          expect(expiryRes).toBeLessThanOrEqual(expiryUnix + after);
        });
      });
    });
  });

  // -- Invalid expiry tests --
  describe('expiryInvalid', () => {
    const failureCases: unknown[] = [
      -1, // negative
      '100', // not a number
      maxExpiry + 1, // greater than max expiry
      new Date('not a real date'), // invalid date
      new Date('1970-01-30T23:59:59Z'), // < min expiry Date
      new Date('2106-02-07T06:28:16Z'), // > max expiry Date
    ];

    describe('mutation methods', () => {
      failureCases.forEach((expiry) => {
        test(`insert throws InvalidArgumentError for expiry=${expiry}`, async ({
          serverTestContext,
          expect,
          useDocumentKey,
        }) => {
          const docKey = useDocumentKey();
          await expect(
            serverTestContext.collection.insert(docKey, { foo: 'bar' }, {
              expiry,
            } as any)
          ).rejects.toThrowError(InvalidArgumentError);
        });

        test(`upsert throws InvalidArgumentError for expiry=${expiry}`, async ({
          serverTestContext,
          expect,
          useDocumentKey,
        }) => {
          const docKey = useDocumentKey();
          await expect(
            serverTestContext.collection.upsert(docKey, { foo: 'bar' }, {
              expiry,
            } as any)
          ).rejects.toThrowError(InvalidArgumentError);
        });

        test(`increment throws InvalidArgumentError for expiry=${expiry}`, async ({
          serverTestContext,
          expect,
          useDocumentKey,
        }) => {
          const docKey = useDocumentKey();
          await expect(
            serverTestContext.collection
              .binary()
              .increment(docKey, 1, { initial: 10, expiry } as any)
          ).rejects.toThrowError(InvalidArgumentError);
        });

        test(`decrement throws InvalidArgumentError for expiry=${expiry}`, async ({
          serverTestContext,
          expect,
          useDocumentKey,
        }) => {
          const docKey = useDocumentKey();
          await expect(
            serverTestContext.collection
              .binary()
              .decrement(docKey, 1, { initial: 10, expiry } as any)
          ).rejects.toThrowError(InvalidArgumentError);
        });
      });
    });

    describe('update methods', () => {
      failureCases.forEach((expiry) => {
        test(`replace throws InvalidArgumentError for expiry=${expiry}`, async ({
          serverTestContext,
          expect,
          useDocumentKey,
        }) => {
          const docKey = useDocumentKey();
          await expect(
            serverTestContext.collection.replace(docKey, { foo: 'bar' }, {
              expiry,
            } as any)
          ).rejects.toThrowError(InvalidArgumentError);
        });

        test(`mutateIn throws InvalidArgumentError for expiry=${expiry}`, async ({
          serverTestContext,
          expect,
          useDocumentKey,
        }) => {
          const docKey = useDocumentKey();
          await expect(
            serverTestContext.collection.mutateIn(
              docKey,
              [MutateInSpec.upsert('foo', 'world')],
              { expiry } as any
            )
          ).rejects.toThrowError(InvalidArgumentError);
        });
      });
    });

    describe('touch methods', () => {
      failureCases.forEach((expiry) => {
        test(`touch throws InvalidArgumentError for expiry=${expiry}`, async ({
          serverTestContext,
          expect,
          useDocumentKey,
        }) => {
          const docKey = useDocumentKey();
          await expect(
            serverTestContext.collection.touch(docKey, expiry as any)
          ).rejects.toThrowError(InvalidArgumentError);
        });

        test(`getAndTouch throws InvalidArgumentError for expiry=${expiry}`, async ({
          serverTestContext,
          expect,
          useDocumentKey,
        }) => {
          const docKey = useDocumentKey();
          await expect(
            serverTestContext.collection.getAndTouch(docKey, expiry as any)
          ).rejects.toThrowError(InvalidArgumentError);
        });
      });
    });
  });

  // -- No expiry tests --
  describe('noExpiry', () => {
    describe('mutation methods', () => {
      test('insert with no expiry', async ({
        serverTestContext,
        expect,
        useDocumentKey,
      }) => {
        const docKey = useDocumentKey();
        const res = await serverTestContext.collection.insert(docKey, { foo: 'bar' });
        expect(res.cas).toBeNonZeroCAS();

        const expiryRes = await getDocExpiry(serverTestContext.collection, docKey);
        expect(expiryRes).toBe(0);
      });

      test('insert with zero expiry', async ({
        serverTestContext,
        expect,
        useDocumentKey,
      }) => {
        const docKey = useDocumentKey();
        const res = await serverTestContext.collection.insert(
          docKey,
          { foo: 'bar' },
          {
            expiry: 0,
          }
        );
        expect(res.cas).toBeNonZeroCAS();

        const expiryRes = await getDocExpiry(serverTestContext.collection, docKey);
        expect(expiryRes).toBe(0);
      });

      test('insert with zero instant date expiry', async ({
        serverTestContext,
        expect,
        useDocumentKey,
      }) => {
        const docKey = useDocumentKey();
        const res = await serverTestContext.collection.insert(docKey, { foo: 'bar' }, {
          expiry: zeroSecondDate,
        } as any);
        expect(res.cas).toBeNonZeroCAS();

        const expiryRes = await getDocExpiry(serverTestContext.collection, docKey);
        expect(expiryRes).toBe(0);
      });

      test('upsert with no expiry', async ({
        serverTestContext,
        expect,
        useDocumentKey,
      }) => {
        const docKey = useDocumentKey();
        const res = await serverTestContext.collection.upsert(docKey, { foo: 'bar' });
        expect(res.cas).toBeNonZeroCAS();

        const expiryRes = await getDocExpiry(serverTestContext.collection, docKey);
        expect(expiryRes).toBe(0);
      });

      test('upsert with zero expiry', async ({
        serverTestContext,
        expect,
        useDocumentKey,
      }) => {
        const docKey = useDocumentKey();
        const res = await serverTestContext.collection.upsert(
          docKey,
          { foo: 'bar' },
          {
            expiry: 0,
          }
        );
        expect(res.cas).toBeNonZeroCAS();

        const expiryRes = await getDocExpiry(serverTestContext.collection, docKey);
        expect(expiryRes).toBe(0);
      });

      test('upsert with zero instant date expiry', async ({
        serverTestContext,
        expect,
        useDocumentKey,
      }) => {
        const docKey = useDocumentKey();
        const res = await serverTestContext.collection.upsert(docKey, { foo: 'bar' }, {
          expiry: zeroSecondDate,
        } as any);
        expect(res.cas).toBeNonZeroCAS();

        const expiryRes = await getDocExpiry(serverTestContext.collection, docKey);
        expect(expiryRes).toBe(0);
      });

      test('increment with no expiry', async ({
        serverTestContext,
        expect,
        useDocumentKey,
      }) => {
        const docKey = useDocumentKey();
        const res = await serverTestContext.collection
          .binary()
          .increment(docKey, 1, { initial: 10 });
        expect(res.cas).toBeNonZeroCAS();

        const expiryRes = await getDocExpiry(serverTestContext.collection, docKey);
        expect(expiryRes).toBe(0);
      });

      test('increment with zero expiry', async ({
        serverTestContext,
        expect,
        useDocumentKey,
      }) => {
        const docKey = useDocumentKey();
        const res = await serverTestContext.collection
          .binary()
          .increment(docKey, 1, { initial: 10, expiry: 0 });
        expect(res.cas).toBeNonZeroCAS();

        const expiryRes = await getDocExpiry(serverTestContext.collection, docKey);
        expect(expiryRes).toBe(0);
      });

      test('increment with zero instant date expiry', async ({
        serverTestContext,
        expect,
        useDocumentKey,
      }) => {
        const docKey = useDocumentKey();
        const res = await serverTestContext.collection
          .binary()
          .increment(docKey, 1, { initial: 10, expiry: zeroSecondDate } as any);
        expect(res.cas).toBeNonZeroCAS();

        const expiryRes = await getDocExpiry(serverTestContext.collection, docKey);
        expect(expiryRes).toBe(0);
      });

      test('decrement with no expiry', async ({
        serverTestContext,
        expect,
        useDocumentKey,
      }) => {
        const docKey = useDocumentKey();
        const res = await serverTestContext.collection
          .binary()
          .decrement(docKey, 1, { initial: 10 });
        expect(res.cas).toBeNonZeroCAS();

        const expiryRes = await getDocExpiry(serverTestContext.collection, docKey);
        expect(expiryRes).toBe(0);
      });

      test('decrement with zero expiry', async ({
        serverTestContext,
        expect,
        useDocumentKey,
      }) => {
        const docKey = useDocumentKey();
        const res = await serverTestContext.collection
          .binary()
          .decrement(docKey, 1, { initial: 10, expiry: 0 });
        expect(res.cas).toBeNonZeroCAS();

        const expiryRes = await getDocExpiry(serverTestContext.collection, docKey);
        expect(expiryRes).toBe(0);
      });

      test('decrement with zero instant date expiry', async ({
        serverTestContext,
        expect,
        useDocumentKey,
      }) => {
        const docKey = useDocumentKey();
        const res = await serverTestContext.collection
          .binary()
          .decrement(docKey, 1, { initial: 10, expiry: zeroSecondDate } as any);
        expect(res.cas).toBeNonZeroCAS();

        const expiryRes = await getDocExpiry(serverTestContext.collection, docKey);
        expect(expiryRes).toBe(0);
      });
    });

    describe('update methods', () => {
      test('replace with no expiry', async ({
        serverTestContext,
        expect,
        useDocumentKey,
      }) => {
        const docKey = useDocumentKey();
        await serverTestContext.collection.upsert(docKey, { foo: 'bar' });

        const res = await serverTestContext.collection.replace(docKey, { foo: 'bar' });
        expect(res.cas).toBeNonZeroCAS();

        const expiryRes = await getDocExpiry(serverTestContext.collection, docKey);
        expect(expiryRes).toBe(0);
      });

      test('replace with zero expiry', async ({
        serverTestContext,
        expect,
        useDocumentKey,
      }) => {
        const docKey = useDocumentKey();
        await serverTestContext.collection.upsert(docKey, { foo: 'bar' });

        const res = await serverTestContext.collection.replace(
          docKey,
          { foo: 'bar' },
          { expiry: 0 }
        );
        expect(res.cas).toBeNonZeroCAS();

        const expiryRes = await getDocExpiry(serverTestContext.collection, docKey);
        expect(expiryRes).toBe(0);
      });

      test('replace with zero instant date expiry', async ({
        serverTestContext,
        expect,
        useDocumentKey,
      }) => {
        const docKey = useDocumentKey();
        await serverTestContext.collection.upsert(docKey, { foo: 'bar' });

        const res = await serverTestContext.collection.replace(docKey, { foo: 'bar' }, {
          expiry: zeroSecondDate,
        } as any);
        expect(res.cas).toBeNonZeroCAS();

        const expiryRes = await getDocExpiry(serverTestContext.collection, docKey);
        expect(expiryRes).toBe(0);
      });

      test('mutateIn with no expiry', async ({
        serverTestContext,
        expect,
        useDocumentKey,
      }) => {
        const docKey = useDocumentKey();
        await serverTestContext.collection.upsert(docKey, { foo: 'bar' });

        const res = await serverTestContext.collection.mutateIn(docKey, [
          MutateInSpec.upsert('foo', 'world'),
        ]);
        expect(res.cas).toBeNonZeroCAS();

        const expiryRes = await getDocExpiry(serverTestContext.collection, docKey);
        expect(expiryRes).toBe(0);
      });

      test('mutateIn with zero expiry', async ({
        serverTestContext,
        expect,
        useDocumentKey,
      }) => {
        const docKey = useDocumentKey();
        await serverTestContext.collection.upsert(docKey, { foo: 'bar' });

        const res = await serverTestContext.collection.mutateIn(
          docKey,
          [MutateInSpec.upsert('foo', 'world')],
          { expiry: 0 }
        );
        expect(res.cas).toBeNonZeroCAS();

        const expiryRes = await getDocExpiry(serverTestContext.collection, docKey);
        expect(expiryRes).toBe(0);
      });

      test('mutateIn with zero instant date expiry', async ({
        serverTestContext,
        expect,
        useDocumentKey,
      }) => {
        const docKey = useDocumentKey();
        await serverTestContext.collection.upsert(docKey, { foo: 'bar' });

        const res = await serverTestContext.collection.mutateIn(
          docKey,
          [MutateInSpec.upsert('foo', 'world')],
          { expiry: zeroSecondDate } as any
        );
        expect(res.cas).toBeNonZeroCAS();

        const expiryRes = await getDocExpiry(serverTestContext.collection, docKey);
        expect(expiryRes).toBe(0);
      });
    });

    describe('touch methods', () => {
      test('touch with zero expiry', async ({
        serverTestContext,
        expect,
        useDocumentKey,
      }) => {
        const docKey = useDocumentKey();
        await serverTestContext.collection.upsert(docKey, { foo: 'bar' });

        const res = await serverTestContext.collection.touch(docKey, 0);
        expect(res.cas).toBeNonZeroCAS();

        const expiryRes = await getDocExpiry(serverTestContext.collection, docKey);
        expect(expiryRes).toBe(0);
      });

      test('touch with zero instant date expiry', async ({
        serverTestContext,
        expect,
        useDocumentKey,
      }) => {
        const docKey = useDocumentKey();
        await serverTestContext.collection.upsert(docKey, { foo: 'bar' });

        const res = await serverTestContext.collection.touch(
          docKey,
          zeroSecondDate as any
        );
        expect(res.cas).toBeNonZeroCAS();

        const expiryRes = await getDocExpiry(serverTestContext.collection, docKey);
        expect(expiryRes).toBe(0);
      });

      test('getAndTouch with zero expiry', async ({
        serverTestContext,
        expect,
        useDocumentKey,
      }) => {
        const docKey = useDocumentKey();
        await serverTestContext.collection.upsert(docKey, { foo: 'bar' });

        const res = await serverTestContext.collection.getAndTouch(docKey, 0);
        expect(res.cas).toBeNonZeroCAS();

        const expiryRes = await getDocExpiry(serverTestContext.collection, docKey);
        expect(expiryRes).toBe(0);
      });

      test('getAndTouch with zero instant date expiry', async ({
        serverTestContext,
        expect,
        useDocumentKey,
      }) => {
        const docKey = useDocumentKey();
        await serverTestContext.collection.upsert(docKey, { foo: 'bar' });

        const res = await serverTestContext.collection.getAndTouch(
          docKey,
          zeroSecondDate as any
        );
        expect(res.cas).toBeNonZeroCAS();

        const expiryRes = await getDocExpiry(serverTestContext.collection, docKey);
        expect(expiryRes).toBe(0);
      });
    });
  });

  // -- Expiry as duration tests --
  describe('expiryDuration', () => {
    const allowedCases = [
      1800, // 30 minutes expiry duration
      thirtyDaysInSeconds - 1, // < 30 days expiry duration
      thirtyDaysInSeconds, // == 30 days expiry duration
      thirtyDaysInSeconds + 1, // > 30 days expiry duration
      thirtyDaysInSeconds * 2, // == 60 days expiry duration
    ];

    describe('mutation methods', () => {
      allowedCases.forEach((expiryDuration) => {
        test(`insert w/ expiry duration=${expiryDuration}`, async ({
          serverTestContext,
          expect,
          useDocumentKey,
        }) => {
          const docKey = useDocumentKey();
          const before = Math.floor(Date.now() / 1000) - 3;

          const res = await serverTestContext.collection.insert(
            docKey,
            { foo: 'bar' },
            { expiry: expiryDuration }
          );
          expect(res.cas).toBeNonZeroCAS();

          const expiryRes = await getDocExpiry(serverTestContext.collection, docKey);
          const after = Math.floor(Date.now() / 1000) + 3;

          expect(expiryRes).toBeGreaterThanOrEqual(before + expiryDuration);
          expect(expiryRes).toBeLessThanOrEqual(expiryDuration + after);
        });

        test(`upsert w/ expiry duration=${expiryDuration}`, async ({
          serverTestContext,
          expect,
          useDocumentKey,
        }) => {
          const docKey = useDocumentKey();
          const before = Math.floor(Date.now() / 1000) - 3;

          const res = await serverTestContext.collection.upsert(
            docKey,
            { foo: 'bar' },
            { expiry: expiryDuration }
          );
          expect(res.cas).toBeNonZeroCAS();

          const expiryRes = await getDocExpiry(serverTestContext.collection, docKey);
          const after = Math.floor(Date.now() / 1000) + 3;

          expect(expiryRes).toBeGreaterThanOrEqual(before + expiryDuration);
          expect(expiryRes).toBeLessThanOrEqual(expiryDuration + after);
        });

        test(`increment w/ expiry duration=${expiryDuration}`, async ({
          serverTestContext,
          expect,
          useDocumentKey,
        }) => {
          const docKey = useDocumentKey();
          const before = Math.floor(Date.now() / 1000) - 3;

          const res = await serverTestContext.collection
            .binary()
            .increment(docKey, 1, { initial: 10, expiry: expiryDuration });
          expect(res.cas).toBeNonZeroCAS();

          const expiryRes = await getDocExpiry(serverTestContext.collection, docKey);
          const after = Math.floor(Date.now() / 1000) + 3;

          expect(expiryRes).toBeGreaterThanOrEqual(before + expiryDuration);
          expect(expiryRes).toBeLessThanOrEqual(expiryDuration + after);
        });

        test(`decrement w/ expiry duration=${expiryDuration}`, async ({
          serverTestContext,
          expect,
          useDocumentKey,
        }) => {
          const docKey = useDocumentKey();
          const before = Math.floor(Date.now() / 1000) - 3;

          const res = await serverTestContext.collection
            .binary()
            .decrement(docKey, 1, { initial: 10, expiry: expiryDuration });
          expect(res.cas).toBeNonZeroCAS();

          const expiryRes = await getDocExpiry(serverTestContext.collection, docKey);
          const after = Math.floor(Date.now() / 1000) + 3;

          expect(expiryRes).toBeGreaterThanOrEqual(before + expiryDuration);
          expect(expiryRes).toBeLessThanOrEqual(expiryDuration + after);
        });
      });

      test('insert w/ max expiry duration', async ({
        serverTestContext,
        expect,
        useDocumentKey,
      }) => {
        const docKey = useDocumentKey();
        const before = Math.floor(Date.now() / 1000) - 3;
        const expiryDuration = maxExpiry - Math.floor(Date.now() / 1000);

        const res = await serverTestContext.collection.insert(
          docKey,
          { foo: 'bar' },
          { expiry: expiryDuration }
        );
        expect(res.cas).toBeNonZeroCAS();

        const expiryRes = await getDocExpiry(serverTestContext.collection, docKey);
        const after = Math.floor(Date.now() / 1000) + 3;

        expect(expiryRes).toBeGreaterThanOrEqual(before + expiryDuration);
        expect(expiryRes).toBeLessThanOrEqual(expiryDuration + after);
      });

      test('upsert w/ max expiry duration', async ({
        serverTestContext,
        expect,
        useDocumentKey,
      }) => {
        const docKey = useDocumentKey();
        const before = Math.floor(Date.now() / 1000) - 3;
        const expiryDuration = maxExpiry - Math.floor(Date.now() / 1000);

        const res = await serverTestContext.collection.upsert(
          docKey,
          { foo: 'bar' },
          { expiry: expiryDuration }
        );
        expect(res.cas).toBeNonZeroCAS();

        const expiryRes = await getDocExpiry(serverTestContext.collection, docKey);
        const after = Math.floor(Date.now() / 1000) + 3;

        expect(expiryRes).toBeGreaterThanOrEqual(before + expiryDuration);
        expect(expiryRes).toBeLessThanOrEqual(expiryDuration + after);
      });

      test('increment w/ max expiry duration', async ({
        serverTestContext,
        expect,
        useDocumentKey,
      }) => {
        const docKey = useDocumentKey();
        const before = Math.floor(Date.now() / 1000) - 3;
        // Max 32-bit unsigned int (0xFFFFFFFF) is a special case for increment/decrement
        const expiryDuration = maxExpiry - Math.floor(Date.now() / 1000) - 1;

        const res = await serverTestContext.collection
          .binary()
          .increment(docKey, 1, { initial: 10, expiry: expiryDuration });
        expect(res.cas).toBeNonZeroCAS();

        const expiryRes = await getDocExpiry(serverTestContext.collection, docKey);
        const after = Math.floor(Date.now() / 1000) + 3;

        expect(expiryRes).toBeGreaterThanOrEqual(before + expiryDuration);
        expect(expiryRes).toBeLessThanOrEqual(expiryDuration + after);
      });

      test('decrement w/ max expiry duration', async ({
        serverTestContext,
        expect,
        useDocumentKey,
      }) => {
        const docKey = useDocumentKey();
        const before = Math.floor(Date.now() / 1000) - 3;
        // Max 32-bit unsigned int (0xFFFFFFFF) is a special case for increment/decrement
        const expiryDuration = maxExpiry - Math.floor(Date.now() / 1000) - 1;

        const res = await serverTestContext.collection
          .binary()
          .decrement(docKey, 1, { initial: 10, expiry: expiryDuration });
        expect(res.cas).toBeNonZeroCAS();

        const expiryRes = await getDocExpiry(serverTestContext.collection, docKey);
        const after = Math.floor(Date.now() / 1000) + 3;

        expect(expiryRes).toBeGreaterThanOrEqual(before + expiryDuration);
        expect(expiryRes).toBeLessThanOrEqual(expiryDuration + after);
      });
    });

    describe('update methods', () => {
      allowedCases.forEach((expiryDuration) => {
        test(`replace w/ expiry duration=${expiryDuration}`, async ({
          serverTestContext,
          expect,
          useDocumentKey,
        }) => {
          const docKey = useDocumentKey();
          await serverTestContext.collection.upsert(docKey, { foo: 'bar' });

          const before = Math.floor(Date.now() / 1000) - 3;
          const res = await serverTestContext.collection.replace(
            docKey,
            { foo: 'bar' },
            { expiry: expiryDuration }
          );
          expect(res.cas).toBeNonZeroCAS();

          const expiryRes = await getDocExpiry(serverTestContext.collection, docKey);
          const after = Math.floor(Date.now() / 1000) + 3;

          expect(expiryRes).toBeGreaterThanOrEqual(before + expiryDuration);
          expect(expiryRes).toBeLessThanOrEqual(expiryDuration + after);
        });

        test(`mutateIn w/ expiry duration=${expiryDuration}`, async ({
          serverTestContext,
          expect,
          useDocumentKey,
        }) => {
          const docKey = useDocumentKey();
          await serverTestContext.collection.upsert(docKey, { foo: 'bar' });

          const before = Math.floor(Date.now() / 1000) - 3;
          const res = await serverTestContext.collection.mutateIn(
            docKey,
            [MutateInSpec.upsert('foo', 'world')],
            { expiry: expiryDuration }
          );
          expect(res.cas).toBeNonZeroCAS();

          const expiryRes = await getDocExpiry(serverTestContext.collection, docKey);
          const after = Math.floor(Date.now() / 1000) + 3;

          expect(expiryRes).toBeGreaterThanOrEqual(before + expiryDuration);
          expect(expiryRes).toBeLessThanOrEqual(expiryDuration + after);
        });
      });

      test('replace w/ max expiry duration', async ({
        serverTestContext,
        expect,
        useDocumentKey,
      }) => {
        const docKey = useDocumentKey();
        await serverTestContext.collection.upsert(docKey, { foo: 'bar' });

        const before = Math.floor(Date.now() / 1000) - 3;
        const expiryDuration = maxExpiry - Math.floor(Date.now() / 1000);

        const res = await serverTestContext.collection.replace(
          docKey,
          { foo: 'bar' },
          { expiry: expiryDuration }
        );
        expect(res.cas).toBeNonZeroCAS();

        const expiryRes = await getDocExpiry(serverTestContext.collection, docKey);
        const after = Math.floor(Date.now() / 1000) + 3;

        expect(expiryRes).toBeGreaterThanOrEqual(before + expiryDuration);
        expect(expiryRes).toBeLessThanOrEqual(expiryDuration + after);
      });

      test('mutateIn w/ max expiry duration', async ({
        serverTestContext,
        expect,
        useDocumentKey,
      }) => {
        const docKey = useDocumentKey();
        await serverTestContext.collection.upsert(docKey, { foo: 'bar' });

        const before = Math.floor(Date.now() / 1000) - 3;
        const expiryDuration = maxExpiry - Math.floor(Date.now() / 1000);

        const res = await serverTestContext.collection.mutateIn(
          docKey,
          [MutateInSpec.upsert('foo', 'world')],
          { expiry: expiryDuration }
        );
        expect(res.cas).toBeNonZeroCAS();

        const expiryRes = await getDocExpiry(serverTestContext.collection, docKey);
        const after = Math.floor(Date.now() / 1000) + 3;

        expect(expiryRes).toBeGreaterThanOrEqual(before + expiryDuration);
        expect(expiryRes).toBeLessThanOrEqual(expiryDuration + after);
      });
    });

    describe('touch methods', () => {
      allowedCases.forEach((expiryDuration) => {
        test(`touch w/ expiry duration=${expiryDuration}`, async ({
          serverTestContext,
          expect,
          useDocumentKey,
        }) => {
          const docKey = useDocumentKey();
          await serverTestContext.collection.upsert(docKey, { foo: 'bar' });

          const before = Math.floor(Date.now() / 1000) - 3;
          const res = await serverTestContext.collection.touch(docKey, expiryDuration);
          expect(res.cas).toBeNonZeroCAS();

          const expiryRes = await getDocExpiry(serverTestContext.collection, docKey);
          const after = Math.floor(Date.now() / 1000) + 3;

          expect(expiryRes).toBeGreaterThanOrEqual(before + expiryDuration);
          expect(expiryRes).toBeLessThanOrEqual(expiryDuration + after);
        });

        test(`getAndTouch w/ expiry duration=${expiryDuration}`, async ({
          serverTestContext,
          expect,
          useDocumentKey,
        }) => {
          const docKey = useDocumentKey();
          await serverTestContext.collection.upsert(docKey, { foo: 'bar' });

          const before = Math.floor(Date.now() / 1000) - 3;
          const res = await serverTestContext.collection.getAndTouch(
            docKey,
            expiryDuration
          );
          expect(res.cas).toBeNonZeroCAS();

          const expiryRes = await getDocExpiry(serverTestContext.collection, docKey);
          const after = Math.floor(Date.now() / 1000) + 3;

          expect(expiryRes).toBeGreaterThanOrEqual(before + expiryDuration);
          expect(expiryRes).toBeLessThanOrEqual(expiryDuration + after);
        });
      });

      test('touch w/ max expiry duration', async ({
        serverTestContext,
        expect,
        useDocumentKey,
      }) => {
        const docKey = useDocumentKey();
        await serverTestContext.collection.upsert(docKey, { foo: 'bar' });

        const before = Math.floor(Date.now() / 1000) - 3;
        const expiryDuration = maxExpiry - Math.floor(Date.now() / 1000);

        const res = await serverTestContext.collection.touch(docKey, expiryDuration);
        expect(res.cas).toBeNonZeroCAS();

        const expiryRes = await getDocExpiry(serverTestContext.collection, docKey);
        const after = Math.floor(Date.now() / 1000) + 3;

        expect(expiryRes).toBeGreaterThanOrEqual(before + expiryDuration);
        expect(expiryRes).toBeLessThanOrEqual(expiryDuration + after);
      });

      test('getAndTouch w/ max expiry duration', async ({
        serverTestContext,
        expect,
        useDocumentKey,
      }) => {
        const docKey = useDocumentKey();
        await serverTestContext.collection.upsert(docKey, { foo: 'bar' });

        const before = Math.floor(Date.now() / 1000) - 3;
        const expiryDuration = maxExpiry - Math.floor(Date.now() / 1000);

        const res = await serverTestContext.collection.getAndTouch(
          docKey,
          expiryDuration
        );
        expect(res.cas).toBeNonZeroCAS();

        const expiryRes = await getDocExpiry(serverTestContext.collection, docKey);
        const after = Math.floor(Date.now() / 1000) + 3;

        expect(expiryRes).toBeGreaterThanOrEqual(before + expiryDuration);
        expect(expiryRes).toBeLessThanOrEqual(expiryDuration + after);
      });
    });
  });

  // -- Expiry as instant (Date) tests --
  describe('expiryInstant', () => {
    const allowedCases = [
      1800, // 30 minutes
      thirtyDaysInSeconds - 1, // < 30 days
      thirtyDaysInSeconds, // == 30 days
      thirtyDaysInSeconds + 1, // > 30 days
      thirtyDaysInSeconds * 2, // == 60 days
      fiftyYearsInSeconds, // 50 years
      fiftyYearsInSeconds + 1, // 50 years + 1 second
    ];

    describe('mutation methods', () => {
      allowedCases.forEach((expiryInstant) => {
        test(`insert w/ expiry as Date; expiry=${expiryInstant}`, async ({
          serverTestContext,
          expect,
          useDocumentKey,
        }) => {
          const docKey = useDocumentKey();
          const expiry = expiryAsAbsoluteDate(expiryInstant);

          const res = await serverTestContext.collection.insert(docKey, { foo: 'bar' }, {
            expiry,
          } as any);
          expect(res.cas).toBeNonZeroCAS();

          const expiryRes = await getDocExpiry(serverTestContext.collection, docKey);
          const expiryInstantEpochSeconds = Math.floor(expiry.getTime() / 1000);

          expect(expiryRes).toBeGreaterThanOrEqual(expiryInstantEpochSeconds - 1);
          expect(expiryRes).toBeLessThanOrEqual(expiryInstantEpochSeconds + 1);
        });

        test(`upsert w/ expiry as Date; expiry=${expiryInstant}`, async ({
          serverTestContext,
          expect,
          useDocumentKey,
        }) => {
          const docKey = useDocumentKey();
          const expiry = expiryAsAbsoluteDate(expiryInstant);

          const res = await serverTestContext.collection.upsert(docKey, { foo: 'bar' }, {
            expiry,
          } as any);
          expect(res.cas).toBeNonZeroCAS();

          const expiryRes = await getDocExpiry(serverTestContext.collection, docKey);
          const expiryInstantEpochSeconds = Math.floor(expiry.getTime() / 1000);

          expect(expiryRes).toBeGreaterThanOrEqual(expiryInstantEpochSeconds - 1);
          expect(expiryRes).toBeLessThanOrEqual(expiryInstantEpochSeconds + 1);
        });

        test(`increment w/ expiry as Date; expiry=${expiryInstant}`, async ({
          serverTestContext,
          expect,
          useDocumentKey,
        }) => {
          const docKey = useDocumentKey();
          const expiry = expiryAsAbsoluteDate(expiryInstant);

          const res = await serverTestContext.collection
            .binary()
            .increment(docKey, 1, { initial: 10, expiry } as any);
          expect(res.cas).toBeNonZeroCAS();

          const expiryRes = await getDocExpiry(serverTestContext.collection, docKey);
          const expiryInstantEpochSeconds = Math.floor(expiry.getTime() / 1000);

          expect(expiryRes).toBeGreaterThanOrEqual(expiryInstantEpochSeconds - 1);
          expect(expiryRes).toBeLessThanOrEqual(expiryInstantEpochSeconds + 1);
        });

        test(`decrement w/ expiry as Date; expiry=${expiryInstant}`, async ({
          serverTestContext,
          expect,
          useDocumentKey,
        }) => {
          const docKey = useDocumentKey();
          const expiry = expiryAsAbsoluteDate(expiryInstant);

          const res = await serverTestContext.collection
            .binary()
            .decrement(docKey, 1, { initial: 10, expiry } as any);
          expect(res.cas).toBeNonZeroCAS();

          const expiryRes = await getDocExpiry(serverTestContext.collection, docKey);
          const expiryInstantEpochSeconds = Math.floor(expiry.getTime() / 1000);

          expect(expiryRes).toBeGreaterThanOrEqual(expiryInstantEpochSeconds - 1);
          expect(expiryRes).toBeLessThanOrEqual(expiryInstantEpochSeconds + 1);
        });
      });

      test('insert w/ expiry=minExpiryDate (document should immediately expire)', async ({
        serverTestContext,
        expect,
        useDocumentKey,
      }) => {
        const docKey = useDocumentKey();
        const res = await serverTestContext.collection.insert(docKey, { foo: 'bar' }, {
          expiry: minExpiryDate,
        } as any);
        expect(res.cas).toBeNonZeroCAS();

        await expect(serverTestContext.collection.get(docKey)).rejects.toThrowError(
          DocumentNotFoundError
        );
      });

      test('upsert w/ expiry=minExpiryDate (document should immediately expire)', async ({
        serverTestContext,
        expect,
        useDocumentKey,
      }) => {
        const docKey = useDocumentKey();
        const res = await serverTestContext.collection.upsert(docKey, { foo: 'bar' }, {
          expiry: minExpiryDate,
        } as any);
        expect(res.cas).toBeNonZeroCAS();

        await expect(serverTestContext.collection.get(docKey)).rejects.toThrowError(
          DocumentNotFoundError
        );
      });

      test('increment w/ expiry=minExpiryDate (document should immediately expire)', async ({
        serverTestContext,
        expect,
        useDocumentKey,
      }) => {
        const docKey = useDocumentKey();
        const res = await serverTestContext.collection
          .binary()
          .increment(docKey, 1, { initial: 10, expiry: minExpiryDate } as any);
        expect(res.cas).toBeNonZeroCAS();

        await expect(serverTestContext.collection.get(docKey)).rejects.toThrowError(
          DocumentNotFoundError
        );
      });

      test('decrement w/ expiry=minExpiryDate (document should immediately expire)', async ({
        serverTestContext,
        expect,
        useDocumentKey,
      }) => {
        const docKey = useDocumentKey();
        const res = await serverTestContext.collection
          .binary()
          .decrement(docKey, 1, { initial: 10, expiry: minExpiryDate } as any);
        expect(res.cas).toBeNonZeroCAS();

        await expect(serverTestContext.collection.get(docKey)).rejects.toThrowError(
          DocumentNotFoundError
        );
      });

      test('insert w/ expiry=maxExpiryDate', async ({
        serverTestContext,
        expect,
        useDocumentKey,
      }) => {
        const docKey = useDocumentKey();
        const res = await serverTestContext.collection.insert(docKey, { foo: 'bar' }, {
          expiry: maxExpiryDate,
        } as any);
        expect(res.cas).toBeNonZeroCAS();

        const expiryRes = await getDocExpiry(serverTestContext.collection, docKey);
        expect(expiryRes).toBe(maxExpiry);
      });

      test('upsert w/ expiry=maxExpiryDate', async ({
        serverTestContext,
        expect,
        useDocumentKey,
      }) => {
        const docKey = useDocumentKey();
        const res = await serverTestContext.collection.upsert(docKey, { foo: 'bar' }, {
          expiry: maxExpiryDate,
        } as any);
        expect(res.cas).toBeNonZeroCAS();

        const expiryRes = await getDocExpiry(serverTestContext.collection, docKey);
        expect(expiryRes).toBe(maxExpiry);
      });

      // Max 32-bit unsigned int (0xFFFFFFFF) is a special case for increment/decrement.
      // Max allowed is 4294967294 which is 2106-02-07T06:28:14Z
      test('increment w/ expiry=maxExpiryDate (adjusted for counter limit)', async ({
        serverTestContext,
        expect,
        useDocumentKey,
      }) => {
        const docKey = useDocumentKey();
        const res = await serverTestContext.collection.binary().increment(docKey, 1, {
          initial: 10,
          expiry: new Date('2106-02-07T06:28:14Z'),
        } as any);
        expect(res.cas).toBeNonZeroCAS();

        const expiryRes = await getDocExpiry(serverTestContext.collection, docKey);
        expect(expiryRes).toBe(maxExpiry - 1);
      });

      test('decrement w/ expiry=maxExpiryDate (adjusted for counter limit)', async ({
        serverTestContext,
        expect,
        useDocumentKey,
      }) => {
        const docKey = useDocumentKey();
        const res = await serverTestContext.collection.binary().decrement(docKey, 1, {
          initial: 10,
          expiry: new Date('2106-02-07T06:28:14Z'),
        } as any);
        expect(res.cas).toBeNonZeroCAS();

        const expiryRes = await getDocExpiry(serverTestContext.collection, docKey);
        expect(expiryRes).toBe(maxExpiry - 1);
      });
    });

    describe('update methods', () => {
      allowedCases.forEach((expiryInstant) => {
        test(`replace w/ expiry as Date; expiry=${expiryInstant}`, async ({
          serverTestContext,
          expect,
          useDocumentKey,
        }) => {
          const docKey = useDocumentKey();
          await serverTestContext.collection.upsert(docKey, { foo: 'bar' });

          const expiry = expiryAsAbsoluteDate(expiryInstant);
          const res = await serverTestContext.collection.replace(docKey, { foo: 'bar' }, {
            expiry,
          } as any);
          expect(res.cas).toBeNonZeroCAS();

          const expiryRes = await getDocExpiry(serverTestContext.collection, docKey);
          const expiryInstantEpochSeconds = Math.floor(expiry.getTime() / 1000);

          expect(expiryRes).toBeGreaterThanOrEqual(expiryInstantEpochSeconds - 1);
          expect(expiryRes).toBeLessThanOrEqual(expiryInstantEpochSeconds + 1);
        });

        test(`mutateIn w/ expiry as Date; expiry=${expiryInstant}`, async ({
          serverTestContext,
          expect,
          useDocumentKey,
        }) => {
          const docKey = useDocumentKey();
          await serverTestContext.collection.upsert(docKey, { foo: 'bar' });

          const expiry = expiryAsAbsoluteDate(expiryInstant);
          const res = await serverTestContext.collection.mutateIn(
            docKey,
            [MutateInSpec.upsert('foo', 'world')],
            { expiry } as any
          );
          expect(res.cas).toBeNonZeroCAS();

          const expiryRes = await getDocExpiry(serverTestContext.collection, docKey);
          const expiryInstantEpochSeconds = Math.floor(expiry.getTime() / 1000);

          expect(expiryRes).toBeGreaterThanOrEqual(expiryInstantEpochSeconds - 1);
          expect(expiryRes).toBeLessThanOrEqual(expiryInstantEpochSeconds + 1);
        });
      });

      test('replace w/ expiry=minExpiryDate (document should immediately expire)', async ({
        serverTestContext,
        expect,
        useDocumentKey,
      }) => {
        const docKey = useDocumentKey();
        await serverTestContext.collection.upsert(docKey, { foo: 'bar' });

        const res = await serverTestContext.collection.replace(docKey, { foo: 'bar' }, {
          expiry: minExpiryDate,
        } as any);
        expect(res.cas).toBeNonZeroCAS();

        await expect(serverTestContext.collection.get(docKey)).rejects.toThrowError(
          DocumentNotFoundError
        );
      });

      test('mutateIn w/ expiry=minExpiryDate (document should immediately expire)', async ({
        serverTestContext,
        expect,
        useDocumentKey,
      }) => {
        const docKey = useDocumentKey();
        await serverTestContext.collection.upsert(docKey, { foo: 'bar' });

        const res = await serverTestContext.collection.mutateIn(
          docKey,
          [MutateInSpec.upsert('foo', 'world')],
          { expiry: minExpiryDate } as any
        );
        expect(res.cas).toBeNonZeroCAS();

        await expect(serverTestContext.collection.get(docKey)).rejects.toThrowError(
          DocumentNotFoundError
        );
      });

      test('replace w/ expiry=maxExpiryDate', async ({
        serverTestContext,
        expect,
        useDocumentKey,
      }) => {
        const docKey = useDocumentKey();
        await serverTestContext.collection.upsert(docKey, { foo: 'bar' });

        const res = await serverTestContext.collection.replace(docKey, { foo: 'bar' }, {
          expiry: maxExpiryDate,
        } as any);
        expect(res.cas).toBeNonZeroCAS();

        const expiryRes = await getDocExpiry(serverTestContext.collection, docKey);
        expect(expiryRes).toBe(maxExpiry);
      });

      test('mutateIn w/ expiry=maxExpiryDate', async ({
        serverTestContext,
        expect,
        useDocumentKey,
      }) => {
        const docKey = useDocumentKey();
        await serverTestContext.collection.upsert(docKey, { foo: 'bar' });

        const res = await serverTestContext.collection.mutateIn(
          docKey,
          [MutateInSpec.upsert('foo', 'world')],
          { expiry: maxExpiryDate } as any
        );
        expect(res.cas).toBeNonZeroCAS();

        const expiryRes = await getDocExpiry(serverTestContext.collection, docKey);
        expect(expiryRes).toBe(maxExpiry);
      });
    });

    describe('touch methods', () => {
      allowedCases.forEach((expiryInstant) => {
        test(`touch w/ expiry as Date; expiry=${expiryInstant}`, async ({
          serverTestContext,
          expect,
          useDocumentKey,
        }) => {
          const docKey = useDocumentKey();
          await serverTestContext.collection.upsert(docKey, { foo: 'bar' });

          const expiry = expiryAsAbsoluteDate(expiryInstant);
          const res = await serverTestContext.collection.touch(docKey, expiry as any);
          expect(res.cas).toBeNonZeroCAS();

          const expiryRes = await getDocExpiry(serverTestContext.collection, docKey);
          const expiryInstantEpochSeconds = Math.floor(expiry.getTime() / 1000);

          expect(expiryRes).toBeGreaterThanOrEqual(expiryInstantEpochSeconds - 1);
          expect(expiryRes).toBeLessThanOrEqual(expiryInstantEpochSeconds + 1);
        });

        test(`getAndTouch w/ expiry as Date; expiry=${expiryInstant}`, async ({
          serverTestContext,
          expect,
          useDocumentKey,
        }) => {
          const docKey = useDocumentKey();
          await serverTestContext.collection.upsert(docKey, { foo: 'bar' });

          const expiry = expiryAsAbsoluteDate(expiryInstant);
          const res = await serverTestContext.collection.getAndTouch(
            docKey,
            expiry as any
          );
          expect(res.cas).toBeNonZeroCAS();

          const expiryRes = await getDocExpiry(serverTestContext.collection, docKey);
          const expiryInstantEpochSeconds = Math.floor(expiry.getTime() / 1000);

          expect(expiryRes).toBeGreaterThanOrEqual(expiryInstantEpochSeconds - 1);
          expect(expiryRes).toBeLessThanOrEqual(expiryInstantEpochSeconds + 1);
        });
      });

      test('touch w/ expiry=minExpiryDate (document should immediately expire)', async ({
        serverTestContext,
        expect,
        useDocumentKey,
      }) => {
        const docKey = useDocumentKey();
        await serverTestContext.collection.upsert(docKey, { foo: 'bar' });

        const res = await serverTestContext.collection.touch(
          docKey,
          minExpiryDate as any
        );
        expect(res.cas).toBeNonZeroCAS();

        await expect(serverTestContext.collection.get(docKey)).rejects.toThrowError(
          DocumentNotFoundError
        );
      });

      test('getAndTouch w/ expiry=minExpiryDate (document should immediately expire)', async ({
        serverTestContext,
        expect,
        useDocumentKey,
      }) => {
        const docKey = useDocumentKey();
        await serverTestContext.collection.upsert(docKey, { foo: 'bar' });

        const res = await serverTestContext.collection.getAndTouch(
          docKey,
          minExpiryDate as any
        );
        expect(res.cas).toBeNonZeroCAS();

        await expect(serverTestContext.collection.get(docKey)).rejects.toThrowError(
          DocumentNotFoundError
        );
      });

      test('touch w/ expiry=maxExpiryDate', async ({
        serverTestContext,
        expect,
        useDocumentKey,
      }) => {
        const docKey = useDocumentKey();
        await serverTestContext.collection.upsert(docKey, { foo: 'bar' });

        const res = await serverTestContext.collection.touch(
          docKey,
          maxExpiryDate as any
        );
        expect(res.cas).toBeNonZeroCAS();

        const expiryRes = await getDocExpiry(serverTestContext.collection, docKey);
        expect(expiryRes).toBe(maxExpiry);
      });

      test('getAndTouch w/ expiry=maxExpiryDate', async ({
        serverTestContext,
        expect,
        useDocumentKey,
      }) => {
        const docKey = useDocumentKey();
        await serverTestContext.collection.upsert(docKey, { foo: 'bar' });

        const res = await serverTestContext.collection.getAndTouch(
          docKey,
          maxExpiryDate as any
        );
        expect(res.cas).toBeNonZeroCAS();

        const expiryRes = await getDocExpiry(serverTestContext.collection, docKey);
        expect(expiryRes).toBe(maxExpiry);
      });
    });
  });
});
