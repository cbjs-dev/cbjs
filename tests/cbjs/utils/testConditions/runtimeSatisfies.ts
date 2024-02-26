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
import { satisfies } from 'semver';

import { hasOwn, raise } from '@cbjsdev/shared';

export type RuntimeName = 'node' | 'deno' | 'bun';

/**
 * Return true if the JS runtime matches the criteria
 * @param runtime name of the expected runtime
 * @param version version range descriptor, npm style
 * @example
 * runtimeMatches('node', '18.12.0');
 * runtimeMatches('node', '1.2.3 || >=2.5.0');
 */
export function runtimeSatisfies(runtime: RuntimeName, version?: string): boolean {
  const actualRuntime = getRuntimeName();
  const actualVersion = getRuntimeVersion(actualRuntime);

  const runtimeMatches = runtime === actualRuntime;

  if (version === undefined) return runtimeMatches;
  return runtimeMatches && satisfies(actualVersion, version);
}

function getRuntimeName(): RuntimeName {
  // The order matters ! Bun has a 'process.versions.node' property

  switch (true) {
    case hasOwn(process.versions, 'bun'):
      return 'bun';
    case hasOwn(process.versions, 'node'):
      return 'node';
    case hasOwn(globalThis, 'Deno'):
      return 'deno';
  }

  throw new Error('Unknown runtime');
}

function getRuntimeVersion(runtime: RuntimeName): string {
  if (getRuntimeName() !== runtime) {
    throw new Error(
      'You cannot get the runtime version while not executing that runtime'
    );
  }

  switch (runtime) {
    case 'node':
      return process.versions.node;

    case 'bun':
      return process.versions.bun ?? raise('Missing property process.versions.bun');

    case 'deno':
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      return globalThis.Deno.version;
  }

  throw new Error('Unknown runtime');
}
