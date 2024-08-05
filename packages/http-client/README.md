<h1 align="center">
 <img src="https://github.com/cbjs-dev/cbjs/raw/main/docs/src/public/cbjs-logotype.svg" height="120" />
</h1>
<p align="center">
A Couchbase HTTP Client for Node.js & TypeScript.
<p>

<p align="center">
    <img src="https://img.shields.io/badge/%20-couchbase-ec1218?logo=data:image/svg%2bxml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyB3aWR0aD0iMTM0IiBoZWlnaHQ9IjEzNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxjaXJjbGUgcj0iNjciIGN4PSI2NyIgY3k9IjY3IiBmaWxsPSIjZmZmZmZmICIvPgogICAgPHBhdGggZmlsbD0iI0VDMTIxOEZGIiBkPSJNIDExMS41NSA3OS4xNSBDIDExMS41NSA4My4xNSAxMDkuMjUgODYuNjUgMTA0Ljc1IDg3LjQ1IEMgOTYuOTUgODguODUgODAuNTUgODkuNjUgNjYuODUgODkuNjUgQyA1My4xNSA4OS42NSAzNi43NSA4OC44NSAyOC45NSA4Ny40NSBDIDI0LjQ1IDg2LjY1IDIyLjE1IDgzLjE1IDIyLjE1IDc5LjE1IEMgMjIuMTUgNzAuNTUgMjIuMTUgNjEuOTUgMjIuMTUgNTMuMzUgQyAyMi4xNSA0OS4zNSAyNS4yNSA0NS42NSAyOC45NSA0NS4wNSBDIDMxLjI1IDQ0LjY1IDM2LjY1IDQ0LjI1IDQwLjg1IDQ0LjI1IEMgNDIuNDUgNDQuMjUgNDMuNzUgNDUuNDUgNDMuNzUgNDcuMzUgTCA0My43NSA2NS40NSBDIDUxLjg1IDY1LjQ1IDU4Ljg1IDY0Ljk1IDY2Ljk1IDY0Ljk1IEMgNzUuMDUgNjQuOTUgODIuMDUgNjUuNDUgOTAuMTUgNjUuNDUgTCA5MC4xNSA0Ny4zNSBDIDkwLjE1IDQ1LjQ1IDkxLjQ1IDQ0LjI1IDkzLjA1IDQ0LjI1IEMgOTcuMjUgNDQuMjUgMTAyLjY1IDQ0LjY1IDEwNC45NSA0NS4wNSBDIDEwOC43NSA0NS42NSAxMTEuNzUgNDkuMzUgMTExLjc1IDUzLjM1IEMgMTExLjU1IDYxLjk1IDExMS41NSA3MC41NSAxMTEuNTUgNzkuMTUgWiIgLz4KPC9zdmc+" />
 <a href="https://www.npmjs.com/package/@cbjsdev/http-client"><img src="https://img.shields.io/npm/v/@cbjsdev/http-client?label=http-client" /></a>
 <a href="https://github.com/cbjs-dev/cbjs/actions/workflows/tests.yml"><img src="https://github.com/cbjs-dev/cbjs/actions/workflows/tests.yml/badge.svg?branch=main" /></a>
</p>

<p align="center">
 <a href="https://cbjs.dev">Documentation</a> | <a href="https://cbjs.dev/guide/http-client/">Getting Started</a> | <a href="https://cbjs.dev/guide/why.html">Why Cbjs?</a>
</p>

## Getting started

To get started with the Couchbase HTTP Client, install the package :

```bash
npm install @cbjsdev/http-client
```

## Actions

The Couchbase REST API is vast. This package currently support the following :

### Cluster
* [initCluster](https://cbjs.dev/guide/http-client/actions.html#initcluster)
* [setIndexerSettings](https://cbjs.dev/guide/http-client/actions.html#setindexersettings)
* [getClusterRelease](https://cbjs.dev/guide/http-client/actions.html#getclusterrelease)
* [getClusterRootCertificates](https://cbjs.dev/guide/http-client/actions.html#getclusterrootcertificates)
* [versionSupportsFeatures](https://cbjs.dev/guide/http-client/actions.html#versionsupportsfeatures)
* [getPool](https://cbjs.dev/guide/http-client/actions.html#getpool)

### Analytics
* [createAnalyticsLink](https://cbjs.dev/guide/http-client/actions.html#createanalyticslink)
* [getAnalyticsLinks](https://cbjs.dev/guide/http-client/actions.html#getanalyticslinks)
* [getAnalyticsClusterStatus](https://cbjs.dev/guide/http-client/actions.html#getanalyticsclusterstatus)

### Eventing
* [deployEventingFunction](https://cbjs.dev/guide/http-client/actions.html#deployeventingfunction)
* [pauseEventingFunction](https://cbjs.dev/guide/http-client/actions.html#pauseeventingfunction)
* [resumeEventingFunction](https://cbjs.dev/guide/http-client/actions.html#resumeeventingfunction)
* [undeployEventingFunction](https://cbjs.dev/guide/http-client/actions.html#undeployeventingfunction)
* [dropEventingFunction](https://cbjs.dev/guide/http-client/actions.html#dropeventingfunction)
* [getEventingFunctionStatus](https://cbjs.dev/guide/http-client/actions.html#geteventingfunctionstatus)
* [getEventingFunctions](https://cbjs.dev/guide/http-client/actions.html#geteventingfunctions)

### KeyValue
* [getBucket](https://cbjs.dev/guide/http-client/actions.html#getbucket)
* [getScope](https://cbjs.dev/guide/http-client/actions.html#getscope)
* [getCollections](https://cbjs.dev/guide/http-client/actions.html#getcollections)

### Query
* [executeStatement](https://cbjs.dev/guide/http-client/actions.html#executestatement)
* [getQueryBuckets](https://cbjs.dev/guide/http-client/actions.html#getquerybuckets)
* [getQueryIndexes](https://cbjs.dev/guide/http-client/actions.html#getqueryindexes)
* [getQueryIndexRemainingMutations](https://cbjs.dev/guide/http-client/actions.html#getqueryindexremainingmutations)
* [getQuerySearchIndexes](https://cbjs.dev/guide/http-client/actions.html#getquerysearchindexes)

### RBAC
* [getScope](https://cbjs.dev/guide/http-client/actions.html#getscope)
* [getUsers](https://cbjs.dev/guide/http-client/actions.html#getusers)
* [getUserGroup](https://cbjs.dev/guide/http-client/actions.html#getusergroup)
* [getUserGroups](https://cbjs.dev/guide/http-client/actions.html#getusergroups)
* [getRoles](https://cbjs.dev/guide/http-client/actions.html#getroles)

### Search / FTS
* [getSearchIndex](https://cbjs.dev/guide/http-client/actions.html#getsearchindex)
* [getSearchIndexes](https://cbjs.dev/guide/http-client/actions.html#getsearchindexes)
* [getSearchIndexStatistics](https://cbjs.dev/guide/http-client/actions.html#getsearchindexstatistics)

### Stats
* [getIndexerStatistics](https://cbjs.dev/guide/http-client/actions.html#getindexerstatistics)
* [getStatistics](https://cbjs.dev/guide/http-client/actions.html#getstatistics)

### Views
* [getViewDesignDocuments](https://cbjs.dev/guide/http-client/actions.html#getviewdesigndocuments)

## WaitFor

This section is dedicated to functions that waits for a resource to reach a certain status.

* [waitForBucket](https://cbjs.dev/guide/http-client/wait-for.html#waitforbucket)
* [waitForScope](https://cbjs.dev/guide/http-client/wait-for.html#waitforscope)
* [waitForCollection](https://cbjs.dev/guide/http-client/wait-for.html#waitforcollection)
* [waitForEventingFunction](https://cbjs.dev/guide/http-client/wait-for.html#waitforeventingfunction)
* [waitForQueryIndexer](https://cbjs.dev/guide/http-client/wait-for.html#waitforqueryindexer)
* [waitForQueryIndex](https://cbjs.dev/guide/http-client/wait-for.html#waitforqueryindex)
* [waitForSearchIndex](https://cbjs.dev/guide/http-client/wait-for.html#waitforsearchindex)
* [waitForUser](https://cbjs.dev/guide/http-client/wait-for.html#waitforuser)
* [waitForUserGroup](https://cbjs.dev/guide/http-client/wait-for.html#waitforusergroup)
* [waitForViewDesignDocument](https://cbjs.dev/guide/http-client/wait-for.html#waitforviewdesigndocument)
* [waitForAnalyticsCluster](https://cbjs.dev/guide/http-client/wait-for.html#waitforanalyticscluster)

## License

Apache 2.0 license.
