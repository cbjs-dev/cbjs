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
import { DocumentPath, ExtractPathToRecordEntry, SubDocument } from '@cbjsdev/shared';

import {
  ExtractCollectionJsonDocDef,
  ExtractCollectionJsonDocKey,
  PathAutocomplete,
} from '../../../clusterTypes/clusterTypes.js';
import {
  AnyCollection,
  MutateInArrayAddUniquePath,
  type MutateInArrayAppendPath,
  MutateInArrayInsertPath,
  MutateInArrayPrependPath,
  MutateInCounterPath,
  MutateInInsertPath,
  MutateInRemovePath,
  MutateInReplacePath,
  MutateInUpsertPath,
} from '../../../clusterTypes/index.js';
import { MutateInSpecResult } from '../../../clusterTypes/kv/mutation/mutateIn.types.js';
import {
  MutateInArrayAddUniqueOptions,
  MutateInArrayAddUniqueValue,
  MutateInArrayAppendOptions,
  MutateInArrayAppendValue,
  MutateInArrayInsertOptions,
  MutateInArrayInsertValue,
  MutateInArrayPrependOptions,
  MutateInArrayPrependValue,
  MutateInCounterOptions,
  MutateInCounterValue,
  MutateInDecrementOptions,
  MutateInInsertOptions,
  MutateInInsertValue,
  MutateInRemoveOptions,
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
  C extends AnyCollection,
  Key extends ExtractCollectionJsonDocKey<C>,
  SpecResults extends ReadonlyArray<undefined | number>,
  Def extends ExtractCollectionJsonDocDef<C, Key> = ExtractCollectionJsonDocDef<C, Key>,
> implements Promise<MutateInResult<SpecResults>>
{
  // Promise stuff

  [Symbol.toStringTag] = 'ChainableMutateInSpecs';

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
    const Path extends MutateInInsertPath<Def>,
    Value extends MutateInInsertValue<Def, Path>,
  >(
    path: Path,
    value: Value,
    options?: MutateInInsertOptions
  ): ChainableMutateIn<C, Key, [...SpecResults, undefined]> {
    const spec = MutateInSpec.insert<Def, Path, Value>(path, value, options);
    return this.push(spec);
  }

  /**
   * Just like {@link ChainableMutateIn.insert}, it adds a property to a document.
   * This method offers better type safety because it looks at optional properties from
   * the standpoint of the record.
   */
  insertIntoRecord<
    const PathToRecord extends ExtractPathToRecordEntry<Def['Body'], Def['Path']>,
    const PathWithinRecord extends MutateInInsertPath<{
      Body: RecordValue;
      Path: DocumentPath<RecordValue>;
    }>,
    Value extends MutateInInsertValue<Def, `${PathToRecord}.${PathWithinRecord}`>,
    RecordValue = Extract<SubDocument<Def['Body'], PathToRecord>, Record<any, any>>,
  >(
    pathToRecord: PathToRecord,
    pathWithinRecord: PathWithinRecord,
    value: Value,
    options?: MutateInInsertOptions
  ): ChainableMutateIn<C, Key, [...SpecResults, undefined]> {
    const spec = MutateInSpec.insert(
      (pathToRecord as string) + '.' + pathWithinRecord,
      value,
      options
    );
    return this.push(spec);
  }

  upsert<Value extends Def['Body']>(
    path: '',
    value: Value,
    options?: MutateInUpsertOptions
  ): ChainableMutateIn<C, Key, [...SpecResults, undefined]>;

  upsert<
    Path extends MutateInUpsertPath<Def>,
    Value extends MutateInUpsertValue<Def, Path>,
  >(
    path: Path,
    value: Value,
    options?: MutateInUpsertOptions
  ): ChainableMutateIn<C, Key, [...SpecResults, undefined]>;

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
  upsert(path: string, value: unknown, options?: MutateInUpsertOptions): any {
    const spec = MutateInSpec.upsert(path, value, options);
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
    Path extends PathAutocomplete<C, MutateInReplacePath<Def>>,
    Value extends MutateInReplaceValue<Def, Extract<Path, MutateInReplacePath<Def>>>,
  >(
    path: Path,
    value: Value,
    options?: MutateInUpsertOptions
  ): ChainableMutateIn<C, Key, [...SpecResults, undefined]> {
    const spec = MutateInSpec.replace(path as never, value, options);
    return this.push(spec);
  }

  remove(
    path: '',
    options?: MutateInRemoveOptions
  ): ChainableMutateIn<C, Key, [...SpecResults, undefined]>;

  remove<Path extends PathAutocomplete<C, MutateInRemovePath<Def>>>(
    path: Path,
    options?: MutateInRemoveOptions
  ): ChainableMutateIn<C, Key, [...SpecResults, undefined]>;

  /**
   * Remove a property from the document.
   * If you remove a property from `MyRecord` in `Record<DocKey, MyRecord>`,
   * you will should use {@link ChainableMutateIn.removeFromRecord} to have better type safety.
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
  remove(path: string, options?: MutateInRemoveOptions): any {
    const spec = MutateInSpec.remove(path as never, options);
    return this.push(spec);
  }

  /**
   * Just like {@link ChainableMutateIn.remove}, it removes a property from a document.
   * This method offers better type safety because it looks at optional properties from
   * the standpoint of the record.
   *
   * @param pathToRecord
   * @param pathWithinRecord
   */
  removeFromRecord<
    const PathToRecord extends ExtractPathToRecordEntry<Def['Body'], Def['Path']>,
    const PathWithinRecord extends MutateInRemovePath<{
      Body: RecordValue;
      Path: DocumentPath<RecordValue>;
    }>,
    RecordValue = Extract<SubDocument<Def['Body'], PathToRecord>, Record<any, any>>,
  >(
    pathToRecord: PathToRecord,
    pathWithinRecord: PathWithinRecord
  ): ChainableMutateIn<C, Key, [...SpecResults, undefined]> {
    const spec = MutateInSpec.remove((pathToRecord as string) + '.' + pathWithinRecord);
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
    Path extends MutateInArrayAppendPath<Def>,
    Value extends MutateInArrayAppendValue<Def, Path, Multi>,
    Multi extends boolean = false,
  >(
    path: Path,
    value: Value,
    options?: MutateInArrayAppendOptions<Multi>
  ): ChainableMutateIn<C, Key, [...SpecResults, undefined]> {
    const spec = MutateInSpec.arrayAppend<Def, Path, Value, Multi>(path, value, options);
    return this.push(spec);
  }

  arrayAppendMultiple<
    Path extends MutateInArrayAppendPath<Def>,
    Value extends MutateInArrayAppendValue<Def, Path, true>,
  >(
    path: Path,
    value: Value,
    options?: Omit<MutateInArrayAppendOptions<never>, 'multi'>
  ): ChainableMutateIn<C, Key, [...SpecResults, undefined]> {
    const spec = MutateInSpec.arrayAppend<Def, Path, Value, true>(path, value, {
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
    Path extends MutateInArrayPrependPath<Def>,
    Value extends MutateInArrayPrependValue<Def, Path, Multi>,
    Multi extends boolean = false,
  >(
    path: Path,
    value: Value,
    options?: MutateInArrayPrependOptions<Multi>
  ): ChainableMutateIn<C, Key, [...SpecResults, undefined]> {
    const spec = MutateInSpec.arrayPrepend<Def, Path, Value, Multi>(path, value, options);
    return this.push(spec);
  }

  arrayPrependMultiple<
    Path extends MutateInArrayPrependPath<Def>,
    Value extends MutateInArrayPrependValue<Def, Path, true>,
  >(
    path: Path,
    value: Value,
    options?: Omit<MutateInArrayPrependOptions<never>, 'multi'>
  ): ChainableMutateIn<C, Key, [...SpecResults, undefined]> {
    const spec = MutateInSpec.arrayPrepend<Def, Path, Value, true>(path, value, {
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
    Path extends PathAutocomplete<C, MutateInArrayInsertPath<Def>>,
    Value extends MutateInArrayInsertValue<
      Def,
      Extract<Path, MutateInArrayInsertPath<Def>>,
      Multi
    >,
    Multi extends boolean = false,
  >(
    path: Path,
    value: Value,
    options?: MutateInArrayInsertOptions<Multi>
  ): ChainableMutateIn<C, Key, [...SpecResults, undefined]> {
    const spec = MutateInSpec.arrayInsert(path as never, value, options);
    return this.push(spec);
  }

  arrayInsertMultiple<
    Path extends PathAutocomplete<C, MutateInArrayInsertPath<Def>>,
    Value extends MutateInArrayInsertValue<
      Def,
      Extract<Path, MutateInArrayInsertPath<Def>>,
      true
    >,
  >(
    path: Path,
    value: Value,
    options?: Omit<MutateInArrayInsertOptions<never>, 'multi'>
  ): ChainableMutateIn<C, Key, [...SpecResults, undefined]> {
    const spec = MutateInSpec.arrayInsert(path as never, value, {
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
  arrayAddUnique<
    Path extends MutateInArrayAddUniquePath<Def>,
    Value extends MutateInArrayAddUniqueValue<Def, Path>,
  >(
    path: Path,
    value: Value,
    options?: MutateInArrayAddUniqueOptions
  ): ChainableMutateIn<C, Key, [...SpecResults, undefined]> {
    const spec = MutateInSpec.arrayAddUnique<Def, Path, Value>(path, value, options);
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
    Path extends MutateInArrayAddUniquePath<Def>,
    Value extends MutateInArrayAddUniqueValue<Def, Path>,
    Values extends ReadonlyArray<Value>,
  >(
    path: Path,
    values: Values,
    options?: MutateInArrayAddUniqueOptions
  ): ChainableMutateIn<C, Key, [...SpecResults, ...ArrayAddUniqueSpecs<Values>]> {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let instance = this;

    for (const value of values) {
      const spec = MutateInSpec.arrayAddUnique<Def, Path, Value>(path, value, options);

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
  increment<
    Path extends PathAutocomplete<C, MutateInCounterPath<Def>>,
    Value extends MutateInCounterValue,
  >(
    path: Path,
    incrementBy: Value,
    options?: MutateInCounterOptions
  ): ChainableMutateIn<C, Key, [...SpecResults, number]> {
    const spec = MutateInSpec.increment(path as never, incrementBy, options);
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
    Path extends PathAutocomplete<C, MutateInCounterPath<Def>>,
    Value extends MutateInCounterValue,
  >(
    path: Path,
    decrementBy: Value,
    options?: MutateInDecrementOptions
  ): ChainableMutateIn<C, Key, [...SpecResults, number]> {
    const spec = MutateInSpec.decrement(path as never, decrementBy, options);
    return this.push(spec);
  }

  /**
   * Return the array of specs.
   */
  getSpecs() {
    return this.specs;
  }
}
