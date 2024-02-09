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
import { UpsertOptions } from '@cbjs/cbjs';
import { ServerTestContext } from '@cbjs/vitest';

export type SampleCollection = {
  upsert: (key: string, body: unknown, opts: UpsertOptions) => Promise<unknown>;
  remove: (key: string) => Promise<unknown>;
};

const DEFAULT_SAMPLE_DOCS = [
  { x: 0, y: 0, name: 'x0,y0' },
  { x: 1, y: 0, name: 'x1,y0' },
  { x: 2, y: 0, name: 'x2,y0' },
  { x: 0, y: 1, name: 'x0,y1' },
  { x: 1, y: 1, name: 'x1,y1' },
  { x: 2, y: 1, name: 'x2,y1' },
  { x: 0, y: 2, name: 'x0,y2' },
  { x: 1, y: 2, name: 'x1,y2' },
  { x: 2, y: 2, name: 'x2,y2' },
] as const;

export class DataSample {
  private readonly sampleDocs: ReadonlyArray<Record<string, unknown>>;

  /**
   * Unique identifier used to prefix documents of a test.
   * This ensure that there is no concurrency collision.
   */
  private readonly testUid: string;

  private sampleDocKeys?: string[];
  private targetCollection?: SampleCollection;

  constructor(
    serverTestContext: ServerTestContext,
    sampleDocs?: ReadonlyArray<Record<string, unknown>>
  ) {
    this.testUid = serverTestContext.newUid();
    this.sampleDocs = sampleDocs ?? DEFAULT_SAMPLE_DOCS;
  }

  async upsertSample(target: SampleCollection) {
    this.targetCollection = target;
    const upserts = this.sampleDocs.map(async (doc, i) => {
      const testDocKey = `${this.testUid}::${i}`;

      await target.upsert(
        testDocKey,
        {
          ...doc,
          testUid: this.testUid,
        },
        { timeout: 2_000 }
      );
      return testDocKey;
    });

    this.sampleDocKeys = await Promise.all(upserts);
  }

  async removeSample() {
    if (this.sampleDocKeys === undefined || this.targetCollection === undefined) return;

    const removals = this.sampleDocKeys.map((docId) =>
      this.targetCollection?.remove(docId)
    );
    await Promise.allSettled(removals);
  }

  getSampleSize() {
    return this.sampleDocKeys?.length;
  }

  getTestUid() {
    return this.testUid;
  }
}
