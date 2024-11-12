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
import {
  AnyDocDef,
  DocDef,
  LookupInMacroReturnType,
  MutateInMacroReturnType,
} from '@cbjsdev/shared';

import binding, { CppProtocolSubdocOpcode } from './binding.js';
import { isLookupInMacro, isMutateInMacro } from './clusterTypes/guards.js';
import type {
  LookupInInternalPath,
  LookupInPath,
  LookupInSpecOpCode,
  MakeLookupInSpec,
} from './clusterTypes/kv/lookup/lookupIn.types.js';
import type {
  LookupInCountPath,
  LookupInExistsPath,
  LookupInGetPath,
} from './clusterTypes/kv/lookup/lookupOperations.types.js';
import type {
  MutateInSpecOpcode,
  MutateInValue,
} from './clusterTypes/kv/mutation/mutateIn.types.js';
import type {
  MutateInArrayAddUniqueOptions,
  MutateInArrayAddUniquePath,
  MutateInArrayAddUniqueValue,
  MutateInArrayAppendOptions,
  MutateInArrayAppendPath,
  MutateInArrayAppendValue,
  MutateInArrayInsertOptions,
  MutateInArrayInsertPath,
  MutateInArrayInsertValue,
  MutateInArrayPrependOptions,
  MutateInArrayPrependPath,
  MutateInArrayPrependValue,
  MutateInBinaryOptions,
  MutateInBinaryPath,
  MutateInBinaryValue,
  MutateInInsertOptions,
  MutateInInsertPath,
  MutateInInsertValue,
  MutateInRemoveOptions,
  MutateInRemovePath,
  MutateInReplaceOptions,
  MutateInReplacePath,
  MutateInReplaceValue,
  MutateInUpsertOptions,
  MutateInUpsertPath,
  MutateInUpsertValue,
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
  static get LastModified(): LookupInMacro<'$document.last_modified'> {
    return new LookupInMacro('$document.last_modified');
  }

  /**
   * A macro which references the deletion state of a document.  This
   * only makes sense to use in concert with the internal AccessDeleted
   * flags, which are internal.
   */
  static get IsDeleted(): LookupInMacro<'$document.deleted'> {
    return new LookupInMacro('$document.deleted');
  }

  /**
   * A macro which references the size of a document, expressed in bytes.
   */
  static get ValueSizeBytes(): LookupInMacro<'$document.value_bytes'> {
    return new LookupInMacro('$document.value_bytes');
  }

  /**
   * A macro which references the revision id of a document.
   */
  static get RevId(): LookupInMacro<'$document.revid'> {
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
  Def extends AnyDocDef = AnyDocDef,
  Opcode extends LookupInSpecOpCode = LookupInSpecOpCode,
  InternalPath extends string = string,
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
    Def extends AnyDocDef,
    Opcode extends LookupInSpecOpCode,
    Path extends LookupInPath<Def, Opcode>,
  >(
    op: Opcode,
    path: Path,
    options?: { xattr?: boolean }
  ): MakeLookupInSpec<Def, Opcode, Path> {
    if (!options) {
      options = {};
    }

    let flags = 0;
    const pathValue = (
      isLookupInMacro(path) ? path._value : path
    ) as LookupInInternalPath<Def, Opcode>;

    if (isLookupInMacro(path)) {
      flags |= binding.protocol_lookup_in_request_body_lookup_in_specs_path_flag.xattr;
    }

    if (options.xattr) {
      flags |= binding.protocol_lookup_in_request_body_lookup_in_specs_path_flag.xattr;
    }

    return new LookupInSpec(op, pathValue, flags) as MakeLookupInSpec<Def, Opcode, Path>;
  }

  static get<Def extends AnyDocDef>(
    this: void,
    path: '',
    options?: { xattr?: boolean }
  ): MakeLookupInSpec<Def, CppProtocolSubdocOpcode.get_doc, ''>;

  static get<Def extends AnyDocDef, const Path extends Exclude<LookupInGetPath<Def>, ''>>(
    this: void,
    path: Path,
    options?: { xattr?: boolean }
  ): MakeLookupInSpec<Def, CppProtocolSubdocOpcode.get, Path>;
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
    Def extends AnyDocDef,
    Path extends LookupInGetPath<Def> = LookupInGetPath<Def>,
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
  static exists<Def extends AnyDocDef, const Path extends LookupInExistsPath<Def>>(
    this: void,
    path: Path,
    options?: { xattr?: boolean }
  ): MakeLookupInSpec<Def, CppProtocolSubdocOpcode.exists, Path> {
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
    Def extends AnyDocDef,
    const Path extends LookupInCountPath<Def> = LookupInCountPath<Def>,
  >(
    this: void,
    path: Path,
    options?: { xattr?: boolean }
  ): MakeLookupInSpec<Def, CppProtocolSubdocOpcode.get_count, Path> {
    return LookupInSpec._create(binding.protocol_subdoc_opcode.get_count, path, options);
  }
}

/**
 * Represents a sub-operation to perform within a mutate-in operation.
 *
 * @category Key-Value
 */
export class MutateInSpec<
  Def extends AnyDocDef = DocDef,
  Opcode extends MutateInSpecOpcode = MutateInSpecOpcode,
  Path extends string = string,
  Multi extends boolean = false,
  Value = any,
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
    Def extends AnyDocDef,
    Opcode extends MutateInSpecOpcode,
    Path extends string,
    Multi extends boolean,
    Value extends MutateInValue<Def, Opcode, Path, Multi>,
  >(
    op: Opcode,
    path: Path,
    value: Value,
    options?: {
      createPath?: boolean;
      multi?: Multi;
      xattr?: boolean;
    }
  ): MutateInSpec<Def, Opcode, Path, Multi, Value> {
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
    Def extends AnyDocDef,
    const Path extends MutateInInsertPath<Def>,
    Value extends MutateInInsertValue<Def, Path>,
  >(
    this: void,
    path: Path,
    value: Value,
    options?: MutateInInsertOptions
  ): MutateInSpec<Def, CppProtocolSubdocOpcode.dict_add, Path, boolean, Value> {
    return MutateInSpec._create(
      binding.protocol_subdoc_opcode.dict_add,
      path,
      value,
      options
    );
  }

  static upsert<
    Def extends AnyDocDef,
    Value extends MutateInValue<Def, CppProtocolSubdocOpcode.set_doc, ''>,
  >(
    this: void,
    path: '',
    value: Value,
    options?: MutateInUpsertOptions
  ): MutateInSpec<Def, CppProtocolSubdocOpcode.set_doc, '', false, Value>;

  static upsert<
    Def extends AnyDocDef,
    const Path extends MutateInUpsertPath<Def>,
    Value extends MutateInUpsertValue<Def, Path>,
  >(
    this: void,
    path: Path,
    value: Value,
    options?: MutateInUpsertOptions
  ): MutateInSpec<Def, CppProtocolSubdocOpcode.dict_upsert, Path, false, Value>;

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
  static upsert(
    this: void,
    path: string,
    value: unknown,
    options?: MutateInUpsertOptions
  ): any {
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
    Def extends AnyDocDef,
    const Path extends MutateInReplacePath<Def>,
    Value extends MutateInReplaceValue<Def, Path>,
  >(
    this: void,
    path: Path,
    value: Value,
    options?: MutateInReplaceOptions
  ): MutateInSpec<Def, CppProtocolSubdocOpcode.replace, Path, boolean, Value> {
    return MutateInSpec._create(
      binding.protocol_subdoc_opcode.replace,
      path,
      value,
      options
    );
  }

  static remove<Def extends AnyDocDef>(
    this: void,
    path: '',
    options?: MutateInRemoveOptions
  ): MutateInSpec<Def, CppProtocolSubdocOpcode.remove_doc, '', false, never>;

  static remove<
    Def extends AnyDocDef,
    const Path extends Exclude<MutateInRemovePath<Def>, ''>,
  >(
    this: void,
    path: Path,
    options?: MutateInRemoveOptions
  ): MutateInSpec<Def, CppProtocolSubdocOpcode.remove, Path, false, never>;

  /**
   * Creates a MutateInSpec for remove a field from a document.
   *
   * @param path The path to the field.
   * @param options Optional parameters for this operation.
   * @param options.xattr
   * Whether this operation should reference the document body or the extended
   * attributes data for the document.
   */
  static remove(this: void, path: string, options?: MutateInRemoveOptions): any {
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
      path,
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
    Def extends AnyDocDef,
    const Path extends MutateInArrayAppendPath<Def>,
    Value extends MutateInArrayAppendValue<Def, Path, Multi>,
    Multi extends boolean = false,
  >(
    this: void,
    path: Path,
    value: Value,
    options?: MutateInArrayAppendOptions<Multi>
  ): MutateInSpec<Def, CppProtocolSubdocOpcode.array_push_last, Path, Multi, Value> {
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
    Def extends AnyDocDef,
    const Path extends MutateInArrayPrependPath<Def>,
    Value extends MutateInArrayPrependValue<Def, Path, Multi>,
    Multi extends boolean = false,
  >(
    this: void,
    path: Path,
    value: Value,
    options?: MutateInArrayPrependOptions<Multi>
  ): MutateInSpec<Def, CppProtocolSubdocOpcode.array_push_first, Path, Multi, Value> {
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
    Def extends AnyDocDef,
    const Path extends MutateInArrayInsertPath<Def>,
    Value extends MutateInArrayInsertValue<Def, Path, Multi>,
    Multi extends boolean = false,
  >(
    this: void,
    path: Path,
    value: Value,
    options?: MutateInArrayInsertOptions<Multi>
  ): MutateInSpec<Def, CppProtocolSubdocOpcode.array_insert, Path, Multi, Value> {
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
    Def extends AnyDocDef,
    const Path extends MutateInArrayAddUniquePath<Def>,
    Value extends MutateInArrayAddUniqueValue<Def, Path>,
  >(
    this: void,
    path: Path,
    value: Value,
    options?: MutateInArrayAddUniqueOptions
  ): MutateInSpec<Def, CppProtocolSubdocOpcode.array_add_unique, Path, false, Value> {
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
    Def extends AnyDocDef,
    const Path extends MutateInBinaryPath<Def>,
    Value extends MutateInBinaryValue<Def, Path>,
  >(
    this: void,
    path: Path,
    incrementBy: Value,
    options?: MutateInBinaryOptions
  ): MutateInSpec<Def, CppProtocolSubdocOpcode.counter, Path, boolean, Value> {
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
    Def extends AnyDocDef,
    const Path extends MutateInBinaryPath<Def>,
    Value extends MutateInBinaryValue<Def, Path>,
  >(
    this: void,
    path: Path,
    decrementBy: Value,
    options?: MutateInBinaryOptions
  ): MutateInSpec<Def, CppProtocolSubdocOpcode.counter, Path, false, Value> {
    return MutateInSpec._create(
      binding.protocol_subdoc_opcode.counter,
      path,
      +decrementBy as Value,
      options
    );
  }
}
