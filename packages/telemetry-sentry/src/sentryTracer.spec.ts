/*
 * Copyright (c) 2023-Present Jonathan MASSUCHETTI <jonathan.massuchetti@dappit.fr>.
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
import { describe, it } from 'vitest';

import { SpanStatusCode } from '@cbjsdev/shared';

import {
  SentryRequestTracer,
  type SentrySpanLike,
  type SentryStartSpanOptions,
  type SentryTracingApi,
  timeInputToDate,
} from './sentryTracer.js';

// NOTE: End-to-end behaviour (a real cbjs cluster driving the adapter during KV
// and query operations) is covered by the integration test at
// `tests/cbjs/tests/observability.sentry.spec.ts`. These unit tests only cover
// the pure mapping logic that an integration test cannot easily exercise.

class CapturingSpan implements SentrySpanLike {
  status: { code: number; message?: string } | undefined;
  startTime: number | Date | undefined;
  endedAt: number | Date | undefined;
  events: Array<{ name: string; timestamp?: number | Date }> = [];

  constructor(startTime?: number | Date) {
    this.startTime = startTime;
  }

  setAttribute(): void {
    // noop
  }
  setStatus(status: { code: number; message?: string }): void {
    this.status = status;
  }
  addEvent(name: string, timestamp?: number | Date): void {
    this.events.push({ name, timestamp });
  }
  end(timestamp?: number | Date): void {
    this.endedAt = timestamp;
  }
}

function capturingSentry(): { sentry: SentryTracingApi; spans: CapturingSpan[] } {
  const spans: CapturingSpan[] = [];
  const sentry: SentryTracingApi = {
    startInactiveSpan(options: SentryStartSpanOptions) {
      const span = new CapturingSpan(options.startTime);
      spans.push(span);
      return span;
    },
    withActiveSpan: (_span, cb) => cb(),
  };
  return { sentry, spans };
}

describe('timeInputToDate', () => {
  it('passes a Date through unchanged', ({ expect }) => {
    const date = new Date('2026-01-01T00:00:00.000Z');
    expect(timeInputToDate(date)).toBe(date);
  });

  it('treats a bare number as Unix milliseconds', ({ expect }) => {
    expect(timeInputToDate(1500)).toEqual(new Date(1500));
  });

  it('converts a HiResTime [seconds, nanoseconds] tuple to a Date', ({ expect }) => {
    // 2s + 500_000_000ns = 2500ms
    expect(timeInputToDate([2, 500_000_000])).toEqual(new Date(2500));
  });
});

describe('SentryRequestSpan mapping', () => {
  it('maps the Cbjs span status codes onto Sentry (shared OTel codes)', ({ expect }) => {
    const { sentry, spans } = capturingSentry();
    const tracer = new SentryRequestTracer(sentry);

    tracer.requestSpan('get').setStatus({ code: SpanStatusCode.OK });
    expect(spans[0].status).toEqual({ code: SpanStatusCode.OK, message: undefined });

    tracer
      .requestSpan('get')
      .setStatus({ code: SpanStatusCode.ERROR, message: 'document not found' });
    expect(spans[1].status).toEqual({
      code: SpanStatusCode.ERROR,
      message: 'document not found',
    });
  });

  it('converts Cbjs TimeInput start/end times to Dates for Sentry', ({ expect }) => {
    const { sentry, spans } = capturingSentry();
    const tracer = new SentryRequestTracer(sentry);

    // HiResTime start time → Date.
    const span = tracer.requestSpan('get', undefined, [2, 0]);
    expect(spans[0].startTime).toEqual(new Date(2000));

    span.end(3000); // number ms → Date
    expect(spans[0].endedAt).toEqual(new Date(3000));
  });

  it('forwards events to the Sentry span when supported', ({ expect }) => {
    const { sentry, spans } = capturingSentry();
    new SentryRequestTracer(sentry).requestSpan('mutate_in').addEvent('request_encoding');
    expect(spans[0].events).toEqual([{ name: 'request_encoding', timestamp: undefined }]);
  });

  it('does not throw when the Sentry span has no addEvent support', ({ expect }) => {
    const sentry: SentryTracingApi = {
      startInactiveSpan: () => ({
        setAttribute: () => undefined,
        setStatus: () => undefined,
        end: () => undefined,
      }),
      withActiveSpan: (_span, cb) => cb(),
    };
    expect(() =>
      new SentryRequestTracer(sentry).requestSpan('get').addEvent('evt')
    ).not.toThrow();
  });

  it('ignores a foreign RequestSpan parent it cannot map to a Sentry span', ({
    expect,
  }) => {
    let withActiveSpanCalls = 0;
    const sentry: SentryTracingApi = {
      startInactiveSpan: () => ({
        setAttribute: () => undefined,
        setStatus: () => undefined,
        end: () => undefined,
      }),
      withActiveSpan: (_span, cb) => {
        withActiveSpanCalls++;
        return cb();
      },
    };
    const tracer = new SentryRequestTracer(sentry);

    const foreignParent = {
      name: 'foreign',
      setAttribute: () => undefined,
      addEvent: () => undefined,
      setStatus: () => undefined,
      end: () => undefined,
    };
    tracer.requestSpan('get', foreignParent);

    // A foreign parent cannot be nested, so withActiveSpan is never used.
    expect(withActiveSpanCalls).toBe(0);
  });
});
