---
title: Features | Guide
outline: deep
---

# Runtime fixes

While Cbjs aims to be 100% compatible with the official client, the said client sometimes do not fix issues. We do.
If you had worked on a workaround on your side, this may result in a different behavior at runtime.
To avoid unexpected bugs, you can find all runtime fixes here :

**Query index keys**

When calling `collection.getAllIndexes()` or `cluster.queryIndexes().getAllIndexes()`, you receive an object `QueryIndex` containing the property `indexKey`.

```ts
const { indexKey } = collection.getAllIndexes();
expect(indexKey).toEqual(['`title`', '`description`']); // [!code --]
expect(indexKey).toEqual(['title', 'description']); // [!code ++]
```

