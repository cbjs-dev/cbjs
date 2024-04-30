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
import { AnyCollection } from '../../../clusterTypes/index.js';
import {
  ExtractCollectionJsonDocBody,
  ExtractCollectionJsonDocKey,
} from '../../../clusterTypes/clusterTypes.js';
import {
  AnyMutateInPath,
  AnyMutateInValue,
  MutateInSpecResults,
  MutateInValue,
} from '../../../clusterTypes/kv/mutation/mutateIn.types.js';
import {
  MutateInArrayAddUniqueOptions,
  MutateInArrayAppendOptions,
  MutateInArrayInsertOptions,
  MutateInArrayPrependOptions,
  MutateInCounterOptions,
  MutateInDecrementOptions,
  MutateInInsertOptions,
  MutateInRemoveOptions,
  MutateInUpsertOptions,
} from '../../../clusterTypes/kv/mutation/mutationOperations.types.js';
import { MutateInOptions } from '../../../collection.js';
import { MutateInResult } from '../../../crudoptypes.js';
import { MutateInSpec } from '../../../sdspecs.js';

type ThisAnd<T, Spec extends MutateInSpec> =
  T extends ChainableMutateIn<infer C, infer Key, infer SpecDefinitions>
    ? ChainableMutateIn<C, Key, [...SpecDefinitions, Spec]>
    : never;

export class ChainableMutateIn<
  C extends AnyCollection,
  Key extends ExtractCollectionJsonDocKey<C>,
  SpecDefinitions extends ReadonlyArray<MutateInSpec>,
> implements Promise<MutateInResult<MutateInSpecResults<SpecDefinitions>>>
{
  // Promise stuff

  [Symbol.toStringTag] = 'ChainableMutateInSpecs';

  then<TResult1 = MutateInResult<MutateInSpecResults<SpecDefinitions>>, TResult2 = never>(
    onFulfilled?:
      | ((
          value: MutateInResult<MutateInSpecResults<SpecDefinitions>>
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
  ): Promise<MutateInResult<MutateInSpecResults<SpecDefinitions>> | TResult> {
    return this.then(undefined, onRejected);
  }

  finally(
    onFinally?: (() => void) | null | undefined
  ): Promise<MutateInResult<MutateInSpecResults<SpecDefinitions>>> {
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
    protected key: Key,
    protected options: MutateInOptions | undefined,
    protected specs: SpecDefinitions
  ) {}

  static for<C extends AnyCollection, Key extends ExtractCollectionJsonDocKey<C>>(
    collection: C,
    key: Key,
    options: MutateInOptions | undefined
  ): ChainableMutateIn<C, Key, []> {
    return new ChainableMutateIn(collection, key, options, []);
  }

  push<Spec extends MutateInSpec>(spec: Spec): ThisAnd<this, Spec> {
    const newSpecs: [...SpecDefinitions, Spec] = [...this.getSpecs(), spec];
    return new ChainableMutateIn(
      this.collection,
      this.key,
      this.options,
      newSpecs
    ) as ThisAnd<this, Spec>;
  }

  execute(): Promise<MutateInResult<MutateInSpecResults<SpecDefinitions>>> {
    return this.collection.mutateIn(this.key, this.getSpecs(), this.options ?? {});
  }

  /**
   * Set the value of a non-existing property.
   *
   * Fails if the field already exists at the specified path.
   *
   * @see MutateInSpec.insert
   * @param path The path to the field.
   * @param value The value to insert.
   * @param options Optional parameters for this operation.
   * @param options.createPath
   * Whether or not the path to the field should be created if it does not
   * already exist.
   * @param options.xattr
   * Whether this operation should reference the document body or the extended
   * attributes data for the document.
   */
  insert<
    Path extends AnyMutateInPath<
      ExtractCollectionJsonDocBody<C, Key>,
      CppProtocolSubdocOpcode.dict_add
    >,
    Value extends AnyMutateInValue<
      ExtractCollectionJsonDocBody<C, Key>,
      CppProtocolSubdocOpcode.dict_add,
      Path
    >,
  >(
    path: Path,
    value: Value,
    options?: MutateInInsertOptions
  ): ThisAnd<
    this,
    MutateInSpec<
      ExtractCollectionJsonDocBody<C, Key>,
      CppProtocolSubdocOpcode.dict_add,
      Path,
      false,
      Value
    >
  > {
    const spec = MutateInSpec.insert<ExtractCollectionJsonDocBody<C, Key>, Path, Value>(
      path,
      value,
      options
    );
    return this.push(spec);
  }

  upsert<
    Value extends MutateInValue<
      ExtractCollectionJsonDocBody<C, Key>,
      CppProtocolSubdocOpcode.set_doc,
      ''
    >,
  >(
    path: '',
    value: Value,
    options?: MutateInUpsertOptions
  ): ThisAnd<
    this,
    MutateInSpec<
      ExtractCollectionJsonDocBody<C, Key>,
      CppProtocolSubdocOpcode.set_doc,
      '',
      false,
      Value
    >
  >;

  upsert<
    Path extends AnyMutateInPath<
      ExtractCollectionJsonDocBody<C, Key>,
      CppProtocolSubdocOpcode.dict_upsert
    >,
    Value extends AnyMutateInValue<
      ExtractCollectionJsonDocBody<C, Key>,
      CppProtocolSubdocOpcode.dict_upsert,
      Path
    >,
  >(
    path: Path,
    value: Value,
    options?: MutateInUpsertOptions
  ): ThisAnd<
    this,
    MutateInSpec<
      ExtractCollectionJsonDocBody<C, Key>,
      CppProtocolSubdocOpcode.dict_upsert,
      Path,
      false,
      Value
    >
  >;

  /**
   * Set the value of a property. If the property does not exist, it is created.
   *
   * @see MutateInSpec.upsert
   * @param path The path to the field.
   * @param value The value to write.
   * @param options Optional parameters for this operation.
   * @param options.createPath
   * Whether or not the path to the field should be created if it does not
   * already exist.
   * @param options.xattr
   * Whether this operation should reference the document body or the extended
   * attributes data for the document.
   */
  upsert<
    Path extends AnyMutateInPath<
      ExtractCollectionJsonDocBody<C, Key>,
      CppProtocolSubdocOpcode.set_doc | CppProtocolSubdocOpcode.dict_upsert
    >,
    Value extends AnyMutateInValue<
      ExtractCollectionJsonDocBody<C, Key>,
      CppProtocolSubdocOpcode.set_doc | CppProtocolSubdocOpcode.dict_upsert,
      Path
    >,
  >(
    path: Path,
    value: Value,
    options?: MutateInUpsertOptions
  ): ThisAnd<
    this,
    MutateInSpec<
      ExtractCollectionJsonDocBody<C, Key>,
      CppProtocolSubdocOpcode.set_doc | CppProtocolSubdocOpcode.dict_upsert,
      any,
      false,
      any
    >
  > {
    const spec = MutateInSpec.upsert<ExtractCollectionJsonDocBody<C, Key>, Path, Value>(
      path,
      value,
      options
    );
    return this.push(spec);
  }

  /**
   * Set the value of an existing property.
   *
   * Fails if the property does not exits.
   *
   * @see MutateInSpec.replace
   * @param path The path to the field.
   * @param value The value to write.
   * @param options Optional parameters for this operation.
   * @param options.xattr
   * Whether this operation should reference the document body or the extended
   * attributes data for the document.
   */
  replace<
    Path extends AnyMutateInPath<
      ExtractCollectionJsonDocBody<C, Key>,
      CppProtocolSubdocOpcode.replace
    >,
    Value extends AnyMutateInValue<
      ExtractCollectionJsonDocBody<C, Key>,
      CppProtocolSubdocOpcode.replace,
      Path
    >,
  >(
    path: Path,
    value: Value,
    options?: MutateInUpsertOptions
  ): ThisAnd<
    this,
    MutateInSpec<
      ExtractCollectionJsonDocBody<C, Key>,
      CppProtocolSubdocOpcode.replace,
      any,
      false,
      any
    >
  > {
    const spec = MutateInSpec.replace<ExtractCollectionJsonDocBody<C, Key>, Path, Value>(
      path,
      value,
      options
    );
    return this.push(spec);
  }

  remove(
    path: '',
    options?: MutateInRemoveOptions
  ): ThisAnd<
    this,
    MutateInSpec<
      ExtractCollectionJsonDocBody<C, Key>,
      CppProtocolSubdocOpcode.remove_doc,
      ''
    >
  >;

  remove<
    Path extends AnyMutateInPath<
      ExtractCollectionJsonDocBody<C, Key>,
      CppProtocolSubdocOpcode.remove
    >,
  >(
    path: Path,
    options?: MutateInRemoveOptions
  ): ThisAnd<
    this,
    MutateInSpec<
      ExtractCollectionJsonDocBody<C, Key>,
      CppProtocolSubdocOpcode.remove,
      Path
    >
  >;

  /**
   * Remove a property from the document.
   *
   * Fails if the property does not exist.
   *
   * @see MutateInSpec.remove
   * @param path The path to the field.
   * @param options Optional parameters for this operation.
   * @param options.xattr
   * Whether this operation should reference the document body or the extended
   * attributes data for the document.
   */
  remove<
    Path extends AnyMutateInPath<
      ExtractCollectionJsonDocBody<C, Key>,
      CppProtocolSubdocOpcode.remove | CppProtocolSubdocOpcode.remove_doc
    >,
  >(
    path: Path,
    options?: MutateInRemoveOptions
  ): ThisAnd<this, MutateInSpec<ExtractCollectionJsonDocBody<C, Key>>> {
    const spec = MutateInSpec.remove(path, options);
    return this.push(spec);
  }

  /**
   * Add one or more values at end of an array.
   *
   * Fails if the property does not exist, unless `{ createPath: true }`.
   * Use `{ multi: true }` to add multiple values.
   *
   * @see MutateInSpec.arrayAppend
   * @param path The path to the field.
   * @param value The value to add.
   * @param options Optional parameters for this operation.
   * @param options.createPath
   * Whether or not the path to the field should be created if it does not
   * already exist.
   * @param options.multi
   * If set, this enables an array of values to be passed as value, and each
   * element of the passed array is added to the array.
   * @param options.xattr
   * Whether this operation should reference the document body or the extended
   * attributes data for the document.
   */
  arrayAppend<
    Path extends AnyMutateInPath<
      ExtractCollectionJsonDocBody<C, Key>,
      CppProtocolSubdocOpcode.array_push_last
    >,
    Value extends AnyMutateInValue<
      ExtractCollectionJsonDocBody<C, Key>,
      CppProtocolSubdocOpcode.array_push_last,
      Path
    >,
    Multi extends boolean = false,
  >(
    path: Path,
    value: Value,
    options?: MutateInArrayAppendOptions<Multi>
  ): ThisAnd<
    this,
    MutateInSpec<
      ExtractCollectionJsonDocBody<C, Key>,
      CppProtocolSubdocOpcode.array_push_last,
      Path,
      Multi,
      Value
    >
  > {
    const spec = MutateInSpec.arrayAppend<
      ExtractCollectionJsonDocBody<C, Key>,
      Path,
      Value,
      Multi
    >(path, value, options);
    return this.push(spec);
  }

  /**
   * Add one or more values at beginning of an array.
   *
   * Fails if the property does not exist, unless `{ createPath: true }`.
   * Use `{ multi: true }` to add multiple values.
   *
   * @see MutateInSpec.arrayPrepend
   * @param path The path to the field.
   * @param value The value to add.
   * @param options Optional parameters for this operation.
   * @param options.createPath
   * Whether or not the path to the field should be created if it does not
   * already exist.
   * @param options.multi
   * If set, this enables an array of values to be passed as value, and each
   * element of the passed array is added to the array.
   * @param options.xattr
   * Whether this operation should reference the document body or the extended
   * attributes data for the document.
   */
  arrayPrepend<
    Path extends AnyMutateInPath<
      ExtractCollectionJsonDocBody<C, Key>,
      CppProtocolSubdocOpcode.array_push_first
    >,
    Value extends AnyMutateInValue<
      ExtractCollectionJsonDocBody<C, Key>,
      CppProtocolSubdocOpcode.array_push_first,
      Path
    >,
    Multi extends boolean = false,
  >(
    path: Path,
    value: Value,
    options?: MutateInArrayPrependOptions<Multi>
  ): ThisAnd<
    this,
    MutateInSpec<
      ExtractCollectionJsonDocBody<C, Key>,
      CppProtocolSubdocOpcode.array_push_first,
      Path,
      Multi,
      Value
    >
  > {
    const spec = MutateInSpec.arrayPrepend<
      ExtractCollectionJsonDocBody<C, Key>,
      Path,
      Value,
      Multi
    >(path, value, options);
    return this.push(spec);
  }

  /**
   * Add one or more values at a specific array index.
   *
   * Fails if the property does not exist, unless `{ createPath: true }`.
   * Use `{ multi: true }` to add multiple values.
   *
   * @example arrayInsert('authors[1]', 'Luke');
   *
   * @param path The path to an element of an array.
   * @param value The value to add.
   * @param options Optional parameters for this operation.
   * @param options.createPath
   * Whether or not the path to the field should be created if it does not
   * already exist.
   * @param options.multi
   * If set, this enables an array of values to be passed as value, and each
   * element of the passed array is added to the array.
   * @param options.xattr
   * Whether this operation should reference the document body or the extended
   * attributes data for the document.
   */
  arrayInsert<
    Path extends AnyMutateInPath<
      ExtractCollectionJsonDocBody<C, Key>,
      CppProtocolSubdocOpcode.array_insert
    >,
    Value extends AnyMutateInValue<
      ExtractCollectionJsonDocBody<C, Key>,
      CppProtocolSubdocOpcode.array_insert,
      Path
    >,
    Multi extends boolean = false,
  >(
    path: Path,
    value: Value,
    options?: MutateInArrayInsertOptions<Multi>
  ): ThisAnd<
    this,
    MutateInSpec<
      ExtractCollectionJsonDocBody<C, Key>,
      CppProtocolSubdocOpcode.array_insert,
      Path,
      Multi,
      Value
    >
  > {
    const spec = MutateInSpec.arrayInsert<
      ExtractCollectionJsonDocBody<C, Key>,
      Path,
      Value,
      Multi
    >(path, value, options);
    return this.push(spec);
  }

  /**
   * Add a value to an array, only if it cannot be found elsewhere in the array.
   * The position of the new elements is unknown.
   *
   * Fails if the property does not exist, unless `{ createPath: true }`.
   *
   * @param path The path to the field.
   * @param value The value to add.
   * @param options Optional parameters for this operation.
   * @param options.createPath
   * Whether or not the path to the field should be created if it does not
   * already exist.
   * @param options.xattr
   * Whether this operation should reference the document body or the extended
   * attributes data for the document.
   */
  arrayAddUnique<
    Path extends AnyMutateInPath<
      ExtractCollectionJsonDocBody<C, Key>,
      CppProtocolSubdocOpcode.array_add_unique
    >,
    Value extends AnyMutateInValue<
      ExtractCollectionJsonDocBody<C, Key>,
      CppProtocolSubdocOpcode.array_add_unique,
      Path
    >,
  >(
    path: Path,
    value: Value,
    options?: MutateInArrayAddUniqueOptions
  ): ThisAnd<
    this,
    MutateInSpec<
      ExtractCollectionJsonDocBody<C, Key>,
      CppProtocolSubdocOpcode.array_add_unique,
      Path,
      false,
      Value
    >
  > {
    const spec = MutateInSpec.arrayAddUnique<
      ExtractCollectionJsonDocBody<C, Key>,
      Path,
      Value
    >(path, value, options);
    return this.push(spec);
  }

  /**
   * Creates a MutateInSpec for incrementing the value of a field in a document.
   *
   * @param path The path to the field.
   * @param incrementBy The value to add.
   * @param options Optional parameters for this operation.
   * @param options.createPath
   * Whether or not the path to the field should be created if it does not
   * already exist.
   * @param options.xattr
   * Whether this operation should reference the document body or the extended
   * attributes data for the document.
   */
  increment<
    Path extends AnyMutateInPath<
      ExtractCollectionJsonDocBody<C, Key>,
      CppProtocolSubdocOpcode.counter
    >,
    Value extends AnyMutateInValue<
      ExtractCollectionJsonDocBody<C, Key>,
      CppProtocolSubdocOpcode.counter,
      Path
    >,
  >(
    path: Path,
    incrementBy: Value,
    options?: MutateInCounterOptions
  ): ThisAnd<
    this,
    MutateInSpec<
      ExtractCollectionJsonDocBody<C, Key>,
      CppProtocolSubdocOpcode.counter,
      Path,
      false,
      Value
    >
  > {
    const spec = MutateInSpec.increment<
      ExtractCollectionJsonDocBody<C, Key>,
      Path,
      Value
    >(path, incrementBy, options);
    return this.push(spec);
  }

  /**
   * Creates a MutateInSpec for decrementing the value of a field in a document.
   *
   * @param path The path to the field.
   * @param decrementBy The value to subtract.
   * @param options Optional parameters for this operation.
   * @param options.createPath
   * Whether or not the path to the field should be created if it does not
   * already exist.
   * @param options.xattr
   * Whether this operation should reference the document body or the extended
   * attributes data for the document.
   */
  decrement<
    Path extends AnyMutateInPath<
      ExtractCollectionJsonDocBody<C, Key>,
      CppProtocolSubdocOpcode.counter
    >,
    Value extends AnyMutateInValue<
      ExtractCollectionJsonDocBody<C, Key>,
      CppProtocolSubdocOpcode.counter,
      Path
    >,
  >(
    path: Path,
    decrementBy: Value,
    options?: MutateInDecrementOptions
  ): ThisAnd<
    this,
    MutateInSpec<
      ExtractCollectionJsonDocBody<C, Key>,
      CppProtocolSubdocOpcode.counter,
      Path,
      false,
      Value
    >
  > {
    const spec = MutateInSpec.decrement<
      ExtractCollectionJsonDocBody<C, Key>,
      Path,
      Value
    >(path, decrementBy, options);
    return this.push(spec);
  }

  /**
   * Return the array of specs.
   */
  getSpecs(): SpecDefinitions {
    return this.specs;
  }
}
