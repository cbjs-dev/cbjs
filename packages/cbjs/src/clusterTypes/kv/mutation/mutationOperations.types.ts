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

import type {
  ArrayAppendElement,
  ArrayPrependElement,
  DocumentPath,
  ExtractPathToAppendableArray,
  ExtractPathToInsertableArrayIndex,
  ExtractPathToPrependableArray,
  ExtractPathToRemovableArrayIndex,
  ExtractPathToType,
  ExtractPathToWritable, ExtractPathToWritableArrayIndex,
  ExtractPathToWritableProperty,
  If,
  IsFuzzyDocument,
  PathToRemovableProperty,
  SubDocument,
} from '@cbjsdev/shared';
import { CppProtocolSubdocOpcode } from '../../../binding';
import { MutateInSpec } from '../../../sdspecs';

import type {
  AnyMutateInPath,
  AnyMutateInValue,
  CompatibleMacro,
  MutateInValue,
} from './mutateIn.types';

/**
 * Wrap the value in a `ReadonlyArray` if `Multi` is `true`.
 */
type WithMulti<Multi extends boolean, Value> = Multi extends true ? ReadonlyArray<Value> : Value;

/**
 * Helper to build the value of a mutation operation.
 * Handles cases where the document is fuzzy.
 */
type OperationValue<Doc, Multi extends boolean, Value> =
  If<
    IsFuzzyDocument<Doc>,
    WithMulti<Multi, any>,
    WithMulti<Multi, Value | CompatibleMacro<Value>>
  >
;

/**
 * Helper to build the path of a mutation operation.
 * Handles cases where the document is fuzzy.
 */
type OperationPath<Doc, Path extends string> =
  If<IsFuzzyDocument<Doc>, string, Path>
;

/**
 * Valid mutation path for an `insert` operation. Non-distributive.
 */
export type MutateInInsertPath<Doc extends object> =
  OperationPath<Doc, ExtractPathToType<Doc, ExtractPathToWritableProperty<Doc, DocumentPath<Doc>>, undefined>>
;

/**
 * Acceptable value for an `insert` operation at a specific path.
 */
export type MutateInInsertValue<Doc extends object, Path extends MutateInInsertPath<Doc>> =
  OperationValue<Doc, false, SubDocument<Doc, Path>>
;

/**
 * Mutation options for an `insert` operation.
 */
export type MutateInInsertOptions = { createPath?: boolean; xattr?: boolean };

/**
 * Function that returns a {@link MutateInSpec} instance for an `insert` operation.
 */
export type MutateInInsertFunction<in Doc extends object> =
  <
    Path extends AnyMutateInPath<Doc, CppProtocolSubdocOpcode.dict_add>,
    Value extends AnyMutateInValue<Doc, CppProtocolSubdocOpcode.dict_add, Path>,
  >(
    path: Path,
    value: Value,
    options?: MutateInInsertOptions
  ) => MutateInSpec<Doc, CppProtocolSubdocOpcode.dict_add, Path, false, Value>
;

/**
 * Valid mutation path for an `upsert` operation.
 */
export type MutateInUpsertPath<Doc extends object> =
  OperationPath<Doc, ExtractPathToWritableProperty<Doc, DocumentPath<Doc>> | ''>
;

/**
 * Acceptable value for an `upsert` operation at a specific path.
 */
export type MutateInUpsertValue<Doc extends object, Path extends MutateInUpsertPath<Doc>> =
  OperationValue<Doc, false, SubDocument<Doc, Path>>
;

/**
 * Mutation options for an `upsert` operation.
 */
export type MutateInUpsertOptions = { createPath?: boolean; xattr?: boolean };

/**
 * Function that returns a {@link MutateInSpec} instance for an `upsert` operation.
 */
export type MutateInUpsertFunction<in Doc extends object> = {
  <
    Value extends MutateInValue<Doc, CppProtocolSubdocOpcode.set_doc, ''>,
  >(
    path: '',
    value: Value,
    options?: MutateInUpsertOptions
  ): MutateInSpec<Doc, CppProtocolSubdocOpcode.set_doc, '', false, Value>;

  <
    Path extends AnyMutateInPath<Doc, CppProtocolSubdocOpcode.dict_upsert>,
    Value extends AnyMutateInValue<Doc, CppProtocolSubdocOpcode.dict_upsert, Path>,
  >(
    path: Path,
    value: Value,
    options?: MutateInUpsertOptions
  ): MutateInSpec<Doc, CppProtocolSubdocOpcode.dict_upsert, Path, false, Value>;
};

/**
 * Valid mutation path for a `replace` operation.
 */
export type MutateInReplacePath<Doc extends object> =
  OperationPath<Doc, ExtractPathToWritable<Doc, DocumentPath<Doc>>>
;

/**
 * Acceptable value for a `replace` operation at a specific path.
 */
export type MutateInReplaceValue<Doc extends object, Path extends MutateInReplacePath<Doc>> =
  OperationValue<Doc, false, SubDocument<Doc, Path>>
;

/**
 * Mutation options for a `replace` operation.
 */
export type MutateInReplaceOptions = { createPath?: boolean; xattr?: boolean };

/**
 * Function that returns a {@link MutateInSpec} instance for a `replace` operation.
 */
export type MutateInReplaceFunction<in Doc extends object> =
  <
    Path extends AnyMutateInPath<Doc, CppProtocolSubdocOpcode.replace>,
    Value extends AnyMutateInValue<Doc, CppProtocolSubdocOpcode.replace, Path>,
  >(
    path: Path,
    value: Value,
    options?: MutateInReplaceOptions
  ) => MutateInSpec<Doc, CppProtocolSubdocOpcode.replace, Path, false, Value>
;

/**
 * Valid mutation path for a `remove` operation.
 */
export type MutateInRemovePath<Doc extends object> =
  OperationPath<Doc,
    | PathToRemovableProperty<Doc>
    | ExtractPathToRemovableArrayIndex<Doc, DocumentPath<Doc>>
    | ''
  >
;

/**
 * Mutation options for a `remove` operation.
 */
export type MutateInRemoveOptions = { xattr?: boolean };

/**
 * Function that returns a {@link MutateInSpec} instance for a `remove` operation.
 */
export type MutateInRemoveFunction<in Doc extends object> = {
  (
    path: '',
    options?: MutateInRemoveOptions
  ): MutateInSpec<Doc, CppProtocolSubdocOpcode.remove_doc, '', false, never>;

  <
    Path extends AnyMutateInPath<Doc, CppProtocolSubdocOpcode.remove>
  >(
    path: Path,
    options?: MutateInRemoveOptions
  ): MutateInSpec<Doc, CppProtocolSubdocOpcode.remove, Path, false, never>
};

/**
 * Valid mutation path for an `arrayAppend` operation.
 */
export type MutateInArrayAppendPath<Doc extends object> =
  OperationPath<Doc, ExtractPathToAppendableArray<Doc, DocumentPath<Doc> | ''>>
;

/**
 * Acceptable value for an `arrayAppend` operation at a specific path.
 */
export type MutateInArrayAppendValue<
  Doc extends object,
  Path extends MutateInArrayAppendPath<Doc>,
  Multi extends boolean,
> =
  OperationValue<Doc, Multi, ArrayAppendElement<Extract<SubDocument<Doc, Path>, ReadonlyArray<unknown>>>>
;

/**
 * Mutation options for an `arrayAppend` operation.
 */
export type MutateInArrayAppendOptions<Multi extends boolean> = { createPath?: boolean; xattr?: boolean, multi?: Multi };

/**
 * Function that returns a {@link MutateInSpec} instance for a `arrayAppend` operation.
 */
export type MutateInArrayAppendFunction<in Doc extends object> =
  <
    Path extends AnyMutateInPath<Doc, CppProtocolSubdocOpcode.array_push_last>,
    Value extends AnyMutateInValue<Doc, CppProtocolSubdocOpcode.array_push_last, Path, Multi>,
    Multi extends boolean,
  >(
    path: Path,
    value: Value,
    options?: MutateInArrayAppendOptions<Multi>
  ) => MutateInSpec<Doc, CppProtocolSubdocOpcode.array_push_last, Path, Multi, Value>
;

/**
 * Valid mutation path for an `arrayPrepend` operation.
 */
export type MutateInArrayPrependPath<Doc extends object> =
  OperationPath<Doc, ExtractPathToPrependableArray<Doc, DocumentPath<Doc> | ''>>
;

/**
 * Acceptable value for an `arrayPrepend` operation at a specific path.
 */
export type MutateInArrayPrependValue<
  Doc extends object,
  Path extends MutateInArrayPrependPath<Doc>,
  Multi extends boolean,
> =
  OperationValue<Doc, Multi, ArrayPrependElement<Extract<SubDocument<Doc, Path>, ReadonlyArray<unknown>>>>
;

/**
 * Mutation options for an `arrayPrepend` operation.
 */
export type MutateInArrayPrependOptions<Multi extends boolean> = { createPath?: boolean; xattr?: boolean, multi?: Multi };

/**
 * Function that returns a {@link MutateInSpec} instance for an `arrayPrepend` operation.
 */
export type MutateInArrayPrependFunction<in Doc extends object> =
  <
    Path extends AnyMutateInPath<Doc, CppProtocolSubdocOpcode.array_push_first>,
    Value extends AnyMutateInValue<Doc, CppProtocolSubdocOpcode.array_push_first, Path>,
    Multi extends boolean,
  >(
    path: Path,
    value: Value,
    options?: MutateInArrayPrependOptions<Multi>
  ) => MutateInSpec<Doc, CppProtocolSubdocOpcode.array_push_first, Path, Multi, Value>
;

/**
 * Valid mutation path for an `arrayInsert` operation.
 */
export type MutateInArrayInsertPath<Doc extends object> =
  OperationPath<Doc, ExtractPathToInsertableArrayIndex<Doc, DocumentPath<Doc> | ''>>
;

/**
 * Acceptable value for an `arrayInsert` operation at a specific path.
 */
export type MutateInArrayInsertValue<
  Doc extends object,
  Path extends MutateInArrayInsertPath<Doc>,
  Multi extends boolean,
> =
  OperationValue<Doc, Multi, SubDocument<Doc, Path>>

/**
 * Mutation options for an `arrayInsert` operation.
 */
export type MutateInArrayInsertOptions<Multi extends boolean> = { createPath?: boolean; xattr?: boolean, multi?: Multi };

/**
 * Function that returns a {@link MutateInSpec} instance for an `arrayInsert` operation.
 */
export type MutateInArrayInsertFunction<in Doc extends object> =
  <
    Path extends AnyMutateInPath<Doc, CppProtocolSubdocOpcode.array_insert>,
    Value extends AnyMutateInValue<Doc, CppProtocolSubdocOpcode.array_insert, Path>,
    Multi extends boolean,
  >(
    path: Path,
    value: Value,
    options?: MutateInArrayInsertOptions<Multi>
  ) => MutateInSpec<Doc, CppProtocolSubdocOpcode.array_insert, Path, Multi, Value>
;

/**
 * Valid mutation path for an `arrayAddUnique` operation.
 */
export type MutateInArrayAddUniquePath<Doc extends object> =
  OperationPath<Doc, ExtractPathToAppendableArray<Doc, DocumentPath<Doc> | ''>>
;

/**
 * Acceptable value for an `arrayAddUnique` operation at a specific path.
 */
export type MutateInArrayAddUniqueValue<
  Doc extends object,
  Path extends MutateInArrayAddUniquePath<Doc>,
> =
  OperationValue<Doc, false, ArrayAppendElement<Extract<SubDocument<Doc, Path>, ReadonlyArray<unknown>>>>
;

/**
 * Mutation options for an `arrayAddUnique` operation.
 */
export type MutateInArrayAddUniqueOptions = { createPath?: boolean; xattr?: boolean };

/**
 * Function that returns a {@link MutateInSpec} instance for an `arrayAddUnique` operation.
 */
export type MutateInArrayAddUniqueFunction<in Doc extends object> =
  <
    Path extends AnyMutateInPath<Doc, CppProtocolSubdocOpcode.array_add_unique>,
    Value extends AnyMutateInValue<Doc, CppProtocolSubdocOpcode.array_add_unique, Path>,
    Multi extends boolean = false,
  >(
    path: Path,
    value: Value,
    options?: MutateInArrayAddUniqueOptions
  ) => MutateInSpec<Doc, CppProtocolSubdocOpcode.array_add_unique, Path, Multi, Value>
;

/**
 * Valid mutation path for an `increment` or `decrement` operation.
 */
export type MutateInCounterPath<Doc extends object> =
  OperationPath<Doc,
    | ExtractPathToType<Doc, ExtractPathToWritableProperty<Doc, DocumentPath<Doc>>, number>
    | ExtractPathToWritableArrayIndex<Doc, DocumentPath<Doc> | '', number>
  >
;

/**
 * Valid mutation value for an `increment` or `decrement` operation.
 */
export type MutateInCounterValue<Doc extends object> =
  OperationValue<Doc, false, number>
;

/**
 * Mutation options for an `increment` operation.
 */
export type MutateInCounterOptions = { createPath?: boolean; xattr?: boolean };

/**
 * Function that returns a {@link MutateInSpec} instance for an `increment` operation.
 */
export type MutateInIncrementFunction<in Doc extends object> =
  <
    Path extends AnyMutateInPath<Doc, CppProtocolSubdocOpcode.counter>,
    Value extends AnyMutateInValue<Doc, CppProtocolSubdocOpcode.counter, Path>,
  >(
    path: Path,
    incrementBy: Value,
    options?: MutateInCounterOptions
  ) => MutateInSpec<Doc, CppProtocolSubdocOpcode.counter, Path, false, Value>
;

/**
 * Mutation options for a `decrement` operation.
 */
export type MutateInDecrementOptions = { createPath?: boolean; xattr?: boolean };

/**
 * Function that returns a {@link MutateInSpec} instance for a `decrement` operation.
 */
export type MutateInDecrementFunction<in Doc extends object> =
  <
    Path extends AnyMutateInPath<Doc, CppProtocolSubdocOpcode.counter>,
    Value extends AnyMutateInValue<Doc, CppProtocolSubdocOpcode.counter, Path>,
  >(
    path: Path,
    decrementBy: Value,
    options?: MutateInDecrementOptions
  ) => MutateInSpec<Doc, CppProtocolSubdocOpcode.counter, Path, false, Value>
;
