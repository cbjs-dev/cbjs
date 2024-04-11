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

import { Collection, connect, CouchbaseMap } from '../../..';

describe('CouchbaseMap', function () {
  describe('Default ClusterTypes', function () {
    it('should allow to manage a map', async function () {
      const cluster = await connect('couchbase://127.0.0.1');
      const collection = cluster.bucket('test').defaultCollection();
      const map = collection.map('docKey');
      expectTypeOf(map).toEqualTypeOf<
        CouchbaseMap<
          DefaultClusterTypes,
          Collection<DefaultClusterTypes, 'test', '_default', '_default'>,
          'docKey',
          Record<string, any>
        >
      >();
    });

    it('should accept any key & value', async function () {
      const cluster = await connect('couchbase://127.0.0.1');
      const collection = cluster.bucket('test').defaultCollection();
      const map = collection.map('docKey');

      expectTypeOf(map.set).parameter(0).toEqualTypeOf<string>();
      expectTypeOf(map.set).parameter(1).toEqualTypeOf<any>();
    });

    it('should represent an record of string keys and any values', async function () {
      const cluster = await connect('couchbase://127.0.0.1');
      const collection = cluster.bucket('test').defaultCollection();
      const map = collection.map('docKey');
      expectTypeOf(map.getAll).returns.resolves.toEqualTypeOf<Record<string, any>>();
      expectTypeOf(map.values).returns.resolves.toEqualTypeOf<any[]>();
      expectTypeOf(map.keys).returns.resolves.toEqualTypeOf<string[]>();
      expectTypeOf(map.get).returns.resolves.toEqualTypeOf<any>();

      expectTypeOf(map.exists).parameter(0).toEqualTypeOf<string>();
      expectTypeOf(map.remove).parameter(0).toEqualTypeOf<string>();
      expectTypeOf(map.get).parameter(0).toEqualTypeOf<string>();
      expectTypeOf(map.forEach).parameter(0).parameter(0).toEqualTypeOf<any>();
      expectTypeOf(map.forEach).parameter(0).parameter(1).toEqualTypeOf<string>();
    });
  });

  describe('User-defined ClusterTypes', function () {
    type UserMap = Record<'keyOne' | 'keyTwo', string | number>;
    type UserClusterTypes = {
      test: {
        _default: {
          collectionOne: [ DocDef<string, string> ];
          collectionTwo: [ DocDef<string, UserMap> ];
        };
      };
    };

    it('should allow to manage a map only if the collection contains an array of the given type', async function () {
      const cluster = await connect<UserClusterTypes>('couchbase://127.0.0.1');

      const collectionOne = cluster.bucket('test').collection('collectionOne');
      // @ts-expect-error Invalid doc key
      collectionOne.map('docKey');

      const collectionTwo = cluster.bucket('test').collection('collectionTwo');
      const mapTwo = collectionTwo.map('docKey');
      expectTypeOf(mapTwo).toEqualTypeOf<
        CouchbaseMap<
          UserClusterTypes,
          Collection<UserClusterTypes, 'test', '_default', 'collectionTwo'>,
          'docKey',
          UserMap
        >
      >();
    });

    it('should accept value matching the type of the map', async function () {
      const cluster = await connect<UserClusterTypes>('couchbase://127.0.0.1');
      const collectionTwo = cluster.bucket('test').collection('collectionTwo');
      const map = collectionTwo.map('docKey');

      expectTypeOf(map.set).parameter(0).toEqualTypeOf<'keyOne' | 'keyTwo'>();
      expectTypeOf(map.set).parameter(1).toEqualTypeOf<string | number>();
    });

    it('should represent the record defines by the user', async function () {
      const cluster = await connect<UserClusterTypes>('couchbase://127.0.0.1');
      const collectionTwo = cluster.bucket('test').collection('collectionTwo');
      const map = collectionTwo.map('docKey');

      expectTypeOf(map.getAll).returns.resolves.toEqualTypeOf<UserMap>();
      expectTypeOf(map.values).returns.resolves.toEqualTypeOf<Array<string | number>>();
      expectTypeOf(map.keys).returns.resolves.toEqualTypeOf<Array<'keyOne' | 'keyTwo'>>();
      expectTypeOf(map.get).returns.resolves.toEqualTypeOf<string | number>();

      expectTypeOf(map.get).parameter(0).toEqualTypeOf<'keyOne' | 'keyTwo'>();
      expectTypeOf(map.exists).parameter(0).toEqualTypeOf<'keyOne' | 'keyTwo'>();
      expectTypeOf(map.remove).parameter(0).toEqualTypeOf<'keyOne' | 'keyTwo'>();
      expectTypeOf(map.forEach)
        .parameter(0)
        .parameter(0)
        .toEqualTypeOf<string | number>();
      expectTypeOf(map.forEach)
        .parameter(0)
        .parameter(1)
        .toEqualTypeOf<'keyOne' | 'keyTwo'>();
    });
  });
});
