---
title: Cluster Types | Guide
next:
  text: 'KeyValue Service'
  link: '/guide/services/kv'
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
      [collection: string]: DocDef[];
    };
  };
};
```

The following example describe the keyspace `store.library.books` that can contain two types of documents.

:::tip
Express documents keys as a template literal to enable key validation and more powerful type narrowing.
:::

```ts
type MyClusterTypes = {
  store: {
    library: {
      books: [
        DocDef<`author::${string}`, { firstname: string; lastname: string }>,
        DocDef<`book::${string}`, { title: string; authors: string[] }>,
      ]
    };
  };
};
```

## Type safety

Given the previous definitions, the following type safety arise :

```ts twoslash
import { connect, DocDef } from '@cbjsdev/cbjs';

type MyClusterTypes = {
  store: {
    library: {
      books: [
        DocDef<`author::${string}`, { firstname: string; lastname: string }>,
        DocDef<`book::${string}`, { title: string; authors: string[] }>,
      ]
    };
  };
};

// ---cut-before---
// @errors: 2304 2322 2345 2554 2769
const cluster = await connect<MyClusterTypes>('...');
const collection = cluster.bucket('store').scope('library').collection('books');

const bookId = 'book::001';

const { content: book } = await collection.get(bookId);

const {
  content: [title],
} = await collection.lookupIn(bookId).get('title');
const {
  content: [authors],
} = await collection.lookupIn(bookId).get('authors');
const {
  content: [firstAuthor],
} = await collection.lookupIn(bookId).get('authors[0]');

//
// Now let's see some mistakes being prevented by Cbjs
//

// Invalid document key
await collection.get('vegetable::001');
// Invalid document property
await collection.lookupIn(bookId).get('tite');
// Invalid property accessor : `quaterSales` has only 4 elements
await collection.lookupIn(bookId).get('quaterSales[4]');
// Property `title` is required, therefore it already exists. Use `upsert` instead.
await collection.mutateIn(bookId).insert('title', 'documentation');
// Invalid value : `quaterSales` is a tuple of numbers.
await collection.mutateIn(bookId).arrayInsert('quaterSales[2]', '3467');
```

## Key Matching Strategy
When inferring the type of a document, Cbjs matches the given key with the string template of the document definitions of the targeted collection.  
If we just check if the key extends the template, we will have disappointing results.  
Take a look at a common pattern for building document keys in a document database :

```ts twoslash
import { ClusterCollection, DocDef, connect } from '@cbjsdev/cbjs';

type MyClusterTypes = {
  store: {
    library: {
      books: [
        DocDef<`book::${string}`, { title: string }>,
        DocDef<`book::${string}::reviews`, Array<{ note: number; comment: string }>>,
      ];
    };
  };
};

const cluster = await connect<MyClusterTypes>('...');
const collection = cluster.bucket('store').scope('library').collection('books');
// ---cut-before---
// @errors: 2345
// The result is either a book or the book reviews
const result = await collection.get('book::001::reviews');
```

Because the key `'book::001::reviews'` extends both string templates, both document are matched.

This is the default key matching strategy, named `always`.

### Delimiter (recommended)

Now let's see another strategy named `delimiter`, that uses the common delimiters to match the keys :

```ts twoslash
// ---cut-start---
import { ClusterTypes, BucketTypes, ScopeTypes, CollectionTypes, DocDef, connect } from '@cbjsdev/cbjs';
// ---cut-end---
type ClusterTypesOptions = {
  keyMatchingStrategy: 'delimiter';
  keyDelimiter: '::';
};

// ---cut-start---
type MyClusterTypes = ClusterTypes<ClusterTypesOptions, {
  store: {
    library: {
      books: [
        DocDef<`book::${string}`, { title: string }>,
        DocDef<`book::${string}::reviews`, Array<{ note: number; comment: string }>>,
      ];
    };
  };
}>;

const cluster = await connect<MyClusterTypes>('...');
const collection = cluster.bucket('store').scope('library').collection('books');
// ---cut-end---
// @errors: 2345
// The result has been narrowed using the delimiter to the book reviews
const result = await collection.get('book::001::reviews');
```

### First Match
Finally, if the previous strategy does not work for you, you can use the `firstMatch` strategy, that simply uses the first declared document that matches the key :

```ts twoslash
// ---cut-start---
import { ClusterTypes, BucketTypes, ScopeTypes, CollectionTypes, DocDef, connect } from '@cbjsdev/cbjs';
// ---cut-end---
type ClusterTypesOptions = {
  keyMatchingStrategy: 'firstMatch';
};

type MyClusterTypes = ClusterTypes<ClusterTypesOptions, {
  store: {
    library: {
      books: [
        DocDef<`book::${string}::reviews`, Array<{ note: number; comment: string }>>,
        DocDef<`book::${string}`, { title: string }>,
      ];
    };
  };
}>;

// ---cut-start---
const cluster = await connect<MyClusterTypes>('...');
const collection = cluster.bucket('store').scope('library').collection('books');
// ---cut-end---
// @errors: 2345
// The reviews definition is the first to match, so it is used for the return type.
const result = await collection.get('book::001::reviews');
```

### Picking a strategy
When declaring your cluster types, you can pass some options using one of the type helpers :
```ts twoslash
import { ClusterTypes, BucketTypes, ScopeTypes, CollectionTypes, DocDef, connect } from '@cbjsdev/cbjs';

type ClusterTypesOptions = {
  keyMatchingStrategy: 'delimiter';
  keyDelimiter: '::';
};

type MyClusterTypes = ClusterTypes<ClusterTypesOptions, {
  store: BucketTypes<{
    library: ScopeTypes<{
      books: CollectionTypes<[ DocDef ]>
    }>
  }>
}>;
```

:::tip
Passing options to the helper is optional but always comes as the first type argument.
:::

## Incremental adoption

Using strict cluster types on an existing project can be overwhelming.
You may want to adopt cluster types progressively, you can start by defining some part of your types :

```ts
import type { DefaultClusterTypes } from '@cbjsdev/cbjs';

// Note the use of the type helper `DefaultClusterTypes`
type MyClusterTypes = DefaultClusterTypes & {
  store: {
    library: {
      books: [/* Document definitions */];
    };
  };
};
```

This will enable type safety only for the collection `store.library.books`. Reference to other bucket, scope or collection will be treated as before.

## Reference keyspace objects

When you expect some of your cluster's bucket, scope or collection, you cannot use a union type to define multiple collections for examples

```ts twoslash
import { DocDef, Scope } from '@cbjsdev/cbjs';

type MyClusterTypes = {
  store: {
    library: {
      books: [DocDef];
    };
  };
};

// ---cut-before---
// @errors: 2344
type AcceptedScopes = Scope<MyClusterTypes, 'store', 'library' | 'groceries'>;
```

If you want to reference a range of bucket/scope/collection, the solution is to use the types provided by Cbjs:

```ts twoslash
import { ClusterScope, DocDef, Scope } from '@cbjsdev/cbjs';

type MyClusterTypes = {
  store: {
    library: {
      books: [DocDef];
    };
    groceries: {
      meat: [DocDef];
    };
  };
};

// ---cut-before---
// We accept two scopes from the bucket `store`.
type AcceptedScopes = ClusterScope<MyClusterTypes, 'store', 'library' | 'groceries'>;

declare function doSomethingWithScope(scope: AcceptedScopes): void;

// The scope we want to use.
declare const scope: Scope<MyClusterTypes, 'store', 'library'>;

// Our scope is accepted 👌
doSomethingWithScope(scope);
```

The types `ClusterBucket`, `ClusterScope` and `ClusterCollection` simply generate a union type for all matching keyspaces.
You can also use some kind of wildcard by passing `any` or `never`.

```ts twoslash
import { ClusterCollection, DocDef } from '@cbjsdev/cbjs';

type MyClusterTypes = {
  backend: {
    webstore: {
      customers: [DocDef<`customer::${string}`, { firstname: string }>];
    };
    retailStore: {
      customers: [DocDef<`customer::${string}`, { firstname: string }>];
    };
  };
};

// ---cut-before---
// @errors: 2345
type BackendCustomersCollection = ClusterCollection<
  MyClusterTypes,
  'backend',
  never,
  'customers'
>;
```

## Considerations

### Document paths at runtime

The purpose of the path autocompletion is to prevent small mistakes and to write paths faster.
It does not guarantee that the document path will exist at runtime. Consider the following :

```ts
type Book = { title: string; authors: string[] };
const result = await collection.lookupIn('book::01').get('authors[2]');
```

The path is valid because it may exist, but you may very well receive an error at runtime if the array index does not exist.
The same logic applies when you use optional properties or union types:

```ts
type Book = {
  title: string;
  authors: string | string[];
};

const result = await collection.lookupIn('book::001').get('title').get('authors[0]');
```

### IDE autocompletion

Because of IDEs current limitations, autocomplete will not be offered for array indexes. Using the previous example :

```ts twoslash
import { connect, DocDef } from '@cbjsdev/cbjs';

type MyClusterTypes = {
  store: {
    library: {
      books: [ DocDef<
        `book::${string}`,
        {
          title: string;
          authors: string[];
          quater_sales: [number, number, number, number];
        }
      > ]
    };
  };
};

const cluster = await connect<MyClusterTypes>('');
const collection = cluster.bucket('store').scope('library').collection('books');

// ---cut-before---
// @noErrors: 2769
const result = await collection
  .lookupIn('book::001')
  .get('autho');
//           ^|
```

Because the path is expressed as a template literal, `authors[${number}]`, your IDE will not offer `authors[0]` but only `authors`.  
Nevertheless, `authors[0]` is a valid path.

This does not apply to tuples, as their length is fixed.

```ts twoslash
import { connect, DocDef } from '@cbjsdev/cbjs';

type MyClusterTypes = {
  store: {
    library: {
      books: [ DocDef<
        `book::${string}`,
        {
          title: string;
          authors: string[];
          quater_sales: [number, number, number, number];
        }
      > ]
    };
  };
};

const cluster = await connect<MyClusterTypes>('');
const collection = cluster.bucket('store').scope('library').collection('books');

// ---cut-before---
// @noErrors: 2769
const result = await collection
  .lookupIn('book::001')
  .get('quater_sal');
//                ^|
```

&nbsp;  
&nbsp;  
&nbsp;  
&nbsp;

### Recursivity

If a recursive type is identified, only one iteration will be performed, for the sake of autocompletion.
Deeper path will be unchecked.

```ts twoslash
import { DocumentPath } from '@cbjsdev/shared';

// ---cut-before---
type RecursiveStringArray = (string | RecursiveStringArray)[];
type AllowedPath = DocumentPath<RecursiveStringArray>;
```

### Tuples

Cbjs considers that tuples cannot change in length, regardless of them being readonly or not.
The values themselves can be modified, unless the tuple is `readonly`.
