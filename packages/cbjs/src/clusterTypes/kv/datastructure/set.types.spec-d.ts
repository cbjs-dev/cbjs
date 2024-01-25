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

import { connect, DefaultClusterTypes } from '../../..';
import { Collection } from '../../../collection';
import { CouchbaseSet } from '../../../datastructures';
import { CollectionDocumentBag, DocDef } from '../../clusterTypes';

describe('CouchbaseSet', function () {
  describe('Default ClusterTypes', function () {
    it('should allow to manage a set', async function () {
      const cluster = await connect('couchbase://127.0.0.1');
      const collection = cluster.bucket('test').defaultCollection();
      const set = collection.set('docKey');
      expectTypeOf(set).toEqualTypeOf<
        CouchbaseSet<
          Collection<
            DefaultClusterTypes,
            'test',
            '_default',
            '_default',
            CollectionDocumentBag<any>
          >,
          any
        >
      >();
    });

    it('should accept any value', async function () {
      const cluster = await connect('couchbase://127.0.0.1');
      const collection = cluster.bucket('test').defaultCollection();
      const set = collection.set('docKey');
      expectTypeOf(set.add).parameter(0).toEqualTypeOf<any>();
    });

    it('should represent an array of any', async function () {
      const cluster = await connect('couchbase://127.0.0.1');
      const collection = cluster.bucket('test').defaultCollection();
      const set = collection.set('docKey');
      expectTypeOf(set.values).returns.resolves.toEqualTypeOf<any[]>();
    });
  });

  describe('User-defined ClusterTypes', function () {
    type UserClusterTypes = {
      test: {
        _default: {
          collectionOne: DocDef<string, string>;
          collectionTwo: DocDef<string, string[]>;
          collectionThree: DocDef<string, number[]>;
        };
      };
    };

    it('should allow to manage a set only if the collection contains an array of the given type', async function () {
      const cluster = await connect<UserClusterTypes>('couchbase://127.0.0.1');

      const collectionOne = cluster.bucket('test').collection('collectionOne');
      // @ts-expect-error Invalid doc key
      collectionOne.set('docKey');

      const collectionTwo = cluster.bucket('test').collection('collectionTwo');
      const setTwo = collectionTwo.set('docKey');
      expectTypeOf(setTwo).toEqualTypeOf<
        CouchbaseSet<
          Collection<
            UserClusterTypes,
            'test',
            '_default',
            'collectionTwo',
            CollectionDocumentBag<DocDef<string, string[]>>
          >,
          string
        >
      >();
    });

    it('should accept value matching the type of the set', async function () {
      const cluster = await connect<UserClusterTypes>('couchbase://127.0.0.1');
      const collectionTwo = cluster.bucket('test').collection('collectionTwo');
      const set = collectionTwo.set('docKey');
      expectTypeOf(set.add).parameter(0).toEqualTypeOf<string>();
    });

    it('should represent an array of the item type', async function () {
      const cluster = await connect<UserClusterTypes>('couchbase://127.0.0.1');
      const collectionTwo = cluster.bucket('test').collection('collectionTwo');
      const set = collectionTwo.set('docKey');
      expectTypeOf(set.values).returns.resolves.toEqualTypeOf<string[]>();
    });
  });
});
