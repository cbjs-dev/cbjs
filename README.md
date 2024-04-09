<h1 align="center">
 Cbjs
</h1>
<p align="center">
Outstanding TypeScript client.
<p>

<p align="center">
    <img src="https://img.shields.io/badge/%20-couchbase-ec1218?logo=data:image/svg%2bxml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyB3aWR0aD0iMTM0IiBoZWlnaHQ9IjEzNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxjaXJjbGUgcj0iNjciIGN4PSI2NyIgY3k9IjY3IiBmaWxsPSIjZmZmZmZmICIvPgogICAgPHBhdGggZmlsbD0iI0VDMTIxOEZGIiBkPSJNIDExMS41NSA3OS4xNSBDIDExMS41NSA4My4xNSAxMDkuMjUgODYuNjUgMTA0Ljc1IDg3LjQ1IEMgOTYuOTUgODguODUgODAuNTUgODkuNjUgNjYuODUgODkuNjUgQyA1My4xNSA4OS42NSAzNi43NSA4OC44NSAyOC45NSA4Ny40NSBDIDI0LjQ1IDg2LjY1IDIyLjE1IDgzLjE1IDIyLjE1IDc5LjE1IEMgMjIuMTUgNzAuNTUgMjIuMTUgNjEuOTUgMjIuMTUgNTMuMzUgQyAyMi4xNSA0OS4zNSAyNS4yNSA0NS42NSAyOC45NSA0NS4wNSBDIDMxLjI1IDQ0LjY1IDM2LjY1IDQ0LjI1IDQwLjg1IDQ0LjI1IEMgNDIuNDUgNDQuMjUgNDMuNzUgNDUuNDUgNDMuNzUgNDcuMzUgTCA0My43NSA2NS40NSBDIDUxLjg1IDY1LjQ1IDU4Ljg1IDY0Ljk1IDY2Ljk1IDY0Ljk1IEMgNzUuMDUgNjQuOTUgODIuMDUgNjUuNDUgOTAuMTUgNjUuNDUgTCA5MC4xNSA0Ny4zNSBDIDkwLjE1IDQ1LjQ1IDkxLjQ1IDQ0LjI1IDkzLjA1IDQ0LjI1IEMgOTcuMjUgNDQuMjUgMTAyLjY1IDQ0LjY1IDEwNC45NSA0NS4wNSBDIDEwOC43NSA0NS42NSAxMTEuNzUgNDkuMzUgMTExLjc1IDUzLjM1IEMgMTExLjU1IDYxLjk1IDExMS41NSA3MC41NSAxMTEuNTUgNzkuMTUgWiIgLz4KPC9zdmc+" />
 <a href="https://www.npmjs.com/package/@cbjsdev/cbjs"><img src="https://img.shields.io/npm/v/@cbjsdev/cbjs?label=cbjs" /></a>
 <a href="https://github.com/cbjs-dev/cbjs/actions/workflows/tests.yml"><img src="https://github.com/cbjs-dev/cbjs/actions/workflows/tests.yml/badge.svg" /></a>
</p>

<p align="center">
 <a href="https://cbjs.dev">Documentation</a> | <a href="https://cbjs.dev/guide/">Getting Started</a> | <a href="https://cbjs.dev/guide/why">Why Cbjs?</a>
</p>

## Getting started

To get started with your new Couchbase Node.js SDK, uninstall the official library and install Cbjs :

```bash
npm uninstall couchbase
npm install @cbjsdev/cbjs
```

## Compatibility

Built on top of the official library, Cbjs is a drop-in replacement for the `couchbase` package.  
The package that is specific to your platform is downloaded during the install process, **you don't have to compile the binary anymore**.

Cbjs is your new [Couchbase Node.js SDK](https://cbjs.dev/guide/features.html#compatible-with-the-official-client)

## Exclusive Features

Cbjs has been created to deliver a better DX.  
By making extensive usage of TypeScript, Cbjs is able to add some exclusive features.

### Inferred return type for KV operation

Because Cbjs knows your documents, the return type of KV operations is inferred from the parameters.

[![code sample show casing the inferred return type](https://github.com/cbjs-dev/cbjs/assets/94478/f28353bf-6e70-415c-b8da-217e71545acb)](https://cbjs.dev/guide/features.html#inferred-return-type)

Read more about [couchbase document path autocomplete](https://cbjs.dev/guide/features.html#inferred-return-type).

### Chainable sub-document operations

Adopt a more elegant syntax by chaining sub-document operations.

```ts
const result = await collection.lookupIn('book::001')
  .get('title')
  .exists('lastModifiedBy')
  .count('metadata.tags');
```

Read more about [chainable lookupIn](https://cbjs.dev/guide/services/kv.html#chainable-sub-doc-operations).

### Path autocomplete for sub-document operation

Because Cbjs knows your documents, autocompletion is offered when writing a document path.

[![code sample show casing the path autocompletion](https://github.com/cbjs-dev/cbjs/assets/94478/fb0a5721-2a0c-4ee4-9dc7-b27b1aa434d5)](https://cbjs.dev/guide/features.html#ide-autocompletion)

### Improved types

Great efforts have been made to improve function signatures and types in general. Here is an example that uses _discriminated unions_ to offer a natural type guard :

```ts
const { content: [title] } = await collection.lookupIn(bookId).get('title');
//                  ^? LookupInResultEntry<string, null> | LookupInResultEntry<undefined, Error>

if (title.error) {
  throw new Error('Failed to retrieve the title.');
}

// Because of the discriminated union, the previous condition acts as a type guard.
// title: LookupInResultEntry<string, null>
```

The same goes for callbacks and many more ! [Read more](https://cbjs.dev/guide/features.html#discriminated-unions).

### Support for cloud lambdas

Unlike the official library, Cbjs doesn't use the filesystem, which is sometimes unavailable on cloud lambas like Cloudflare Workers.

## License

All the packages are released under the Apache 2.0 license.
