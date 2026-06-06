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

import { DocumentNotFoundError, SpanStatusCode } from '@cbjsdev/cbjs';
import {
  SentryRequestTracer,
  type SentrySpanLike,
  type SentryStartSpanOptions,
  type SentryTracingApi,
} from '@cbjsdev/telemetry-sentry';
import { createCouchbaseTest } from '@cbjsdev/vitest';

/**
 * A fake Sentry tracing API that records everything the adapter forwards to it.
 * This is the "Sentry boundary": asserting on it proves cbjs actually drove the
 * adapter end-to-end during real operations.
 */
class RecordingSpan implements SentrySpanLike {
  attributes: Record<string, unknown> = {};
  status: { code: number; message?: string } | undefined;
  ended = false;

  constructor(
    readonly name: string,
    readonly parent: RecordingSpan | undefined
  ) {}

  setAttribute(key: string, value: unknown): void {
    this.attributes[key] = value;
  }
  setStatus(status: { code: number; message?: string }): void {
    this.status = status;
  }
  addEvent(): void {}
  end(): void {
    this.ended = true;
  }
}

class RecordingSentry implements SentryTracingApi {
  spans: RecordingSpan[] = [];
  private _active: RecordingSpan | null = null;

  startInactiveSpan(options: SentryStartSpanOptions): SentrySpanLike {
    const span = new RecordingSpan(options.name, this._active ?? undefined);
    this.spans.push(span);
    return span;
  }

  withActiveSpan<T>(span: SentrySpanLike | null, callback: () => T): T {
    const previous = this._active;
    this._active = span as RecordingSpan | null;
    try {
      return callback();
    } finally {
      this._active = previous;
    }
  }

  named(name: string): RecordingSpan[] {
    return this.spans.filter((span) => span.name === name);
  }
}

describe('observability: Sentry adapter integration', async () => {
  const test = await createCouchbaseTest();

  test(
    'reports KV operations to the Sentry tracer',
    { timeout: 30_000 },
    async ({ serverTestContext, expect }) => {
      const sentry = new RecordingSentry();
      const cluster = await serverTestContext.newConnection(undefined, {
        tracer: new SentryRequestTracer(sentry),
      });

      const {
        bucket,
        scope,
        collection: collectionName,
      } = serverTestContext.getKeyspace();
      const collection = cluster.bucket(bucket).scope(scope).collection(collectionName);

      const key = `sentry-kv-${Date.now()}`;

      await collection.insert(key, { hello: 'world' });
      await collection.get(key);
      await collection.replace(key, { hello: 'sentry' });
      await collection.remove(key);

      // A failing operation must produce an errored span.
      await expect(collection.get('missing-key')).rejects.toThrow(DocumentNotFoundError);

      const names = sentry.spans.map((span) => span.name);
      expect(names).toContain('insert');
      expect(names).toContain('get');
      expect(names).toContain('replace');
      expect(names).toContain('remove');

      // Every captured span must have been ended.
      expect(sentry.spans.every((span) => span.ended)).toBe(true);

      // The successful get carries the standard KV attributes.
      const successfulGet = sentry
        .named('get')
        .find((span) => span.status?.code !== SpanStatusCode.ERROR);
      expect(successfulGet).toBeDefined();
      expect(successfulGet!.attributes['db.system.name']).toBe('couchbase');
      expect(successfulGet!.attributes['couchbase.service']).toBe('kv');
      expect(successfulGet!.attributes['db.operation.name']).toBe('get');
      expect(successfulGet!.attributes['db.namespace']).toBe(bucket);
      expect(successfulGet!.attributes['couchbase.scope.name']).toBe(scope);
      expect(successfulGet!.attributes['couchbase.collection.name']).toBe(collectionName);

      // The failing get is reported with an ERROR status.
      const erroredGet = sentry
        .named('get')
        .find((span) => span.status?.code === SpanStatusCode.ERROR);
      expect(erroredGet).toBeDefined();
    }
  );

  test(
    'reports query operations to the Sentry tracer',
    { timeout: 30_000 },
    async ({ serverTestContext, expect }) => {
      const sentry = new RecordingSentry();
      const cluster = await serverTestContext.newConnection(undefined, {
        tracer: new SentryRequestTracer(sentry),
      });

      await cluster.query('SELECT 1=1');

      const querySpan = sentry.named('query')[0];
      expect(querySpan).toBeDefined();
      expect(querySpan.ended).toBe(true);
      expect(querySpan.attributes['couchbase.service']).toBe('query');
      expect(querySpan.attributes['db.operation.name']).toBe('query');
    }
  );

  test(
    'nests a Couchbase span under a parent Sentry span',
    { timeout: 30_000 },
    async ({ serverTestContext, expect }) => {
      const sentry = new RecordingSentry();
      const tracer = new SentryRequestTracer(sentry);
      const cluster = await serverTestContext.newConnection(undefined, { tracer });

      const {
        bucket,
        scope,
        collection: collectionName,
      } = serverTestContext.getKeyspace();
      const collection = cluster.bucket(bucket).scope(scope).collection(collectionName);

      // A caller-owned parent span.
      const parent = tracer.requestSpan('checkout');
      const key = `sentry-parent-${Date.now()}`;
      await collection.upsert(key, { v: 1 }, { parentSpan: parent });
      parent.end();

      const upsertSpan = sentry.named('upsert')[0];
      const parentSpan = sentry.named('checkout')[0];
      expect(upsertSpan).toBeDefined();
      expect(parentSpan).toBeDefined();
      expect(upsertSpan.parent).toBe(parentSpan);
    }
  );
});
