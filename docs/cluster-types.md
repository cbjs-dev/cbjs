# Cluster Types

Starting with version 4.3 you can opt-in for type safety with document operations.

```ts
const cluster = await connect<MyClusterTypes>('...');
const collection = cluster.bucket('store').scope('library').collection('books');
collection.get('book::001'); // The return type is deducted from your type definitions
collection.insert('book::001', 1); // TS Error: The value is invalid
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

The following example describe a cluster containing a single bucket `store`, containing a single scope `library`, containing a single collection `books` that can contain documents of type `{ type: 'author'; name: string }` or `{ type: 'book'; authors: string[] }`. You will also notice that we define the key as a template literal.

```ts
type MyClusterTypes = {
  storey: {
    library: {
      books:
        | DocDef<`author::${string}`, { type: 'author'; name: string }>
        | DocDef<`book::${string}`, { type: 'book'; authors: string[] }>;
    };
  };
};
```

## Type safety

Given the previous definitions, the following type safety arise :

```ts
import { LookupInSpec } from './sdspecs';

const cluster = await connect<MyClusterTypes>('...');
const collection = cluster.bucket('store').scope('library').collection('books');

collection.get('book::001'); // { type: 'book'; authors: string[] }
collection.insert('book::002', 1); // TS Error: The value is invalid
collection.lookupIn('book::01', [
  LookupInSpec.get('authors'), // Autocomplete the path
  LookupInSpec.count('authors'), // Autocomplete with the only possible path for a count
  LookupInSpec.get('author'), // TS Error : Path is invalid
]);
```

## Considerations

### Document paths

The purpose of the path autocompletion is to prevent small mistakes and to write paths faster.
It does not guarantee that the document path will exist at runtime. Consider the following :

```ts
type MyDoc = { title: string; metadata: { tags?: string[] } };
const result = collection.lookupIn('myDoc', [LookupInSpec.get('metadata.tags[0]')]);
```

The path is valid because it may exist, but you may very well receive an error at runtime if the path does not exist.
The same logic applies when using union types.

#### IDE autocompletion

Because of IDEs current limitations, autocomplete will not be offered for array indexes. Using the previous example :

```ts
const result = collection.lookupIn('myDoc', [LookupInSpec.get('metadata.tags[0]')]);
```

Because the path is expressed as a template literal, `metadata.tags[${number}]`, your IDE will not offer `metadata.tags[0]` but only `metadata.tags` - and the other keys of course.
Nevertheless, `metadata.tags[0]` is a valid path. This does not apply to tuples, as their length is fixed.

#### Recursivity

If a recursive type is identified, only one iteration will be performed, for the sake of autocompletion.
Deeper path will be unchecked.

```ts
type DeepStringArray = (string | DeepStringArray)[];
type PathToDeepStringArray = `[${number}]` | `[${number}][${number}]${string}`;
```

### Tuples

The overwhelming majority of developers consider that you cannot modify the length of tuples, regardless of them being readonly or not. As a fact, you can push an element out of the bound of a tuple :

```ts
const tuple: [number, number] = [0, 1];
tuple.push(2); // Valid for TS and at runtime
```

In order to follow the path of least astonishment, we assume you don't want the length of your tuples to be modified, but the values themselves can be modified.

### Incremental adoption

Using strict cluster types on an existing project can be overwhelming.
You may want to adopt the type safely progressively, you can start by defining some part of your types :

```ts
import type { DefaultClusterTypes } from 'couchbase';

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
