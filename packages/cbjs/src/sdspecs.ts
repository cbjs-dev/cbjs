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
import binding, { CppProtocolSubdocOpcode } from './binding.js';
import { isLookupInMacro, isMutateInMacro } from './clusterTypes/guards.js';
import {
  LookupInInternalPath,
  LookupInPath,
  LookupInSpecOpCode,
  MakeLookupInSpec,
  ToLookupInternalPath,
} from './clusterTypes/kv/lookup/lookupIn.types.js';
import { LookupInMacroReturnType } from './clusterTypes/kv/lookup/lookupInMacro.types.js';
import {
  LookupInCountPath,
  LookupInExistsPath,
  LookupInGetPath,
} from './clusterTypes/kv/lookup/lookupOperations.types.js';
import {
  AnyMutateInPath,
  AnyMutateInValue,
  MutateInPath,
  MutateInSpecOpcode,
  MutateInValue,
} from './clusterTypes/kv/mutation/mutateIn.types.js';
import { MutateInMacroReturnType } from './clusterTypes/kv/mutation/mutateInMacro.types.js';
import {
  MutateInArrayAddUniqueOptions,
  MutateInArrayAppendOptions,
  MutateInArrayInsertOptions,
  MutateInArrayPrependOptions,
  MutateInCounterOptions,
  MutateInDecrementOptions,
  MutateInInsertOptions,
  MutateInRemoveOptions,
  MutateInReplaceOptions,
  MutateInUpsertOptions,
  ValidateMutateInInsertPath,
  ValidateMutateInRemovePath,
  ValidateMutateInReplacePath,
  ValidateMutateInUpsertPath,
} from './clusterTypes/kv/mutation/mutationOperations.types.js';

/**
 * Represents a macro that can be passed to a lookup-in operation to
 * fetch special values such as the expiry, cas, etc...
 *
 * @category Key-Value
 */
export class LookupInMacro<
  Type extends keyof LookupInMacroReturnType = keyof LookupInMacroReturnType,
> {
  /**
   * @internal
   */
  _value: Type;

  constructor(value: Type) {
    this._value = value;
  }

  /**
   * A macro which references the entirety of the document meta-data.
   */
  static get Document(): LookupInMacro<'$document'> {
    return new LookupInMacro('$document');
  }

  /**
   * A macro which references the expiry of a document.
   */
  static get Expiry(): LookupInMacro<'$document.exptime'> {
    return new LookupInMacro('$document.exptime');
  }

  /**
   * A macro which references the cas of a document.
   */
  static get Cas(): LookupInMacro<'$document.CAS'> {
    return new LookupInMacro('$document.CAS');
  }

  /**
   * A macro which references the seqno of a document.
   */
  static get SeqNo(): LookupInMacro<'$document.seqno'> {
    return new LookupInMacro('$document.seqno');
  }

  /**
   * A macro which references the last modified time of a document.
   */
  static get LastModified(): LookupInMacro {
    return new LookupInMacro('$document.last_modified');
  }

  /**
   * A macro which references the deletion state of a document.  This
   * only makes sense to use in concert with the internal AccessDeleted
   * flags, which are internal.
   */
  static get IsDeleted(): LookupInMacro {
    return new LookupInMacro('$document.deleted');
  }

  /**
   * A macro which references the size of a document, expressed in bytes.
   */
  static get ValueSizeBytes(): LookupInMacro {
    return new LookupInMacro('$document.value_bytes');
  }

  /**
   * A macro which references the revision id of a document.
   */
  static get RevId(): LookupInMacro {
    return new LookupInMacro('$document.revid');
  }
}

/**
 * Represents a macro that can be passed to a mutate-in operation to
 * write special values such as the expiry, cas, etc...
 *
 * @category Key-Value
 */
export class MutateInMacro<
  Type extends keyof MutateInMacroReturnType = keyof MutateInMacroReturnType,
> {
  /**
   * @internal
   */
  _value: Type;

  constructor(value: Type) {
    this._value = value;
  }

  /**
   * A macro which references the cas of a document.
   */
  static get Cas(): MutateInMacro {
    return new MutateInMacro('${Mutation.CAS}');
  }

  /**
   * A macro which references the seqno of a document.
   */
  static get SeqNo(): MutateInMacro {
    return new MutateInMacro('${Mutation.seqno}');
  }

  /**
   * A macro which references the crc32 of the value of a document.
   */
  static get ValueCrc32c(): MutateInMacro {
    return new MutateInMacro('${Mutation.value_crc32c}');
  }
}

/**
 * Represents a sub-operation to perform within a lookup-in operation.
 *
 * @category Key-Value
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class LookupInSpec<
  Doc extends object = object,
  Opcode extends LookupInSpecOpCode = LookupInSpecOpCode,
  InternalPath extends LookupInInternalPath<Doc, Opcode> = LookupInInternalPath<
    Doc,
    Opcode
  >,
> {
  /**
   * BUG(JSCBC-756): Previously provided access to the expiry macro for a
   * lookup-in operation.
   *
   * @deprecated Use {@link LookupInMacro.Expiry} instead.
   */
  static get Expiry(): LookupInMacro<'$document.exptime'> {
    return LookupInMacro.Expiry;
  }

  /**
   * @internal
   */
  _op: Opcode;

  /**
   * @internal
   */
  _path: InternalPath;

  /**
   * @internal
   */
  _flags: number;

  private constructor(op: Opcode, path: InternalPath, flags: number) {
    this._op = op;
    this._path = path;
    this._flags = flags;
  }

  private static _create<
    Doc extends object,
    Opcode extends LookupInSpecOpCode,
    Path extends LookupInPath<Doc, Opcode>,
  >(
    op: Opcode,
    path: Path,
    options?: { xattr?: boolean }
  ): MakeLookupInSpec<Doc, Opcode, Path> {
    if (!options) {
      options = {};
    }

    let flags = 0;
    const pathValue = (
      isLookupInMacro(path) ? path._value : path
    ) as LookupInInternalPath<Doc, Opcode>;

    if (isLookupInMacro(path)) {
      flags |= binding.protocol_lookup_in_request_body_lookup_in_specs_path_flag.xattr;
    }

    if (options.xattr) {
      flags |= binding.protocol_lookup_in_request_body_lookup_in_specs_path_flag.xattr;
    }

    return new LookupInSpec(op, pathValue, flags) as MakeLookupInSpec<Doc, Opcode, Path>;
  }

  static get<Doc extends object>(
    this: void,
    path: '',
    options?: { xattr?: boolean }
  ): MakeLookupInSpec<Doc, CppProtocolSubdocOpcode.get_doc, ''>;

  static get<Doc extends object, const Path extends Exclude<LookupInGetPath<Doc>, ''>>(
    this: void,
    path: Path,
    options?: { xattr?: boolean }
  ): MakeLookupInSpec<Doc, CppProtocolSubdocOpcode.get, Path>;
  /**
   * Creates a LookupInSpec for fetching a field from the document.
   *
   * @param path The path to the field.
   * @param options Optional parameters for this operation.
   * @param options.xattr
   * Whether this operation should reference the document body or the extended
   * attributes data for the document.
   */
  static get<
    Doc extends object,
    Path extends LookupInGetPath<Doc> = LookupInGetPath<Doc>,
  >(this: void, path: Path, options?: { xattr?: boolean }): LookupInSpec {
    if (path === '') {
      return LookupInSpec._create(binding.protocol_subdoc_opcode.get_doc, '', options);
    }
    return LookupInSpec._create(binding.protocol_subdoc_opcode.get, path, options);
  }

  /**
   * Returns whether a specific field exists in the document.
   *
   * @param path The path to the field.
   * @param options Optional parameters for this operation.
   * @param options.xattr
   * Whether this operation should reference the document body or the extended
   * attributes data for the document.
   */
  static exists<Doc extends object, const Path extends LookupInExistsPath<Doc>>(
    this: void,
    path: Path,
    options?: { xattr?: boolean }
  ): MakeLookupInSpec<Doc, CppProtocolSubdocOpcode.exists, Path> {
    return LookupInSpec._create(binding.protocol_subdoc_opcode.exists, path, options);
  }

  /**
   * Returns the number of elements in the array reference by the path.
   *
   * @param path The path to the field.
   * @param options Optional parameters for this operation.
   * @param options.xattr
   * Whether this operation should reference the document body or the extended
   * attributes data for the document.
   */
  static count<
    Doc extends object,
    const Path extends LookupInCountPath<Doc> = LookupInCountPath<Doc>,
  >(
    this: void,
    path: Path,
    options?: { xattr?: boolean }
  ): LookupInSpec<
    Doc,
    CppProtocolSubdocOpcode.get_count,
    ToLookupInternalPath<Doc, CppProtocolSubdocOpcode.get_count, Path>
  > {
    return LookupInSpec._create(binding.protocol_subdoc_opcode.get_count, path, options);
  }
}

/**
 * Represents a sub-operation to perform within a mutate-in operation.
 *
 * @category Key-Value
 */
export class MutateInSpec<
  Doc extends object = object,
  Opcode extends MutateInSpecOpcode = MutateInSpecOpcode,
  Path extends MutateInPath<Doc, Opcode> = MutateInPath<Doc, Opcode>,
  Multi extends boolean = false,
  Value extends MutateInValue<Doc, Opcode, Path, Multi> = MutateInValue<
    Doc,
    Opcode,
    Path,
    Multi
  >,
> {
  /**
   * BUG(JSCBC-756): Previously provided access to the document cas mutate
   * macro.
   *
   * @deprecated Use {@link MutateInMacro.Cas} instead.
   */
  static get CasPlaceholder(): MutateInMacro {
    return MutateInMacro.Cas;
  }

  /**
   * @internal
   */
  _op: Opcode;

  /**
   * @internal
   */
  _path: Path;

  /**
   * @internal
   */
  _flags: number;

  /**
   * Serialized representation of the user's value.
   *
   * @internal
   */
  _data: string | undefined;

  /**
   * Raw user's value.
   *
   * @internal
   */
  _rawData: Value;

  private constructor(
    op: Opcode,
    path: Path,
    flags: number,
    data: Value,
    serializedData: string | undefined
  ) {
    this._op = op;
    this._path = path;
    this._flags = flags;
    this._rawData = data;
    this._data = serializedData;
  }

  private static _create<
    Doc extends object,
    Opcode extends MutateInSpecOpcode,
    Path extends MutateInPath<Doc, Opcode>,
    Multi extends boolean,
    Value extends MutateInValue<Doc, Opcode, Path, Multi>,
  >(
    op: Opcode,
    path: Path,
    value: Value,
    options?: {
      createPath?: boolean;
      multi?: Multi;
      xattr?: boolean;
    }
  ): MutateInSpec<Doc, Opcode, Path, Multi, Value> {
    if (!options) {
      options = {};
    }

    let flags = 0;
    let valueAsString = JSON.stringify(value);

    if (options.createPath) {
      flags |=
        binding.protocol_mutate_in_request_body_mutate_in_specs_path_flag.create_parents;
    }

    if (isMutateInMacro(value)) {
      valueAsString = JSON.stringify(value._value);
      flags |=
        binding.protocol_mutate_in_request_body_mutate_in_specs_path_flag.expand_macros |
        binding.protocol_mutate_in_request_body_mutate_in_specs_path_flag.xattr;
    } else if (options.xattr) {
      flags |= binding.protocol_mutate_in_request_body_mutate_in_specs_path_flag.xattr;
    }

    if (value !== undefined && options.multi) {
      // BUG(JSCBC-755): As a solution to our oversight of not accepting arrays of
      // values to various sub-document operations, we have exposed an option instead.
      if (!Array.isArray(value)) {
        throw new Error('value must be an array for a multi operation');
      }

      valueAsString = JSON.stringify(value);
      valueAsString = valueAsString.substr(1, valueAsString.length - 2);
    }

    return new MutateInSpec(op, path, flags, value, valueAsString);
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
  static insert<
    Doc extends object,
    const Path extends AnyMutateInPath<Doc, CppProtocolSubdocOpcode.dict_add>,
    Value extends AnyMutateInValue<Doc, CppProtocolSubdocOpcode.dict_add, Path>,
  >(
    this: void,
    path: ValidateMutateInInsertPath<Doc, Path>,
    value: Value,
    options?: MutateInInsertOptions
  ): MutateInSpec<Doc, CppProtocolSubdocOpcode.dict_add, Path, boolean, Value> {
    return MutateInSpec._create(
      binding.protocol_subdoc_opcode.dict_add,
      path,
      value,
      options
    );
  }

  static upsert<
    Doc extends object,
    Value extends MutateInValue<Doc, CppProtocolSubdocOpcode.set_doc, ''>,
  >(
    this: void,
    path: '',
    value: Value,
    options?: MutateInUpsertOptions
  ): MutateInSpec<Doc, CppProtocolSubdocOpcode.set_doc, '', false, Value>;

  static upsert<
    Doc extends object,
    const Path extends AnyMutateInPath<Doc, CppProtocolSubdocOpcode.dict_upsert>,
    Value extends AnyMutateInValue<Doc, CppProtocolSubdocOpcode.dict_upsert, Path>,
  >(
    this: void,
    path: ValidateMutateInUpsertPath<Doc, Path>,
    value: Value,
    options?: MutateInUpsertOptions
  ): MutateInSpec<Doc, CppProtocolSubdocOpcode.dict_upsert, Path, false, Value>;

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
  static upsert<
    Doc extends object,
    Path extends AnyMutateInPath<
      Doc,
      CppProtocolSubdocOpcode.set_doc | CppProtocolSubdocOpcode.dict_upsert
    >,
    Value extends AnyMutateInValue<Doc, CppProtocolSubdocOpcode.set_doc, Path>,
  >(
    this: void,
    path: Path,
    value: Value,
    options?: MutateInUpsertOptions
  ): MutateInSpec<
    Doc,
    CppProtocolSubdocOpcode.set_doc | CppProtocolSubdocOpcode.dict_upsert,
    any,
    boolean,
    any
  > {
    if (!path) {
      return MutateInSpec._create(
        binding.protocol_subdoc_opcode.set_doc,
        '',
        value,
        options
      );
    }

    return MutateInSpec._create(
      binding.protocol_subdoc_opcode.dict_upsert,
      path as never,
      value,
      options
    );
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
  static replace<
    Doc extends object,
    const Path extends AnyMutateInPath<Doc, CppProtocolSubdocOpcode.replace>,
    Value extends AnyMutateInValue<Doc, CppProtocolSubdocOpcode.replace, Path>,
  >(
    this: void,
    path: ValidateMutateInReplacePath<Doc, Path>,
    value: Value,
    options?: MutateInReplaceOptions
  ): MutateInSpec<Doc, CppProtocolSubdocOpcode.replace, Path, boolean, Value> {
    return MutateInSpec._create(
      binding.protocol_subdoc_opcode.replace,
      path,
      value,
      options
    );
  }

  static remove<Doc extends object>(
    this: void,
    path: '',
    options?: MutateInRemoveOptions
  ): MutateInSpec<Doc, CppProtocolSubdocOpcode.remove_doc, '', false, never>;

  static remove<
    Doc extends object,
    const Path extends Exclude<AnyMutateInPath<Doc, CppProtocolSubdocOpcode.remove>, ''>,
  >(
    this: void,
    path: ValidateMutateInRemovePath<Doc, Path>,
    options?: MutateInRemoveOptions
  ): MutateInSpec<Doc, CppProtocolSubdocOpcode.remove, Path, false, never>;

  /**
   * Creates a MutateInSpec for remove a field from a document.
   *
   * @param path The path to the field.
   * @param options Optional parameters for this operation.
   * @param options.xattr
   * Whether this operation should reference the document body or the extended
   * attributes data for the document.
   */
  static remove<
    Doc extends object,
    Path extends AnyMutateInPath<
      Doc,
      CppProtocolSubdocOpcode.remove | CppProtocolSubdocOpcode.remove_doc
    >,
  >(
    this: void,
    path: ValidateMutateInRemovePath<Doc, Path>,
    options?: MutateInRemoveOptions
  ): MutateInSpec<
    Doc,
    CppProtocolSubdocOpcode.remove | CppProtocolSubdocOpcode.remove_doc,
    any,
    false,
    never
  > {
    if (!path) {
      return MutateInSpec._create(
        binding.protocol_subdoc_opcode.remove_doc,
        '',
        undefined as never,
        options
      );
    }
    return MutateInSpec._create(
      binding.protocol_subdoc_opcode.remove,
      path as any,
      undefined as never,
      options
    );
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
  static arrayAppend<
    Doc extends object,
    const Path extends AnyMutateInPath<Doc, CppProtocolSubdocOpcode.array_push_last>,
    Value extends AnyMutateInValue<
      Doc,
      CppProtocolSubdocOpcode.array_push_last,
      Path,
      Multi
    >,
    Multi extends boolean = false,
  >(
    this: void,
    path: Path,
    value: Value,
    options?: MutateInArrayAppendOptions<Multi>
  ): MutateInSpec<Doc, CppProtocolSubdocOpcode.array_push_last, Path, Multi, Value> {
    return MutateInSpec._create(
      binding.protocol_subdoc_opcode.array_push_last,
      path,
      value,
      options
    );
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
  static arrayPrepend<
    Doc extends object,
    const Path extends AnyMutateInPath<Doc, CppProtocolSubdocOpcode.array_push_first>,
    Value extends AnyMutateInValue<
      Doc,
      CppProtocolSubdocOpcode.array_push_first,
      Path,
      Multi
    >,
    Multi extends boolean = false,
  >(
    this: void,
    path: Path,
    value: Value,
    options?: MutateInArrayPrependOptions<Multi>
  ): MutateInSpec<Doc, CppProtocolSubdocOpcode.array_push_first, Path, Multi, Value> {
    return MutateInSpec._create(
      binding.protocol_subdoc_opcode.array_push_first,
      path,
      value,
      options
    );
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
  static arrayInsert<
    Doc extends object,
    const Path extends AnyMutateInPath<Doc, CppProtocolSubdocOpcode.array_insert>,
    Value extends AnyMutateInValue<
      Doc,
      CppProtocolSubdocOpcode.array_insert,
      Path,
      Multi
    >,
    Multi extends boolean = false,
  >(
    this: void,
    path: Path,
    value: Value,
    options?: MutateInArrayInsertOptions<Multi>
  ): MutateInSpec<Doc, CppProtocolSubdocOpcode.array_insert, Path, Multi, Value> {
    return MutateInSpec._create(
      binding.protocol_subdoc_opcode.array_insert,
      path,
      value,
      options
    );
  }

  /**
   * Creates a MutateInSpec for adding a unique value to an array in a document.  This
   * operation will only add the value if it does not already exist elsewhere in the array.
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
  static arrayAddUnique<
    Doc extends object,
    const Path extends AnyMutateInPath<Doc, CppProtocolSubdocOpcode.array_add_unique>,
    Value extends AnyMutateInValue<
      Doc,
      CppProtocolSubdocOpcode.array_add_unique,
      Path,
      false
    >,
  >(
    this: void,
    path: Path,
    value: Value,
    options?: MutateInArrayAddUniqueOptions
  ): MutateInSpec<Doc, CppProtocolSubdocOpcode.array_add_unique, Path, false, Value> {
    return MutateInSpec._create(
      binding.protocol_subdoc_opcode.array_add_unique,
      path,
      value,
      options
    );
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
  static increment<
    Doc extends object,
    const Path extends AnyMutateInPath<Doc, CppProtocolSubdocOpcode.counter>,
    Value extends AnyMutateInValue<Doc, CppProtocolSubdocOpcode.counter, Path>,
  >(
    this: void,
    path: Path,
    incrementBy: Value,
    options?: MutateInCounterOptions
  ): MutateInSpec<Doc, CppProtocolSubdocOpcode.counter, Path, boolean, Value> {
    return MutateInSpec._create(
      binding.protocol_subdoc_opcode.counter,
      path,
      +incrementBy as Value,
      options
    );
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
  static decrement<
    Doc extends object,
    const Path extends AnyMutateInPath<Doc, CppProtocolSubdocOpcode.counter>,
    Value extends AnyMutateInValue<Doc, CppProtocolSubdocOpcode.counter, Path>,
  >(
    this: void,
    path: Path,
    decrementBy: Value,
    options?: MutateInDecrementOptions
  ): MutateInSpec<Doc, CppProtocolSubdocOpcode.counter, Path, false, Value> {
    return MutateInSpec._create(
      binding.protocol_subdoc_opcode.counter,
      path,
      +decrementBy as Value,
      options
    );
  }
}
