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
  type AttributeValue,
  LookupInSpec,
  MutateInSpec,
  type RequestSpan,
  type RequestTracer,
  type SpanStatus,
  type TimeInput,
} from '@cbjsdev/cbjs';
import { createCouchbaseTest } from '@cbjsdev/vitest';

/**
 * A {@link RequestTracer} double that records every span cbjs creates and the
 * attributes it sets on them. Asserting on it proves the sub-document attributes
 * reach a real tracer during live `lookupIn` / `mutateIn` operations.
 *
 * The two recording flags are owned by the tracer, exactly as for the built-in
 * and Sentry tracers — so toggling them here drives the same code paths a real
 * deployment would.
 */
class RecordingSpan implements RequestSpan {
  attributes: Record<string, AttributeValue> = {};
  status: SpanStatus | undefined;
  ended = false;

  constructor(
    readonly name: string,
    readonly parent: RequestSpan | undefined
  ) {}

  setAttribute(key: string, value: AttributeValue): void {
    this.attributes[key] = value;
  }
  addEvent(): void {
    // noop
  }
  setStatus(status: SpanStatus): void {
    this.status = status;
  }
  end(): void {
    this.ended = true;
  }
}

class RecordingTracer implements RequestTracer {
  spans: RecordingSpan[] = [];

  constructor(
    readonly recordSubDocSpecs = false,
    readonly recordRequestArguments = false
  ) {}

  requestSpan(
    name: string,
    parentSpan?: RequestSpan,
    _startTime?: TimeInput
  ): RequestSpan {
    const span = new RecordingSpan(name, parentSpan);
    this.spans.push(span);
    return span;
  }

  /** Every span created with the given name, in creation order. */
  named(name: string): RecordingSpan[] {
    return this.spans.filter((span) => span.name === name);
  }
}

// Attribute keys are spelled out so the test pins the on-the-wire contract.
const SUBDOC_SPECS = 'couchbase.subdoc.specs';
const SUBDOC_VALUES = 'couchbase.subdoc.values';
const DOCUMENT_ID = 'couchbase.document.id';

describe('observability: sub-document spec recording', async () => {
  const test = await createCouchbaseTest();

  test(
    'records paths and mutateIn values when both flags are enabled',
    { timeout: 30_000 },
    async ({ serverTestContext, expect }) => {
      const tracer = new RecordingTracer(true, true);
      const cluster = await serverTestContext.newConnection(undefined, { tracer });
      const { bucket, scope, collection: name } = serverTestContext.getKeyspace();
      const collection = cluster.bucket(bucket).scope(scope).collection(name);

      const key = `subdoc-both-${Date.now()}`;
      await collection.insert(key, { name: 'alice', age: 30, active: true });

      await collection.lookupIn(key, [
        LookupInSpec.get('name'),
        LookupInSpec.exists('active'),
      ]);
      await collection.mutateIn(key, [
        MutateInSpec.upsert('name', 'bob'),
        MutateInSpec.remove('age'),
      ]);

      const lookup = tracer.named('lookup_in')[0];
      expect(lookup).toBeDefined();
      expect(lookup.attributes[SUBDOC_SPECS]).toEqual(['name', 'active']);
      // recordRequestArguments also surfaces the document key.
      expect(lookup.attributes[DOCUMENT_ID]).toBe(key);

      const mutate = tracer.named('mutate_in')[0];
      expect(mutate).toBeDefined();
      expect(mutate.attributes[SUBDOC_SPECS]).toEqual(['name', 'age']);
      // upsert carries its serialized value; the value-less remove keeps its slot as null.
      expect(mutate.attributes[SUBDOC_VALUES]).toEqual(['"bob"', null]);
    }
  );

  test(
    'records paths but not values when only recordSubDocSpecs is enabled',
    { timeout: 30_000 },
    async ({ serverTestContext, expect }) => {
      const tracer = new RecordingTracer(true, false);
      const cluster = await serverTestContext.newConnection(undefined, { tracer });
      const { bucket, scope, collection: name } = serverTestContext.getKeyspace();
      const collection = cluster.bucket(bucket).scope(scope).collection(name);

      const key = `subdoc-paths-${Date.now()}`;
      await collection.insert(key, { name: 'alice', age: 30 });
      await collection.mutateIn(key, [MutateInSpec.upsert('name', 'bob')]);

      const mutate = tracer.named('mutate_in')[0];
      expect(mutate).toBeDefined();
      expect(mutate.attributes[SUBDOC_SPECS]).toEqual(['name']);
      // Values need recordRequestArguments; the key is off too without it.
      expect(mutate.attributes).not.toHaveProperty(SUBDOC_VALUES);
      expect(mutate.attributes).not.toHaveProperty(DOCUMENT_ID);
    }
  );

  test(
    'records neither paths nor values when recordRequestArguments is on but recordSubDocSpecs is off',
    { timeout: 30_000 },
    async ({ serverTestContext, expect }) => {
      // The case that motivated the gating: a value has no spec to attach to
      // without its path, so recordRequestArguments alone records no sub-document
      // attribute at all — neither the paths nor the values.
      const tracer = new RecordingTracer(false, true);
      const cluster = await serverTestContext.newConnection(undefined, { tracer });
      const { bucket, scope, collection: name } = serverTestContext.getKeyspace();
      const collection = cluster.bucket(bucket).scope(scope).collection(name);

      const key = `subdoc-args-only-${Date.now()}`;
      await collection.insert(key, { name: 'alice', age: 30 });

      await collection.lookupIn(key, [LookupInSpec.get('name')]);
      await collection.mutateIn(key, [MutateInSpec.upsert('name', 'bob')]);

      const lookup = tracer.named('lookup_in')[0];
      expect(lookup).toBeDefined();
      expect(lookup.attributes).not.toHaveProperty(SUBDOC_SPECS);

      const mutate = tracer.named('mutate_in')[0];
      expect(mutate).toBeDefined();
      expect(mutate.attributes).not.toHaveProperty(SUBDOC_SPECS);
      expect(mutate.attributes).not.toHaveProperty(SUBDOC_VALUES);
      // The document key still rides recordRequestArguments, independently.
      expect(mutate.attributes[DOCUMENT_ID]).toBe(key);
    }
  );
});
