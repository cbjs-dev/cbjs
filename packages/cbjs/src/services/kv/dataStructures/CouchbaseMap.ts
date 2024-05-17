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
  invariant,
  type MapEntry,
  ScopeName,
} from '@cbjsdev/shared';

import { ExtractCollectionJsonDocKey } from '../../../clusterTypes/clusterTypes.js';
import { AnyCollection } from '../../../clusterTypes/index.js';
import { Collection } from '../../../collection.js';
import { CouchbaseError } from '../../../errors.js';
import { StoreSemantics } from '../../../generaltypes.js';
import { LookupInSpec, MutateInSpec } from '../../../sdspecs.js';
import {
  type NodeCallback,
  PromiseHelper,
  type VoidNodeCallback,
} from '../../../utilities.js';

/**
 * CouchbaseMap provides a simplified interface for storing a map
 * within a Couchbase document.
 *
 * @see {@link Collection.map}
 * @category Datastructures
 */
export class CouchbaseMap<
  T extends CouchbaseClusterTypes,
  B extends BucketName<T>,
  S extends ScopeName<T, B>,
  C extends CollectionName<T, B, S>,
  Key extends ExtractCollectionJsonDocKey<Collection<T, B, S, C>>,
  MapDoc extends Record<string, unknown>,
> {
  private _coll: AnyCollection;
  private _key: Key;

  /**
   * @internal
   */
  constructor(collection: Collection<T, B, S, C>, key: Key) {
    this._coll = collection;
    this._key = key;
  }

  private async _get(): Promise<MapDoc> {
    const doc = await this._coll.get(this._key);
    const content = doc.content as MapDoc;

    if (!(content instanceof Object)) {
      throw new CouchbaseError('expected document of object type');
    }

    return content;
  }

  /**
   * Returns an object representing all items in the map.
   *
   * @param callback A node-style callback to be invoked after execution.
   */
  async getAll(callback?: NodeCallback<MapDoc>): Promise<MapDoc> {
    return await PromiseHelper.wrapAsync(async () => {
      return await this._get();
    }, callback);
  }

  /**
   * Iterates through every item in the map.
   *
   * @param rowCallback A callback invoked for each item in the list.
   * @param callback A node-style callback to be invoked after execution.
   */
  async forEach(
    rowCallback: (value: MapDoc[keyof MapDoc], key: keyof MapDoc, map: this) => void,
    callback?: VoidNodeCallback
  ): Promise<void> {
    return await PromiseHelper.wrapAsync(async () => {
      const values = await this._get();
      for (const i in values) {
        rowCallback(values[i], i, this);
      }
    }, callback);
  }

  /**
   * Provides the ability to async-for loop this object.
   */
  [Symbol.asyncIterator](): AsyncIterator<MapEntry<MapDoc>> {
    const getNext = async () => this._get();

    type LocalIterator = {
      data: MapDoc | null;
      keys: (keyof MapDoc)[] | null;
      index: number;
    } & AsyncIterator<MapEntry<MapDoc>>;

    return {
      data: null,
      keys: null,
      index: -1,
      async next(this: LocalIterator) {
        if (this.index < 0) {
          this.data = await getNext();
          this.keys = Object.keys(this.data);
          this.index = 0;
        }

        invariant(this.data);
        invariant(this.keys);

        if (this.index < this.keys.length) {
          const key = this.keys[this.index++];
          return { done: false, value: [this.data[key], key] as MapEntry<MapDoc> };
        }

        return { done: true, value: undefined };
      },
    } as AsyncIterator<MapEntry<MapDoc>>;
  }

  /**
   * Sets a specific to the specified value in the map.
   *
   * @param item The key in the map to set.
   * @param value The new value to set.
   * @param callback A node-style callback to be invoked after execution.
   */
  async set<Item extends keyof MapDoc>(
    item: Item,
    value: MapDoc[Item],
    callback?: VoidNodeCallback
  ): Promise<void> {
    return await PromiseHelper.wrapAsync(async () => {
      await this._coll
        .mutateIn(this._key, {
          storeSemantics: StoreSemantics.Upsert,
        })
        .upsert(item as never, value as never);
    }, callback);
  }

  /**
   * Fetches a specific key from the map.
   *
   * @param itemKey The key in the map to retrieve.
   * @param callback A node-style callback to be invoked after execution.
   */
  async get<ItemKey extends keyof MapDoc & string>(
    itemKey: ItemKey,
    callback?: NodeCallback<MapDoc[ItemKey]>
  ): Promise<MapDoc[ItemKey]> {
    return await PromiseHelper.wrapAsync(async () => {
      const res = await this._coll.lookupIn(this._key, [LookupInSpec.get(itemKey)]);

      const itemRes = res.content[0];

      if (itemRes.error !== null || itemRes.value === undefined) {
        throw new CouchbaseError(
          `key is missing from the map`,
          itemRes.error ?? undefined,
          {
            docKey: this._key,
            mapKey: itemKey,
          }
        );
      }

      return itemRes.value as MapDoc[ItemKey];
    }, callback);
  }

  /**
   * Removes a specific key from the map.
   *
   * @param item The key in the map to remove.
   * @param callback A node-style callback to be invoked after execution.
   */
  async remove<ItemKey extends keyof MapDoc & string>(
    item: ItemKey,
    callback?: VoidNodeCallback
  ): Promise<void> {
    return await PromiseHelper.wrapAsync(async () => {
      const specs = [MutateInSpec.remove(item as never)];
      await this._coll.mutateIn<Key, Record<ItemKey, unknown>, typeof specs>(
        this._key,
        specs
      );
    }, callback);
  }

  /**
   * Checks whether a specific key exists in the map.
   *
   * @param item The key in the map to search for.
   * @param callback A node-style callback to be invoked after execution.
   */
  async exists<Key extends keyof MapDoc>(
    item: Key,
    callback?: NodeCallback<boolean>
  ): Promise<boolean> {
    return await PromiseHelper.wrapAsync(async () => {
      const res = await this._coll.lookupIn(this._key, [
        LookupInSpec.exists(item as string),
      ]);

      if (res.content[0].error) {
        throw res.content[0].error;
      }

      const itemRes = res.content[0];
      return itemRes.value;
    }, callback);
  }

  /**
   * Returns a list of all the keys which exist in the map.
   *
   * @param callback A node-style callback to be invoked after execution.
   */
  async keys(callback?: NodeCallback<Array<keyof MapDoc>>): Promise<Array<keyof MapDoc>> {
    return await PromiseHelper.wrapAsync(async () => {
      const values = await this._get();
      return Object.keys(values) as Array<keyof MapDoc>;
    }, callback);
  }

  /**
   * Returns a list of all the values which exist in the map.
   *
   * @param callback A node-style callback to be invoked after execution.
   */
  async values(
    callback?: NodeCallback<Array<MapDoc[keyof MapDoc]>>
  ): Promise<Array<MapDoc[keyof MapDoc]>> {
    return await PromiseHelper.wrapAsync(async () => {
      const values = await this._get();
      return Object.values(values) as Array<MapDoc[keyof MapDoc]>;
    }, callback);
  }

  /**
   * Returns the number of items that exist in the map.
   *
   * @param callback A node-style callback to be invoked after execution.
   */
  async size(callback?: NodeCallback<number>): Promise<number> {
    return await PromiseHelper.wrapAsync(async () => {
      const res = await this._coll.lookupIn(this._key, [LookupInSpec.count('')]);

      if (res.content[0].error) {
        throw res.content[0].error;
      }

      return res.content[0].value;
    }, callback);
  }
}
