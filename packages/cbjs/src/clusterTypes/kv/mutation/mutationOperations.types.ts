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
  DocDefBodyShape,
  If,
  IsFuzzyDocument,
  IsLegalPath, KvOperation,
  OpCodeCompletionPath,
  OpCodeCompletionValue,
} from '@cbjsdev/shared';

import type { CompatibleMacro } from './mutateIn.types.js';

export type IllegalPathErrorMessage<Op extends KvOperation, Path extends string> = `Cannot \`${Op}\` at this path. Illegal path or value.`;

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
// prettier-ignore
export type MutateInInsertPath<Def extends DocDefBodyShape> =
  OperationPath<Def['Body'], OpCodeCompletionPath<'insert', Def['Body']>>
;

/**
 * Acceptable value for an `insert` operation at a specific path.
 */
export type MutateInInsertValue<Def extends DocDefBodyShape, Path extends string> =
  OperationValue<Def['Body'], false, OpCodeCompletionValue<'insert', Def['Body'], Path>>
;

/**
 * Mutation options for an `insert` operation.
 */
export type MutateInInsertOptions = { createPath?: boolean; xattr?: boolean };

/**
 * Valid mutation path for an `upsert` operation.
 */
export type MutateInUpsertPath<Def extends DocDefBodyShape> =
  OperationPath<Def['Body'], OpCodeCompletionPath<'upsert', Def['Body']>>
;

/**
 * Acceptable value for an `upsert` operation at a specific path.
 */
export type MutateInUpsertValue<Def extends DocDefBodyShape, Path extends string> =
  OperationValue<Def['Body'], false, OpCodeCompletionValue<'upsert', Def['Body'], Path>>
;

/**
 * Mutation options for an `upsert` operation.
 */
export type MutateInUpsertOptions = { createPath?: boolean; xattr?: boolean };


/**
 * Valid mutation path for a `replace` operation.
 */
export type MutateInReplacePath<Def extends DocDefBodyShape> =
  OperationPath<Def['Body'], OpCodeCompletionPath<'replace', Def['Body']>>
;

/**
 * Acceptable value for a `replace` operation at a specific path.
 */
export type MutateInReplaceValue<Def extends DocDefBodyShape, Path extends string> =
  OperationValue<Def['Body'], false, OpCodeCompletionValue<'replace', Def['Body'], Path>>
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
export type MutateInRemovePath<Def extends DocDefBodyShape> =
  OperationPath<Def['Body'], OpCodeCompletionPath<'remove', Def['Body']>>
;

/**
 * Mutation options for a `remove` operation.
 */
export type MutateInRemoveOptions = { xattr?: boolean };

/**
 * Valid mutation path for an `arrayAppend` operation.
 */
export type MutateInArrayAppendPath<Def extends DocDefBodyShape> =
  OperationPath<Def['Body'], OpCodeCompletionPath<'arrayAppend', Def['Body']>>
;

/**
 * Acceptable value for an `arrayAppend` operation at a specific path.
 */
export type MutateInArrayAppendValue<
  Def extends DocDefBodyShape,
  Path extends string,
  Multi extends boolean,
> =
  OperationValue<Def['Body'], Multi, OpCodeCompletionValue<'arrayAppend', Def['Body'], Path>>
;

/**
 * Mutation options for an `arrayAppend` operation.
 */
export type MutateInArrayAppendOptions<Multi extends boolean> = { createPath?: boolean; xattr?: boolean, multi?: Multi };

/**
 * Valid mutation path for an `arrayPrepend` operation.
 */
export type MutateInArrayPrependPath<Def extends DocDefBodyShape> =
  OperationPath<Def['Body'], OpCodeCompletionPath<'arrayPrepend', Def['Body']>>
;

/**
 * Acceptable value for an `arrayPrepend` operation at a specific path.
 */
export type MutateInArrayPrependValue<
  Def extends DocDefBodyShape,
  Path extends string,
  Multi extends boolean,
> =
  OperationValue<Def['Body'], Multi, OpCodeCompletionValue<'arrayPrepend', Def['Body'], Path>>
;

/**
 * Mutation options for an `arrayPrepend` operation.
 */
export type MutateInArrayPrependOptions<Multi extends boolean> = { createPath?: boolean; xattr?: boolean, multi?: Multi };
/**
 * Valid mutation path for an `arrayInsert` operation.
 */
export type MutateInArrayInsertPath<Def extends DocDefBodyShape> =
  OperationPath<Def['Body'], OpCodeCompletionPath<'arrayInsert', Def['Body']>>
;

/**
 * Acceptable value for an `arrayInsert` operation at a specific path.
 */
export type MutateInArrayInsertValue<
  Def extends DocDefBodyShape,
  Path extends string,
  Multi extends boolean,
> =
  IsLegalPath<'arrayInsert', Def['Body'], Path> extends true ?
    OperationValue<Def['Body'], Multi, OpCodeCompletionValue<'arrayInsert', Def['Body'], Path>> :
  never
;

/**
 * Mutation options for an `arrayInsert` operation.
 */
export type MutateInArrayInsertOptions<Multi extends boolean> = { xattr?: boolean, multi?: Multi };


/**
 * Valid mutation path for an `arrayAddUnique` operation.
 */
export type MutateInArrayAddUniquePath<Def extends DocDefBodyShape> =
  OperationPath<Def['Body'],  OpCodeCompletionPath<'arrayAppend', Def['Body']>>
;

/**
 * Acceptable value for an `arrayAddUnique` operation at a specific path.
 */
export type MutateInArrayAddUniqueValue<
  Def extends DocDefBodyShape,
  Path extends string,
> =
  OperationValue<Def['Body'], false, OpCodeCompletionValue<'arrayAppend', Def['Body'], Path>>
;

/**
 * Mutation options for an `arrayAddUnique` operation.
 */
export type MutateInArrayAddUniqueOptions = { createPath?: boolean; xattr?: boolean };

/**
 * Valid mutation path for an `increment` or `decrement` operation.
 */
export type MutateInBinaryPath<Def extends DocDefBodyShape> =
  OperationPath<Def['Body'], OpCodeCompletionPath<'binary', Def['Body']>>;

/**
 * Valid mutation value for an `increment` or `decrement` operation.
 */
export type MutateInBinaryValue<Def extends DocDefBodyShape, Path extends string> =
  IsLegalPath<'binary', Def['Body'], Path> extends true ?
    OperationValue<Def['Body'], false, OpCodeCompletionValue<'binary', Def['Body'], Path>> :
  IllegalPathErrorMessage<'binary', Path>
;

/**
 * Mutation options for an `increment` operation.
 */
export type MutateInBinaryOptions = { createPath?: boolean; xattr?: boolean };
