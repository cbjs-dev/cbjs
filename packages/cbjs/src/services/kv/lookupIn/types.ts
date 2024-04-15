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
import { If, IsArrayLengthKnown, PromiseValue } from '@cbjsdev/shared';

import { AnyCollection } from '../../../clusterTypes';
import { ExtractCollectionJsonDocBody, ExtractCollectionJsonDocKey } from '../../../clusterTypes/clusterTypes';
import { LookupInSpecResults, NarrowLookupSpecs } from '../../../clusterTypes/kv/lookup/lookupIn.types';
import { LookupInOptions } from '../../../collection';
import { LookupInReplicaResult, LookupInResult } from '../../../crudoptypes';
import { LookupInSpec } from '../../../sdspecs';
import { NodeCallback } from '../../../utilities';
import { ChainableLookupIn } from './ChainableLookupIn';

export type LookupMethodName = 'lookupIn' | 'lookupInAnyReplica' | 'lookupInAllReplicas';

export type LookupMethod<
  Method extends LookupMethodName,
  Doc,
  SpecDefinitions extends ReadonlyArray<LookupInSpec>
> = {
  lookupIn: (
    key: string,
    specs: SpecDefinitions,
    options: LookupInOptions | undefined
  ) => Promise<LookupInResult<LookupInSpecResults<SpecDefinitions, Doc>>>;
  lookupInAnyReplica: (
    key: string,
    specs: SpecDefinitions,
    options: LookupInOptions | undefined
  ) => Promise<LookupInReplicaResult<LookupInSpecResults<SpecDefinitions, Doc>>>;
  lookupInAllReplicas: (
    key: string,
    specs: SpecDefinitions,
    options: LookupInOptions | undefined
  ) => Promise<LookupInReplicaResult<LookupInSpecResults<SpecDefinitions, Doc>>[]>;
}[Method];

export type LookupResult<
  Method extends LookupMethodName,
  Doc,
  SpecDefinitions extends ReadonlyArray<LookupInSpec>
> = PromiseValue<ReturnType<LookupMethod<Method, Doc, SpecDefinitions>>>;

export type LookupInArgs<
  Doc extends object,
  SpecDefinitions extends ReadonlyArray<LookupInSpec>,
  OpResult
> = readonly [
      specsOrOptions?: LookupInOptions | NarrowLookupSpecs<Doc, SpecDefinitions>,
      optionsOrCallback?: LookupInOptions | NodeCallback<OpResult>,
      callback?: NodeCallback<OpResult>
    ]
;

export type LookupInReturnType<
  C extends AnyCollection,
  Method extends LookupMethodName,
  Key extends ExtractCollectionJsonDocKey<C>,
  SpecDefinitions
> =
  SpecDefinitions extends ReadonlyArray<LookupInSpec> ?
    If<
      IsArrayLengthKnown<SpecDefinitions>,
      Promise<LookupResult<Method, ExtractCollectionJsonDocBody<C, Key>, SpecDefinitions>>,
      ChainableLookupIn<C, Method, Key, []>
    > :
  ChainableLookupIn<C, Method, Key, []>
;
