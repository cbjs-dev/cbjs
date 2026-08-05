---
title: Keyspace changes | Deploy Couchbase Cluster
outline: [2, 3]
---

# Cluster configuration

To keep your cluster configuration in sync and share the changes with your team,  you can write the configuration in a file that will be used to create, update and delete the keyspaces, indexes and users.

## Example

```ts twoslash
import { connect } from '@cbjsdev/cbjs';
import { CouchbaseHttpApiConfig } from '@cbjsdev/http-client';
import {
  applyCouchbaseClusterChanges,
  buildCouchbaseClusterConfig,
  canonicalizeIndexConfigs,
  CouchbaseClusterConfig,
  getCouchbaseClusterChanges,
} from '@cbjsdev/deploy';

declare const nextConfig: CouchbaseClusterConfig;
declare const apiConfig: CouchbaseHttpApiConfig;
// ---cut-before---
const cluster = await connect('couchbase://localhost', {
  username: 'Administrator',
  password: 'password',
});

const currentConfig = await buildCouchbaseClusterConfig(cluster);
const canonicalConfig = await canonicalizeIndexConfigs(apiConfig, currentConfig, nextConfig);
const changes = getCouchbaseClusterChanges(currentConfig, canonicalConfig);

await applyCouchbaseClusterChanges(cluster, apiConfig, changes);
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

### Expression keys and the `WHERE` clause

Index keys and the `WHERE` predicate accept arbitrary N1QL expressions.  
The server does not store the text you send : it parses it and re-prints it from its own AST.

```sql
-- declared
CREATE INDEX `idx_active` ON `myBucket`.`scopeOne`.`collectionOne`(OBJECT_LENGTH(timeEntries) > 0)

-- reported by the server
CREATE INDEX `idx_active` ON `myBucket`.`scopeOne`.`collectionOne`((0 < object_length(`timeEntries`)))
```

A textual comparison with the live cluster would therefore report a change on every deployment, and the index would be needlessly dropped and recreated every time.

This is what `canonicalizeIndexConfigs` prevents.  
It asks the server to parse and re-print your declared definitions with `EXPLAIN CREATE INDEX` - a planning-only statement that creates nothing - and rewrites them into the exact form the cluster reports.  
Definitions that already match the cluster are left untouched, so simple keys like `groupId` don't trigger any request.

::: tip
Because the server parses every definition, a typo in an index expression is rejected at this stage, before any change is applied to your cluster.
:::

When an index has really changed, the emitted `recreateIndex` change carries `changedProperties`, so you can review why the index will be recreated : `keys`, `where` or `with`.

## Behavior

The function `getCouchbaseClusterChanges` will compare the previous configuration with the new one and determine the changes to apply.

You need to provide a previous configuration in order to manage the deletion of former keyspaces/users/indexes. If no previous configuration is given, only updates and creation are performed.

You can read the current configuration from the live cluster with `buildCouchbaseClusterConfig`, or store the previous configuration yourself - in your database or on disk, for example.

When the current configuration comes from the live cluster, pass your target configuration through `canonicalizeIndexConfigs` before the comparison : the index definitions reported by the server never match your declared text - see [Expression keys](#expression-keys-and-the-where-clause).

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