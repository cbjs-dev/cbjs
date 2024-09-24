---
title: Query Service | Guide
outline: [2, 3]
---

# Query Service

The query service allow you to perform SQL queries on your database.

## Query Context

If you want to execute a query on a given scope, you can pass the `queryContext` argument. 

```ts twoslash
import { connect, DocDef } from '@cbjsdev/cbjs';

type MyClusterTypes = {
  store: {
    library: {
      books: [
        DocDef<`book::${string}`, { title: string; authors: string[] }>,
      ],
    };
    grocery: {
      vegetables: [
          DocDef<`vegetable::${string}`, { name: string; price: string }>,
      ]
    }
  };
};

const cluster = await connect<MyClusterTypes>('...');

// ---cut-before---

const result = cluster.query('SELECT title FROM books', {
  queryContext: 'store.library'
});
```

## Custom parser

The query service will return a json object for each result.
If your query returns a value that cannot be parsed by `JSON.parse`, you may run into troubles.

For example, `cas` are returned as `number` that exceed `Number.MAX_SAFE_INTEGER` :

```ts
const result = cluster.query('SELECT META().cas AS cas FROM store.library.book');
const queryCas = result.rows[0].cas;

console.log(typeof queryCas); // 'number' 
console.log(queryCas > Number.MAX_SAFE_INTEGER); // true 
```

So you may want to pass a custom parser, such as `json-bigint` :

```ts
import JSONBigint from 'json-bigint';

const result = cluster.query('SELECT META().cas AS cas FROM store.library.book', {
  queryResultParser: JSONBigInt({ useNativeBigInt: true }).parse,
});
const queryCas = result.rows[0].cas;

console.log(typeof queryCas); // 'bigint'  
```

You can set a default custom parser when constructing your cluster connection : 

```ts
const cluster = connect('...', {
  queryResultParser: customParser
})
```
