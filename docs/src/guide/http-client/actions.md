---
title: Actions - Couchbase HTTP Client
---

# Actions 

Cbjs HTTP Client offers several functions to perform various retrieval or mutations on different services.  

All the functions of the http client take the api config as the first parameter: 

```ts twoslash
export type CouchbaseHttpApiConfig = {
  hostname: string;
  secure: boolean;
  credentials: {
    username: string;
    password: string;
  };
  timeout?: number;
};
```

## Cluster

```ts twoslash
import { CouchbaseHttpApiConfig, ClusterRelease, ApiPool, ApiPoolNodes, InitClusterParams, CouchbaseIndexerSettings, ServerFeature } from '@cbjsdev/http-client';
// ---cut-before---
declare function getClusterRelease(apiConfig: CouchbaseHttpApiConfig): Promise<ClusterRelease>;
declare function releaseSupportsFeatures(clusterRelease: ClusterRelease, ...features: ServerFeature[]): boolean;
declare function versionSupports(version: string, feature: ServerFeature): boolean;
declare function getPool(params: Omit<CouchbaseHttpApiConfig, 'poolNodes'>, poolName?: string): Promise<ApiPool>;
declare function getPoolNodes(params: Omit<CouchbaseHttpApiConfig, 'poolNodes'>): Promise<ApiPoolNodes>;
declare function initCluster(apiConfig: CouchbaseHttpApiConfig, initClusterParams: InitClusterParams): Promise<void>;
declare function setIndexerSettings(apiConfig: CouchbaseHttpApiConfig, settings: CouchbaseIndexerSettings): Promise<void>;
```

## Analytics

```ts twoslash
import { CouchbaseHttpApiConfig, ApiAnalyticsLink, GetAnalyticsLinksOptions, AnalyticsClusterStatus } from '@cbjsdev/http-client';
// ---cut-before---
declare function createAnalyticsLink(apiConfig: CouchbaseHttpApiConfig, link: ApiAnalyticsLink): Promise<void>;
declare function getAnalyticsLinks(apiConfig: CouchbaseHttpApiConfig, options?: GetAnalyticsLinksOptions): Promise<ApiAnalyticsLink[]>;
declare function getAnalyticsClusterStatus(apiConfig: CouchbaseHttpApiConfig): Promise<AnalyticsClusterStatus>;
```

## Eventing

```ts twoslash
import { CouchbaseHttpApiConfig, ApiEventingFunction, ApiEventingFunctionStatus, EventingFunctionScope } from '@cbjsdev/http-client';
// ---cut-before---
declare function deployEventingFunction(apiConfig: CouchbaseHttpApiConfig, name: string, scope?: EventingFunctionScope): Promise<void>;
declare function pauseEventingFunction(apiConfig: CouchbaseHttpApiConfig, name: string, scope?: EventingFunctionScope): Promise<void>;
declare function resumeEventingFunction(apiConfig: CouchbaseHttpApiConfig, name: string, scope?: EventingFunctionScope): Promise<void>;
declare function undeployEventingFunction(apiConfig: CouchbaseHttpApiConfig, name: string, scope?: EventingFunctionScope): Promise<void>;
declare function dropEventingFunction(apiConfig: CouchbaseHttpApiConfig, name: string, scope?: EventingFunctionScope): Promise<void>;
declare function getEventingFunctions(apiConfig: CouchbaseHttpApiConfig): Promise<ApiEventingFunction[]>;
declare function getEventingFunctionStatus(apiConfig: CouchbaseHttpApiConfig): Promise<ApiEventingFunctionStatus>;
```

## KeyValue

```ts twoslash
import { CouchbaseHttpApiConfig, ApiBucket, ApiBucketScopes, ApiCollection } from '@cbjsdev/http-client';
// ---cut-before---
declare function getBucket(apiConfig: CouchbaseHttpApiConfig, bucketName: string): Promise<ApiBucket>;
declare function getScopes(apiConfig: CouchbaseHttpApiConfig, bucketName: string): Promise<ApiBucketScopes>;
declare function getCollections(apiConfig: CouchbaseHttpApiConfig, bucketName: string, scopeName: string): Promise<ApiCollection[]>;
```

## Query

```ts twoslash
import { CouchbaseHttpApiConfig, Keyspace, ApiQueryResponseBody, HttpClientQueryIndex } from '@cbjsdev/http-client';
// ---cut-before---
/**
 * Execute an arbitrary query.
 */
declare function executeStatement<Result>(params: CouchbaseHttpApiConfig, statement: string): Promise<ApiQueryResponseBody<Result>>;
/**
 * Return the list of buckets visible from the Query service.
 */
declare function getQueryBuckets(params: CouchbaseHttpApiConfig): Promise<string[]>;

/**
 * Return the list of all indexes within the given scope.
 */
declare function getQueryIndexes(params: CouchbaseHttpApiConfig, options?: Partial<Keyspace>): Promise<HttpClientQueryIndex[]>;
```

## RBAC


```ts twoslash
import { CouchbaseHttpApiConfig, ApiUser, ApiUserGroup, ApiRole } from '@cbjsdev/http-client';
// ---cut-before---
declare function getUser(apiConfig: CouchbaseHttpApiConfig, username: string, domain?: string): Promise<ApiUser>;
declare function getUsers(apiConfig: CouchbaseHttpApiConfig): Promise<ApiUser[]>;
declare function getUserGroup(apiConfig: CouchbaseHttpApiConfig, name: string): Promise<ApiUserGroup>;
declare function getUserGroups(apiConfig: CouchbaseHttpApiConfig): Promise<ApiUserGroup[]>;
declare function getRoles(apiConfig: CouchbaseHttpApiConfig): Promise<ApiRole[]>;
```

## Search

```ts twoslash
import { CouchbaseHttpApiConfig, ApiSearchGetIndex, ApiSearchGetAllIndexes, Keyspace, HttpClientSearchIndex } from '@cbjsdev/http-client';
// ---cut-before---
declare function getSearchIndex(params: CouchbaseHttpApiConfig, indexName: string): Promise<ApiSearchGetIndex>;
declare function getSearchIndexes(params: CouchbaseHttpApiConfig): Promise<ApiSearchGetAllIndexes>;
declare function getSearchIndexStatistics(params: CouchbaseHttpApiConfig, indexName: string): Promise<ApiSearchGetIndex>;
/**
 * Return the search indexes visible by the query service
 */
declare function querySearchIndexes(params: CouchbaseHttpApiConfig, options?: Partial<Keyspace> & {
  index?: string;
}): Promise<HttpClientSearchIndex[]>;
```

## Stats

```ts twoslash
import { CouchbaseHttpApiConfig, IndexerStatistics, StatisticDefinition, StatisticsResult } from '@cbjsdev/http-client';
// ---cut-before---
declare function getIndexerStatistics(apiConfig: CouchbaseHttpApiConfig, skipEmpty?: boolean): Promise<IndexerStatistics['indexer']>;
declare function getStatistics(apiConfig: CouchbaseHttpApiConfig, stats: [StatisticDefinition, ...StatisticDefinition[]]): Promise<[StatisticsResult, ...StatisticsResult[]]>;
```

## Views

```ts twoslash
import { CouchbaseHttpApiConfig, ApiViewDesignDocuments } from '@cbjsdev/http-client';
// ---cut-before---
declare function getViewDesignDocuments(params: CouchbaseHttpApiConfig, bucketName: string): Promise<ApiViewDesignDocuments>;
```