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
import { AnyDocDef, isArray } from '@cbjsdev/shared';

import type { MutateInSpecResults } from '../../../clusterTypes/kv/mutation/mutateIn.types.js';
import type { MutateInOptions } from '../../../collection.js';
import type { MutateInResult } from '../../../crudoptypes.js';
import type { MutateInSpec } from '../../../sdspecs.js';
import type { NodeCallback } from '../../../utilities.js';
import type { MutateInArgs } from './types.js';

type ResolvedArgs = {
  options: MutateInOptions;
  callback:
    | NodeCallback<MutateInResult<MutateInSpecResults<ReadonlyArray<MutateInSpec>>>>
    | undefined;
  specs: ReadonlyArray<MutateInSpec> | undefined;
};

export function resolveMutateInArgs<
  Def extends AnyDocDef,
  SpecDefinitions extends ReadonlyArray<MutateInSpec>,
>(args: MutateInArgs<Def, SpecDefinitions>): ResolvedArgs {
  if (!isArray(args[0])) {
    return {
      options: (args[0] as MutateInOptions) ?? {},
      specs: undefined,
      callback: undefined,
    } satisfies ResolvedArgs;
  }

  const resolvedArgs: ResolvedArgs = {
    options: {},
    callback: undefined,
    specs: undefined,
  };

  resolvedArgs.specs = args[0];

  if (typeof args[1] === 'function') {
    resolvedArgs.callback = args[1] as NodeCallback<
      MutateInResult<MutateInSpecResults<ReadonlyArray<MutateInSpec>>>
    >;
  }

  if (typeof args[1] === 'object') {
    resolvedArgs.options = args[1];
  }

  if (args.length === 3) {
    resolvedArgs.callback = args[2] as NodeCallback<
      MutateInResult<MutateInSpecResults<ReadonlyArray<MutateInSpec>>>
    >;
  }

  return resolvedArgs;
}
