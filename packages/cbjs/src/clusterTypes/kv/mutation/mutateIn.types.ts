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

import type { DocDef, IsFuzzyDocument, Try } from '@cbjsdev/shared';
import { CppProtocolSubdocOpcode } from '../../../binding.js';
import { MutateInResultEntry } from '../../../crudoptypes.js';
import { MutateInMacro, MutateInSpec } from '../../../sdspecs.js';
import type { MutateInMacroReturnType } from './mutateInMacro.types.js';
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
} from './mutationOperations.types.js';
import { Collection } from '../../../collection.js';

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
export type MutateInSpecResult<Spec> =
  Spec extends MutateInSpec<any, infer OpCode, any, boolean, any> ?
    OpCode extends CppProtocolSubdocOpcode.counter ? number : undefined :
  never
;

/**
 * Infer an array of MutateInResultEntry from an array of mutation results.
 */
export type MutateInResultEntries<Results> =
  Results extends readonly [infer Head, ...infer Rest] ?
    [MutateInResultEntry<Head>, ...MutateInResultEntries<Rest>] :
  []
;

/**
 * All possible mutation paths. Distributive.
 */
export type AnyMutateInPath<Def extends DocDef, Opcode extends MutateInSpecOpcode = MutateInSpecOpcode> =
  Def extends unknown ?
    Opcode extends unknown ?
      MutateInPath<Def, Opcode> :
    never :
  never
;

/**
 * Mutation paths - Non-distributive.
 */
export type MutateInPath<Def extends DocDef, Opcode extends MutateInSpecOpcode> =
  Opcode extends CppProtocolSubdocOpcode.set_doc ? '' :
  Opcode extends CppProtocolSubdocOpcode.remove_doc ? '' :
  IsFuzzyDocument<Def['Body']> extends true ? string :
  Opcode extends CppProtocolSubdocOpcode.dict_add ? MutateInInsertPath<Def> :
  Opcode extends CppProtocolSubdocOpcode.dict_upsert ? Exclude<MutateInUpsertPath<Def>, ''> :
  Opcode extends CppProtocolSubdocOpcode.replace ? MutateInReplacePath<Def> :
  Opcode extends CppProtocolSubdocOpcode.remove ? Exclude<MutateInRemovePath<Def>, ''> :
  Opcode extends CppProtocolSubdocOpcode.array_push_last ? MutateInArrayAppendPath<Def> :
  Opcode extends CppProtocolSubdocOpcode.array_push_first ? MutateInArrayPrependPath<Def> :
  Opcode extends CppProtocolSubdocOpcode.array_insert ? MutateInArrayInsertPath<Def> :
  Opcode extends CppProtocolSubdocOpcode.array_add_unique ? MutateInArrayAddUniquePath<Def> :
  Opcode extends CppProtocolSubdocOpcode.counter ? MutateInCounterPath<Def> :
  never
;

/**
 * A union of all possible values for a mutation operation on any path of this document.
 * Distributive over `Doc` only.
 */
export type AnyMutateInValue<
  Def extends DocDef,
  Opcode extends MutateInSpecOpcode,
  Path extends AnyMutateInPath<Def, Opcode>,
  Multi extends boolean = boolean,
> =
  Def extends unknown ?
    MutateInValue<Def, Opcode, Path, Multi> :
  never
;

/**
 * Mutation values - Non-distributive.
 */
export type MutateInValue<
  Def extends DocDef,
  Opcode extends MutateInSpecOpcode,
  Path extends MutateInPath<Def, Opcode>,
  Multi extends boolean = boolean,
> =
  IsFuzzyDocument<Def['Body']> extends true ? any :
  Opcode extends CppProtocolSubdocOpcode.dict_add ? MutateInInsertValue<Def, Path & MutateInInsertPath<Def>> :
  Opcode extends CppProtocolSubdocOpcode.set_doc ? MutateInUpsertValue<Def, ''> :
  Opcode extends CppProtocolSubdocOpcode.dict_upsert ? MutateInUpsertValue<Def, Path & MutateInUpsertPath<Def>> :
  Opcode extends CppProtocolSubdocOpcode.replace ? MutateInReplaceValue<Def, Path & MutateInReplacePath<Def>> :
  Opcode extends CppProtocolSubdocOpcode.array_push_last ? MutateInArrayAppendValue<Def, Path & MutateInArrayAppendPath<Def>, Multi> :
  Opcode extends CppProtocolSubdocOpcode.array_push_first ? MutateInArrayPrependValue<Def, Path & MutateInArrayPrependPath<Def>, Multi> :
  Opcode extends CppProtocolSubdocOpcode.array_insert ? MutateInArrayInsertValue<Def, Path & MutateInArrayInsertPath<Def>, Multi> :
  Opcode extends CppProtocolSubdocOpcode.array_add_unique ? MutateInArrayAddUniqueValue<Def, Path & MutateInArrayAddUniquePath<Def>> :
  Opcode extends CppProtocolSubdocOpcode.counter ? MutateInCounterValue :
  never
;

/**
 * Validate the `MutateInSpec` consistency.
 * Returns an error message if the path or the value is inconsistency, `T` if everything looks good.
 */
export type ValidateMutateInSpec<Defs extends DocDef, Specs extends MutateInSpec> =
  Specs extends MutateInSpec<infer Doc, infer Opcode, infer Path, infer Multi, infer Value> ?
    Path extends AnyMutateInPath<Defs, Opcode> ?
      Opcode extends CppProtocolSubdocOpcode.remove | CppProtocolSubdocOpcode.remove_doc ?
        MutateInSpec<Doc, Opcode, Path, false, never> :
      [Value] extends [AnyMutateInValue<Defs, Opcode, Path, Multi>] ?
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
export type ValidateMutateInSpecs<Defs extends DocDef, Specs> =
  Specs extends readonly [infer Spec extends MutateInSpec, ...infer Rest extends ReadonlyArray<MutateInSpec>] ?
    readonly [ValidateMutateInSpec<Defs, Spec>, ...ValidateMutateInSpecs<Defs, Rest>] :
  Specs extends ReadonlyArray<MutateInSpec<Defs>> ?
    [] :
  readonly []
;

/**
 * Validate and narrow down an array of `MutateInSpec`.
 */
export type NarrowMutationSpecs<Defs extends DocDef, Specs> = Try<Specs, [], ValidateMutateInSpecs<Defs, Specs>>;

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