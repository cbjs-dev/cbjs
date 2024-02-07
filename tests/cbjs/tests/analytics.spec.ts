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
  AnalyticsStatus,
  DatasetExistsError,
  DatasetNotFoundError,
  DataverseExistsError,
  DataverseNotFoundError,
  IndexExistsError,
  IndexNotFoundError,
} from '@cbjs/cbjs';
import { createCouchbaseTest } from '@cbjs/vitest';

import { useSampleData } from '../fixtures/useSampleData';
import { ServerFeatures, serverSupportsFeatures } from '../utils/serverFeature';
import { waitFor } from '../utils/waitFor';

describe
  .runIf(serverSupportsFeatures(ServerFeatures.Analytics))
  .shuffle('analytics', async () => {
    const test = await createCouchbaseTest({
      useSampleData,
    });

    test('analytics fixture cleanup', async ({ useDataverse }) => {
      await useDataverse();
    });

    test(
      'should successfully create & drop a dataverse',
      async function ({ useDataverse }) {
        await useDataverse();
      },
      { timeout: 10_000 }
    );

    test(
      'should successfully upsert a non-existing dataverse',
      async function ({ expect, serverTestContext, useDataverse }) {
        const dv = await useDataverse();
        await expect(
          serverTestContext.c.analyticsIndexes().createDataverse(dv, {
            ignoreIfExists: true,
          })
        ).resolves.toBeUndefined();
      },
      { timeout: 10_000 }
    );

    test(
      'should successfully upsert an existing dataverse',
      async function ({ expect, serverTestContext, useDataverse }) {
        const dv = await useDataverse();
        await expect(
          serverTestContext.c.analyticsIndexes().createDataverse(dv, {
            ignoreIfExists: true,
          })
        ).resolves.toBeUndefined();
      },
      { timeout: 10_000 }
    );

    test(
      'should fail to overwrite an existing dataverse',
      async function ({ expect, serverTestContext, useDataverse }) {
        const dv = await useDataverse();

        await expect(
          serverTestContext.c.analyticsIndexes().createDataverse(dv)
        ).rejects.toThrowError(DataverseExistsError);
      },
      { timeout: 10_000 }
    );

    test(
      'should successfully create & drop a dataset',
      async function ({ useDataverse, useDataset }) {
        const dv = await useDataverse();
        await useDataset({ dataverseName: dv });
      },
      { timeout: 10_000 }
    );

    test(
      'should successfully upsert a dataset',
      async function ({ serverTestContext, useDataverse, useDataset }) {
        const dv = await useDataverse();
        const ds = await useDataset({ dataverseName: dv });

        await serverTestContext.c
          .analyticsIndexes()
          .createDataset(serverTestContext.b.name, ds, {
            dataverseName: dv,
            ignoreIfExists: true,
          });
      },
      { timeout: 10_000 }
    );

    test(
      'should fail to overwrite an existing dataset',
      async function ({ expect, serverTestContext, useDataverse, useDataset }) {
        const dv = await useDataverse();
        const ds = await useDataset({ dataverseName: dv });

        await expect(
          serverTestContext.c
            .analyticsIndexes()
            .createDataset(serverTestContext.b.name, ds, {
              dataverseName: dv,
            })
        ).rejects.toThrowError(DatasetExistsError);
      },
      { timeout: 10_000 }
    );

    test(
      'should successfully create & drop an index',
      async function ({ useDataverse, useDataset, useAnalyticsIndex }) {
        const dv = await useDataverse();
        const ds = await useDataset({ dataverseName: dv });
        await useAnalyticsIndex({
          dataverseName: dv,
          datasetName: ds,
          fields: {
            name: 'string',
          },
        });
      },
      { timeout: 10_000 }
    );

    test(
      'should successfully upsert an index',
      async function ({
        expect,
        serverTestContext,
        useDataverse,
        useDataset,
        useAnalyticsIndex,
      }) {
        const dv = await useDataverse();
        const ds = await useDataset({ dataverseName: dv });
        const index = await useAnalyticsIndex({
          dataverseName: dv,
          datasetName: ds,
          fields: {
            name: 'string',
          },
        });

        await expect(
          serverTestContext.c.analyticsIndexes().createIndex(
            ds,
            index,
            { name: 'string' },
            {
              dataverseName: dv,
              ignoreIfExists: true,
            }
          )
        ).resolves.toBeUndefined();
      },
      { timeout: 10_000 }
    );

    test(
      'should fail to overwrite an existing index',
      async function ({ expect, useDataverse, useDataset, useAnalyticsIndex }) {
        const dv = await useDataverse();
        const ds = await useDataset({ dataverseName: dv });
        const index = await useAnalyticsIndex({
          dataverseName: dv,
          datasetName: ds,
          fields: {
            name: 'string',
          },
        });

        await expect(
          useAnalyticsIndex({
            indexName: index,
            dataverseName: dv,
            datasetName: ds,
            fields: {
              name: 'string',
            },
          })
        ).rejects.toThrowError(IndexExistsError);
      },
      { timeout: 10_000 }
    );

    test(
      'should successfully connect & disconnect a link',
      async function ({ useDataverse, useAnalyticsLink, serverTestContext }) {
        // The link name must start with a letter, therefore the dv must also start with a letter
        const dv = await useDataverse({
          dataverseName: `test${serverTestContext.newUid()}`,
        });
        await useAnalyticsLink({ dataverseName: dv });
      },
      { timeout: 10_000 }
    );

    test(
      'should successfully list all datasets',
      async function ({ serverTestContext, expect, useDataverse, useDataset }) {
        const dv = await useDataverse();
        await useDataset({ dataverseName: dv });
        await useDataset({ dataverseName: dv });

        await waitFor(
          async () => {
            const res = await serverTestContext.cluster
              .analyticsIndexes()
              .getAllDatasets();
            expect(res).toHaveLength(2);
          },
          { timeout: 10_000 }
        );
      },
      { timeout: 10_000 }
    );

    test(
      'should successfully list all indexes',
      async function ({
        serverTestContext,
        expect,
        useDataverse,
        useDataset,
        useAnalyticsIndex,
      }) {
        const dv = await useDataverse();
        const ds0 = await useDataset({ dataverseName: dv });
        const ds1 = await useDataset({ dataverseName: dv });

        await useAnalyticsIndex({
          dataverseName: dv,
          datasetName: ds0,
          fields: { name: 'string' },
        });

        await useAnalyticsIndex({
          dataverseName: dv,
          datasetName: ds1,
          fields: { name: 'string' },
        });

        await waitFor(async () => {
          const res = await serverTestContext.c.analyticsIndexes().getAllIndexes();
          expect(res).toHaveLength(4); // 2 primary created by default with each dataset + 2 secondary created in this test
        });
      },
      { timeout: 20_000 }
    );

    test.runIf(serverSupportsFeatures(ServerFeatures.AnalyticsPendingMutations))(
      'should successfully get pending mutations',
      async function ({ serverTestContext, expect }) {
        const numPending = await serverTestContext.c
          .analyticsIndexes()
          .getPendingMutations();
        expect(numPending).toBeTypeOf('object');
      }
    );

    test(
      'should see test data correctly',
      async function ({
        expect,
        serverTestContext,
        useDataverse,
        useDataset,
        useSampleData,
      }) {
        const dv = await useDataverse();
        const ds = await useDataset({ dataverseName: dv });
        const sampleData = await useSampleData(serverTestContext.dco);

        await waitFor(
          async () => {
            const targetName = '`' + dv + '`.`' + ds + '`';
            const qs = `SELECT * FROM ${targetName} WHERE testUid='${sampleData.testUid}'`;
            const res = await serverTestContext.c.analyticsQuery(qs);

            expect(res.rows).toBeInstanceOf(Array);
            expect(res.rows).toHaveLength(sampleData.sampleSize);
            expect(res.meta).toBeTypeOf('object');
          },
          { timeout: 20_000 }
        );
      },
      { timeout: 20_000 }
    );

    test(
      'should work with positional parameters correctly',
      async function ({
        expect,
        serverTestContext,
        useDataverse,
        useDataset,
        useSampleData,
      }) {
        const dv = await useDataverse();
        const ds = await useDataset({ dataverseName: dv });
        const sampleData = await useSampleData(serverTestContext.dco);

        await waitFor(async () => {
          const targetName = '`' + dv + '`.`' + ds + '`';
          const qs = `SELECT * FROM ${targetName} WHERE testUid=$2`;
          const res = await serverTestContext.c.analyticsQuery(qs, {
            parameters: [undefined, sampleData.testUid],
          });

          expect(res.rows).toBeInstanceOf(Array);
          expect(res.rows).toHaveLength(sampleData.sampleSize);
          expect(res.meta).toBeTypeOf('object');
        });
      },
      { timeout: 10_000 }
    );

    test(
      'should work with named parameters correctly',
      async function ({
        expect,
        serverTestContext,
        useDataverse,
        useDataset,
        useSampleData,
      }) {
        const sampleData = await useSampleData(serverTestContext.dco);
        const dv = await useDataverse();
        const ds = await useDataset({ dataverseName: dv });

        const targetName = '`' + dv + '`.`' + ds + '`';
        const qs = `SELECT * FROM ${targetName} WHERE testUid=$tuid`;

        await waitFor(
          async () => {
            const res = await serverTestContext.c.analyticsQuery(qs, {
              parameters: {
                tuid: sampleData.testUid,
              },
            });

            expect(res.rows).toBeInstanceOf(Array);
            expect(res.rows).toHaveLength(sampleData.sampleSize);
            expect(res.meta).toBeTypeOf('object');
          },
          { timeout: 9_000, retryInterval: 1_000 }
        );
      },
      { timeout: 10_000 }
    );

    test(
      'should filter undefined named parameters',
      async function ({
        expect,
        serverTestContext,
        useDataverse,
        useDataset,
        useSampleData,
      }) {
        const dv = await useDataverse();
        const ds = await useDataset({ dataverseName: dv });
        const sampleData = await useSampleData(serverTestContext.dco);

        await waitFor(
          async () => {
            const targetName = '`' + dv + '`.`' + ds + '`';
            const qs = `SELECT * FROM ${targetName} WHERE testUid=$tuid`;
            const res = await serverTestContext.c.analyticsQuery(qs, {
              parameters: {
                tuid: sampleData.testUid,
                filterMe: undefined,
              },
            });

            expect(res.rows).toBeInstanceOf(Array);
            expect(res.rows).toHaveLength(sampleData.sampleSize);
            expect(res.meta).toBeTypeOf('object');
          },
          { timeout: 9_000, retryInterval: 1_000 }
        );
      },
      { timeout: 10_000 }
    );

    test(
      'should work with lots of options specified',
      async function ({
        expect,
        serverTestContext,
        useDataverse,
        useDataset,
        useSampleData,
      }) {
        const dv = await useDataverse();
        const ds = await useDataset({ dataverseName: dv });
        const sampleData = await useSampleData(serverTestContext.dco);

        await waitFor(async () => {
          const targetName = '`' + dv + '`.`' + ds + '`';
          const qs = `SELECT * FROM ${targetName} WHERE testUid='${sampleData.testUid}'`;
          const res = await serverTestContext.c.analyticsQuery(qs, {
            clientContextId: 'hello-world',
            readOnly: true,
          });

          expect(res.rows).toBeInstanceOf(Array);
          expect(res.rows).toHaveLength(sampleData.sampleSize);
          expect(res.meta).toBeTypeOf('object');

          expect(res.meta.requestId).toBeTypeOf('string');
          expect(res.meta.clientContextId).toEqual('hello-world');
          expect(res.meta.status).toEqual(AnalyticsStatus.Success);
          expect(res.meta.signature).toBeTypeOf('object');
          expect(res.meta.metrics).toBeTypeOf('object');
        });
      },
      { timeout: 20_000 }
    );

    test('should successfully ignore a missing index when dropping', async function ({
      serverTestContext,
      useDataverse,
      useDataset,
    }) {
      const dv = await useDataverse();
      const ds = await useDataset({ dataverseName: dv });

      await serverTestContext.c.analyticsIndexes().dropIndex(ds, 'missingIndex', {
        dataverseName: dv,
        ignoreIfNotExists: true,
      });
    });

    test('should fail to drop a missing index', async function ({
      expect,
      serverTestContext,
      useDataverse,
      useDataset,
    }) {
      const dv = await useDataverse();
      const ds = await useDataset({ dataverseName: dv });

      await expect(
        serverTestContext.c.analyticsIndexes().dropIndex(ds, 'missingIndex', {
          dataverseName: dv,
        })
      ).rejects.toThrowError(IndexNotFoundError);
    });

    test('should successfully ignore a missing dataset when dropping', async function ({
      expect,
      serverTestContext,
      useDataverse,
    }) {
      const dv = await useDataverse();
      await expect(
        serverTestContext.c.analyticsIndexes().dropDataset('missingDataset', {
          dataverseName: dv,
          ignoreIfNotExists: true,
        })
      ).resolves.toBeUndefined();
    });

    test('should fail to drop a missing dataset', async function ({
      expect,
      serverTestContext,
      useDataverse,
    }) {
      const dv = await useDataverse();

      await expect(
        serverTestContext.c.analyticsIndexes().dropDataset('missingDataset', {
          dataverseName: dv,
        })
      ).rejects.toThrowError(DatasetNotFoundError);
    });

    test('should successfully ignore a missing dataverse when dropping', async function ({
      expect,
      serverTestContext,
    }) {
      await expect(
        serverTestContext.c.analyticsIndexes().dropDataverse('missingDataverse', {
          ignoreIfNotExists: true,
        })
      ).resolves.toBeUndefined();
    });

    test('should fail to drop a missing dataverse', async function ({
      expect,
      serverTestContext,
    }) {
      await expect(
        serverTestContext.c.analyticsIndexes().dropDataverse('missingDataverse')
      ).rejects.toThrowError(DataverseNotFoundError);
    });
  });
