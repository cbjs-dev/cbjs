<h1 align="center">
 <img alt="Cbjs" src="https://github.com/cbjs-dev/cbjs/raw/main/docs/src/public/cbjs-logotype.svg" height="120" />
</h1>
<p align="center">
A modern Couchbase SDK for Node.js & TypeScript.
<p>

<p align="center">
    <img src="/assets/couchbase-badge.svg" alt="Couchbase Badge" />
 <a href="https://www.npmjs.com/package/@cbjsdev/cbjs"><img src="https://img.shields.io/npm/v/@cbjsdev/cbjs?label=cbjs" /></a>
 <a href="https://github.com/cbjs-dev/cbjs/actions/workflows/tests.yml"><img src="https://github.com/cbjs-dev/cbjs/actions/workflows/tests.yml/badge.svg" /></a>
</p>

<p align="center">
 <a href="https://cbjs.dev">Documentation</a> | <a href="https://cbjs.dev/guide/">Getting Started</a> | <a href="https://cbjs.dev/guide/why.html">Why Cbjs?</a>
</p>

## Getting started

To get started with your new Couchbase Node.js SDK, uninstall the official library and install Cbjs :

```bash
npm uninstall couchbase
npm install @cbjsdev/cbjs
```

## Compatibility

Built on top of the official library, Cbjs is a drop-in replacement for the `couchbase` package.  
The package that is specific to your platform is downloaded during the install process.  
Cbjs is also full **ESM native**.

Cbjs is your new [Couchbase SDK for Node.js with TypeScript](https://cbjs.dev/guide/features.html#compatible-with-the-official-client).

## Exclusive Features

Cbjs has been created to deliver a better DX.  
By making extensive usage of TypeScript, Cbjs is able to add some exclusive features.

### Inferred return type for KV operation

Because Cbjs knows your documents, the return type of KV operations is inferred from the parameters.

<picture>
  <source srcset="/assets/inferred-return-type-light.png" media="(prefers-color-scheme: light)" />
  <source srcset="/assets/inferred-return-type-dark.png" media="(prefers-color-scheme: dark)" />
  <img src="/assets/inferred-return-type-light.png" alt="code sample show casing the inferred return type" />
</picture>

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

<picture>
  <source srcset="/assets/code-completion-light.png" media="(prefers-color-scheme: light)" />
  <source srcset="/assets/code-completion-dark.png" media="(prefers-color-scheme: dark)" />
  <img src="/assets/inferred-return-type-light.png" alt="code sample show casing code completion for the path of sub-document operations" />
</picture>

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

### Better Stack Trace

Without `cbjs` :

```
node:internal/process/esm_loader:97
    internalBinding('errors').triggerUncaughtException(
```

With `cbjs` :

```
DocumentNotFoundError: document not found
    at errorFromCpp (/yourProject/node_modules/@cbjsdev/cbjs/src/bindingutilities.ts:787:14)
    at Collection.remove (/yourProject/node_modules/@cbjsdev/cbjs/src/collection.ts:1417:19)
    at remove (/yourProject/something.ts:31:3)
```

### Support for cloud lambdas

Access to the file system via `node:fs` is sometimes unavailable on cloud lambdas like Cloudflare Workers.  
Because Cbjs doesn't use it to load the driver binary, it works fine on all cloud lambdas providers.

## License

All the packages are released under the Apache 2.0 license.
