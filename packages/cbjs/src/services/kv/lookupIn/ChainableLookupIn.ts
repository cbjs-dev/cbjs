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
import { CppProtocolSubdocOpcode } from '../../../binding.js';
import {
  CollectionDocDefMatchingKey,
  ExtractCollectionJsonDocKey,
  PathAutocomplete,
} from '../../../clusterTypes/clusterTypes.js';
import type { AnyCollection } from '../../../clusterTypes/index.js';
import type {
  LookupInSpecResults,
  MakeLookupInSpec,
} from '../../../clusterTypes/kv/lookup/lookupIn.types.js';
import type {
  LookupInCountPath,
  LookupInExistsPath,
  LookupInGetPath,
} from '../../../clusterTypes/kv/lookup/lookupOperations.types.js';
import { LookupInOptions } from '../../../collection.js';
import { LookupInReplicaResult, LookupInResult } from '../../../crudoptypes.js';
import { LookupInSpec } from '../../../sdspecs.js';
import type { LookupMethodName } from './types.js';

// prettier-ignore
type LookupResult<
  Method extends LookupMethodName,
  MatchingDocDef,
  SpecDefinitions,
  ThrowOnSpecError extends boolean,
> =
  Method extends 'lookupIn' ?
    LookupInResult<LookupInSpecResults<SpecDefinitions, MatchingDocDef>, ThrowOnSpecError> :
  Method extends 'lookupInAnyReplica' ?
    LookupInReplicaResult<
      LookupInSpecResults<SpecDefinitions, MatchingDocDef>,
      ThrowOnSpecError
    > :
  Method extends 'lookupInAllReplicas' ?
    LookupInReplicaResult<
      LookupInSpecResults<SpecDefinitions, MatchingDocDef>,
      ThrowOnSpecError
    >[] :
  never
;

type ThisAnd<T, Spec extends LookupInSpec> =
  T extends ChainableLookupIn<
    infer C,
    infer Method,
    infer Key,
    infer SpecDefinitions,
    infer ThrowOnSpecError,
    infer Doc
  >
    ? ChainableLookupIn<C, Method, Key, [...SpecDefinitions, Spec], ThrowOnSpecError, Doc>
    : never;

export class ChainableLookupIn<
  out C extends AnyCollection,
  out Method extends LookupMethodName,
  out Key extends ExtractCollectionJsonDocKey<C>,
  out SpecDefinitions extends ReadonlyArray<LookupInSpec>,
  out ThrowOnSpecError extends boolean,
  in out Def extends CollectionDocDefMatchingKey<C, Key> = CollectionDocDefMatchingKey<
    C,
    Key
  >,
> implements Promise<LookupResult<Method, Def, SpecDefinitions, ThrowOnSpecError>>
{
  // Promise stuff

  [Symbol.toStringTag] = 'ChainableLookupInSpecs';

  then<
    TResult1 = LookupResult<Method, Def, SpecDefinitions, ThrowOnSpecError>,
    TResult2 = never,
  >(
    onFulfilled?:
      | ((
          value: LookupResult<Method, Def, SpecDefinitions, ThrowOnSpecError>
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
  ): Promise<LookupResult<Method, Def, SpecDefinitions, ThrowOnSpecError> | TResult> {
    return this.then(undefined, onRejected);
  }

  finally(
    onFinally?: (() => void) | null | undefined
  ): Promise<LookupResult<Method, Def, SpecDefinitions, ThrowOnSpecError>> {
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
    protected specs: SpecDefinitions
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

  push<Spec extends LookupInSpec>(spec: Spec): ThisAnd<this, Spec> {
    const newSpecs: [...SpecDefinitions, Spec] = [...this.getSpecs(), spec];
    this.specs = newSpecs as never;
    return this as never as ThisAnd<this, Spec>;
  }

  execute(): Promise<LookupResult<Method, Def, SpecDefinitions, ThrowOnSpecError>> {
    const lookupMethod = this.collection[this.method as Method & keyof C];
    const lookup = lookupMethod.bind(this.collection) as any;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    return lookup(this.key, this.getSpecs(), this.options);
  }

  get(
    path: '',
    options?: { xattr?: boolean }
  ): ThisAnd<this, MakeLookupInSpec<Def, CppProtocolSubdocOpcode.get_doc, ''>>;

  get<Path extends PathAutocomplete<C, Exclude<LookupInGetPath<Def>, ''>>>(
    path: Path,
    options?: { xattr?: boolean }
  ): ThisAnd<this, MakeLookupInSpec<Def, CppProtocolSubdocOpcode.get, Path>>;

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
  get<Path extends LookupInGetPath<Def>>(path: Path, options?: { xattr?: boolean }): any {
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
  exists<Path extends PathAutocomplete<C, LookupInExistsPath<Def>>>(
    path: Path,
    options?: { xattr?: boolean }
  ): ThisAnd<this, MakeLookupInSpec<Def, CppProtocolSubdocOpcode.exists, Path>> {
    const spec = LookupInSpec.exists<Def, Extract<Path, LookupInExistsPath<Def>>>(
      path as never,
      options
    );
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
  count<Path extends PathAutocomplete<C, LookupInCountPath<Def>>>(
    path: Path,
    options?: { xattr?: boolean }
  ): ThisAnd<this, MakeLookupInSpec<Def, CppProtocolSubdocOpcode.get_count, Path>> {
    const spec = LookupInSpec.count<Def, Extract<Path, LookupInCountPath<Def>>>(
      path as never,
      options
    );
    return this.push(spec);
  }

  /**
   * Return the array of specs.
   */
  getSpecs(): SpecDefinitions {
    return this.specs;
  }
}
