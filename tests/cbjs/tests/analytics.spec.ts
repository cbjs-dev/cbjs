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
} from '@cbjsdev/cbjs';
import { waitFor } from '@cbjsdev/shared';
import { createCouchbaseTest } from '@cbjsdev/vitest';

import { useSampleData } from '../fixtures/useSampleData.js';
import { ServerFeatures, serverSupportsFeatures } from '../utils/serverFeature.js';

describe
  .runIf(serverSupportsFeatures(ServerFeatures.Analytics))
  .shuffle('analytics', { timeout: 10_000 }, async () => {
    const test = await createCouchbaseTest({
      useSampleData,
    });

    test('analytics fixture cleanup', async ({ useDataverse }) => {
      await useDataverse();
    });

    test('should successfully create & drop a dataverse', async function ({
      useDataverse,
    }) {
      await useDataverse();
    });

    test('should successfully upsert a non-existing dataverse', async function ({
      expect,
      serverTestContext,
      useDataverse,
    }) {
      const dv = await useDataverse();
      await expect(
        serverTestContext.c.analyticsIndexes().createDataverse(dv, {
          ignoreIfExists: true,
        })
      ).resolves.toBeUndefined();
    });

    test('should successfully upsert an existing dataverse', async function ({
      expect,
      serverTestContext,
      useDataverse,
    }) {
      const dv = await useDataverse();
      await expect(
        serverTestContext.c.analyticsIndexes().createDataverse(dv, {
          ignoreIfExists: true,
        })
      ).resolves.toBeUndefined();
    });

    test('should fail to overwrite an existing dataverse', async function ({
      expect,
      serverTestContext,
      useDataverse,
    }) {
      const dv = await useDataverse();

      await expect(
        serverTestContext.c.analyticsIndexes().createDataverse(dv)
      ).rejects.toThrowError(DataverseExistsError);
    });

    test('should successfully create & drop a dataset', async function ({
      useDataverse,
      useDataset,
    }) {
      const dv = await useDataverse();
      await useDataset({ dataverseName: dv });
    });

    test('should successfully upsert a dataset', async function ({
      serverTestContext,
      useDataverse,
      useDataset,
    }) {
      const dv = await useDataverse();
      const ds = await useDataset({ dataverseName: dv });

      await serverTestContext.c
        .analyticsIndexes()
        .createDataset(serverTestContext.b.name, ds, {
          dataverseName: dv,
          ignoreIfExists: true,
        });
    });

    test('should fail to overwrite an existing dataset', async function ({
      expect,
      serverTestContext,
      useDataverse,
      useDataset,
    }) {
      const dv = await useDataverse();
      const ds = await useDataset({ dataverseName: dv });

      await expect(
        serverTestContext.c
          .analyticsIndexes()
          .createDataset(serverTestContext.b.name, ds, {
            dataverseName: dv,
          })
      ).rejects.toThrowError(DatasetExistsError);
    });

    test('should successfully create & drop an index', async function ({
      useDataverse,
      useDataset,
      useAnalyticsIndex,
    }) {
      const dv = await useDataverse();
      const ds = await useDataset({ dataverseName: dv });
      await useAnalyticsIndex({
        dataverseName: dv,
        datasetName: ds,
        fields: {
          name: 'string',
        },
      });
    });

    test('should successfully upsert an index', async function ({
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
    });

    test('should fail to overwrite an existing index', async function ({
      expect,
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
        useAnalyticsIndex({
          indexName: index,
          dataverseName: dv,
          datasetName: ds,
          fields: {
            name: 'string',
          },
        })
      ).rejects.toThrowError(IndexExistsError);
    });

    test('should successfully create & drop a link', async function ({
      useDataverse,
      useAnalyticsLink,
    }) {
      const dataverseName = await useDataverse();

      await useAnalyticsLink({
        type: 's3',
        name: 'testLink',
        scope: dataverseName,
        accessKeyId: 'testAccessKeyId',
        region: 'eu-west-3',
        secretAccessKey: 'testSecretAccessKey',
      });
    });

    test('should successfully replace a link', async function ({
      expect,
      useDataverse,
      useAnalyticsLink,
      serverTestContext,
    }) {
      const dataverseName = await useDataverse();

      await useAnalyticsLink({
        type: 's3',
        name: 'testLink',
        scope: dataverseName,
        accessKeyId: 'testAccessKeyId',
        region: 'eu-west-3',
        secretAccessKey: 'testSecretAccessKey',
      });

      await expect(
        serverTestContext.cluster.analyticsIndexes().replaceLink({
          name: 'testLink',
          scope: dataverseName,
          accessKeyId: 'testAccessKeyId',
          region: 'eu-west-1',
          secretAccessKey: 'testSecretAccessKey',
        })
      ).resolves.toBeUndefined();
    });

    test('should successfully connect & disconnect a link', async function ({
      useDataverse,
      useAnalyticsLinkConnection,
      serverTestContext,
    }) {
      // The link name must start with a letter, therefore the dv must also start with a letter
      const dv = await useDataverse({
        dataverseName: `test${serverTestContext.newUid()}`,
      });
      await useAnalyticsLinkConnection({ dataverseName: dv });
    });

    test('should successfully list all links', async function ({
      expect,
      useDataverse,
      useAnalyticsLink,
      serverTestContext,
    }) {
      const dv = await useDataverse();
      await useAnalyticsLink({
        type: 's3',
        name: 'testLink',
        scope: dv,
        accessKeyId: 'testAccessKeyId',
        region: 'eu-west-3',
        secretAccessKey: 'testSecretAccessKey',
      });

      await waitFor(
        async () => {
          const res = await serverTestContext.cluster.analyticsIndexes().getAllLinks();

          expect(res).toHaveLength(1);
        },
        { timeout: 10_000 }
      );
    });

    test('should successfully list all datasets', async function ({
      serverTestContext,
      expect,
      useDataverse,
      useDataset,
    }) {
      const dv = await useDataverse();
      await useDataset({ dataverseName: dv });
      await useDataset({ dataverseName: dv });

      await waitFor(
        async () => {
          const res = await serverTestContext.cluster.analyticsIndexes().getAllDatasets();
          expect(res).toHaveLength(2);
        },
        { timeout: 10_000 }
      );
    });

    test(
      'should successfully list all indexes',
      { timeout: 20_000 },
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
      }
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
      { timeout: 20_000 },
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
      }
    );

    test('should work with positional parameters correctly', async function ({
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
    });

    test('should work with named parameters correctly', async function ({
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
    });

    test('should filter undefined named parameters', async function ({
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
    });

    test(
      'should work with lots of options specified',
      { timeout: 20_000 },
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
      }
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
