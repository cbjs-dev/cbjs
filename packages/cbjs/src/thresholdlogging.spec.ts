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
import { afterEach, describe, expect, it, vi } from 'vitest';

import { CouchbaseLogger, NoOpLogger } from './logger.js';
import { OpAttributeName, ServiceName } from './observabilitytypes.js';
import { ThresholdLoggingTracer } from './thresholdlogging.js';

afterEach(() => {
  vi.useRealTimers();
});

describe('ThresholdLoggingTracer', () => {
  it('returns a usable RequestSpan from requestSpan()', () => {
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

  it('emits a threshold report through the logger for a slow operation', () => {
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

  it('treats a threshold of 0 as "trace everything" (not disabled)', () => {
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

  it('does not report fast operations below the threshold', () => {
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
});
