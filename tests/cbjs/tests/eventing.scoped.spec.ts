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
  EventingFunctionBucketAccess,
  EventingFunctionBucketBinding,
  EventingFunctionKeyspace,
  EventingFunctionUrlAuthBasic,
  EventingFunctionUrlBinding,
  Scope,
} from '@cbjsdev/cbjs';
import { ServerFeatures, waitForEventingFunction } from '@cbjsdev/http-client';
import { sleep, waitFor } from '@cbjsdev/shared';
import { createCouchbaseTest, getRandomId } from '@cbjsdev/vitest';

import { serverSupportsFeatures } from '../utils/serverFeature.js';

describe
  .runIf(
    serverSupportsFeatures(
      ServerFeatures.Collections,
      ServerFeatures.Eventing,
      ServerFeatures.ScopeEventingFunctionManagement
    )
  )
  .sequential('eventing scoped', { timeout: 30_000 }, async function () {
    const eventingFunctionName = getRandomId();

    const test = await createCouchbaseTest(
      async ({ useBucket, useScope, useCollection }) => {
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

        const constantBindings = [
          {
            alias: 'someconstant',
            literal: 'someliteral',
          },
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

        const code = `
          function OnUpdate(doc, meta) {
            log('data:', doc, meta)
          }
        `;

        await serverTestContext.scope.eventingFunctions().upsertFunction({
          name: testFnName,
          code,
          bucketBindings,
          urlBindings,
          constantBindings,
          metadataKeyspace,
          sourceKeyspace,
        });
      },
      { timeout: 15_000 }
    );

    test('should get all event functions', async function ({
      expect,
      serverTestContext,
      testFnName,
    }) {
      await waitFor(
        async () => {
          const eventingFunctions = await serverTestContext.scope
            .eventingFunctions()
            .getAllFunctions();
          const testFn = eventingFunctions.find((f) => f.name === testFnName);
          expect(testFn).toBeDefined();
        },
        { timeout: 30_000 }
      );
    });

    test('should get function statuses', async function ({
      expect,
      serverTestContext,
      testFnName,
    }) {
      await waitFor(async () => {
        const statuses = await serverTestContext.scope
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
        waitForEventingFunction(apiConfig, testFnName, 'undeployed', {
          timeout: 30_000,
        })
      ).resolves.toBeUndefined();
    });

    test('should deploy the function', async function ({
      expect,
      apiConfig,
      serverTestContext,
      testFnName,
    }) {
      await serverTestContext.scope.eventingFunctions().deployFunction(testFnName);
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
      await serverTestContext.scope.eventingFunctions().pauseFunction(testFnName);
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
      await serverTestContext.scope.eventingFunctions().resumeFunction(testFnName);
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
      await serverTestContext.scope.eventingFunctions().undeployFunction(testFnName);
      await expect(
        waitForEventingFunction(apiConfig, testFnName, 'undeployed', {
          timeout: 30_000,
        })
      ).resolves.toBeUndefined();
    });

    test('should drop the function', async function ({
      apiConfig,
      serverTestContext,
      testFnName,
    }) {
      await serverTestContext.scope.eventingFunctions().dropFunction(testFnName);

      await waitForEventingFunction(apiConfig, testFnName, {
        timeout: 30_000,
        expectMissing: true,
      });
    });
  });
