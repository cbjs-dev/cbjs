/*
 * Copyright (c) 2023-Present Jonathan MASSUCHETTI <jonathan.massuchetti@dappit.fr>.
 * Copyright 2021-Present Couchbase, Inc.

 * Use of this software is governed by the Business Source License included in
 * the file licenses/BSL-Couchbase.txt.  As of the Change Date specified in that
 * file, in accordance with the Business Source License, use of this software will
 * be governed by the Apache License, Version 2.0, included in the file
 * licenses/APL2.txt.
 */
import { CharStream, CommonTokenStream, ParseTreeWalker } from 'antlr4';

import {
  n1qlLexer,
  n1qlParser,
  N1qlParserErrorListener,
  N1qlParserListener,
} from './antlr/n1ql';

export type ParseResult = {
  keyspaces: string[][];
};

export function parseN1QL(query: string): N1qlParserListener {
  const charStream = new CharStream(query);
  const lexer = new n1qlLexer(charStream);
  const tokenStream = new CommonTokenStream(lexer);
  const parser = new n1qlParser(tokenStream);
  const errorListener = new N1qlParserErrorListener();

  lexer.removeErrorListeners();
  parser.removeErrorListeners();
  lexer.addErrorListener(errorListener);
  parser.addErrorListener(errorListener);

  const tree = parser.input();
  const listener = new N1qlParserListener();

  ParseTreeWalker.DEFAULT.walk(listener, tree);

  return listener;
}
