---
title: Cluster Types | Guide
---

# Cluster Types

Cbjs introduces type safety for KV operations. You can opt-in during the connection to your cluster :

```ts
const cluster = await connect<MyClusterTypes>('...');
```

## Definition of types

The definition of the types is done when connecting to the cluster, by passing a type with this shape :

```ts
type CouchbaseClusterTypes = {
  [bucket: string]: {
    [scope: string]: {
      [collection: string]: unknown;
    };
  };
};
```

The following example describe the keyspace `store.library.books` that can contain two types of documents.  

:::tip
Document keys are expressed as a template literal.  
This enables key validation and more powerful type narrowing.
:::

```ts
type MyClusterTypes = {
  storey: {
    library: {
      books:
        | DocDef<`author::${string}`, { firstname: string; lastname: string; }>
        | DocDef<`book::${string}`, { type: 'book'; authors: string[] }>;
    };
  };
};
```

## Type safety

Given the previous definitions, the following type safety arise :

```ts
const cluster = await connect<MyClusterTypes>('...');
const collection = cluster.bucket('store').scope('library').collection('books');

collection.get('book::001'); // { type: 'book'; authors: string[] }
collection.insert('book::002', 1); // ❌ TS Error: The value is invalid
collection.lookupIn('book::01', [
  LookupInSpec.get('authors'), // Autocomplete the path
  LookupInSpec.count('authors'), // Autocomplete with the only possible path for a count
  LookupInSpec.get('author'), // TS Error : Path is invalid
]);
```

## Incremental adoption

Using strict cluster types on an existing project can be overwhelming.
You may want to adopt cluster types progressively, you can start by defining some part of your types :

```ts
import type { DefaultClusterTypes } from '@cbjsdev/cbjs';

// Note the use of the type helper `DefaultClusterTypes`
type MyClusterTypes = DefaultClusterTypes & {
  store: {
    library: {
      books: {
        /* ... */
      };
    };
  };
};
```

This will enable type safety only for the collection `store.library.books`. Reference to other bucket, scope or collection will be treated as before.

## Considerations

### Document paths

The purpose of the path autocompletion is to prevent small mistakes and to write paths faster.
It does not guarantee that the document path will exist at runtime. Consider the following :

```ts
type MyDoc = { title: string; metadata: { tags?: string[] } };
const result = collection.lookupIn('myDoc', [
  LookupInSpec.get('metadata.tags[2]')
]);
```

The path is valid because it may exist, but you may very well receive an error at runtime if the array index does not exist.
The same logic applies when you use optional properties or union types:

```ts
type MyDoc = {
  description?: string;
  sales: number[] | Record<string, number>;
};
const result = collection.lookupIn('myDoc', [
  LookupInSpec.get('description'),
  LookupInSpec.get('sales.2024')
]);
```

### IDE autocompletion

Because of IDEs current limitations, autocomplete will not be offered for array indexes. Using the previous example :

```ts
const result = collection.lookupIn('myDoc', [
  LookupInSpec.get('metadata.tags[0]')
]);
```

Because the path is expressed as a template literal, `metadata.tags[${number}]`, your IDE will not offer `metadata.tags[0]` but only `metadata.tags`.  
Nevertheless, `metadata.tags[0]` is a valid path. This does not apply to tuples, as their length is fixed.

### Recursivity

If a recursive type is identified, only one iteration will be performed, for the sake of autocompletion.
Deeper path will be unchecked.

```ts
type DeepStringArray = (string | DeepStringArray)[];
type PathToDeepStringArray = `[${number}]` | `[${number}][${number}]${string}`;
```

### Tuples

Cbjs considers that tuples cannot change in length, regardless of them being readonly or not.  
The values themselves can be modified, unless the tuple is `readonly`.
