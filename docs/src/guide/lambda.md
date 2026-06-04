---
title: AWS Lambda | Guide
outline: [2, 3]
---

# AWS Lambda

During installation, Cbjs downloads a native binary that matches the machine running the install, based on its platform and architecture. This is fine when you install and run on the same platform.

It becomes a problem when you build on one platform and run on another. The usual case is bundling on CI and deploying to AWS Lambda, which runs on Linux/x64: the binary that ends up in the bundle is the one for your CI, not the one Lambda can load. If they are not both the same platform and architecture, you'll end up with an error.

## Selecting the binary

Set `COUCHBASE_BINARY_PLATFORM` to `linux` and `COUCHBASE_BINARY_ARCH` to the Lambda architecture when you install. Use `x64` for `x86_64` functions and `arm64` for Graviton functions. Both variables override the auto-detected value and have no effect when left unset.

::: code-group

```bash [x86_64]
COUCHBASE_BINARY_PLATFORM=linux COUCHBASE_BINARY_ARCH=x64 npm install
```

```bash [arm64]
COUCHBASE_BINARY_PLATFORM=linux COUCHBASE_BINARY_ARCH=arm64 npm install
```

:::

::: tip
Set the variables in your deploy script so the right binary is selected on every deploy.
:::

## Checking the binary

Run `file` on the binary that ends up in the bundle to confirm it targets the Lambda architecture:

```bash
file node_modules/@cbjsdev/cbjs/dist/src/couchbase-native.node
```

You want `ELF 64-bit ... x86-64` for an `x86_64` function, or `ELF 64-bit ... ARM aarch64` for an `arm64` one. If you see `Mach-O`, the macOS binary leaked into the bundle.

::: warning
When no override is set, the install is skipped if a binary is already present. Setting `COUCHBASE_BINARY_PLATFORM` or `COUCHBASE_BINARY_ARCH` forces a fresh download, so a binary from a previous local install won't end up in a cross-platform bundle.
:::

## Pinning the version

`COUCHBASE_BINARY_VERSION` pins the version of the underlying Couchbase binary that is downloaded, regardless of platform and architecture.

```bash
COUCHBASE_BINARY_VERSION=4.6.1 npm install
```
