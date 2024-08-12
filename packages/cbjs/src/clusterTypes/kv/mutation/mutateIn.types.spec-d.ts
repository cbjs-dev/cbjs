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
import { describe, expectTypeOf, it } from 'vitest';

import { CppProtocolSubdocOpcode } from '../../../binding.js';
import { connect } from '../../../couchbase.js';
import { MutateInResult, MutateInResultEntry } from '../../../crudoptypes.js';
import { MutateInSpec } from '../../../sdspecs.js';
import { DocDef } from '../../clusterTypes.js';
import { MutateInResultEntries, MutateInSpecResults } from './mutateIn.types.js';

type TestDocDef = DocDef<string, TestDoc>;
type TestDoc = {
  title: string;
  metadata: {
    modifiedBy?: string;
    tags: string[];
  };
  authors: [string, ...string[]];
};

type TestDocDef2 = DocDef<string, TestDoc2>;
type TestDoc2 = {
  title: string;
  sales: number[];
  metadata: {
    modifiedBy?: string;
  };
};

type TestDocDef3 = DocDef<`group::${string}`, TestDoc3>;
type TestDoc3 = {
  membership: Record<
    string,
    {
      joined: number;
      left?: number;
      invitedBy: string;
    }
  >;
};

type UserClusterTypes = {
  test: {
    _default: {
      _default: [TestDocDef, TestDocDef2];
    };
    testScope: {
      testCollection: [TestDocDef, TestDocDef2];
    };
    groups: {
      group: [TestDocDef3];
    };
  };
};

describe('mutateIn', function () {
  describe('Common', () => {
    it('should reject arrayAddUnique with options.multi = true', async function () {
      const cluster = await connect('couchbase://127.0.0.1');
      const collection = cluster.bucket('test').defaultCollection();

      await collection.mutateIn('test__document', [
        // @ts-expect-error options.multi is not allowed with `arrayAddUnique`
        MutateInSpec.arrayAddUnique('tags', ['foo', 'bar'], { multi: true }),
      ]);
    });
  });

  describe('Default Cluster Types', function () {
    it('should accept any path and any value when given an array of typeless specs', async function () {
      const cluster = await connect('couchbase://127.0.0.1');
      const collection = cluster.bucket('test').defaultCollection();

      await collection.mutateIn('test__document', [
        MutateInSpec.upsert('what', 'foo'),
        MutateInSpec.arrayInsert('what', 'foo'),
        MutateInSpec.insert('does_not_exists', 'foo'),
        MutateInSpec.remove('does_not_exists'),
        MutateInSpec.replace('does_not_exists', 'bar'),
        MutateInSpec.arrayAppend('does_not_exists', 'bar'),
        MutateInSpec.arrayPrepend('does_not_exists', 'bar'),
        MutateInSpec.arrayInsert('does_not_exists[0]', 'bar'),
        MutateInSpec.arrayAddUnique('does_not_exists[0]', 'bar'),
      ]);
    });

    it('should infer the mutation result when given an array of typeless specs', async function () {
      const cluster = await connect('couchbase://127.0.0.1');
      const collection = cluster.bucket('test').defaultCollection();

      const result = await collection.mutateIn('test__document', [
        MutateInSpec.insert('does_not_exists', 'whatever'),
        MutateInSpec.increment('does_not_exists', 1),
      ]);

      expectTypeOf(result).toEqualTypeOf<MutateInResult<[undefined, number]>>();
    });
  });

  describe('User-defined ClusterTypes', function () {
    it("should accept any path of the collection's document and its matching value when given an array of typeless specs", async function () {
      const cluster = await connect<UserClusterTypes>('couchbase://127.0.0.1');

      await cluster
        .bucket('test')
        .defaultCollection()
        .mutateIn('test__document', [
          MutateInSpec.arrayAppend('metadata.tags', 'whatever'),
          MutateInSpec.increment('sales[0]', 3),
          // @ts-expect-error Invalid path
          MutateInSpec.increment('sales[0]', 'three'),
          // @ts-expect-error Invalid path
          MutateInSpec.insert('metadata.tags[0]', 'whatever'),
          // @ts-expect-error Invalid path
          MutateInSpec.insert('metadata.tags', 'whatever'),
          // @ts-expect-error Path does not exist
          MutateInSpec.upsert('does_not_exists', 'whatever'),
        ]);

      await cluster
        .bucket('test')
        .scope('groups')
        .collection('group')
        .mutateIn('group::001', [
          MutateInSpec.insert('membership.aa', {
            joined: 0,
            invitedBy: '',
          }),
          // @ts-expect-error Invalid path
          MutateInSpec.increment('sales[0]', 'three'),
          // @ts-expect-error Invalid path
          MutateInSpec.insert('metadata.tags[0]', 'whatever'),
          // @ts-expect-error Invalid path
          MutateInSpec.insert('metadata.tags', 'whatever'),
          // @ts-expect-error Path does not exist
          MutateInSpec.upsert('does_not_exists', 'whatever'),
        ]);
    });

    it('should validate the specs when options are passed', async function () {
      const cluster = await connect<UserClusterTypes>('couchbase://127.0.0.1');
      const collection = cluster.bucket('test').defaultCollection();

      await collection.mutateIn(
        'test__document',
        [
          MutateInSpec.arrayAppend('metadata.tags', 'whatever'),
          MutateInSpec.increment('sales[0]', 3),
          // @ts-expect-error Invalid value
          MutateInSpec.increment('sales[0]', 'three'),
          // @ts-expect-error Invalid path
          MutateInSpec.insert('metadata.tags[0]', 'whatever'),
          // @ts-expect-error Invalid path
          MutateInSpec.insert('metadata.tags', 'whatever'),
          // @ts-expect-error Path does not exist
          MutateInSpec.upsert('does_not_exists', 'whatever'),
        ],
        { timeout: 200 }
      );
    });

    it('should validate the specs when a callback is passed', async function () {
      const cluster = await connect<UserClusterTypes>('couchbase://127.0.0.1');
      const collection = cluster.bucket('test').defaultCollection();

      await collection.mutateIn(
        'test__document',
        [
          MutateInSpec.arrayAppend('metadata.tags', 'whatever'),
          MutateInSpec.increment('sales[0]', 3),
          // @ts-expect-error Invalid value
          MutateInSpec.increment('sales[0]', 'three'),
          // @ts-expect-error Invalid path
          MutateInSpec.insert('metadata.tags[0]', 'whatever'),
          // @ts-expect-error Invalid path
          MutateInSpec.insert('metadata.tags', 'whatever'),
          // @ts-expect-error Path does not exist
          MutateInSpec.upsert('does_not_exists', 'whatever'),
        ],
        (err, result) => console.log(err, result)
      );
    });

    it('should validate the specs when both options and a callback are passed', async function () {
      const cluster = await connect<UserClusterTypes>('couchbase://127.0.0.1');
      const collection = cluster.bucket('test').defaultCollection();

      await collection.mutateIn(
        'test__document',
        [
          MutateInSpec.increment('sales[0]', 3),
          // @ts-expect-error Invalid value
          MutateInSpec.increment('sales[0]', 'three'),
          // @ts-expect-error Invalid value
          MutateInSpec.increment('sales[1]', 'three'),
        ],
        { timeout: 3 },
        (err, result) => console.log(err, result)
      );
    });

    it('should infer the mutation result when given an array of typeless specs', async function () {
      const cluster = await connect<UserClusterTypes>('couchbase://127.0.0.1');
      const collection = cluster.bucket('test').defaultCollection();

      const result = await collection.mutateIn('test__document', [
        MutateInSpec.arrayAppend('metadata.tags', 'whatever'),
        MutateInSpec.increment('sales[0]', 3),
      ]);

      expectTypeOf(result).toEqualTypeOf<MutateInResult<[undefined, number]>>();
    });
  });

  describe('MutationResultsFromSpecs', function () {
    it('should infer the result entries from MutateInSpec[]', function () {
      expectTypeOf<MutateInSpecResults<[]>>().toEqualTypeOf<[]>();

      expectTypeOf<
        MutateInSpecResults<
          [
            MutateInSpec<TestDocDef, CppProtocolSubdocOpcode.counter>,
            MutateInSpec<TestDocDef, CppProtocolSubdocOpcode.remove>,
          ]
        >
      >().toEqualTypeOf<[number, undefined]>();
    });
  });

  describe('MutateInResultEntries', function () {
    it('should create an array of type MutateInResult with the input values', function () {
      expectTypeOf<MutateInResultEntries<readonly []>>().toEqualTypeOf<[]>();

      expectTypeOf<MutateInResultEntries<readonly [number, undefined]>>().toEqualTypeOf<
        [MutateInResultEntry<number>, MutateInResultEntry<undefined>]
      >();
    });
  });
});
