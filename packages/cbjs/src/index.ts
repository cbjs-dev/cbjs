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

export * from './analyticsindexmanager.js';
export * from './analyticstypes.js';
export * from './authenticators.js';
export type {
  AppendOptions,
  PrependOptions,
  IncrementOptions,
  DecrementOptions,
} from './binarycollection.js';
export * from './bucket.js';
export * from './bucketmanager.js';
export * from './cluster.js';
export * from './couchbase.js';
export * from './collection.js';
export * from './collectionmanager.js';
export { type IConfigProfile, connectionProfiles } from './configProfile.js';
export * from './crudoptypes.js';
export * from './services/kv/dataStructures/index.js';
export * from './diagnosticstypes.js';
export * from './errorcontexts.js';
export * from './errors.js';
export * from './eventingfunctionmanager.js';
export * from './generaltypes.js';
export * from './mutationstate.js';
export * from './queryindexmanager.js';
export * from './querytypes.js';
export * from './rangeScan.js';
export * from './scope.js';
export * from './scopesearchindexmanager.js';
export * from './sdspecs.js';
export * from './searchfacet.js';
export * from './searchindexmanager.js';
export * from './searchquery.js';
export * from './searchsort.js';
export * from './searchtypes.js';
export * from './streamablepromises.js';
export * from './transactions.js';
export * from './transcoders.js';
export * from './usermanager.js';
export { type Cas, CouchbaseCas } from './utilities.js';
export * from './vectorsearch.js';
export * from './viewexecutor.js';
export * from './viewindexmanager.js';
export * from './viewtypes.js';

export * from './clusterTypes/index.js';

export type {
  Keyspace,
  CasInput,
  CouchbaseCasInput,
  QueryContext,
} from '@cbjsdev/shared';
export {
  keyspacePath,
  namespacedKeyspacePath,
  isPartialKeyspace,
  quoteIdentifier,
  quotePath,
} from '@cbjsdev/shared';
