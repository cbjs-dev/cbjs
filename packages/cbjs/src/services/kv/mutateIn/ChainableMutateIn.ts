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
import { If, IsLegalPath, SubDocument } from '@cbjsdev/shared';

import {
  CollectionOptions,
  ExtractCollectionJsonDocDef,
  ExtractCollectionJsonDocKey,
} from '../../../clusterTypes/clusterTypes.js';
import type {
  AnyCollection,
  MutateInArrayAddUniquePath,
  MutateInArrayAppendPath,
  MutateInArrayInsertPath,
  MutateInArrayPrependPath,
  MutateInBinaryPath,
  MutateInInsertPath,
  MutateInRemovePath,
  MutateInReplacePath,
  MutateInUpsertPath,
} from '../../../clusterTypes/index.js';
import { MutateInSpecResult } from '../../../clusterTypes/kv/mutation/mutateIn.types.js';
import {
  IllegalPathErrorMessage,
  MutateInArrayAddUniqueOptions,
  MutateInArrayAddUniqueValue,
  MutateInArrayAppendOptions,
  MutateInArrayAppendValue,
  MutateInArrayInsertOptions,
  MutateInArrayInsertValue,
  MutateInArrayPrependOptions,
  MutateInArrayPrependValue,
  MutateInBinaryOptions,
  MutateInBinaryValue,
  MutateInInsertOptions,
  MutateInInsertValue,
  MutateInRemoveOptions,
  MutateInReplaceOptions,
  MutateInReplaceValue,
  MutateInUpsertOptions,
  MutateInUpsertValue,
} from '../../../clusterTypes/kv/mutation/mutationOperations.types.js';
import { MutateInOptions } from '../../../collection.js';
import { MutateInResult } from '../../../crudoptypes.js';
import { MutateInSpec } from '../../../sdspecs.js';

// prettier-ignore
type ArrayAddUniqueSpecs<Values extends ReadonlyArray<unknown>> =
  Values extends [undefined, ...infer Rest] ?
    [
      undefined,
      ...ArrayAddUniqueSpecs<Rest>
    ] :
  never
;

export class ChainableMutateIn<
  out C extends AnyCollection,
  out Key extends ExtractCollectionJsonDocKey<C>,
  in out SpecResults extends ReadonlyArray<undefined | number>,
  in out Def extends ExtractCollectionJsonDocDef<C, Key> = ExtractCollectionJsonDocDef<
    C,
    Key
  >,
> implements Promise<MutateInResult<SpecResults>>
{
  // Promise stuff

  [Symbol.toStringTag] = 'ChainableMutateIn';

  then<TResult1 = MutateInResult<SpecResults>, TResult2 = never>(
    onFulfilled?:
      | ((value: MutateInResult<SpecResults>) => TResult1 | PromiseLike<TResult1>)
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
  ): Promise<MutateInResult<SpecResults> | TResult> {
    return this.then(undefined, onRejected);
  }

  finally(
    onFinally?: (() => void) | null | undefined
  ): Promise<MutateInResult<SpecResults>> {
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
    protected specs: ReadonlyArray<MutateInSpec>
  ) {}

  static for<C extends AnyCollection, Key extends ExtractCollectionJsonDocKey<C>>(
    collection: C,
    key: Key,
    options: MutateInOptions | undefined
  ): ChainableMutateIn<C, Key, []> {
    return new ChainableMutateIn(collection, key, options, []);
  }

  push<Spec extends MutateInSpec>(
    spec: Spec
  ): ChainableMutateIn<C, Key, [...SpecResults, MutateInSpecResult<Spec>]> {
    const newSpecs = [...this.getSpecs(), spec];
    this.specs = newSpecs as never;
    return this as never;
  }

  execute() {
    return this.collection.mutateIn(
      this.key,
      this.getSpecs() as never,
      this.options ?? {}
    ) as never as Promise<MutateInResult<SpecResults>>;
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
    const Path extends MutateInInsertPath<CollectionOptions<C>, Def>,
    Value extends MutateInInsertValue<CollectionOptions<C>, Def, Path>,
  >(
    path: Path,
    value: Value,
    options?: MutateInInsertOptions
  ): ChainableMutateIn<C, Key, [...SpecResults, undefined]> {
    const spec = MutateInSpec.insert(path, value, options);
    return this.push(spec);
  }

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
  upsert<Path extends MutateInUpsertPath<CollectionOptions<C>, Def>>(
    path: Path,
    value: MutateInUpsertValue<CollectionOptions<C>, Def, Path>,
    options?: MutateInUpsertOptions
  ): ChainableMutateIn<C, Key, [...SpecResults, undefined]> {
    const spec = MutateInSpec.upsert(path, value, options);
    const newSpecs = [...this.getSpecs(), spec];
    this.specs = newSpecs as never;

    return this as never;
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
  replace<Path extends MutateInReplacePath<CollectionOptions<C>, Def>>(
    path: Path,
    value: MutateInReplaceValue<CollectionOptions<C>, Def, NoInfer<Path>>,
    options?: MutateInReplaceOptions
  ): ChainableMutateIn<C, Key, [...SpecResults, undefined]> {
    const spec = MutateInSpec.replace(path, value, options);
    return this.push(spec);
  }

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
  remove<const Path extends MutateInRemovePath<CollectionOptions<C>, Def>>(
    path: Path,
    options?: MutateInRemoveOptions
  ): IsLegalPath<'remove', CollectionOptions<C>, Def['Body'], Path> extends true
    ? ChainableMutateIn<C, Key, [...SpecResults, undefined]>
    : IllegalPathErrorMessage<'remove', Path> {
    const spec = MutateInSpec.remove(path, options);
    return this.push(spec) as never;
  }

  /**
   * Add one or more values at end of an array.
   *
   * Fails if the property does not exist, unless `{ createPath: true }`.
   * Use the option `{ multi: true }` to add multiple values or
   * use `arrayAppendMultiple`.
   *
   * @see MutateInSpec.arrayAppend
   * @see MutateInSpec.arrayAppendMultiple
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
    Path extends MutateInArrayAppendPath<CollectionOptions<C>, Def>,
    Multi extends boolean = false,
  >(
    path: Path,
    value: MutateInArrayAppendValue<CollectionOptions<C>, Def, NoInfer<Path>, Multi>,
    options?: MutateInArrayAppendOptions<Multi>
  ): ChainableMutateIn<C, Key, [...SpecResults, undefined]> {
    const spec = MutateInSpec.arrayAppend(path, value, options);
    return this.push(spec);
  }

  arrayAppendMultiple<Path extends MutateInArrayAppendPath<CollectionOptions<C>, Def>>(
    path: Path,
    value: MutateInArrayAppendValue<CollectionOptions<C>, Def, NoInfer<Path>, true>,
    options?: Omit<MutateInArrayAppendOptions<never>, 'multi'>
  ): ChainableMutateIn<C, Key, [...SpecResults, undefined]> {
    const spec = MutateInSpec.arrayAppend(path, value, {
      ...options,
      multi: true,
    });
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
    Path extends MutateInArrayPrependPath<CollectionOptions<C>, Def>,
    Multi extends boolean = false,
  >(
    path: Path,
    value: MutateInArrayPrependValue<CollectionOptions<C>, Def, NoInfer<Path>, Multi>,
    options?: MutateInArrayPrependOptions<Multi>
  ): ChainableMutateIn<C, Key, [...SpecResults, undefined]> {
    const spec = MutateInSpec.arrayPrepend(path, value, options);
    return this.push(spec);
  }

  arrayPrependMultiple<
    Path extends MutateInArrayPrependPath<CollectionOptions<C>, Def>,
    Value extends MutateInArrayPrependValue<
      CollectionOptions<C>,
      Def,
      NoInfer<Path>,
      true
    >,
  >(
    path: Path,
    value: NoInfer<Value>,
    options?: Omit<MutateInArrayPrependOptions<never>, 'multi'>
  ): ChainableMutateIn<C, Key, [...SpecResults, undefined]> {
    const spec = MutateInSpec.arrayPrepend(path, value, {
      ...options,
      multi: true,
    });
    return this.push(spec);
  }

  /**
   * Add one or more values at a specific array index.
   *
   * Fails if the property does not exist, unless `{ createPath: true }`.
   * Use `{ multi: true }` to add multiple values.
   *
   * @example collection.arrayInsert('authors[1]', 'Luke');
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
    Path extends MutateInArrayInsertPath<CollectionOptions<C>, Def>,
    Multi extends boolean = false,
  >(
    path: Path,
    value: MutateInArrayInsertValue<
      CollectionOptions<C>,
      Def,
      Extract<NoInfer<Path>, MutateInArrayInsertPath<CollectionOptions<C>, Def>>,
      Multi
    >,
    options?: MutateInArrayInsertOptions<Multi>
  ): ChainableMutateIn<C, Key, [...SpecResults, undefined]> {
    const spec = MutateInSpec.arrayInsert(path as never, value as never, options);
    return this.push(spec);
  }

  arrayInsertMultiple<
    Path extends MutateInArrayInsertPath<CollectionOptions<C>, Def>,
    Value extends MutateInArrayInsertValue<
      CollectionOptions<C>,
      Def,
      Extract<NoInfer<Path>, MutateInArrayInsertPath<CollectionOptions<C>, Def>>,
      true
    >,
  >(
    path: Path,
    value: NoInfer<Value>,
    options?: Omit<MutateInArrayInsertOptions<never>, 'multi'>
  ): ChainableMutateIn<C, Key, [...SpecResults, undefined]> {
    const spec = MutateInSpec.arrayInsert(path, value as never, {
      ...options,
      multi: true,
    });
    return this.push(spec);
  }

  /**
   * Add a value to an array, but fails if the value already exists in the array.
   * The position of the new element is unknown.
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
  arrayAddUnique<Path extends MutateInArrayAddUniquePath<CollectionOptions<C>, Def>>(
    path: Path,
    value: MutateInArrayAddUniqueValue<CollectionOptions<C>, Def, NoInfer<Path>>,
    options?: MutateInArrayAddUniqueOptions
  ): ChainableMutateIn<C, Key, [...SpecResults, undefined]> {
    const spec = MutateInSpec.arrayAddUnique(path, value, options);
    return this.push(spec);
  }

  /**
   * Add multiple unique values with a single spec is not natively supported.
   * This method emulates it by adding multiple specs, each containing a single value.
   *
   * @param path
   * @param values
   * @param options
   */
  arrayAddUniqueMultiple<
    Path extends MutateInArrayAddUniquePath<CollectionOptions<C>, Def>,
    Value extends MutateInArrayAddUniqueValue<CollectionOptions<C>, Def, NoInfer<Path>>,
    Values extends ReadonlyArray<Value>,
  >(
    path: Path,
    values: NoInfer<Values>,
    options?: MutateInArrayAddUniqueOptions
  ): ChainableMutateIn<C, Key, [...SpecResults, ...ArrayAddUniqueSpecs<Values>]> {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let instance = this;

    for (const value of values) {
      const spec = MutateInSpec.arrayAddUnique(path, value, options);

      instance = instance.push(spec) as never;
    }

    return instance as never;
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
  increment<Path extends MutateInBinaryPath<CollectionOptions<C>, Def>>(
    path: Path,
    incrementBy: MutateInBinaryValue<
      CollectionOptions<C>,
      Def,
      Extract<NoInfer<Path>, MutateInBinaryPath<CollectionOptions<C>, Def>>
    >,
    options?: MutateInBinaryOptions
  ): ChainableMutateIn<C, Key, [...SpecResults, number]> {
    const spec = MutateInSpec.increment(path, incrementBy, options);
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
  decrement<Path extends MutateInBinaryPath<CollectionOptions<C>, Def>>(
    path: Path,
    decrementBy: MutateInBinaryValue<
      CollectionOptions<C>,
      Def,
      Extract<NoInfer<Path>, MutateInBinaryPath<CollectionOptions<C>, Def>>
    >,
    options?: MutateInBinaryOptions
  ): ChainableMutateIn<C, Key, [...SpecResults, number]> {
    const spec = MutateInSpec.decrement(path, decrementBy, options);
    return this.push(spec);
  }

  /**
   * Return the array of specs.
   */
  getSpecs() {
    return this.specs;
  }
}
