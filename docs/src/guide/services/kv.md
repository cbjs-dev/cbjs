---
title: KeyValue Service | Guide
outline: [2, 3]
---

# KeyValue Service

The KV service allow you to perform atomic operations on the documents of a collection.  
Learn more about more mechanisms like durability or locks in the [advanced mechanisms](/guide/services/kv-advanced) page.

```ts
const cluster = connect('couchbase://localhost');

const collection = cluster.bucket('store').scope('library').collection('books');
```

## Retrieving a document

Use `Collection.get` to fetch a document from the database.

```ts
const result = await collection.get('docKey');
```

If the target bucket have replicas, you may want to fetch the document from a replica instead of the master bucket.  
By doing this you will be able to fetch the document in case of node failure, before the rebalance is complete.

::: warning
Since the document may come from a replica, its content may be stale.
:::

```ts
const result = await collection.getAnyReplica('docKey');
```

And if you want to see all the copies of the document :

```ts
const resultAllReplicas = await collection.getAllReplicas('docKey');
```

For each of these operations you can specify some options.

```ts
const result = await collection.get('docKey', {
  timeout: 80, // milliseconds
  withExpiry: true, // also fetch when the document expires, if ever
});
```

### Sub-document retrieval

You may not be interested in the entire document. In that case you can use the `lookupIn` method to only retrieve some parts of the document.  
You can `get` a property, check if a property `exists` and `count` the number of elements in an array or the number of keys an object has.

```ts
import { LookupInSpec } from '@cbjsdev/cbjs';

const result = await collection.lookupIn('docKey', [
  LookupInSpec.get('title'),
  LookupInSpec.exists('lastModifiedBy'),
  LookupInSpec.count('metadata.tags'),
]);
```

For this operation, only the `timeout` option is available.

If you have opt-in for the [cluster types](/guide/cluster-types) on the targeted collection, the paths will be type checked and the result will be typed accordingly.

#### Chainable sub-doc operations

Cbjs introduce the ability to chain sub-doc operations. Using this syntax also enables path autocompletion :

```ts
import { LookupInSpec } from '@cbjsdev/cbjs';

const { content } = await collection
  .lookupIn('docKey')
  .get('title')
  .exists('lastModifiedBy')
  .count('metadata.tags');
```

#### Error handling

During a `lookupIn`, the function will not throw if the error is related to a `LookupInSpec`. Instead, the result will include the error, and the value will be `undefined`.

```ts
const { content } = await collection
  .lookupIn('docKey')
  .get('lastModifiedAt')
  .get('comments'); // missing property

const [
  lastModifiedAt, // { value: number; error: null }
  comments, // { value: undefined; error: PathNotFoundError }
] = content;
```

::: warning
Be careful when checking for error, as the `error` property is null when the operation succeeds, but the value is `undefined` when the operation fails.
:::

## Writing a document

There are several way to write a document into Couchbase, depending on the behaviour you want.  
You can use `Collection.insert`, `Collection.upsert`, `Collection.replace` or `Collection.remove`.  
Inserting will fail if the document already exists, upserting will succeed regardless.  
Replacing or removing a document that does not exist will fail.

```ts
await collection.insert(
  'docKey',
  { title: 'Hello' },
  {
    expiry: 45, // the doc will expire in 45 seconds
    timeout: 300,
  }
);
```

::: tip
When upserting, if any expiry time has been set on the document, it will be removed.  
If you don't want that, use the `preserveExpiry` option.  
The expiry time will then be reset, just like when using `Collection.touch`.
:::

### Sub-document mutation

If you want to modify some parts of the documents, as opposed to the whole document, you can mutate only those parts.

```ts
await collection
  .mutateIn('docKey')
  .replace('title', 'New title')
  .replace('lastUpdatedTime', Date.now());
```

One of the key advantages of sub-document mutation is being able to perform an operation that do not conflict with concurrent ones.  
Learn more about [optimistic locking](/guide/services/kv-advanced).

```ts
// The mutation will not overwrite any concurrent changes
await collection.mutateIn('book::001').arrayAddUnique('metadata.tags', 'history');
```

#### Error handling

The whole `mutateIn` operation will fail if any of the mutations fail. There is no partial mutation.
