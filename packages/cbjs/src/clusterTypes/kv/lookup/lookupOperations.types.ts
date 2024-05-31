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

import type { CppProtocolSubdocOpcode } from '../../../binding.js';
import type { LookupInMacro, LookupInSpec } from '../../../sdspecs.js';
import type { MakeLookupInSpec } from './lookupIn.types.js';
import type {
  DocDef,
  DocumentPath,
  ExtractPathToArray,
  ExtractPathToObject,
  If,
  IsFuzzyDocument,
} from '@cbjsdev/shared';

/**
 * Helper to build the path of a lookup operation.
 * Handles cases where the document is fuzzy.
 */
type OperationPath<Doc extends object, Path> =
  If<
    IsFuzzyDocument<Doc>,
    string | LookupInMacro,
    Path
  >
;

/**
 * Valid lookup path for a `get` operation.
 *
 * @see LookupInSpecGetFunction
 */
export type LookupInGetPath<Def extends DocDef> =
  OperationPath<Def['Body'], Def['Path'] | LookupInMacro | ''>;

/**
 * Function that returns a {@link LookupInSpec} instance for a `get` operation.
 */
export type LookupInSpecGetFunction<Def extends DocDef> = {
  (path: '', options?: { xattr?: boolean }):
    LookupInSpec<Def, CppProtocolSubdocOpcode.get_doc, ''>;

  <Path extends Exclude<LookupInGetPath<Def>, ''>>(path: Path, options?: { xattr?: boolean }):
    MakeLookupInSpec<Def, CppProtocolSubdocOpcode.get, Path>;
}

/**
 * Valid lookup path for an `exists` operation.
 *
 * @see LookupInSpecExistsFunction
 */
export type LookupInExistsPath<Def extends DocDef> =
  OperationPath<Def['Body'], Def['Path'] | LookupInMacro>;

/**
 * Function that returns a {@link LookupInSpec} instance for an `exists` operation.
 */
export type LookupInSpecExistsFunction<Def extends DocDef> =
  <Path extends LookupInExistsPath<Def>>(path: Path, options?: { xattr?: boolean })
    => MakeLookupInSpec<Def, CppProtocolSubdocOpcode.exists, Path>
;

/**
 * Valid lookup path for a `count` operation.
 *
 * @see LookupInSpecCountFunction
 */
export type LookupInCountPath<Def extends DocDef> =
  If<
    IsFuzzyDocument<Def['Body']>,
    string | LookupInMacro<'$document'>,
    | ExtractPathToObject<Def['Body'], Def['Path'] | ''>
    | ExtractPathToArray<Def['Body'], Def['Path'] | ''>
    | LookupInMacro<'$document'>
  >
;

/**
 * Function that returns a {@link LookupInSpec} instance for a `count` operation.
 */
export type LookupInSpecCountFunction<Def extends DocDef> =
  <Path extends LookupInCountPath<Def>>(path: Path, options?: { xattr?: boolean })
    => MakeLookupInSpec<Def, CppProtocolSubdocOpcode.get_count, Path>
;
