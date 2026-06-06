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
import { describe, expect, it } from 'vitest';

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
  it('aggregates recorded values into a report keyed by service and operation', () => {
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

  it('returns the same recorder for the same service/operation pair', () => {
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

  it('returns null when nothing has been recorded', () => {
    const meter = new LoggingMeter(new CouchbaseLogger(new NoOpLogger()), 60_000);
    try {
      expect(meter.createReport()).toBeNull();
    } finally {
      meter.cleanup();
    }
  });

  it('throws a MeterError for an unknown service tag', () => {
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

  it('cleanup() stops the reporter without throwing', () => {
    const meter = new LoggingMeter(new CouchbaseLogger(new NoOpLogger()));
    expect(() => meter.cleanup()).not.toThrow();
  });
});
