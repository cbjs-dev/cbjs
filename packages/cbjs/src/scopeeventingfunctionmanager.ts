import {
  BucketName,
  CouchbaseClusterTypes,
  DefaultClusterTypes,
  ScopeName,
} from '@cbjsdev/shared';

import { CppManagementEventingFunction } from './binding.js';
import { errorFromCpp } from './bindingutilities.js';
import { Cluster } from './cluster.js';
import {
  DeployFunctionOptions,
  DropFunctionOptions,
  EventingFunction,
  EventingState,
  FunctionsStatusOptions,
  GetAllFunctionsOptions,
  GetFunctionOptions,
  PauseFunctionOptions,
  ResumeFunctionOptions,
  UpsertFunctionOptions,
} from './eventingfunctionmanager.js';
import { NodeCallback, PromiseHelper, VoidNodeCallback } from './utilities.js';
import { resolveOptionsAndCallback } from './utils/resolveOptionsAndCallback.js';

/**
 * ScopeEventingFunctionManager provides an interface for managing the
 * eventing functions on the scope.
 * Uncommitted: This API is subject to change in the future.
 *
 * @category Management
 */
export class ScopeEventingFunctionManager<
  in out T extends CouchbaseClusterTypes = DefaultClusterTypes,
  in out B extends BucketName<T> = BucketName<T>,
  in out S extends ScopeName<T, B> = ScopeName<T, B>,
> {
  private _cluster: Cluster<T>;
  private _bucketName: B;
  private _scopeName: S;

  /**
   * @internal
   */
  constructor(cluster: Cluster<T>, bucketName: B, scopeName: S) {
    this._cluster = cluster;
    this._bucketName = bucketName;
    this._scopeName = scopeName;
  }

  /**
   * Creates or updates an eventing function.
   *
   * @param functionDefinition The description of the eventing function to upsert.
   * @param options Optional parameters for this operation.
   * @param callback A node-style callback to be invoked after execution.
   */
  async upsertFunction(
    functionDefinition: EventingFunction,
    options: UpsertFunctionOptions,
    callback?: VoidNodeCallback
  ): Promise<void>;

  /**
   * Creates or updates an eventing function.
   *
   * @param functionDefinition The description of the eventing function to upsert.
   * @param callback A node-style callback to be invoked after execution.
   */
  async upsertFunction(
    functionDefinition: EventingFunction,
    callback?: VoidNodeCallback
  ): Promise<void>;

  async upsertFunction(
    functionDefinition: EventingFunction,
    ...args:
      | [options: UpsertFunctionOptions, callback?: VoidNodeCallback]
      | [callback?: VoidNodeCallback]
  ): Promise<void> {
    const [options = {}, callback] = resolveOptionsAndCallback(args);

    const timeout = options.timeout ?? this._cluster.managementTimeout;

    return PromiseHelper.wrap((wrapCallback) => {
      const fnDef = EventingFunction._toCppData(functionDefinition);
      this._cluster.conn.managementEventingUpsertFunction(
        {
          function: fnDef,
          bucket_name: this._bucketName,
          scope_name: this._scopeName,
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
   * Deletes an eventing function.
   *
   * @param name The name of the eventing function to delete.
   * @param options Optional parameters for this operation.
   * @param callback A node-style callback to be invoked after execution.
   */
  async dropFunction(
    name: string,
    options: DropFunctionOptions,
    callback?: VoidNodeCallback
  ): Promise<void>;

  /**
   * Deletes an eventing function.
   *
   * @param name The name of the eventing function to delete.
   * @param callback A node-style callback to be invoked after execution.
   */
  async dropFunction(name: string, callback?: VoidNodeCallback): Promise<void>;

  async dropFunction(
    name: string,
    ...args:
      | [options: DropFunctionOptions, callback?: VoidNodeCallback]
      | [callback?: VoidNodeCallback]
  ): Promise<void> {
    const [options = {}, callback] = resolveOptionsAndCallback(args);

    const timeout = options.timeout ?? this._cluster.managementTimeout;

    return PromiseHelper.wrap((wrapCallback) => {
      this._cluster.conn.managementEventingDropFunction(
        {
          name: name,
          bucket_name: this._bucketName,
          scope_name: this._scopeName,
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
   * Fetches all eventing functions.
   *
   * @param options Optional parameters for this operation.
   * @param callback A node-style callback to be invoked after execution.
   */
  async getAllFunctions(
    options: GetAllFunctionsOptions,
    callback?: NodeCallback<EventingFunction[]>
  ): Promise<EventingFunction[]>;

  /**
   * Fetches all eventing functions.
   *
   * @param callback A node-style callback to be invoked after execution.
   */
  async getAllFunctions(
    callback?: NodeCallback<EventingFunction[]>
  ): Promise<EventingFunction[]>;

  async getAllFunctions(
    ...args:
      | [options: GetAllFunctionsOptions, callback?: NodeCallback<EventingFunction[]>]
      | [callback?: NodeCallback<EventingFunction[]>]
  ): Promise<EventingFunction[]> {
    const [options = {}, callback] = resolveOptionsAndCallback(args);

    const timeout = options.timeout ?? this._cluster.managementTimeout;

    return PromiseHelper.wrap((wrapCallback) => {
      this._cluster.conn.managementEventingGetAllFunctions(
        {
          bucket_name: this._bucketName,
          scope_name: this._scopeName,
          timeout: timeout,
        },
        (cppErr, resp) => {
          const err = errorFromCpp(cppErr);
          if (err) {
            return wrapCallback(err, null);
          }
          const functions = resp.functions.map(
            (functionData: CppManagementEventingFunction) =>
              EventingFunction._fromCppData(functionData)
          );
          wrapCallback(null, functions);
        }
      );
    }, callback);
  }

  /**
   * Fetches a specific eventing function.
   *
   * @param name The name of the eventing function to fetch.
   * @param options Optional parameters for this operation.
   * @param callback A node-style callback to be invoked after execution.
   */
  async getFunction(
    name: string,
    options: GetFunctionOptions,
    callback?: NodeCallback<EventingFunction>
  ): Promise<EventingFunction>;

  /**
   * Fetches a specific eventing function.
   *
   * @param name The name of the eventing function to fetch.
   * @param callback A node-style callback to be invoked after execution.
   */
  async getFunction(
    name: string,
    callback?: NodeCallback<EventingFunction>
  ): Promise<EventingFunction>;

  async getFunction(
    name: string,
    ...args:
      | [options: GetFunctionOptions, callback?: NodeCallback<EventingFunction>]
      | [callback?: NodeCallback<EventingFunction>]
  ): Promise<EventingFunction> {
    const [options = {}, callback] = resolveOptionsAndCallback(args);

    const timeout = options.timeout ?? this._cluster.managementTimeout;

    return PromiseHelper.wrap((wrapCallback) => {
      this._cluster.conn.managementEventingGetFunction(
        {
          name: name,
          bucket_name: this._bucketName,
          scope_name: this._scopeName,
          timeout: timeout,
        },
        (cppErr, resp) => {
          const err = errorFromCpp(cppErr);
          if (err) {
            return wrapCallback(err, null);
          }
          const eventingFunction = EventingFunction._fromCppData(resp.function);
          wrapCallback(null, eventingFunction);
        }
      );
    }, callback);
  }

  /**
   * Deploys an eventing function.
   *
   * @param name The name of the eventing function to deploy.
   * @param options Optional parameters for this operation.
   * @param callback A node-style callback to be invoked after execution.
   */
  async deployFunction(
    name: string,
    options: DeployFunctionOptions,
    callback?: VoidNodeCallback
  ): Promise<void>;

  /**
   * Deploys an eventing function.
   *
   * @param name The name of the eventing function to deploy.
   * @param callback A node-style callback to be invoked after execution.
   */
  async deployFunction(name: string, callback?: VoidNodeCallback): Promise<void>;

  async deployFunction(
    name: string,
    ...args:
      | [options: DeployFunctionOptions, callback?: VoidNodeCallback]
      | [callback?: VoidNodeCallback]
  ): Promise<void> {
    const [options = {}, callback] = resolveOptionsAndCallback(args);

    const timeout = options.timeout ?? this._cluster.managementTimeout;

    return PromiseHelper.wrap((wrapCallback) => {
      this._cluster.conn.managementEventingDeployFunction(
        {
          name: name,
          bucket_name: this._bucketName,
          scope_name: this._scopeName,
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
   * Undeploys an eventing function.
   *
   * @param name The name of the eventing function to undeploy.
   * @param options Optional parameters for this operation.
   * @param callback A node-style callback to be invoked after execution.
   */
  async undeployFunction(
    name: string,
    options: DeployFunctionOptions,
    callback?: VoidNodeCallback
  ): Promise<void>;

  /**
   * Undeploys an eventing function.
   *
   * @param name The name of the eventing function to undeploy.
   * @param callback A node-style callback to be invoked after execution.
   */
  async undeployFunction(name: string, callback?: VoidNodeCallback): Promise<void>;

  async undeployFunction(
    name: string,
    ...args:
      | [options: DeployFunctionOptions, callback?: VoidNodeCallback]
      | [callback?: VoidNodeCallback]
  ): Promise<void> {
    const [options = {}, callback] = resolveOptionsAndCallback(args);

    const timeout = options.timeout ?? this._cluster.managementTimeout;

    return PromiseHelper.wrap((wrapCallback) => {
      this._cluster.conn.managementEventingUndeployFunction(
        {
          name: name,
          bucket_name: this._bucketName,
          scope_name: this._scopeName,
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
   * Pauses an eventing function.
   *
   * @param name The name of the eventing function to pause.
   * @param options Optional parameters for this operation.
   * @param callback A node-style callback to be invoked after execution.
   */
  async pauseFunction(
    name: string,
    options: PauseFunctionOptions,
    callback?: VoidNodeCallback
  ): Promise<void>;

  /**
   * Pauses an eventing function.
   *
   * @param name The name of the eventing function to pause.
   * @param callback A node-style callback to be invoked after execution.
   */
  async pauseFunction(name: string, callback?: VoidNodeCallback): Promise<void>;

  async pauseFunction(
    name: string,
    ...args:
      | [options: PauseFunctionOptions, callback?: VoidNodeCallback]
      | [callback?: VoidNodeCallback]
  ): Promise<void> {
    const [options = {}, callback] = resolveOptionsAndCallback(args);

    const timeout = options.timeout ?? this._cluster.managementTimeout;

    return PromiseHelper.wrap((wrapCallback) => {
      this._cluster.conn.managementEventingPauseFunction(
        {
          name: name,
          bucket_name: this._bucketName,
          scope_name: this._scopeName,
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
   * Resumes an eventing function.
   *
   * @param name The name of the eventing function to resume.
   * @param options Optional parameters for this operation.
   * @param callback A node-style callback to be invoked after execution.
   */
  async resumeFunction(
    name: string,
    options: ResumeFunctionOptions,
    callback?: VoidNodeCallback
  ): Promise<void>;

  /**
   * Resumes an eventing function.
   *
   * @param name The name of the eventing function to resume.
   * @param callback A node-style callback to be invoked after execution.
   */
  async resumeFunction(name: string, callback?: VoidNodeCallback): Promise<void>;

  async resumeFunction(
    name: string,
    ...args:
      | [options: ResumeFunctionOptions, callback?: VoidNodeCallback]
      | [callback?: VoidNodeCallback]
  ): Promise<void> {
    const [options = {}, callback] = resolveOptionsAndCallback(args);

    const timeout = options.timeout ?? this._cluster.managementTimeout;

    return PromiseHelper.wrap((wrapCallback) => {
      this._cluster.conn.managementEventingResumeFunction(
        {
          name: name,
          bucket_name: this._bucketName,
          scope_name: this._scopeName,
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
   * Fetches the status of all eventing functions.
   *
   * @param options Optional parameters for this operation.
   * @param callback A node-style callback to be invoked after execution.
   */
  async functionsStatus(
    options: FunctionsStatusOptions,
    callback?: NodeCallback<EventingState>
  ): Promise<EventingState>;

  /**
   * Fetches the status of all eventing functions.
   *
   * @param callback A node-style callback to be invoked after execution.
   */
  async functionsStatus(callback?: NodeCallback<EventingState>): Promise<EventingState>;

  async functionsStatus(
    ...args:
      | [options: FunctionsStatusOptions, callback?: NodeCallback<EventingState>]
      | [callback?: NodeCallback<EventingState>]
  ): Promise<EventingState> {
    const [options = {}, callback] = resolveOptionsAndCallback(args);

    const timeout = options.timeout ?? this._cluster.managementTimeout;

    return PromiseHelper.wrap((wrapCallback) => {
      this._cluster.conn.managementEventingGetStatus(
        {
          bucket_name: this._bucketName,
          scope_name: this._scopeName,
          timeout: timeout,
        },
        (cppErr, resp) => {
          const err = errorFromCpp(cppErr);
          if (err) {
            return wrapCallback(err, null);
          }
          const state = EventingState._fromCppData(resp.status);
          wrapCallback(null, state);
        }
      );
    }, callback);
  }
}
