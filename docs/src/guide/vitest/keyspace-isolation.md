---
title: Keyspace Isolation | Guide
---

# Keyspace Isolation

When writing integration tests with Couchbase, or any database for that matter, you cannot run your tests concurrently without risking to pollute the data of the other tests.
Even without concurrency you have to be careful to delete the data you created during the test.

To solve that, Cbjs brings keyspace isolation. For each isolation scope, a _keyspace realm_ is created, providing complete isolation between your tests.

## Isolation Scope

A keyspace realm can be shared for all the tests in suites, or be exclusive to each test. You can also share a realm between all suites within the current suite.

`'per-suite'`: the realm is shared by all tests in a suite, but each suite have their own realm.
`'per-test'`: the realm is exclusive to each test.
`'local'`: the realm is shared by this suite and all its children.
`false`: no isolation will be provided.

:::note The realm scope is inherited by children suites. Defining `per-suite` or `per-test` in a suite means all children tasks will apply this logic.

## Isolation Level
By default a bucket can be host of several realms. Since each realm have their own boundaries, this approach works in most cases. This is the default, `collection` isolation level.

Sometimes you really need dedicated buckets just for this test or suite, not shared at all with other realms. When this is the case, use the bucket isolation level and each isolation will be affected to an exclusive bucket.  
Be sure to understand that if the isolation scope is `per-suite` for example, the realm and therefore the bucket will still be shared between all the tests of the suite, but they will not host any other realms.

## Example

```ts
import { DocumentNotFoundError } from '@cbjsdev/cbjs';
import { setKeyspaceIsolation } from '@cbjsdev/vitest';

describe('keyspace isolation example', { timeout: 30_000 }, () => {
  beforeAll(() => {
    setKeyspaceIsolation('per-test');
  });

  it('is an isolated test', async ({ expect, getCluster }) => {
    const cluster = await getCluster();
    const collection = cluster.bucket('store').scope('library').collection('books');
    await collection.insert('docKey', {
      title: 'insert',
    });

    const { content } = await collection.get('docKey');

    expect(content).toEqual({ title: 'insert' });
  });

  it('will not see data from the other test', async ({ getCluster, expect }) => {
    const cluster = await getCluster();
    await expect(
      cluster.bucket('store').scope('library').collection('books').get('docKey')
    ).rejects.toThrowError(DocumentNotFoundError);
  });
});
```

:::warning All calls to `setKeyspaceIsolation` must be done inside a hook `beforeAll`.

## Setup

::: code-group

```bash [npm]
npm install @cbjsdev/vitest
```

```bash [yarn]
yarn add @cbjsdev/vitest
```

```bash [pnpm]
pnpm add @cbjsdev/vitest
```

```bash [bun]
bun add @cbjsdev/vitest
```

Then, all you need to do is to use the Cbjs test runner for your tests :

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    runner: '@cbjsdev/vitest/runner'
  },
});
```

That's it, you're done. You can start using Cbjs keyspace isolation.

## How it works

The `Cluster` prototype is mocked and proxified by the Cbjs test runner. Then, any call will be intercepted and the keyspace identified. Following that, a bucket/scope/collection is allocated to the realm and the keyspace inside the call is swapped for the actual bucket/scope/collection.
If no bucket/scope/collection is available, a new one is created.
