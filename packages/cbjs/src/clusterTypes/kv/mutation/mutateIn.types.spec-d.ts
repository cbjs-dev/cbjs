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

import { CppProtocolSubdocOpcode } from '../../../binding';
import { connect } from '../../../couchbase';
import { MutateInResult, MutateInResultEntry } from '../../../crudoptypes';
import { MutateInSpec } from '../../../sdspecs';
import { mutationSpec } from '../../../specBuilders';
import { DocDef } from '../../clusterTypes';
import {
  IsFuzzyDocument,
  MutateInResultEntries,
  MutateInSpecResults,
} from './mutateIn.types';

type TestDoc = {
  title: string;
  metadata: {
    modifiedBy?: string;
    tags: string[];
  };
  authors: [string, ...string[]];
};

type TestDoc2 = {
  title: string;
  sales: number[];
  metadata: {
    modifiedBy?: string;
  };
};

type UserClusterTypes = {
  test: {
    _default: {
      _default: DocDef<string, TestDoc> | DocDef<string, TestDoc2>;
    };
    testScope: {
      testCollection: DocDef<string, TestDoc> | DocDef<string, TestDoc2>;
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
        MutateInSpec.increment('does_not_exists', 'whatever'),
      ]);

      expectTypeOf(result).toEqualTypeOf<MutateInResult<[undefined, number]>>();
    });

    it('should infer the mutation result when given an array of typed specs', async function () {
      const cluster = await connect('couchbase://127.0.0.1');
      const collection = cluster.bucket('test').defaultCollection();

      const result = await collection.mutateIn('test__document', [
        mutationSpec<TestDoc2>().upsert('title', 'new title'),
        mutationSpec<TestDoc2>().insert('metadata.modifiedBy', 'me'),
        mutationSpec<TestDoc2>().increment('sales[0]', 1),
      ]);

      expectTypeOf(result).toEqualTypeOf<
        MutateInResult<[undefined, undefined, number]>
      >();
    });
  });

  describe('User-defined ClusterTypes', function () {
    it("should accept any path of the collection's document and its matching value when given an array of typeless specs", async function () {
      const cluster = await connect<UserClusterTypes>('couchbase://127.0.0.1');
      const collection = cluster.bucket('test').defaultCollection();

      await collection.mutateIn('test__document', [
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
            MutateInSpec<TestDoc, CppProtocolSubdocOpcode.counter>,
            MutateInSpec<TestDoc, CppProtocolSubdocOpcode.remove>,
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

  describe('FuzzyDocument', function () {
    it('should detect fuzzy document', function () {
      expectTypeOf<IsFuzzyDocument<any>>().toEqualTypeOf<true>();
      expectTypeOf<IsFuzzyDocument<object>>().toEqualTypeOf<true>();
      expectTypeOf<IsFuzzyDocument<Record<string, unknown>>>().toEqualTypeOf<true>();
      expectTypeOf<IsFuzzyDocument<NonNullable<unknown>>>().toEqualTypeOf<true>();
      expectTypeOf<IsFuzzyDocument<{ [key: string]: string }>>().toEqualTypeOf<true>();
      expectTypeOf<
        IsFuzzyDocument<{ [key: string]: string; title: string }>
      >().toEqualTypeOf<true>();
    });

    it('should not have false positive', function () {
      expectTypeOf<IsFuzzyDocument<Record<'test', unknown>>>().toEqualTypeOf<false>();
      expectTypeOf<IsFuzzyDocument<unknown[]>>().toEqualTypeOf<false>();
      expectTypeOf<IsFuzzyDocument<string[]>>().toEqualTypeOf<false>();
      expectTypeOf<IsFuzzyDocument<{ title: string }>>().toEqualTypeOf<false>();
    });
  });
});
