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
import { ErrorListener, RecognitionException, Recognizer } from '@cbjsdev/antlr4';

import { N1qlParserError } from './N1qlParserError.js';

export class N1qlParserErrorListener<T> extends ErrorListener<T> {
  constructor() {
    super();
  }

  override syntaxError(
    recognizer: Recognizer<T>,
    offendingSymbol: T,
    line: number,
    column: number,
    message: string,
    e?: RecognitionException
  ) {
    throw new N1qlParserError(
      {
        recognizer,
        offendingSymbol,
        line,
        column,
        message,
      },
      e
    );
  }
}
