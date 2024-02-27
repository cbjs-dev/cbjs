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
import { PromiseValue } from '@cbjsdev/shared';

import { CppProtocolSubdocOpcode } from '../../../binding';
import { AnyCollection } from '../../../clusterTypes';
import {
  ExtractCollectionJsonDocBody,
  ExtractCollectionJsonDocKey,
} from '../../../clusterTypes/clusterTypes';
import {
  LookupInSpecResults,
  MakeLookupInSpec,
} from '../../../clusterTypes/kv/lookup/lookupIn.types';
import {
  LookupInCountPath,
  LookupInExistsPath,
  LookupInGetPath,
} from '../../../clusterTypes/kv/lookup/lookupOperations.types';
import { LookupInOptions } from '../../../collection';
import { LookupInReplicaResult, LookupInResult } from '../../../crudoptypes';
import { LookupInSpec } from '../../../sdspecs';
import { LookupMethodName } from './types';

type LookupMethod<
  Method extends LookupMethodName,
  Doc,
  SpecDefinitions extends ReadonlyArray<LookupInSpec>,
> = {
  lookupIn: (
    key: string,
    specs: SpecDefinitions,
    options: LookupInOptions | undefined
  ) => Promise<LookupInResult<LookupInSpecResults<SpecDefinitions, Doc>>>;
  lookupInAnyReplica: (
    key: string,
    specs: SpecDefinitions,
    options: LookupInOptions | undefined
  ) => Promise<LookupInReplicaResult<LookupInSpecResults<SpecDefinitions, Doc>>>;
  lookupInAllReplicas: (
    key: string,
    specs: SpecDefinitions,
    options: LookupInOptions | undefined
  ) => Promise<LookupInReplicaResult<LookupInSpecResults<SpecDefinitions, Doc>>[]>;
}[Method];

type LookupResult<
  Method extends LookupMethodName,
  Doc,
  SpecDefinitions extends ReadonlyArray<LookupInSpec>,
> = PromiseValue<ReturnType<LookupMethod<Method, Doc, SpecDefinitions>>>;

type ThisAnd<T, Spec extends LookupInSpec> =
  T extends ChainableLookupIn<
    infer C,
    infer Method,
    infer Key,
    infer SpecDefinitions,
    infer Doc
  >
    ? ChainableLookupIn<C, Method, Key, [...SpecDefinitions, Spec], Doc>
    : never;

export class ChainableLookupIn<
  C extends AnyCollection,
  Method extends LookupMethodName,
  Key extends ExtractCollectionJsonDocKey<C>,
  SpecDefinitions extends ReadonlyArray<LookupInSpec>,
  Doc extends ExtractCollectionJsonDocBody<C, Key> = ExtractCollectionJsonDocBody<C, Key>,
> implements Promise<LookupResult<Method, Doc, SpecDefinitions>>
{
  // Promise stuff

  [Symbol.toStringTag] = 'ChainableLookupInSpecs';

  then<TResult1 = LookupResult<Method, Doc, SpecDefinitions>, TResult2 = never>(
    onFulfilled?:
      | ((
          value: LookupResult<Method, Doc, SpecDefinitions>
        ) => TResult1 | PromiseLike<TResult1>)
      | undefined
      | null,
    onRejected?:
      | ((reason: unknown) => TResult2 | PromiseLike<TResult2>)
      | undefined
      | null
  ): Promise<TResult1 | TResult2> {
    return this.execute().then(onFulfilled, onRejected);
  }

  catch<TResult = never>(
    onRejected?: ((reason: unknown) => TResult | PromiseLike<TResult>) | null | undefined
  ): Promise<LookupResult<Method, Doc, SpecDefinitions> | TResult> {
    return this.then(undefined, onRejected);
  }

  finally(
    onFinally?: (() => void) | null | undefined
  ): Promise<LookupResult<Method, Doc, SpecDefinitions>> {
    return this.then(
      (value) => {
        onFinally?.();
        return value;
      },
      (reason) => {
        onFinally?.();
        throw reason;
      }
    );
  }

  // Builder
  constructor(
    protected collection: C,
    protected method: Method,
    protected key: Key,
    protected options: LookupInOptions | undefined,
    protected specs: SpecDefinitions
  ) {}

  static for<
    C extends AnyCollection,
    Method extends LookupMethodName,
    Key extends ExtractCollectionJsonDocKey<C>,
  >(
    collection: C,
    method: Method,
    key: Key,
    options: LookupInOptions | undefined
  ): ChainableLookupIn<C, Method, Key, []> {
    return new ChainableLookupIn(collection, method, key, options, []);
  }

  push<Spec extends LookupInSpec>(spec: Spec): ThisAnd<this, Spec> {
    const newSpecs: [...SpecDefinitions, Spec] = [...this.getSpecs(), spec];
    return new ChainableLookupIn(
      this.collection,
      this.method,
      this.key,
      this.options,
      newSpecs
    ) as ThisAnd<this, Spec>;
  }

  execute(): Promise<LookupResult<Method, Doc, SpecDefinitions>> {
    const lookupMethod = this.collection[this.method as Method & keyof C];
    const lookup = lookupMethod.bind(this.collection) as LookupMethod<
      Doc,
      Key,
      SpecDefinitions
    >;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    return lookup(this.key, this.getSpecs(), this.options);
  }

  get(
    path: '',
    options?: { xattr?: boolean }
  ): ThisAnd<this, MakeLookupInSpec<Doc, CppProtocolSubdocOpcode.get_doc, ''>>;

  get<Path extends Exclude<LookupInGetPath<Doc>, ''>>(
    path: Path,
    options?: { xattr?: boolean }
  ): ThisAnd<this, MakeLookupInSpec<Doc, CppProtocolSubdocOpcode.get, Path>>;

  /**
   * Get a property from the document.
   *
   * @see LookupInSpec.get
   * @param path The path to the field.
   * @param options Optional parameters for this operation.
   * @param options.xattr
   * Whether this operation should reference the document body or the extended
   * attributes data for the document.
   */
  get<Path extends LookupInGetPath<Doc>>(
    path: Path,
    options?: { xattr?: boolean }
  ): ThisAnd<this, LookupInSpec> {
    const spec = LookupInSpec.get(path, options);
    return this.push(spec);
  }

  /**
   * Check if a property exists in the document.
   *
   * @see LookupInSpec.exists
   * @param path The path to the field.
   * @param options Optional parameters for this operation.
   * @param options.xattr
   * Whether this operation should reference the document body or the extended
   * attributes data for the document.
   */
  exists<Path extends LookupInExistsPath<Doc>>(
    path: Path,
    options?: { xattr?: boolean }
  ): ThisAnd<this, MakeLookupInSpec<Doc, CppProtocolSubdocOpcode.exists, Path>> {
    const spec = LookupInSpec.exists<Doc, Path>(path, options);
    return this.push(spec);
  }

  /**
   * Count the number of elements in an array, or the number of keys in an object.
   *
   * @see LookupInSpec.count
   * @param path The path to the field.
   * @param options Optional parameters for this operation.
   * @param options.xattr
   * Whether this operation should reference the document body or the extended
   * attributes data for the document.
   */
  count<Path extends LookupInCountPath<Doc>>(
    path: Path,
    options?: { xattr?: boolean }
  ): ThisAnd<this, MakeLookupInSpec<Doc, CppProtocolSubdocOpcode.get_count, Path>> {
    const spec = LookupInSpec.count<Doc, Path>(path, options);
    return this.push(spec);
  }

  /**
   * Return the array of specs.
   */
  getSpecs(): SpecDefinitions {
    return this.specs;
  }
}
