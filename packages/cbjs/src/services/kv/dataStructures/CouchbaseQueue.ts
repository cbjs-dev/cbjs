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
import {
  BucketName,
  CollectionName,
  CouchbaseClusterTypes,
  DocDefMatchingBody,
  ScopeName,
} from '@cbjsdev/shared';

import type { Collection } from '../../../collection.js';
import { CouchbaseError, PathInvalidError } from '../../../errors.js';
import { StoreSemantics } from '../../../generaltypes.js';
import { LookupInSpec, MutateInSpec } from '../../../sdspecs.js';
import {
  type NodeCallback,
  PromiseHelper,
  type VoidNodeCallback,
} from '../../../utilities.js';

/**
 * CouchbaseQueue provides a simplified interface for storing a queue
 * within a Couchbase document.
 *
 * @see {@link Collection.queue}
 * @category Datastructures
 */
export class CouchbaseQueue<
  T extends CouchbaseClusterTypes,
  B extends BucketName<T>,
  S extends ScopeName<T, B>,
  C extends CollectionName<T, B, S>,
  Key extends DocDefMatchingBody<ReadonlyArray<Item>, T, B, S, C>['Key'],
  Item,
> {
  private _coll: Collection<T, B, S, C>;
  private _key: Key;

  /**
   * @internal
   */
  constructor(collection: Collection<T, B, S, C>, key: Key) {
    this._coll = collection;
    this._key = key;
  }

  /**
   * Returns the number of items in the queue.
   *
   * @param callback A node-style callback to be invoked after execution.
   */
  async size(callback?: NodeCallback<number>): Promise<number> {
    return await PromiseHelper.wrapAsync(async () => {
      const res = await this._coll.lookupIn(this._key as never, [
        LookupInSpec.count('') as never,
      ]);

      if (res.content[0].error) {
        throw res.content[0].error;
      }

      return res.content[0].value;
    }, callback);
  }

  /**
   * Adds a new item to the back of the queue.
   *
   * @param value The value to add.
   * @param callback A node-style callback to be invoked after execution.
   */
  async push(value: Item, callback?: VoidNodeCallback): Promise<void> {
    return await PromiseHelper.wrapAsync(async () => {
      await this._coll.mutateIn(
        this._key as never,
        [MutateInSpec.arrayPrepend('', value) as never],
        {
          storeSemantics: StoreSemantics.Upsert,
        }
      );
    }, callback);
  }

  /**
   * Removes an item from the front of the queue.
   *
   * @param callback A node-style callback to be invoked after execution.
   */
  async pop(callback?: NodeCallback<Item>): Promise<Item> {
    return await PromiseHelper.wrapAsync(async () => {
      for (let i = 0; i < 16; ++i) {
        try {
          const res = await this._coll.lookupIn(this._key as never, [
            LookupInSpec.get('[-1]') as never,
          ]);

          const value = res.content[0].value;
          const specs = [MutateInSpec.remove('[-1]' as never)];

          await this._coll.mutateIn(this._key as never, specs, {
            cas: res.cas,
          });

          return value as Item;
        } catch (e) {
          if (e instanceof PathInvalidError) {
            throw new CouchbaseError('no items available in list');
          }

          // continue and retry
        }
      }

      throw new CouchbaseError('no items available to pop');
    }, callback);
  }
}
