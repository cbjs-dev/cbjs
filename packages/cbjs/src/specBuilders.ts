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

import { CppProtocolSubdocOpcode } from './binding.js';
import { MakeLookupInSpec } from './clusterTypes/kv/lookup/lookupIn.types.js';
import {
  LookupInCountPath,
  LookupInExistsPath,
  LookupInGetPath,
  LookupInSpecCountFunction,
  LookupInSpecExistsFunction,
  LookupInSpecGetFunction,
} from './clusterTypes/kv/lookup/lookupOperations.types.js';
import {
  AnyMutateInPath,
  AnyMutateInValue,
  MutateInPath,
  MutateInSpecOpcode,
  MutateInValue,
} from './clusterTypes/kv/mutation/mutateIn.types.js';
import {
  MutateInArrayAddUniqueFunction,
  MutateInArrayAddUniqueOptions,
  MutateInArrayAppendFunction,
  MutateInArrayAppendOptions,
  MutateInArrayInsertFunction,
  MutateInArrayInsertOptions,
  MutateInArrayPrependFunction,
  MutateInArrayPrependOptions,
  MutateInCounterOptions,
  MutateInDecrementFunction,
  MutateInDecrementOptions,
  MutateInIncrementFunction,
  MutateInInsertFunction,
  MutateInInsertOptions,
  MutateInRemoveFunction,
  MutateInRemoveOptions,
  MutateInReplaceFunction,
  MutateInUpsertFunction,
  MutateInUpsertOptions,
  ValidateMutateInInsertPath,
  ValidateMutateInRemovePath,
  ValidateMutateInReplacePath,
  ValidateMutateInUpsertPath,
} from './clusterTypes/kv/mutation/mutationOperations.types.js';
import { LookupInSpec, MutateInSpec } from './sdspecs.js';

/**
 * Object of functions to construct, locally typed, {@link LookupInSpec} instance.
 *
 * @see Collection.lookupIn.
 */
type LookupInSpecMakers<Def extends DocDef> = {
  get: LookupInSpecGetFunction<Def>;
  exists: LookupInSpecExistsFunction<Def>;
  count: LookupInSpecCountFunction<Def>;
};

/**
 * Utility function to build a strongly typed {@link LookupInSpec}.
 *
 * @see Collection.lookupIn
 */
export function lookupSpec<Def extends DocDef>(): LookupInSpecMakers<Def> {
  return {
    get: LookupInSpec.get,
    exists: LookupInSpec.exists,
    // eslint-disable-next-line @typescript-eslint/unbound-method
    count: LookupInSpec.count,
  };
}

/**
 * Utility class to build an array of strongly typed {@link LookupInSpec}.
 *
 * @example
 * LookupSpecs.for<Doc>().get('title').count('tags').exists('modifiedBy').getSpecs();
 */
export class LookupSpecs<
  Def extends DocDef,
  SpecDefinitions extends ReadonlyArray<LookupInSpec>,
> {
  protected readonly specs: SpecDefinitions;

  /**
   * Create a new instance based on the given specs.
   *
   * @param specs The {@link LookupInSpec} definition carried by this instance.
   */
  constructor(specs: SpecDefinitions) {
    this.specs = specs;
  }

  /**
   * Create an object used to chain spec definitions.
   *
   * @example
   * LookupSpecs.for<Doc>().get('title').count('tags').exists('modifiedBy');
   */
  static for<Def extends DocDef>(): LookupSpecs<Def, []> {
    return new LookupSpecs([]);
  }

  push<Spec extends LookupInSpec>(
    spec: Spec
  ): LookupSpecs<Def, [...SpecDefinitions, Spec]> {
    return new LookupSpecs([...this.getSpecs(), spec]);
  }

  get(
    path: '',
    options?: { xattr?: boolean }
  ): LookupSpecs<
    Def,
    [...SpecDefinitions, MakeLookupInSpec<Def, CppProtocolSubdocOpcode.get_doc, ''>]
  >;

  get<Path extends Exclude<LookupInGetPath<Def>, ''>>(
    path: Path,
    options?: { xattr?: boolean }
  ): LookupSpecs<
    Def,
    [...SpecDefinitions, MakeLookupInSpec<Def, CppProtocolSubdocOpcode.get, Path>]
  >;

  /**
   * Push a {@link LookupInSpec.get}() spec.
   *
   * @param path The path to the field.
   * @param options Optional parameters for this operation.
   * @param options.xattr
   * Whether this operation should reference the document body or the extended
   * attributes data for the document.
   */
  get<Path extends LookupInGetPath<Def>>(
    path: Path,
    options?: { xattr?: boolean }
  ): LookupSpecs<Def, [...SpecDefinitions, LookupInSpec]> {
    const spec = LookupInSpec.get(path, options);
    return this.push(spec);
  }

  /**
   * Push a {@link LookupInSpec.exists}() spec.
   *
   * @param path The path to the field.
   * @param options Optional parameters for this operation.
   * @param options.xattr
   * Whether this operation should reference the document body or the extended
   * attributes data for the document.
   */
  exists<Path extends LookupInExistsPath<Def>>(
    path: Path,
    options?: { xattr?: boolean }
  ): LookupSpecs<
    Def,
    [...SpecDefinitions, MakeLookupInSpec<Def, CppProtocolSubdocOpcode.exists, Path>]
  > {
    const spec = LookupInSpec.exists<Def, Path>(path, options);
    return this.push(spec);
  }

  /**
   * Push a {@link LookupInSpec.count}() spec.
   *
   * @param path The path to the field.
   * @param options Optional parameters for this operation.
   * @param options.xattr
   * Whether this operation should reference the document body or the extended
   * attributes data for the document.
   */
  count<Path extends LookupInCountPath<Def>>(
    path: Path,
    options?: { xattr?: boolean }
  ): LookupSpecs<
    Def,
    [...SpecDefinitions, MakeLookupInSpec<Def, CppProtocolSubdocOpcode.get_count, Path>]
  > {
    const spec = LookupInSpec.count<Def, Path>(path, options);
    return this.push(spec);
  }

  /**
   * Get the array of specs.
   */
  getSpecs(): SpecDefinitions {
    return this.specs;
  }
}

/**
 * Object of functions to construct, locally typed, {@link MutateInSpec} instance.
 *
 * @see Collection.mutateIn.
 */
type MutateInSpecMakers<Def extends DocDef> = {
  insert: MutateInInsertFunction<Def>;
  upsert: MutateInUpsertFunction<Def>;
  replace: MutateInReplaceFunction<Def>;
  remove: MutateInRemoveFunction<Def>;
  arrayAppend: MutateInArrayAppendFunction<Def>;
  arrayPrepend: MutateInArrayPrependFunction<Def>;
  arrayInsert: MutateInArrayInsertFunction<Def>;
  arrayAddUnique: MutateInArrayAddUniqueFunction<Def>;
  increment: MutateInIncrementFunction<Def>;
  decrement: MutateInDecrementFunction<Def>;
};

/**
 * Utility function to build a strongly typed {@link MutateInSpec}.
 *
 * @see Collection.mutateIn
 */
export function mutationSpec<Def extends DocDef>(): MutateInSpecMakers<Def> {
  return {
    insert: MutateInSpec.insert,
    upsert: MutateInSpec.upsert,
    replace: MutateInSpec.replace,
    remove: MutateInSpec.remove,
    arrayAppend: MutateInSpec.arrayAppend,
    arrayPrepend: MutateInSpec.arrayPrepend,
    arrayInsert: MutateInSpec.arrayInsert,
    arrayAddUnique: MutateInSpec.arrayAddUnique,
    increment: MutateInSpec.increment,
    decrement: MutateInSpec.decrement,
  };
}

/**
 * Utility class to build an array of strongly typed {@link MutateInSpec}.
 *
 * @example
 * MutationSpecs.for<Doc>().insert('description', 'Couchbase: No Equal').arrayAppend('tags', 'nosql');
 */
export class MutationSpecs<
  Def extends DocDef,
  SpecDefinitions extends ReadonlyArray<MutateInSpec<Def>>,
> {
  private readonly specs: SpecDefinitions;

  /**
   * Create a new instance based on the given specs.
   *
   * @param specs The {@link MutateInSpec} definition carried by this instance.
   */
  constructor(specs: SpecDefinitions) {
    this.specs = specs;
  }

  /**
   * Create an object used to chain spec definitions.
   *
   * @example
   * MutationSpecs.for<Doc>().insert('description', 'Couchbase: No Equal').arrayAppend('tags', 'nosql');
   */
  static for<Def extends DocDef>(): MutationSpecs<Def, []> {
    return new MutationSpecs([]);
  }

  /**
   * Creates a MutateInSpec for inserting a field into the document.  Failing if
   * the field already exists at the specified path.
   *
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
    Path extends AnyMutateInPath<Def, CppProtocolSubdocOpcode.dict_add>,
    Value extends AnyMutateInValue<Def, CppProtocolSubdocOpcode.dict_add, Path>,
  >(
    path: ValidateMutateInInsertPath<Def, Path>,
    value: Value,
    options?: MutateInInsertOptions
  ): MutationSpecs<
    Def,
    [
      ...SpecDefinitions,
      MutateInSpec<Def, CppProtocolSubdocOpcode.dict_add, Path, false, Value>,
    ]
  > {
    const spec = MutateInSpec.insert<Def, Path, Value>(path, value, options);
    return new MutationSpecs([...this.getSpecs(), spec]);
  }

  upsert<Value extends MutateInValue<Def, CppProtocolSubdocOpcode.set_doc, ''>>(
    path: '',
    value: Value,
    options?: MutateInUpsertOptions
  ): MutationSpecs<
    Def,
    [
      ...SpecDefinitions,
      MutateInSpec<Def, CppProtocolSubdocOpcode.set_doc, '', false, Value>,
    ]
  >;

  upsert<
    Path extends AnyMutateInPath<Def, CppProtocolSubdocOpcode.dict_upsert>,
    Value extends AnyMutateInValue<Def, CppProtocolSubdocOpcode.dict_upsert, Path>,
  >(
    path: Path,
    value: Value,
    options?: MutateInUpsertOptions
  ): MutationSpecs<
    Def,
    [
      ...SpecDefinitions,
      MutateInSpec<Def, CppProtocolSubdocOpcode.dict_upsert, Path, false, Value>,
    ]
  >;

  /**
   * Creates a MutateInSpec for upserting a field on a document.  This updates
   * the value of the specified field, or creates the field if it does not exits.
   *
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
      Def,
      CppProtocolSubdocOpcode.set_doc | CppProtocolSubdocOpcode.dict_upsert
    >,
    Value extends AnyMutateInValue<
      Def,
      CppProtocolSubdocOpcode.set_doc | CppProtocolSubdocOpcode.dict_upsert,
      Path
    >,
  >(
    path: ValidateMutateInUpsertPath<Def, Path>,
    value: Value,
    options?: MutateInUpsertOptions
  ): MutationSpecs<
    Def,
    [
      ...SpecDefinitions,
      MutateInSpec<
        Def,
        CppProtocolSubdocOpcode.set_doc | CppProtocolSubdocOpcode.dict_upsert,
        any,
        false,
        any
      >,
    ]
  > {
    const spec = MutateInSpec.upsert<Def, Path, Value>(path, value, options);
    return new MutationSpecs([...this.getSpecs(), spec]);
  }

  /**
   * Creates a MutateInSpec for replacing a field on a document.  This updates
   * the value of the specified field, failing if the field does not exits.
   *
   * @param path The path to the field.
   * @param value The value to write.
   * @param options Optional parameters for this operation.
   * @param options.xattr
   * Whether this operation should reference the document body or the extended
   * attributes data for the document.
   */
  replace<
    Path extends AnyMutateInPath<Def, CppProtocolSubdocOpcode.replace>,
    Value extends AnyMutateInValue<Def, CppProtocolSubdocOpcode.replace, Path>,
  >(
    path: ValidateMutateInReplacePath<Def, Path>,
    value: Value,
    options?: MutateInUpsertOptions
  ): MutationSpecs<
    Def,
    [
      ...SpecDefinitions,
      MutateInSpec<Def, CppProtocolSubdocOpcode.replace, any, false, any>,
    ]
  > {
    const spec = MutateInSpec.replace<Def, Path, Value>(path, value, options);
    return new MutationSpecs([...this.getSpecs(), spec]);
  }

  remove(
    path: '',
    options?: MutateInRemoveOptions
  ): MutationSpecs<
    Def,
    [
      ...SpecDefinitions,
      MutateInSpec<Def, CppProtocolSubdocOpcode.remove_doc, '', false, never>,
    ]
  >;

  remove<Path extends AnyMutateInPath<Def, CppProtocolSubdocOpcode.remove>>(
    path: ValidateMutateInInsertPath<Def, Path>,
    options?: MutateInRemoveOptions
  ): MutationSpecs<
    Def,
    [
      ...SpecDefinitions,
      MutateInSpec<Def, CppProtocolSubdocOpcode.remove, Path, false, never>,
    ]
  >;

  /**
   * Creates a MutateInSpec for remove a field from a document.
   *
   * @param path The path to the field.
   * @param options Optional parameters for this operation.
   * @param options.xattr
   * Whether this operation should reference the document body or the extended
   * attributes data for the document.
   */
  remove<
    Path extends AnyMutateInPath<
      Def,
      CppProtocolSubdocOpcode.remove | CppProtocolSubdocOpcode.remove_doc
    >,
  >(
    path: ValidateMutateInRemovePath<Def, Path>,
    options?: MutateInRemoveOptions
  ): MutationSpecs<
    Def,
    [
      ...SpecDefinitions,
      MutateInSpec<
        Def,
        CppProtocolSubdocOpcode.remove | CppProtocolSubdocOpcode.remove_doc,
        Path,
        false,
        never
      >,
    ]
  > {
    const spec = MutateInSpec.remove(path as never, options);
    return new MutationSpecs([...this.getSpecs(), spec]) as never;
  }

  /**
   * Creates a MutateInSpec for adding a value to the end of an array in a document.
   *
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
    Path extends AnyMutateInPath<Def, CppProtocolSubdocOpcode.array_push_last>,
    Value extends AnyMutateInValue<Def, CppProtocolSubdocOpcode.array_push_last, Path>,
    Multi extends boolean = false,
  >(
    path: Path,
    value: Value,
    options?: MutateInArrayAppendOptions<Multi>
  ): MutationSpecs<
    Def,
    [
      ...SpecDefinitions,
      MutateInSpec<Def, CppProtocolSubdocOpcode.array_push_last, Path, Multi, Value>,
    ]
  > {
    const spec = MutateInSpec.arrayAppend<Def, Path, Value, Multi>(path, value, options);
    return new MutationSpecs([...this.getSpecs(), spec]);
  }

  /**
   * Creates a MutateInSpec for adding a value to the beginning of an array in a document.
   *
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
    Path extends AnyMutateInPath<Def, CppProtocolSubdocOpcode.array_push_first>,
    Value extends AnyMutateInValue<Def, CppProtocolSubdocOpcode.array_push_first, Path>,
    Multi extends boolean = false,
  >(
    path: Path,
    value: Value,
    options?: MutateInArrayPrependOptions<Multi>
  ): MutationSpecs<
    Def,
    [
      ...SpecDefinitions,
      MutateInSpec<Def, CppProtocolSubdocOpcode.array_push_first, Path, Multi, Value>,
    ]
  > {
    const spec = MutateInSpec.arrayPrepend<Def, Path, Value, Multi>(path, value, options);
    return new MutationSpecs([...this.getSpecs(), spec]);
  }

  /**
   * Creates a MutateInSpec for adding a value to a specified location in an array in a
   * document.  The path should specify a specific index in the array and the new values
   * are inserted at this location.
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
    Path extends AnyMutateInPath<Def, CppProtocolSubdocOpcode.array_insert>,
    Value extends AnyMutateInValue<Def, CppProtocolSubdocOpcode.array_insert, Path>,
    Multi extends boolean = false,
  >(
    path: Path,
    value: Value,
    options?: MutateInArrayInsertOptions<Multi>
  ): MutationSpecs<
    Def,
    [
      ...SpecDefinitions,
      MutateInSpec<Def, CppProtocolSubdocOpcode.array_insert, Path, Multi, Value>,
    ]
  > {
    const spec = MutateInSpec.arrayInsert<Def, Path, Value, Multi>(path, value, options);
    return new MutationSpecs([...this.getSpecs(), spec]);
  }

  /**
   * Creates a MutateInSpec for adding unique values to an array in a document.  This
   * operation will only add values if they do not already exist elsewhere in the array.
   *
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
  arrayAddUnique<
    Path extends AnyMutateInPath<Def, CppProtocolSubdocOpcode.array_add_unique>,
    Value extends AnyMutateInValue<Def, CppProtocolSubdocOpcode.array_add_unique, Path>,
  >(
    path: Path,
    value: Value,
    options?: MutateInArrayAddUniqueOptions
  ): MutationSpecs<
    Def,
    [
      ...SpecDefinitions,
      MutateInSpec<Def, CppProtocolSubdocOpcode.array_add_unique, Path, false, Value>,
    ]
  > {
    const spec = MutateInSpec.arrayAddUnique<Def, Path, Value>(path, value, options);
    return new MutationSpecs([...this.getSpecs(), spec]);
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
    Path extends AnyMutateInPath<Def, CppProtocolSubdocOpcode.counter>,
    Value extends AnyMutateInValue<Def, CppProtocolSubdocOpcode.counter, Path>,
  >(
    path: Path,
    incrementBy: Value,
    options?: MutateInCounterOptions
  ): MutationSpecs<
    Def,
    [
      ...SpecDefinitions,
      MutateInSpec<Def, CppProtocolSubdocOpcode.counter, Path, false, Value>,
    ]
  > {
    const spec = MutateInSpec.increment<Def, Path, Value>(path, incrementBy, options);
    return new MutationSpecs([...this.getSpecs(), spec]);
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
    Path extends AnyMutateInPath<Def, CppProtocolSubdocOpcode.counter>,
    Value extends AnyMutateInValue<Def, CppProtocolSubdocOpcode.counter, Path>,
  >(
    path: Path,
    decrementBy: Value,
    options?: MutateInDecrementOptions
  ): MutationSpecs<
    Def,
    [
      ...SpecDefinitions,
      MutateInSpec<Def, CppProtocolSubdocOpcode.counter, Path, false, Value>,
    ]
  > {
    const spec = MutateInSpec.decrement<Def, Path, Value>(path, decrementBy, options);
    return new MutationSpecs([...this.getSpecs(), spec]);
  }

  /**
   * Get the array of specs.
   */
  getSpecs(): SpecDefinitions {
    return this.specs;
  }
}
