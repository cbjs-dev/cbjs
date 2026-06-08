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
import { describe, test } from 'vitest';

import type { Meter, ValueRecorder } from '../types/observability.types.js';
import { MeterGroup } from './MeterGroup.js';

class FakeRecorder implements ValueRecorder {
  readonly values: number[] = [];
  recordValue(value: number): void {
    this.values.push(value);
  }
}

class FakeMeter implements Meter {
  readonly recorders: Array<{
    name: string;
    tags: Record<string, any>;
    recorder: FakeRecorder;
  }> = [];
  cleanedUp = 0;

  valueRecorder(name: string, tags: Record<string, any>): ValueRecorder {
    const recorder = new FakeRecorder();
    this.recorders.push({ name, tags, recorder });
    return recorder;
  }

  cleanup(): void {
    this.cleanedUp++;
  }
}

describe('MeterGroup', () => {
  test('delegates valueRecorder to every enabled member', ({ expect }) => {
    const m1 = new FakeMeter();
    const m2 = new FakeMeter();
    const m3 = new FakeMeter();

    const group = new MeterGroup([
      { meter: m1 },
      { meter: m2, enabled: false },
      { meter: m3, enabled: true },
    ]);

    expect(group.meters).toEqual([m1, m3]);

    group.valueRecorder('db.client.operation.duration', { service: 'kv' });

    expect(m1.recorders).toHaveLength(1);
    expect(m3.recorders).toHaveLength(1);
    expect(m2.recorders).toHaveLength(0);
    expect(m1.recorders[0].name).toBe('db.client.operation.duration');
    expect(m1.recorders[0].tags).toEqual({ service: 'kv' });
  });

  test('the composite recorder forwards every value to all members', ({ expect }) => {
    const m1 = new FakeMeter();
    const m2 = new FakeMeter();
    const group = new MeterGroup([{ meter: m1 }, { meter: m2 }]);

    const recorder = group.valueRecorder('op', { service: 'query' });
    recorder.recordValue(5);
    recorder.recordValue(9);

    expect(m1.recorders[0].recorder.values).toEqual([5, 9]);
    expect(m2.recorders[0].recorder.values).toEqual([5, 9]);
  });

  test('omitted enabled flag defaults to enabled', ({ expect }) => {
    const m1 = new FakeMeter();
    const group = new MeterGroup([{ meter: m1 }]);
    expect(group.meters).toEqual([m1]);
  });

  test('an empty group yields a no-op recorder', ({ expect }) => {
    const group = new MeterGroup([]);
    expect(group.meters).toEqual([]);

    const recorder = group.valueRecorder('op', {});
    expect(() => recorder.recordValue(1)).not.toThrow();
  });

  test('cleanup fans out, skips members without it, and swallows errors', ({
    expect,
  }) => {
    const m1 = new FakeMeter();
    const noCleanup: Meter = {
      valueRecorder: () => new FakeRecorder(),
    };
    const throwing = new FakeMeter();
    throwing.cleanup = () => {
      throw new Error('boom');
    };

    const group = new MeterGroup([
      { meter: m1 },
      { meter: noCleanup },
      { meter: throwing },
    ]);

    expect(() => group.cleanup()).not.toThrow();
    expect(m1.cleanedUp).toBe(1);
  });
});
