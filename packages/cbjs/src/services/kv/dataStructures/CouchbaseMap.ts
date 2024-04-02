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
import { CollectionDocumentBag, DocDef, invariant, type MapEntry } from '@cbjsdev/shared';

import {
  CollectionContaining,
  ValidateCollectionContainsAll,
} from '../../../clusterTypes/clusterTypes';
import type { Collection } from '../../../collection';
import { CouchbaseError } from '../../../errors';
import { StoreSemantics } from '../../../generaltypes';
import { LookupInSpec, MutateInSpec } from '../../../sdspecs';
import {
  type NodeCallback,
  PromiseHelper,
  type VoidNodeCallback,
} from '../../../utilities';

/**
 * CouchbaseMap provides a simplified interface for storing a map
 * within a Couchbase document.
 *
 * @see {@link Collection.map}
 * @category Datastructures
 */
export class CouchbaseMap<
  C extends Collection<any, any, any, any, CollectionDocumentBag<DocDef<string, MapDoc>>>,
  MapDoc extends Record<string, unknown>,
> {
  private _coll: CollectionContaining<DocDef<string, Record<string, unknown>>>;
  private _key: string;

  /**
   * @internal
   */
  constructor(collection: ValidateCollectionContainsAll<C, MapDoc>, key: string) {
    this._coll = collection;
    this._key = key;
  }

  private async _get(): Promise<MapDoc> {
    const doc = await this._coll.get(this._key);
    if (!(doc.content instanceof Object)) {
      throw new CouchbaseError('expected document of object type');
    }

    return doc.content as MapDoc;
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
  async set<Key extends keyof MapDoc>(
    item: Key,
    value: MapDoc[Key],
    callback?: VoidNodeCallback
  ): Promise<void> {
    return await PromiseHelper.wrapAsync(async () => {
      await this._coll.mutateIn(this._key, [MutateInSpec.upsert(item as string, value)], {
        storeSemantics: StoreSemantics.Upsert,
      });
    }, callback);
  }

  /**
   * Fetches a specific key from the map.
   *
   * @param item The key in the map to retrieve.
   * @param callback A node-style callback to be invoked after execution.
   */
  async get<Key extends keyof MapDoc>(
    item: Key,
    callback?: NodeCallback<MapDoc[Key]>
  ): Promise<MapDoc[Key]> {
    return await PromiseHelper.wrapAsync(async () => {
      const res = await this._coll.lookupIn(this._key, [
        LookupInSpec.get(item as string),
      ]);

      const itemRes = res.content[0];

      if (itemRes.error ?? itemRes.value === undefined) {
        throw new CouchbaseError(
          `key is missing from the map`,
          itemRes.error ?? undefined,
          {
            docKey: this._key,
            mapKey: item,
          }
        );
      }

      return itemRes.value as MapDoc[Key];
    }, callback);
  }

  /**
   * Removes a specific key from the map.
   *
   * @param item The key in the map to remove.
   * @param callback A node-style callback to be invoked after execution.
   */
  async remove<Key extends keyof MapDoc>(
    item: Key,
    callback?: VoidNodeCallback
  ): Promise<void> {
    return await PromiseHelper.wrapAsync(async () => {
      await this._coll.mutateIn(this._key, [MutateInSpec.remove(item as string)]);
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
