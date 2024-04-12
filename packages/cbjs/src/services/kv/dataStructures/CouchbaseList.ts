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
  invariant,
  isArray,
  ScopeName,
} from '@cbjsdev/shared';
import type { Collection } from '../../../collection';
import { LookupInResultEntry } from '../../../crudoptypes';
import { CouchbaseError } from '../../../errors';
import { StoreSemantics } from '../../../generaltypes';
import { LookupInSpec, MutateInSpec } from '../../../sdspecs';
import { type NodeCallback, PromiseHelper, type VoidNodeCallback } from '../../../utilities';

/**
 * CouchbaseList provides a simplified interface for storing lists
 * within a Couchbase document.
 *
 * @see {@link Collection.list}
 * @category Datastructures
 */
export class CouchbaseList<
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

  private async _get(): Promise<Item[]> {
    const doc = await this._coll.get(this._key);
    if (!isArray(doc.content)) {
      throw new CouchbaseError('expected document of array type');
    }

    return doc.content as Item[];
  }

  /**
   * Returns the entire list of items in this list.
   *
   * @param callback A node-style callback to be invoked after execution.
   */
  async getAll(callback?: NodeCallback<Item[]>): Promise<Item[]> {
    return await PromiseHelper.wrapAsync(async () => {
      return await this._get();
    }, callback);
  }

  /**
   * Iterates each item in the list.
   *
   * @param rowCallback A callback invoked for each item in the list.
   * @param callback A node-style callback to be invoked after execution.
   */
  async forEach(
    rowCallback: (value: Item, index: number, array: this) => void,
    callback?: VoidNodeCallback
  ): Promise<void> {
    return await PromiseHelper.wrapAsync(async () => {
      const values = await this._get();
      for (let i = 0; i < values.length; ++i) {
        rowCallback(values[i], i, this);
      }
    }, callback);
  }

  /**
   * Provides the ability to async-for loop this object.
   */
  [Symbol.asyncIterator](): AsyncIterator<Item> {
    const getNext = async () => this._get();

    type LocalIterator = {
      data: Item[] | null;
      index: number;
    } & AsyncIterator<Item>;

    return {
      data: null,
      index: -1,
      async next(this: LocalIterator) {
        if (this.index < 0) {
          this.data = await getNext();
          this.index = 0;
        }

        invariant(this.data);

        if (this.index < this.data.length) {
          return { done: false, value: this.data[this.index++] };
        }

        return { done: true };
      },
    } as AsyncIterator<Item>;
  }

  /**
   * Retrieves the item at a specific index in the list.
   *
   * @param index The index to retrieve.
   * @param callback A node-style callback to be invoked after execution.
   */
  async getAt(index: number, callback?: NodeCallback<Item>): Promise<Item> {
    return await PromiseHelper.wrapAsync(async () => {
      const res = await this._coll.lookupIn(this._key, [
        LookupInSpec.get('[' + index + ']') as never,
      ]);

      const itemRes = res.content[0] as LookupInResultEntry;
      if (itemRes.error !== null || itemRes.value === undefined) {
        throw new CouchbaseError(
          `index is missing from the list`,
          itemRes.error ?? undefined,
          {
            docKey: this._key,
            index: index,
          }
        );
      }

      return itemRes.value as Item;
    }, callback);
  }

  /**
   * Removes an item at a specific index from the list.
   *
   * @param index The index to remove.
   * @param callback A node-style callback to be invoked after execution.
   */
  async removeAt(index: number, callback?: VoidNodeCallback): Promise<void> {
    return await PromiseHelper.wrapAsync(async () => {
      await this._coll.mutateIn(this._key, [
        MutateInSpec.remove('[' + index + ']') as never,
      ]);
    }, callback);
  }

  /**
   * Returns the index of a specific value from the list.
   *
   * @param value The value to search for.
   * @param callback A node-style callback to be invoked after execution.
   */
  async indexOf(value: Item, callback?: NodeCallback<number>): Promise<number> {
    return await PromiseHelper.wrapAsync(async () => {
      const items = await this._get();

      for (let i = 0; i < items.length; ++i) {
        if (items[i] === value) {
          return i;
        }
      }

      return -1;
    }, callback);
  }

  /**
   * Returns the number of items in the list.
   *
   * @param callback A node-style callback to be invoked after execution.
   */
  async size(callback?: NodeCallback<number>): Promise<number> {
    return await PromiseHelper.wrapAsync(async () => {
      const res = await this._coll.lookupIn(this._key, [LookupInSpec.count('') as never]);

      if (res.content[0].error) {
        throw res.content[0].error;
      }

      return res.content[0].value;
    }, callback);
  }

  /**
   * Adds a new item to the end of the list.
   *
   * @param value The value to add.
   * @param callback A node-style callback to be invoked after execution.
   */
  async push(value: Item, callback?: VoidNodeCallback): Promise<void> {
    return await PromiseHelper.wrapAsync(async () => {
      await this._coll.mutateIn(this._key, [MutateInSpec.arrayAppend('', value) as never], {
        storeSemantics: StoreSemantics.Upsert,
      });
    }, callback);
  }

  /**
   * Adds a new item to the beginning of the list.
   *
   * @param value The value to add.
   * @param callback A node-style callback to be invoked after execution.
   */
  async unshift(value: Item, callback?: VoidNodeCallback): Promise<void> {
    return await PromiseHelper.wrapAsync(async () => {
      await this._coll.mutateIn(this._key, [MutateInSpec.arrayPrepend('', value) as never], {
        storeSemantics: StoreSemantics.Upsert,
      });
    }, callback);
  }
}
