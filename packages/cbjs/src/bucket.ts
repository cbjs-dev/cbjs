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
  CouchbaseClusterTypes,
  DefaultClusterTypes,
  DefaultScopeCollectionName,
  DefaultScopeName,
  ScopeName,
} from '@cbjsdev/shared';

import { CppConnection } from './binding';
import { Cluster } from './cluster';
import { DefaultCollection, DefaultScope } from './clusterTypes/clusterTypes';
import { Collection } from './collection';
import { CollectionManager } from './collectionmanager';
import { PingExecutor } from './diagnosticsexecutor';
import { PingOptions, PingResult } from './diagnosticstypes';
import { Scope } from './scope';
import { StreamableRowPromise } from './streamablepromises';
import { Transcoder } from './transcoders';
import { NodeCallback, PromiseHelper } from './utilities';
import { ViewExecutor } from './viewexecutor';
import { ViewIndexManager } from './viewindexmanager';
import { ViewMetaData, ViewQueryOptions, ViewResult, ViewRow } from './viewtypes';

/**
 * Exposes the operations which are available to be performed against a bucket.
 * Namely the ability to access to Collections as well as performing management
 * operations against the bucket.
 *
 * @category Core
 */
export class Bucket<
  in out T extends CouchbaseClusterTypes = DefaultClusterTypes,
  in out B extends BucketName<T> = BucketName<T>,
> {
  readonly cluster: Cluster<T>;
  readonly name: B;
  readonly conn: CppConnection;

  /**
  @internal
  */
  constructor(cluster: Cluster<T>, bucketName: B) {
    this.cluster = cluster;
    this.name = bucketName;
    this.conn = cluster.conn;
  }

  /**
  @internal
  */
  get transcoder(): Transcoder {
    return this.cluster.transcoder;
  }

  /**
   * Creates a Scope object reference to a specific scope.
   *
   * @param scopeName The name of the scope to reference.
   */
  scope(scopeName: DefaultScopeName): DefaultScope<T, B>;
  scope<S extends ScopeName<T, B>>(scopeName: S): Scope<T, B, S>;
  scope<S extends ScopeName<T, B>>(scopeName: S): Scope<T, B, S> | DefaultScope<T, B> {
    return new Scope(this, scopeName);
  }

  /**
   * Creates a Scope object reference to the default scope.
   */
  defaultScope(): DefaultScope<T, B> {
    return this.scope(Scope.DEFAULT_NAME);
  }

  /**
   * Creates a Collection object reference to a specific collection.
   *
   * @param collectionName The name of the collection to reference.
   */
  collection<C extends DefaultScopeCollectionName<T, B>>(
    collectionName: C
  ): Collection<T, B, ScopeName<T, B> & DefaultScopeName, C> {
    const scope = this.defaultScope() as Scope<T, B, ScopeName<T, B> & DefaultScopeName>;
    return scope.collection(collectionName);
  }

  /**
   * Creates a Collection object reference to the default collection.
   */
  defaultCollection(): DefaultCollection<T, B> {
    return this.collection(
      '_default' as DefaultScopeCollectionName<T, B>
    ) as unknown as DefaultCollection<T, B>;
  }

  /**
   * Returns a ViewIndexManager which can be used to manage the view indexes
   * of this bucket.
   */
  viewIndexes(): ViewIndexManager<T, B> {
    return new ViewIndexManager(this);
  }

  /**
   * Returns a CollectionManager which can be used to manage the collections
   * of this bucket.
   */
  collections(): CollectionManager<T, B> {
    return new CollectionManager(this);
  }

  /**
   * Executes a view query.
   *
   * @param designDoc The name of the design document containing the view to execute.
   * @param viewName The name of the view to execute.
   * @param options Optional parameters for this operation.
   * @param callback A node-style callback to be invoked after execution.
   */
  viewQuery<TValue = any, TKey = any>(
    designDoc: string,
    viewName: string,
    callback?: NodeCallback<ViewResult<TValue, TKey>>
  ): StreamableRowPromise<ViewResult<TValue, TKey>, ViewRow<TValue, TKey>, ViewMetaData>;
  viewQuery<TValue = any, TKey = any>(
    designDoc: string,
    viewName: string,
    options: ViewQueryOptions,
    callback?: NodeCallback<ViewResult<TValue, TKey>>
  ): StreamableRowPromise<ViewResult<TValue, TKey>, ViewRow<TValue, TKey>, ViewMetaData>;
  viewQuery<TValue = any, TKey = any>(
    designDoc: string,
    viewName: string,
    options?: ViewQueryOptions | NodeCallback<ViewResult<TValue, TKey>>,
    callback?: NodeCallback<ViewResult<TValue, TKey>>
  ): StreamableRowPromise<ViewResult<TValue, TKey>, ViewRow<TValue, TKey>, ViewMetaData> {
    if (options instanceof Function) {
      callback = options;
      options = undefined;
    }
    if (!options) {
      options = {};
    }

    const exec = new ViewExecutor(this);

    const options_ = options;
    return PromiseHelper.wrapAsync(
      () => exec.query<TValue, TKey>(designDoc, viewName, options_),
      callback
    );
  }

  /**
   * Performs a ping operation against the cluster.  Pinging the bucket services
   * which are specified (or all services if none are specified).  Returns a report
   * which describes the outcome of the ping operations which were performed.
   *
   * @param options Optional parameters for this operation.
   * @param callback A node-style callback to be invoked after execution.
   */
  ping(callback?: NodeCallback<PingResult>): Promise<PingResult>;
  ping(options: PingOptions, callback?: NodeCallback<PingResult>): Promise<PingResult>;
  ping(
    options?: PingOptions | NodeCallback<PingResult>,
    callback?: NodeCallback<PingResult>
  ): Promise<PingResult> {
    if (options instanceof Function) {
      callback = options;
      options = undefined;
    }
    if (!options) {
      options = {};
    }

    const exec = new PingExecutor(this.cluster);

    const options_ = options;
    return PromiseHelper.wrapAsync(
      () =>
        exec.ping({
          ...options_,
          bucket: this.name,
        }),
      callback
    );
  }
}
