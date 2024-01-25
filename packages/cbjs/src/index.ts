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

export * from './analyticsindexmanager';
export * from './analyticstypes';
export * from './authenticators';
export type {
  AppendOptions,
  PrependOptions,
  IncrementOptions,
  DecrementOptions,
} from './binarycollection';
export * from './bucket';
export * from './bucketmanager';
export * from './cluster';
export * from './couchbase';
export * from './collection';
export * from './collectionmanager';
export { type IConfigProfile, connectionProfiles } from './configProfile';
export * from './crudoptypes';
export * from './datastructures';
export * from './diagnosticstypes';
export * from './errorcontexts';
export * from './errors';
export * from './eventingfunctionmanager';
export * from './generaltypes';
export * from './mutationstate';
export * from './queryindexmanager';
export * from './querytypes';
export * from './rangeScan';
export * from './scope';
export * from './sdspecs';
export * from './searchfacet';
export * from './searchindexmanager';
export * from './searchquery';
export * from './searchsort';
export * from './searchtypes';
export * from './streamablepromises';
export * from './transactions';
export * from './transcoders';
export * from './usermanager';
export { type Cas, CouchbaseCas } from './utilities';
export * from './viewexecutor';
export * from './viewindexmanager';
export * from './viewtypes';

export type * from './clusterTypes';

export type {
  Keyspace
} from '@cbjs/shared';

export type {
  CppProtocolSubdocOpcode
} from './binding';

// Later export as "@cbjs/cbjs/internals"

export { ConnSpec } from './connspec';