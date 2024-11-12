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

import { DocDefKeyBodyShape, IsFuzzyDocument, Try } from '@cbjsdev/shared';
import { MutateInMacroReturnType } from '@cbjsdev/shared/dist/src/couchbase/clusterTypes/mutateInMacro.types.js';
import { CppProtocolSubdocOpcode } from '../../../binding.js';
import { Collection } from '../../../collection.js';
import { MutateInResultEntry } from '../../../crudoptypes.js';
import { MutateInMacro, MutateInSpec } from '../../../sdspecs.js';
import { DocDef } from '../../clusterTypes.js';
import type {
  MutateInArrayAddUniquePath,
  MutateInArrayAddUniqueValue,
  MutateInArrayAppendPath,
  MutateInArrayAppendValue,
  MutateInArrayInsertPath,
  MutateInArrayInsertValue,
  MutateInArrayPrependPath,
  MutateInArrayPrependValue,
  MutateInBinaryPath,
  MutateInBinaryValue,
  MutateInInsertPath,
  MutateInInsertValue,
  MutateInRemovePath,
  MutateInReplacePath,
  MutateInReplaceValue,
  MutateInUpsertPath,
  MutateInUpsertValue,
} from './mutationOperations.types.js';

/**
 * Results of a {@link Collection.mutateIn} operation.
 *
 * @see MutateIn
 * @see makeLookupInSpec
 * @see Specs
 */
export type MutateInSpecResults<Specs> =
  Specs extends readonly [infer Spec, ...infer Rest] ?
    [MutateInSpecResult<Spec>, ...MutateInSpecResults<Rest>] :
  []
;

/**
 * Operation unit result type for a {@link MutateInSpec}.
 */
export type MutateInSpecResult<Spec> =
  Spec extends { _op: infer OpCode } ?
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
export type AnyMutateInPath<Def extends DocDefKeyBodyShape, Opcode extends MutateInSpecOpcode = MutateInSpecOpcode> =
  Def extends unknown ?
    Opcode extends unknown ?
      MutateInPath<Def, Opcode> :
    never :
  never
;

/**
 * Mutation paths - Non-distributive.
 */
export type MutateInPath<Def extends DocDefKeyBodyShape, Opcode extends MutateInSpecOpcode> =
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
  Opcode extends CppProtocolSubdocOpcode.counter ? MutateInBinaryPath<Def> :
  never
;

/**
 * A union of all possible values for a mutation operation on any path of this document.
 * Distributive over `Doc` only.
 */
export type AnyMutateInValue<
  Def extends DocDefKeyBodyShape,
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
  Def extends DocDefKeyBodyShape,
  Opcode extends MutateInSpecOpcode,
  Path extends string,
  Multi extends boolean = boolean,
> =
  IsFuzzyDocument<Def['Body']> extends true ? any :
  Opcode extends CppProtocolSubdocOpcode.dict_add ? MutateInInsertValue<Def, Path> :
  Opcode extends CppProtocolSubdocOpcode.set_doc ? MutateInUpsertValue<Def, ''> :
  Opcode extends CppProtocolSubdocOpcode.dict_upsert ? MutateInUpsertValue<Def, Path> :
  Opcode extends CppProtocolSubdocOpcode.replace ? MutateInReplaceValue<Def, Path> :
  Opcode extends CppProtocolSubdocOpcode.array_push_last ? MutateInArrayAppendValue<Def, Path, Multi> :
  Opcode extends CppProtocolSubdocOpcode.array_push_first ? MutateInArrayPrependValue<Def, Path, Multi> :
  Opcode extends CppProtocolSubdocOpcode.array_insert ? MutateInArrayInsertValue<Def, Path, Multi> :
  Opcode extends CppProtocolSubdocOpcode.array_add_unique ? MutateInArrayAddUniqueValue<Def, Path> :
  Opcode extends CppProtocolSubdocOpcode.counter ? MutateInBinaryValue<Def, Path> :
  never
;

/**
 * Validate the `MutateInSpec` consistency.
 * Returns an error message if the path or the value is inconsistency, `T` if everything looks good.
 */
export type ValidateMutateInSpec<Defs extends DocDefKeyBodyShape, Specs> =
  Defs extends unknown ?
    Specs extends MutateInSpec<any, infer Opcode, infer Path, infer Multi, infer Value> ?
      Path extends AnyMutateInPath<Defs, Opcode> ?
        Opcode extends CppProtocolSubdocOpcode.remove | CppProtocolSubdocOpcode.remove_doc ?
          Specs :
        [Value] extends [AnyMutateInValue<Defs, Opcode, Path, Multi>] ?
          Specs :
        `Invalid value for '${MutateInSpecOperationFriendlyName[Opcode]}' at '${Path}' on any declared document.` :
      `Invalid path: Cannot perform '${MutateInSpecOperationFriendlyName[Opcode]}' at '${Path}' on any declared document.` :
    never :
  never
;

/**
 * Validate an array of `MutateInSpec`.
 *
 * @see ValidateMutateInSpec
 */
export type ValidateMutateInSpecs<Defs extends DocDefKeyBodyShape, Specs> =
  Specs extends readonly [infer Spec, ...infer Rest] ?
    readonly [ValidateMutateInSpec<Defs, Spec>, ...ValidateMutateInSpecs<Defs, Rest>] :
  Specs extends ReadonlyArray<MutateInSpec> ?
    [] :
  readonly []
;

/**
 * Validate and narrow down an array of `MutateInSpec`.
 */
export type NarrowMutationSpecs<Defs extends DocDefKeyBodyShape, Specs> = Try<Specs, [], ValidateMutateInSpecs<Defs, Specs>>;

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