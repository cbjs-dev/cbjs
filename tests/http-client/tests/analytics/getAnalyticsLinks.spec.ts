/*
 * Copyright (c) 2023-Present Jonathan MASSUCHETTI.
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

import { createAnalyticsLink, getAnalyticsLinks } from '@cbjs/http-client';
import { createCouchbaseTest } from '@cbjs/vitest';

describe('getAnalyticsLinks', async () => {
  const test = await createCouchbaseTest();

  test('get all links', async ({ expect, apiConfig, useDataverse }) => {
    const dataverseName1 = await useDataverse();
    const dataverseName2 = await useDataverse();

    await createAnalyticsLink(apiConfig, {
      type: 's3',
      name: 'testLink',
      scope: dataverseName1,
      accessKeyId: 'testAccessKeyId',
      region: 'eu-west-3',
      secretAccessKey: 'testSecretAccessKey',
    });

    await createAnalyticsLink(apiConfig, {
      type: 's3',
      name: 'testLink',
      scope: dataverseName2,
      accessKeyId: 'testAccessKeyId',
      region: 'eu-west-3',
      secretAccessKey: 'testSecretAccessKey',
    });

    await expect(getAnalyticsLinks(apiConfig)).resolves.toEqual([
      expect.objectContaining({
        type: 's3',
        name: 'testLink',
        scope: dataverseName1,
        accessKeyId: 'testAccessKeyId',
        region: 'eu-west-3',
      }),
      expect.objectContaining({
        type: 's3',
        name: 'testLink',
        scope: dataverseName2,
        accessKeyId: 'testAccessKeyId',
        region: 'eu-west-3',
      }),
    ]);
  });

  test('get all links within a scope', async ({ expect, apiConfig, useDataverse }) => {
    const dataverseName1 = await useDataverse();
    const dataverseName2 = await useDataverse();

    await createAnalyticsLink(apiConfig, {
      type: 's3',
      name: 'testLink',
      scope: dataverseName1,
      accessKeyId: 'testAccessKeyId',
      region: 'eu-west-3',
      secretAccessKey: 'testSecretAccessKey',
    });

    await createAnalyticsLink(apiConfig, {
      type: 's3',
      name: 'testLink',
      scope: dataverseName2,
      accessKeyId: 'testAccessKeyId',
      region: 'eu-west-3',
      secretAccessKey: 'testSecretAccessKey',
    });

    await expect(
      getAnalyticsLinks(apiConfig, { scope: dataverseName1 })
    ).resolves.toEqual([
      expect.objectContaining({
        type: 's3',
        name: 'testLink',
        scope: dataverseName1,
        accessKeyId: 'testAccessKeyId',
        region: 'eu-west-3',
      }),
    ]);
  });
});
