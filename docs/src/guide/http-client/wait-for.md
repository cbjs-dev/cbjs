---
title: Wait For - Couchbase HTTP Client
outline: [2, 3]
---

# Wait For

This section is dedicated to functions that waits for a resource to reach a certain status.  
The wait functions use `ts-retry-promise` under the hood and accept the same options, as described by the following type :

```ts twoslash
type WaitForOptions = {
  expectMissing?: boolean;
  
  // ts-retry-promise options
  retries: number | "INFINITELY";
  delay: number;
  until: (t: any) => boolean;
  logger: (msg: string) => void;
  timeout: number | "INFINITELY";
  backoff: "FIXED" | "EXPONENTIAL" | "LINEAR" | ((attempt: number, delay: number) => number);
  maxBackOff: number;
  retryIf: (error: any) => boolean;
};
```

The option `expectMissing` basically negates the expectation.
If you need a function that is missing, please open [an issue](https://github.com/cbjs-dev/cbjs/issues).

::: tip
The `waitFor` functions check the status on every node of the cluster !
:::

## Functions

### waitForBucket
Wait for the bucket to be visible but also ready to receive KV & query operations.

```ts twoslash
import { CouchbaseHttpApiConfig, WaitForOptions } from '@cbjsdev/http-client';
// ---cut-before---
declare function waitForBucket(
  apiConfig: CouchbaseHttpApiConfig, 
  bucketName: string, 
  options?: WaitForOptions
): Promise<void>;
```

### waitForScope
Wait for the scope to be visible.

```ts twoslash
import { CouchbaseHttpApiConfig, WaitForOptions } from '@cbjsdev/http-client';
// ---cut-before---
export declare function waitForScope(
  params: CouchbaseHttpApiConfig, 
  bucketName: string, 
  scopeName: string, 
  options?: WaitForOptions
): Promise<void>;
```

### waitForCollection
Wait for the scope to be visible.

```ts twoslash
import { CouchbaseHttpApiConfig, WaitForOptions } from '@cbjsdev/http-client';
// ---cut-before---
declare function waitForCollection(
  params: CouchbaseHttpApiConfig, 
  bucketName: string, 
  scopeName: string, 
  collectionName: string, 
  options?: WaitForOptions
): Promise<void>;
```

### waitForEventingFunction
Wait for the eventing function to be visible. 
Additionally, you can pass a status to wait for the function to reach that status.

```ts twoslash
import { CouchbaseHttpApiConfig, WaitForOptions, ExpectableStatus } from '@cbjsdev/http-client';
// ---cut-before---
declare function waitForEventingFunction(
  params: CouchbaseHttpApiConfig, 
  functionName: string, 
  options?: WaitForOptions
): Promise<void>;
declare function waitForEventingFunction(
  params: CouchbaseHttpApiConfig, 
  functionName: string, 
  status: ExpectableStatus, 
  options?: WaitForOptions
): Promise<void>;
```

### waitForQueryIndexer
Wait for the Couchbase indexer to be online.   
This is required for you to set query indexer settings.

```ts twoslash
import { CouchbaseHttpApiConfig, WaitForOptions } from '@cbjsdev/http-client';
// ---cut-before---
declare function waitForQueryIndexer(
  apiConfig: CouchbaseHttpApiConfig, 
  options?: Omit<WaitForOptions, 'expectMissing'>
): Promise<void>;
```

### waitForQueryIndex
Wait for the query index to be visible by the query service and wait until no mutations are remaining.  
You can opt-out waiting for mutations by passing `{ awaitMutations: false }`.

```ts twoslash
import { CouchbaseHttpApiConfig, WaitForOptions, WaitForQueryIndexOptions, Keyspace } from '@cbjsdev/http-client';
// ---cut-before---
declare function waitForQueryIndex(
  apiConfig: CouchbaseHttpApiConfig, 
  indexName: string, 
  keyspace: Keyspace, 
  options?: WaitForQueryIndexOptions
): Promise<void>;
```

### waitForSearchIndex
Wait for the search index to be visible, built, and **queryable**.

By default it waits for three things in order:

1. the index definition to be **visible** to the search query service ;
2. the index to be **built** (`state: 'online'`), unless you pass `{ awaitMutations: false }` ;
3. the index to be **queryable** — every pindex hosted and available — unless you pass `{ awaitQueryVisibility: false }`.

::: warning Why the queryability gate matters
An index can be reported as `online` while its pindexes are still being planned or built. During that window any query fails with `pindex not available`. Waiting only for `online` therefore lets a query race ahead of its pindexes — an intermittent failure that surfaces under load (e.g. a single-node cluster building many indexes at once).

To close that race, `waitForSearchIndex` probes [`getSearchIndexCount`](./actions#getsearchindexcount), whose endpoint only answers `200` once every pindex is available. Pass `{ awaitQueryVisibility: false }` to opt out and return as soon as the definition is visible.
:::

```ts twoslash
import { CouchbaseHttpApiConfig, WaitForOptions, WaitForSearchIndexOptions, Keyspace } from '@cbjsdev/http-client';
// ---cut-before---
export declare function waitForSearchIndex(
  apiConfig: CouchbaseHttpApiConfig, 
  indexName: string, 
  keyspace: Partial<Keyspace>, 
  options?: WaitForSearchIndexOptions
): Promise<void>;
export declare function waitForSearchIndex(
  apiConfig: CouchbaseHttpApiConfig, 
  indexName: string, 
  options?: WaitForSearchIndexOptions
): Promise<void>;
```

`WaitForSearchIndexOptions` extends `WaitForOptions` with:

```ts twoslash
type WaitForSearchIndexOptions = {
  /**
   * Wait for the index to have been built (`state: 'online'`).
   * @default true
   */
  awaitMutations?: boolean;

  /**
   * Wait for the index to be queryable, i.e. all of its pindexes are hosted
   * and available. Set to `false` to return as soon as the index definition
   * is visible, without waiting for it to become queryable.
   * @default true
   */
  awaitQueryVisibility?: boolean;
};
```

### waitForUser
Wait for the user to be visible.
You can filter by domain if you want, the default domain is `local`.

```ts twoslash
import { CouchbaseHttpApiConfig, WaitForOptions } from '@cbjsdev/http-client';
// ---cut-before---
declare function waitForUser(
  apiConfig: CouchbaseHttpApiConfig, 
  username: string, 
  domain?: string, 
  options?: WaitForOptions
): Promise<void>;
```

### waitForUserGroup
Wait for the user group to be visible.

```ts twoslash
import { CouchbaseHttpApiConfig, WaitForOptions } from '@cbjsdev/http-client';
// ---cut-before---
declare function waitForUserGroup(
  apiConfig: CouchbaseHttpApiConfig, 
  name: string, 
  options?: WaitForOptions
): Promise<void>;
```

### waitForViewDesignDocument
Wait for the design document to be visible.

```ts twoslash
import { CouchbaseHttpApiConfig, WaitForOptions } from '@cbjsdev/http-client';
// ---cut-before---
declare function waitForViewDesignDocument(
  params: CouchbaseHttpApiConfig, 
  bucketName: string, 
  designDocumentName: string, 
  options?: WaitForOptions
): Promise<void>;
```


### waitForAnalyticsCluster
Wait for the analytics cluster to be online.

```ts twoslash
import { CouchbaseHttpApiConfig, WaitForOptions } from '@cbjsdev/http-client';
// ---cut-before---
declare function waitForAnalyticsCluster(
  apiConfig: CouchbaseHttpApiConfig, 
  options?: WaitForOptions
): Promise<void>;
```