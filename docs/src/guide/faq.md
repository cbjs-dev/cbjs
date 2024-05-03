---
title: FAQ
titleTemplate: A modern Couchbase SDK for Node.js & TypeScript.
---

# Frequently Asked Questions

## What is the difference between `couchbase` and `@cbjsdev/cbjs` ?

Cbjs is basically `couchbase` plus thousands of lines of TypeScript on top of it.  
There are also a few runtime additions, like [chainable sub-doc operation](./services/kv#chainable-sub-doc-operations) or [`throwOnSpecError`](./services/kv#throw-on-spec-error).

## Can I just replace `couchbase` with `@cbjsdev/cbjs` ?

Yes. Make sure you don't fall in one of the edge cases documented [here](./runtime-changes) and you'll be good.

## How is it tested ?

All the tests of the official library have been implemented.  
They have been ported to `vitest` to guarantee their isolation and migrated to TypeScript.  
Hundreds of tests and thousands of assertions have been added to not only test the runtime behavior but also test the function signatures and overall, the types.  

Cbjs is tested on GitHub Actions against Node.js 18 and Couchbase Server 7.2.4 and 7.6.1.  

