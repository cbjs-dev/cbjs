---
title: Actions - Couchbase HTTP Client
outline: [2, 3]
---

# Actions 

Cbjs HTTP Client offers several functions to perform various retrieval or mutations on different services.

## Cluster

### initCluster

Use this to setup a new cluster. Useful for CI and deployment automation.  
Don't forget to use [`setIndexerSettings`](#setindexersettings) if you use the `query` service.

```ts twoslash
import { CouchbaseHttpApiConfig, InitClusterParams } from '@cbjsdev/http-client';
// ---cut-before---

declare function initCluster(
  apiConfig: CouchbaseHttpApiConfig, 
  initClusterParams: InitClusterParams
): Promise<void>;
```

### setIndexerSettings

Configures the indexer of the `query` service.

```ts twoslash
import { CouchbaseHttpApiConfig, CouchbaseIndexerSettings } from '@cbjsdev/http-client';
// ---cut-before---
declare function setIndexerSettings(
  apiConfig: CouchbaseHttpApiConfig, 
  settings: CouchbaseIndexerSettings
): Promise<void>;
```

### getClusterRelease

Retrieves information about the cluster release.  
Example : `{ version: '7.2.4', build: '1337', flavor: 'enterprise' }`

```ts twoslash
import { CouchbaseHttpApiConfig, ClusterRelease } from '@cbjsdev/http-client';
// ---cut-before---
declare function getClusterRelease(
  apiConfig: CouchbaseHttpApiConfig
): Promise<ClusterRelease>;
```

### getClusterRootCertificates

Retrieves the root certificates of the cluster. Useful to bootstrap some automation mechanism.

```ts twoslash
import { CouchbaseHttpApiConfig, ApiCertificate } from '@cbjsdev/http-client';
// ---cut-before---
declare function getClusterRootCertificates(
  apiConfig: CouchbaseHttpApiConfig
): Promise<ApiCertificate[]>;
```

### versionSupportsFeatures

Checks if a particular release number supports a feature.

```ts twoslash
import { CouchbaseHttpApiConfig, ClusterRelease, ServerFeature, ServerFeatures } from '@cbjsdev/http-client';

// ---cut-before---
declare function versionSupportsFeatures(
  version: string,
  ...features: ServerFeature[]
): boolean;

// Example
const isSupported = versionSupportsFeatures(
  '7.2.4',
  ServerFeatures.ServerDurability,
  ServerFeatures.SubdocReadReplica
);
```

### getPool

Retrieves information about the cluster pool.

```ts twoslash
import { CouchbaseHttpApiConfig, ApiPool } from '@cbjsdev/http-client';
// ---cut-before---
declare function getPool(
  params: Omit<CouchbaseHttpApiConfig, 'poolNodes'>, 
  poolName?: string
): Promise<ApiPool>;
```

## Analytics

### createAnalyticsLink

Creates a links to feed your analytics dataverse.

```ts twoslash
import { CouchbaseHttpApiConfig, ApiAnalyticsLink } from '@cbjsdev/http-client';
// ---cut-before---
declare function createAnalyticsLink(
  apiConfig: CouchbaseHttpApiConfig,
  link: ApiAnalyticsLink
): Promise<void>;
```

### getAnalyticsLinks

Retrieves the existing analytics links. You can filter by dataverse using the `scope` option.

```ts twoslash
import { CouchbaseHttpApiConfig, GetAnalyticsLinksOptions, ApiAnalyticsLink } from '@cbjsdev/http-client';
// ---cut-before---
declare function getAnalyticsLinks(
  apiConfig: CouchbaseHttpApiConfig,
  options?: GetAnalyticsLinksOptions
): Promise<ApiAnalyticsLink[]>;
```

### getAnalyticsClusterStatus

Retrieves various information about the current status of the analytics cluster.

```ts twoslash
import { CouchbaseHttpApiConfig, AnalyticsClusterStatus } from '@cbjsdev/http-client';
// ---cut-before---
declare function getAnalyticsClusterStatus(
  apiConfig: CouchbaseHttpApiConfig
): Promise<AnalyticsClusterStatus>;
```

## Eventing

### deployEventingFunction

Deploys an eventing function previously created.

```ts twoslash
import { CouchbaseHttpApiConfig, EventingFunctionScope } from '@cbjsdev/http-client';
// ---cut-before---
declare function deployEventingFunction(
  apiConfig: CouchbaseHttpApiConfig, 
  name: string, 
  scope?: EventingFunctionScope
): Promise<void>;
```

### pauseEventingFunction

Pauses an eventing function previously deployed.

```ts twoslash
import { CouchbaseHttpApiConfig, EventingFunctionScope } from '@cbjsdev/http-client';
// ---cut-before---
declare function pauseEventingFunction(
  apiConfig: CouchbaseHttpApiConfig, 
  name: string, 
  scope?: EventingFunctionScope
): Promise<void>;
```

### resumeEventingFunction

Resumes an eventing function previously paused.

```ts twoslash
import { CouchbaseHttpApiConfig, EventingFunctionScope } from '@cbjsdev/http-client';
// ---cut-before---
declare function resumeEventingFunction(
  apiConfig: CouchbaseHttpApiConfig, 
  name: string, 
  scope?: EventingFunctionScope
): Promise<void>;
```

### undeployEventingFunction

Undeploys an eventing function previously deployed.

```ts twoslash
import { CouchbaseHttpApiConfig, EventingFunctionScope } from '@cbjsdev/http-client';
// ---cut-before---
declare function undeployEventingFunction(
  apiConfig: CouchbaseHttpApiConfig, 
  name: string, 
  scope?: EventingFunctionScope
): Promise<void>;
```

### dropEventingFunction

Drops an eventing function previously created.

```ts twoslash
import { CouchbaseHttpApiConfig, EventingFunctionScope } from '@cbjsdev/http-client';
// ---cut-before---
declare function dropEventingFunction(
  apiConfig: CouchbaseHttpApiConfig, 
  name: string, 
  scope?: EventingFunctionScope
): Promise<void>;
```

### getEventingFunctionStatus

Retrieves the current status of an eventing function.

```ts twoslash
import { CouchbaseHttpApiConfig, ApiEventingFunctionStatus } from '@cbjsdev/http-client';
// ---cut-before---
declare function getEventingFunctions(
  apiConfig: CouchbaseHttpApiConfig,
): Promise<ApiEventingFunctionStatus>;
```

### getEventingFunctions

Retrieves the existing eventing functions.

```ts twoslash
import { CouchbaseHttpApiConfig, ApiEventingFunction } from '@cbjsdev/http-client';
// ---cut-before---
declare function getEventingFunctions(
  apiConfig: CouchbaseHttpApiConfig,
): Promise<ApiEventingFunction[]>;
```

## KeyValue

### getBucket

Retrieves the settings of a bucket.

```ts twoslash
import { CouchbaseHttpApiConfig, ApiBucket } from '@cbjsdev/http-client';
// ---cut-before---
declare function getBucket(
  apiConfig: CouchbaseHttpApiConfig, 
  bucketName: string
): Promise<ApiBucket>;
```

### getScope

Retrieves the scopes within a bucket.

```ts twoslash
import { CouchbaseHttpApiConfig, ApiBucketScopes } from '@cbjsdev/http-client';
// ---cut-before---
declare function getScopes(
  apiConfig: CouchbaseHttpApiConfig, 
  bucketName: string
): Promise<ApiBucketScopes>;
```

### getCollections

Retrieves the collections within a scope.

```ts twoslash
import { CouchbaseHttpApiConfig, ApiCollection } from '@cbjsdev/http-client';
// ---cut-before---
declare function getCollections(
  apiConfig: CouchbaseHttpApiConfig, 
  bucketName: string, 
  scopeName: string
): Promise<ApiCollection[]>;
```

## Query

### executeStatement

Executes an arbitrary query.

```ts twoslash
import { CouchbaseHttpApiConfig, ApiQueryResponseBody } from '@cbjsdev/http-client';
// ---cut-before---
declare function executeStatement<Result>(
  params: CouchbaseHttpApiConfig, 
  statement: string
): Promise<ApiQueryResponseBody<Result>>;
```

### getQueryBuckets

Retrieves the list of buckets visible from the `query` service.

```ts twoslash
import { CouchbaseHttpApiConfig } from '@cbjsdev/http-client';
// ---cut-before---
declare function getQueryBuckets(
  params: CouchbaseHttpApiConfig
): Promise<string[]>;
```

### getQueryIndexes

Return the list of all indexes within the given scope.

```ts twoslash
import { CouchbaseHttpApiConfig, Keyspace, HttpClientQueryIndex } from '@cbjsdev/http-client';
// ---cut-before---
declare function getQueryIndexes(
  params: CouchbaseHttpApiConfig, 
  options?: Partial<Keyspace>
): Promise<HttpClientQueryIndex[]>;
```

### getQueryIndexStats

Return the stats of the index, given by the indexer.

```ts twoslash
import { CouchbaseHttpApiConfig, Keyspace, HttpClientQueryIndexStats } from '@cbjsdev/http-client';

// ---cut-before---
declare function getQueryIndexStats(
  params: CouchbaseHttpApiConfig,
  indexName: string,
  keyspace: Keyspace
): Promise<HttpClientQueryIndexStats>;
```

### getQueryIndexRemainingMutations

Return the number of documents awaiting to be indexed.  
The value is the sum of the queued (not sent to the indexer) and
pending mutations (received by the indexer but not processed).

```ts twoslash
import { CouchbaseHttpApiConfig, Keyspace } from '@cbjsdev/http-client';
// ---cut-before---
declare function getQueryIndexRemainingMutations(
  params: CouchbaseHttpApiConfig, 
  indexName: string,
  keyspace: Keyspace
): Promise<number>;
```

### getQuerySearchIndexes

Retrieves the search indexes that are visible by the `query` service.
Useful when using `Flex Index` : leveraging full-text search within a SQL++ query.
You can filter by keyspace and by index name.

```ts twoslash
import { CouchbaseHttpApiConfig, HttpClientSearchIndex } from '@cbjsdev/http-client';
// ---cut-before---
declare function getQuerySearchIndexes(
  params: CouchbaseHttpApiConfig, 
  options?: {
      bucket?: string,
      scope?: string,
      collection?: string,
      index?: string;
    }
): Promise<HttpClientSearchIndex[]>;
```

### createQueryIndex

Create a query index.

```ts twoslash
import { CouchbaseHttpApiConfig, HttpClientSearchIndex, Keyspace, CreateQueryIndexOptions, CreateQueryIndexResponse } from '@cbjsdev/http-client';
// ---cut-before---
declare function createQueryIndex(
  params: CouchbaseHttpApiConfig,
  indexName: string,
  keyspace: Keyspace,
  config: {
    keys: string[],
    where?: string,
    numReplicas?: number
  },
  options?: CreateQueryIndexOptions
): Promise<CreateQueryIndexResponse>;
```

### updateQueryIndex

Update a query index.

```ts twoslash
import { CouchbaseHttpApiConfig, HttpClientSearchIndex, Keyspace, CreateQueryIndexOptions, CreateQueryIndexResponse } from '@cbjsdev/http-client';
// ---cut-before---
declare function updateQueryIndex(
  params: CouchbaseHttpApiConfig,
  indexName: string,
  keyspace: Keyspace,
  config: {
    action: 'move' | 'replica_count' | 'drop_replica';
    num_replica?: number;
    nodes?: string[];
    replicaId?: string;
  }
): Promise<[]>;
```

## RBAC

### getUser

Retrieves a user by its username. Can filter by domain using a third parameter.

```ts twoslash
import { CouchbaseHttpApiConfig, ApiUser } from '@cbjsdev/http-client';
// ---cut-before---
declare function getUser(
  apiConfig: CouchbaseHttpApiConfig, 
  username: string, 
  domain?: string
): Promise<ApiUser>;
```

### updateUserPassword

Update a user's password.

```ts twoslash
import { CouchbaseHttpApiConfig } from '@cbjsdev/http-client';
// ---cut-before---
declare function updateUserPassword(
  apiConfig: CouchbaseHttpApiConfig, 
  newPassword: string,
): Promise<void>;
```

### getUsers

Retrieves all the existing users.

```ts twoslash
import { CouchbaseHttpApiConfig, ApiUser } from '@cbjsdev/http-client';
// ---cut-before---
declare function getUsers(
  apiConfig: CouchbaseHttpApiConfig
): Promise<ApiUser[]>;
```

### getUserGroup

Retrieves a user group by its name.

```ts twoslash
import { CouchbaseHttpApiConfig, ApiUserGroup } from '@cbjsdev/http-client';
// ---cut-before---
declare function getUserGroup(
  apiConfig: CouchbaseHttpApiConfig, 
  name: string
): Promise<ApiUserGroup>;
```

### getUserGroups

Retrieves all the existing user groups.

```ts twoslash
import { CouchbaseHttpApiConfig, ApiUserGroup } from '@cbjsdev/http-client';
// ---cut-before---
declare function getUserGroups(
  apiConfig: CouchbaseHttpApiConfig
): Promise<ApiUserGroup[]>;
```

### getRoles

Retrieves all the existing roles.

```ts twoslash
import { CouchbaseHttpApiConfig, ApiRole } from '@cbjsdev/http-client';
// ---cut-before---
declare function getRoles(
  apiConfig: CouchbaseHttpApiConfig
): Promise<ApiRole[]>;
```


## Search / FTS

### getSearchIndex

Retrieves information about a search index.

```ts twoslash
import { CouchbaseHttpApiConfig, ApiSearchGetIndex } from '@cbjsdev/http-client';
// ---cut-before---
declare function getSearchIndex(
  params: CouchbaseHttpApiConfig, 
  indexName: string
): Promise<ApiSearchGetIndex>;
```

### getSearchIndexes

Retrieves all the existing search indexes.

```ts twoslash
import { CouchbaseHttpApiConfig, ApiSearchGetAllIndexes } from '@cbjsdev/http-client';
// ---cut-before---
declare function getSearchIndexes(
  params: CouchbaseHttpApiConfig
): Promise<ApiSearchGetAllIndexes>;
```

### getSearchIndexStatistics

Retrieves the statistics related to a search index.

```ts twoslash
import { CouchbaseHttpApiConfig, ApiSearchGetIndex } from '@cbjsdev/http-client';
// ---cut-before---
declare function getSearchIndexStatistics(
  params: CouchbaseHttpApiConfig, 
  indexName: string
): Promise<ApiSearchGetIndex>;
```

## Stats

### getIndexerStatistics

Retrieves various statistics about the query indexer.

```ts twoslash
import { CouchbaseHttpApiConfig, IndexerStatistics } from '@cbjsdev/http-client';
// ---cut-before---
declare function getIndexerStatistics(
  apiConfig: CouchbaseHttpApiConfig, 
  skipEmpty?: boolean
): Promise<IndexerStatistics['indexer']>;
```

### getStatistics

Retrieves multiple statistics at once.

```ts twoslash
import { CouchbaseHttpApiConfig, StatisticDefinition, StatisticsResult } from '@cbjsdev/http-client';
// ---cut-before---
declare function getStatistics(
  apiConfig: CouchbaseHttpApiConfig, 
  stats: [StatisticDefinition, ...StatisticDefinition[]]
): Promise<[StatisticsResult, ...StatisticsResult[]]>;
```

## Views

### getViewDesignDocuments

Retrieves the views existing within a bucket.

```ts twoslash
import { CouchbaseHttpApiConfig, ApiViewDesignDocuments } from '@cbjsdev/http-client';
// ---cut-before---
declare function getViewDesignDocuments(params: CouchbaseHttpApiConfig, bucketName: string): Promise<ApiViewDesignDocuments>;
```
