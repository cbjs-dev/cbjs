---
title: Runtime changes | Guide
outline: deep
---

# Runtime changes

While Cbjs aims to be compatible with the official client, if you rely on unsound behavior, a tiny change may result in a different runtime.
For this reason we list here the tiny changes in Cbjs that may affect your existing project.

**Timeout of 0**

If you pass a timeout of `0` to the official library, it will fallback to the default timeout. Cbjs will use your value of `0`.

**Data structure `.size()`**

When using a data structure helper like `CouchbaseSet`, you can get the size of it by calling `CouchbaseSet.size()`. But if this document is a binary document for example, the official library will return `undefined`.
Cbjs will throw an error.

```ts
// Before : undefined
// Cbjs : throws an error
const dsSize = collection.set(binaryDocumentKey).size();
```

**DocumentId**

When creating a new instance of the class `DocumentId`, its properties were initialized to an empty string. This is no longer the case with Cbjs.
If you never create such instance yourself (you should not), you are not affected by this.