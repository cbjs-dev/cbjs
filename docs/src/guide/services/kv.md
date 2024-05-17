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

#### Throw on spec error

Each sub-document spec may fail individually. For this reason, the operation may return a result to you but filled with errors. You can see below that `bookTitle` contains a union type, forcing you to check the error for each sub-doc operation.

```ts twoslash
import { connect, DocDef, ClusterTypes } from '@cbjsdev/cbjs';

type MyClusterTypes = ClusterTypes<{
  store: {
    library: {
      books: [
        DocDef<`book::${string}`, { title: string; authors: string[] }>,
      ]
    };
  };
}>;

const cluster = await connect<MyClusterTypes>('...');
const collection = cluster.bucket('store').scope('library').collection('books');

// ---cut-before---
const { content: [bookTitle, book3rdAuthor] } = 
  await collection.lookupIn('book::001').get('title').get('authors[2]');

if (bookTitle.error !== null || book3rdAuthor.error !== null) {
  // handle the errors
}
```

Because this is annoying and because you often need all the data in order to proceed, Cbjs provides an additional option when performing the request : `throwOnSpecError`.
Using that option, the whole operation will fail if any spec led to an error. This frees you from checking each individual result. 

```ts twoslash
import { connect, DocDef, ClusterTypes } from '@cbjsdev/cbjs';

type MyClusterTypes = ClusterTypes<{
  store: {
    library: {
      books: [
        DocDef<`book::${string}`, { title: string; authors: string[] }>,
      ]
    };
  };
}>;

const cluster = await connect<MyClusterTypes>('...');
const collection = cluster.bucket('store').scope('library').collection('books');

// ---cut-before---
const { content: [bookTitle, book3rdAuthor] } = await collection
  .lookupIn('book::001', { throwOnSpecError: true })
  .get('title')
  .get('authors[2]');

// Look at the type of `bookTitle` and `book3rdAuthor`. No more union.
// If either `title` or `authors[2]` don't exist at runtime, it will throw an error, so this is type safe.
```

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

::: info
When using the classic lookupIn, the request is executed immediately, regardless of it being awaited or not.
Chained lookup will only trigger the request once awaited or `.then()` is called on it.
:::

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

## Transactions

To perform an ACID transaction with Couchbase, you need to perform the following :

```ts twoslash
import { connect } from '@cbjsdev/cbjs';
const cluster = await connect('...');
// ---cut-before---
cluster.transactions().run(async ctx => {
  const collection = cluster.bucket('storey').scope('library').collection('books')
  const result = await ctx.get(collection, 'book::001');
});
```

::: tip
Cbjs also exposes `ctx.exists`, which is missing in the official library.
:::

To offer a more consistent experience, Cbjs gives you the following, alternative API :

```ts twoslash
import { connect } from '@cbjsdev/cbjs';
const cluster = await connect('...');
// ---cut-before---
cluster.transactions().run(async ctx => {
  const collection = ctx.bucket('storey').scope('library').collection('books')
  const { content } = await collection.get('book::001');
});
```
