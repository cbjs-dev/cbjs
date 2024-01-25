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
import { getRandomId } from '@cbjs/vitest';
import { describe } from 'vitest';

import {
  EventingFunction,
  EventingFunctionBucketAccess,
  EventingFunctionBucketBinding,
  EventingFunctionKeyspace,
  EventingFunctionSettings,
  EventingFunctionUrlAuthBasic,
  EventingFunctionUrlBinding,
  Scope,
} from '@cbjs/cbjs';
import { waitForEventingFunction } from '@cbjs/http-client';
import { createCouchbaseTest } from '@cbjs/vitest';
import { ServerFeatures, serverSupportsFeatures } from '../utils/serverFeature';
import { sleep } from '@cbjs/shared';
import { waitFor } from '../utils/waitFor';

describe
  .runIf(serverSupportsFeatures(ServerFeatures.Collections, ServerFeatures.Eventing))
  .sequential(
    'eventing',
    async function () {
      const eventingFunctionName = getRandomId();

      const test = await createCouchbaseTest(
        async ({ useBucket, useCollection }) => {
          const metadataBucket = await useBucket().get();
          const metadataCollection = await useCollection({
            bucketName: metadataBucket,
          }).get();

          return {
            metadataBucket,
            metadataCollection,
            testFnName: eventingFunctionName,
          };
        }
      );

      test(
        'should upsert a function successfully',
        async function ({
          serverTestContext,
          metadataBucket,
          metadataCollection,
          testFnName,
        }) {
          const bucketBindings = [
            new EventingFunctionBucketBinding({
              name: new EventingFunctionKeyspace({
                bucket: serverTestContext.bucket.name,
                scope: serverTestContext.scope.name,
                collection: serverTestContext.collection.name,
              }),
              alias: 'bucketbinding1',
              access: EventingFunctionBucketAccess.ReadWrite,
            }),
          ];

          const urlBindings = [
            new EventingFunctionUrlBinding({
              hostname: 'http://127.0.0.1',
              alias: 'urlbinding1',
              auth: new EventingFunctionUrlAuthBasic({
                username: 'username',
                password: 'password',
              }),
              allowCookies: false,
              validateSslCertificate: false,
            }),
          ];

          // Give time to the eventing service to acknowledge the new buckets
          await sleep(2000);

          const metadataKeyspace = new EventingFunctionKeyspace({
            bucket: metadataBucket,
            scope: Scope.DEFAULT_NAME,
            collection: metadataCollection,
          });

          const sourceKeyspace = new EventingFunctionKeyspace({
            bucket: serverTestContext.bucket.name,
            scope: serverTestContext.scope.name,
            collection: serverTestContext.collection.name,
          });

          const eventFunction = new EventingFunction({
            version: '1',
            functionScope: {
              bucket: '*',
              scope: '*',
            },
            enforceSchema: false,
            handlerUuid: Math.ceil(Math.random() * 1000),
            functionInstanceId: getRandomId(),
            settings: EventingFunctionSettings._fromEvtData({}),
            name: testFnName,
            code: `
              function OnUpdate(doc, meta) {
                log('data:', doc, meta)
              }
            `,
            bucketBindings,
            urlBindings,
            constantBindings: [
              {
                alias: 'someconstant',
                literal: 'someliteral',
              },
            ],
            metadataKeyspace,
            sourceKeyspace,
          });

          await serverTestContext.cluster
            .eventingFunctions()
            .upsertFunction(eventFunction);
        },
        { timeout: 15_000 }
      );

      test('should get all event functions', async function ({
        expect,
        serverTestContext,
        testFnName,
      }) {
        await waitFor(async () => {
          const eventingFunctions = await serverTestContext.cluster
            .eventingFunctions()
            .getAllFunctions();
          const testFn = eventingFunctions.find((f) => f.name === testFnName);
          expect(testFn).toBeDefined();
        });
      });

      test('should get function statuses', async function ({
        expect,
        serverTestContext,
        testFnName,
      }) {
        await waitFor(async () => {
          const statuses = await serverTestContext.cluster
            .eventingFunctions()
            .functionsStatus();
          const testFnStatus = statuses.functions.find((f) => f.name === testFnName);
          expect(testFnStatus).toBeDefined();
        });
      });

      test('should eventually reach the `Undeployed` status', async function ({
        expect,
        apiConfig,
        testFnName,
      }) {
        await expect(
          waitForEventingFunction(apiConfig, testFnName, 'undeployed', { timeout: 30_000 })
        ).resolves.toBeUndefined();
      });

      test('should deploy the function', async function ({
        expect,
        apiConfig,
        serverTestContext,
        testFnName,
      }) {
        await serverTestContext.cluster.eventingFunctions().deployFunction(testFnName);
        await expect(
          waitForEventingFunction(apiConfig, testFnName, 'deployed', { timeout: 30_000 })
        ).resolves.toBeUndefined();
      });

      test('should pause the function', async function ({
        expect,
        apiConfig,
        serverTestContext,
        testFnName,
      }) {
        await serverTestContext.cluster.eventingFunctions().pauseFunction(testFnName);
        await expect(
          waitForEventingFunction(apiConfig, testFnName, 'paused', { timeout: 30_000 })
        ).resolves.toBeUndefined();
      });

      test('should resume the function', async function ({
        expect,
        apiConfig,
        serverTestContext,
        testFnName,
      }) {
        await serverTestContext.cluster.eventingFunctions().resumeFunction(testFnName);
        await expect(
          waitForEventingFunction(apiConfig, testFnName, 'deployed', { timeout: 30_000 })
        ).resolves.toBeUndefined();
      });

      test('should undeploy the function', async function ({
        expect,
        apiConfig,
        serverTestContext,
        testFnName,
      }) {
        await serverTestContext.cluster.eventingFunctions().undeployFunction(testFnName);
        await expect(
          waitForEventingFunction(apiConfig, testFnName, 'undeployed', { timeout: 30_000 })
        ).resolves.toBeUndefined();
      });

      test('should drop the function', async function ({
        apiConfig,
        serverTestContext,
        testFnName,
      }) {
        await serverTestContext.cluster.eventingFunctions().dropFunction(testFnName);

        await waitForEventingFunction(apiConfig, testFnName, {
          timeout: 30_000,
          expectMissing: true,
        });
      });
    },
    { timeout: 30_000 }
  );
