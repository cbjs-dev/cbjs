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

// Compile-time proof that the adapter is usable with the OFFICIAL `couchbase`
// SDK (not just @cbjsdev/cbjs). `couchbase` is a devDependency used for types
// only — it is never imported by the shipped adapter. If the official SDK's
// tracer contract ever diverges from @cbjsdev/shared, this file fails to compile.
import type {
  ConnectOptions as OfficialConnectOptions,
  Meter as OfficialMeter,
  RequestSpan as OfficialRequestSpan,
  RequestTracer as OfficialRequestTracer,
} from 'couchbase';
import { describe, expectTypeOf, it } from 'vitest';

import type {
  RequestTracer as SharedRequestTracer,
  ValueRecorder as SharedValueRecorder,
} from '@cbjsdev/shared';

import {
  SentryRequestSpan,
  SentryRequestTracer,
  type SentryTracingApi,
} from './sentryTracer.js';

const anySentry = {} as SentryTracingApi;

describe('official couchbase SDK compatibility', () => {
  it('SentryRequestTracer is a valid official-SDK RequestTracer', () => {
    // Direct assignment is the real proof — this line does not compile unless
    // SentryRequestTracer structurally satisfies the official RequestTracer.
    const tracer: OfficialRequestTracer = new SentryRequestTracer(anySentry);
    void tracer;

    expectTypeOf<SentryRequestTracer>().toMatchTypeOf<OfficialRequestTracer>();
    expectTypeOf<SentryRequestSpan>().toMatchTypeOf<OfficialRequestSpan>();
  });

  it('is accepted as the `tracer` option of the official connect()', () => {
    const options: OfficialConnectOptions = {
      tracer: new SentryRequestTracer(anySentry),
    };
    void options;

    expectTypeOf<SentryRequestTracer>().toMatchTypeOf<
      NonNullable<OfficialConnectOptions['tracer']>
    >();
  });

  it('the official and shared tracer contracts are interchangeable', () => {
    // Mutual assignability ⇒ the two SDKs expose the same tracer contract, so an
    // adapter written against @cbjsdev/shared works with either SDK.
    expectTypeOf<OfficialRequestTracer>().toMatchTypeOf<SharedRequestTracer>();
    expectTypeOf<SharedRequestTracer>().toMatchTypeOf<OfficialRequestTracer>();
    expectTypeOf<OfficialMeter['valueRecorder']>().returns.toMatchTypeOf<SharedValueRecorder>();
  });
});
