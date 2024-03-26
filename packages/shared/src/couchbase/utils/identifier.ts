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
import { hasOwn, If, IsNever } from '../../misc/index.js';
import {
  BucketName,
  CollectionName,
  CouchbaseClusterTypes,
  DefaultClusterTypes,
  IsKeyspaceWildcard,
  ScopeName,
} from '../clusterTypes/index.js';

export function quoteIdentifier(name: string) {
  return '`' + name + '`';
}

export function trimIdentifier(name: string) {
  if (name.startsWith('`') && name.endsWith('`')) {
    return name.substring(1, name.length - 1);
  }

  return name;
}

/**
 * Represent a keyspace within a cluster.
 *
 * You can restrict the keyspace by passing cluster types along with a bucket/scope/collection name.
 *
 * @example
 * type AnyKeyspace = Keyspace
 * //    ^? { bucket: string; scope: string; collection: string ;}
 *
 * type BucketKeyspace = Keyspace<MyClusterTypes, 'b1'>
 * //    ^? | { bucket: 'b1'; scope: 'b1s1'; collection: 'b1s1c1'; }
 * //       | { bucket: 'b1'; scope: 'b1s1'; collection: 'b1s1c2'; }
 * //       | { bucket: 'b1'; scope: 'b1s2'; collection: 'b1s2c1'; }
 *
 */

export type Keyspace<
  T extends CouchbaseClusterTypes = DefaultClusterTypes,
  B extends BucketName<T> = BucketName<T>,
  S extends ScopeName<T, B> = ScopeName<T, B>,
  C extends CollectionName<T, B, S> = CollectionName<T, B, S>,
> =
  IsNever<T> extends true
    ? { bucket: string; scope: string; collection: string }
    : If<IsKeyspaceWildcard<B>, BucketName<T>, B> extends infer AllBuckets
      ? AllBuckets extends BucketName<T>
        ? If<IsKeyspaceWildcard<S>, ScopeName<T, AllBuckets>, S> extends infer AllScopes
          ? AllScopes extends ScopeName<T, AllBuckets>
            ? If<
                IsKeyspaceWildcard<C>,
                CollectionName<T, AllBuckets, AllScopes>,
                C
              > extends infer AllCollections
              ? AllCollections extends CollectionName<T, AllBuckets, AllScopes>
                ? { bucket: AllBuckets; scope: AllScopes; collection: AllCollections }
                : never
              : never
            : never
          : never
        : never
      : never;

export function isPartialKeyspace(v: unknown): v is Partial<Keyspace> {
  if (!v) return false;
  if (typeof v !== 'object') return false;

  return hasOwn(v, 'bucket') || hasOwn(v, 'scope') || hasOwn(v, 'collection');
}

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
  const regexp = /^[a-zA-Z0-9_%-][a-zA-Z0-9_.%-]{0,99}$/;
  return regexp.test(name);
}

export function isValidScopeName(name: string): boolean {
  const regexp = /^[a-zA-Z0-9-][a-zA-Z0-9_%-]{0,99}$/;
  return regexp.test(name);
}

export function isValidCollectionName(name: string): boolean {
  const regexp = /^[a-zA-Z0-9-][a-zA-Z0-9_%-]{0,99}$/;
  return regexp.test(name);
}

/**
 * Takes a keyspace path and returns a tuple of identifiers. It's up to you to apply a query context to it.
 *
 * The path must be a valid and may contain quoted identifiers.
 * An invalid path will result in an undefined behaviour.
 *
 * @param keyspacePath
 */

export function parseKeyspacePath(keyspacePath: string): [string, string?, string?] {
  const keyspaceChars = keyspacePath.trim().split('');

  if (keyspaceChars[0] === '`') {
    const nextBackTickIndex = keyspaceChars.findIndex((char, i) => i > 0 && char === '`');
    invariant(nextBackTickIndex !== -1, 'Unable to parse the keyspace path.');

    const bucket = keyspaceChars.slice(1, nextBackTickIndex).join('');

    const remainingPath = keyspaceChars.slice(nextBackTickIndex + 1).join('');
    const pathChunks = remainingPath
      .split('.')
      .filter((c) => c !== '')
      .map(trimIdentifier);

    return [bucket, ...pathChunks] as [string, string?, string?];
  }

  return keyspacePath.trim().split('.').map(trimIdentifier) as [string, string?, string?];
}

export function resolveKeyspace(
  keyspaceParts: string[],
  queryContext?: Pick<Keyspace, 'bucket' | 'scope'>
): Partial<Keyspace> {
  if (queryContext && keyspaceParts.length === 1) {
    return {
      ...queryContext,
      collection: keyspaceParts[0],
    };
  }

  if (keyspaceParts.length === 1 && keyspaceParts[0]) {
    return { bucket: keyspaceParts[0] };
  }

  const [bucket, scope, collection] = keyspaceParts;

  return { bucket, scope, collection };
}
