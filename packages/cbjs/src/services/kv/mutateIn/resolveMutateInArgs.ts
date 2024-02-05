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
import { NoInfer } from '@cbjs/shared';

import { MutateInSpecResults } from '../../../clusterTypes/kv/mutation/mutateIn.types';
import { MutateInOptions } from '../../../collection';
import { MutateInResult } from '../../../crudoptypes';
import { MutateInSpec } from '../../../sdspecs';
import { NodeCallback } from '../../../utilities';
import { MutateInArgs } from './types';

type ResolvedArgs<SpecDefinitions extends ReadonlyArray<MutateInSpec>> = {
  options: MutateInOptions;
  callback:
    | NodeCallback<MutateInResult<MutateInSpecResults<NoInfer<SpecDefinitions>>>>
    | undefined;
  specs: SpecDefinitions | undefined;
};

export function resolveMutateInArgs<
  Doc extends object,
  SpecDefinitions extends ReadonlyArray<MutateInSpec>
>(args: MutateInArgs<Doc, SpecDefinitions>): ResolvedArgs<SpecDefinitions> {
  if (!(args[0] instanceof Array)) {
    return {
      options: args[0] || {},
      specs: undefined,
      callback: undefined,
    } satisfies ResolvedArgs<SpecDefinitions>;
  }

  const resolvedArgs: ResolvedArgs<SpecDefinitions> = {
    options: {},
    callback: undefined,
    specs: undefined,
  };

  resolvedArgs.specs = args[0] as SpecDefinitions;

  if (typeof args[1] === 'function') {
    resolvedArgs.callback = args[1];
  }

  if (typeof args[1] === 'object') {
    resolvedArgs.options = args[1];
  }

  if (args.length === 3) {
    resolvedArgs.callback = args[2];
  }

  return resolvedArgs;
}
