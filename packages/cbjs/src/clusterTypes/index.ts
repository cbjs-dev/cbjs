/*
 * Copyright (c) 2023-Present Jonathan MASSUCHETTI <jonathan.massuchetti@dappit.fr>.
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

export type {
  ClusterTypesWith,
  DefaultScope,
  DefaultCollection,
  AnyCollection,
  AnyScope,
  AnyBucket,
  AnyCluster,
  ClusterCollection,
  ClusterScope,
  ClusterBucket,
} from './clusterTypes.js';

export type {
  LookupInCountPath,
  LookupInGetPath,
  LookupInExistsPath,
} from './kv/lookup/lookupOperations.types.js';

export type {
  MutateInReplacePath,
  MutateInUpsertPath,
  MutateInInsertPath,
  MutateInRemovePath,
  MutateInArrayAppendPath,
  MutateInArrayPrependPath,
  MutateInArrayAddUniquePath,
  MutateInArrayInsertPath,
  MutateInBinaryPath,
} from './kv/mutation/mutationOperations.types.js';

export type {
  CouchbaseClusterTypes,
  DefaultClusterTypes,
  BucketName,
  ScopeName,
  DocDef,
  CollectionName,
  ClusterTypesOptions,
} from '@cbjsdev/shared';
