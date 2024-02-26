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
  BucketExistsError,
  BucketNotFlushableError,
  BucketNotFoundError,
  HttpErrorContext,
  IBucketSettings,
  InvalidArgumentError,
  StorageBackend,
  TimeoutError,
} from '@cbjsdev/cbjs';
import { invariant } from '@cbjsdev/shared';
import { createCouchbaseTest } from '@cbjsdev/vitest';

import { ServerFeatures, serverSupportsFeatures } from '../utils/serverFeature';

describe.shuffle('bucket manager', async () => {
  const test = await createCouchbaseTest();

  test(
    'should successfully create and delete a bucket',
    async function ({ expect, useBucket }) {
      await expect(useBucket()).resolves.toBeTypeOf('string');
    },
    { timeout: 10_000 }
  );

  test('should throw a BucketExistsError on duplicate buckets', async function ({
    expect,
    useBucket,
  }) {
    expect.hasAssertions();
    const bucket = await useBucket();

    try {
      await useBucket({ bucketName: bucket });
    } catch (err) {
      expect(err).toBeInstanceOf(BucketExistsError);
      invariant(err instanceof BucketExistsError);
      expect(err.context).toBeInstanceOf(HttpErrorContext);
    }
  });

  test('should successfully get a bucket', async function ({
    expect,
    serverTestContext,
    useBucket,
  }) {
    const bucket = await useBucket();
    const res = await serverTestContext.cluster.buckets().getBucket(bucket);

    const expected: IBucketSettings = {
      name: bucket,
      flushEnabled: false,
      ramQuotaMB: 256,
      numReplicas: 0,
      replicaIndexes: false,
      bucketType: 'membase',
      storageBackend: 'couchstore',
      evictionPolicy: 'valueOnly',
      maxExpiry: 0,
      compressionMode: 'passive',
      minimumDurabilityLevel: undefined,
      historyRetentionCollectionDefault: undefined,
      historyRetentionBytes: undefined,
      historyRetentionDuration: undefined,
    };
    if (!serverSupportsFeatures(ServerFeatures.StorageBackend)) {
      expected.storageBackend = undefined;
    }

    expect(res).toEqual(expected);
  });

  test('should successfully get all buckets', async function ({
    expect,
    serverTestContext,
    useBucket,
  }) {
    const bucket = await useBucket();
    const bucket2 = await useBucket();
    const res = await serverTestContext.cluster.buckets().getAllBuckets();
    const names = res.map((b) => b.name);

    expect(names.length >= 2).toBe(true);
    expect(names).toContain(bucket);
    expect(names).toContain(bucket2);
  });

  test('should throw a BucketNotFoundError when getting a missing bucket', async function ({
    expect,
    serverTestContext,
  }) {
    expect.hasAssertions();

    try {
      await serverTestContext.c.buckets().getBucket('missingBucket');
    } catch (err) {
      expect(err).toBeInstanceOf(BucketNotFoundError);
      invariant(err instanceof BucketNotFoundError);
      expect(err.context).toBeInstanceOf(HttpErrorContext);
    }
  });

  test(
    'should successfully flush a bucket',
    async function ({ expect, serverTestContext, useBucket }) {
      const localBucket = await useBucket({
        flushEnabled: true,
      });

      await expect(
        serverTestContext.c.buckets().flushBucket(localBucket)
      ).resolves.toBeUndefined();
    },
    { timeout: 10_000 }
  );

  test('should throw a BucketNotFoundError when trying to flush a missing bucket', async function ({
    expect,
    serverTestContext,
  }) {
    expect.hasAssertions();

    try {
      await serverTestContext.c.buckets().flushBucket('missingBucket');
    } catch (err) {
      expect(err).toBeInstanceOf(BucketNotFoundError);
      invariant(err instanceof BucketNotFoundError);
      expect(err.context).toBeInstanceOf(HttpErrorContext);
    }
  });

  test('should successfully update a bucket', async function ({
    expect,
    serverTestContext,
    useBucket,
  }) {
    const bucket = await useBucket();
    await expect(
      serverTestContext.c.buckets().updateBucket({
        name: bucket,
        ramQuotaMB: 256,
        maxExpiry: 60,
      })
    ).resolves.toBeUndefined();
  });

  test('should throw a InvalidArgumentError when updating a couchstore bucket with history', async function ({
    expect,
    serverTestContext,
    testBucket,
  }) {
    expect.hasAssertions();

    try {
      await serverTestContext.c.buckets().updateBucket({
        name: testBucket,
        historyRetentionCollectionDefault: true,
        ramQuotaMB: 1024,
      });
    } catch (err) {
      expect(err).toBeInstanceOf(InvalidArgumentError);
      invariant(err instanceof InvalidArgumentError);
      expect(err.context).toBeInstanceOf(HttpErrorContext);
    }
  });

  test('should throw a BucketNotFlushableError when trying to flush an unflushable bucket', async function ({
    expect,
    serverTestContext,
    useBucket,
  }) {
    expect.hasAssertions();
    const localBucket = await useBucket({
      flushEnabled: false,
    });

    try {
      await serverTestContext.c.buckets().flushBucket(localBucket);
    } catch (err) {
      expect(err).toBeInstanceOf(BucketNotFlushableError);
      invariant(err instanceof BucketNotFlushableError);
      expect(err.context).toBeInstanceOf(HttpErrorContext);
    }
  });

  test('should throw a TimeoutError when the operation timeouts', async function ({
    expect,
    serverTestContext,
    useBucket,
  }) {
    expect.hasAssertions();
    const localBucket = await useBucket({
      flushEnabled: true,
    });

    try {
      await serverTestContext.c.buckets().flushBucket(localBucket, { timeout: 1 });
    } catch (err) {
      expect(err).toBeInstanceOf(TimeoutError);
      invariant(err instanceof TimeoutError);
      expect(err.context).toBeInstanceOf(HttpErrorContext);
    }
  });

  test('should throw a BucketNotFoundError when dropping a missing bucket', async function ({
    expect,
    serverTestContext,
  }) {
    expect.hasAssertions();

    try {
      await serverTestContext.c.buckets().dropBucket('missingBucket');
    } catch (err) {
      expect(err).toBeInstanceOf(BucketNotFoundError);
      invariant(err instanceof BucketNotFoundError);
      expect(err.context).toBeInstanceOf(HttpErrorContext);
    }
  });

  test(
    'should successfully create a bucket with flush and replicaIndexes disabled',
    async function ({ expect, serverTestContext, useBucket }) {
      const bucketName = await useBucket({
        ramQuotaMB: 256,
        flushEnabled: false,
        replicaIndexes: false,
      });

      const res = await serverTestContext.c.buckets().getBucket(bucketName);

      const expected: IBucketSettings = {
        name: bucketName,
        flushEnabled: false,
        ramQuotaMB: 256,
        numReplicas: 0,
        replicaIndexes: false,
        bucketType: 'membase',
        storageBackend: 'couchstore',
        evictionPolicy: 'valueOnly',
        maxExpiry: 0,
        compressionMode: 'passive',
        minimumDurabilityLevel: undefined,
        historyRetentionCollectionDefault: undefined,
        historyRetentionBytes: undefined,
        historyRetentionDuration: undefined,
      };

      if (!serverSupportsFeatures(ServerFeatures.StorageBackend)) {
        expected.storageBackend = undefined;
      }

      expect(res).toEqual(expected);
    },
    { timeout: 10_000 }
  );

  test(
    'should successfully create a bucket with history settings',
    async function ({ expect, serverTestContext, useBucket }) {
      const bucketName = await useBucket({
        ramQuotaMB: 1024,
        storageBackend: 'magma',
        historyRetentionCollectionDefault: true,
        historyRetentionBytes: 2147483648,
        historyRetentionDuration: 13000,
      });

      const res = await serverTestContext.c.buckets().getBucket(bucketName);

      expect(res).toBeTypeOf('object');

      const expected = {
        name: bucketName,
        bucketType: 'membase',
        compressionMode: 'passive',
        evictionPolicy: 'fullEviction',
        flushEnabled: false,
        maxExpiry: 0,
        minimumDurabilityLevel: undefined,
        numReplicas: 0,
        replicaIndexes: undefined,
        ramQuotaMB: 1024,
        storageBackend: 'magma',
        historyRetentionCollectionDefault: true,
        historyRetentionBytes: 2147483648,
        historyRetentionDuration: 13000,
      };

      expect(res).toEqual(expected);
    },
    { timeout: 10_000 }
  );

  test.runIf(serverSupportsFeatures(ServerFeatures.BucketDedup))(
    'should update the history settings on a bucket',
    async function ({ expect, serverTestContext, useBucket }) {
      const bucket = await useBucket({
        storageBackend: 'magma',
      });

      const bmgr = serverTestContext.c.buckets();
      await bmgr.updateBucket({
        name: bucket,
        ramQuotaMB: 1024,
        historyRetentionCollectionDefault: false,
        historyRetentionBytes: 0,
        historyRetentionDuration: 14000,
      });

      const res = await bmgr.getBucket(bucket);

      expect(res).toBeTypeOf('object');

      const expected = {
        name: bucket,
        bucketType: 'membase',
        compressionMode: 'passive',
        evictionPolicy: 'fullEviction',
        flushEnabled: false,
        maxExpiry: 0,
        minimumDurabilityLevel: undefined,
        numReplicas: 0,
        replicaIndexes: undefined,
        ramQuotaMB: 1024,
        storageBackend: 'magma',
        historyRetentionCollectionDefault: false,
        historyRetentionBytes: 0,
        historyRetentionDuration: 14000,
      };

      expect(res).toEqual(expected);
    },
    { timeout: 10_000 }
  );

  test.runIf(serverSupportsFeatures(ServerFeatures.BucketDedup))(
    'should throw a InvalidArgumentError when creating a couchstore bucket with history',
    async function ({ expect, serverTestContext, testBucket }) {
      expect.hasAssertions();
      const bmgr = serverTestContext.c.buckets();

      try {
        // @ts-expect-error Invalid arguments
        await bmgr.createBucket({
          name: testBucket,
          storageBackend: StorageBackend.Couchstore,
          historyRetentionCollectionDefault: true,
        });
      } catch (err) {
        expect(err).toBeInstanceOf(InvalidArgumentError);
        invariant(err instanceof InvalidArgumentError);
        expect(err.context).toBeInstanceOf(HttpErrorContext);
      }
    }
  );
});
