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
export type MutateInInsertPath<Options, Def extends DocDefBodyShape> =
  OperationPath<Def['Body'], OpCodeCompletionPath<'insert', Options, Def['Body']>>
;

/**
 * Acceptable value for an `insert` operation at a specific path.
 */
export type MutateInInsertValue<Options, Def extends DocDefBodyShape, Path extends string> =
  OperationValue<Def['Body'], false, OpCodeCompletionValue<'insert', Options, Def['Body'], Path>>
;

/**
 * Mutation options for an `insert` operation.
 */
export type MutateInInsertOptions = { createPath?: boolean; xattr?: boolean };

/**
 * Valid mutation path for an `upsert` operation.
 */
export type MutateInUpsertPath<Options, Def extends DocDefBodyShape> =
  OperationPath<Def['Body'], OpCodeCompletionPath<'upsert',Options,  Def['Body']>>
;

/**
 * Acceptable value for an `upsert` operation at a specific path.
 */
export type MutateInUpsertValue<Options, Def extends DocDefBodyShape, Path extends string> =
  OperationValue<Def['Body'], false, OpCodeCompletionValue<'upsert', Options, Def['Body'], Path>>
;

/**
 * Mutation options for an `upsert` operation.
 */
export type MutateInUpsertOptions = { createPath?: boolean; xattr?: boolean };


/**
 * Valid mutation path for a `replace` operation.
 */
export type MutateInReplacePath<Options, Def extends DocDefBodyShape> =
  OperationPath<Def['Body'], OpCodeCompletionPath<'replace', Options, Def['Body']>>
;

/**
 * Acceptable value for a `replace` operation at a specific path.
 */
export type MutateInReplaceValue<Options, Def extends DocDefBodyShape, Path extends string> =
  OperationValue<Def['Body'], false, OpCodeCompletionValue<'replace', Options, Def['Body'], Path>>
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
export type MutateInRemovePath<Options, Def extends DocDefBodyShape> =
  OperationPath<Def['Body'], OpCodeCompletionPath<'remove', Options, Def['Body']>>
;

/**
 * Mutation options for a `remove` operation.
 */
export type MutateInRemoveOptions = { xattr?: boolean };

/**
 * Valid mutation path for an `arrayAppend` operation.
 */
export type MutateInArrayAppendPath<Options, Def extends DocDefBodyShape> =
  OperationPath<Def['Body'], OpCodeCompletionPath<'arrayAppend',Options,  Def['Body']>>
;

/**
 * Acceptable value for an `arrayAppend` operation at a specific path.
 */
export type MutateInArrayAppendValue<
  Options,
  Def extends DocDefBodyShape,
  Path extends string,
  Multi extends boolean,
> =
  OperationValue<Def['Body'], Multi, OpCodeCompletionValue<'arrayAppend', Options, Def['Body'], Path>>
;

/**
 * Mutation options for an `arrayAppend` operation.
 */
export type MutateInArrayAppendOptions<Multi extends boolean> = { createPath?: boolean; xattr?: boolean, multi?: Multi };

/**
 * Valid mutation path for an `arrayPrepend` operation.
 */
export type MutateInArrayPrependPath<Options, Def extends DocDefBodyShape> =
  OperationPath<Def['Body'], OpCodeCompletionPath<'arrayPrepend', Options, Def['Body']>>
;

/**
 * Acceptable value for an `arrayPrepend` operation at a specific path.
 */
export type MutateInArrayPrependValue<
  Options,
  Def extends DocDefBodyShape,
  Path extends string,
  Multi extends boolean,
> =
  OperationValue<Def['Body'], Multi, OpCodeCompletionValue<'arrayPrepend', Options, Def['Body'], Path>>
;

/**
 * Mutation options for an `arrayPrepend` operation.
 */
export type MutateInArrayPrependOptions<Multi extends boolean> = { createPath?: boolean; xattr?: boolean, multi?: Multi };
/**
 * Valid mutation path for an `arrayInsert` operation.
 */
export type MutateInArrayInsertPath<Options, Def extends DocDefBodyShape> =
  OperationPath<Def['Body'], OpCodeCompletionPath<'arrayInsert', Options, Def['Body']>>
;

/**
 * Acceptable value for an `arrayInsert` operation at a specific path.
 */
export type MutateInArrayInsertValue<
  Options,
  Def extends DocDefBodyShape,
  Path extends string,
  Multi extends boolean,
> =
  IsLegalPath<'arrayInsert', Options, Def['Body'], Path> extends true ?
    OperationValue<Def['Body'], Multi, OpCodeCompletionValue<'arrayInsert', Options, Def['Body'], Path>> :
  never
;

/**
 * Mutation options for an `arrayInsert` operation.
 */
export type MutateInArrayInsertOptions<Multi extends boolean> = { xattr?: boolean, multi?: Multi };


/**
 * Valid mutation path for an `arrayAddUnique` operation.
 */
export type MutateInArrayAddUniquePath<Options, Def extends DocDefBodyShape> =
  OperationPath<Def['Body'],  OpCodeCompletionPath<'arrayAppend', Options, Def['Body']>>
;

/**
 * Acceptable value for an `arrayAddUnique` operation at a specific path.
 */
export type MutateInArrayAddUniqueValue<
  Options,
  Def extends DocDefBodyShape,
  Path extends string,
> =
  OperationValue<Def['Body'], false, OpCodeCompletionValue<'arrayAppend', Options, Def['Body'], Path>>
;

/**
 * Mutation options for an `arrayAddUnique` operation.
 */
export type MutateInArrayAddUniqueOptions = { createPath?: boolean; xattr?: boolean };

/**
 * Valid mutation path for an `increment` or `decrement` operation.
 */
export type MutateInBinaryPath<Options, Def extends DocDefBodyShape> =
  OperationPath<Def['Body'], OpCodeCompletionPath<'binary', Options, Def['Body']>>;

/**
 * Valid mutation value for an `increment` or `decrement` operation.
 */
export type MutateInBinaryValue<Options, Def extends DocDefBodyShape, Path extends string> =
  IsLegalPath<'binary', Options, Def['Body'], Path> extends true ?
    OperationValue<Def['Body'], false, OpCodeCompletionValue<'binary', Options, Def['Body'], Path>> :
  IllegalPathErrorMessage<'binary', Path>
;

/**
 * Mutation options for an `increment` operation.
 */
export type MutateInBinaryOptions = { createPath?: boolean; xattr?: boolean };
