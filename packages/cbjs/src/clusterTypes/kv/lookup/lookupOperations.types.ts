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

import type { CppProtocolSubdocOpcode } from '../../../binding';
import type { LookupInMacro, LookupInSpec } from '../../../sdspecs';
import type { IsFuzzyDocument } from '../mutation/mutateIn.types';
import type { ExtractPathToArray, ExtractPathToObject } from '../utils/document-path.types';
import type { DocumentPath } from '../utils/path-utils.types';
import type { MakeLookupInSpec } from './lookupIn.types';
import type { If } from '@cbjsdev/shared';

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
export type LookupInGetPath<Doc extends object> =
  OperationPath<Doc, DocumentPath<Doc> | LookupInMacro | ''>;

/**
 * Function that returns a {@link LookupInSpec} instance for a `get` operation.
 */
export type LookupInSpecGetFunction<Doc extends object> = {
  (path: '', options?: { xattr?: boolean }):
    LookupInSpec<Doc, CppProtocolSubdocOpcode.get_doc, ''>;

  <Path extends Exclude<LookupInGetPath<Doc>, ''>>(path: Path, options?: { xattr?: boolean }):
    MakeLookupInSpec<Doc, CppProtocolSubdocOpcode.get, Path>;
}

/**
 * Valid lookup path for an `exists` operation.
 *
 * @see LookupInSpecExistsFunction
 */
export type LookupInExistsPath<Doc extends object> =
  OperationPath<Doc, DocumentPath<Doc> | LookupInMacro>;

/**
 * Function that returns a {@link LookupInSpec} instance for an `exists` operation.
 */
export type LookupInSpecExistsFunction<Doc extends object> =
  <Path extends LookupInExistsPath<Doc>>(path: Path, options?: { xattr?: boolean })
    => MakeLookupInSpec<Doc, CppProtocolSubdocOpcode.exists, Path>
;

/**
 * Valid lookup path for a `count` operation.
 *
 * @see LookupInSpecCountFunction
 */
export type LookupInCountPath<Doc extends object> =
  If<
    IsFuzzyDocument<Doc>,
    string | LookupInMacro<'$document'>,
    | ExtractPathToObject<Doc, DocumentPath<Doc> | ''>
    | ExtractPathToArray<Doc, DocumentPath<Doc> | ''>
    | LookupInMacro<'$document'>
  >
;

/**
 * Function that returns a {@link LookupInSpec} instance for a `count` operation.
 */
export type LookupInSpecCountFunction<Doc extends object> =
  <Path extends LookupInCountPath<Doc>>(path: Path, options?: { xattr?: boolean })
    => MakeLookupInSpec<Doc, CppProtocolSubdocOpcode.get_count, Path>
;
