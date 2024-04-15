# KeyValue Service advanced mechanisms

## Locking

Couchbase offers both optimistic and pessimistic locking.

### Optimistic locking

When mutating a document, you may want to be sure you don't overwrite some changes made since you fetched that document.
To do that, you can use the `cas` returned while fetching the document, and use that `cas` during the mutation.

```ts{5}
const { content, cas } = await collection.get('docKey');
await collection.replace(
  'docKey',
  { ...content, title: 'New Title' },
  { cas }
);
```

By doing so, the mutation will fail if the document's `cas` is not longer the one you have been given, preventing you from overwriting changes that occurred in the mean time.

If you want to update a single field regardless of its current value but without overwriting changes on other properties, you should perform a sub-document mutation instead.

### Pessimistic locking

::: warning
The maximum lock time is set to `30` seconds. Any value higher than that will be dismissed and the document will be locked for `15` seconds.
:::

```ts
// Lock the document for 5 seconds
const result = await collection.getAndLock('docKey', 5);
await collection.unlock('docKey', result.cas);
```

As you can see, the `cas` returned by the `Collection.getAndLock` operation is required to unlock the document.

::: danger
Any mutation you perform on the document, given the correct `cas`, will unlock it.
:::

If the document is fetched while it is locked, the result will include a random `cas` value, preventing anybody from unlocking or mutating the document.

## Durability

_Coming soon..._
