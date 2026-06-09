---
title: Observability | Guide
outline: [2, 3]
---

# Observability

Observability lets you see how your Couchbase operations behave — how long each one takes and whether it succeeded — and feed that into the stack you already run.

Two hooks do the work, and both are connection options:

- a **tracer** (`tracer`) — produces one span per operation;
- a **meter** (`meter`) — records each operation's latency.

Pass your own, compose several with `TracerGroup` / `MeterGroup`, drop in a ready-made adapter, or lean on the built-in pair.

::: warning Coverage
Observability currently covers the **KeyValue** and **Query** services.  
Search, Analytics, Views, management operations, replica streaming and ready-made OpenTelemetry adapters are on the way.
:::

## Pick your setup

| You want… | Reach for |
|---|---|
| Built-in slow-op log + latency metrics | the **default** — [turn the logger on](#the-built-in-pair) |
| Traces or metrics in **your** backend | pass a [`tracer` / `meter`](#send-it-to-your-backend) |
| **Several** at once, or built-in **plus** your own, or a per-environment toggle | a [`TracerGroup` / `MeterGroup`](#combine-several-with-tracergroup-and-metergroup) |
| DB spans **nested automatically** under your app spans | a [telemetry adapter](#reporting-to-sentry) |

Everything below is a variation on those four.

## Send it to your backend

Pass a `tracer` that implements `RequestTracer`. Cbjs calls `requestSpan` for every operation; what a span does is up to you.

```ts twoslash
import { connect, type RequestSpan, type RequestTracer } from '@cbjsdev/cbjs';

class MyTracer implements RequestTracer {
  requestSpan(name: string): RequestSpan {
    // Forward to your backend. The span receives the operation's attributes,
    // its outcome via setStatus, then end.
    return {
      name,
      setAttribute() {},
      addEvent() {},
      setStatus() {},
      end() {},
    };
  }
}

const cluster = await connect('couchbase://localhost', {
  username: 'Administrator',
  password: 'password',
  tracer: new MyTracer(),
});
```

::: warning A tracer you pass replaces the built-in one
The threshold logger, its sampling and `tracingConfig` no longer apply — your tracer is the only one. To keep the built-in **and** add your own, [combine them](#combine-several-with-tracergroup-and-metergroup).
:::

Metrics work the same way and stay independent: pass a `meter` implementing `Meter`; its `valueRecorder(name, tags)` returns a `ValueRecorder` that receives each operation's latency. Set one side and leave the other, and the untouched side keeps its default.

::: tip
This is the same interface the official `couchbase` client uses — a tracer or meter you write (or install) works with both, unchanged.
:::

## Combine several with TracerGroup and MeterGroup

When one destination isn't enough — or you want the built-in **and** your own, or a backend that's on in production but off in CI — wrap them in a group. A group is itself a tracer, so it goes straight into `tracer`.

```ts twoslash
import {
  connect,
  TracerGroup,
  ThresholdLoggingTracer,
  type RequestTracer,
} from '@cbjsdev/cbjs';

declare const otelTracer: RequestTracer; // your backend, or an adapter
declare const enabledHere: boolean;
// ---cut-before---
const cluster = await connect('couchbase://localhost', {
  username: 'Administrator',
  password: 'password',
  tracer: new TracerGroup([
    { tracer: new ThresholdLoggingTracer() }, // keep the built-in
    { tracer: otelTracer, enabled: enabledHere }, // e.g. process.env.CI !== 'true'
  ]),
});
```

Each entry has an `enabled` flag (default `true`); flip it per environment and the disabled tracer is skipped entirely — no restructuring. Spans fan out to every enabled member, and a nested operation stays correctly parented inside **each** member, so the built-in threshold logger keeps working right alongside, say, an exporter.

`MeterGroup` mirrors it:

```ts twoslash
import { connect, MeterGroup, LoggingMeter, type Meter } from '@cbjsdev/cbjs';

declare const otelMeter: Meter;
declare const enabledHere: boolean;
// ---cut-before---
const cluster = await connect('couchbase://localhost', {
  username: 'Administrator',
  password: 'password',
  meter: new MeterGroup([
    { meter: new LoggingMeter() },
    { meter: otelMeter, enabled: enabledHere },
  ]),
});
```

### The built-in pair

The default tracer (`ThresholdLoggingTracer`) flags operations slower than a per-service threshold; the default meter (`LoggingMeter`) aggregates latency. They're ordinary implementations — name them explicitly to drop into a group, as above, or let cbjs create them for you when you pass neither.

Both report to the **SDK logger**, which is **off by default** — so out of the box their reports are built and dropped. Give the logger a destination to actually see them:

```ts twoslash
import { connect } from '@cbjsdev/cbjs';
// ---cut-before---
const cluster = await connect('couchbase://localhost', {
  username: 'Administrator',
  password: 'password',
  logger: console, // the built-in tracer & meter report here
});
```

Setting `CNLOGLEVEL` (e.g. `CNLOGLEVEL=info`) does the same without code.

## Nest operations under your own span

Every operation option carries an optional `parentSpan`. Pass a span you created and the operation's span attaches underneath it — so a `get` shows up nested inside the request that triggered it rather than floating on its own. This holds whether `tracer` is a single tracer or a group.

```ts twoslash
import { connect, DocDef, type RequestSpan } from '@cbjsdev/cbjs';

type MyClusterTypes = {
  store: {
    library: {
      books: [DocDef<`book::${string}`, { title: string; authors: string[] }>];
    };
  };
};

const cluster = await connect<MyClusterTypes>('...');
const collection = cluster.bucket('store').scope('library').collection('books');
declare const requestSpan: RequestSpan;
// ---cut-before---
await collection.get('book::001', { parentSpan: requestSpan });
```

If threading `parentSpan` through every call sounds tedious, an adapter that reads ambient context does it for you — next.

## Reporting to Sentry

[`@cbjsdev/telemetry-sentry`](https://www.npmjs.com/package/@cbjsdev/telemetry-sentry) is a ready-made tracer that turns every Couchbase operation into a [Sentry](https://sentry.io) span. A slow `get` or a failing query lands in your Sentry performance view, tagged with its context and nested under the request that triggered it.

::: code-group
```bash [npm]
npm install @cbjsdev/telemetry-sentry @sentry/node
```
```bash [yarn]
yarn add @cbjsdev/telemetry-sentry @sentry/node
```
```bash [pnpm]
pnpm add @cbjsdev/telemetry-sentry @sentry/node
```
```bash [bun]
bun add @cbjsdev/telemetry-sentry @sentry/node
```
:::

Hand the tracer to cbjs when you connect, and carry on writing the same code:

```ts
import { connect } from '@cbjsdev/cbjs';
import * as Sentry from '@sentry/node';
import { SentryRequestTracer } from '@cbjsdev/telemetry-sentry';

Sentry.init({ dsn: process.env.SENTRY_DSN, tracesSampleRate: 1 });

const cluster = await connect('couchbase://localhost', {
  username: 'Administrator',
  password: 'password',
  tracer: new SentryRequestTracer(Sentry),
});
```

Now wrap your work in a Sentry span and your Couchbase calls nest underneath it automatically — no `parentSpan` plumbing:

```ts
const collection = cluster.bucket('store').scope('library').collection('books');

await Sentry.startSpan({ name: 'checkout' }, async () => {
  await collection.get('book::001'); // appears as a child "get" span
});
```

A failed operation is reported as an **errored** span, so it stands out instead of hiding inside a generic request. The adapter has zero runtime dependencies and never pulls the native binary, and — since the interface is shared — the same tracer works with the official `couchbase` client too. Want it everywhere except tests? Drop it into a [`TracerGroup`](#combine-several-with-tracergroup-and-metergroup) with an `enabled` flag.

## How it works

The timing comes from Couchbase's C++ core, which cbjs binds to: for every operation the core reports when it started, how long each stage took, and how it ended. Cbjs turns that into a span for your tracer and a measurement for your meter.

Reporting stays off the hot path, so leaving the built-in pair on is cheap — a timing measurement per operation plus a periodic flush, **not** a log line per call. With your own tracer or meter, the cost (and destination) become whatever your implementation does per span.

## Tuning the built-in pair

If you only want to nudge the **built-in** tracer/meter — flag more operations, report more often — you don't have to construct them. Pass `tracingConfig` / `metricsConfig` on connect and cbjs builds the pair for you. This is the shorthand the official client uses.

```ts twoslash
import { connect } from '@cbjsdev/cbjs';
// ---cut-before---
const cluster = await connect('couchbase://localhost', {
  username: 'Administrator',
  password: 'password',
  tracingConfig: {
    kvThreshold: 200, // ms — flag KV ops slower than this (default: 500)
    queryThreshold: 500, // ms — flag queries slower than this (default: 1_000)
    sampleSize: 20, // slowest ops kept per service, per report (default: 10)
    emitInterval: 5_000, // ms between reports (default: 10_000)
  },
  metricsConfig: {
    emitInterval: 60_000, // ms between metrics reports (default: 600_000)
  },
});
```

These shape **what** the built-in tools capture and **how often** they flush — not **whether** you see it; that still needs the logger (above). They apply only to the built-in pair, so a `tracer` / `meter` you pass ignores them.

To switch a side off entirely:

```ts twoslash
import { connect } from '@cbjsdev/cbjs';
// ---cut-before---
const cluster = await connect('couchbase://localhost', {
  username: 'Administrator',
  password: 'password',
  tracingConfig: { enableTracing: false },
  metricsConfig: { enableMetrics: false },
});
```

## See which document, fields and values

By default a span identifies an operation **structurally** — service, bucket, scope, collection and operation name — but not the document key, the query parameters, the sub-document field paths, or the values a `mutateIn` writes. Those can be personal data or document content, so cbjs keeps them off spans unless you ask. Two opt-in flags reveal them.

`recordSubDocSpecs` adds the **sub-document paths** of every `lookupIn` / `mutateIn` as `couchbase.subdoc.specs` — so a span reads as the fields it touched instead of an opaque `lookup_in`. Paths are field names (`profile.email`), never values.

`recordRequestArguments` adds the **request arguments**: the document key (`couchbase.document.id`), the query parameters (`db.query.parameter.<n>`), and the values a `mutateIn` writes (`couchbase.subdoc.values`, index-aligned with the paths above — a value-less spec such as a `remove` keeps its slot as `null`). A read-only `lookupIn` has no values to record.

Record the paths alone with `recordSubDocSpecs`. The `mutateIn` values need **both**: a value is only meaningful next to the path it was written to, so `recordRequestArguments` on its own — with `recordSubDocSpecs` off — records neither the paths nor the values. The document key and query parameters it controls are unaffected.

::: warning These attributes can carry PII
Keys, parameters, paths and values are frequently sensitive — that's the whole reason they're opt-in. Turn them on only where your tracing backend is allowed to hold that data.
:::

For the **built-in** pair, set them on `tracingConfig`:

```ts twoslash
import { connect } from '@cbjsdev/cbjs';
// ---cut-before---
const cluster = await connect('couchbase://localhost', {
  username: 'Administrator',
  password: 'password',
  tracingConfig: {
    recordSubDocSpecs: true, // couchbase.subdoc.specs — which fields
    recordRequestArguments: true, // keys, query params, mutateIn values
  },
});
```

Both flags are **tracer-owned**, so a tracer you pass carries its own. The [Sentry adapter](#reporting-to-sentry) takes them through `SentryRequestTracerOptions` — `new SentryRequestTracer(Sentry, { recordSubDocSpecs: true })` — and a custom `RequestTracer` exposes them as `readonly recordSubDocSpecs` / `recordRequestArguments` members.
