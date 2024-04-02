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
import { hasOwn, If, IsNever } from '../../misc';
import type {
  BucketName,
  CollectionName,
  CouchbaseClusterTypes,
  ScopeName,
} from '../clusterTypes';

export function quoteIdentifier(name: string) {
  return '`' + name + '`';
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
  T extends CouchbaseClusterTypes = never,
  B extends BucketName<T> = never,
  S extends ScopeName<T, B> = never,
  C extends CollectionName<T, B, S> = never,
> =
  IsNever<T> extends true
    ? { bucket: string; scope: string; collection: string }
    : If<IsNever<B>, BucketName<T>, B> extends infer AllBuckets extends BucketName<T>
      ? AllBuckets extends unknown
        ? If<IsNever<S>, ScopeName<T, AllBuckets>, S> extends infer AllScopes extends
            ScopeName<T, AllBuckets>
          ? AllScopes extends unknown
            ? If<
                IsNever<C>,
                CollectionName<T, AllBuckets, AllScopes>,
                C
              > extends infer AllCollections extends CollectionName<
                T,
                AllBuckets,
                AllScopes
              >
              ? AllCollections extends unknown
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
  const regexp = /[^a-zA-Z0-9_.%-]+/;
  return !regexp.test(name);
}
