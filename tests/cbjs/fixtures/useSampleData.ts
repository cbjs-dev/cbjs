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
import { CouchbaseFixtures } from '@cbjsdev/vitest';

import { DataSample, SampleCollection } from '../utils/dataSample.js';

export async function useSampleData(
  { serverTestContext }: CouchbaseFixtures,
  use: (
    v: (
      target: SampleCollection,
      docs?: ReadonlyArray<Record<string, unknown>>
    ) => Promise<{ sampleSize: number; testUid: string; sampleDocKeys: string[] }>
  ) => Promise<void>
) {
  const sampleData = new DataSample(serverTestContext);

  await use(async (target: SampleCollection) => {
    await sampleData.upsertSample(target);
    return {
      sampleSize: sampleData.getSampleSize(),
      testUid: sampleData.getTestUid(),
      sampleDocKeys: sampleData.getSampleDocKeys(),
    };
  });

  await sampleData.removeSample();
}
