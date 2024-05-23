---
outline: [2, 3]
---

# Utilities

A few utilities are exposed to help you in your daily development.

## CouchbaseCas

The class `CouchbaseCas` can be used to convert a CAS representation to another or to compare two CAS.

### CouchbaseCas.from

Create a new instance from the given value.

```ts twoslash
import { CouchbaseCas } from '@cbjsdev/cbjs';
// ---cut-before---
const cas = CouchbaseCas.from(0);
```

### CouchbaseCas.toString

Returns a string representation of the CAS.  
You can use this function to send a CAS a part of a JSON object for example.

```ts
const { content, cas } = await collection.insert(
  'book::001', 
  { title: 'Couchbase SDK for Node.js & TypeScript' }
);
return CouchbaseCas.toString(cas);
```

### CouchbaseCas.isZeroCas

Returns true if the CAS representation can be translated to 0.

```ts
if (CouchbaseCas.isZeroCas(cas)) {
    // some logic
}
```


### CouchbaseCas.isEqual

Returns true if two CAS represent the same value.

```ts
if (CouchbaseCas.isEqual(stringCas, bufferCas)) {
    // some logic
}
```