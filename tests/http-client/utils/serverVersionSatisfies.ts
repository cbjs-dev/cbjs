/*
 * Copyright (c) 2023-Present Jonathan MASSUCHETTI <jonathan.massuchetti@dappit.fr>.
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

import { ClusterReleaseFlavor } from '@cbjsdev/http-client';
import { invariant } from '@cbjsdev/shared';

import { clusterRelease } from './clusterRelease.js';

export function serverVersionSatisfies(version: string): boolean;
export function serverVersionSatisfies(
  version: string,
  flavor: ClusterReleaseFlavor
): boolean;
export function serverVersionSatisfies(
  version: string,
  build: string,
  flavor: ClusterReleaseFlavor
): boolean;
export function serverVersionSatisfies(
  ...args:
    | [string]
    | [string, ClusterReleaseFlavor]
    | [string, string, ClusterReleaseFlavor]
): boolean {
  let expectedVersion, expectedBuild, expectedFlavor;

  if (args.length === 1) {
    expectedVersion = args[0];
  }
  if (args.length === 2) {
    expectedVersion = args[0];
    expectedFlavor = args[1];
  }

  if (args.length === 3) {
    expectedVersion = args[0];
    expectedBuild = args[1];
    expectedFlavor = args[2];
  }

  if (expectedBuild !== undefined && clusterRelease.build !== expectedBuild) return false;
  if (expectedFlavor !== undefined && clusterRelease.flavor !== expectedFlavor)
    return false;

  invariant(expectedVersion);
  return satisfies(clusterRelease.version, expectedVersion);
}
