---
title: Features | Guide
outline: deep
---

# Features

- 100% Compatible with the official client
- Proper TypeScript signatures
- KV type safety for doc and sub-document operation
- Path autocomplete for sub-document operation
- Chainable sub-document operations
- HTTP Client
- Vitest fixtures

## Compatible with the official client

Cbjs is fully compatible with the official client.
The main goal of Cbjs is to bring TypeScript support.
We have a single runtime change. See [runtime changes](runtime-changes).

## KV Supercharged Types

Once you have defined your [Cluster Types](cluster-types), you will unlock the many powers :

```ts
await collection.get(bookId); // returns: Book
await collection.get(wrongIdFormat); // [!code error] TS Error: they key doesn't match declared keys in the collection

await collection.lookupIn(bookId).get('title'); // returns: string
await collection.lookupIn(bookId).get('authors[0]'); // returns: string
await collection.lookupIn(bookId).get('tite'); // [!code error] Error: invalid key
await collection.lookupIn(bookId).get('quaterSales[5]'); // [!code error] Error: quaterSales is a tuple with 4 members maximum

await collection.mutateIn(bookId).insert('title'); // [!code error] Error: `title` is a required property, so it already exist
await collection.mutateIn(bookId).arrayInsert('quaterSales[2]', '3467'); // [!code error] Error: invalid value. `quaterSales` is a tuple of numbers
```

You can learn more about this topic on the page dedicated to [Cluster Types](cluster-types).
