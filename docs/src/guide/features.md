---
title: Features | Guide
outline: deep
---

# Features

- Compatible with the official client
- Improved TypeScript function signatures
- KeyValue type safety for document and sub-document operation
- Path autocomplete for sub-document operation
- Chainable sub-document operations
- HTTP Client
- Vitest fixtures

## Compatible with the official client

Cbjs is compatible with the official client.  
The main goal of Cbjs is to bring TypeScript support.
Cbjs also bring more sound and consistent behaviour, sometimes leading to small runtime changes. See [runtime changes](runtime-changes).

## KeyValue Supercharged Types

Once you have defined your [Cluster Types](cluster-types), you will unlock many powers :

```ts
// All Good 👌
await collection.get(bookId); // Book
await collection.lookupIn(bookId).get('title'); // string
await collection.lookupIn(bookId).get('authors[0]'); // string
await collection.mutateIn(bookId).arrayAddUnique('metadata.tags', 'database');

// TS Error ❌
await collection.get(wrongIdFormat); // invalid key
await collection.lookupIn(bookId).get('tite'); // invalid path
await collection.lookupIn(bookId).get('quaterSales[4]'); // quaterSales is a tuple with 4 members maximum
await collection.mutateIn(bookId).insert('title'); // `title` is a required property, therefore it already exist
await collection.mutateIn(bookId).arrayInsert('quaterSales[2]', '3467'); // invalid value. `quaterSales` is a tuple of numbers
```

You can learn more about this topic on the page dedicated to [Cluster Types](cluster-types).
