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
import { describe, vi } from 'vitest';

import {
  InvalidArgumentError,
  MutationState,
  PrefixScan,
  RangeScan,
  SamplingScan,
  ScanResult,
  ScanTerm,
} from '@cbjs/cbjs';
import { couchbaseFixture, createCouchbaseTest } from '@cbjs/vitest';

import { ServerFeatures, serverSupportsFeatures } from '../utils/serverFeature';

describe.runIf(serverSupportsFeatures(ServerFeatures.RangeScan))('scan', async () => {
  const test = await createCouchbaseTest(async () => {
    return {
      data: couchbaseFixture(async ({ serverTestContext, useCollection }, use) => {
        const collectionName = await useCollection();
        const collection = serverTestContext.bucket.collection(collectionName);

        const mutations = await Promise.all(
          Array(100)
            .fill(null)
            .map(async (_, i) => {
              const testDocKey = `doc::${i + 1}`;

              const res = await collection.upsert(testDocKey, { id: testDocKey });
              return { id: testDocKey, token: res.token };
            })
        );

        const useValue = {
          collection,
          docIds: mutations.map((m) => m.id),
          mutationState: new MutationState(...mutations.map((m) => m.token)),
        };
        await use(useValue);
        await Promise.all(mutations.map((t) => collection.remove(t.id)));
        return useValue;
      }),
    };
  });

  describe('range scan', () => {
    test('should retrieve all documents if no range is given', async ({
      expect,
      data,
    }) => {
      const scanType = new RangeScan();

      const results = await data.collection.scan(scanType, {
        consistentWith: data.mutationState,
      });

      expect(results).toBeInstanceOf(Array);
      expect(results).toHaveLength(data.mutationState.length);

      results.forEach((result) => {
        expect(result.id).toBeTypeOf('string');
        expect(result.cas).toBeNonZeroCAS();
        expect(result.content).toEqual({ id: `doc::${result.id}` });
      });
    });

    test('should retrieve documents within the range', async ({ expect, data }) => {
      const scanType = new RangeScan(new ScanTerm(`doc::1`), new ScanTerm(`doc::2`));

      const results = await data.collection.scan(scanType, {
        consistentWith: data.mutationState,
      });

      expect(results).toBeInstanceOf(Array);
      expect(results).toHaveLength(12);

      results.forEach((result) => {
        expect(result.id).toBeTypeOf('string');
        expect(result.cas).toBeNonZeroCAS();
        expect(result.content).toEqual({ id: `doc::${result.id}` });
      });
    });

    test('should exclude documents on the excluded boundaries', async ({
      expect,
      data,
    }) => {
      const scanType = new RangeScan(
        new ScanTerm(`doc::1`, true),
        new ScanTerm(`doc::2`, true)
      );

      const results = await data.collection.scan(scanType, {
        consistentWith: data.mutationState,
      });

      expect(results).toBeInstanceOf(Array);
      expect(results).toHaveLength(10);

      results.forEach((result) => {
        expect(result).toHaveProperty('id', expect.any(String));
        expect(result.cas).toBeNonZeroCAS();
        expect(result.content).toEqual({ id: `doc::${result.id}` });
      });
    });
  });

  describe('prefix scan', () => {
    test('should retrieve documents with the given prefix', async ({ expect, data }) => {
      const scanType = new PrefixScan('doc::1');

      const results = await data.collection.scan(scanType);

      expect(results).toBeInstanceOf(Array);
      expect(results).toHaveLength(12);

      results.forEach((result) => {
        expect(result.id).toBeTypeOf('string');
        expect(result.cas).toBeNonZeroCAS();
        expect(result.content).toEqual({ id: `doc::${result.id}` });
      });
    });

    test('should retrieve all documents when prefix is an empty string ', async ({
      expect,
      data,
    }) => {
      const scanType = new PrefixScan('');

      const results = await data.collection.scan(scanType);

      expect(results).toBeInstanceOf(Array);
      expect(results).toHaveLength(100);

      results.forEach((result) => {
        expect(result.id).toBeTypeOf('string');
        expect(result.cas).toBeNonZeroCAS();
        expect(result.content).toEqual({ id: `doc::${result.id}` });
      });
    });

    test('should be able to stream the results ', async ({ expect, data }) => {
      const onResult = vi.fn((result: ScanResult) => {
        expect(result.id).toBeTypeOf('string');
        expect(result.cas).toBeNonZeroCAS();
        expect(result.content).toEqual({ id: `doc::${result.id}` });
      });

      const scanType = new PrefixScan('doc::');
      const resultsStream = data.collection.scan(scanType);

      void resultsStream.on('result', onResult);

      const results = await resultsStream;

      expect(onResult).toHaveBeenCalledTimes(100);

      expect(results).toBeInstanceOf(Array);
      expect(results).toHaveLength(100);

      results.forEach((result) => {
        expect(result.id).toBeTypeOf('string');
        expect(result.cas).toBeNonZeroCAS();
        expect(result.content).toEqual({ id: `doc::${result.id}` });
      });
    });

    test('should be able to cancel the results stream ', async ({ expect, data }) => {
      const scanType = new PrefixScan('doc::');
      const resultsStream = data.collection.scan(scanType);

      let docCount = 0;

      const onResult = vi.fn(() => {
        if (docCount >= 5) {
          resultsStream.cancelStreaming();
          return;
        }

        docCount++;
      });

      void resultsStream.on('result', onResult);

      const results = await resultsStream;

      expect(onResult).toHaveBeenCalledTimes(5);

      expect(results).toBeInstanceOf(Array);
      expect(results).toHaveLength(5);
    });
  });

  describe('sample scan', () => {
    test('should retrieve the requested number of documents', async ({
      expect,
      data,
    }) => {
      const scanType = new SamplingScan(10);
      const results = await data.collection.scan(scanType);

      expect(results).toHaveLength(10);

      results.forEach((result) => {
        expect(data.docIds).toContain(result.id);
      });
    });

    test('should throw an error when the sample size is <= 0', async ({
      expect,
      data,
    }) => {
      await expect(data.collection.scan(new SamplingScan(0))).rejects.toThrowError(
        InvalidArgumentError
      );
      await expect(data.collection.scan(new SamplingScan(-1))).rejects.toThrowError(
        InvalidArgumentError
      );
    });

    test('should retrieve all the documents if the requested number is more than existing', async ({
      expect,
      data,
    }) => {
      const scanType = new SamplingScan(10000);
      const results = await data.collection.scan(scanType);

      expect(results).toHaveLength(100);

      results.forEach((result) => {
        expect(data.docIds).toContain(result.id);
      });
    });

    test('should retrieve the requested number of documents with seeds', async ({
      expect,
      data,
    }) => {
      const scanType = new SamplingScan(10, 50);
      const results = await data.collection.scan(scanType);

      expect(results).toHaveLength(10);

      results.forEach((result) => {
        expect(data.docIds).toContain(result.id);
      });

      // TODO complete this test once the "seed" behaviour is public.
    });
  });

  test('should only retrieve the document id when idsOnly is true', async ({
    expect,
    data,
  }) => {
    const cases = [new PrefixScan('doc::'), new SamplingScan(100), new RangeScan()];

    for (const scanType of cases) {
      const results = await data.collection.scan(scanType, { idsOnly: true });
      expect(results).toBeInstanceOf(Array);
      expect(results).toHaveLength(100);

      results.forEach((result) => {
        expect(result.id).toBeTypeOf('string');
        expect(result.cas).toBeUndefined();
        expect(result.content).toBeUndefined();
      });
    }
  });

  test('should execute honor the batchByteLimit', async ({ expect, data }) => {
    const cases = [
      {
        scanType: new RangeScan(),
        limit: 0,
        expectedDocumentCount: 100,
      },
      {
        scanType: new RangeScan(),
        limit: 1,
        expectedDocumentCount: 100,
      },
      {
        scanType: new RangeScan(),
        limit: 25,
        expectedDocumentCount: 100,
      },
      {
        scanType: new RangeScan(),
        limit: 100,
        expectedDocumentCount: 100,
      },
      {
        scanType: new PrefixScan('doc::'),
        limit: 0,
        expectedDocumentCount: 100,
      },
      {
        scanType: new PrefixScan('doc::'),
        limit: 1,
        expectedDocumentCount: 100,
      },
      {
        scanType: new PrefixScan('doc::'),
        limit: 25,
        expectedDocumentCount: 100,
      },
      {
        scanType: new PrefixScan('doc::'),
        limit: 100,
        expectedDocumentCount: 100,
      },
      {
        scanType: new SamplingScan(10, 50),
        limit: 0,
        expectedDocumentCount: 10,
      },
      {
        scanType: new SamplingScan(10, 50),
        limit: 1,
        expectedDocumentCount: 10,
      },
      {
        scanType: new SamplingScan(10, 50),
        limit: 25,
        expectedDocumentCount: 10,
      },
      {
        scanType: new SamplingScan(10, 50),
        limit: 100,
        expectedDocumentCount: 10,
      },
    ];

    for (const scanCase of cases) {
      const { scanType, limit, expectedDocumentCount } = scanCase;

      const results = await data.collection.scan(scanType, { batchByteLimit: limit });

      expect(results).toBeInstanceOf(Array);
      expect(results).toHaveLength(expectedDocumentCount);

      results.forEach((result) => {
        expect(result.id).toBeTypeOf('string');
        expect(result.cas).toBeNonZeroCAS();
        expect(result.content).toBeDefined();
      });
    }
  });

  test('should execute honor the batchItemLimit', async ({ expect, data }) => {
    const cases = [
      {
        scanType: new RangeScan(),
        limit: 0,
        expectedDocumentCount: 100,
      },
      {
        scanType: new RangeScan(),
        limit: 10,
        expectedDocumentCount: 100,
      },
      {
        scanType: new RangeScan(),
        limit: 25,
        expectedDocumentCount: 100,
      },
      {
        scanType: new RangeScan(),
        limit: 100,
        expectedDocumentCount: 100,
      },
      {
        scanType: new PrefixScan('doc::'),
        limit: 0,
        expectedDocumentCount: 100,
      },
      {
        scanType: new PrefixScan('doc::'),
        limit: 10,
        expectedDocumentCount: 100,
      },
      {
        scanType: new PrefixScan('doc::'),
        limit: 25,
        expectedDocumentCount: 100,
      },
      {
        scanType: new PrefixScan('doc::'),
        limit: 100,
        expectedDocumentCount: 100,
      },
      {
        scanType: new SamplingScan(10, 50),
        limit: 0,
        expectedDocumentCount: 10,
      },
      {
        scanType: new SamplingScan(10, 50),
        limit: 10,
        expectedDocumentCount: 10,
      },
      {
        scanType: new SamplingScan(10, 50),
        limit: 25,
        expectedDocumentCount: 10,
      },
      {
        scanType: new SamplingScan(10, 50),
        limit: 100,
        expectedDocumentCount: 10,
      },
    ];

    for (const scanCase of cases) {
      const { scanType, limit, expectedDocumentCount } = scanCase;

      const results = await data.collection.scan(scanType, { batchItemLimit: limit });

      expect(results).toBeInstanceOf(Array);
      expect(results).toHaveLength(expectedDocumentCount);

      results.forEach((result) => {
        expect(result.id).toBeTypeOf('string');
        expect(result.cas).toBeNonZeroCAS();
        expect(result.content).toBeDefined();
      });
    }
  });

  test('should scan with set concurrency', async ({ expect, data }) => {
    const cases = [1, 2, 4, 16, 64, 128];

    for (const concurrency of cases) {
      const scanType = new RangeScan(new ScanTerm(`doc::1`), new ScanTerm(`doc::2`));
      const results = await data.collection.scan(scanType, {
        concurrency: concurrency,
        consistentWith: data.mutationState,
      });

      expect(results).toBeInstanceOf(Array);
      expect(results).toHaveLength(12);

      results.forEach((result) => {
        expect(result.id).toBeTypeOf('string');
        expect(result.cas).toBeNonZeroCAS();
        expect(result.content).toBeDefined();
      });
    }
  });

  test('should throw an error when an invalid concurrency is given', async ({
    expect,
    data,
  }) => {
    const scanType = new RangeScan(new ScanTerm(`doc::1`), new ScanTerm(`doc::2`));

    await expect(
      data.collection.scan(scanType, {
        concurrency: 0,
        consistentWith: data.mutationState,
      })
    ).rejects.toThrowError(InvalidArgumentError);

    await expect(
      data.collection.scan(scanType, {
        concurrency: -1,
        consistentWith: data.mutationState,
      })
    ).rejects.toThrowError(InvalidArgumentError);
  });
});
