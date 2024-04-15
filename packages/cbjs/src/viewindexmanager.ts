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
import { ApiViewDesignDocument } from '@cbjsdev/http-client';

import {
  CppManagementViewsDesignDocument,
  CppManagementViewsDesignDocumentView,
} from './binding';
import {
  designDocumentNamespaceFromCpp,
  designDocumentNamespaceToCpp,
  errorFromCpp,
} from './bindingutilities';
import { Bucket } from './bucket';
import { BucketName, CouchbaseClusterTypes } from './clusterTypes';
import {
  CompoundTimeout,
  NodeCallback,
  PromiseHelper,
  VoidNodeCallback,
} from './utilities';
import { resolveOptionsAndCallback } from './utils/resolveOptionsAndCallback';
import { DesignDocumentNamespace } from './viewtypes';

/**
 * Contains information about a view in a design document.
 *
 * @category Management
 */
export class DesignDocumentView {
  /**
   * The mapping function to use for this view.
   */
  map?: string;

  /**
   * The reduction function to use for this view.
   */
  reduce?: string;

  constructor(data: { map?: string; reduce?: string });

  /**
   * @deprecated
   */
  constructor(map?: string, reduce?: string);

  /**
   * @internal
   */
  constructor(
    ...args: [{ map?: string; reduce?: string }] | [map?: string, reduce?: string]
  ) {
    if (typeof args[0] === 'object') {
      const { map, reduce } = args[0];

      this.map = map;
      this.reduce = reduce;
      return;
    }

    this.map = args[0];
    this.reduce = args[1];
  }

  /**
   * @internal
   */
  static _toCppData(
    name: string,
    data: DesignDocumentView
  ): CppManagementViewsDesignDocumentView {
    return {
      name: name,
      map: data.map,
      reduce: data.reduce,
    };
  }

  /**
   * @internal
   */
  static _fromCppData(data: CppManagementViewsDesignDocumentView): DesignDocumentView {
    return new DesignDocumentView({
      map: data.map,
      reduce: data.reduce,
    });
  }
}

/**
 * Contains information about a design document.
 *
 * @category Management
 */
export class DesignDocument {
  /**
   * Same as {@link DesignDocumentView}.
   *
   * @deprecated Use {@link DesignDocumentView} directly.
   */
  static get View(): any {
    return DesignDocumentView;
  }

  /**
   * The name of the design document.
   */
  name: string;

  /**
   * A map of the views that exist in this design document.
   */
  views: { [viewName: string]: DesignDocumentView };

  /**
   * The namespace for this design document.
   */
  namespace: DesignDocumentNamespace;

  /**
   * The revision of the design document.
   */
  rev: string | undefined;

  constructor(data: {
    name: string;
    views?: { [viewName: string]: DesignDocumentView };
    namespace?: DesignDocumentNamespace;
    rev?: string;
  });

  /**
   * @deprecated
   */
  constructor(name: string, views: { [viewName: string]: DesignDocumentView });

  /**
   * @internal
   */
  constructor(
    ...args:
      | [
          {
            name: string;
            views?: { [viewName: string]: DesignDocumentView };
            rev?: string;
            namespace?: DesignDocumentNamespace;
          },
        ]
      | [name: string, views: { [viewName: string]: DesignDocumentView }]
  ) {
    if (typeof args[0] === 'object') {
      const { name, views, namespace, rev } = args[0];

      this.name = name;
      this.views = views ?? {};
      this.namespace = namespace ?? DesignDocumentNamespace.Production;
      this.rev = rev;
      return;
    }

    this.name = args[0];
    this.views = args[1] ?? {};
    this.namespace = DesignDocumentNamespace.Production;
  }

  /**
   * @internal
   */
  static _fromNsData(
    ddocName: string,
    ddocData: ApiViewDesignDocument['doc']['json']
  ): DesignDocument {
    const views: { [viewName: string]: DesignDocumentView } = {};
    for (const viewName in ddocData.views) {
      const viewData = ddocData.views[viewName];
      views[viewName] = new DesignDocumentView({
        map: viewData.map,
        reduce: viewData.reduce,
      });
    }

    return new DesignDocument({ name: ddocName, views: views });
  }

  /**
   * @internal
   */
  static _toCppData(
    data: DesignDocument,
    namespace: DesignDocumentNamespace
  ): CppManagementViewsDesignDocument {
    const cppView: { [key: string]: CppManagementViewsDesignDocumentView } = {};
    for (const [k, v] of Object.entries(data.views)) {
      cppView[k] = DesignDocumentView._toCppData(k, v);
    }
    return {
      rev: data.rev,
      name: data.name,
      ns: designDocumentNamespaceToCpp(namespace),
      views: cppView,
    };
  }

  /**
   * @internal
   */
  static _fromCppData(ddoc: CppManagementViewsDesignDocument): DesignDocument {
    const views: { [viewName: string]: DesignDocumentView } = {};
    for (const [viewName, viewData] of Object.entries(ddoc.views)) {
      views[viewName] = DesignDocumentView._fromCppData(viewData);
    }

    return new DesignDocument({
      name: ddoc.name,
      views: views,
      namespace: designDocumentNamespaceFromCpp(ddoc.ns),
      rev: ddoc.rev,
    });
  }
}

/**
 * @category Management
 */
export interface GetAllDesignDocumentOptions {
  /**
   * The timeout for this operation, represented in milliseconds.
   */
  timeout?: number;
}

/**
 * @category Management
 */
export interface GetDesignDocumentOptions {
  /**
   * The timeout for this operation, represented in milliseconds.
   */
  timeout?: number;
}

/**
 * @category Management
 */
export interface UpsertDesignDocumentOptions {
  /**
   * The timeout for this operation, represented in milliseconds.
   */
  timeout?: number;
}

/**
 * @category Management
 */
export interface DropDesignDocumentOptions {
  /**
   * The timeout for this operation, represented in milliseconds.
   */
  timeout?: number;
}

/**
 * @category Management
 */
export interface PublishDesignDocumentOptions {
  /**
   * The timeout for this operation, represented in milliseconds.
   */
  timeout?: number;
}

/**
 * ViewIndexManager is an interface which enables the management
 * of view indexes on the cluster.
 *
 * @category Management
 */
export class ViewIndexManager<T extends CouchbaseClusterTypes, B extends BucketName<T>> {
  private _bucket: Bucket<T, B>;

  /**
   * @internal
   */
  constructor(bucket: Bucket<T, B>) {
    this._bucket = bucket;
  }

  /**
   * @internal
   */
  private get _cluster() {
    return this._bucket.cluster;
  }

  /**
   * Returns a list of all the design documents in this bucket.
   *
   * @param options Optional parameters for this operation.
   * @param callback A node-style callback to be invoked after execution.
   * @deprecated
   */
  async getAllDesignDocuments(
    options: GetAllDesignDocumentOptions,
    callback?: NodeCallback<DesignDocument[]>
  ): Promise<DesignDocument[]>;

  /**
   * Returns a list of all the design documents in this bucket.
   *
   * @param callback A node-style callback to be invoked after execution.
   * @deprecated
   */
  async getAllDesignDocuments(
    callback?: NodeCallback<DesignDocument[]>
  ): Promise<DesignDocument[]>;

  /**
   * Returns a list of all the design documents in this bucket.
   *
   * @param namespace The DesignDocument namespace.
   * @param options Parameters for this operation.
   * @param callback A node-style callback to be invoked after execution.
   */
  async getAllDesignDocuments(
    namespace: DesignDocumentNamespace,
    options: GetAllDesignDocumentOptions,
    callback?: NodeCallback<DesignDocument[]>
  ): Promise<DesignDocument[]>;

  /**
   * Returns a list of all the design documents in this bucket.
   *
   * @param namespace The DesignDocument namespace.
   * @param callback A node-style callback to be invoked after execution.
   */
  async getAllDesignDocuments(
    namespace: DesignDocumentNamespace,
    callback?: NodeCallback<DesignDocument[]>
  ): Promise<DesignDocument[]>;

  async getAllDesignDocuments(
    ...args:
      | [options: GetAllDesignDocumentOptions, callback?: NodeCallback<DesignDocument[]>]
      | [callback?: NodeCallback<DesignDocument[]>]
      | [
          namespace: DesignDocumentNamespace,
          options: GetAllDesignDocumentOptions,
          callback?: NodeCallback<DesignDocument[]>,
        ]
      | [namespace: DesignDocumentNamespace, callback?: NodeCallback<DesignDocument[]>]
  ): Promise<DesignDocument[]> {
    let namespace: DesignDocumentNamespace | undefined = undefined;
    let options: GetAllDesignDocumentOptions = {};
    let callback: NodeCallback<DesignDocument[]> | undefined = undefined;

    // New signature
    if (typeof args[0] === 'string') {
      namespace = args[0];

      const trailingArgs = [args[1], args[2]] as [
        options: GetAllDesignDocumentOptions,
        callback: NodeCallback<DesignDocument[]>,
      ];

      [options = {}, callback] = resolveOptionsAndCallback(trailingArgs);
    } else {
      // Deprecated signature
      [options = {}, callback] = resolveOptionsAndCallback(args);
    }

    const timeout = options.timeout ?? this._cluster.managementTimeout;
    const ns = namespace ?? DesignDocumentNamespace.Production;

    return PromiseHelper.wrap((wrapCallback) => {
      this._cluster.conn.managementViewIndexGetAll(
        {
          bucket_name: this._bucket.name,
          ns: designDocumentNamespaceToCpp(ns),
          timeout: timeout,
        },
        (cppErr, resp) => {
          const err = errorFromCpp(cppErr);
          if (err) {
            return wrapCallback(err, null);
          }
          const ddocs = [];
          for (const ddoc of resp.design_documents) {
            ddocs.push(DesignDocument._fromCppData(ddoc));
          }
          wrapCallback(null, ddocs);
        }
      );
    }, callback);
  }

  /**
   * Returns the specified design document.
   *
   * @param designDocName The name of the design document to fetch.
   * @param options Optional parameters for this operation.
   * @param callback A node-style callback to be invoked after execution.
   * @deprecated
   */
  async getDesignDocument(
    designDocName: string,
    options: GetDesignDocumentOptions,
    callback?: NodeCallback<DesignDocument>
  ): Promise<DesignDocument>;

  /**
   * Returns the specified design document.
   *
   * @param designDocName The name of the design document to fetch.
   * @param callback A node-style callback to be invoked after execution.
   * @deprecated
   */
  async getDesignDocument(
    designDocName: string,
    callback?: NodeCallback<DesignDocument>
  ): Promise<DesignDocument>;

  /**
   * Returns the specified design document.
   *
   * @param designDocName The name of the design document to fetch.
   * @param namespace The DesignDocument namespace.
   * @param options Parameters for this operation.
   * @param callback A node-style callback to be invoked after execution.
   */
  async getDesignDocument(
    designDocName: string,
    namespace: DesignDocumentNamespace,
    options: GetDesignDocumentOptions,
    callback?: NodeCallback<DesignDocument>
  ): Promise<DesignDocument>;

  /**
   * Returns the specified design document.
   *
   * @param designDocName The name of the design document to fetch.
   * @param namespace The DesignDocument namespace.
   * @param callback A node-style callback to be invoked after execution.
   */
  async getDesignDocument(
    designDocName: string,
    namespace: DesignDocumentNamespace,
    callback?: NodeCallback<DesignDocument>
  ): Promise<DesignDocument>;

  async getDesignDocument(
    ...args:
      | [
          designDocName: string,
          namespace: DesignDocumentNamespace,
          options?: GetDesignDocumentOptions | NodeCallback<DesignDocument>,
          callback?: NodeCallback<DesignDocument>,
        ]
      | [
          designDocName: string,
          options?: GetDesignDocumentOptions | NodeCallback<DesignDocument>,
          callback?: NodeCallback<DesignDocument>,
        ]
  ): Promise<DesignDocument> {
    let designDocName = args[0];
    let namespace: DesignDocumentNamespace | undefined = undefined;
    let options: GetDesignDocumentOptions = {};
    let callback: NodeCallback<DesignDocument> | undefined = undefined;

    // New signature
    if (typeof args[1] === 'string') {
      namespace = args[1];

      const trailingArgs = [args[2], args[3]] as [
        options: GetAllDesignDocumentOptions,
        callback: NodeCallback<DesignDocument>,
      ];

      [options = {}, callback] = resolveOptionsAndCallback(trailingArgs);
    } else {
      // Deprecated signature
      [options = {}, callback] = resolveOptionsAndCallback([args[1], args[2]] as [
        options: GetAllDesignDocumentOptions,
        callback: NodeCallback<DesignDocument>,
      ]);
    }

    const timeout = options.timeout ?? this._cluster.managementTimeout;
    // for compatibility with older SDK versions (i.e. deprecated getDesignDocument())
    if (designDocName.startsWith('dev_') && namespace === undefined) {
      namespace = DesignDocumentNamespace.Development;
      designDocName = designDocName.substring(4);
    }
    const ns = namespace ?? DesignDocumentNamespace.Production;

    return PromiseHelper.wrap((wrapCallback) => {
      this._cluster.conn.managementViewIndexGet(
        {
          bucket_name: this._bucket.name,
          document_name: designDocName,
          ns: designDocumentNamespaceToCpp(ns),
          timeout: timeout,
        },
        (cppErr, resp) => {
          const err = errorFromCpp(cppErr);
          if (err) {
            return wrapCallback(err, null);
          }
          const ddoc = DesignDocument._fromCppData(resp.document);
          wrapCallback(null, ddoc);
        }
      );
    }, callback);
  }

  /**
   * Creates or updates a design document.
   *
   * @param designDoc The DesignDocument to upsert.
   * @param options Parameters for this operation.
   * @param callback A node-style callback to be invoked after execution.
   * @deprecated
   */
  async upsertDesignDocument(
    designDoc: DesignDocument,
    options: UpsertDesignDocumentOptions,
    callback?: VoidNodeCallback
  ): Promise<void>;

  /**
   * Creates or updates a design document.
   *
   * @param designDoc The DesignDocument to upsert.
   * @param callback A node-style callback to be invoked after execution.
   * @deprecated
   */
  async upsertDesignDocument(
    designDoc: DesignDocument,
    callback?: VoidNodeCallback
  ): Promise<void>;

  /**
   * Creates or updates a design document.
   *
   * @param designDoc The DesignDocument to upsert.
   * @param namespace The DesignDocument namespace.
   * @param options Optional parameters for this operation.
   * @param callback A node-style callback to be invoked after execution.
   */
  async upsertDesignDocument(
    designDoc: DesignDocument,
    namespace: DesignDocumentNamespace,
    options: UpsertDesignDocumentOptions,
    callback?: VoidNodeCallback
  ): Promise<void>;

  async upsertDesignDocument(
    designDoc: DesignDocument,
    namespace: DesignDocumentNamespace,
    callback?: VoidNodeCallback
  ): Promise<void>;

  async upsertDesignDocument(
    ...args:
      | [
          designDoc: DesignDocument,
          namespace?: DesignDocumentNamespace,
          options?: UpsertDesignDocumentOptions | VoidNodeCallback,
          callback?: VoidNodeCallback,
        ]
      | [
          designDoc: DesignDocument,
          options?: UpsertDesignDocumentOptions | VoidNodeCallback,
          callback?: VoidNodeCallback,
        ]
  ): Promise<void> {
    const designDoc: DesignDocument = args[0];
    let namespace: DesignDocumentNamespace | undefined = undefined;
    let options: UpsertDesignDocumentOptions = {};
    let callback: VoidNodeCallback | undefined = undefined;

    // New signature
    if (typeof args[1] === 'string') {
      namespace = args[1];

      const trailingArgs = [args[2], args[3]] as [
        options: UpsertDesignDocumentOptions,
        callback: VoidNodeCallback,
      ];

      [options = {}, callback] = resolveOptionsAndCallback(trailingArgs);
    } else {
      // Deprecated signature
      [options = {}, callback] = resolveOptionsAndCallback([args[1], args[2]] as [
        options: UpsertDesignDocumentOptions,
        callback: VoidNodeCallback,
      ]);
    }

    const timeout = options.timeout ?? this._cluster.managementTimeout;

    // for compatibility with older SDK versions (i.e. deprecated upsertDesignDocument())
    if (designDoc.name.startsWith('dev_') && namespace === undefined) {
      namespace = DesignDocumentNamespace.Development;
      designDoc.name = designDoc.name.substring(4);
    }

    const ns = namespace ?? DesignDocumentNamespace.Production;

    return PromiseHelper.wrap((wrapCallback) => {
      this._cluster.conn.managementViewIndexUpsert(
        {
          bucket_name: this._bucket.name,
          document: DesignDocument._toCppData(designDoc, ns),
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
   * Drops an existing design document.
   *
   * @param designDocName The name of the design document to drop.
   * @param options Optional parameters for this operation.
   * @param callback A node-style callback to be invoked after execution.
   * @deprecated
   */
  async dropDesignDocument(
    designDocName: string,
    options: DropDesignDocumentOptions,
    callback?: VoidNodeCallback
  ): Promise<void>;

  /**
   * Drops an existing design document.
   *
   * @param designDocName The name of the design document to drop.
   * @param callback A node-style callback to be invoked after execution.
   * @deprecated
   */
  async dropDesignDocument(
    designDocName: string,
    callback?: VoidNodeCallback
  ): Promise<void>;

  /**
   * Drops an existing design document.
   *
   * @param designDocName The name of the design document to drop.
   * @param namespace The DesignDocument namespace.
   * @param options Optional parameters for this operation.
   * @param callback A node-style callback to be invoked after execution.
   */
  async dropDesignDocument(
    designDocName: string,
    namespace: DesignDocumentNamespace,
    options: DropDesignDocumentOptions,
    callback?: VoidNodeCallback
  ): Promise<void>;

  /**
   * Drops an existing design document.
   *
   * @param designDocName The name of the design document to drop.
   * @param namespace The DesignDocument namespace.
   * @param callback A node-style callback to be invoked after execution.
   */
  async dropDesignDocument(
    designDocName: string,
    namespace: DesignDocumentNamespace,
    callback?: VoidNodeCallback
  ): Promise<void>;

  async dropDesignDocument(
    ...args:
      | [
          designDocName: string,
          namespace?: DesignDocumentNamespace,
          options?: DropDesignDocumentOptions | VoidNodeCallback,
          callback?: VoidNodeCallback,
        ]
      | [
          designDocName: string,
          options?: DropDesignDocumentOptions | VoidNodeCallback,
          callback?: VoidNodeCallback,
        ]
  ): Promise<void> {
    let designDocName = args[0];
    let namespace: DesignDocumentNamespace | undefined = undefined;
    let options: DropDesignDocumentOptions = {};
    let callback: VoidNodeCallback | undefined = undefined;

    // New signature
    if (typeof args[1] === 'string') {
      namespace = args[1];

      const trailingArgs = [args[2], args[3]] as [
        options: DropDesignDocumentOptions,
        callback: VoidNodeCallback,
      ];

      [options = {}, callback] = resolveOptionsAndCallback(trailingArgs);
    } else {
      // Deprecated signature
      [options = {}, callback] = resolveOptionsAndCallback([args[1], args[2]] as [
        options: DropDesignDocumentOptions,
        callback: VoidNodeCallback,
      ]);
    }

    const timeout = options.timeout ?? this._cluster.managementTimeout;

    if (designDocName.startsWith('dev_') && namespace === undefined) {
      namespace = DesignDocumentNamespace.Development;
      designDocName = designDocName.substring(4);
    }

    const ns = namespace ?? DesignDocumentNamespace.Production;

    return PromiseHelper.wrap((wrapCallback) => {
      this._cluster.conn.managementViewIndexDrop(
        {
          bucket_name: this._bucket.name,
          document_name: designDocName,
          ns: designDocumentNamespaceToCpp(ns),
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
   * Publishes a development design document to be a production design document.
   * It does this by fetching the design document by the passed name with `dev_`
   * appended, and then performs an upsert of the production name (no `dev_`)
   * with the data which was just fetched.
   *
   * @param designDocName The name of the design document to publish.
   * @param options Optional parameters for this operation.
   * @param callback A node-style callback to be invoked after execution.
   */
  async publishDesignDocument(
    designDocName: string,
    options: PublishDesignDocumentOptions,
    callback?: VoidNodeCallback
  ): Promise<void>;

  /**
   * Publishes a development design document to be a production design document.
   * It does this by fetching the design document by the passed name with `dev_`
   * appended, and then performs an upsert of the production name (no `dev_`)
   * with the data which was just fetched.
   *
   * @param designDocName The name of the design document to publish.
   * @param callback A node-style callback to be invoked after execution.
   */
  async publishDesignDocument(
    designDocName: string,
    callback?: VoidNodeCallback
  ): Promise<void>;

  async publishDesignDocument(
    designDocName: string,
    options?: PublishDesignDocumentOptions | VoidNodeCallback,
    callback?: VoidNodeCallback
  ): Promise<void> {
    if (options instanceof Function) {
      callback = options;
      options = undefined;
    }
    if (!options) {
      options = {};
    }

    const timeout = options.timeout ?? this._cluster.managementTimeout;
    const timer = new CompoundTimeout(timeout);

    return PromiseHelper.wrapAsync(async () => {
      const designDoc = await this.getDesignDocument(
        designDocName,
        DesignDocumentNamespace.Development,
        {
          timeout: timer.left(),
        }
      );

      await this.upsertDesignDocument(designDoc, DesignDocumentNamespace.Production, {
        timeout: timer.left(),
      });
    }, callback);
  }
}
