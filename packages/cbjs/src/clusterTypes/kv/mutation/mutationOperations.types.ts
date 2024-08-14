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
  ArrayPrependElement,
  DocDefBodyPathShape,
  DocDefBodyShape,
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
} from '@cbjsdev/shared';
import { DocDef } from '../../clusterTypes.js';

import type { CompatibleMacro } from './mutateIn.types.js';

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
type OperationPath<Doc extends DocDefBodyShape, Path extends string> =
  If<IsFuzzyDocument<Doc>, string, Path>
;

/**
 * Valid mutation path for an `insert` operation. Non-distributive.
 */
// prettier-ignore
export type MutateInInsertPath<Def extends DocDefBodyPathShape> =
  OperationPath<Def['Body'], ExtractPathToOptionalProperty<Def['Body'], Def['Path']>>
;

/**
 * Acceptable value for an `insert` operation at a specific path.
 */
export type MutateInInsertValue<Def extends DocDefBodyPathShape, Path extends string> =
  OperationValue<Def['Body'], false, SubDocument<Def['Body'], Path>>
;

/**
 * Mutation options for an `insert` operation.
 */
export type MutateInInsertOptions = { createPath?: boolean; xattr?: boolean };

/**
 * Valid mutation path for an `upsert` operation.
 */
export type MutateInUpsertPath<Def extends DocDefBodyPathShape> =
  OperationPath<Def['Body'], ExtractPathToWritableProperty<Def['Body'], Def['Path']> | ''>
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
 * Valid mutation path for a `replace` operation.
 */
export type MutateInReplacePath<Def extends DocDefBodyPathShape> =
  OperationPath<Def['Body'], ExtractPathToWritable<Def['Body'], Def['Path']>>
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
 * Mutation options for a `remove` operation.
 */
export type MutateInRemoveOptions = { xattr?: boolean };

/**
 * Valid mutation path for an `arrayAppend` operation.
 */
export type MutateInArrayAppendPath<Def extends DocDefBodyPathShape> =
  OperationPath<Def['Body'], ExtractPathToAppendableArray<Def['Body'], Def['Path'] | ''>>
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
 * Valid mutation path for an `arrayPrepend` operation.
 */
export type MutateInArrayPrependPath<Def extends DocDefBodyPathShape> =
  OperationPath<Def['Body'], ExtractPathToPrependableArray<Def['Body'], Def['Path'] | ''>>
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
 * Valid mutation path for an `arrayInsert` operation.
 */
export type MutateInArrayInsertPath<Def extends DocDefBodyPathShape> =
  OperationPath<Def['Body'], ExtractPathToInsertableArrayIndex<Def['Body'], Def['Path'] | ''>>
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
 * Valid mutation path for an `arrayAddUnique` operation.
 */
export type MutateInArrayAddUniquePath<Def extends DocDefBodyPathShape> =
  OperationPath<Def['Body'], ExtractPathToAppendableArray<Def['Body'], Def['Path'] | ''>>
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
 * Valid mutation path for an `increment` or `decrement` operation.
 */
export type MutateInCounterPath<Def extends DocDefBodyPathShape> =
  OperationPath<Def['Body'],
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
 * Mutation options for a `decrement` operation.
 */
export type MutateInDecrementOptions = { createPath?: boolean; xattr?: boolean };