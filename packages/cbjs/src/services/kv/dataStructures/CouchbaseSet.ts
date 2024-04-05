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
import { CouchbaseClusterTypes, invariant, isArray } from '@cbjsdev/shared';

import { AnyCollection } from '../../../clusterTypes/clusterTypes';
import type { Collection } from '../../../collection';
import { CouchbaseError, PathExistsError } from '../../../errors';
import { StoreSemantics } from '../../../generaltypes';
import { LookupInSpec, MutateInSpec } from '../../../sdspecs';
import {
  type NodeCallback,
  PromiseHelper,
  type VoidNodeCallback,
} from '../../../utilities';

/**
 * CouchbaseSet provides a simplified interface for storing a set
 * within a Couchbase document.
 *
 * @see {Collection.set}
 * @category Datastructures
 */
export class CouchbaseSet<
  T extends CouchbaseClusterTypes,
  C extends Collection<T, any, any, any>,
  Key extends string,
  Item,
> {
  private _coll: AnyCollection;
  private _key: string;

  /**
   * @internal
   */
  constructor(collection: C, key: Key) {
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
      for (const value of values) {
        if (value === item) {
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
          if (!isArray(res.content)) {
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

      if (res.content[0].error) {
        throw res.content[0].error;
      }

      return res.content[0].value;
    }, callback);
  }
}
