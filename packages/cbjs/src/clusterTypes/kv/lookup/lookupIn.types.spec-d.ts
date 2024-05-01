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

import { ClusterTypes, DocDef } from '@cbjsdev/shared';

import {
  connect,
  LookupInMacro,
  LookupInReplicaResult,
  LookupInResultEntry,
} from '../../../index.js';
import { CppProtocolSubdocOpcode } from '../../../binding.js';
import { LookupInResult } from '../../../crudoptypes.js';
import { LookupInSpec } from '../../../sdspecs.js';
import { lookupSpec, LookupSpecs } from '../../../specBuilders.js';
import {
  LookupInInternalPath,
  LookupInResultEntries,
  LookupInSpecOpCode,
  LookupInSpecResult,
  LookupInSpecResults,
} from './lookupIn.types.js';
import { LookupInMacroDocument } from './lookupInMacro.types.js';

describe('LookupInSpecs', () => {
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

  type UserClusterTypes = ClusterTypes<{
    test: {
      _default: {
        _default: [DocDef<string, TestDoc>, DocDef<string, TestDoc2>];
      };
      testScope: {
        testCollection: [DocDef<string, TestDoc>, DocDef<string, TestDoc2>];
      };
    };
  }>;

  describe('lookupIn', () => {
    describe('Default ClusterTypes', () => {
      it('should infer the result type from an array of typeless specs with `any` for get operations', async () => {
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

        await collection.lookupIn(
          'test__document',
          [
            LookupInSpec.get('title'),
            LookupInSpec.get('does_not_exists'),
            LookupInSpec.count('metadata.tags'),
            LookupInSpec.exists('metadata.tags[0]'),
          ],
          { timeout: 200 }
        );

        await collection.lookupIn(
          'test__document',
          [
            LookupInSpec.get('title'),
            LookupInSpec.get('does_not_exists'),
            LookupInSpec.count('metadata.tags'),
            LookupInSpec.exists('metadata.tags[0]'),
          ],
          (err, res) => {
            if (err) return;
          }
        );

        await collection.lookupIn(
          'test__document',
          [
            LookupInSpec.get('title'),
            LookupInSpec.get('does_not_exists'),
            LookupInSpec.count('metadata.tags'),
            LookupInSpec.exists('metadata.tags[0]'),
          ],
          { timeout: 200 },
          (err, res) => {
            if (err) return;
          }
        );

        await collection
          .lookupIn('test__document')
          .get('title')
          .exists('does_not_exists')
          .count('metadata.tags');

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

      it('should infer the result type from an array of typed specs', async () => {
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

      it('should infer the result type from an array of specs built with typed makers', async () => {
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
    });

    describe('User-defined ClusterTypes', () => {
      it('should validate the path given to typeless spec based on collection documents', async () => {
        const cluster = await connect<UserClusterTypes>('couchbase://127.0.0.1');
        const collection = cluster.bucket('test').defaultCollection();

        await collection.lookupIn('test__document', [
          LookupInSpec.get('title'),
          // @ts-expect-error Invalid path throughout all the documents of the collection
          LookupInSpec.get('does_not_exists'),
          // @ts-expect-error Invalid path throughout all the documents of the collection
          LookupInSpec.exists('does_not_exists'),
          // @ts-expect-error Invalid path throughout all the documents of the collection
          LookupInSpec.count('does_not_exists'),
        ]);

        await collection.lookupIn(
          'test__document',
          [
            LookupInSpec.get('title'),
            // @ts-expect-error Invalid path throughout all the documents of the collection
            LookupInSpec.get('does_not_exists'),
            // @ts-expect-error Invalid path throughout all the documents of the collection
            LookupInSpec.exists('does_not_exists'),
            // @ts-expect-error Invalid path throughout all the documents of the collection
            LookupInSpec.count('does_not_exists'),
          ],
          { timeout: 200 }
        );

        await collection.lookupIn(
          'test__document',
          [
            LookupInSpec.get('title'),
            // @ts-expect-error Invalid path throughout all the documents of the collection
            LookupInSpec.get('does_not_exists'),
            // @ts-expect-error Invalid path throughout all the documents of the collection
            LookupInSpec.exists('does_not_exists'),
            // @ts-expect-error Invalid path throughout all the documents of the collection
            LookupInSpec.count('does_not_exists'),
          ],
          (err, res) => {
            if (err) return;
          }
        );

        await collection.lookupIn(
          'test__document',
          [
            LookupInSpec.get('title'),
            // @ts-expect-error Invalid path throughout all the documents of the collection
            LookupInSpec.get('does_not_exists'),
          ],
          { timeout: 200 },
          (err, res) => {
            if (err) return;
          }
        );

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

      it('should infer the result type of an array of typeless specs based on collection documents', async () => {
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

      it('should validate the path of the specs carried by an instance of a typeless Specs', async () => {
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

      it('should infer the result type from an array built with lookupSpec()', async () => {
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

  describe('LookupInSpecResult', () => {
    type Test<
      Path extends LookupInInternalPath<TestDoc, Opcode>,
      Opcode extends LookupInSpecOpCode,
    > = LookupInSpecResult<LookupInSpec<TestDoc, Opcode, Path>, never>;

    it('should infer the correct type', () => {
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

  describe('LookupInSpecResults', () => {
    it('should infer the correct result when using user defined document', () => {
      expectTypeOf<
        LookupInSpecResults<
          [
            LookupInSpec<TestDoc, CppProtocolSubdocOpcode.get, 'title'>,
            LookupInSpec<TestDoc, CppProtocolSubdocOpcode.exists, 'title'>,
            LookupInSpec<TestDoc, CppProtocolSubdocOpcode.get_count, 'metadata'>,
            LookupInSpec<TestDoc, CppProtocolSubdocOpcode.get, 'metadata.tags[99]'>,
          ],
          TestDoc | TestDoc2
        >
      >().toEqualTypeOf<[string, boolean, number, string | undefined]>();
    });

    it('should provide best-effort when using collection documents', () => {
      expectTypeOf<
        LookupInSpecResults<
          [
            LookupInSpec<object, CppProtocolSubdocOpcode.get, 'title'>,
            LookupInSpec<object, CppProtocolSubdocOpcode.exists, 'title'>,
            LookupInSpec<object, CppProtocolSubdocOpcode.get_count, 'metadata'>,
          ],
          TestDoc | TestDoc2
        >
      >().toEqualTypeOf<[string | number, boolean, number]>();
    });

    it('should fallback to `any` when using efault cluster types', () => {
      expectTypeOf<
        LookupInSpecResults<
          [
            LookupInSpec<object, CppProtocolSubdocOpcode.get, 'title'>,
            LookupInSpec<object, CppProtocolSubdocOpcode.exists, 'title'>,
            LookupInSpec<object, CppProtocolSubdocOpcode.get_count, 'metadata'>,
          ],
          any
        >
      >().toEqualTypeOf<[any, boolean, number]>();
    });
  });

  describe('LookupInSpec - legacy', () => {
    describe('LookupInSpec.get', () => {
      it('should return correct type', () => {
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

    describe('LookupInSpec.count', () => {
      it('should return correct type', () => {
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

    describe('LookupInSpec.exists', () => {
      it('should return correct type', () => {
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

  describe('LookupInResultEntries', () => {
    it('should infer the array of result', () => {
      expectTypeOf<
        LookupInResultEntries<[string, number, boolean], false>
      >().toEqualTypeOf<
        [
          LookupInResultEntry<string, null> | LookupInResultEntry<undefined, Error>,
          LookupInResultEntry<number, null> | LookupInResultEntry<undefined, Error>,
          LookupInResultEntry<boolean, null> | LookupInResultEntry<undefined, Error>,
        ]
      >();

      expectTypeOf<LookupInResultEntries<boolean[], false>>().toEqualTypeOf<
        Array<LookupInResultEntry<boolean, null> | LookupInResultEntry<undefined, Error>>
      >();
    });

    it('should exclude `undefined` from the union types when ThrowOnSpecError is true', () => {
      expectTypeOf<LookupInResultEntries<[string | undefined], true>>().toEqualTypeOf<
        [LookupInResultEntry<string, null>]
      >();
    });
  });
});
