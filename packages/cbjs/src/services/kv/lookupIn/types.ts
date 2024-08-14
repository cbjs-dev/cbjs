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
import { IsArrayLengthKnown, IsNever, PromiseValue } from '@cbjsdev/shared';
import { ExtractCollectionJsonDocDef, ExtractCollectionJsonDocKey } from '../../../clusterTypes/clusterTypes.js';
import { AnyCollection } from '../../../clusterTypes/index.js';
import { LookupInSpecResults, NarrowLookupSpecs } from '../../../clusterTypes/kv/lookup/lookupIn.types.js';
import { LookupInAllReplicasOptions, LookupInAnyReplicaOptions, LookupInOptions } from '../../../collection.js';
import { LookupInReplicaResult, LookupInResult } from '../../../crudoptypes.js';
import { LookupInSpec } from '../../../sdspecs.js';
import { NodeCallback } from '../../../utilities.js';
import { ChainableLookupIn } from './ChainableLookupIn.js';

export type LookupMethodName = 'lookupIn' | 'lookupInAnyReplica' | 'lookupInAllReplicas';

export type LookupResult<
  Method extends LookupMethodName,
  SpecDefinitions,
  MatchingDocDefs,
  ThrowOnSpecError extends boolean
> =
  Method extends 'lookupIn' ?
    LookupInResult<LookupInSpecResults<SpecDefinitions, MatchingDocDefs>, ThrowOnSpecError> :
  Method extends 'lookupInAnyReplica' ?
    LookupInReplicaResult<LookupInSpecResults<SpecDefinitions, MatchingDocDefs>, ThrowOnSpecError> :
  Method extends 'lookupIn' ?
    LookupInResult<LookupInSpecResults<SpecDefinitions, MatchingDocDefs>, ThrowOnSpecError> :
  PromiseValue<LookupInReplicaResult<LookupInSpecResults<SpecDefinitions, MatchingDocDefs>, ThrowOnSpecError>[]>;

export type LookupInArgs = readonly [
      specsOrOptions?: LookupInOptions<boolean> | LookupInAnyReplicaOptions<boolean> | LookupInAllReplicasOptions<boolean> | NarrowLookupSpecs<any, ReadonlyArray<LookupInSpec>>,
      optionsOrCallback?: LookupInOptions<boolean> | LookupInAnyReplicaOptions<boolean> | LookupInAllReplicasOptions<boolean> | NodeCallback<unknown>,
      callback?: NodeCallback<unknown>
    ]
;

export type LookupInReturnType<
  C extends AnyCollection,
  Method extends LookupMethodName,
  Key extends ExtractCollectionJsonDocKey<C>,
  SpecDefinitions,
  ThrowOnSpecError extends boolean
> =
  IsNever<SpecDefinitions> extends true ?
    ChainableLookupIn<C, Method, Key, [], ThrowOnSpecError> :
  IsArrayLengthKnown<SpecDefinitions> extends true ?
    Promise<LookupResult<Method, SpecDefinitions, ExtractCollectionJsonDocDef<C, Key>, ThrowOnSpecError>> :
  ChainableLookupIn<C, Method, Key, [], ThrowOnSpecError>
;