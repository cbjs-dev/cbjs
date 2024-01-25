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

import type { LookupInMacro } from "../../../sdspecs";
import type { StringDigits, StringHex, TimestampSeconds } from "../utils/string-utils.types";

/**
 * Return the result type of the given {@link LookupInMacro}.
 */
export type LookupInMacroResult<Macro extends LookupInMacro> =
  Macro extends LookupInMacro<infer Type> ?
    Type extends keyof LookupInMacroReturnType ?
      LookupInMacroReturnType[Type] :
    never :
  never
;

/**
 * An object type with the macro string as key and the return type as parameter.
 */
export type LookupInMacroReturnType = {
  '$document': LookupInMacroDocument,
  '$document.exptime': number;
  '$document.CAS': StringHex;
  '$document.seqno': StringHex;
  '$document.last_modified': TimestampSeconds;
  '$document.deleted': boolean;
  '$document.value_bytes': number;
  '$document.revid': StringDigits;
}

/**
 * The result of {@link LookupInMacro.Document}.
 */
export type LookupInMacroDocument = {
  exptime: number;
  CAS: StringHex;
  seqno: StringHex;
  last_modified: TimestampSeconds;
  deleted: boolean;
  value_bytes: number;
  revid: StringDigits;
}