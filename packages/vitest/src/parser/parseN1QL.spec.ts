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

import { invariant } from '@cbjsdev/shared';

import { parseN1QL, ParseResult } from './parseN1QL';

describe('parseN1QL', () => {
  it('should parse a simple SELECT query', ({ expect }) => {
    // SELECT sub.title FROM (SELECT * FROM bookStore) as sub;

    const [result] = parseN1QL(
      `
      SELECT b.title, b.authors[0] FROM story.library.books as b WHERE lastModifiedBy >= 17000000;
      `
    ) as ParseResult[];

    // console.log(result);
    // console.log(result.all_paths_used);

    // const astRoot = result.functions_used[0].parentCtx;

    console.log(result);
    expect(result).toBeDefined();
  });
});
