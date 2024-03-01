/*
  Copyright 2021-Present Couchbase, Inc.

  Use of this software is governed by the Business Source License included in
  the file licenses/BSL-Couchbase.txt.  As of the Change Date specified in that
  file, in accordance with the Business Source License, use of this software will
  be governed by the Apache License, Version 2.0, included in the file
  licenses/APL2.txt.
*/
import { CharStream, CommonTokenStream, InputStream, ParseTreeWalker } from 'antlr4';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

import { goyaccLexer, goyaccParser } from './';
import { GoyaccParserListener } from './GoyaccParserListener';

const currentDir = path.dirname(fileURLToPath(import.meta.url));

const n1ql = fs.readFileSync(path.resolve(currentDir, '../../n1ql.y'), {
  encoding: 'utf8',
});

const n1ql_lexer_text = fs.readFileSync(
  path.resolve(currentDir, './n1ql_lexer.g4.input'),
  { encoding: 'utf8' }
);

const chars = new InputStream(n1ql);
const lexer = new goyaccLexer(chars as CharStream);
const tokens = new CommonTokenStream(lexer);
const parser = new goyaccParser(tokens);

const tree = parser.file();
const listener = new GoyaccParserListener([n1ql_lexer_text]);

ParseTreeWalker.DEFAULT.walk(listener, tree);

process.stdout.write(listener.getOutput().join(''));
