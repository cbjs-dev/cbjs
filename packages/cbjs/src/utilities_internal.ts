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
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore: the bundler will remove the assertion for CommonJS
// eslint-disable-next-line prettier/prettier
import { invariant } from '@cbjsdev/shared';

import { couchnodeVersion } from './version.js';

/**
 * @internal
 */
export function generateClientString(): string {
  // Grab the various versions.  Note that we need to trim them
  // off as some Node.js versions insert strange characters into
  // the version identifiers (mainly newlines and such).

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call
  const couchnodeVer = couchnodeVersion;
  const nodeVer = process.versions.node.trim();
  const v8Ver = process.versions.v8.trim();
  const sslVer = process.versions.openssl.trim();

  return `couchnode/${couchnodeVer} (node/${nodeVer}; v8/${v8Ver}; ssl/${sslVer})`;
}

export function toEnumMember<
  T extends Record<string, unknown>,
  V extends undefined | null,
>(targetEnum: T, value: V): V;
export function toEnumMember<T extends Record<string, unknown>>(
  targetEnum: T,
  value: unknown
): T[keyof T];
/**
 * Return the value as a member of the given enum.
 * Performs a runtime check :
 * If the value is nullish, it returns the value.
 * If not, it checks if a member of the enum matches the value, and throws if no match is found.
 *
 * @param targetEnum The enum to type against.
 * @param value The value to type guard.
 * @throws Error thrown when the value does not exist in the enum.
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function toEnumMember<T extends Record<string, unknown>>(
  targetEnum: T,
  value: unknown
) {
  if (value === undefined || value === null) {
    return value;
  }

  const enumEntry = Object.entries(targetEnum).find(
    ([, enumValue]) => enumValue === value
  );
  invariant(enumEntry, `Unable to find enum member with value ${value}`);

  const [enumKey] = enumEntry;
  return targetEnum[enumKey] as T[keyof T];
}
