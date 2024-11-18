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
import { AnyDocDef, IsArrayLengthKnown } from '@cbjsdev/shared';
import { ExtractCollectionJsonDocKey } from '../../../clusterTypes/clusterTypes.js';

import { AnyCollection } from '../../../clusterTypes/index.js';
import { MutateInSpecResults, NarrowMutationSpecs } from '../../../clusterTypes/kv/mutation/mutateIn.types.js';
import { MutateInOptions } from '../../../collection.js';
import { MutateInResult } from '../../../crudoptypes.js';
import { MutateInSpec } from '../../../sdspecs.js';
import { NodeCallback } from '../../../utilities.js';
import { ChainableMutateIn } from './ChainableMutateIn.js';

export type MutateInArgs<
  Options,
  Def extends AnyDocDef,
  SpecDefinitions,
> =
  readonly [
    specsOrOptions?: MutateInOptions | NarrowMutationSpecs<Options, Def, SpecDefinitions>,
    optionsOrCallback?: MutateInOptions | NodeCallback<MutateInResult<MutateInSpecResults<SpecDefinitions>>>,
    callback?: NodeCallback<MutateInResult<MutateInSpecResults<SpecDefinitions>>>
  ]

export type MutateInReturnType<
  C extends AnyCollection,
  Key extends ExtractCollectionJsonDocKey<C>,
  SpecDefinitions extends ReadonlyArray<MutateInSpec>
> =
  IsArrayLengthKnown<SpecDefinitions> extends true ?
    Promise<MutateInResult<MutateInSpecResults<SpecDefinitions>>> :
  ChainableMutateIn<C, Key, []>
;
