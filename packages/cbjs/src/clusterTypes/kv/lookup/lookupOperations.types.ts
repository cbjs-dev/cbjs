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
  DocDefBodyPathShape,
  ExtractPathToArray,
  ExtractPathToObject,
  If,
  IsFuzzyDocument, LookupInMacroShape,
} from '@cbjsdev/shared';
import type { LookupInMacro } from '../../../sdspecs.js';

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
 */
// prettier-ignore
export type LookupInGetPath<Def> =
  Def extends DocDefBodyPathShape ?
    OperationPath<Def['Body'], Def['Path'] | LookupInMacroShape | ''> :
  never
;

/**
 * Valid lookup path for an `exists` operation.
 */
export type LookupInExistsPath<Def> =
  Def extends DocDefBodyPathShape ?
    OperationPath<Def['Body'], Def['Path'] | LookupInMacro> :
  never
;

/**
 * Valid lookup path for a `count` operation.
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
