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
import { RecognitionException, Recognizer, Token } from 'antlr4';

type N1qlParserErrorContext<T> = {
  recognizer: Recognizer<T>;
  offendingSymbol: T;
  line: number;
  column: number;
  message: string;
};

export class N1qlParserError<T> extends Error {
  constructor(context: N1qlParserErrorContext<T>, cause?: RecognitionException) {
    const { offendingSymbol, line, column, message } = context;

    if (offendingSymbol instanceof Token) {
      const query = offendingSymbol.getInputStream().toString();
      const messageAtErrorLocation = ' '.repeat(column) + `^ ${message}`;

      super(
        `Failed to parse n1ql query at ${line}:${column} : \n\t${query}\n\t${messageAtErrorLocation}`,
        { cause }
      );
      return;
    }

    super(message);
  }
}
