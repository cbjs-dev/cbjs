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
  AnyDocDef,
  ArrayElement,
  DocDefBodyShape,
  DocumentCodeCompletion,
  If,
  IsArrayLengthFixed,
  IsFuzzyDocument,
  LookupInMacroReturnType, OpCodeCompletionValue,
  Try,
} from '@cbjsdev/shared';

import type { CppProtocolSubdocOpcode } from '../../../binding.js';
import { Collection } from '../../../collection.js';
import type { LookupInResultEntry } from '../../../crudoptypes.js';
import type { LookupInMacro, LookupInSpec } from '../../../sdspecs.js';
import type { LookupInCountPath, LookupInExistsPath, LookupInGetPath } from './lookupOperations.types.js';


/**
 * Return a {@link LookupInSpec} type with `Path` converted to an internal path.
 */
export type MakeLookupInSpec<Def extends AnyDocDef, Opcode extends LookupInSpecOpCode, Path> =
  LookupInSpec<Def, Opcode, ToLookupInternalPath<Path>>
;

/**
 * Results of a {@link Collection.lookupIn} operation.
 *
 * @see LookupIn
 * @see Specs
 */
export type LookupInSpecResults<Specs, Defs> =
  Specs extends readonly [infer Spec, ...infer Rest] ?
    [LookupInSpecResult<Spec, Defs>, ...LookupInSpecResults<Rest, Defs>] :
  // An empty tuple will match ReadonlyArray, so we need to check this first
  Specs extends [] ?
    [] :
  Specs extends ReadonlyArray<infer Spec> ?
    LookupInSpecResult<Spec, Defs>[] :
  []
;

/**
 * Spec operation result type for a single {@link LookupInSpec}.
 */
export type LookupInSpecResult<Spec, Def> =
  Def extends DocDefBodyShape ?
    Spec extends LookupInSpec<infer LookupDef, infer Op, infer Path> ?
      Op extends CppProtocolSubdocOpcode.get | CppProtocolSubdocOpcode.get_doc ?
        Path extends keyof LookupInMacroReturnType ?
          LookupInMacroReturnType[Path] :
        IsFuzzyDocument<LookupDef['Body']> extends true ?
          OpCodeCompletionValue<'get', Def['Body'], Path> :
        OpCodeCompletionValue<'get', LookupDef['Body'], Path> :
      Op extends CppProtocolSubdocOpcode.get_count ?
        number :
      Op extends CppProtocolSubdocOpcode.exists ?
        boolean :
      never :
    never :
  never
;

/**
 * Return an array of LookupInResultEntry from an array of mutation results.
 *
 * @internal
 */
export type LookupInResultEntries<Results, ThrowOnSpecError extends boolean> =
  Results extends readonly [infer Head extends unknown, ...infer Rest] ?
    ThrowOnSpecError extends true ?
      [LookupInResultEntry<Exclude<Head, undefined>, null>, ...LookupInResultEntries<Rest, ThrowOnSpecError>] :
    [LookupInResultEntry<Exclude<Head, undefined>, null> | LookupInResultEntry<undefined, Error>, ...LookupInResultEntries<Rest, ThrowOnSpecError>] :
  IsArrayLengthFixed<Results> extends true ?
    [] :
  ThrowOnSpecError extends true ?
    Array<LookupInResultEntry<ArrayElement<Results>, null>> :
  Array<LookupInResultEntry<ArrayElement<Results>, null> | LookupInResultEntry<undefined, Error>>
;

/**
 * Lookup paths - Non-distributive.
 */
export type LookupInPath<Def, Opcode extends LookupInSpecOpCode> =
  Opcode extends CppProtocolSubdocOpcode.get_doc ? '' :
  Opcode extends CppProtocolSubdocOpcode.get ? Exclude<LookupInGetPath<Def>, ''> :
  Opcode extends CppProtocolSubdocOpcode.exists ? LookupInExistsPath<Def> :
  Opcode extends CppProtocolSubdocOpcode.get_count ? LookupInCountPath<Def> :
  never
;

/**
 * All possible internal lookup paths for a document.
 *
 * @internal
 */
export type AnyLookupInInternalPath<Def extends DocDefBodyShape, Opcode extends LookupInSpecOpCode = LookupInSpecOpCode> =
  If<
    IsFuzzyDocument<Def['Body']>,
    string,
    LookupInInternalPath<Def, Opcode>
  >
;

/**
 * Lookup internal paths - Non-distributive.
 */
export type LookupInInternalPath<Def, Opcode extends LookupInSpecOpCode> =
  LookupInPath<Def, Opcode> extends infer Path ?
    Path extends string ?
      Path :
    Path extends LookupInMacro<infer LookupInMacroPath> ?
      LookupInMacroPath :
    never :
  never
;

/**
 * Transform the spec path into the spec internal path.
 */
export type ToLookupInternalPath<UserPath> =
  UserPath extends LookupInMacro<infer LookupInMacroPath> ?
      LookupInMacroPath :
  UserPath extends string ?
    UserPath :
  never
;

/**
 * Validate the `LookupInSpec` consistency.
 * Returns an error message if the path or the value is inconsistency, `T` if everything looks good.
 */
export type ValidateLookupInSpec<ExpectedDefs, Spec> =
  ExpectedDefs extends AnyDocDef ?
    Spec extends LookupInSpec<infer Def, infer Opcode, infer InternalPath> ?
      IsFuzzyDocument<ExpectedDefs['Body']> extends true ?
        Spec :
      InternalPath extends AnyLookupInInternalPath<ExpectedDefs, Opcode> ?
        Spec :
      `Invalid path: Cannot perform '${LookupInSpecOperationFriendlyName[Opcode]}' at '${InternalPath}' on any declared document.` :
    never :
  never
;


/**
 * Validate an array of `MutateInSpec`.
 */
export type ValidateLookupInSpecs<ExpectedDefs, Specs> =
  Specs extends readonly [infer Head, ...infer Rest] ?
    [ValidateLookupInSpec<ExpectedDefs, Head>, ...ValidateLookupInSpecs<ExpectedDefs, Rest>] :
  // Specs extends ReadonlyArray<LookupInSpec<Defs>> ?
  //   Specs :
  []
;

/**
 * Validate and narrow down an array of `LookupInSpec`.
 *
 * @see ValidateLookupInSpecs
 */
export type NarrowLookupSpecs<Def, Specs> = Try<
  Specs,
  [],
  ValidateLookupInSpecs<Def, Specs>
>;

/**
 * OpCode used in sub-document lookup operation.
 */
export type LookupInSpecOpCode =
  | CppProtocolSubdocOpcode.get_doc
  | CppProtocolSubdocOpcode.get
  | CppProtocolSubdocOpcode.exists
  | CppProtocolSubdocOpcode.get_count

/**
 * Operation friendly name.
 * Use for type error messages.
 */
export type LookupInSpecOperationFriendlyName = {
  [CppProtocolSubdocOpcode.get]: 'get';
  [CppProtocolSubdocOpcode.get_doc]: 'get';
  [CppProtocolSubdocOpcode.exists]: 'exists';
  [CppProtocolSubdocOpcode.get_count]: 'count';
}