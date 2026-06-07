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

import type {
  AttributeValue,
  RequestSpan,
  RequestTracer,
  SpanStatus,
  TimeInput,
} from '../types/observability.types.js';
import { TracerGroup } from './TracerGroup.js';

class FakeSpan implements RequestSpan {
  readonly attributes: Array<[string, AttributeValue]> = [];
  readonly events: Array<[string, TimeInput | undefined]> = [];
  readonly statuses: SpanStatus[] = [];
  ended = false;
  endTime: TimeInput | undefined;

  constructor(
    readonly name: string,
    readonly tracer: FakeTracer,
    readonly parent: RequestSpan | undefined,
    readonly startTime: TimeInput | undefined
  ) {}

  setAttribute(key: string, value: AttributeValue): void {
    this.attributes.push([key, value]);
  }

  addEvent(key: string, startTime?: TimeInput): void {
    this.events.push([key, startTime]);
  }

  setStatus(status: SpanStatus): void {
    this.statuses.push(status);
  }

  end(endTime?: TimeInput): void {
    this.ended = true;
    this.endTime = endTime;
  }
}

class FakeTracer implements RequestTracer {
  readonly spans: FakeSpan[] = [];
  cleanedUp = 0;

  requestSpan(
    name: string,
    parentSpan?: RequestSpan,
    startTime?: TimeInput
  ): RequestSpan {
    const span = new FakeSpan(name, this, parentSpan, startTime);
    this.spans.push(span);
    return span;
  }

  cleanup(): void {
    this.cleanedUp++;
  }
}

describe('TracerGroup', () => {
  test('delegates requestSpan to every enabled member', ({ expect }) => {
    const t1 = new FakeTracer();
    const t2 = new FakeTracer();
    const t3 = new FakeTracer();

    const group = new TracerGroup([
      { tracer: t1 },
      { tracer: t2, enabled: false },
      { tracer: t3, enabled: true },
    ]);

    expect(group.tracers).toEqual([t1, t3]);

    group.requestSpan('op');

    expect(t1.spans).toHaveLength(1);
    expect(t3.spans).toHaveLength(1);
    expect(t2.spans).toHaveLength(0);
    expect(t1.spans[0].name).toBe('op');
  });

  test('omitted enabled flag defaults to enabled', ({ expect }) => {
    const t1 = new FakeTracer();
    const group = new TracerGroup([{ tracer: t1 }]);
    expect(group.tracers).toEqual([t1]);
  });

  test('the composite span fans out to every member span', ({ expect }) => {
    const t1 = new FakeTracer();
    const t2 = new FakeTracer();
    const group = new TracerGroup([{ tracer: t1 }, { tracer: t2 }]);

    const span = group.requestSpan('op');
    expect(span.name).toBe('op');

    span.setAttribute('db.system.name', 'couchbase');
    span.addEvent('evt', 42);
    span.setStatus({ code: 1 });
    span.end(123);

    for (const tracer of [t1, t2]) {
      const member = tracer.spans[0];
      expect(member.attributes).toEqual([['db.system.name', 'couchbase']]);
      expect(member.events).toEqual([['evt', 42]]);
      expect(member.statuses).toEqual([{ code: 1 }]);
      expect(member.ended).toBe(true);
      expect(member.endTime).toBe(123);
    }
  });

  test('hands each member tracer back its own span as parent', ({ expect }) => {
    const t1 = new FakeTracer();
    const t2 = new FakeTracer();
    const group = new TracerGroup([{ tracer: t1 }, { tracer: t2 }]);

    const parent = group.requestSpan('parent');
    group.requestSpan('child', parent);

    // Each tracer created [parent, child]; the child's parent must be the SAME
    // tracer's parent span — not the composite, and not the other tracer's span.
    expect(t1.spans[1].parent).toBe(t1.spans[0]);
    expect(t2.spans[1].parent).toBe(t2.spans[0]);
    expect(t1.spans[1].parent).not.toBe(t2.spans[0]);
    expect(t1.spans[1].parent).not.toBe(parent);
  });

  test('forwards a foreign parent span to every member as-is', ({ expect }) => {
    const t1 = new FakeTracer();
    const t2 = new FakeTracer();
    const group = new TracerGroup([{ tracer: t1 }, { tracer: t2 }]);

    const foreignParent = new FakeTracer().requestSpan('foreign');
    group.requestSpan('child', foreignParent);

    expect(t1.spans[0].parent).toBe(foreignParent);
    expect(t2.spans[0].parent).toBe(foreignParent);
  });

  test('an empty group yields a no-op composite span', ({ expect }) => {
    const group = new TracerGroup([]);
    expect(group.tracers).toEqual([]);

    const span = group.requestSpan('op');
    expect(() => {
      span.setAttribute('k', 'v');
      span.addEvent('e');
      span.setStatus({ code: 0 });
      span.end();
    }).not.toThrow();
  });

  test('cleanup fans out, skips members without it, and swallows errors', ({
    expect,
  }) => {
    const t1 = new FakeTracer();
    const noCleanup: RequestTracer = {
      requestSpan: (name) => new FakeTracer().requestSpan(name),
    };
    const throwing = new FakeTracer();
    throwing.cleanup = () => {
      throw new Error('boom');
    };

    const group = new TracerGroup([
      { tracer: t1 },
      { tracer: noCleanup },
      { tracer: throwing },
    ]);

    expect(() => group.cleanup()).not.toThrow();
    expect(t1.cleanedUp).toBe(1);
  });
});
