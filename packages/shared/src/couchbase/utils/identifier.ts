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

export function quoteIdentifier(name: string) {
  return '`' + name + '`';
}

export type Keyspace = {
  bucket: string;
  scope: string;
  collection: string;
};

/**
 * Return a keyspace string with quoted identifiers.
 */
export function keyspacePath(bucket: string, scope: string, collection: string): string;
export function keyspacePath(ks: {
  bucket: string;
  scope: string;
  collection: string;
}): string;
export function keyspacePath(bucket: string): string;
export function keyspacePath(...args: ReadonlyArray<string> | [Keyspace]): string {
  const identifiers: string[] = [];

  if (typeof args[0] === 'object') {
    identifiers.push(args[0].bucket, args[0].scope, args[0].collection);
  }

  if (typeof args[0] === 'string') {
    identifiers.push(...(args as string[]));
  }

  return identifiers.map((a) => quoteIdentifier(a)).join('.');
}

/**
 * Return a keyspace string with quoted identifiers, prefixed with the quoted namespace.
 */
export function namespacedKeyspacePath(
  namespace: string,
  bucket: string,
  scope: string,
  collection: string
): string {
  return `${quoteIdentifier(namespace)}:${keyspacePath(bucket, scope, collection)}`;
}

export function isValidBucketName(name: string): boolean {
  const regexp = /[^a-zA-Z0-9_.%-]+/;
  return !regexp.test(name);
}
