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
import { ParserRuleContext } from 'antlr4';

import {
  ExprContext,
  From_termContext,
  n1qlListener,
  Simple_from_termContext,
} from './index';

export class N1qlParserListener extends n1qlListener {
  private readonly keyspaces: string[][] = [];
  exitEveryRule(ctx: ParserRuleContext) {
    super.exitEveryRule(ctx);
  }

  // Keyspaces from SELECT statements
  exitFrom_term = (ctx: From_termContext) => {
    console.log();
  };

  exitSimple_from_term = (ctx: Simple_from_termContext) => {
    const keyspace = ctx
      .expr()
      .children?.map((c) => c.getText())
      .filter((s) => s !== '.');

    if (keyspace === undefined) return;

    this.keyspaces.push(keyspace);
  };

  // Exit a parse tree produced by n1qlParser#expr.
  exitExpr = (ctx: ExprContext) => {
    let DOT = ctx.DOT();
    let IDENT = ctx.ident();
    let LBRACKET = ctx.LBRACKET();

    // if (DOT && IDENT) this.currentParseResult.path_expr.push(IDENT.getText());
    // if (LBRACKET) this.currentParseResult.path_expr.push('[]');
  };

  // Exit a parse tree produced by n1qlParser#c_expr.
  // exitC_expr(ctx) {
  //   var IDENT = ctx.IDENT();
  //   var IDENT_ICASE = ctx.IDENT_ICASE();
  //   var SELF = ctx.SELF();
  //   // whenever we see an IDENT, it is a field name used in an expression
  //   if (IDENT || IDENT_ICASE) {
  //     this.currentParseResult.newPath(ctx.getText());
  //   }
  // }
}
