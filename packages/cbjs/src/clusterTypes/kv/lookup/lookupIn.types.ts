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
  ArrayElement,
  DocDef,
  If, IsAny,
  IsArrayLengthFixed,
  IsExactly,
  IsFuzzyDocument,
  SubDocument,
  Try,
} from '@cbjsdev/shared';

import type { CppProtocolSubdocOpcode } from '../../../binding.js';
import { Collection } from '../../../collection.js';
import type { LookupInResultEntry } from '../../../crudoptypes.js';
import type { LookupInMacro, LookupInSpec } from '../../../sdspecs.js';
import type { LookupInMacroReturnType } from './lookupInMacro.types.js';
import type { LookupInCountPath, LookupInExistsPath, LookupInGetPath } from './lookupOperations.types.js';

/**
 * Infer the actual {@link CppProtocolSubdocOpcode} from the given path for a {@link LookupInSpec.get} operation.
 */
export type LookupInSpecGetOpcode<Path extends string | LookupInMacro> = Path extends ''
  ? CppProtocolSubdocOpcode.get_doc
  : CppProtocolSubdocOpcode.get;

/**
 * Return a {@link LookupInSpec} type with `Path` converted to an internal path.
 */
export type MakeLookupInSpec<Def extends DocDef, Opcode extends LookupInSpecOpCode, Path extends LookupInPath<Def, Opcode>> =
  LookupInSpec<Def, Opcode, ToLookupInternalPath<Def, Opcode, Path>>
;

/**
 * Results of a {@link Collection.lookupIn} operation.
 *
 * @see LookupIn
 * @see Specs
 */
export type LookupInSpecResults<Specs, Defs extends DocDef> =
  Specs extends readonly [infer Spec extends LookupInSpec, ...infer Rest extends ReadonlyArray<LookupInSpec>] ?
    [LookupInSpecResult<Spec, Defs>, ...LookupInSpecResults<Rest, Defs>] :
  // An empty tuple will match ReadonlyArray, so we need to check this first
  Specs extends [] ?
    [] :
  Specs extends ReadonlyArray<infer Spec extends LookupInSpec> ?
    LookupInSpecResult<Spec, Defs>[] :
  []
;

/**
 * Operation unit result type for a {@link LookupInSpec}.
 */
export type LookupInSpecResult<Spec extends LookupInSpec, DefMatchingKey extends DocDef> =
  Spec extends unknown ?
    Spec extends LookupInSpec<infer LookupDef extends DocDef> ?
      Spec['_op'] extends CppProtocolSubdocOpcode.get | CppProtocolSubdocOpcode.get_doc ?
        Spec['_path'] extends keyof LookupInMacroReturnType ?
          LookupInMacroReturnType[Spec['_path']] :
        LookupDef extends DocDef<string, infer LookupDefBody> ?
          If<IsAny<LookupDefBody>, SubDocument<DefMatchingKey['Body'], Spec['_path']>, SubDocument<LookupDefBody, Spec['_path']>> :
        SubDocument<DefMatchingKey['Body'], Spec['_path']> :
      Spec['_op'] extends CppProtocolSubdocOpcode.get_count ?
        number :
      Spec['_op'] extends CppProtocolSubdocOpcode.exists ?
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
export type LookupInResultEntries<Results extends ReadonlyArray<unknown>, ThrowOnSpecError extends boolean> =
  Results extends readonly [infer Head extends unknown, ...infer Rest extends ReadonlyArray<unknown>] ?
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
export type LookupInPath<Def extends DocDef, Opcode extends LookupInSpecOpCode> =
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
export type AnyLookupInInternalPath<Def extends DocDef, Opcode extends LookupInSpecOpCode = LookupInSpecOpCode> =
  If<
    IsFuzzyDocument<Def['Body']>,
    string,
    LookupInInternalPath<Def, Opcode>
  >
;

/**
 * Lookup internal paths - Non-distributive.
 */
export type LookupInInternalPath<Def extends DocDef, Opcode extends LookupInSpecOpCode> =
  LookupInPath<Def, Opcode> extends infer Path extends string | LookupInMacro ?
    Path extends LookupInMacro<infer LookupInMacroPath extends keyof LookupInMacroReturnType> ?
      LookupInMacroPath :
    Path :
  never
;

/**
 * Transform the spec path into the spec internal path.
 */
export type ToLookupInternalPath<Def extends DocDef, Opcode extends LookupInSpecOpCode, PublicPath extends string | LookupInMacro> =
  PublicPath extends LookupInMacro<infer LookupInMacroPath> ?
    LookupInMacroPath extends LookupInInternalPath<Def, Opcode> ?
      LookupInMacroPath :
    never :
  PublicPath extends LookupInInternalPath<Def, Opcode> ?
    PublicPath :
  never
;

/**
 * Validate the `LookupInSpec` consistency.
 * Returns an error message if the path or the value is inconsistency, `T` if everything looks good.
 */
export type ValidateLookupInSpec<Defs extends DocDef, Spec extends LookupInSpec> =
  Spec extends LookupInSpec<infer Def, infer Opcode, infer InternalPath> ?
    IsFuzzyDocument<Defs['Body']> extends true ?
      LookupInSpec<Def, Opcode, InternalPath> :
    InternalPath extends AnyLookupInInternalPath<Defs, Opcode> ?
      LookupInSpec<Defs, Opcode> :
    `Invalid path: Cannot perform '${LookupInSpecOperationFriendlyName[Opcode]}' at '${InternalPath}' on any declared document.` :
  never
;


/**
 * Validate an array of `MutateInSpec`.
 */
export type ValidateLookupInSpecs<Defs extends DocDef, Specs> =
  Specs extends readonly [LookupInSpec<infer Def, infer Opcode, infer InternalPath>, ...infer Rest extends ReadonlyArray<unknown>] ?
    [ValidateLookupInSpec<Defs, LookupInSpec<Def, Opcode, InternalPath>>, ...ValidateLookupInSpecs<Defs, Rest>] :
  // Specs extends ReadonlyArray<LookupInSpec<Defs>> ?
  //   Specs :
  []
;

/**
 * Validate and narrow down an array of `LookupInSpec`.
 *
 * @see ValidateLookupInSpecs
 */
export type NarrowLookupSpecs<Def extends DocDef, Specs> = Try<
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