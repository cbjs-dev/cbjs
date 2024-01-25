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

import {
  LookupInMacro,
  LookupInReplicaResult,
  LookupInResultEntry,
  connect,
} from '../../..';
import { CppProtocolSubdocOpcode } from '../../../binding';
import { LookupInResult } from '../../../crudoptypes';
import { LookupInSpec } from '../../../sdspecs';
import { LookupSpecs, lookupSpec } from '../../../specBuilders';
import { DocDef } from '../../clusterTypes';
import {
  LookupInInternalPath,
  LookupInResultEntries,
  LookupInSpecOpCode,
  LookupInSpecResult,
  LookupInSpecResults,
} from './lookupIn.types';
import { LookupInMacroDocument } from './lookupInMacro.types';

describe('LookupInSpecs', function () {
  type TestDoc = {
    title: string;
    metadata: {
      tags: string[];
    };
    authors: [string, ...string[]];
  };

  type TestDoc2 = {
    title: number;
    metadata: {
      sales: number[];
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

  describe('lookupIn', function () {
    describe('Default ClusterTypes', function () {
      it('should infer the result type from an array of typeless specs with `any` for get operations', async function () {
        const cluster = await connect('couchbase://127.0.0.1');
        const collection = cluster.bucket('test').defaultCollection();

        const result = await collection.lookupIn('test__document', [
          LookupInSpec.get('title'),
          LookupInSpec.get('does_not_exists'),
          LookupInSpec.count('metadata.tags'),
          LookupInSpec.exists('metadata.tags[0]'),
        ]);

        expectTypeOf(result).toEqualTypeOf<
          LookupInResult<readonly [any, any, number, boolean]>
        >();

        const resultInAnyReplica = await collection.lookupInAnyReplica('test__document', [
          LookupInSpec.get('title'),
          LookupInSpec.get('does_not_exists'),
          LookupInSpec.count('metadata.tags'),
          LookupInSpec.exists('metadata.tags[0]'),
        ]);

        expectTypeOf(resultInAnyReplica).toEqualTypeOf<
          LookupInReplicaResult<readonly [any, any, number, boolean]>
        >();

        const resultInAllReplica = await collection.lookupInAllReplicas(
          'test__document',
          [
            LookupInSpec.get('title'),
            LookupInSpec.get('does_not_exists'),
            LookupInSpec.count('metadata.tags'),
            LookupInSpec.exists('metadata.tags[0]'),
          ]
        );

        expectTypeOf(resultInAllReplica).toEqualTypeOf<
          Array<LookupInReplicaResult<readonly [any, any, number, boolean]>>
        >();
      });

      it('should infer the result type from an array of typed specs', async function () {
        const cluster = await connect('couchbase://127.0.0.1');
        const collection = cluster.bucket('test').defaultCollection();

        const result = await collection.lookupIn('test__document', [
          LookupInSpec.get<TestDoc, 'title'>('title'),
          LookupInSpec.get('does_not_exists'),
          LookupInSpec.count('metadata.tags'),
          LookupInSpec.exists('metadata.tags[0]'),
        ]);

        expectTypeOf(result).toEqualTypeOf<
          LookupInResult<readonly [string, any, number, boolean]>
        >();

        const resultInAnyReplica = await collection.lookupInAnyReplica('test__document', [
          LookupInSpec.get<TestDoc, 'title'>('title'),
          LookupInSpec.get('does_not_exists'),
          LookupInSpec.count('metadata.tags'),
          LookupInSpec.exists('metadata.tags[0]'),
        ]);

        expectTypeOf(resultInAnyReplica).toEqualTypeOf<
          LookupInReplicaResult<readonly [string, any, number, boolean]>
        >();

        const resultInAllReplica = await collection.lookupInAllReplicas(
          'test__document',
          [
            LookupInSpec.get<TestDoc, 'title'>('title'),
            LookupInSpec.get('does_not_exists'),
            LookupInSpec.count('metadata.tags'),
            LookupInSpec.exists('metadata.tags[0]'),
          ]
        );

        expectTypeOf(resultInAllReplica).toEqualTypeOf<
          Array<LookupInReplicaResult<readonly [string, any, number, boolean]>>
        >();
      });

      it('should infer the result type from an array of specs built with typed makers', async function () {
        const cluster = await connect('couchbase://127.0.0.1');
        const collection = cluster.bucket('test').defaultCollection();

        const result = await collection.lookupIn('test__document', [
          lookupSpec<TestDoc>().get('title'),
          lookupSpec<TestDoc>().count('metadata.tags'),
          lookupSpec<TestDoc>().exists('metadata.tags[0]'),
        ]);

        expectTypeOf(result).toEqualTypeOf<
          LookupInResult<readonly [string, number, boolean]>
        >();

        const resultInAnyReplica = await collection.lookupInAnyReplica('test__document', [
          lookupSpec<TestDoc>().get('title'),
          lookupSpec<TestDoc>().count('metadata.tags'),
          lookupSpec<TestDoc>().exists('metadata.tags[0]'),
        ]);

        expectTypeOf(resultInAnyReplica).toEqualTypeOf<
          LookupInReplicaResult<readonly [string, number, boolean]>
        >();

        const resultInAllReplica = await collection.lookupInAllReplicas(
          'test__document',
          [
            lookupSpec<TestDoc>().get('title'),
            lookupSpec<TestDoc>().count('metadata.tags'),
            lookupSpec<TestDoc>().exists('metadata.tags[0]'),
          ]
        );

        expectTypeOf(resultInAllReplica).toEqualTypeOf<
          Array<LookupInReplicaResult<readonly [string, number, boolean]>>
        >();
      });

      it('should infer the result type from an instance of LookupSpecs', async function () {
        const cluster = await connect('couchbase://127.0.0.1');
        const collection = cluster.bucket('test').defaultCollection();

        // const result = await collection.lookupIn('test__document',
        //   LookupSpecs.for<TestDoc>().get('title').count('metadata.tags').exists('metadata.tags[0]')
        // );
        //
        // expectTypeOf(result).toEqualTypeOf<LookupInResult<readonly [string, number, boolean]>>();
      });
    });

    describe('User-defined ClusterTypes', function () {
      it('should validate the path given to typeless spec based on collection documents', async function () {
        const cluster = await connect<UserClusterTypes>('couchbase://127.0.0.1');
        const collection = cluster.bucket('test').defaultCollection();

        await collection.lookupIn('test__document', [
          LookupInSpec.get('title'),
          // @ts-expect-error Invalid path throughout all the documents of the collection
          LookupInSpec.get('does_not_exists'),
        ]);

        await collection.lookupInAnyReplica('test__document', [
          LookupInSpec.get('title'),
          // @ts-expect-error Invalid path throughout all the documents of the collection
          LookupInSpec.get('does_not_exists'),
        ]);

        await collection.lookupInAllReplicas('test__document', [
          LookupInSpec.get('title'),
          // @ts-expect-error Invalid path throughout all the documents of the collection
          LookupInSpec.get('does_not_exists'),
        ]);
      });

      it('should infer the result type of an array of typeless specs based on collection documents', async function () {
        const cluster = await connect<UserClusterTypes>('couchbase://127.0.0.1');
        const collection = cluster.bucket('test').defaultCollection();

        const result = await collection.lookupIn('test__document', [
          LookupInSpec.get('title'),
          LookupInSpec.count('metadata.tags'),
          LookupInSpec.exists('metadata.tags[0]'),
        ]);

        expectTypeOf(result).toEqualTypeOf<
          LookupInResult<readonly [string | number, number, boolean]>
        >();

        const resultInAnyReplica = await collection.lookupInAnyReplica('test__document', [
          LookupInSpec.get('title'),
          LookupInSpec.count('metadata.tags'),
          LookupInSpec.exists('metadata.tags[0]'),
        ]);

        expectTypeOf(resultInAnyReplica).toEqualTypeOf<
          LookupInReplicaResult<readonly [string | number, number, boolean]>
        >();

        const resultInAllReplica = await collection.lookupInAllReplicas(
          'test__document',
          [
            LookupInSpec.get('title'),
            LookupInSpec.count('metadata.tags'),
            LookupInSpec.exists('metadata.tags[0]'),
          ]
        );

        expectTypeOf(resultInAllReplica).toEqualTypeOf<
          Array<LookupInReplicaResult<readonly [string | number, number, boolean]>>
        >();
      });

      it('should validate the path of the specs carried by an instance of a typeless Specs', async function () {
        const cluster = await connect<UserClusterTypes>('couchbase://127.0.0.1');
        const collection = cluster.bucket('test').defaultCollection();

        await collection.lookupIn(
          'test__document',
          // @ts-expect-error Specs contains an illegal path
          LookupSpecs.for().get('title').get('does_not_exists')
        );

        await collection.lookupInAnyReplica(
          'test__document',
          // @ts-expect-error Specs contains an illegal path
          LookupSpecs.for().get('title').get('does_not_exists')
        );

        await collection.lookupInAllReplicas(
          'test__document',
          // @ts-expect-error Specs contains an illegal path
          LookupSpecs.for().get('title').get('does_not_exists')
        );
      });

      it('should infer the result type of a Specs instance', async function () {
        const cluster = await connect<UserClusterTypes>('couchbase://127.0.0.1');
        const collection = cluster.bucket('test').defaultCollection();

        // const result = await collection.lookupIn('test__document',
        //   LookupSpecs.for<TestDoc>().get('title').count('metadata.tags').exists('metadata.tags[0]')
        // );
        //
        // expectTypeOf(result).toEqualTypeOf<LookupInResult<readonly [string, number, boolean]>>();
      });

      it('should infer the result type from an array built with makeLookupInSpec()', async function () {
        const cluster = await connect<UserClusterTypes>('couchbase://127.0.0.1');
        const collection = cluster.bucket('test').defaultCollection();

        const result = await collection.lookupIn('test__document', [
          lookupSpec<TestDoc>().get('title'),
          lookupSpec<TestDoc>().count('metadata.tags'),
          lookupSpec<TestDoc>().exists('metadata.tags[0]'),
        ]);

        expectTypeOf(result).toEqualTypeOf<
          LookupInResult<readonly [string, number, boolean]>
        >();

        const resultInAnyReplica = await collection.lookupInAnyReplica('test__document', [
          lookupSpec<TestDoc>().get('title'),
          lookupSpec<TestDoc>().count('metadata.tags'),
          lookupSpec<TestDoc>().exists('metadata.tags[0]'),
        ]);

        expectTypeOf(resultInAnyReplica).toEqualTypeOf<
          LookupInReplicaResult<readonly [string, number, boolean]>
        >();

        const resultInAllReplica = await collection.lookupInAllReplicas(
          'test__document',
          [
            lookupSpec<TestDoc>().get('title'),
            lookupSpec<TestDoc>().count('metadata.tags'),
            lookupSpec<TestDoc>().exists('metadata.tags[0]'),
          ]
        );

        expectTypeOf(resultInAllReplica).toEqualTypeOf<
          Array<LookupInReplicaResult<readonly [string, number, boolean]>>
        >();
      });
    });
  });

  describe('LookupInSpecResult', function () {
    type Test<
      Path extends LookupInInternalPath<TestDoc, Opcode>,
      Opcode extends LookupInSpecOpCode
    > = LookupInSpecResult<LookupInSpec<TestDoc, Opcode, Path>, never>;

    type P = LookupInInternalPath<TestDoc, CppProtocolSubdocOpcode.get_count>;

    it('should infer the correct type', function () {
      expectTypeOf<
        Test<'$document', CppProtocolSubdocOpcode.get>
      >().toEqualTypeOf<LookupInMacroDocument>();
      expectTypeOf<Test<'metadata.tags', CppProtocolSubdocOpcode.get>>().toEqualTypeOf<
        string[]
      >();
      expectTypeOf<Test<'', CppProtocolSubdocOpcode.get_doc>>().toEqualTypeOf<TestDoc>();

      expectTypeOf<
        Test<'$document', CppProtocolSubdocOpcode.get_count>
      >().toEqualTypeOf<number>();
      expectTypeOf<
        Test<'metadata.tags', CppProtocolSubdocOpcode.get_count>
      >().toEqualTypeOf<number>();
      expectTypeOf<Test<'', CppProtocolSubdocOpcode.get_count>>().toEqualTypeOf<number>();

      expectTypeOf<
        Test<'$document', CppProtocolSubdocOpcode.exists>
      >().toEqualTypeOf<boolean>();
      expectTypeOf<
        Test<'metadata.tags', CppProtocolSubdocOpcode.exists>
      >().toEqualTypeOf<boolean>();
      // @ts-expect-error Invalid path
      expectTypeOf<Test<'', CppProtocolSubdocOpcode.exists>>().toEqualTypeOf<boolean>();
    });
  });

  describe('LookupInSpecResults', function () {
    it('should infer the correct result when using user defined document', function () {
      expectTypeOf<
        LookupInSpecResults<
          [
            LookupInSpec<TestDoc, CppProtocolSubdocOpcode.get, 'title'>,
            LookupInSpec<TestDoc, CppProtocolSubdocOpcode.exists, 'title'>,
            LookupInSpec<TestDoc, CppProtocolSubdocOpcode.get_count, 'metadata'>,
            LookupInSpec<TestDoc, CppProtocolSubdocOpcode.get, 'metadata.tags[99]'>
          ],
          TestDoc | TestDoc2
        >
      >().toEqualTypeOf<readonly [string, boolean, number, string | undefined]>();
    });

    it('should provide best-effort when using collection documents', function () {
      expectTypeOf<
        LookupInSpecResults<
          [
            LookupInSpec<object, CppProtocolSubdocOpcode.get, 'title'>,
            LookupInSpec<object, CppProtocolSubdocOpcode.exists, 'title'>,
            LookupInSpec<object, CppProtocolSubdocOpcode.get_count, 'metadata'>
          ],
          TestDoc | TestDoc2
        >
      >().toEqualTypeOf<readonly [string | number, boolean, number]>();
    });

    it('should fallback to `any` when using efault cluster types', function () {
      expectTypeOf<
        LookupInSpecResults<
          [
            LookupInSpec<object, CppProtocolSubdocOpcode.get, 'title'>,
            LookupInSpec<object, CppProtocolSubdocOpcode.exists, 'title'>,
            LookupInSpec<object, CppProtocolSubdocOpcode.get_count, 'metadata'>
          ],
          any
        >
      >().toEqualTypeOf<readonly [any, boolean, number]>();
    });
  });

  describe('LookupInSpec - legacy', function () {
    describe('LookupInSpec.get', function () {
      it('should return correct type', function () {
        expectTypeOf(LookupInSpec.get('')).toEqualTypeOf<
          LookupInSpec<object, CppProtocolSubdocOpcode.get_doc, ''>
        >();
        expectTypeOf(LookupInSpec.get('title')).toEqualTypeOf<
          LookupInSpec<object, CppProtocolSubdocOpcode.get, 'title'>
        >();
        expectTypeOf(LookupInSpec.get(LookupInMacro.Expiry)).toEqualTypeOf<
          LookupInSpec<object, CppProtocolSubdocOpcode.get, '$document.exptime'>
        >();
      });
    });

    describe('LookupInSpec.count', function () {
      it('should return correct type', function () {
        expectTypeOf(LookupInSpec.count('')).toEqualTypeOf<
          LookupInSpec<object, CppProtocolSubdocOpcode.get_count, ''>
        >();
        expectTypeOf(LookupInSpec.count('title')).toEqualTypeOf<
          LookupInSpec<object, CppProtocolSubdocOpcode.get_count, 'title'>
        >();

        // @ts-expect-error Cannot receive a macro
        expectTypeOf(LookupInSpec.count(LookupInMacro.Expiry)).toEqualTypeOf<
          LookupInSpec<object, CppProtocolSubdocOpcode.get_count, never>
        >();
      });
    });

    describe('LookupInSpec.exists', function () {
      it('should return correct type', function () {
        expectTypeOf(LookupInSpec.exists('')).toEqualTypeOf<
          LookupInSpec<object, CppProtocolSubdocOpcode.exists, ''>
        >();
        expectTypeOf(LookupInSpec.exists('title')).toEqualTypeOf<
          LookupInSpec<object, CppProtocolSubdocOpcode.exists, 'title'>
        >();
        expectTypeOf(LookupInSpec.exists(LookupInMacro.Expiry)).toEqualTypeOf<
          LookupInSpec<object, CppProtocolSubdocOpcode.exists, '$document.exptime'>
        >();
      });
    });
  });

  describe('LookupInResultEntries', function () {
    it('should infer the array of result', function () {
      expectTypeOf<LookupInResultEntries<[string, number, boolean]>>().toEqualTypeOf<
        readonly [
          LookupInResultEntry<string>,
          LookupInResultEntry<number>,
          LookupInResultEntry<boolean>
        ]
      >();

      expectTypeOf<LookupInResultEntries<boolean[]>>().toEqualTypeOf<
        LookupInResultEntry<boolean>[]
      >();
    });
  });
});
