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

import {
  DocDef,
  ValidatePathToOptionalProperty,
  ValidatePathToProperty,
} from '@cbjsdev/shared';

import {
  ValidateMutateInInsertPath,
  ValidateMutateInReplacePath,
} from './clusterTypes/kv/mutation/mutationOperations.types.js';
import { LookupInSpec, MutateInSpec } from './sdspecs.js';
import { LookupSpecs, MutationSpecs } from './specBuilders.js';

describe('specBuilders', function () {
  type TestDoc = {
    title: string;
    description?: string;
    metadata: {
      tags: string[];
    };
  };

  type TestDocDef = DocDef<string, TestDoc>;

  describe('LookupSpecs', function () {
    it('should return an array with methods to chain more specs', function ({ expect }) {
      expect(LookupSpecs.for<TestDocDef>()).toHaveProperty('get');
      expect(LookupSpecs.for<TestDocDef>()).toHaveProperty('exists');
      expect(LookupSpecs.for<TestDocDef>()).toHaveProperty('count');
    });

    it('should return all the specs, in order, when the getter is called', function ({
      expect,
    }) {
      const specs = LookupSpecs.for<TestDocDef>()
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
      expect(MutationSpecs.for<TestDocDef>()).toHaveProperty('insert');
      expect(MutationSpecs.for<TestDocDef>()).toHaveProperty('upsert');
      expect(MutationSpecs.for<TestDocDef>()).toHaveProperty('replace');
      expect(MutationSpecs.for<TestDocDef>()).toHaveProperty('remove');
      expect(MutationSpecs.for<TestDocDef>()).toHaveProperty('arrayAppend');
      expect(MutationSpecs.for<TestDocDef>()).toHaveProperty('arrayPrepend');
      expect(MutationSpecs.for<TestDocDef>()).toHaveProperty('arrayInsert');
      expect(MutationSpecs.for<TestDocDef>()).toHaveProperty('arrayAddUnique');
      expect(MutationSpecs.for<TestDocDef>()).toHaveProperty('increment');
      expect(MutationSpecs.for<TestDocDef>()).toHaveProperty('decrement');
    });

    it('should return all the specs, in order, when the getter is called', function ({
      expect,
    }) {
      const specs = MutationSpecs.for<TestDocDef>()
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
