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
Wait for the query index to be visible by the query service and wait until no mutations are remaining.  
You can opt-out waiting for mutations by passing `{ awaitMutations: false }`.  
You can opt-in waiting for the search index to be visible by the query service by passing `{ awaitQueryVisibility: true }`.

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