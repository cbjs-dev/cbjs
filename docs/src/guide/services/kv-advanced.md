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

For this section, it is assumed that you understand how Couchbase handles a [node failure](../node-failure.md).

### Reads
When you perform a KV read with `Collection.get`, it will fail if the active node is not available.  
If you node gets back online before your `get` times out, the operation will succeed.

If the freshness of the data is not of the uttermost importance, you should consider using `Collection.getAnyReplica`, which will
return the document from either the active node, or any replica node that is available.

Working with consistency issues, you may want to use `Collection.getAllReplicas` to get all the copies of the documents.  
Note that all the nodes, active and replicas, must be available for the request to succeed.

### Writes
Performing a `Collection.insert` will only succeeds if the active node is available. If the node is unavailable but is available
again before the operation times out, the operation will succeed.

A write is considered successful as soon as the active node acknowledges it, before it is written to disk.  
If you need extra guarantees, you can pass the `durabilityLevel` option.  

**Majority**: the majority of the nodes have the write in memory.
**MajorityAndPersistOnMaster**: the majority of the node have the write in memory and the active node has persisted the write.
**PersistToMajority**: the majority of the node have persisted the write.

You should know that durable writes behave as committed writes. Meaning that a client that reads the data from a replica through `getAnyReplica` for example, will not see the new version of the document until the required durability has been reached.  
Also, any write on the document undergoing a durable write will fail until the write is committed.