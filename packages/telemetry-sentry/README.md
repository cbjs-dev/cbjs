<h1 align="center">@cbjsdev/telemetry-sentry</h1>

<p align="center">
See your Couchbase operations in <a href="https://sentry.io">Sentry</a> — straight from <a href="https://cbjs.dev">Cbjs</a>.
</p>

<p align="center">
 <a href="https://www.npmjs.com/package/@cbjsdev/telemetry-sentry"><img src="https://img.shields.io/npm/v/@cbjsdev/telemetry-sentry?label=telemetry-sentry" /></a>
</p>

Cbjs already traces every Couchbase operation. This package turns those traces
into Sentry spans, so a slow `get` or a failing query shows up in your Sentry
performance view — tagged with the bucket, scope, collection, durability and
operation, and nested right under the request that triggered it.

There's nothing new to learn: you hand Cbjs one tracer when you connect, and
carry on writing the same code.

## Getting started

```bash
npm install @cbjsdev/telemetry-sentry @sentry/node
```

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

That's the whole setup. Every KV and query operation now produces a Sentry span.

## Spans where you expect them

Wrap your work in a Sentry span and your Couchbase calls nest underneath it
automatically — no `parentSpan` plumbing required:

```ts
const airlines = cluster.bucket('travel').scope('inventory').collection('airline');

await Sentry.startSpan({ name: 'checkout' }, async () => {
  await airlines.get('airline_10'); // appears as a child "get" span
});
```

Each span carries the operation's context — service, bucket, scope, collection,
durability — and its outcome: a failed `get` is reported as an **errored** span,
so it stands out in Sentry instead of hiding inside a generic request. When you
*do* want to attach a Couchbase call to a span you created yourself, every
operation accepts a `parentSpan` option.

## Lightweight by design

The adapter has no runtime dependencies and never pulls a native binary — at
runtime it does nothing but create Sentry spans.

> **Using the official SDK?** It works there too — the tracer contract is the
> same, so `new SentryRequestTracer(Sentry)` drops straight into the official
> `couchbase` client's `connect({ tracer })`.

## License

Released under the Apache 2.0 license.
