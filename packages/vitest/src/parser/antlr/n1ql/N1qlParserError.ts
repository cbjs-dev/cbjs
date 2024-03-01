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
import { RecognitionException } from 'antlr4';

type N1qlParserErrorContext = {
  offendingSymbol: string;
  line: number;
  column: number;
  message: string;
};

export class N1qlParserError extends Error {
  public readonly context: N1qlParserErrorContext;

  constructor(context: N1qlParserErrorContext, cause: RecognitionException) {
    const { offendingSymbol, line, column, message } = context;

    super(
      `Failed to parse n1ql query : ${offendingSymbol}, ${line}, ${column}, ${message}, ${cause.message}`,
      {
        cause: cause,
      }
    );

    this.context = context;
  }
}
