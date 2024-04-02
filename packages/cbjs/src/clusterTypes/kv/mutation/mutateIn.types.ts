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

import type { IsFuzzyDocument, Try } from '@cbjsdev/shared';
import { CppProtocolSubdocOpcode } from '../../../binding';
import { MutateInResultEntry } from '../../../crudoptypes';
import { MutateInMacro, MutateInSpec } from '../../../sdspecs';
import type { MutateInMacroReturnType } from './mutateInMacro.types';
import type {
  MutateInArrayAddUniquePath,
  MutateInArrayAddUniqueValue,
  MutateInArrayAppendPath,
  MutateInArrayAppendValue,
  MutateInArrayInsertPath,
  MutateInArrayInsertValue,
  MutateInArrayPrependPath,
  MutateInArrayPrependValue,
  MutateInCounterPath,
  MutateInCounterValue,
  MutateInInsertPath,
  MutateInInsertValue,
  MutateInRemovePath,
  MutateInReplacePath,
  MutateInReplaceValue,
  MutateInUpsertPath,
  MutateInUpsertValue,
} from './mutationOperations.types';

/**
 * Results of a {@link Collection.mutateIn} operation.
 *
 * @see MutateIn
 * @see makeLookupInSpec
 * @see Specs
 */
export type MutateInSpecResults<Specs> =
  Specs extends readonly [infer Spec extends MutateInSpec, ...infer Rest extends ReadonlyArray<MutateInSpec>] ?
    [MutateInSpecResult<Spec>, ...MutateInSpecResults<Rest>] :
  []
;

/**
 * Operation unit result type for a {@link MutateInSpec}.
 */
export type MutateInSpecResult<Spec extends MutateInSpec> =
  Spec extends MutateInSpec<object, infer OpCode extends MutateInSpecOpcode> ?
    OpCode extends CppProtocolSubdocOpcode.counter ? number : undefined :
  never
;

/**
 * Infer an array of MutateInResultEntry from an array of mutation results.
 */
export type MutateInResultEntries<Results extends ReadonlyArray<number | undefined>> =
  Results extends readonly [infer Head extends (number | undefined), ...infer Rest extends ReadonlyArray<number | undefined>] ?
    [MutateInResultEntry<Head>, ...MutateInResultEntries<Rest>] :
  []
;

/**
 * All possible mutation paths. Distributive.
 */
export type AnyMutateInPath<Doc extends object, Opcode extends MutateInSpecOpcode = MutateInSpecOpcode> =
  Doc extends unknown ?
    Opcode extends unknown ?
      MutateInPath<Doc, Opcode> :
    never :
  never
;

/**
 * Mutation paths - Non-distributive.
 */
export type MutateInPath<Doc extends object, Opcode extends MutateInSpecOpcode> =
  Opcode extends CppProtocolSubdocOpcode.set_doc ? '' :
  Opcode extends CppProtocolSubdocOpcode.remove_doc ? '' :
  IsFuzzyDocument<Doc> extends true ? string :
  Opcode extends CppProtocolSubdocOpcode.dict_add ? MutateInInsertPath<Doc> :
  Opcode extends CppProtocolSubdocOpcode.dict_upsert ? Exclude<MutateInUpsertPath<Doc>, ''> :
  Opcode extends CppProtocolSubdocOpcode.replace ? MutateInReplacePath<Doc> :
  Opcode extends CppProtocolSubdocOpcode.remove ? Exclude<MutateInRemovePath<Doc>, ''> :
  Opcode extends CppProtocolSubdocOpcode.array_push_last ? MutateInArrayAppendPath<Doc> :
  Opcode extends CppProtocolSubdocOpcode.array_push_first ? MutateInArrayPrependPath<Doc> :
  Opcode extends CppProtocolSubdocOpcode.array_insert ? MutateInArrayInsertPath<Doc> :
  Opcode extends CppProtocolSubdocOpcode.array_add_unique ? MutateInArrayAddUniquePath<Doc> :
  Opcode extends CppProtocolSubdocOpcode.counter ? MutateInCounterPath<Doc> :
  never
;

/**
 * A union of all possible values for a mutation operation on any path of this document.
 * Distributive over `Doc` only.
 */
export type AnyMutateInValue<
  Doc extends object,
  Opcode extends MutateInSpecOpcode,
  Path extends AnyMutateInPath<Doc, Opcode>,
  Multi extends boolean = boolean,
> =
  Doc extends unknown ?
    MutateInValue<Doc, Opcode, Path, Multi> :
  never
;

/**
 * Mutation values - Non-distributive.
 */
export type MutateInValue<
  Doc extends object,
  Opcode extends MutateInSpecOpcode,
  Path extends MutateInPath<Doc, Opcode>,
  Multi extends boolean = boolean,
> =
  IsFuzzyDocument<Doc> extends true ? any :
  Opcode extends CppProtocolSubdocOpcode.dict_add ? MutateInInsertValue<Doc, Path & MutateInInsertPath<Doc>> :
  Opcode extends CppProtocolSubdocOpcode.set_doc ? MutateInUpsertValue<Doc, ''> :
  Opcode extends CppProtocolSubdocOpcode.dict_upsert ? MutateInUpsertValue<Doc, Path & MutateInUpsertPath<Doc>> :
  Opcode extends CppProtocolSubdocOpcode.replace ? MutateInReplaceValue<Doc, Path & MutateInReplacePath<Doc>> :
  Opcode extends CppProtocolSubdocOpcode.array_push_last ? MutateInArrayAppendValue<Doc, Path & MutateInArrayAppendPath<Doc>, Multi> :
  Opcode extends CppProtocolSubdocOpcode.array_push_first ? MutateInArrayPrependValue<Doc, Path & MutateInArrayPrependPath<Doc>, Multi> :
  Opcode extends CppProtocolSubdocOpcode.array_insert ? MutateInArrayInsertValue<Doc, Path & MutateInArrayInsertPath<Doc>, Multi> :
  Opcode extends CppProtocolSubdocOpcode.array_add_unique ? MutateInArrayAddUniqueValue<Doc, Path & MutateInArrayAddUniquePath<Doc>> :
  Opcode extends CppProtocolSubdocOpcode.counter ? MutateInCounterValue<Doc> :
  never
;

/**
 * Validate the `MutateInSpec` consistency.
 * Returns an error message if the path or the value is inconsistency, `T` if everything looks good.
 */
export type ValidateMutateInSpec<Docs extends object, Specs extends MutateInSpec> =
  Specs extends MutateInSpec<infer Doc, infer Opcode, infer Path, infer Multi, infer Value> ?
    Path extends AnyMutateInPath<Docs, Opcode> ?
      Opcode extends CppProtocolSubdocOpcode.remove | CppProtocolSubdocOpcode.remove_doc ?
        MutateInSpec<Doc, Opcode, Path, false, never> :
      [Value] extends [AnyMutateInValue<Docs, Opcode, Path, Multi>] ?
        Specs :
      `Invalid value for '${MutateInSpecOperationFriendlyName[Opcode]}' at '${Path}' on any declared document.` :
    `Invalid path: Cannot perform '${MutateInSpecOperationFriendlyName[Opcode]}' at '${Path}' on any declared document.` :
  never
;

/**
 * Validate an array of `MutateInSpec`.
 *
 * @see ValidateMutateInSpec
 */
export type ValidateMutateInSpecs<Docs extends object, Specs> =
  Specs extends readonly [infer Spec extends MutateInSpec, ...infer Rest extends ReadonlyArray<unknown>] ?
    readonly [ValidateMutateInSpec<Docs, Spec>, ...ValidateMutateInSpecs<Docs, Rest>] :
  Specs extends ReadonlyArray<MutateInSpec<Docs>> ?
    Specs :
  readonly []
;

/**
 * Validate and narrow down an array of `MutateInSpec`.
 */
export type NarrowMutationSpecs<Docs extends object, Specs> = Try<Specs, [], ValidateMutateInSpecs<Docs, Specs>>;

/**
 *  Return the MutateInMacro instance type that are compatible with the given type.
 */
export type CompatibleMacro<Value> =
  Value extends unknown ?
    keyof MutateInMacroReturnType extends infer MacroPath extends unknown ?
      MacroPath extends keyof MutateInMacroReturnType ?
        MutateInMacroReturnType[MacroPath] extends Value ?
          MutateInMacro<MacroPath> :
        never :
      never :
    never :
  never
;

/**
 * OpCode used in sub-document lookup operation.
 */
export type MutateInSpecOpcode =
  | CppProtocolSubdocOpcode.dict_add
  | CppProtocolSubdocOpcode.set_doc
  | CppProtocolSubdocOpcode.dict_upsert
  | CppProtocolSubdocOpcode.replace
  | CppProtocolSubdocOpcode.remove
  | CppProtocolSubdocOpcode.remove_doc
  | CppProtocolSubdocOpcode.array_push_last
  | CppProtocolSubdocOpcode.array_push_first
  | CppProtocolSubdocOpcode.array_insert
  | CppProtocolSubdocOpcode.array_add_unique
  | CppProtocolSubdocOpcode.counter

/**
 * Operation friendly name.
 * Use for type error messages.
 */
export type MutateInSpecOperationFriendlyName = {
  [CppProtocolSubdocOpcode.dict_add]: 'insert';
  [CppProtocolSubdocOpcode.set_doc]: 'insert';
  [CppProtocolSubdocOpcode.dict_upsert]: 'upsert';
  [CppProtocolSubdocOpcode.replace]: 'replace';
  [CppProtocolSubdocOpcode.remove]: 'remove';
  [CppProtocolSubdocOpcode.remove_doc]: 'remove';
  [CppProtocolSubdocOpcode.array_push_last]: 'arrayAppend';
  [CppProtocolSubdocOpcode.array_push_first]: 'arrayPrepend';
  [CppProtocolSubdocOpcode.array_insert]: 'arrayInsert';
  [CppProtocolSubdocOpcode.array_add_unique]: 'arrayAddUnique';
  [CppProtocolSubdocOpcode.counter]: 'increment / decrement';
}