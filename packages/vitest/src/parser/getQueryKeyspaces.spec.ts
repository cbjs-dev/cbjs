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

import { getQueryKeyspaces } from './getQueryKeyspaces';

describe('getQueryKeyspaces', () => {
  describe('select', () => {
    it('from bucket', ({ expect }) => {
      expect(getQueryKeyspaces('SELECT title FROM foo')).toEqual([['foo']]);
    });

    it('from scope', ({ expect }) => {
      expect(getQueryKeyspaces('SELECT title FROM foo.bar')).toEqual([['foo', 'bar']]);
    });

    it('from collection', ({ expect }) => {
      expect(getQueryKeyspaces('SELECT title FROM foo.bar.baz')).toEqual([
        ['foo', 'bar', 'baz'],
      ]);
    });

    it('from as', ({ expect }) => {
      expect(getQueryKeyspaces('SELECT b.title FROM foo.bar.baz as b')).toEqual([
        ['foo', 'bar', 'baz'],
      ]);
    });
  });

  describe('update', () => {
    it('should get keyspaces from a simple update statement', ({ expect }) => {
      expect(getQueryKeyspaces('UPDATE foo.bar as b SET b.title = "meh"')).toEqual([
        ['foo', 'bar'],
      ]);
    });
  });
});
