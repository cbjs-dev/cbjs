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

/**
 * The public observability contract shared by the Couchbase SDKs.
 *
 * These interfaces are structurally identical to the ones exposed by the official
 * `couchbase` SDK (v4.7.0+), so a tracer/meter implementing them works with both
 * the official SDK and {@link @cbjsdev/cbjs} — without depending on either at
 * runtime. This is what allows lightweight, SDK-agnostic telemetry adapters.
 */

/**
 * High-resolution time as a `[seconds, nanoseconds]` tuple since the Unix epoch.
 *
 * @category Observability
 */
export type HiResTime = [number, number];

/**
 * The possible value types for a span attribute.
 *
 * Supports primitives and arrays of primitives (allowing null/undefined elements).
 *
 * @category Observability
 */
export type AttributeValue =
  | string
  | number
  | boolean
  | Array<null | undefined | string>
  | Array<null | undefined | number>
  | Array<null | undefined | boolean>;

/**
 * The accepted timestamp input types in the observability system.
 *
 * - `HiResTime`: High-resolution `[seconds, nanoseconds]` time.
 * - `number`: Unix timestamp in milliseconds.
 * - `Date`: JavaScript Date object.
 *
 * @category Observability
 */
export type TimeInput = HiResTime | number | Date;

/**
 * An enumeration of span status codes (OpenTelemetry-compatible).
 *
 * @category Observability
 */
export enum SpanStatusCode {
  /**
   * The default status.
   */
  UNSET = 0,
  /**
   * The operation has been validated by an Application developer or
   * Operator to have completed successfully.
   */
  OK = 1,
  /**
   * The operation contains an error.
   */
  ERROR = 2,
}

/**
 * Represents the status of a span in distributed tracing.
 *
 * @category Observability
 */
export interface SpanStatus {
  /**
   * The status code indicating the outcome of the span.
   */
  code: SpanStatusCode;
  /**
   * An optional developer-facing error message providing additional context.
   */
  message?: string;
}

/**
 * Represents a single traced operation (span) in distributed tracing.
 *
 * A RequestSpan provides methods to add metadata (attributes), record events,
 * set the final status, and mark the completion of an operation.
 *
 * @category Observability
 */
export interface RequestSpan {
  /**
   * The name of the span, describing the operation being traced.
   */
  readonly name: string;

  /**
   * Sets a single attribute (key-value pair) on the span.
   *
   * @param key - The attribute key.
   * @param value - The attribute value.
   */
  setAttribute(key: string, value: AttributeValue): void;

  /**
   * Adds a timestamped event to the span.
   *
   * @param key - The event name.
   * @param startTime - The start time of the event.
   */
  addEvent(key: string, startTime?: TimeInput): void;

  /**
   * Sets the final status of the span.
   *
   * @param status - The span status containing code and optional message.
   */
  setStatus(status: SpanStatus): void;

  /**
   * Marks the span as complete and records the end time.
   *
   * @param endTime - Optional end time; defaults to current time if not provided.
   */
  end(endTime?: TimeInput): void;
}

/**
 * Interface for creating and managing distributed tracing spans.
 *
 * A RequestTracer is responsible for creating new spans to track operations.
 *
 * @remarks
 * Implementations commonly hold non-serializable runtime state — most often a
 * periodic-flush timer handle from `setInterval`, a circular structure that
 * throws on `JSON.stringify` and floods `console.log` / `util.inspect`.
 *
 * cbjs guards its own boundary: serializing a {@link Cluster} calls the tracer's
 * `toJSON()` (for `JSON.stringify`) or `[inspect.custom]()` (for `util.inspect`)
 * when defined, and otherwise falls back to just the class name — it never
 * recurses into the tracer. To get a useful — and individually safe —
 * representation of your own tracer, define both to expose only config:
 *
 * ```ts
 * import { inspect } from 'util';
 *
 * class MyTracer implements RequestTracer {
 *   // a real tracer usually flushes on a timer — keep it out of serialization
 *   #timer = setInterval(() => this.flush(), 10_000).unref();
 *   constructor(private readonly endpoint: string) {}
 *
 *   requestSpan(name: string, parent?: RequestSpan): RequestSpan {
 *     // ...forward to your backend
 *   }
 *   flush() {
 *     // ...
 *   }
 *
 *   toJSON() {
 *     return { endpoint: this.endpoint };
 *   }
 *   [inspect.custom]() {
 *     return { endpoint: this.endpoint };
 *   }
 * }
 * ```
 *
 * `toJSON` / `[inspect.custom]` are intentionally **not** on this interface — it
 * stays structurally identical to the official SDK's, save for the single
 * **optional** {@link RequestTracer.recordRequestArguments} member below (absent
 * from the official SDK). Being optional, it preserves mutual assignability with
 * the official `RequestTracer`, so a tracer/meter remains interchangeable between
 * cbjs and `couchbase`.
 *
 * @category Observability
 */
export interface RequestTracer {
  /**
   * Creates a new span to trace an operation.
   *
   * @param name - The name of the span, describing the operation being traced.
   * @param parentSpan - Optional parent span for creating hierarchical traces.
   * @param startTime - Optional start time; defaults to current time if not provided.
   * @returns A new RequestSpan instance.
   */
  requestSpan(
    name: string,
    parentSpan?: RequestSpan,
    startTime?: TimeInput
  ): RequestSpan;

  /**
   * When `true`, the SDK records request arguments — KV document keys
   * (`couchbase.document.id`), query/analytics parameter values
   * (`db.query.parameter.<key>`), and `mutateIn` mutation values
   * (`couchbase.subdoc.values`) — as span attributes. These are frequently
   * sensitive (PII / document content), so recording is opt-in.
   *
   * The `mutateIn` values additionally require
   * {@link RequestTracer.recordSubDocSpecs}: a value is only meaningful alongside
   * the path it was written to, so with no paths recorded there is nothing to
   * attach it to and the values are omitted.
   *
   * The flag is owned by the tracer: the default {@link RequestTracer} built from
   * the cluster's `tracingConfig` carries it, and a custom tracer sets its own.
   * Optional and treated as `false` when absent, which keeps existing tracers (and
   * the official SDK's `RequestTracer`) assignable and interchangeable.
   *
   * @default false
   */
  readonly recordRequestArguments?: boolean;

  /**
   * When `true`, the SDK records the sub-document paths of `lookupIn` / `mutateIn`
   * operations (`couchbase.subdoc.specs`) as a span attribute, so a trace shows
   * which fields an operation targeted instead of an opaque `lookup_in`.
   *
   * This flag records the field paths (e.g. `profile.email`). The `mutateIn`
   * values are not recorded by this flag alone: they are request arguments gated
   * additionally on {@link RequestTracer.recordRequestArguments}, and when both
   * flags are on they are recorded as `couchbase.subdoc.values`, index-aligned
   * with these paths. Paths alone can still reveal the document schema, so
   * capture is opt-in.
   *
   * The flag is owned by the tracer: the default {@link RequestTracer} built from
   * the cluster's `tracingConfig` carries it, and a custom tracer sets its own.
   * Optional and treated as `false` when absent, which keeps existing tracers (and
   * the official SDK's `RequestTracer`) assignable and interchangeable.
   *
   * @default false
   */
  readonly recordSubDocSpecs?: boolean;
}

/**
 * Abstract interface for recording metric values.
 *
 * Implementations should record values that will be aggregated and tracked over
 * time, typically for latency or performance metrics.
 *
 * @category Observability
 */
export interface ValueRecorder {
  /**
   * Records a single value.
   *
   * @param value - The value to record (typically latency in microseconds).
   */
  recordValue(value: number): void;
}

/**
 * Abstract interface for creating and managing value recorders.
 *
 * Implementations should allow creating value recorders with specific names
 * and tags for organizing and categorizing metrics.
 *
 * @remarks
 * Implementations commonly hold non-serializable runtime state — most often a
 * periodic-flush timer handle from `setInterval`, a circular structure that
 * throws on `JSON.stringify` and floods `console.log` / `util.inspect`.
 *
 * cbjs guards its own boundary: serializing a {@link Cluster} calls the meter's
 * `toJSON()` (for `JSON.stringify`) or `[inspect.custom]()` (for `util.inspect`)
 * when defined, and otherwise falls back to just the class name — it never
 * recurses into the meter. To get a useful — and individually safe —
 * representation of your own meter, define both to expose only config:
 *
 * ```ts
 * import { inspect } from 'util';
 *
 * class MyMeter implements Meter {
 *   // a real meter usually flushes on a timer — keep it out of serialization
 *   #timer = setInterval(() => this.flush(), 10_000).unref();
 *   constructor(private readonly endpoint: string) {}
 *
 *   valueRecorder(name: string, tags: Record<string, string>): ValueRecorder {
 *     // ...return a recorder bound to your backend
 *   }
 *   flush() {
 *     // ...
 *   }
 *
 *   toJSON() {
 *     return { endpoint: this.endpoint };
 *   }
 *   [inspect.custom]() {
 *     return { endpoint: this.endpoint };
 *   }
 * }
 * ```
 *
 * `toJSON` / `[inspect.custom]` are intentionally **not** on this interface — it
 * stays structurally identical to the official SDK's — so cbjs can't add them
 * for you.
 *
 * @category Observability
 */
export interface Meter {
  /**
   * Gets or creates a value recorder with the specified name and tags.
   *
   * @param name - The name of the recorder (typically operation name).
   * @param tags - Key-value pairs that categorize the metric (e.g., service, operation).
   * @returns {ValueRecorder} A value recorder for recording values.
   */
  valueRecorder(name: string, tags: Record<string, any>): ValueRecorder;
}
