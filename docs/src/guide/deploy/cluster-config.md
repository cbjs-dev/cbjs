---
title: Keyspace changes | Deploy Couchbase Cluster
outline: [2, 3]
---

# Cluster configuration

To keep your cluster configuration in sync and share the changes with your team,  you can write the configuration in a file that will be used to create, update and delete the keyspaces, indexes and users.

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
  keyspaces: {
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
  },
  users: [
    {
      username: 'lee_koss',
      password: 'password',
      roles: [{ name: 'fts_admin', bucket: 'myBucket'}]
    }
  ]
}
```

### Index options

The options of the `WITH` clause of `CREATE INDEX` are declared with `with`.  
This is how you create a vector index :

```ts twoslash
import { CouchbaseClusterConfig } from '@cbjsdev/deploy';

const config: CouchbaseClusterConfig = {
  keyspaces: {
    myBucket: {
      ramQuotaMB: 1024,
      scopes: {
        scopeOne: {
          collections: {
            embedding: {
              indexes: {
                idx_embedding_vector: {
                  keys: ['organizationId', 'sourceCollection', '`vector` VECTOR'],
                  with: {
                    dimension: 768,
                    similarity: 'DOT',
                    description: 'IVF,SQ8'
                  }
                }
              }
            },
          }
        }
      }
    }
  },
  users: []
}
```

Which creates the following index :

```sql
CREATE INDEX `idx_embedding_vector`
  ON `myBucket`.`scopeOne`.`embedding`(organizationId, sourceCollection, `vector` VECTOR)
  WITH {"dimension":768,"similarity":"DOT","description":"IVF,SQ8"}
```

The documented options are typed, but any other option is accepted and sent to the server as-is.

::: tip
Only the options you declare are compared to the cluster : the server reports its own defaults - `num_partition`, `scan_nprobes`, … - and normalizes some values, which would otherwise be seen as a change on every deployment.
:::

Changing an option requires the index to be recreated. Use `numReplicas` rather than `with.num_replica` : a change of the number of replicas is applied with `ALTER INDEX`, without recreating the index.

## Behavior

The function `getCouchbaseClusterChanges` will compare the previous configuration with the new one and determine the changes to apply.

You need to provide a previous configuration in order to manage the deletion of former keyspaces/users/indexes. If no previous configuration is given, only updates and creation are performed.

It's up to you to store your previous configuration. You can store the previous configuration in your database or on disk, for example.

You can then pass the changes to `applyCouchbaseClusterChanges`.
Each change will be applied and awaited. This means means that if you create an index, it will only return once the index is fully available and built.

## Creations

If a bucket/scope/collection/index is scheduled for creation but already exists in the cluster, its creation will be skipped, regardless of its existing configuration.

## Deletions

Deletions are executed first, to make sure there is enough space to proceed.  
This can cause some issues with indexes, since the index being rebuilt won't be able to serve queries during that time. If this is an issue, you should consider creating a separate index with a different name, apply that change and then remove the obsolete index.

## User password

During creation, the password is required.
Once created, the password can be omitted, but if it is set again later in the future, since the last config won't have the password, the user will be recreated.