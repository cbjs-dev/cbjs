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

import { getStatistics } from '@cbjsdev/http-client';
import { createCouchbaseTest } from '@cbjsdev/vitest';

describe('getStatistics', async () => {
  const test = await createCouchbaseTest();

  test('should return the statistics', async ({ apiConfig, expect }) => {
    const result = await getStatistics(apiConfig, [
      {
        metric: [{ label: 'name', value: 'audit_queue_length' }],
        start: -1,
        step: 10,
      },
    ]);

    expect(result).toBeInstanceOf(Array);
    expect(result).toHaveLength(1);
    expect(result[0].errors).toBeInstanceOf(Array);
    expect(result[0].startTimestamp).toBeTypeOf('number');
    expect(result[0].endTimestamp).toBeTypeOf('number');

    expect(result[0].data).toBeInstanceOf(Array);
    expect(result[0].data).toHaveLength(1);
    expect(result[0].data[0].metric).toEqual({
      nodes: expect.arrayContaining([expect.any(String)]),
      name: 'audit_queue_length',
      category: 'audit',
      instance: 'ns_server',
    });

    expect(result[0].data[0].values).toBeInstanceOf(Array);
    expect(result[0].data[0].values).toHaveLength(1);
  });
});
