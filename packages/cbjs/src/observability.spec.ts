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

import binding, {
  type CppDocumentId,
  type CppDurabilityLevel,
  type CppGetRequest,
  type CppGetResponse,
  type CppWrapperSdkSpan,
  type ObservableBindingFunc,
  zeroCas,
} from './binding.js';
import type { Meter, ValueRecorder } from './metrics.js';
import { NoOpMeter, NoOpTracer, wrapObservableBindingCall } from './observability.js';
import { ObservableRequestHandler } from './observabilityhandler.js';
import {
  type AttributeValue,
  DatastructureOp,
  KeyValueOp,
  ObservabilityInstruments,
  OpAttributeName,
  ServiceName,
  type SpanStatus,
  SpanStatusCode,
  StreamingOp,
} from './observabilitytypes.js';
import {
  getAttributesForHttpOpType,
  getAttributesForKeyValueOpType,
} from './observabilityutilities.js';
import type { RequestSpan, RequestTracer } from './tracing.js';

/**
 * A {@link RequestSpan} double that records everything cbjs does to it. Unlike a
 * `vi.fn()` mock, it captures the *observable* result of an operation — the
 * attributes an APM backend would index, the final status, and how many times
 * the span was ended — so a test can prove the span was driven correctly.
 */
class RecordingSpan implements RequestSpan {
  attributes: Record<string, AttributeValue> = {};
  status: SpanStatus | undefined;
  events: string[] = [];
  endCount = 0;

  constructor(
    readonly name: string,
    readonly parent?: RequestSpan
  ) {}

  /** A span is "ended" once `end()` has been called at least once. */
  get ended(): boolean {
    return this.endCount > 0;
  }

  setAttribute(key: string, value: AttributeValue): void {
    this.attributes[key] = value;
  }
  addEvent(key: string): void {
    this.events.push(key);
  }
  setStatus(status: SpanStatus): void {
    this.status = status;
  }
  end(): void {
    this.endCount += 1;
  }
}

class RecordingTracer implements RequestTracer {
  spans: RecordingSpan[] = [];
  constructor(readonly recordRequestArguments = false) {}
  requestSpan(name: string, parentSpan?: RequestSpan): RequestSpan {
    const span = new RecordingSpan(name, parentSpan);
    this.spans.push(span);
    return span;
  }
  /** Every span created with the given name, in creation order. */
  named(name: string): RecordingSpan[] {
    return this.spans.filter((span) => span.name === name);
  }
}

/**
 * A {@link ValueRecorder} double that remembers the name and tags it was created
 * with. The tags are the whole point of a metric — recording a KV latency under
 * the `query` service bucket is a silent, dashboard-corrupting regression — so
 * the double keeps them for assertions.
 */
class RecordingRecorder implements ValueRecorder {
  values: number[] = [];
  constructor(
    readonly name: string,
    readonly tags: Record<string, string>
  ) {}
  recordValue(value: number): void {
    this.values.push(value);
  }
}

class RecordingMeter implements Meter {
  recorders: RecordingRecorder[] = [];
  valueRecorder(name: string, tags: Record<string, string>): ValueRecorder {
    const recorder = new RecordingRecorder(name, tags);
    this.recorders.push(recorder);
    return recorder;
  }
  /** Flattened list of every value recorded across all recorders. */
  get recordedValues(): number[] {
    return this.recorders.flatMap((recorder) => recorder.values);
  }
}

function makeInstruments({
  recordRequestArguments = false,
}: { recordRequestArguments?: boolean } = {}) {
  // The flag is owned by the tracer; ObservabilityInstruments derives it from there.
  const tracer = new RecordingTracer(recordRequestArguments);
  const meter = new RecordingMeter();
  const instruments = new ObservabilityInstruments(tracer, meter, () => ({
    clusterName: 'cluster-a',
    clusterUUID: 'uuid-a',
  }));
  return { tracer, meter, instruments };
}

// A realistic keyspace from the Couchbase `travel-sample` bucket.
const docId: CppDocumentId = {
  bucket: 'travel-sample',
  scope: 'inventory',
  collection: 'airline',
  key: 'airline_10',
};

const encodeAirline = (): [Buffer, number] => [
  Buffer.from('{"type":"airline"}'),
  0x2000000,
];

describe('ObservableRequestHandler — request span attributes', () => {
  it('tags the operation span with the standard KV attributes', ({ expect }) => {
    const { tracer, instruments } = makeInstruments();

    const handler = new ObservableRequestHandler(KeyValueOp.Get, instruments);
    handler.setRequestKeyValueAttributes(docId);

    const span = tracer.spans[0];
    expect(span).toBeDefined();
    expect(span?.attributes[OpAttributeName.SystemName]).toBe('couchbase');
    expect(span?.attributes[OpAttributeName.Service]).toBe(ServiceName.KeyValue);
    expect(span?.attributes[OpAttributeName.OperationName]).toBe(KeyValueOp.Get);
    expect(span?.attributes[OpAttributeName.BucketName]).toBe('travel-sample');
    expect(span?.attributes[OpAttributeName.ScopeName]).toBe('inventory');
    expect(span?.attributes[OpAttributeName.CollectionName]).toBe('airline');
    expect(span?.attributes).not.toHaveProperty(OpAttributeName.DocumentId);
  });

  it('records the durability level for a durable write and omits it otherwise', ({
    expect,
  }) => {
    const durable = makeInstruments();
    new ObservableRequestHandler(
      KeyValueOp.Upsert,
      durable.instruments
    ).setRequestKeyValueAttributes(docId, binding.durability_level.majority);
    expect(durable.tracer.spans[0]?.attributes[OpAttributeName.DurabilityLevel]).toBe(
      'majority'
    );

    const plain = makeInstruments();
    new ObservableRequestHandler(
      KeyValueOp.Upsert,
      plain.instruments
    ).setRequestKeyValueAttributes(docId);
    expect(plain.tracer.spans[0]?.attributes).not.toHaveProperty(
      OpAttributeName.DurabilityLevel
    );
  });

  it('records the document key only when recordRequestArguments is enabled', ({
    expect,
  }) => {
    const { tracer, instruments } = makeInstruments({ recordRequestArguments: true });
    new ObservableRequestHandler(
      KeyValueOp.Get,
      instruments
    ).setRequestKeyValueAttributes(docId);
    expect(tracer.spans[0]?.attributes[OpAttributeName.DocumentId]).toBe('airline_10');
  });

  it('omits the document key for an op with no key even when enabled', ({ expect }) => {
    const { tracer, instruments } = makeInstruments({ recordRequestArguments: true });
    new ObservableRequestHandler(
      KeyValueOp.RangeScanCreate,
      instruments
    ).setRequestKeyValueAttributes({ ...docId, key: '' });
    expect(tracer.spans[0]?.attributes).not.toHaveProperty(OpAttributeName.DocumentId);
  });

  it('nests the operation span under the provided parent span', ({ expect }) => {
    const { tracer, instruments } = makeInstruments();
    const parent = new RecordingSpan('parent');

    new ObservableRequestHandler(KeyValueOp.Get, instruments, parent);

    expect(tracer.spans[0]?.parent).toBe(parent);
  });
});

describe('ObservabilityInstruments — recordRequestArguments source', () => {
  it('derives the flag from the active tracer', ({ expect }) => {
    const on = new ObservabilityInstruments(
      new RecordingTracer(true),
      new RecordingMeter()
    );
    const off = new ObservabilityInstruments(
      new RecordingTracer(false),
      new RecordingMeter()
    );
    expect(on.recordRequestArguments).toBe(true);
    expect(off.recordRequestArguments).toBe(false);
  });

  it('defaults to false for a tracer that does not expose the flag', ({ expect }) => {
    // A foreign tracer (e.g. the official SDK's) omits the optional member.
    const foreign: RequestTracer = { requestSpan: (name) => new RecordingSpan(name) };
    const instruments = new ObservabilityInstruments(foreign, new RecordingMeter());
    expect(instruments.recordRequestArguments).toBe(false);
  });
});

describe('getAttributesForHttpOpType — query parameters', () => {
  it('does not record parameter values by default', ({ expect }) => {
    const attrs = getAttributesForHttpOpType(StreamingOp.Query, {
      statement: 'SELECT $1',
      queryOptions: { parameters: ['secret'] },
    });
    expect(
      Object.keys(attrs).some((k) => k.startsWith(OpAttributeName.QueryParameterPrefix))
    ).toBe(false);
  });

  it('records positional parameters as JSON when enabled', ({ expect }) => {
    const attrs = getAttributesForHttpOpType(
      StreamingOp.Query,
      { statement: 'SELECT $1, $2', queryOptions: { parameters: ['a', 2] } },
      true
    );
    expect(attrs[`${OpAttributeName.QueryParameterPrefix}0`]).toBe('"a"');
    expect(attrs[`${OpAttributeName.QueryParameterPrefix}1`]).toBe('2');
  });

  it('records named parameters as JSON when enabled', ({ expect }) => {
    const attrs = getAttributesForHttpOpType(
      StreamingOp.Query,
      { statement: 'SELECT $foo', queryOptions: { parameters: { foo: 'bar' } } },
      true
    );
    expect(attrs[`${OpAttributeName.QueryParameterPrefix}foo`]).toBe('"bar"');
  });
});

describe('ObservableRequestHandler — span/metric lifecycle', () => {
  it('ends the span once and records one latency sample under the right tags', ({
    expect,
  }) => {
    const { tracer, meter, instruments } = makeInstruments();

    const handler = new ObservableRequestHandler(KeyValueOp.Upsert, instruments);
    handler.setRequestKeyValueAttributes(docId);
    handler.end();

    expect(tracer.spans[0]?.endCount).toBe(1);

    // Exactly one latency sample, recorded against the OTel duration metric, and
    // tagged with the service+operation that produced it. The tags are what a
    // dashboard groups by, so a wrong tag is as bad as a missing measurement.
    expect(meter.recorders).toHaveLength(1);
    const recorder = meter.recorders[0];
    expect(recorder?.name).toBe(OpAttributeName.MeterNameOpDuration);
    expect(recorder?.tags[OpAttributeName.Service]).toBe(ServiceName.KeyValue);
    expect(recorder?.tags[OpAttributeName.OperationName]).toBe(KeyValueOp.Upsert);
    expect(recorder?.tags[OpAttributeName.ReservedUnit]).toBe(
      OpAttributeName.ReservedUnitSeconds
    );
    expect(recorder?.values).toHaveLength(1);
    expect(recorder?.values[0]).toBeGreaterThanOrEqual(0);
  });

  it('marks the span as errored with the failure message', ({ expect }) => {
    const { tracer, instruments } = makeInstruments();

    const handler = new ObservableRequestHandler(KeyValueOp.Remove, instruments);
    handler.endWithError(new Error('document not found'));

    const span = tracer.spans[0];
    expect(span?.status?.code).toBe(SpanStatusCode.ERROR);
    expect(span?.status?.message).toBe('document not found');
    expect(span?.endCount).toBe(1);
  });

  it('marks the span errored with no message when no error object is supplied', ({
    expect,
  }) => {
    const { tracer, instruments } = makeInstruments();

    const handler = new ObservableRequestHandler(KeyValueOp.Remove, instruments);
    handler.endWithError();

    const span = tracer.spans[0];
    expect(span?.status?.code).toBe(SpanStatusCode.ERROR);
    expect(span?.status?.message).toBeUndefined();
  });

  it('ends the span exactly once — a late endWithError() cannot reopen a successful span', ({
    expect,
  }) => {
    const { tracer, instruments } = makeInstruments();

    const handler = new ObservableRequestHandler(KeyValueOp.Get, instruments);
    handler.end();
    handler.endWithError(new Error('too late'));

    const span = tracer.spans[0];
    // The successful end() won: the span is ended once and was never flipped to
    // ERROR by the late failure.
    expect(span?.endCount).toBe(1);
    expect(span?.status?.code).not.toBe(SpanStatusCode.ERROR);
  });

  it('records a latency sample tagged with the error type for a failed operation', ({
    expect,
  }) => {
    const { meter, instruments } = makeInstruments();
    class DocumentNotFoundError extends Error {
      constructor(message: string) {
        super(message);
        this.name = 'DocumentNotFoundError';
      }
    }

    const handler = new ObservableRequestHandler(KeyValueOp.Get, instruments);
    handler.setRequestKeyValueAttributes(docId);
    handler.endWithError(new DocumentNotFoundError('missing'));

    // A failed op is still measured, and tagged with the error class minus its
    // `Error` suffix so dashboards can break latency down by failure type.
    const recorder = meter.recorders.at(-1);
    expect(recorder?.values).toHaveLength(1);
    expect(recorder?.tags[OpAttributeName.ErrorType]).toBe('DocumentNotFound');
  });

  it('tags a non-Error failure as the _OTHER error type', ({ expect }) => {
    const { meter, instruments } = makeInstruments();

    const handler = new ObservableRequestHandler(KeyValueOp.Get, instruments);
    handler.setRequestKeyValueAttributes(docId);
    handler.endWithError('connection reset');

    expect(meter.recorders.at(-1)?.tags[OpAttributeName.ErrorType]).toBe('_OTHER');
  });

  it('does not record a latency metric for a top-level data-structure sub-operation', ({
    expect,
  }) => {
    const { meter, instruments } = makeInstruments();

    // A list/map/set/queue op is implemented on top of a KV op; metering it at
    // the top level would double-count the underlying mutate_in/lookup_in.
    const handler = new ObservableRequestHandler(DatastructureOp.ListPush, instruments);
    handler.setRequestKeyValueAttributes(docId);
    handler.end();

    expect(meter.recordedValues).toHaveLength(0);
  });
});

describe('ObservableRequestHandler — no-op instruments', () => {
  it('creates no spans and records no metrics when tracer and meter are no-ops', ({
    expect,
  }) => {
    const instruments = new ObservabilityInstruments(new NoOpTracer(), new NoOpMeter());
    const handler = new ObservableRequestHandler(KeyValueOp.Get, instruments);

    handler.setRequestKeyValueAttributes(docId);
    handler.end();

    // The disabled path must stay allocation-free: no wrapper span name to stamp
    // on the request, no wrapped span, and the lifecycle never throws.
    expect(handler.wrapperSpanName).toBe('');
    expect(handler.wrappedSpan).toBeUndefined();
    expect(() => handler.endWithError(new Error('ignored'))).not.toThrow();
  });
});

describe('ObservableRequestHandler — encoding spans', () => {
  it('wraps a single encoding span for a simple KV op and returns the encoded value', ({
    expect,
  }) => {
    const { tracer, instruments } = makeInstruments();
    const handler = new ObservableRequestHandler(KeyValueOp.Upsert, instruments);

    const [bytes, flags] = handler.maybeCreateEncodingSpan(encodeAirline);
    expect(bytes.toString()).toBe('{"type":"airline"}');
    expect(flags).toBe(0x2000000);

    const encodingSpans = tracer.named(OpAttributeName.EncodingSpanName);
    expect(encodingSpans).toHaveLength(1);
    expect(encodingSpans[0]?.parent).toBe(tracer.spans[0]);
    expect(encodingSpans[0]?.attributes[OpAttributeName.SystemName]).toBe('couchbase');

    // Encoding spans close when the operation ends.
    handler.end();
    expect(encodingSpans[0]?.ended).toBe(true);
  });

  it('wraps one encoding span per sub-document path for mutate_in', ({ expect }) => {
    const { tracer, instruments } = makeInstruments();
    const handler = new ObservableRequestHandler(KeyValueOp.MutateIn, instruments);

    handler.maybeAddEncodingSpan(encodeAirline);
    handler.maybeAddEncodingSpan(encodeAirline);

    expect(tracer.named(OpAttributeName.EncodingSpanName)).toHaveLength(2);
  });
});

describe('wrapObservableBindingCall', () => {
  it('stamps the wrapper span name on the request and resolves with the response', async ({
    expect,
  }) => {
    const { instruments } = makeInstruments();
    const handler = new ObservableRequestHandler(KeyValueOp.Get, instruments);

    const response: CppGetResponse = { value: Buffer.from('{}'), cas: zeroCas, flags: 0 };
    const fn = vi.fn<ObservableBindingFunc<CppGetRequest, CppGetResponse>>((_req, cb) => {
      cb(null, response);
    });

    const request: CppGetRequest = { id: docId, partition: 0, opaque: 1, timeout: 2500 };
    const [err, resp] = await wrapObservableBindingCall(fn, request, handler);

    expect(err).toBeNull();
    expect(resp).toBe(response);
    expect(fn).toHaveBeenCalledOnce();
    expect(request.wrapper_span_name).toBe(handler.wrapperSpanName);
  });

  it('threads the C++ core span back onto the operation span', async ({ expect }) => {
    const { tracer, instruments } = makeInstruments();
    const handler = new ObservableRequestHandler(KeyValueOp.Get, instruments);
    handler.setRequestKeyValueAttributes(docId);

    // The core returns the node it talked to, the retry count, and a
    // dispatch-to-server child span. The wrapper must surface all of that on the
    // JS span so a trace shows which node served the request and how many tries
    // it took.
    const coreSpan: CppWrapperSdkSpan = {
      attributes: {
        cluster_name: 'prod-cluster',
        cluster_uuid: 'cccccccc-uuid',
        retries: 2,
      },
      children: [
        {
          name: OpAttributeName.DispatchSpanName,
          start: [0, 0],
          end: [0, 0],
          attributes: { 'server.address': '10.0.0.1', 'server.port': 11210 },
        },
      ],
    };
    const response: CppGetResponse = {
      value: Buffer.from('{}'),
      cas: zeroCas,
      flags: 0,
      cpp_core_span: coreSpan,
    };
    const fn: ObservableBindingFunc<CppGetRequest, CppGetResponse> = (_req, cb) => {
      cb(null, response);
    };

    const request: CppGetRequest = { id: docId, partition: 0, opaque: 1 };
    await wrapObservableBindingCall(fn, request, handler);

    const opSpan = tracer.spans[0];
    expect(opSpan?.attributes[OpAttributeName.ClusterName]).toBe('prod-cluster');
    expect(opSpan?.attributes[OpAttributeName.ClusterUUID]).toBe('cccccccc-uuid');
    expect(opSpan?.attributes[OpAttributeName.RetryCount]).toBe(2);

    const dispatch = tracer.named(OpAttributeName.DispatchSpanName)[0];
    expect(dispatch).toBeDefined();
    expect(dispatch?.parent).toBe(opSpan);
    expect(dispatch?.attributes['server.address']).toBe('10.0.0.1');
    expect(dispatch?.ended).toBe(true);
  });
});

describe('getAttributesForHttpOpType (query span attributes)', () => {
  it('always sets the system, service and operation attributes', ({ expect }) => {
    const attrs = getAttributesForHttpOpType(StreamingOp.Query);
    expect(attrs[OpAttributeName.SystemName]).toBe('couchbase');
    expect(attrs[OpAttributeName.Service]).toBe(ServiceName.Query);
    expect(attrs[OpAttributeName.OperationName]).toBe(StreamingOp.Query);
  });

  // DIVERGENCE from couchnode 4.7.0: upstream records db.query.text only when the
  // query is parameterized (`queryOptions?.parameters && statement`), dropping the
  // statement for the common unparameterized case. cbjs records it whenever a
  // statement is present. These two tests guard that divergence — if a future
  // upstream sync reintroduces the parameters guard, the first one fails.
  it('records db.query.text for an unparameterized statement', ({ expect }) => {
    const statement = 'SELECT 1 = 1';
    const attrs = getAttributesForHttpOpType(StreamingOp.Query, { statement });
    expect(attrs[OpAttributeName.QueryStatement]).toBe(statement);
  });

  it('records db.query.text for a parameterized statement', ({ expect }) => {
    const statement = 'SELECT * FROM `travel-sample` WHERE id = $1';
    const attrs = getAttributesForHttpOpType(StreamingOp.Query, {
      statement,
      queryOptions: { parameters: [10] },
    });
    expect(attrs[OpAttributeName.QueryStatement]).toBe(statement);
  });

  it('records explicit bucket, scope and collection names', ({ expect }) => {
    const attrs = getAttributesForHttpOpType(StreamingOp.Query, {
      bucketName: 'travel-sample',
      scopeName: 'inventory',
      collectionName: 'airline',
    });
    expect(attrs[OpAttributeName.BucketName]).toBe('travel-sample');
    expect(attrs[OpAttributeName.ScopeName]).toBe('inventory');
    expect(attrs[OpAttributeName.CollectionName]).toBe('airline');
  });

  it('parses queryContext into db.namespace and scope, stripping backticks', ({
    expect,
  }) => {
    const attrs = getAttributesForHttpOpType(StreamingOp.Query, {
      queryContext: '`travel-sample`.`inventory`',
    });
    expect(attrs[OpAttributeName.BucketName]).toBe('travel-sample');
    expect(attrs[OpAttributeName.ScopeName]).toBe('inventory');
  });

  it('lets queryContext take precedence over explicit bucket/scope options', ({
    expect,
  }) => {
    const attrs = getAttributesForHttpOpType(StreamingOp.Query, {
      bucketName: 'wrong-bucket',
      scopeName: 'wrong-scope',
      queryContext: '`travel-sample`.`inventory`',
    });
    expect(attrs[OpAttributeName.BucketName]).toBe('travel-sample');
    expect(attrs[OpAttributeName.ScopeName]).toBe('inventory');
  });

  it('lands db.query.text and the namespace on the query span through the handler', ({
    expect,
  }) => {
    const { tracer, instruments } = makeInstruments();
    const statement = 'SELECT * FROM `travel-sample` WHERE id = $1';

    const handler = new ObservableRequestHandler(StreamingOp.Query, instruments);
    handler.setRequestHttpAttributes({
      statement,
      queryOptions: { parameters: [10] },
      queryContext: '`travel-sample`.`inventory`',
    });

    const span = tracer.spans[0];
    expect(span?.name).toBe(StreamingOp.Query);
    expect(span?.attributes[OpAttributeName.Service]).toBe(ServiceName.Query);
    expect(span?.attributes[OpAttributeName.QueryStatement]).toBe(statement);
    expect(span?.attributes[OpAttributeName.BucketName]).toBe('travel-sample');
    expect(span?.attributes[OpAttributeName.ScopeName]).toBe('inventory');
  });
});

describe('getAttributesForKeyValueOpType (durability attribute)', () => {
  it('sets the standard KV attributes from the document id', ({ expect }) => {
    const attrs = getAttributesForKeyValueOpType(KeyValueOp.Upsert, docId);
    expect(attrs[OpAttributeName.SystemName]).toBe('couchbase');
    expect(attrs[OpAttributeName.Service]).toBe(ServiceName.KeyValue);
    expect(attrs[OpAttributeName.OperationName]).toBe(KeyValueOp.Upsert);
    expect(attrs[OpAttributeName.BucketName]).toBe('travel-sample');
    expect(attrs[OpAttributeName.ScopeName]).toBe('inventory');
    expect(attrs[OpAttributeName.CollectionName]).toBe('airline');
  });

  it('maps each durability level to its label and omits it for none/undefined', ({
    expect,
  }) => {
    const durabilityOf = (level?: CppDurabilityLevel) =>
      getAttributesForKeyValueOpType(KeyValueOp.Upsert, docId, level)[
        OpAttributeName.DurabilityLevel
      ];

    expect(durabilityOf(binding.durability_level.majority)).toBe('majority');
    expect(durabilityOf(binding.durability_level.majority_and_persist_to_active)).toBe(
      'majority_and_persist_to_active'
    );
    expect(durabilityOf(binding.durability_level.persist_to_majority)).toBe(
      'persist_to_majority'
    );

    // durability_level.none and an unset durability leave the attribute off.
    expect(
      getAttributesForKeyValueOpType(
        KeyValueOp.Upsert,
        docId,
        binding.durability_level.none
      )
    ).not.toHaveProperty(OpAttributeName.DurabilityLevel);
    expect(getAttributesForKeyValueOpType(KeyValueOp.Upsert, docId)).not.toHaveProperty(
      OpAttributeName.DurabilityLevel
    );
  });
});
