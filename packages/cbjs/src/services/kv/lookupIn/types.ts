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
import { DocDef, PromiseValue } from '@cbjsdev/shared';
import { LookupInSpecResults, NarrowLookupSpecs } from '../../../clusterTypes/kv/lookup/lookupIn.types.js';
import { LookupInAllReplicasOptions, LookupInAnyReplicaOptions, LookupInOptions } from '../../../collection.js';
import { LookupInReplicaResult, LookupInResult } from '../../../crudoptypes.js';
import { LookupInSpec } from '../../../sdspecs.js';
import { NodeCallback } from '../../../utilities.js';

export type LookupMethodName = 'lookupIn' | 'lookupInAnyReplica' | 'lookupInAllReplicas';

export type LookupMethod<
  Method extends LookupMethodName,
  SpecDefinitions extends ReadonlyArray<LookupInSpec>,
  MatchingDocDefs extends DocDef,
  ThrowOnSpecError extends boolean
> = {
  lookupIn: (
    key: string,
    specs: SpecDefinitions,
    options: LookupInOptions<ThrowOnSpecError> | undefined
  ) => Promise<LookupInResult<LookupInSpecResults<SpecDefinitions, MatchingDocDefs>, ThrowOnSpecError>>;
  lookupInAnyReplica: (
    key: string,
    specs: SpecDefinitions,
    options: LookupInAnyReplicaOptions<ThrowOnSpecError> | undefined
  ) => Promise<LookupInReplicaResult<LookupInSpecResults<SpecDefinitions, MatchingDocDefs>, ThrowOnSpecError>>;
  lookupInAllReplicas: (
    key: string,
    specs: SpecDefinitions,
    options: LookupInAllReplicasOptions<ThrowOnSpecError> | undefined
  ) => Promise<LookupInReplicaResult<LookupInSpecResults<SpecDefinitions, MatchingDocDefs>, ThrowOnSpecError>[]>;
}[Method];

export type LookupResult<
  Method extends LookupMethodName,
  SpecDefinitions extends ReadonlyArray<LookupInSpec>,
  MatchingDocDefs extends DocDef,
  ThrowOnSpecError extends boolean
> = PromiseValue<ReturnType<LookupMethod<Method, SpecDefinitions, MatchingDocDefs, ThrowOnSpecError>>>;

export type LookupInArgs<
  Def extends DocDef,
  SpecDefinitions extends ReadonlyArray<LookupInSpec<Def>>,
  OpResult,
  ThrowOnSpecError extends boolean
> = readonly [
      specsOrOptions?: LookupInOptions<ThrowOnSpecError> | LookupInAnyReplicaOptions<ThrowOnSpecError> | LookupInAllReplicasOptions<ThrowOnSpecError> | NarrowLookupSpecs<Def, SpecDefinitions>,
      optionsOrCallback?: LookupInOptions<ThrowOnSpecError> | LookupInAnyReplicaOptions<ThrowOnSpecError> | LookupInAllReplicasOptions<ThrowOnSpecError> | NodeCallback<OpResult>,
      callback?: NodeCallback<OpResult>
    ]
;

// export type LookupInReturnType<
//   C extends AnyCollection,
//   Method extends LookupMethodName,
//   Key extends ExtractCollectionJsonDocKey<C>,
//   SpecDefinitions,
//   ThrowOnSpecError extends boolean
// > =
//   SpecDefinitions extends ReadonlyArray<LookupInSpec> ?
//     If<
//       IsArrayLengthKnown<SpecDefinitions>,
//       Promise<LookupResult<Method, ExtractCollectionJsonDocDef<C, Key>, SpecDefinitions, ThrowOnSpecError>>,
//       ChainableLookupIn<C, Method, Key, [], ThrowOnSpecError>
//     > :
//   ChainableLookupIn<C, Method, Key, [], ThrowOnSpecError>
// ;
