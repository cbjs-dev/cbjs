/*
 * Copyright (c) 2023-Present Jonathan MASSUCHETTI <jonathan.massuchetti@dappit.fr>.
 * Copyright 2021-Present Couchbase, Inc.

 * Use of this software is governed by the Business Source License included in
 * the file licenses/BSL-Couchbase.txt.  As of the Change Date specified in that
 * file, in accordance with the Business Source License, use of this software will
 * be governed by the Apache License, Version 2.0, included in the file
 * licenses/APL2.txt.
 */
import { CharStream, CommonTokenStream, ParseTreeWalker, Token } from 'antlr4';

import n1qlLexer from './antlr/n1ql/n1qlLexer';
import n1qlParser from './antlr/n1ql/n1qlParser';
import { n1qlListener } from './index';
import { N1qlParserErrorListener } from './N1qlParserErrorListener';

export function walkN1ql(query: string, listener: n1qlListener): void {
  const charStream = new CharStream(query);
  const lexer = new n1qlLexer(charStream);
  const tokenStream = new CommonTokenStream(lexer);
  const parser = new n1qlParser(tokenStream);

  lexer.removeErrorListeners();
  parser.removeErrorListeners();
  lexer.addErrorListener(new N1qlParserErrorListener<number>());
  parser.addErrorListener(new N1qlParserErrorListener<Token>());

  const tree = parser.input();

  ParseTreeWalker.DEFAULT.walk(listener, tree);
}
