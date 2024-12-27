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
  If,
  IsArrayLengthFixed,
  IsFuzzyDocument,
  LookupInMacroResult,
  LookupInMacroReturnType,
  SubDocument,
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
export type MakeLookupInSpec<Options, Def extends AnyDocDef, Opcode extends LookupInSpecOpCode, Path> =
  LookupInSpec<Def, Opcode, ToLookupInternalPath<Path>, Options>
;

/**
 * Results of a {@link Collection.lookupIn} operation.
 *
 * @see LookupIn
 * @see Specs
 */
export type LookupInSpecResults<Options, Specs, Defs> =
  Specs extends readonly [infer Spec, ...infer Rest] ?
    [LookupInSpecResult<Options, Spec, Defs>, ...LookupInSpecResults<Options, Rest, Defs>] :
  // An empty tuple will match ReadonlyArray, so we need to check this first
  Specs extends [] ?
    [] :
  Specs extends ReadonlyArray<infer Spec> ?
    LookupInSpecResult<Options, Spec, Defs>[] :
  []
;

/**
 * Spec operation result type for a single {@link LookupInSpec}.
 */
export type LookupInSpecResult<Options, Spec, Def> =
  Spec extends LookupInSpec<infer LookupDef, infer Op, infer Path> ?
    Op extends CppProtocolSubdocOpcode.get | CppProtocolSubdocOpcode.get_doc ?
      Def extends DocDefBodyShape ?
        Path extends keyof LookupInMacroReturnType ?
          LookupInMacroReturnType[Path] :
        IsFuzzyDocument<LookupDef['Body']> extends true ?
          SubDocument<Def['Body'], Path> :
        SubDocument<LookupDef['Body'], Path> :
      never :
    Op extends CppProtocolSubdocOpcode.get_count ?
      number :
    Op extends CppProtocolSubdocOpcode.exists ?
      boolean :
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

export type ValuesFromSpecResults<Method, SpecResults, ThrowOnSpecError> =
  [ThrowOnSpecError] extends [true] ?
    Method extends 'lookupInAllReplicas' ?
      SpecResults[] :
    SpecResults :
  Method extends 'lookupInAllReplicas' ?
    ArrayElementOrUndefined<SpecResults>[] :
  ArrayElementOrUndefined<SpecResults>
;
    
type ArrayElementOrUndefined<Arr> =
  Arr extends readonly [infer Head extends unknown, ...infer Rest] ?
    [Head | undefined, ...ArrayElementOrUndefined<Rest>] :
  []
;

// prettier-ignore
export type OptimisticGetPathCheck<Options, Def extends DocDefBodyShape, Path extends string | LookupInMacro> =
  Path extends string ?
    [SubDocument<Def['Body'], Path>] extends [never] ?
      LookupInGetPath<Options, Def> :
    Path :
  LookupInGetPath<Options, Def>
;

export type LookupInGetResult<Def extends DocDefBodyShape, Path extends string | LookupInMacro> =
  Path extends LookupInMacro ?
    LookupInMacroResult<Path> :
  Path extends string ?
    SubDocument<Def['Body'], Path> :
  never
;

/**
 * Lookup paths - Non-distributive.
 */
export type LookupInPath<Options, Def, Opcode extends LookupInSpecOpCode> =
  Opcode extends CppProtocolSubdocOpcode.get_doc ? '' :
  Opcode extends CppProtocolSubdocOpcode.get ? Exclude<LookupInGetPath<Options, Def>, ''> :
  Opcode extends CppProtocolSubdocOpcode.exists ? LookupInExistsPath<Options, Def> :
  Opcode extends CppProtocolSubdocOpcode.get_count ? LookupInCountPath<Options, Def> :
  never
;

/**
 * All possible internal lookup paths for a document.
 *
 * @internal
 */
export type AnyLookupInInternalPath<Options, Def extends DocDefBodyShape, Opcode extends LookupInSpecOpCode = LookupInSpecOpCode> =
  If<
    IsFuzzyDocument<Def['Body']>,
    string,
    LookupInInternalPath<Options, Def, Opcode>
  >
;

/**
 * Lookup internal paths - Non-distributive.
 */
export type LookupInInternalPath<Options, Def, Opcode extends LookupInSpecOpCode> =
  LookupInPath<Options, Def, Opcode> extends infer Path ?
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
export type ValidateLookupInSpec<Options, ExpectedDefs, Spec> =
  ExpectedDefs extends AnyDocDef ?
    Spec extends LookupInSpec<infer Def, infer Opcode, infer InternalPath> ?
      IsFuzzyDocument<ExpectedDefs['Body']> extends true ?
        Spec :
      InternalPath extends AnyLookupInInternalPath<Options, ExpectedDefs, Opcode> ?
        Spec :
      `Invalid path: Cannot perform '${LookupInSpecOperationFriendlyName[Opcode]}' at '${InternalPath}' on any declared document.` :
    never :
  never
;


/**
 * Validate an array of `MutateInSpec`.
 */
export type ValidateLookupInSpecs<Options, ExpectedDefs, Specs> =
  Specs extends readonly [infer Head, ...infer Rest] ?
    [ValidateLookupInSpec<Options, ExpectedDefs, Head>, ...ValidateLookupInSpecs<Options, ExpectedDefs, Rest>] :
  // Specs extends ReadonlyArray<LookupInSpec<Defs>> ?
  //   Specs :
  []
;

/**
 * Validate and narrow down an array of `LookupInSpec`.
 *
 * @see ValidateLookupInSpecs
 */
export type NarrowLookupSpecs<Options, Def, Specs> = Try<
  Specs,
  [],
  ValidateLookupInSpecs<Options, Def, Specs>
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