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
import type {
  AttributeValue,
  RequestSpan,
  RequestTracer,
  SpanStatus,
  TimeInput,
} from '../types/observability.types.js';

/**
 * A single member of a {@link TracerGroup}.
 *
 * @category Observability
 */
export interface TracerGroupEntry {
  /**
   * The tracer to delegate to.
   */
  tracer: RequestTracer;

  /**
   * Whether this tracer is active. Set to `false` to keep the entry in place but
   * skip it — handy for toggling a tracer per environment
   * (e.g. `enabled: process.env.CI !== 'true'`).
   *
   * @default true
   */
  enabled?: boolean;
}

/**
 * A composite {@link RequestSpan} that fans every call out to one span per
 * member tracer of a {@link TracerGroup}.
 *
 * It also remembers which member tracer produced each span so that, when this
 * span is later used as a parent, the {@link TracerGroup} can hand each member
 * tracer back its own span — preserving every member's parent/child hierarchy.
 *
 * @internal
 */
class TracerGroupSpan implements RequestSpan {
  readonly name: string;
  private readonly _members: ReadonlyArray<{
    tracer: RequestTracer;
    span: RequestSpan;
  }>;

  constructor(
    name: string,
    members: ReadonlyArray<{ tracer: RequestTracer; span: RequestSpan }>
  ) {
    this.name = name;
    this._members = members;
  }

  /**
   * Returns the span produced by the given member tracer, if any.
   *
   * @internal
   */
  spanForTracer(tracer: RequestTracer): RequestSpan | undefined {
    for (const member of this._members) {
      if (member.tracer === tracer) {
        return member.span;
      }
    }
    return undefined;
  }

  setAttribute(key: string, value: AttributeValue): void {
    for (const member of this._members) {
      member.span.setAttribute(key, value);
    }
  }

  addEvent(key: string, startTime?: TimeInput): void {
    for (const member of this._members) {
      member.span.addEvent(key, startTime);
    }
  }

  setStatus(status: SpanStatus): void {
    for (const member of this._members) {
      member.span.setStatus(status);
    }
  }

  end(endTime?: TimeInput): void {
    for (const member of this._members) {
      member.span.end(endTime);
    }
  }
}

/**
 * A {@link RequestTracer} that fans every operation out to one or more member
 * tracers, so a single cluster can report to several telemetry backends at once
 * (e.g. the built-in {@link @cbjsdev/cbjs!ThresholdLoggingTracer} plus an OTel
 * or Sentry adapter).
 *
 * Each member is provided with an `enabled` flag, so a tracer can be switched on
 * or off per environment without restructuring the group:
 *
 * @example
 * ```ts
 * const cluster = await connect(connStr, {
 *   tracer: new TracerGroup([
 *     { tracer: new ThresholdLoggingTracer() },
 *     { tracer: new SentryRequestTracer(sentry), enabled: process.env.CI !== 'true' },
 *   ]),
 * });
 * ```
 *
 * Because it implements the SDK-agnostic {@link RequestTracer} contract, it
 * works with both {@link @cbjsdev/cbjs} and the official `couchbase` SDK.
 *
 * @category Observability
 */
export class TracerGroup implements RequestTracer {
  private readonly _tracers: ReadonlyArray<RequestTracer>;

  /**
   * Creates a tracer that delegates to every enabled entry.
   *
   * @param entries - The member tracers, evaluated in declaration order.
   *                  Entries whose `enabled` flag is `false` are dropped.
   */
  constructor(entries: ReadonlyArray<TracerGroupEntry>) {
    this._tracers = entries
      .filter((entry) => entry.enabled ?? true)
      .map((entry) => entry.tracer);
  }

  /**
   * The active (enabled) member tracers, in declaration order.
   */
  get tracers(): ReadonlyArray<RequestTracer> {
    return this._tracers;
  }

  /**
   * Creates one span per member tracer and returns a composite span that fans
   * subsequent calls out to all of them.
   *
   * When `parentSpan` is a span previously produced by this group, each member
   * tracer is given the matching span it created earlier, so every member keeps
   * its own parent/child hierarchy intact. Any other parent span is forwarded to
   * every member tracer as-is.
   *
   * @param name - The name of the span, describing the operation being traced.
   * @param parentSpan - Optional parent span for creating hierarchical traces.
   * @param startTime - Optional start time; defaults to current time if not provided.
   */
  requestSpan(
    name: string,
    parentSpan?: RequestSpan,
    startTime?: TimeInput
  ): RequestSpan {
    const members = this._tracers.map((tracer) => {
      const parentForTracer =
        parentSpan instanceof TracerGroupSpan
          ? parentSpan.spanForTracer(tracer)
          : parentSpan;
      return {
        tracer,
        span: tracer.requestSpan(name, parentForTracer, startTime),
      };
    });
    return new TracerGroupSpan(name, members);
  }

  /**
   * Releases resources held by member tracers that expose a `cleanup()` method
   * (such as the built-in threshold-logging tracer). Errors raised by a member
   * are swallowed so shutdown always completes.
   */
  cleanup(): void {
    for (const tracer of this._tracers) {
      const maybeCleanable = tracer as { cleanup?: () => void };
      if (typeof maybeCleanable.cleanup === 'function') {
        try {
          maybeCleanable.cleanup();
        } catch {
          // Don't raise exceptions during shutdown.
        }
      }
    }
  }
}
