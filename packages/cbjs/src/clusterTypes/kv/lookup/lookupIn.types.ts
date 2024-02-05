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
import type { If, IsExactly, Try } from '@cbjs/shared';

import type { CppProtocolSubdocOpcode } from '../../../binding';
import type { LookupInResultEntry } from '../../../crudoptypes';
import type { LookupInMacro, LookupInSpec } from '../../../sdspecs';
import type { IsFuzzyDocument } from '../mutation/mutateIn.types';
import type { ArrayElement, IsArrayLengthFixed } from '../utils/array-utils.types';
import type { SubDocument } from '../utils/path-utils.types';
import type { LookupInMacroReturnType } from './lookupInMacro.types';
import type {
  LookupInCountPath,
  LookupInExistsPath,
  LookupInGetPath,
} from './lookupOperations.types';

/**
 * Infer the actual {@link CppProtocolSubdocOpcode} from the given path for a {@link LookupInSpec.get} operation.
 */
export type LookupInSpecGetOpcode<Path extends string | LookupInMacro> = Path extends ''
  ? CppProtocolSubdocOpcode.get_doc
  : CppProtocolSubdocOpcode.get;

/**
 * Return a {@link LookupInSpec} type with `Path` converted to an internal path.
 */
export type MakeLookupInSpec<Doc extends object, Opcode extends LookupInSpecOpCode, Path extends LookupInPath<Doc, Opcode>> =
  LookupInSpec<Doc, Opcode, ToLookupInternalPath<Doc, Opcode, Path>>
;

/**
 * Results of a {@link Collection.lookupIn} operation.
 *
 * @see LookupIn
 * @see Specs
 */
export type LookupInSpecResults<Specs, CollectionDocuments> =
  Specs extends readonly [infer Spec extends LookupInSpec, ...infer Rest extends ReadonlyArray<LookupInSpec>] ?
    [LookupInSpecResult<Spec, CollectionDocuments>, ...LookupInSpecResults<Rest, CollectionDocuments>] :
  []
;

/**
 * Operation unit result type for a {@link LookupInSpec}.
 */
export type LookupInSpecResult<Spec extends LookupInSpec, CollectionDocuments> =
  Spec extends unknown ?
    Spec extends LookupInSpec<infer Doc extends object> ?
      Spec['_op'] extends CppProtocolSubdocOpcode.get | CppProtocolSubdocOpcode.get_doc ?
        Spec['_path'] extends keyof LookupInMacroReturnType ?
          LookupInMacroReturnType[Spec['_path']] :
        // In case of default cluster types we try our best and get a union of possible subdocs
        If<IsExactly<Doc, object>, SubDocument<CollectionDocuments, Spec['_path']>, SubDocument<Doc, Spec['_path']>>:
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
export type LookupInResultEntries<Results extends ReadonlyArray<unknown>> =
  Results extends readonly [infer Head extends unknown, ...infer Rest extends ReadonlyArray<unknown>] ?
    [LookupInResultEntry<Head>, ...LookupInResultEntries<Rest>] :
  IsArrayLengthFixed<Results> extends true ?
    [] :
  LookupInResultEntry<ArrayElement<Results>>[]
;

/**
 * All possible lookup paths. Distributive.
 */
export type AnyLookupInPath<
  Doc extends object,
  Opcode extends LookupInSpecOpCode = LookupInSpecOpCode,
> =
  Doc extends unknown ?
    Opcode extends unknown ?
      LookupInPath<Doc, Opcode> :
    never :
  never
;

/**
 * Lookup paths - Non-distributive.
 */
export type LookupInPath<Doc extends object, Opcode extends LookupInSpecOpCode> =
  Opcode extends CppProtocolSubdocOpcode.get_doc ? '' :
  Opcode extends CppProtocolSubdocOpcode.get ? Exclude<LookupInGetPath<Doc>, ''> :
  Opcode extends CppProtocolSubdocOpcode.exists ? LookupInExistsPath<Doc> :
  Opcode extends CppProtocolSubdocOpcode.get_count ? LookupInCountPath<Doc> :
  never
;

/**
 * All possible internal lookup paths for a document.
 *
 * @internal
 */
export type AnyLookupInInternalPath<Doc extends object, Opcode extends LookupInSpecOpCode = LookupInSpecOpCode> =
  If<
    IsFuzzyDocument<Doc>,
    string,
    LookupInInternalPath<Doc, Opcode>
  >
;

/**
 * Lookup internal paths - Non-distributive.
 */
export type LookupInInternalPath<Doc extends object, Opcode extends LookupInSpecOpCode> =
  LookupInPath<Doc, Opcode> extends infer Path extends string | LookupInMacro ?
    Path extends LookupInMacro<infer LookupInMacroPath extends keyof LookupInMacroReturnType> ?
      LookupInMacroPath :
    Path :
  never
;

/**
 * Transform the spec path into the spec internal path.
 */
export type ToLookupInternalPath<Doc extends object, Opcode extends LookupInSpecOpCode, PublicPath extends string | LookupInMacro> =
  PublicPath extends LookupInMacro<infer LookupInMacroPath> ?
    LookupInMacroPath extends LookupInInternalPath<Doc, Opcode> ?
      LookupInMacroPath :
    never :
  PublicPath extends LookupInInternalPath<Doc, Opcode> ?
    PublicPath :
  never
;

/**
 * Validate the `LookupInSpec` consistency.
 * Returns an error message if the path or the value is inconsistency, `T` if everything looks good.
 */
export type ValidateLookupInSpec<Docs extends object, Spec extends LookupInSpec> =
  Spec extends LookupInSpec<infer Doc, infer Opcode, infer InternalPath> ?
    IsFuzzyDocument<Docs> extends true ?
      LookupInSpec<Doc, Opcode, InternalPath> :
    InternalPath extends AnyLookupInInternalPath<Docs, Opcode> ?
      LookupInSpec<Doc, Opcode, InternalPath> :
    `Invalid path: Cannot perform '${LookupInSpecOperationFriendlyName[Opcode]}' at '${InternalPath}' on any declared document.` :
  never
;

/**
 * Validate an array of `MutateInSpec`.
 */
export type ValidateLookupInSpecs<Docs extends object, Specs> =
  Specs extends readonly [LookupInSpec<infer Doc, infer Opcode, infer InternalPath>, ...infer Rest extends ReadonlyArray<unknown>] ?
    [ValidateLookupInSpec<Docs, LookupInSpec<Doc, Opcode, InternalPath>>, ...ValidateLookupInSpecs<Docs, Rest>] :
  Specs extends ReadonlyArray<LookupInSpec<Docs>> ?
    Specs :
  []
;

/**
 * Validate and narrow down an array of `LookupInSpec`.
 *
 * @see ValidateLookupInSpecs
 */
export type NarrowLookupSpecs<Docs extends object, Specs> = Try<
  Specs,
  [],
  ValidateLookupInSpecs<Docs, Specs>
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