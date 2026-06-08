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
import type {
  AttributeValue,
  RequestSpan,
  RequestTracer,
  SpanStatus,
  TimeInput,
} from '@cbjsdev/shared';

/**
 * The subset of a Sentry span that the adapter relies on.
 *
 * This is intentionally a structural subset of the span returned by
 * `@sentry/node`'s `startInactiveSpan`, so the real Sentry namespace can be
 * passed directly to {@link SentryRequestTracer} without any wrapping.
 *
 * @category Observability
 */
export interface SentrySpanLike {
  /**
   * Sets a single attribute on the span.
   */
  setAttribute(key: string, value: AttributeValue | undefined): void;

  /**
   * Sets the span status. Status codes follow the OpenTelemetry convention
   * shared by Cbjs and Sentry: `0` (unset), `1` (ok), `2` (error).
   */
  setStatus(status: { code: number; message?: string }): void;

  /**
   * Records a timestamped event on the span, when supported by the underlying
   * Sentry span implementation.
   */
  addEvent?(name: string, timestamp?: number | Date): void;

  /**
   * Ends the span, optionally at the provided timestamp.
   */
  end(timestamp?: number | Date): void;
}

/**
 * Options accepted by {@link SentryTracingApi.startInactiveSpan}.
 *
 * @category Observability
 */
export interface SentryStartSpanOptions {
  name: string;
  startTime?: number | Date;
  attributes?: Record<string, AttributeValue | undefined>;
}

/**
 * The subset of the Sentry tracing API the adapter relies on.
 *
 * `@sentry/node` (v8+) satisfies this interface directly:
 *
 * ```ts
 * import * as Sentry from '@sentry/node';
 * const tracer = new SentryRequestTracer(Sentry);
 * ```
 *
 * @category Observability
 */
export interface SentryTracingApi {
  /**
   * Starts a span that is not set as the active span and must be ended manually.
   */
  startInactiveSpan(options: SentryStartSpanOptions): SentrySpanLike;

  /**
   * Runs `callback` with `span` set as the active span, so spans created within
   * the callback are parented to it. Passing `null` runs without a parent.
   */
  withActiveSpan<T>(span: SentrySpanLike | null, callback: () => T): T;
}

/**
 * Options accepted by {@link SentryRequestTracer}.
 *
 * @category Observability
 */
export interface SentryRequestTracerOptions {
  /**
   * When `true`, the SDK records request arguments — KV document keys
   * (`couchbase.document.id`) and query/analytics parameter values
   * (`db.query.parameter.<key>`) — as span attributes exported to Sentry.
   *
   * These values are frequently sensitive (PII), so recording is opt-in. The flag
   * is owned by the tracer: unlike the cluster's `tracingConfig` (which configures
   * the default tracer only), this controls recording for the Sentry tracer.
   *
   * @default false
   */
  recordRequestArguments?: boolean;
}

/**
 * Converts a Cbjs {@link TimeInput} into a `Date` that Sentry accepts.
 *
 * @internal
 */
export function timeInputToDate(input: TimeInput): Date {
  if (input instanceof Date) {
    return input;
  }
  if (typeof input === 'number') {
    // Cbjs represents a bare number as a Unix timestamp in milliseconds.
    return new Date(input);
  }
  // HiResTime: [seconds, nanoseconds] since the Unix epoch.
  const [seconds, nanoseconds] = input;
  return new Date(seconds * 1000 + nanoseconds / 1e6);
}

/**
 * A Cbjs {@link RequestSpan} backed by a Sentry span.
 *
 * @category Observability
 */
export class SentryRequestSpan implements RequestSpan {
  readonly name: string;

  /**
   * The underlying Sentry span. Exposed so that nested operations can be
   * parented to it.
   *
   * @internal
   */
  readonly sentrySpan: SentrySpanLike;

  constructor(
    sentry: SentryTracingApi,
    name: string,
    parentSpan?: RequestSpan,
    startTime?: TimeInput
  ) {
    this.name = name;

    const start = startTime !== undefined ? timeInputToDate(startTime) : undefined;
    const open = (): SentrySpanLike =>
      sentry.startInactiveSpan({ name, startTime: start });

    // Only nest under parents that we created; foreign RequestSpan
    // implementations cannot be mapped onto a Sentry span.
    const parentSentrySpan =
      parentSpan instanceof SentryRequestSpan ? parentSpan.sentrySpan : null;

    this.sentrySpan = parentSentrySpan
      ? sentry.withActiveSpan(parentSentrySpan, open)
      : open();
  }

  setAttribute(key: string, value: AttributeValue): void {
    this.sentrySpan.setAttribute(key, value);
  }

  addEvent(key: string, startTime?: TimeInput): void {
    this.sentrySpan.addEvent?.(
      key,
      startTime !== undefined ? timeInputToDate(startTime) : undefined
    );
  }

  setStatus(status: SpanStatus): void {
    this.sentrySpan.setStatus({ code: status.code, message: status.message });
  }

  end(endTime?: TimeInput): void {
    this.sentrySpan.end(endTime !== undefined ? timeInputToDate(endTime) : undefined);
  }
}

/**
 * A Cbjs {@link RequestTracer} that reports operation spans to Sentry.
 *
 * Pass it to the cluster on connect. Works with the official `couchbase` SDK
 * and with `@cbjsdev/cbjs` (the tracer contract is identical):
 *
 * ```ts
 * import { connect } from 'couchbase';
 * import * as Sentry from '@sentry/node';
 * import { SentryRequestTracer } from '@cbjsdev/telemetry-sentry';
 *
 * const cluster = await connect('couchbase://localhost', {
 *   username: 'Administrator',
 *   password: 'password',
 *   tracer: new SentryRequestTracer(Sentry),
 * });
 * ```
 *
 * Pass {@link SentryRequestTracerOptions} to opt into recording request arguments
 * (KV document keys, query parameters) as span attributes:
 *
 * ```ts
 * new SentryRequestTracer(Sentry, { recordRequestArguments: true });
 * ```
 *
 * @category Observability
 */
export class SentryRequestTracer implements RequestTracer {
  private readonly _sentry: SentryTracingApi;

  /**
   * Whether request arguments (KV document keys, query parameter values) are
   * recorded as span attributes.
   *
   * @see SentryRequestTracerOptions.recordRequestArguments
   */
  readonly recordRequestArguments: boolean;

  constructor(sentry: SentryTracingApi, options: SentryRequestTracerOptions = {}) {
    this._sentry = sentry;
    this.recordRequestArguments = options.recordRequestArguments ?? false;
  }

  requestSpan(
    name: string,
    parentSpan?: RequestSpan,
    startTime?: TimeInput
  ): RequestSpan {
    return new SentryRequestSpan(this._sentry, name, parentSpan, startTime);
  }
}
