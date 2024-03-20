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
  FileContext,
  goyaccListener,
  Parser_ruleContext,
  ProductionContext,
} from './index';

export class GoyaccParserListener extends goyaccListener {
  private readonly reservedWords = ['let', 'delete', 'returns'];

  // Parser rule names are always lowercase and must not start with an underscore
  private readonly invalidParserRuleNameRegex = /^_[a-zA-Z]+/;
  private readonly obuf: string[];
  private currentProductions: string[] = [];

  constructor(obuf: string[]) {
    super();
    this.obuf = obuf;
  }

  getOutput() {
    return this.obuf;
  }

  // We can't have rules with certain names, so add underscore
  rewriteRestrictedName(word: string) {
    if (this.reservedWords.includes(word.toLowerCase())) return word + '_';

    if (word.startsWith('_')) {
      // The first char cannot be an underscore
      // Also, we must respect the case in our fix, lowercase is for parser rules, uppercase is for lexer rules
      if (word[1].toLowerCase() === word[1]) return `p_${word}`;
      return `T_${word}`;
    }

    return word;
  }

  override enterParser_rule = (ctx: Parser_ruleContext) => {
    this.currentProductions = [];
  };

  override exitParser_rule = (ctx: Parser_ruleContext) => {
    const ruleName = this.rewriteRestrictedName(ctx.Word().getText());
    this.obuf.push(`${ruleName}: ${this.currentProductions.join('\n\t| ')} \n;\n`);
  };

  override exitProduction = (ctx: ProductionContext) => {
    // Collect words, ignore the code blocks, rename reservedWords
    const words = ctx.Word_list().map((w) => this.rewriteRestrictedName(w.getText()));

    // Remove %prec expressions because antlr doesn't support them
    const indexOfPrec = words.indexOf('%prec');

    if (indexOfPrec != -1) {
      words.splice(indexOfPrec);
    }

    this.currentProductions.push(words.join(' '));
  };
}
