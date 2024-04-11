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
import { DefaultClusterTypes, DocDef } from '@cbjsdev/shared';
import { describe, expectTypeOf, it } from 'vitest';

import { Collection, connect, CouchbaseList } from '../../..';

describe('CouchbaseList', function () {
  describe('Default ClusterTypes', function () {
    it('should allow to manage a list', async function () {
      const cluster = await connect('couchbase://127.0.0.1');
      const collection = cluster.bucket('test').defaultCollection();
      const list = collection.list('docKey');
      expectTypeOf(list).toEqualTypeOf<
        CouchbaseList<
          DefaultClusterTypes,
          Collection<DefaultClusterTypes, 'test', '_default', '_default'>,
          'docKey',
          any
        >
      >();
    });

    it('should accept any value', async function () {
      const cluster = await connect('couchbase://127.0.0.1');
      const collection = cluster.bucket('test').defaultCollection();
      const list = collection.list('docKey');
      expectTypeOf(list.push).parameter(0).toEqualTypeOf<any>();
      expectTypeOf(list.unshift).parameter(0).toEqualTypeOf<any>();
      expectTypeOf(list.indexOf).parameter(0).toEqualTypeOf<any>();
    });

    it('should represent an array of any', async function () {
      const cluster = await connect('couchbase://127.0.0.1');
      const collection = cluster.bucket('test').defaultCollection();
      const list = collection.list('docKey');
      expectTypeOf(list.getAll).returns.resolves.toEqualTypeOf<any[]>();
      expectTypeOf(list.getAt).returns.resolves.toEqualTypeOf<any>();
      expectTypeOf(list.forEach).parameter(0).parameter(0).toEqualTypeOf<any>();
    });
  });

  describe('User-defined ClusterTypes', function () {
    type UserClusterTypes = {
      test: {
        _default: {
          collectionOne: [ DocDef<string, string> ];
          collectionTwo: [ DocDef<string, string[]> ];
          collectionThree: [
            DocDef<`book::${number}`, { title: string }>,
            DocDef<`author::${number}`, string[]>,
            DocDef<`sales::${number}`, number[]>,
          ];
        };
      };
    };

    it('should allow to manage a list only if the collection contains an array of the given type', async function () {
      const cluster = await connect<UserClusterTypes>('couchbase://127.0.0.1');

      const collectionOne = cluster.bucket('test').collection('collectionOne');
      // @ts-expect-error Invalid doc key
      collectionOne.list('wrongKey');

      const collectionTwo = cluster.bucket('test').collection('collectionTwo');
      const listTwo = collectionTwo.list('anything');
      expectTypeOf(listTwo).toEqualTypeOf<
        CouchbaseList<
          UserClusterTypes,
          Collection<UserClusterTypes, 'test', '_default', 'collectionTwo'>,
          'anything',
          string
        >
      >();

      const collectionThree = cluster.bucket('test').collection('collectionThree');
      const listThree = collectionThree.list('author::001');
      expectTypeOf(listThree).toEqualTypeOf<
        CouchbaseList<
          UserClusterTypes,
          Collection<UserClusterTypes, 'test', '_default', 'collectionThree'>,
          'author::001',
          string
        >
      >();
    });

    it('should accept value matching the type of the list', async function () {
      const cluster = await connect<UserClusterTypes>('couchbase://127.0.0.1');
      const collectionTwo = cluster.bucket('test').collection('collectionTwo');
      const list = collectionTwo.list('docKey');

      expectTypeOf(list.push).parameter(0).toEqualTypeOf<string>();
      expectTypeOf(list.unshift).parameter(0).toEqualTypeOf<string>();
      expectTypeOf(list.indexOf).parameter(0).toEqualTypeOf<string>();
    });

    it('should represent an array of the item type', async function () {
      const cluster = await connect<UserClusterTypes>('couchbase://127.0.0.1');
      const collectionTwo = cluster.bucket('test').collection('collectionTwo');
      const list = collectionTwo.list('docKey');

      expectTypeOf(list.getAll).returns.resolves.toEqualTypeOf<string[]>();
      expectTypeOf(list.getAt).returns.resolves.toEqualTypeOf<string>();
      expectTypeOf(list.forEach).parameter(0).parameter(0).toEqualTypeOf<string>();
    });
  });
});
