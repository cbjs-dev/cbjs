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

> [!IMPORTANT]
> This package is part of the Cbjs project.

## Getting started

```bash
npm install @cbjsdev/deploy
```

Create a cluster config file that will hold your keyspaces, indexes and users definitions :

```ts
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

## Applying changes

You can apply changes by executing those two lines of codes.

```ts
const changes = getCouchbaseClusterChanges(currentConfig, nextConfig);
await applyCouchbaseClusterChanges(changes);
```