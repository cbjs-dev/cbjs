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
  CollectionContaining,
  CollectionDocumentBag,
  DocDef,
  ValidateCollectionContainsAll,
} from './clusterTypes/clusterTypes';
import { Collection } from './collection';
import { CouchbaseError, PathExistsError, PathInvalidError } from './errors';
import { StoreSemantics } from './generaltypes';
import { LookupInSpec, MutateInSpec } from './sdspecs';
import { NodeCallback, PromiseHelper, VoidNodeCallback } from './utilities';
import { invariant } from '@cbjs/shared';

/**
 * CouchbaseList provides a simplified interface for storing lists
 * within a Couchbase document.
 *
 * @see {@link Collection.list}
 * @category Datastructures
 */
export class CouchbaseList<
  C extends Collection<any, any, any, any, CollectionDocumentBag<DocDef<string, Item[]>>>,
  Item
> {
  private _coll: CollectionContaining<DocDef<string, unknown[]>>;
  private _key: string;

  /**
   * @internal
   */
  constructor(collection: ValidateCollectionContainsAll<C, Item[]>, key: string) {
    this._coll = collection;
    this._key = key;
  }

  private async _get(): Promise<Item[]> {
    const doc = await this._coll.get(this._key);
    if (!(doc.content instanceof Array)) {
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
        rowCallback(values[i] as Item, i, this);
      }
    }, callback);
  }

  /**
   * Provides the ability to async-for loop this object.
   */
  [Symbol.asyncIterator](): AsyncIterator<Item> {
    const getNext = async () => this._get();
    return {
      data: null as null | Item[],
      index: -1,
      async next() {
        if (this.index < 0) {
          this.data = await getNext();
          this.index = 0;
        }

        const data = this.data as Item[];
        if (this.index < data.length) {
          return { done: false, value: data[this.index++] };
        }

        return { done: true };
      },
    } as any;
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
        LookupInSpec.get(('[' + index + ']') as `[${number}]`),
      ]);

      const itemRes = res.content[0];
      if (itemRes.error || itemRes.value === undefined) {
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
        MutateInSpec.remove(('[' + index + ']') as `[${number}]`),
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
      const res = await this._coll.lookupIn(this._key, [LookupInSpec.count('')]);
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
      await this._coll.mutateIn(this._key, [MutateInSpec.arrayAppend('', value)], {
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
      await this._coll.mutateIn(this._key, [MutateInSpec.arrayPrepend('', value)], {
        storeSemantics: StoreSemantics.Upsert,
      });
    }, callback);
  }
}

/**
 * CouchbaseMap provides a simplified interface for storing a map
 * within a Couchbase document.
 *
 * @see {@link Collection.map}
 * @category Datastructures
 */
export class CouchbaseMap<
  C extends Collection<any, any, any, any, CollectionDocumentBag<DocDef<string, MapDoc>>>,
  MapDoc extends Record<string, unknown>
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
  [Symbol.asyncIterator](): AsyncIterator<[MapDoc[keyof MapDoc], string]> {
    const getNext = async () => this._get();
    return {
      data: null as { [key: string]: any } | null,
      keys: null as string[] | null,
      index: -1,
      async next() {
        if (this.index < 0) {
          this.data = await getNext();
          this.keys = Object.keys(this.data);
          this.index = 0;
        }

        const keys = this.keys as string[];
        const data = this.data as { [key: string]: any };
        if (this.index < keys.length) {
          const key = keys[this.index++];
          return { done: false, value: [data[key], key] };
        }

        return { done: true, value: undefined };
      },
    } as any;
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

      if (itemRes.error || itemRes.value === undefined) {
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
      return res.content[0].value;
    }, callback);
  }
}

/**
 * CouchbaseQueue provides a simplified interface for storing a queue
 * within a Couchbase document.
 *
 * @see {@link Collection.queue}
 * @category Datastructures
 */
export class CouchbaseQueue<
  C extends Collection<any, any, any, any, CollectionDocumentBag<DocDef<string, Item[]>>>,
  Item
> {
  private _coll: CollectionContaining<DocDef<string, unknown[]>>;
  private _key: string;

  /**
   * @internal
   */
  constructor(collection: ValidateCollectionContainsAll<C, Item[]>, key: string) {
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
      const res = await this._coll.lookupIn(this._key, [LookupInSpec.count('')]);
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
      await this._coll.mutateIn(this._key, [MutateInSpec.arrayPrepend('', value)], {
        storeSemantics: StoreSemantics.Upsert,
      });
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
          const res = await this._coll.lookupIn(this._key, [LookupInSpec.get('[-1]')]);

          const value = res.content[0].value;

          await this._coll.mutateIn(this._key, [MutateInSpec.remove('[-1]')], {
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

/**
 * CouchbaseSet provides a simplified interface for storing a set
 * within a Couchbase document.
 *
 * @see {@link Collection.set}
 * @category Datastructures
 */
export class CouchbaseSet<
  C extends Collection<any, any, any, any, CollectionDocumentBag<DocDef<string, Item[]>>>,
  Item
> {
  private _coll: CollectionContaining<DocDef<string, unknown[]>>;
  private _key: string;

  /**
   * @internal
   */
  constructor(collection: ValidateCollectionContainsAll<C, Item[]>, key: string) {
    this._coll = collection;
    this._key = key;
  }

  private async _get(): Promise<Item[]> {
    const doc = await this._coll.get(this._key);
    if (!(doc.content instanceof Array)) {
      throw new CouchbaseError('expected document of array type');
    }

    return doc.content as Item[];
  }

  /**
   * Adds a new item to the set.
   * Returns whether the item already existed in the set or not.
   *
   * @param item The item to add.
   * @param callback A node-style callback to be invoked after execution.
   */
  async add(item: Item, callback?: NodeCallback<boolean>): Promise<boolean> {
    return await PromiseHelper.wrapAsync(async () => {
      try {
        await this._coll.mutateIn(this._key, [MutateInSpec.arrayAddUnique('', item)], {
          storeSemantics: StoreSemantics.Upsert,
        });
      } catch (e) {
        if (e instanceof PathExistsError) {
          return false;
        }

        throw e;
      }

      return true;
    }, callback);
  }

  /**
   * Returns whether a specific value already exists in the set.
   *
   * @param item The value to search for.
   * @param callback A node-style callback to be invoked after execution.
   */
  async contains(item: Item, callback?: NodeCallback<boolean>): Promise<boolean> {
    return await PromiseHelper.wrapAsync(async () => {
      const values = await this._get();
      for (let i = 0; i < values.length; ++i) {
        if (values[i] === item) {
          return true;
        }
      }
      return false;
    }, callback);
  }

  /**
   * Removes a specific value from the set.
   *
   * @param item The value to remove.
   * @param callback A node-style callback to be invoked after execution.
   */
  async remove(item: Item, callback?: VoidNodeCallback): Promise<void> {
    return await PromiseHelper.wrapAsync(async () => {
      let lastError: CouchbaseError | undefined = undefined;

      for (let i = 0; i < 16; ++i) {
        try {
          const res = await this._coll.get(this._key);
          if (!(res.content instanceof Array)) {
            throw new CouchbaseError('expected document of array type');
          }

          const itemIdx = res.content.indexOf(item);
          if (itemIdx === -1) {
            throw new CouchbaseError('item was not found in set');
          }

          await this._coll.mutateIn(
            this._key,
            [MutateInSpec.remove(('[' + itemIdx + ']') as `[${number}]`)],
            {
              cas: res.cas,
            }
          );

          return;
        } catch (e) {
          invariant(e instanceof CouchbaseError);
          lastError = e;
          // continue and retry
        }
      }

      throw lastError;
    }, callback);
  }

  /**
   * Returns a list of all values in the set.
   *
   * @param callback A node-style callback to be invoked after execution.
   */
  async values(callback?: NodeCallback<Item[]>): Promise<Item[]> {
    return await PromiseHelper.wrapAsync(async () => {
      return await this._get();
    }, callback);
  }

  /**
   * Returns the number of elements in this set.
   *
   * @param callback A node-style callback to be invoked after execution.
   */
  async size(callback?: NodeCallback<number>): Promise<number> {
    return await PromiseHelper.wrapAsync(async () => {
      const res = await this._coll.lookupIn(this._key, [LookupInSpec.count('')]);
      return res.content[0].value;
    }, callback);
  }
}
