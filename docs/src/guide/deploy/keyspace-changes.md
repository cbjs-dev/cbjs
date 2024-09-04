---
title: Keyspace changes | Deploy Couchbase Cluster
outline: [2, 3]
---

# Keyspaces & Indexes

To keep your keyspaces in sync with your cluster and share the changes with your team you can write the keyspaces in a file that will be used to create, update and delete the keyspaces.

## Example

```ts
const changes = getCouchbaseClusterChanges(currentConfig, nextConfig);
await applyCouchbaseClusterChanges(changes);
```

::: tip
If your test framework offers the possibility for setup files, like `globalSetup` with vitest, this is the perfect place to sync your keyspaces
:::

## Configuration

The keyspaces are written in a tree-like object.  
You specify buckets, scopes, collections and there indexes.

```ts twoslash
import { CouchbaseClusterConfig } from '@cbjsdev/deploy';

const config: CouchbaseClusterConfig = {
  myBucket: {
    ramQuotaMB: 1024,
    scopes: {
      scopeOne: {
        collections: {
          collectionOne: {
            maxExpiry: 120,
            history: true,
            indexes: {
              group: {
                keys: ['groupId'],
                where: 'groupId != "groupSystem"'
              }
            }
          },
        }
      }
    }
  }
}
```

## Behavior

The function `getCouchbaseClusterChanges` will compare the previous configuration with the new one and determine the changes to apply.

You need to provide a previous configuration in order to manage the deletion of former keyspaces.  
It's up to you to store your previous configuration. You can store the previous configuration in your database or on disk, for example.

You can then pass the changes to `applyCouchbaseClusterChanges`.
Each change will be applied and awaited. This means means that if you create an index, it will only return once the index is fully available and built.

## Deletions

Deletions are executed first, to make sure there is enough space to proceed.  
This can cause some issues with indexes, since the index being rebuilt won't be able to serve queries during that time. If this is an issue, you should consider creating a separate index with a different name, apply that change and then remove the obsolete index.