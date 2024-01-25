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

import { connect } from '../../..';
import { BinaryCollection } from '../../../binarycollection';
import { Collection } from '../../../collection';
import { CollectionDocumentBag, DefaultClusterTypes, DocDef } from '../../clusterTypes';

describe('BinaryCollection', function () {
  describe('Default ClusterTypes', function () {
    it('should allow to manage a binary', async function () {
      const cluster = await connect('couchbase://127.0.0.1');
      const collection = cluster.bucket('test').defaultCollection();
      const binary = collection.binary();
      expectTypeOf(binary).toEqualTypeOf<
        BinaryCollection<
          Collection<
            DefaultClusterTypes,
            'test',
            '_default',
            '_default',
            CollectionDocumentBag<any>
          >
        >
      >();
    });

    it('should accept any value', async function () {
      const cluster = await connect('couchbase://127.0.0.1');
      const collection = cluster.bucket('test').defaultCollection();
      const binary = collection.binary();

      expectTypeOf(binary.increment).parameter(0).toEqualTypeOf<string>();
      expectTypeOf(binary.increment).parameter(1).toEqualTypeOf<number>();
      expectTypeOf(binary.decrement).parameter(0).toEqualTypeOf<string>();
      expectTypeOf(binary.decrement).parameter(1).toEqualTypeOf<number>();

      expectTypeOf(binary.append).parameter(0).toEqualTypeOf<string>();
      expectTypeOf(binary.append).parameter(1).toEqualTypeOf<string | Buffer>();
      expectTypeOf(binary.prepend).parameter(0).toEqualTypeOf<string>();
      expectTypeOf(binary.prepend).parameter(1).toEqualTypeOf<string | Buffer>();
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

    it('should allow to manage a binary only if the collection contains an array of the given type', async function () {
      const cluster = await connect<UserClusterTypes>('couchbase://127.0.0.1');

      const collectionOne = cluster.bucket('test').collection('collectionOne');
      const binaryOne = collectionOne.binary();
      expectTypeOf(binaryOne).toEqualTypeOf<
        BinaryCollection<
          Collection<
            DefaultClusterTypes,
            'test',
            '_default',
            'collectionOne',
            CollectionDocumentBag<DocDef<string, string>>
          >
        >
      >();

      const collectionThree = cluster.bucket('test').collection('collectionThree');
      const binaryThree = collectionThree.binary();
      expectTypeOf(binaryThree).toBeString();
    });
  });
});
