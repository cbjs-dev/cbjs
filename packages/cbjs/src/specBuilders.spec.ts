/*
 * Copyright (c) 2023-Present Jonathan MASSUCHETTI <jonathan.massuchetti@dappit.fr>.
 * Copyright (c) 2013-Present Couchbase Inc.
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

import { LookupInSpec, MutateInSpec } from './sdspecs';
import { LookupSpecs, MutationSpecs } from './specBuilders';

describe('specBuilders', function () {
  type TestDoc = {
    title: string;
    description?: string;
    metadata: {
      tags: string[];
    };
  };

  describe('LookupSpecs', function () {
    it('should return an array with methods to chain more specs', function ({ expect }) {
      expect(LookupSpecs.for<TestDoc>()).toHaveProperty('get');
      expect(LookupSpecs.for<TestDoc>()).toHaveProperty('exists');
      expect(LookupSpecs.for<TestDoc>()).toHaveProperty('count');
    });

    it('should return all the specs, in order, when the getter is called', function ({
      expect,
    }) {
      const specs = LookupSpecs.for<TestDoc>()
        .get('title')
        .count('metadata.tags')
        .exists('title')
        .getSpecs();

      expect(specs).toStrictEqual([
        LookupInSpec.get('title'),
        LookupInSpec.count('metadata.tags'),
        LookupInSpec.exists('title'),
      ]);
    });
  });

  describe('MutationSpecs', function () {
    it('should return an array with methods to chain more specs', function ({ expect }) {
      expect(MutationSpecs.for<TestDoc>()).toHaveProperty('insert');
      expect(MutationSpecs.for<TestDoc>()).toHaveProperty('upsert');
      expect(MutationSpecs.for<TestDoc>()).toHaveProperty('replace');
      expect(MutationSpecs.for<TestDoc>()).toHaveProperty('remove');
      expect(MutationSpecs.for<TestDoc>()).toHaveProperty('arrayAppend');
      expect(MutationSpecs.for<TestDoc>()).toHaveProperty('arrayPrepend');
      expect(MutationSpecs.for<TestDoc>()).toHaveProperty('arrayInsert');
      expect(MutationSpecs.for<TestDoc>()).toHaveProperty('arrayAddUnique');
      expect(MutationSpecs.for<TestDoc>()).toHaveProperty('increment');
      expect(MutationSpecs.for<TestDoc>()).toHaveProperty('decrement');
    });

    it('should return all the specs, in order, when the getter is called', function ({
      expect,
    }) {
      const specs = MutationSpecs.for<TestDoc>()
        .insert('description', 'no equal')
        .replace('title', 'Couchbase')
        .getSpecs();

      expect(specs).toStrictEqual([
        MutateInSpec.insert('description', 'no equal'),
        MutateInSpec.replace('title', 'Couchbase'),
      ]);
    });
  });
});
