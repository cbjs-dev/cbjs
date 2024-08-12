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

import {
  ArrayAppendElement,
  ArrayPrependElement, DocDefBodyPathShape, DocDefBodyShape,
  ExtractPathToAppendableArray,
  ExtractPathToInsertableArrayIndex,
  ExtractPathToOptionalProperty,
  ExtractPathToPrependableArray,
  ExtractPathToRemovableArrayIndex,
  ExtractPathToType,
  ExtractPathToWritable,
  ExtractPathToWritableArrayIndex,
  ExtractPathToWritableProperty,
  If,
  IsFuzzyDocument,
  SubDocument,
  ValidatePathToOptionalProperty,
  ValidatePathToProperty,
} from '@cbjsdev/shared';
import { CppProtocolSubdocOpcode } from '../../../binding.js';
import { MutateInSpec } from '../../../sdspecs.js';
import { DocDef } from '../../clusterTypes.js';

import type { AnyMutateInPath, AnyMutateInValue, CompatibleMacro, MutateInValue } from './mutateIn.types.js';

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
type OperationPath<Def extends DocDefBodyShape, Path extends string> =
  If<IsFuzzyDocument<Def['Body']>, string, Path>
;

/**
 * Valid mutation path for an `insert` operation. Non-distributive.
 */
// prettier-ignore
export type MutateInInsertPath<Def extends DocDefBodyPathShape> =
  OperationPath<Def, ExtractPathToOptionalProperty<Def['Body'], Def['Path']>>
;

/**
 * Refine the path validity.
 *
 * @see ValidatePathToOptionalProperty
 */
// prettier-ignore
export type ValidateMutateInInsertPath<
  Def extends DocDef,
  UserPath extends string,
> =
  IsFuzzyDocument<Def['Body']> extends true ?
    UserPath :
  UserPath extends MutateInInsertPath<Def> ?
    Extract<SubDocument<Def['Body'], UserPath>, Record<PropertyKey, unknown>> extends object ?
      ValidatePathToOptionalProperty<Def['Body'], UserPath> :
    UserPath :
  never
;

/**
 * Acceptable value for an `insert` operation at a specific path.
 */
export type MutateInInsertValue<Def extends DocDefBodyPathShape, Path extends string> =
  OperationValue<Def, false, SubDocument<Def['Body'], Path>>
;

/**
 * Mutation options for an `insert` operation.
 */
export type MutateInInsertOptions = { createPath?: boolean; xattr?: boolean };

/**
 * Function that returns a {@link MutateInSpec} instance for an `insert` operation.
 */
export type MutateInInsertFunction<Def extends DocDef> =
  <
    Path extends AnyMutateInPath<Def, CppProtocolSubdocOpcode.dict_add>,
    Value extends AnyMutateInValue<Def, CppProtocolSubdocOpcode.dict_add, Path>,
  >(
    path: ValidateMutateInInsertPath<Def, Path>,
    value: Value,
    options?: MutateInInsertOptions
  ) => MutateInSpec<Def, CppProtocolSubdocOpcode.dict_add, Path, false, Value>
;

/**
 * Valid mutation path for an `upsert` operation.
 */
export type MutateInUpsertPath<Def extends DocDefBodyPathShape> =
  OperationPath<Def, ExtractPathToWritableProperty<Def['Body'], Def['Path']> | ''>
;

/**
 * Refine the path validity.
 *
 * @see ValidatePathToOptionalProperty
 */
// prettier-ignore
export type ValidateMutateInUpsertPath<
  Def extends DocDefBodyPathShape,
  UserPath extends string,
> =
  IsFuzzyDocument<Def['Body']> extends true ?
    UserPath :
  UserPath extends MutateInUpsertPath<Def> ?
    Extract<SubDocument<Def['Body'], UserPath>, Record<PropertyKey, unknown>> extends object ?
      ValidatePathToProperty<Def['Body'], UserPath> :
    UserPath :
  never
;

/**
 * Acceptable value for an `upsert` operation at a specific path.
 */
export type MutateInUpsertValue<Def extends DocDefBodyShape, Path extends string> =
  OperationValue<Def['Body'], false, SubDocument<Def['Body'], Path>>
;

/**
 * Mutation options for an `upsert` operation.
 */
export type MutateInUpsertOptions = { createPath?: boolean; xattr?: boolean };

/**
 * Function that returns a {@link MutateInSpec} instance for an `upsert` operation.
 */
export type MutateInUpsertFunction<in Def extends DocDef> = {
  <
    Value extends MutateInValue<Def, CppProtocolSubdocOpcode.set_doc, ''>,
  >(
    path: '',
    value: Value,
    options?: MutateInUpsertOptions
  ): MutateInSpec<Def, CppProtocolSubdocOpcode.set_doc, '', false, Value>;

  <
    Path extends AnyMutateInPath<Def, CppProtocolSubdocOpcode.dict_upsert>,
    Value extends AnyMutateInValue<Def, CppProtocolSubdocOpcode.dict_upsert, Path>,
  >(
    path: ValidateMutateInUpsertPath<Def, Path>,
    value: Value,
    options?: MutateInUpsertOptions
  ): MutateInSpec<Def, CppProtocolSubdocOpcode.dict_upsert, Path, false, Value>;
};

/**
 * Valid mutation path for a `replace` operation.
 */
export type MutateInReplacePath<Def extends DocDefBodyPathShape> =
  OperationPath<Def, ExtractPathToWritable<Def['Body'], Def['Path']>>
;

/**
 * Refine the path validity.
 *
 * @see ValidatePathToOptionalProperty
 */
// prettier-ignore
export type ValidateMutateInReplacePath<
  Def extends DocDefBodyPathShape,
  UserPath extends string,
> =
  IsFuzzyDocument<Def['Body']> extends true ?
    UserPath :
  UserPath extends MutateInReplacePath<Def> ?
    Extract<SubDocument<Def['Body'], UserPath>, Record<PropertyKey, unknown>> extends object ?
      ValidatePathToProperty<Def['Body'], UserPath> :
    UserPath :
  never
;

/**
 * Acceptable value for a `replace` operation at a specific path.
 */
export type MutateInReplaceValue<Def extends DocDefBodyShape, Path extends string> =
  OperationValue<Def['Body'], false, SubDocument<Def['Body'], Path>>
;

/**
 * Mutation options for a `replace` operation.
 */
export type MutateInReplaceOptions = { createPath?: boolean; xattr?: boolean };

/**
 * Function that returns a {@link MutateInSpec} instance for a `replace` operation.
 */
export type MutateInReplaceFunction<in Def extends DocDef> =
  <
    Path extends AnyMutateInPath<Def, CppProtocolSubdocOpcode.replace>,
    Value extends AnyMutateInValue<Def, CppProtocolSubdocOpcode.replace, Path>,
  >(
    path: ValidateMutateInReplacePath<Def, Path>,
    value: Value,
    options?: MutateInReplaceOptions
  ) => MutateInSpec<Def, CppProtocolSubdocOpcode.replace, Path, false, Value>
;

/**
 * Valid mutation path for an `remove` operation. Non-distributive.
 */
// It is quite similar to the insert path, except that some array indexes are removable,
// while insert cannot target array indexes at all.
// prettier-ignore
export type MutateInRemovePath<Def extends DocDefBodyPathShape> =
  IsFuzzyDocument<Def['Body']> extends true ?
    string :
  (
    | ''
    | ExtractPathToRemovableArrayIndex<Def['Body'], Def['Path']>
    | ExtractPathToOptionalProperty<Def['Body'], Def['Path']>
  )
;

/**
 * Refine the path validity.
 *
 * @see ValidatePathToOptionalProperty
 */
// prettier-ignore
export type ValidateMutateInRemovePath<
  Def extends DocDefBodyPathShape,
  UserPath extends string,
> =
  IsFuzzyDocument<Def['Body']> extends true ?
    UserPath :
  UserPath extends MutateInRemovePath<Def> ?
    Extract<SubDocument<Def['Body'], UserPath>, Record<PropertyKey, unknown>> extends object ?
      ValidatePathToOptionalProperty<Def['Body'], UserPath> :
    UserPath :
  never
;

/**
 * Mutation options for a `remove` operation.
 */
export type MutateInRemoveOptions = { xattr?: boolean };

/**
 * Function that returns a {@link MutateInSpec} instance for a `remove` operation.
 */
export type MutateInRemoveFunction<Def extends DocDef> = {
  (
    path: '',
    options?: MutateInRemoveOptions
  ): MutateInSpec<Def, CppProtocolSubdocOpcode.remove_doc, '', false, never>;

  <
    Path extends AnyMutateInPath<Def, CppProtocolSubdocOpcode.remove>
  >(
    path: ValidateMutateInRemovePath<Def, Path>,
    options?: MutateInRemoveOptions
  ): MutateInSpec<Def, CppProtocolSubdocOpcode.remove, Path, false, never>
};

/**
 * Valid mutation path for an `arrayAppend` operation.
 */
export type MutateInArrayAppendPath<Def extends DocDefBodyPathShape> =
  OperationPath<Def, ExtractPathToAppendableArray<Def['Body'], Def['Path'] | ''>>
;

/**
 * Acceptable value for an `arrayAppend` operation at a specific path.
 */
export type MutateInArrayAppendValue<
  Def extends DocDefBodyShape,
  Path extends string,
  Multi extends boolean,
> =
  OperationValue<Def['Body'], Multi, ArrayAppendElement<Extract<SubDocument<Def['Body'], Path>, ReadonlyArray<unknown>>>>
;

/**
 * Mutation options for an `arrayAppend` operation.
 */
export type MutateInArrayAppendOptions<Multi extends boolean> = { createPath?: boolean; xattr?: boolean, multi?: Multi };

/**
 * Function that returns a {@link MutateInSpec} instance for a `arrayAppend` operation.
 */
export type MutateInArrayAppendFunction<in Def extends DocDef> =
  <
    Path extends AnyMutateInPath<Def, CppProtocolSubdocOpcode.array_push_last>,
    Value extends AnyMutateInValue<Def, CppProtocolSubdocOpcode.array_push_last, Path, Multi>,
    Multi extends boolean,
  >(
    path: Path,
    value: Value,
    options?: MutateInArrayAppendOptions<Multi>
  ) => MutateInSpec<Def, CppProtocolSubdocOpcode.array_push_last, Path, Multi, Value>
;

/**
 * Valid mutation path for an `arrayPrepend` operation.
 */
export type MutateInArrayPrependPath<Def extends DocDefBodyPathShape> =
  OperationPath<Def, ExtractPathToPrependableArray<Def['Body'], Def['Path'] | ''>>
;

/**
 * Acceptable value for an `arrayPrepend` operation at a specific path.
 */
export type MutateInArrayPrependValue<
  Def extends DocDefBodyShape,
  Path extends string,
  Multi extends boolean,
> =
  OperationValue<Def['Body'], Multi, ArrayPrependElement<Extract<SubDocument<Def['Body'], Path>, ReadonlyArray<unknown>>>>
;

/**
 * Mutation options for an `arrayPrepend` operation.
 */
export type MutateInArrayPrependOptions<Multi extends boolean> = { createPath?: boolean; xattr?: boolean, multi?: Multi };

/**
 * Function that returns a {@link MutateInSpec} instance for an `arrayPrepend` operation.
 */
export type MutateInArrayPrependFunction<in Def extends DocDef> =
  <
    Path extends AnyMutateInPath<Def, CppProtocolSubdocOpcode.array_push_first>,
    Value extends AnyMutateInValue<Def, CppProtocolSubdocOpcode.array_push_first, Path>,
    Multi extends boolean,
  >(
    path: Path,
    value: Value,
    options?: MutateInArrayPrependOptions<Multi>
  ) => MutateInSpec<Def, CppProtocolSubdocOpcode.array_push_first, Path, Multi, Value>
;

/**
 * Valid mutation path for an `arrayInsert` operation.
 */
export type MutateInArrayInsertPath<Def extends DocDefBodyPathShape> =
  OperationPath<Def, ExtractPathToInsertableArrayIndex<Def['Body'], Def['Path'] | ''>>
;

/**
 * Acceptable value for an `arrayInsert` operation at a specific path.
 */
export type MutateInArrayInsertValue<
  Def extends DocDefBodyShape,
  Path extends string,
  Multi extends boolean,
> =
  OperationValue<Def['Body'], Multi, SubDocument<Def['Body'], Path>>

/**
 * Mutation options for an `arrayInsert` operation.
 */
export type MutateInArrayInsertOptions<Multi extends boolean> = { createPath?: boolean; xattr?: boolean, multi?: Multi };

/**
 * Function that returns a {@link MutateInSpec} instance for an `arrayInsert` operation.
 */
export type MutateInArrayInsertFunction<in Def extends DocDef> =
  <
    Path extends AnyMutateInPath<Def, CppProtocolSubdocOpcode.array_insert>,
    Value extends AnyMutateInValue<Def, CppProtocolSubdocOpcode.array_insert, Path>,
    Multi extends boolean,
  >(
    path: Path,
    value: Value,
    options?: MutateInArrayInsertOptions<Multi>
  ) => MutateInSpec<Def, CppProtocolSubdocOpcode.array_insert, Path, Multi, Value>
;

/**
 * Valid mutation path for an `arrayAddUnique` operation.
 */
export type MutateInArrayAddUniquePath<Def extends DocDefBodyPathShape> =
  OperationPath<Def, ExtractPathToAppendableArray<Def['Body'], Def['Path'] | ''>>
;

/**
 * Acceptable value for an `arrayAddUnique` operation at a specific path.
 */
export type MutateInArrayAddUniqueValue<
  Def extends DocDef,
  Path extends string,
> =
  OperationValue<Def['Body'], false, ArrayAppendElement<Extract<SubDocument<Def['Body'], Path>, ReadonlyArray<unknown>>>>
;

/**
 * Mutation options for an `arrayAddUnique` operation.
 */
export type MutateInArrayAddUniqueOptions = { createPath?: boolean; xattr?: boolean };

/**
 * Function that returns a {@link MutateInSpec} instance for an `arrayAddUnique` operation.
 */
export type MutateInArrayAddUniqueFunction<in Def extends DocDef> =
  <
    Path extends AnyMutateInPath<Def, CppProtocolSubdocOpcode.array_add_unique>,
    Value extends AnyMutateInValue<Def, CppProtocolSubdocOpcode.array_add_unique, Path>,
    Multi extends boolean = false,
  >(
    path: Path,
    value: Value,
    options?: MutateInArrayAddUniqueOptions
  ) => MutateInSpec<Def, CppProtocolSubdocOpcode.array_add_unique, Path, Multi, Value>
;

/**
 * Valid mutation path for an `increment` or `decrement` operation.
 */
export type MutateInCounterPath<Def extends DocDefBodyPathShape> =
  OperationPath<Def,
    | ExtractPathToType<Def['Body'], ExtractPathToWritableProperty<Def['Body'], Def['Path']>, number>
    | ExtractPathToWritableArrayIndex<Def['Body'], Def['Path'] | '', number>
  >
;

/**
 * Valid mutation value for an `increment` or `decrement` operation.
 */
export type MutateInCounterValue = number;

/**
 * Mutation options for an `increment` operation.
 */
export type MutateInCounterOptions = { createPath?: boolean; xattr?: boolean };

/**
 * Function that returns a {@link MutateInSpec} instance for an `increment` operation.
 */
export type MutateInIncrementFunction<in Def extends DocDef> =
  <
    Path extends AnyMutateInPath<Def, CppProtocolSubdocOpcode.counter>,
    Value extends AnyMutateInValue<Def, CppProtocolSubdocOpcode.counter, Path>,
  >(
    path: Path,
    incrementBy: Value,
    options?: MutateInCounterOptions
  ) => MutateInSpec<Def, CppProtocolSubdocOpcode.counter, Path, false, Value>
;

/**
 * Mutation options for a `decrement` operation.
 */
export type MutateInDecrementOptions = { createPath?: boolean; xattr?: boolean };

/**
 * Function that returns a {@link MutateInSpec} instance for a `decrement` operation.
 */
export type MutateInDecrementFunction<in Def extends DocDef> =
  <
    Path extends AnyMutateInPath<Def, CppProtocolSubdocOpcode.counter>,
    Value extends AnyMutateInValue<Def, CppProtocolSubdocOpcode.counter, Path>,
  >(
    path: Path,
    decrementBy: Value,
    options?: MutateInDecrementOptions
  ) => MutateInSpec<Def, CppProtocolSubdocOpcode.counter, Path, false, Value>
;
