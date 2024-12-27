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
import { DocDef } from '@cbjsdev/shared';

import { CppProtocolSubdocOpcode } from '../../../binding.js';
import {
  CollectionDocDefMatchingKey,
  CollectionOptions,
  ExtractCollectionJsonDocKey,
} from '../../../clusterTypes/clusterTypes.js';
import type { AnyCollection } from '../../../clusterTypes/index.js';
import {
  LookupInGetResult,
  LookupInSpecResult,
  MakeLookupInSpec,
  OptimisticGetPathCheck,
  ValuesFromSpecResults,
} from '../../../clusterTypes/kv/lookup/lookupIn.types.js';
import type {
  LookupInCountPath,
  LookupInExistsPath,
} from '../../../clusterTypes/kv/lookup/lookupOperations.types.js';
import { LookupInOptions } from '../../../collection.js';
import { LookupInReplicaResult, LookupInResult } from '../../../crudoptypes.js';
import { LookupInMacro, LookupInSpec } from '../../../sdspecs.js';
import type { LookupMethodName } from './types.js';

// prettier-ignore
type LookupResult<
  Method extends LookupMethodName,
  SpecResults extends ReadonlyArray<unknown>,
  ThrowOnSpecError extends boolean,
> =
  Method extends 'lookupIn' ?
    LookupInResult<SpecResults, ThrowOnSpecError> :
  Method extends 'lookupInAnyReplica' ?
    LookupInReplicaResult<
      SpecResults,
      ThrowOnSpecError
    > :
  Method extends 'lookupInAllReplicas' ?
    LookupInReplicaResult<
      SpecResults,
      ThrowOnSpecError
    >[] :
  never
;

type ThisAnd<T, AddedSpecResult> =
  T extends ChainableLookupIn<
    infer C,
    infer Method,
    infer Key,
    infer SpecResults,
    infer ThrowOnSpecError,
    infer Def
  >
    ? ChainableLookupIn<
        C,
        Method,
        Key,
        [...SpecResults, AddedSpecResult],
        ThrowOnSpecError,
        Def
      >
    : never;

export class ChainableLookupIn<
  out C extends AnyCollection,
  out Method extends LookupMethodName,
  out Key extends string,
  in out SpecResults extends ReadonlyArray<unknown>,
  out ThrowOnSpecError extends boolean,
  in out Def extends DocDef = CollectionDocDefMatchingKey<C, Key>,
> implements Promise<LookupResult<Method, SpecResults, ThrowOnSpecError>>
{
  // Promise stuff

  [Symbol.toStringTag] = 'ChainableLookupIn';

  then<TResult1 = LookupResult<Method, SpecResults, ThrowOnSpecError>, TResult2 = never>(
    onFulfilled?:
      | ((
          value: LookupResult<Method, SpecResults, ThrowOnSpecError>
        ) => TResult1 | PromiseLike<TResult1>)
      | undefined
      | null,
    onRejected?:
      | ((reason: unknown) => TResult2 | PromiseLike<TResult2>)
      | undefined
      | null
  ): Promise<TResult1 | TResult2> {
    return this.execute().then(onFulfilled as never, onRejected);
  }

  catch<TResult = never>(
    onRejected?: ((reason: unknown) => TResult | PromiseLike<TResult>) | null | undefined
  ): Promise<LookupResult<Method, SpecResults, ThrowOnSpecError> | TResult> {
    return this.then(undefined, onRejected);
  }

  finally(
    onFinally?: (() => void) | null | undefined
  ): Promise<LookupResult<Method, SpecResults, ThrowOnSpecError>> {
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
    protected options: LookupInOptions<ThrowOnSpecError> | undefined,
    protected specs: LookupInSpec[]
  ) {}

  static for<
    C extends AnyCollection,
    Method extends LookupMethodName,
    Key extends ExtractCollectionJsonDocKey<C>,
    ThrowOnSpecError extends boolean,
  >(
    collection: C,
    method: Method,
    key: Key,
    options: LookupInOptions<ThrowOnSpecError> | undefined
  ): ChainableLookupIn<C, Method, Key, [], ThrowOnSpecError> {
    return new ChainableLookupIn(collection, method, key, options, []);
  }

  push<Spec extends LookupInSpec>(
    spec: Spec
  ): ThisAnd<this, LookupInSpecResult<CollectionOptions<C>, Spec, Def>> {
    this.specs = [...this.getSpecs(), spec];
    return this as never;
  }

  execute(): Promise<LookupInResult<[1, 2], true>> {
    const lookupMethod = this.collection[this.method as Method & keyof C];
    const lookup = lookupMethod.bind(this.collection) as any;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    return lookup(this.key, this.getSpecs(), this.options);
  }

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
  get<const Path extends string | LookupInMacro>(
    path: OptimisticGetPathCheck<CollectionOptions<C>, Def, Path>,
    options?: { xattr?: boolean }
  ): ThisAnd<this, LookupInGetResult<Def, Path>> {
    const spec = LookupInSpec.get(path, options);
    return this.push(spec) as never;
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
  exists<Path extends LookupInExistsPath<CollectionOptions<C>, Def>>(
    path: Path,
    options?: { xattr?: boolean }
  ): ThisAnd<
    this,
    LookupInSpecResult<
      CollectionOptions<C>,
      MakeLookupInSpec<CollectionOptions<C>, Def, CppProtocolSubdocOpcode.exists, Path>,
      Def
    >
  > {
    const spec = LookupInSpec.exists<
      CollectionOptions<C>,
      Def,
      Extract<Path, LookupInExistsPath<CollectionOptions<C>, Def>>
    >(path as never, options);
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
  count<Path extends LookupInCountPath<CollectionOptions<C>, Def>>(
    path: Path,
    options?: { xattr?: boolean }
  ): ThisAnd<
    this,
    LookupInSpecResult<
      CollectionOptions<C>,
      MakeLookupInSpec<
        CollectionOptions<C>,
        Def,
        CppProtocolSubdocOpcode.get_count,
        Path
      >,
      Def
    >
  > {
    const spec = LookupInSpec.count<
      Def,
      Extract<Path, LookupInCountPath<CollectionOptions<C>, Def>>,
      CollectionOptions<C>
    >(path as never, options);
    return this.push(spec);
  }

  /**
   * Return the array of specs.
   */
  getSpecs(): LookupInSpec[] {
    return this.specs;
  }

  /**
   * Return an array containing all the values.
   *
   * @example
   * ```ts
   * const [title, tags] = await cb.collection('acme')
   *   .get('title')
   *   .get('tags')
   *   .values();
   * ```
   */
  async values(): Promise<ValuesFromSpecResults<Method, SpecResults, ThrowOnSpecError>> {
    if (this.method === 'lookupInAllReplicas') {
      const result = (await this.execute()) as never as {
        content: { value: unknown }[];
      }[];
      return result.map((r) => r.content.map((e) => e.value)) as never;
    }

    const { content } = (await this.execute()) as { content: { value: unknown }[] };

    return content.map((e) => e.value) as never;
  }
}
