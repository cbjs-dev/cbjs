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
import type { Meter, ValueRecorder } from '../types/observability.types.js';

/**
 * A single member of a {@link MeterGroup}.
 *
 * @category Observability
 */
export interface MeterGroupEntry {
  /**
   * The meter to delegate to.
   */
  meter: Meter;

  /**
   * Whether this meter is active. Set to `false` to keep the entry in place but
   * skip it — handy for toggling a meter per environment
   * (e.g. `enabled: process.env.CI !== 'true'`).
   *
   * @default true
   */
  enabled?: boolean;
}

/**
 * A composite {@link ValueRecorder} that forwards every recorded value to one
 * recorder per member meter of a {@link MeterGroup}.
 *
 * @internal
 */
class MeterGroupValueRecorder implements ValueRecorder {
  private readonly _recorders: ReadonlyArray<ValueRecorder>;

  constructor(recorders: ReadonlyArray<ValueRecorder>) {
    this._recorders = recorders;
  }

  recordValue(value: number): void {
    for (const recorder of this._recorders) {
      recorder.recordValue(value);
    }
  }
}

/**
 * A {@link Meter} that fans every recorded value out to one or more member
 * meters, so a single cluster can report metrics to several backends at once
 * (e.g. the built-in {@link @cbjsdev/cbjs!LoggingMeter} plus an OTel adapter).
 *
 * Each member is provided with an `enabled` flag, so a meter can be switched on
 * or off per environment without restructuring the group:
 *
 * @example
 * ```ts
 * const cluster = await connect(connStr, {
 *   meter: new MeterGroup([
 *     { meter: new LoggingMeter() },
 *     { meter: new OtelMeter(otel), enabled: process.env.CI !== 'true' },
 *   ]),
 * });
 * ```
 *
 * Because it implements the SDK-agnostic {@link Meter} contract, it works with
 * both {@link @cbjsdev/cbjs} and the official `couchbase` SDK.
 *
 * @category Observability
 */
export class MeterGroup implements Meter {
  private readonly _meters: ReadonlyArray<Meter>;

  /**
   * Creates a meter that delegates to every enabled entry.
   *
   * @param entries - The member meters, evaluated in declaration order.
   *                  Entries whose `enabled` flag is `false` are dropped.
   */
  constructor(entries: ReadonlyArray<MeterGroupEntry>) {
    this._meters = entries
      .filter((entry) => entry.enabled ?? true)
      .map((entry) => entry.meter);
  }

  /**
   * The active (enabled) member meters, in declaration order.
   */
  get meters(): ReadonlyArray<Meter> {
    return this._meters;
  }

  /**
   * Gets a recorder from each member meter and returns a composite recorder that
   * forwards every value to all of them.
   *
   * @param name - The name of the recorder (typically operation name).
   * @param tags - Key-value pairs that categorize the metric.
   */
  valueRecorder(name: string, tags: Record<string, any>): ValueRecorder {
    return new MeterGroupValueRecorder(
      this._meters.map((meter) => meter.valueRecorder(name, tags))
    );
  }

  /**
   * Releases resources held by member meters that expose a `cleanup()` method
   * (such as the built-in logging meter). Errors raised by a member are
   * swallowed so shutdown always completes.
   */
  cleanup(): void {
    for (const meter of this._meters) {
      const maybeCleanable = meter as { cleanup?: () => void };
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
