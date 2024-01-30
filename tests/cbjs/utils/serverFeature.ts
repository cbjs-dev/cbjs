/*
 * Copyright (c) 2023-Present Jonathan MASSUCHETTI <jonathan.massuchetti@dappit.fr>.
 * Copyright (c) 2013-Present Couchbase Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { gte } from 'semver';

import { clusterRelease } from './clusterRelease';

export const ServerFeatures = {
  KeyValue: 'kv',
  Ssl: 'ssl',
  Views: 'views',
  SpatialViews: 'spatial_views',
  Query: 'query',
  Subdoc: 'subdoc',
  Xattr: 'xattr',
  Search: 'search',
  Analytics: 'analytics',
  Collections: 'collections',
  Replicas: 'replicas',
  UserManagement: 'user_management',
  BucketManagement: 'bucket_management',
  GetMeta: 'get_meta',
  AnalyticsPendingMutations: 'analytics_pending_mutations',
  UserGroupManagement: 'user_group_management',
  PreserveExpiry: 'preserve_expiry',
  Eventing: 'eventing',
  Transactions: 'transactions',
  ServerDurability: 'server_durability',
  RangeScan: 'range_scan',
  SubdocReadReplica: 'subdoc_read_replica',
  BucketDedup: 'bucket_dedup',
  UpdateCollectionMaxExpiry: 'update_collection_max_expiry',
  StorageBackend: 'storage_backend',
} as const;

export type ServerFeature = (typeof ServerFeatures)[keyof typeof ServerFeatures];

export function serverSupportsFeatures(...features: ServerFeature[]): boolean {
  return features.every((f) => versionSupports(clusterRelease.version, f));
}

export function versionSupports(version: string, feature: ServerFeature) {
  switch (feature) {
    case ServerFeatures.KeyValue:
    case ServerFeatures.Ssl:
    case ServerFeatures.SpatialViews:
    case ServerFeatures.Subdoc:
    case ServerFeatures.Views:
    case ServerFeatures.Replicas:
    case ServerFeatures.Search:
    case ServerFeatures.Query:
    case ServerFeatures.BucketManagement:
    case ServerFeatures.Xattr:
    case ServerFeatures.GetMeta:
      return true;
    case ServerFeatures.Analytics:
    case ServerFeatures.UserManagement:
      return gte(version, '6.0.0');
    case ServerFeatures.UserGroupManagement:
    case ServerFeatures.AnalyticsPendingMutations:
    case ServerFeatures.ServerDurability:
      return gte(version, '6.5.0');
    case ServerFeatures.Collections:
    case ServerFeatures.PreserveExpiry:
    case ServerFeatures.Eventing:
    case ServerFeatures.Transactions:
    case ServerFeatures.StorageBackend:
      return gte(version, '7.0.0');
    case ServerFeatures.BucketDedup:
      return gte(version, '7.2.0');
    case ServerFeatures.RangeScan:
    case ServerFeatures.SubdocReadReplica:
    case ServerFeatures.UpdateCollectionMaxExpiry:
      return gte(version, '7.5.0');
  }

  throw new Error(`Unknown feature '${feature}'`);
}