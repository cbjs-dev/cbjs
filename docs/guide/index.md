---
title: Getting Started | Guide
---

# Getting Started

## Overview

Cbjs is a modern Couchbase client for JS runtimes.

You can learn more about the rationale behind the project in the [Why Cbjs](./why) section.

## Adding Cbjs to Your Project

::: code-group
```bash [npm]
npm install cbjs
```
```bash [yarn]
yarn add cbjs
```
```bash [pnpm]
pnpm add cbjs
```
```bash [bun]
bun add cbjs
```
:::

:::tip
Cbjs requires Node >=v18.00
:::

## Connect to cluster

To start using Cbjs you must first connect to your Couchbase cluster.
Couchbase recommend that you use the same connection across your application. 
One way to do this is to export your cluster connection.

``` ts
// cluster.ts
export const cluster = connect('couchbase://localhost');
```

## Community

If you have questions or need help, reach out to the community in [GitHub Discussions](https://github.com/cbjs-dev/cbjs/discussions).