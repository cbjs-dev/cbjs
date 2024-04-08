---
title: Runtime changes | Guide
outline: deep
---

# Runtime changes

While Cbjs aims to be compatible with the official client, if you rely on unsound behavior, a tiny change may result in a different runtime.
For this reason we list here the tiny changes in Cbjs that may affect your existing project.

## Timeout

**You are affected if**: you pass a timeout of `0` in some operation.

If you pass a timeout of `0` to the official library, it will fallback to the default timeout. Cbjs will use your value of `0`. You can pass `undefined` to use the default timeout.

## Data structure size

**You are affected if**: you use `CouchbaseSet`, `CouchbaseList`, `CouchbaseQueue` or `CouchbaseList` on a invalid document and try to get its size.

When using a data structure helper like `CouchbaseSet`, you can get the size of it by calling `CouchbaseSet.size()`. But if this document is a binary document for example, the official library will return `undefined`.
Cbjs will throw an error instead.

```ts
// Before : undefined
// Cbjs : throws an error
const dsSize = collection.set(binaryDocumentKey).size();
```

## DocumentId

**You are affected if**: you create an instance of the class `DocumentId` and test the properties before you've set them.

When creating a new instance of the class `DocumentId`, its properties were initialized to an empty string. This is no longer the case with Cbjs.
