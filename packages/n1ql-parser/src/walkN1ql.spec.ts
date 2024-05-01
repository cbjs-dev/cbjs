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
import { describe, it } from 'vitest';

import n1qlListener from './antlr/n1ql/n1qlListener.js';
import { Simple_from_termContext } from './antlr/n1ql/n1qlParser.js';
import { walkN1ql } from './walkN1ql.js';

describe('parseN1QL', () => {
  it('should parse a simple SELECT query', ({ expect }) => {
    const listener = new (class extends n1qlListener {
      result?: string;

      override exitSimple_from_term = (ctx: Simple_from_termContext) => {
        this.result = ctx.getChild(0).getText();
      };
    })();

    walkN1ql(
      `
      SELECT b.title, b.authors[0] FROM story.library.books as b WHERE lastModifiedBy >= 17000000;
      `,
      listener
    );

    expect(listener.result).toEqual('story.library.books');
  });
});
