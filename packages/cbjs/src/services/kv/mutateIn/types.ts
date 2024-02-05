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
import { If, NoInfer } from '@cbjs/shared';

import { AnyCollection } from '../../../clusterTypes';
import { ExtractCollectionJsonDocKey } from '../../../clusterTypes/clusterTypes';
import { NarrowLookupSpecs } from '../../../clusterTypes/kv/lookup/lookupIn.types';
import { MutateInSpecResults, NarrowMutationSpecs } from '../../../clusterTypes/kv/mutation/mutateIn.types';
import { IsArrayLengthKnown } from '../../../clusterTypes/kv/utils/array-utils.types';
import { MutateInOptions } from '../../../collection';
import { MutateInResult } from '../../../crudoptypes';
import { MutateInSpec } from '../../../sdspecs';
import { NodeCallback } from '../../../utilities';
import { ChainableMutateIn } from './ChainableMutateIn';

export type MutateInArgs<
  Doc extends object,
  SpecDefinitions extends ReadonlyArray<MutateInSpec>,
> =
  readonly [
    specsOrOptions?: MutateInOptions | NarrowMutationSpecs<Doc, SpecDefinitions>,
    optionsOrCallback?: MutateInOptions | NodeCallback<MutateInResult<MutateInSpecResults<NoInfer<SpecDefinitions>>>>,
    callback?: NodeCallback<MutateInResult<MutateInSpecResults<NoInfer<SpecDefinitions>>>>
  ]

export type MutateInReturnType<
  C extends AnyCollection,
  Key extends ExtractCollectionJsonDocKey<C>,
  SpecDefinitions extends ReadonlyArray<MutateInSpec>
> = If<
  IsArrayLengthKnown<SpecDefinitions>,
  Promise<MutateInResult<MutateInSpecResults<SpecDefinitions>>>,
  ChainableMutateIn<C, Key, []>
>;
