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
import { isArray } from '@cbjsdev/shared';

import type { LookupInOptions } from '../../../collection.js';
import { LookupInSpec } from '../../../sdspecs.js';
import type { NodeCallback } from '../../../utilities.js';
import type { LookupInArgs } from './types.js';

type ResolvedArgs = {
  options: LookupInOptions<boolean>;
  callback: NodeCallback<unknown> | undefined;
  specs: ReadonlyArray<LookupInSpec> | undefined;
};

export function resolveLookupInArgs(args: LookupInArgs): ResolvedArgs {
  if (!isArray(args[0])) {
    return {
      options: (args[0] as LookupInOptions<boolean>) ?? {},
      specs: undefined,
      callback: undefined,
    };
  }

  const resolvedArgs: ResolvedArgs = {
    options: {},
    callback: undefined,
    specs: undefined,
  };

  resolvedArgs.specs = args[0] as ReadonlyArray<LookupInSpec>;

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
