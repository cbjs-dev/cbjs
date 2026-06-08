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
import { afterEach, describe, it, vi } from 'vitest';

import { ServiceType } from './generaltypes.js';
import { CouchbaseLogger, NoOpLogger } from './logger.js';
import { OpAttributeName, ServiceName } from './observabilitytypes.js';
import { ThresholdLoggingTracer } from './thresholdlogging.js';

afterEach(() => {
  vi.useRealTimers();
});

describe('ThresholdLoggingTracer', () => {
  it('returns a usable RequestSpan from requestSpan()', ({ expect }) => {
    const tracer = new ThresholdLoggingTracer(
      new CouchbaseLogger(new NoOpLogger()),
      null
    );
    try {
      const span = tracer.requestSpan('get');
      expect(span.name).toBe('get');
      expect(() => {
        span.setAttribute(OpAttributeName.Service, ServiceName.KeyValue);
        span.addEvent('request_encoding');
        span.end();
      }).not.toThrow();
    } finally {
      tracer.cleanup();
    }
  });

  it('exposes recordRequestArguments from its options (default false)', ({ expect }) => {
    const off = new ThresholdLoggingTracer(new CouchbaseLogger(new NoOpLogger()), null);
    const on = new ThresholdLoggingTracer(new CouchbaseLogger(new NoOpLogger()), {
      recordRequestArguments: true,
    });
    try {
      expect(off.recordRequestArguments).toBe(false);
      expect(on.recordRequestArguments).toBe(true);
    } finally {
      off.cleanup();
      on.cleanup();
    }
  });

  it('emits a threshold report through the logger for a slow operation', ({ expect }) => {
    vi.useFakeTimers({ toFake: ['setInterval', 'clearInterval'] });
    const logged: string[] = [];
    const logger = new CouchbaseLogger({
      info: (message: string) => {
        logged.push(message);
      },
    });

    const tracer = new ThresholdLoggingTracer(logger, {
      kvThreshold: 1,
      emitInterval: 1000,
      sampleSize: 10,
    });

    const span = tracer.requestSpan('get');
    span.setAttribute(OpAttributeName.Service, ServiceName.KeyValue);
    // Force a 5s span duration so it is unambiguously over the threshold.
    span.end(new Date(Date.now() + 5000));

    expect(logged).toHaveLength(0);
    vi.advanceTimersByTime(1000);
    expect(logged.length).toBeGreaterThan(0);
    expect(logged[0]).toContain(ServiceName.KeyValue);

    tracer.cleanup();
  });

  it('treats a threshold of 0 as "trace everything" (not disabled)', ({ expect }) => {
    vi.useFakeTimers({ toFake: ['setInterval', 'clearInterval'] });
    const logged: string[] = [];
    const logger = new CouchbaseLogger({
      info: (message: string) => {
        logged.push(message);
      },
    });

    // A 0 threshold must report every operation rather than being disabled.
    const tracer = new ThresholdLoggingTracer(logger, {
      kvThreshold: 0,
      emitInterval: 1000,
    });

    const span = tracer.requestSpan('get');
    span.setAttribute(OpAttributeName.Service, ServiceName.KeyValue);
    // Any non-zero duration is over a 0 threshold.
    span.end(new Date(Date.now() + 1));

    vi.advanceTimersByTime(1000);
    expect(logged.length).toBeGreaterThan(0);
    expect(logged[0]).toContain(ServiceName.KeyValue);

    tracer.cleanup();
  });

  it('does not report fast operations below the threshold', ({ expect }) => {
    vi.useFakeTimers({ toFake: ['setInterval', 'clearInterval'] });
    const logged: string[] = [];
    const logger = new CouchbaseLogger({
      info: (message: string) => {
        logged.push(message);
      },
    });

    // A very high threshold means a near-instant op is never reported.
    const tracer = new ThresholdLoggingTracer(logger, {
      kvThreshold: 60_000,
      emitInterval: 1000,
    });

    const span = tracer.requestSpan('get');
    span.setAttribute(OpAttributeName.Service, ServiceName.KeyValue);
    span.end();

    vi.advanceTimersByTime(1000);
    expect(logged).toHaveLength(0);

    tracer.cleanup();
  });

  it('keeps only the slowest sampleSize operations but still counts the rest', ({
    expect,
  }) => {
    vi.useFakeTimers({ toFake: ['setInterval', 'clearInterval'] });
    const logged: string[] = [];
    const logger = new CouchbaseLogger({
      info: (message: string) => {
        logged.push(message);
      },
    });

    // Every op is over the 1ms threshold, but only the 2 slowest may be kept.
    const tracer = new ThresholdLoggingTracer(logger, {
      kvThreshold: 1,
      emitInterval: 1000,
      sampleSize: 2,
    });

    // Four KV ops of 1s/2s/3s/4s. The 3s and 4s ones are the worst offenders.
    for (const durationMs of [1000, 2000, 3000, 4000]) {
      const span = tracer.requestSpan('get');
      span.setAttribute(OpAttributeName.Service, ServiceName.KeyValue);
      span.end(new Date(Date.now() + durationMs));
    }

    vi.advanceTimersByTime(1000);

    const report = JSON.parse(logged[0]) as Record<
      string,
      { total_count: number; top_requests: Array<Record<string, number | string>> }
    >;
    const kv = report[ServiceType.KeyValue];
    expect(kv).toBeDefined();
    // total_count reflects all four ops even though only two were retained, so
    // an operator can tell sampling dropped data rather than under-counting.
    expect(kv.total_count).toBe(4);
    expect(kv.top_requests).toHaveLength(2);

    // The kept records are the two slowest (>2.5s), listed slowest-first.
    const durations = kv.top_requests.map((record) => record.total_duration_us as number);
    expect(durations[0]).toBeGreaterThan(durations[1]);
    expect(durations[0]).toBeGreaterThan(2_500_000);
    expect(durations[1]).toBeGreaterThan(2_500_000);

    tracer.cleanup();
  });

  it('applies thresholds per service: a slow KV op is reported while a fast query op is not', ({
    expect,
  }) => {
    vi.useFakeTimers({ toFake: ['setInterval', 'clearInterval'] });
    const logged: string[] = [];
    const logger = new CouchbaseLogger({
      info: (message: string) => {
        logged.push(message);
      },
    });

    // KV trips a 1ms threshold; query keeps its 1s default and stays well under.
    const tracer = new ThresholdLoggingTracer(logger, {
      kvThreshold: 1,
      emitInterval: 1000,
    });

    const slowKv = tracer.requestSpan('get');
    slowKv.setAttribute(OpAttributeName.Service, ServiceName.KeyValue);
    slowKv.end(new Date(Date.now() + 2000));

    const fastQuery = tracer.requestSpan('query');
    fastQuery.setAttribute(OpAttributeName.Service, ServiceName.Query);
    fastQuery.end();

    vi.advanceTimersByTime(1000);

    const report = JSON.parse(logged[0]) as Record<string, unknown>;
    expect(report[ServiceType.KeyValue]).toBeDefined();
    expect(report[ServiceType.Query]).toBeUndefined();

    tracer.cleanup();
  });
});
