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

### Option `throwIfMissing`

If you want to avoid using `try/catch` in some circumstances, you can use the following :

```ts twoslash
import { connect, DocDef } from '@cbjsdev/cbjs';

type MyClusterTypes = {
  store: {
    library: {
      books: [
        DocDef<`book::${string}`, { title: string; authors: string[] }>,
      ]
    };
  };
};

const cluster = await connect<MyClusterTypes>('...');
const collection = cluster.bucket('store').scope('library').collection('books');

// ---cut-before---
const result = await collection.get('book::001', {
  throwIfMissing: false,
});
```

If the document is not found or not retrievable, the operation will not throw. This is also reflected in the return type of the function.

## Sub-document retrieval

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

### Chainable sub-doc lookups

Cbjs introduce the ability to chain sub-doc operations. Using this syntax also enables path autocompletion :

```ts
import { LookupInSpec } from '@cbjsdev/cbjs';

const lookups = collection
  .lookupIn('docKey')
  .get('title')

if (withTags) {
  lookups.get('metadata.tags');
}

return await lookups;
```

> [!IMPORTANT]
> When using the classic `lookupIn` syntax, the request is executed immediately, regardless of it being awaited or not.
> A chained lookupIn will only perform the request once awaited `await lookups` or `.then()` is called on it.

### Error handling

During a `lookupIn`, the function will not throw if the error is related to a `LookupInSpec`. Instead, the result will include the error, and the value will be `undefined`.  
In the following example, we assume `authors` contains a single element.

```ts twoslash
import { connect, DocDef } from '@cbjsdev/cbjs';

type MyClusterTypes = {
  store: {
    library: {
      books: [
        DocDef<`book::${string}`, { title: string; authors: string[] }>,
      ]
    };
  };
};

const cluster = await connect<MyClusterTypes>('...');
const collection = cluster.bucket('store').scope('library').collection('books');

// ---cut-before---
const { content } = await collection
  .lookupIn('book::001')
  .get('title')
  .get('authors[1]');

const [
  title,
  secondAuthor,
] = content;

if (title.error !== null) {
  // handle the error
}

if (secondAuthor.error !== null) {
  // handle the error
}
```

### Option `throwOnSpecError`

Each sub-document spec may fail individually. For this reason, the lookup return may be filled with errors. You can see below that `bookTitle` contains a union type, forcing you to check the error for each sub-doc operation, as demonstrated above.

If you need all the data in order to proceed, Cbjs provides an additional option when performing the request : `throwOnSpecError`.
Using that option, `lookupIn` will fail if any spec leads to an error.  
This frees you from checking individual spec for error.

```ts twoslash
import { connect, DocDef } from '@cbjsdev/cbjs';

type MyClusterTypes = {
  store: {
    library: {
      books: [
        DocDef<`book::${string}`, { title: string; authors: string[] }>,
      ]
    };
  };
};

const cluster = await connect<MyClusterTypes>('...');
const collection = cluster.bucket('store').scope('library').collection('books');

// ---cut-before---
const { content: [title, secondAuthor] } = await collection
  .lookupIn('book::001', { throwOnSpecError: true })
  .get('title')
  .get('authors[1]');
```

Look at the type of `title` and `secondAuthor`. No more union.  
If either path `title` or `authors[1]` don't exist at runtime, it will throw an error, so this is type safe.

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
If you don't want that, use the `preserveExpiry` option, the expiry time will then be reset, just like when using `Collection.touch`.
:::

## Sub-document mutation

If you want to modify some parts of the documents, as opposed to the whole document, you can mutate only those parts.

```ts
import { MutateInSpec } from './sdspecs';

await collection
  .mutateIn('docKey', [
    MutateInSpec.replace('title', 'New title'),
    MutateInSpec.replace('lastUpdatedAt', Date.now())
  ]);
```

One of the key advantages of sub-document mutation is being able to perform an operation that do not conflict with concurrent ones.  
Learn more about [optimistic locking](/guide/services/kv-advanced).

```ts
// The mutation will not overwrite any concurrent changes
await collection.mutateIn('book::001').arrayAddUnique('metadata.tags', 'history');
```

### Chainable sub-doc mutations

Cbjs introduce the ability to chain sub-doc mutations. Using this syntax also enables path autocompletion :

```ts
const mutations = collection
  .mutateIn('book::001')
  .replace('title', 'New title');

if (newTag) {
  mutations.arrayAppend('metadata.tags', newTag);
}

return await mutations;
```

> [!IMPORTANT]
> When using the classic `mutateIn` syntax, the request is executed immediately, regardless of it being awaited or not.
> A chained mutateIn will only perform the request once awaited `await mutations` or `.then()` is called on it.

Cbjs also introduce two new methods `insertIntoRecord` and `removeFromRecord` :

```ts twoslash
import { connect, DocDef } from '@cbjsdev/cbjs';

type MyClusterTypes = {
  store: {
    library: {
      books: [
        DocDef<`book::${string}`, { title: string; editions: Record<string, { year: number; sales?: number }> }>,
      ]
    };
  };
};

const cluster = await connect<MyClusterTypes>('...');
const collection = cluster.bucket('store').scope('library').collection('books');

// @errors: 2339 2345
// ---cut-before---
// Let's say we have defined a `Book` document as follow :
type Book = { 
  title: string; 
  editions: Record<string, { year: number; sales?: number }> 
}

const result = await collection
  .mutateIn('book::001')
  // No error, yet it should show an error, because `year` is not an optional property
  .insert('editions.001.year', 2000)

  // Show an error, as we would expect
  .insertIntoRecord('editions.edition::001', 'year', 2000)
  .removeFromRecord('editions.edition::000', 'year')
;
```

### Error handling

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
