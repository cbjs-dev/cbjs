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
import { describe, it, vi } from 'vitest';

import type { CppDocumentId } from './binding.js';
import type { Meter, ValueRecorder } from './metrics.js';
import { wrapObservableBindingCall } from './observability.js';
import { ObservableRequestHandler } from './observabilityhandler.js';
import {
  KeyValueOp,
  ObservabilityInstruments,
  OpAttributeName,
  SpanStatus,
  SpanStatusCode,
} from './observabilitytypes.js';
import type { RequestSpan, RequestTracer } from './tracing.js';

class RecordingSpan implements RequestSpan {
  attributes: Record<string, unknown> = {};
  status: SpanStatus | undefined;
  events: string[] = [];
  ended = false;

  constructor(
    readonly name: string,
    readonly parent?: RequestSpan
  ) {}

  setAttribute(key: string, value: unknown): void {
    this.attributes[key] = value;
  }
  addEvent(key: string): void {
    this.events.push(key);
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
  requestSpan(name: string, parentSpan?: RequestSpan): RequestSpan {
    const span = new RecordingSpan(name, parentSpan);
    this.spans.push(span);
    return span;
  }
}

class RecordingRecorder implements ValueRecorder {
  values: number[] = [];
  recordValue(value: number): void {
    this.values.push(value);
  }
}

class RecordingMeter implements Meter {
  recorders: RecordingRecorder[] = [];
  valueRecorder(): ValueRecorder {
    const recorder = new RecordingRecorder();
    this.recorders.push(recorder);
    return recorder;
  }
}

function makeInstruments() {
  const tracer = new RecordingTracer();
  const meter = new RecordingMeter();
  const instruments = new ObservabilityInstruments(tracer, meter, () => ({
    clusterName: 'cluster-a',
    clusterUUID: 'uuid-a',
  }));
  return { tracer, meter, instruments };
}

const docId: CppDocumentId = {
  bucket: 'travel',
  scope: 'inventory',
  collection: 'airline',
  key: 'airline_10',
};

describe('ObservableRequestHandler', () => {
  it('sets the standard KV attributes on the operation span', ({ expect }) => {
    const { tracer, instruments } = makeInstruments();

    const handler = new ObservableRequestHandler(KeyValueOp.Get, instruments);
    handler.setRequestKeyValueAttributes(docId);

    const span = tracer.spans[0];
    expect(span).toBeDefined();
    expect(span.attributes[OpAttributeName.SystemName]).toBe('couchbase');
    expect(span.attributes[OpAttributeName.Service]).toBe('kv');
    expect(span.attributes[OpAttributeName.OperationName]).toBe(KeyValueOp.Get);
    expect(span.attributes[OpAttributeName.BucketName]).toBe('travel');
    expect(span.attributes[OpAttributeName.ScopeName]).toBe('inventory');
    expect(span.attributes[OpAttributeName.CollectionName]).toBe('airline');
  });

  it('ends the span and records a latency measurement on success', ({ expect }) => {
    const { tracer, meter, instruments } = makeInstruments();

    const handler = new ObservableRequestHandler(KeyValueOp.Upsert, instruments);
    handler.setRequestKeyValueAttributes(docId);
    handler.end();

    expect(tracer.spans[0].ended).toBe(true);
    const recorded = meter.recorders.flatMap((r) => r.values);
    expect(recorded.length).toBeGreaterThan(0);
    expect(recorded[0]).toBeGreaterThanOrEqual(0);
  });

  it('marks the span as errored with the error message', ({ expect }) => {
    const { tracer, instruments } = makeInstruments();

    const handler = new ObservableRequestHandler(KeyValueOp.Remove, instruments);
    handler.endWithError(new Error('document not found'));

    const span = tracer.spans[0];
    expect(span.status?.code).toBe(SpanStatusCode.ERROR);
    expect(span.status?.message).toBe('document not found');
    expect(span.ended).toBe(true);
  });

  it('ends the span exactly once (end() then endWithError() is a no-op)', ({
    expect,
  }) => {
    const { tracer, instruments } = makeInstruments();

    const handler = new ObservableRequestHandler(KeyValueOp.Get, instruments);
    handler.end();
    handler.endWithError(new Error('too late'));

    const span = tracer.spans[0];
    expect(span.ended).toBe(true);
    // The successful end() won, so the late error must not have overwritten status.
    expect(span.status?.code).not.toBe(SpanStatusCode.ERROR);
  });

  it('nests the operation span under the provided parent span', ({ expect }) => {
    const { tracer, instruments } = makeInstruments();
    const parent = new RecordingSpan('parent');

    new ObservableRequestHandler(KeyValueOp.Get, instruments, parent);

    expect(tracer.spans[0].parent).toBe(parent);
  });
});

describe('wrapObservableBindingCall', () => {
  it('stamps the wrapper span name on the request and returns the response', async ({
    expect,
  }) => {
    const { instruments } = makeInstruments();
    const handler = new ObservableRequestHandler(KeyValueOp.Get, instruments);

    const response = { cas: '1', value: Buffer.from('{}'), flags: 0 };
    const fn = vi.fn((_req: any, cb: (err: null, res: typeof response) => void) => {
      cb(null, response);
    });

    const request: any = { id: docId, timeout: 1000 };
    const [err, resp] = await wrapObservableBindingCall(fn, request, handler);

    expect(err).toBeNull();
    expect(resp).toBe(response);
    expect(fn).toHaveBeenCalledOnce();
    expect((request as { wrapper_span_name?: unknown }).wrapper_span_name).toBe(
      handler.wrapperSpanName
    );
  });
});
