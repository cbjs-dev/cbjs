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
import type { If, IsArrayLengthKnown, NoInfer } from '@cbjsdev/shared';

import type { AnyCollection } from '../../../clusterTypes';
import type { ExtractCollectionJsonDocKey } from '../../../clusterTypes/clusterTypes';
import { MutateInSpecResults, NarrowMutationSpecs } from '../../../clusterTypes/kv/mutation/mutateIn.types';
import type { MutateInOptions } from '../../../collection';
import type { MutateInResult } from '../../../crudoptypes';
import type { MutateInSpec } from '../../../sdspecs';
import type { NodeCallback } from '../../../utilities';
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
