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

import { createAnalyticsLink } from '@cbjs/http-client';
import { createCouchbaseTest } from '@cbjs/vitest';

describe('createAnalyticsLink', async () => {
  const test = await createCouchbaseTest();

  test('create a S3 link', async ({ expect, apiConfig, useDataverse }) => {
    const dataverseName = await useDataverse();

    await expect(
      createAnalyticsLink(apiConfig, {
        type: 's3',
        name: 'testLink',
        scope: dataverseName,
        accessKeyId: 'testAccessKeyId',
        region: 'eu-west-3',
        secretAccessKey: 'testSecretAccessKey',
      })
    ).resolves.toBeUndefined();
  });
});
