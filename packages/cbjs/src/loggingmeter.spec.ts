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
import { describe, it } from 'vitest';

import { MeterError } from './errors.js';
import { CouchbaseLogger, NoOpLogger } from './logger.js';
import { LoggingMeter } from './loggingmeter.js';
import { OpAttributeName, ServiceName } from './observabilitytypes.js';

function kvTags(operation: string): Record<string, string> {
  return {
    [OpAttributeName.SystemName]: 'couchbase',
    [OpAttributeName.Service]: ServiceName.KeyValue,
    [OpAttributeName.OperationName]: operation,
  };
}

describe('LoggingMeter', () => {
  it('aggregates recorded values into a report keyed by service and operation', ({
    expect,
  }) => {
    const meter = new LoggingMeter(new CouchbaseLogger(new NoOpLogger()), 60_000);

    try {
      const recorder = meter.valueRecorder(
        OpAttributeName.MeterNameOpDuration,
        kvTags('get')
      );
      recorder.recordValue(100);
      recorder.recordValue(200);

      const report = meter.createReport();
      expect(report).not.toBeNull();
      expect(report!.operations[ServiceName.KeyValue].get.total_count).toBe(2);
    } finally {
      meter.cleanup();
    }
  });

  it('includes the percentile latencies and emit interval in the report', ({
    expect,
  }) => {
    const meter = new LoggingMeter(new CouchbaseLogger(new NoOpLogger()), 60_000);

    try {
      const recorder = meter.valueRecorder(
        OpAttributeName.MeterNameOpDuration,
        kvTags('get')
      );
      recorder.recordValue(100);
      recorder.recordValue(200);
      recorder.recordValue(300);

      const report = meter.createReport();
      expect(report).not.toBeNull();
      // emit_interval_s is the configured interval expressed in seconds.
      expect(report!.meta.emit_interval_s).toBe(60);

      const getReport = report!.operations[ServiceName.KeyValue].get;
      expect(getReport.total_count).toBe(3);
      // The HDR histogram exposes the standard percentile buckets.
      expect(new Set(Object.keys(getReport.percentiles_us))).toEqual(
        new Set(['50', '90', '99', '99.9', '100'])
      );
      expect(getReport.percentiles_us['100']).toBeGreaterThanOrEqual(300);
    } finally {
      meter.cleanup();
    }
  });

  it('resets its histograms after each report so samples are not double-counted', ({
    expect,
  }) => {
    const meter = new LoggingMeter(new CouchbaseLogger(new NoOpLogger()), 60_000);

    try {
      meter
        .valueRecorder(OpAttributeName.MeterNameOpDuration, kvTags('get'))
        .recordValue(100);

      expect(meter.createReport()).not.toBeNull();
      // The periodic reporter emits on a timer; if histograms were not reset a
      // single slow op would be re-reported on every tick, inflating dashboards.
      expect(meter.createReport()).toBeNull();
    } finally {
      meter.cleanup();
    }
  });

  it('keeps each service in its own section of the report', ({ expect }) => {
    const meter = new LoggingMeter(new CouchbaseLogger(new NoOpLogger()), 60_000);

    try {
      meter
        .valueRecorder(OpAttributeName.MeterNameOpDuration, kvTags('get'))
        .recordValue(100);
      meter
        .valueRecorder(OpAttributeName.MeterNameOpDuration, {
          [OpAttributeName.SystemName]: 'couchbase',
          [OpAttributeName.Service]: ServiceName.Query,
          [OpAttributeName.OperationName]: 'query',
        })
        .recordValue(2000);

      const report = meter.createReport();
      expect(report).not.toBeNull();
      expect(report!.operations[ServiceName.KeyValue].get.total_count).toBe(1);
      expect(report!.operations[ServiceName.Query].query.total_count).toBe(1);
    } finally {
      meter.cleanup();
    }
  });

  it('returns the same recorder for the same service/operation pair', ({ expect }) => {
    const meter = new LoggingMeter(new CouchbaseLogger(new NoOpLogger()), 60_000);

    try {
      const a = meter.valueRecorder(
        OpAttributeName.MeterNameOpDuration,
        kvTags('upsert')
      );
      const b = meter.valueRecorder(
        OpAttributeName.MeterNameOpDuration,
        kvTags('upsert')
      );
      expect(a).toBe(b);
    } finally {
      meter.cleanup();
    }
  });

  it('returns null when nothing has been recorded', ({ expect }) => {
    const meter = new LoggingMeter(new CouchbaseLogger(new NoOpLogger()), 60_000);
    try {
      expect(meter.createReport()).toBeNull();
    } finally {
      meter.cleanup();
    }
  });

  it('throws a MeterError for an unknown service tag', ({ expect }) => {
    const meter = new LoggingMeter(new CouchbaseLogger(new NoOpLogger()), 60_000);
    try {
      expect(() =>
        meter.valueRecorder(OpAttributeName.MeterNameOpDuration, {
          [OpAttributeName.Service]: 'not-a-service',
          [OpAttributeName.OperationName]: 'get',
        })
      ).toThrow(MeterError);
    } finally {
      meter.cleanup();
    }
  });

  it('cleanup() stops the reporter without throwing', ({ expect }) => {
    const meter = new LoggingMeter(new CouchbaseLogger(new NoOpLogger()));
    expect(() => meter.cleanup()).not.toThrow();
  });
});
