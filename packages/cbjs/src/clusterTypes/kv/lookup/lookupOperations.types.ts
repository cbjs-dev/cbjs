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
  DocDefBodyPathShape,
  DocDefLookupGetPathShape,
  ExtractPathToArray,
  ExtractPathToObject,
  If,
  IsFuzzyDocument,
} from '@cbjsdev/shared';
import type { CppProtocolSubdocOpcode } from '../../../binding.js';
import type { LookupInMacro, LookupInSpec } from '../../../sdspecs.js';
import { DocDef } from '../../clusterTypes.js';
import type { MakeLookupInSpec } from './lookupIn.types.js';

/**
 * Helper to build the path of a lookup operation.
 * Handles cases where the document is fuzzy.
 */
export type OperationPath<Doc, Path> =
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
// prettier-ignore
export type LookupInGetPath<Def> =
  Def extends DocDefLookupGetPathShape ?
    Def['LookupPath']['get'] :
  never
;

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
export type LookupInExistsPath<Def> =
  Def extends DocDefBodyPathShape ?
    OperationPath<Def['Body'], Def['Path'] | LookupInMacro> :
  never
;

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
// prettier-ignore
export type LookupInCountPath<Def> =
  Def extends DocDefBodyPathShape ?
    If<
      IsFuzzyDocument<Def['Body']>,
      string | LookupInMacro<'$document'>,
      | ExtractPathToObject<Def['Body'], Def['Path'] | ''>
      | ExtractPathToArray<Def['Body'], Def['Path'] | ''>
      | LookupInMacro<'$document'>
    > :
  never
;

/**
 * Function that returns a {@link LookupInSpec} instance for a `count` operation.
 */
export type LookupInSpecCountFunction<Def extends DocDef> =
  <Path extends LookupInCountPath<Def>>(path: Path, options?: { xattr?: boolean })
    => MakeLookupInSpec<Def, CppProtocolSubdocOpcode.get_count, Path>
;
