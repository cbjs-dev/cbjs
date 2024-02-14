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
  CppTopologyCollectionsManifestCollection,
  CppTopologyCollectionsManifestScope,
} from './binding';
import { errorFromCpp } from './bindingutilities';
import { Bucket } from './bucket';
import { BucketName, CouchbaseClusterTypes } from './clusterTypes';
import { NodeCallback, PromiseHelper, VoidNodeCallback } from './utilities';

/**
 * Provides options for configuring a collection.
 *
 * @category Management
 */
export interface ICollectionSpec {
  /**
   * The name of the collection.
   */
  name: string;

  /**
   * The name of the scope containing this collection.
   */
  scopeName: string;

  /**
   * The maximum expiry for documents in this collection.
   *
   * @see {@link IBucketSettings.maxExpiry}
   */
  maxExpiry?: number;

  /**
   * The history retention override setting in this collection.
   * Only supported on Magma Buckets.
   *
   * @see {@link StorageBackend.Magma}.
   */
  history?: boolean;
}

/**
 * Contains information about a collection.
 *
 * @category Management
 */
export class CollectionSpec {
  /**
   * The name of the collection.
   */
  name: string;

  /**
   * The name of the scope this collection exists in.
   */
  scopeName: string;

  /**
   * The maximum expiry for documents in this collection.
   *
   * @see {@link IBucketSettings.maxExpiry}
   */
  maxExpiry: number;

  /**
   * The history retention override setting in this collection.
   * Only supported on Magma Buckets.
   *
   * @see {@link StorageBackend.Magma}.
   */
  history?: boolean;

  /**
   * @internal
   */
  constructor(data: CollectionSpec) {
    this.name = data.name;
    this.scopeName = data.scopeName;
    this.maxExpiry = data.maxExpiry;
    this.history = data.history;
  }

  /**
   * @internal
   */
  static _fromCppData(
    scopeName: string,
    data: CppTopologyCollectionsManifestCollection
  ): CollectionSpec {
    return new CollectionSpec({
      name: data.name,
      scopeName: scopeName,
      maxExpiry: data.max_expiry,
      history: data.history,
    });
  }
}

/**
 * Contains information about a scope.
 *
 * @category Management
 */
export class ScopeSpec {
  /**
   * The name of the scope.
   */
  name: string;

  /**
   * The collections which exist in this scope.
   */
  collections: CollectionSpec[];

  /**
   * @internal
   */
  constructor(data: ScopeSpec) {
    this.name = data.name;
    this.collections = data.collections;
  }

  /**
   * @internal
   */
  static _fromCppData(data: CppTopologyCollectionsManifestScope): ScopeSpec {
    let collections: CollectionSpec[];
    if (data.collections.length > 0) {
      const scopeName = data.name;
      collections = data.collections.map(
        (collectionData: CppTopologyCollectionsManifestCollection) =>
          CollectionSpec._fromCppData(scopeName, collectionData)
      );
    } else {
      collections = [];
    }

    return new ScopeSpec({
      name: data.name,
      collections: collections,
    });
  }
}

/**
 * The settings to use when creating the collection.
 *
 * @category Management
 */
export interface CreateCollectionSettings {
  /**
   * The maximum expiry for documents in this collection.
   *
   * @see IBucketSettings.maxExpiry
   */
  maxExpiry?: number;

  /**
   * The history retention override setting in this collection.
   * Only supported on Magma Buckets.
   *
   * @see StorageBackend.Magma
   */
  history?: boolean;
}

/**
 * The settings which should be updated on the collection.
 *
 * @category Management
 */
export interface UpdateCollectionSettings {
  /**
   * The maximum expiry for documents in this collection.
   *
   * @see IBucketSettings.maxExpiry
   */
  maxExpiry?: number;

  /**
   * The history retention override setting in this collection.
   * Only supported on Magma Buckets.
   *
   * @see StorageBackend.Magma.
   */
  history?: boolean;
}

/**
 * @category Management
 */
export interface CreateCollectionOptions {
  /**
   * The timeout for this operation, represented in milliseconds.
   */
  timeout?: number;
}

/**
 * @category Management
 */
export interface GetAllScopesOptions {
  /**
   * The timeout for this operation, represented in milliseconds.
   */
  timeout?: number;
}

/**
 * @category Management
 */
export interface DropCollectionOptions {
  /**
   * The timeout for this operation, represented in milliseconds.
   */
  timeout?: number;
}

/**
 * @category Management
 */
export interface CreateScopeOptions {
  /**
   * The timeout for this operation, represented in milliseconds.
   */
  timeout?: number;
}

/**
 * @category Management
 */
export interface DropScopeOptions {
  /**
   * The timeout for this operation, represented in milliseconds.
   */
  timeout?: number;
}

/**
 * @category Management
 */
export interface UpdateCollectionOptions {
  /**
   * The timeout for this operation, represented in milliseconds.
   */
  timeout?: number;
}

/**
 * CollectionManager allows the management of collections within a Bucket.
 *
 * @category Management
 */
export class CollectionManager<T extends CouchbaseClusterTypes, B extends BucketName<T>> {
  private _bucket: Bucket<T, B>;

  /**
   * @internal
   */
  constructor(bucket: Bucket<T, B>) {
    this._bucket = bucket;
  }

  private get _cluster() {
    return this._bucket.cluster;
  }

  async getAllScopes(callback?: NodeCallback<ScopeSpec[]>): Promise<ScopeSpec[]>;
  async getAllScopes(
    options: GetAllScopesOptions,
    callback?: NodeCallback<ScopeSpec[]>
  ): Promise<ScopeSpec[]>;

  /**
   * Returns all configured scopes along with their collections.
   *
   * @param options Optional parameters for this operation.
   * @param callback A node-style callback to be invoked after execution.
   */
  async getAllScopes(
    options?: GetAllScopesOptions | NodeCallback<ScopeSpec[]>,
    callback?: NodeCallback<ScopeSpec[]>
  ): Promise<ScopeSpec[]> {
    if (options instanceof Function) {
      callback = options;
      options = undefined;
    }
    if (!options) {
      options = {};
    }

    const bucketName = this._bucket.name;
    const timeout = options.timeout ?? this._cluster.managementTimeout;

    return PromiseHelper.wrap((wrapCallback) => {
      this._cluster.conn.managementScopeGetAll(
        {
          bucket_name: bucketName,
          timeout: timeout,
        },
        (cppErr, resp) => {
          const err = errorFromCpp(cppErr);
          if (err) {
            return wrapCallback(err, null);
          }

          const scopes = resp.manifest.scopes.map((scopeData) =>
            ScopeSpec._fromCppData(scopeData)
          );

          wrapCallback(null, scopes);
        }
      );
    }, callback);
  }

  async createCollection(
    collectionName: string,
    scopeName: string,
    options: CreateCollectionOptions,
    callback?: VoidNodeCallback
  ): Promise<void>;

  async createCollection(
    collectionName: string,
    scopeName: string,
    settings: CreateCollectionSettings,
    callback?: VoidNodeCallback
  ): Promise<void>;

  async createCollection(
    collectionName: string,
    scopeName: string,
    callback?: VoidNodeCallback
  ): Promise<void>;

  /**
   * Creates a collection in a scope.
   *
   * @param collectionName The name of the collection.
   * @param scopeName The name of the scope containing this collection.
   * @param settings The settings to use on creating the collection.
   * @param options Optional parameters for this operation.
   * @param callback A node-style callback to be invoked after execution.
   */
  async createCollection(
    collectionName: string,
    scopeName: string,
    settings: CreateCollectionSettings | undefined,
    options: CreateCollectionOptions | undefined,
    callback?: VoidNodeCallback
  ): Promise<void>;

  /**
   * Creates a collection in a scope.
   *
   * @param collectionSpec Specifies the settings for the new collection.
   * @param options Optional parameters for this operation.
   * @param callback A node-style callback to be invoked after execution.
   * @deprecated Use the other overload instead.
   */
  async createCollection(
    collectionSpec: ICollectionSpec,
    options: CreateCollectionOptions,
    callback?: VoidNodeCallback
  ): Promise<void>;

  async createCollection(
    collectionSpec: ICollectionSpec,
    callback?: VoidNodeCallback
  ): Promise<void>;

  /**
   * @internal
   */
  async createCollection(...args: never): Promise<void> {
    const { collectionName, scopeName, settings, options, callback } =
      resolveCreateCollectionArguments(args);

    const bucketName = this._bucket.name;
    const timeout = options.timeout ?? this._cluster.managementTimeout;
    const maxExpiry = settings.maxExpiry ?? 0;
    const history = settings.history ?? undefined;

    return PromiseHelper.wrap((wrapCallback) => {
      this._cluster.conn.managementCollectionCreate(
        {
          bucket_name: bucketName,
          scope_name: scopeName,
          collection_name: collectionName,
          max_expiry: maxExpiry,
          history: history,
          timeout: timeout,
        },
        (cppErr) => {
          const err = errorFromCpp(cppErr);
          if (err) {
            return wrapCallback(err);
          }

          wrapCallback(err);
        }
      );
    }, callback);
  }

  /**
   * Drops a collection from a scope.
   *
   * @param collectionName The name of the collection to drop.
   * @param scopeName The name of the scope containing the collection to drop.
   * @param options Optional parameters for this operation.
   * @param callback A node-style callback to be invoked after execution.
   */
  async dropCollection(
    collectionName: string,
    scopeName: string,
    options: DropCollectionOptions,
    callback?: VoidNodeCallback
  ): Promise<void>;
  async dropCollection(
    collectionName: string,
    scopeName: string,
    callback?: VoidNodeCallback
  ): Promise<void>;
  async dropCollection(
    collectionName: string,
    scopeName: string,
    options?: DropCollectionOptions | VoidNodeCallback,
    callback?: VoidNodeCallback
  ): Promise<void> {
    if (options instanceof Function) {
      callback = options;
      options = undefined;
    }
    if (!options) {
      options = {};
    }

    const bucketName = this._bucket.name;
    const timeout = options.timeout ?? this._cluster.managementTimeout;

    return PromiseHelper.wrap((wrapCallback) => {
      this._cluster.conn.managementCollectionDrop(
        {
          bucket_name: bucketName,
          scope_name: scopeName,
          collection_name: collectionName,
          timeout: timeout,
        },
        (cppErr) => {
          const err = errorFromCpp(cppErr);
          if (err) {
            return wrapCallback(err);
          }

          wrapCallback(err);
        }
      );
    }, callback);
  }

  /**
   * Updates a collection in a scope.
   *
   * @param collectionName The name of the collection to update.
   * @param scopeName The name of the scope containing the collection.
   * @param settings The settings to update on the collection.
   * @param options Optional parameters for this operation.
   * @param callback A node-style callback to be invoked after execution.
   */
  async updateCollection(
    collectionName: string,
    scopeName: string,
    settings: UpdateCollectionSettings,
    options: UpdateCollectionOptions,
    callback?: VoidNodeCallback
  ): Promise<void>;
  async updateCollection(
    collectionName: string,
    scopeName: string,
    settings: UpdateCollectionSettings,
    callback?: VoidNodeCallback
  ): Promise<void>;
  async updateCollection(
    collectionName: string,
    scopeName: string,
    settings: UpdateCollectionSettings,
    options?: UpdateCollectionOptions | VoidNodeCallback,
    callback?: VoidNodeCallback
  ): Promise<void> {
    if (options instanceof Function) {
      callback = options;
      options = undefined;
    }
    if (!options) {
      options = {};
    }

    const bucketName = this._bucket.name;
    const timeout = options.timeout ?? this._cluster.managementTimeout;

    return PromiseHelper.wrap((wrapCallback) => {
      this._cluster.conn.managementCollectionUpdate(
        {
          bucket_name: bucketName,
          scope_name: scopeName,
          collection_name: collectionName,
          max_expiry: settings.maxExpiry,
          history: settings.history,
          timeout: timeout,
        },
        (cppErr) => {
          const err = errorFromCpp(cppErr);
          if (err) {
            return wrapCallback(err);
          }
          wrapCallback(err);
        }
      );
    }, callback);
  }

  /**
   * Creates a new scope.
   *
   * @param scopeName The name of the new scope to create.
   * @param options Optional parameters for this operation.
   * @param callback A node-style callback to be invoked after execution.
   */
  async createScope(
    scopeName: string,
    options: CreateScopeOptions,
    callback?: VoidNodeCallback
  ): Promise<void>;
  async createScope(scopeName: string, callback?: VoidNodeCallback): Promise<void>;
  async createScope(
    scopeName: string,
    options?: CreateScopeOptions | VoidNodeCallback,
    callback?: VoidNodeCallback
  ): Promise<void> {
    if (options instanceof Function) {
      callback = options;
      options = undefined;
    }
    if (!options) {
      options = {};
    }

    const bucketName = this._bucket.name;
    const timeout = options.timeout ?? this._cluster.managementTimeout;

    return PromiseHelper.wrap((wrapCallback) => {
      this._cluster.conn.managementScopeCreate(
        {
          bucket_name: bucketName,
          scope_name: scopeName,
          timeout: timeout,
        },
        (cppErr) => {
          const err = errorFromCpp(cppErr);
          if (err) {
            return wrapCallback(err);
          }

          wrapCallback(err);
        }
      );
    }, callback);
  }

  /**
   * Drops a scope.
   *
   * @param scopeName The name of the scope to drop.
   * @param options Optional parameters for this operation.
   * @param callback A node-style callback to be invoked after execution.
   */
  async dropScope(
    scopeName: string,
    options: DropScopeOptions,
    callback?: VoidNodeCallback
  ): Promise<void>;
  async dropScope(scopeName: string, callback?: VoidNodeCallback): Promise<void>;
  async dropScope(
    scopeName: string,
    options?: DropScopeOptions | VoidNodeCallback,
    callback?: VoidNodeCallback
  ): Promise<void> {
    if (options instanceof Function) {
      callback = options;
      options = undefined;
    }
    if (!options) {
      options = {};
    }

    const bucketName = this._bucket.name;
    const timeout = options.timeout ?? this._cluster.managementTimeout;

    return PromiseHelper.wrap((wrapCallback) => {
      this._cluster.conn.managementScopeDrop(
        {
          bucket_name: bucketName,
          scope_name: scopeName,
          timeout: timeout,
        },
        (cppErr) => {
          const err = errorFromCpp(cppErr);
          if (err) {
            return wrapCallback(err);
          }

          wrapCallback(err);
        }
      );
    }, callback);
  }
}

const settingsProps = ['history', 'maxExpiry'];

function isCreateCollectionSettings(v: unknown): v is CreateCollectionSettings {
  if (typeof v !== 'object' || v === null) return false;
  const keys = Object.keys(v);
  if (keys.length === 0) return true;
  return Object.keys(v).some((k) => settingsProps.includes(k));
}

function isCreateCollectionOptions(v: unknown): v is CreateCollectionOptions {
  if (typeof v !== 'object' || v === null) return false;
  return !Object.keys(v).some((k) => settingsProps.includes(k));
}

function resolveCreateCollectionArguments(
  args:
    | [string, string, VoidNodeCallback?]
    | [string, string, CreateCollectionSettings, VoidNodeCallback?]
    | [string, string, CreateCollectionOptions, VoidNodeCallback?]
    | [
        string,
        string,
        CreateCollectionSettings | undefined,
        CreateCollectionOptions,
        VoidNodeCallback?,
      ]
    | [ICollectionSpec, VoidNodeCallback?]
    | [ICollectionSpec, CreateCollectionOptions, VoidNodeCallback?]
): {
  collectionName: string;
  scopeName: string;
  settings: CreateCollectionSettings;
  options: CreateCollectionOptions;
  callback?: VoidNodeCallback;
} {
  if (typeof args[0] === 'string') {
    let settings: CreateCollectionSettings = {};
    let options: CreateCollectionOptions = {};
    let callback: VoidNodeCallback | undefined = undefined;

    if (isCreateCollectionSettings(args[2])) {
      settings = args[2];
    }

    if (isCreateCollectionOptions(args[2])) {
      options = args[2];
    }

    if (isCreateCollectionOptions(args[3])) {
      options = args[3];
    }

    if (typeof args[args.length - 1] === 'function') {
      callback = args[args.length - 1] as VoidNodeCallback;
    }

    return {
      collectionName: args[0],
      scopeName: args[1] as string,
      settings,
      options,
      callback,
    };
  }

  // Legacy API
  const spec = args[0];
  const settings: CreateCollectionSettings = {
    maxExpiry: spec.maxExpiry,
    history: spec.history,
  };

  let options: CreateCollectionOptions = {};
  let callback: VoidNodeCallback | undefined = undefined;

  if (typeof args[1] === 'object') {
    options = args[1];
  }

  if (typeof args[args.length - 1] === 'function') {
    callback = args[args.length - 1] as VoidNodeCallback;
  }

  return {
    collectionName: spec.name,
    scopeName: spec.scopeName,
    settings,
    options,
    callback,
  };
}
