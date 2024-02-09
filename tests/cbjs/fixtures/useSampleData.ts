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
import { raise } from '@cbjs/shared';
import { CouchbaseFixtures } from '@cbjs/vitest';

import { DataSample, SampleCollection } from '../utils/dataSample';

export async function useSampleData(
  { serverTestContext }: CouchbaseFixtures,
  use: (
    v: (
      target: SampleCollection,
      docs?: ReadonlyArray<Record<string, unknown>>
    ) => Promise<{ sampleSize: number; testUid: string }>
  ) => Promise<void>
) {
  const sampleData = new DataSample(serverTestContext);

  await use(async (target: SampleCollection) => {
    await sampleData.upsertSample(target);
    return {
      sampleSize:
        sampleData.getSampleSize() ??
        raise(
          'DataSample.getSampleSize() should never be undefined after the data has been upserted'
        ),
      testUid: sampleData.getTestUid(),
    };
  });

  await sampleData.removeSample();
}
