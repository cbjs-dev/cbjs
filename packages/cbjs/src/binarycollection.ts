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
import type { AnyCollection } from './clusterTypes/index.js';
import type { Collection } from './collection.js';
import { CounterResult, MutationResult } from './crudoptypes.js';
import { DurabilityLevel } from './generaltypes.js';
import type { NodeCallback } from './utilities.js';

/**
 * @category Key-Value
 */
export interface IncrementOptions {
  /**
   * The initial value to use for the document if it does not already exist.
   * Not specifying this value indicates the operation should fail if the
   * document does not exist.
   */
  initial?: number;

  /**
   * The expiry time that should be set for the document, expressed in seconds.
   */
  expiry?: number;

  /**
   * Specifies the level of synchronous durability for this operation.
   */
  durabilityLevel?: DurabilityLevel;

  /**
   * Specifies the number of nodes this operation should be persisted to
   * before it is considered successful.  Note that this option is mutually
   * exclusive of {@link durabilityLevel}.
   */
  durabilityPersistTo?: number;

  /**
   * Specifies the number of nodes this operation should be replicated to
   * before it is considered successful.  Note that this option is mutually
   * exclusive of {@link durabilityLevel}.
   */
  durabilityReplicateTo?: number;

  /**
   * The timeout for this operation, represented in milliseconds.
   */
  timeout?: number;
}

/**
 * @category Key-Value
 */
export interface DecrementOptions {
  /**
   * The initial value to use for the document if it does not already exist.
   * Not specifying this value indicates the operation should fail if the
   * document does not exist.
   */
  initial?: number;

  /**
   * The expiry time that should be set for the document, expressed in seconds.
   */
  expiry?: number;

  /**
   * Specifies the level of synchronous durability for this operation.
   */
  durabilityLevel?: DurabilityLevel;

  /**
   * Specifies the number of nodes this operation should be persisted to
   * before it is considered successful.  Note that this option is mutually
   * exclusive of {@link durabilityLevel}.
   */
  durabilityPersistTo?: number;

  /**
   * Specifies the number of nodes this operation should be replicated to
   * before it is considered successful.  Note that this option is mutually
   * exclusive of {@link durabilityLevel}.
   */
  durabilityReplicateTo?: number;

  /**
   * The timeout for this operation, represented in milliseconds.
   */
  timeout?: number;
}

/**
 * @category Key-Value
 */
export interface AppendOptions {
  /**
   * Specifies the level of synchronous durability for this operation.
   */
  durabilityLevel?: DurabilityLevel;

  /**
   * Specifies the number of nodes this operation should be persisted to
   * before it is considered successful.  Note that this option is mutually
   * exclusive of {@link durabilityLevel}.
   */
  durabilityPersistTo?: number;

  /**
   * Specifies the number of nodes this operation should be replicated to
   * before it is considered successful.  Note that this option is mutually
   * exclusive of {@link durabilityLevel}.
   */
  durabilityReplicateTo?: number;

  /**
   * The timeout for this operation, represented in milliseconds.
   */
  timeout?: number;
}

/**
 * @category Key-Value
 */
export interface PrependOptions {
  /**
   * Specifies the level of synchronous durability for this operation.
   */
  durabilityLevel?: DurabilityLevel;

  /**
   * Specifies the number of nodes this operation should be persisted to
   * before it is considered successful.  Note that this option is mutually
   * exclusive of {@link durabilityLevel}.
   */
  durabilityPersistTo?: number;

  /**
   * Specifies the number of nodes this operation should be replicated to
   * before it is considered successful.  Note that this option is mutually
   * exclusive of {@link durabilityLevel}.
   */
  durabilityReplicateTo?: number;

  /**
   * The timeout for this operation, represented in milliseconds.
   */
  timeout?: number;
}

/**
 * Exposes a number of binary-level operations against a collection.
 * These operations do not adhere to the standard JSON-centric
 * behaviour of the SDK.
 *
 * @category Core
 */
export class BinaryCollection<C extends AnyCollection> {
  private _coll: C;

  /**
   * @internal
   */
  constructor(parent: C) {
    this._coll = parent;
  }

  /**
   * Increments the ASCII value of the specified key by the amount
   * indicated in the delta parameter.
   *
   * @param key The key to increment.
   * @param delta The amount to increment the key.
   * @param options Optional parameters for this operation.
   * @param callback A node-style callback to be invoked after execution.
   */
  increment(
    key: string,
    delta: number,
    callback?: NodeCallback<CounterResult>
  ): Promise<CounterResult>;
  increment(
    key: string,
    delta: number,
    options: IncrementOptions,
    callback?: NodeCallback<CounterResult>
  ): Promise<CounterResult>;
  increment(
    key: string,
    delta: number,
    options?: IncrementOptions | NodeCallback<CounterResult>,
    callback?: NodeCallback<CounterResult>
  ): Promise<CounterResult> {
    return (this._coll as Collection<any, any, any, any>)._binaryIncrement(
      key,
      delta,
      options as IncrementOptions,
      callback
    );
  }

  /**
   * Decrements the ASCII value of the specified key by the amount
   * indicated in the delta parameter.
   *
   * @param key The key to increment.
   * @param delta The amount to increment the key.
   * @param options Optional parameters for this operation.
   * @param callback A node-style callback to be invoked after execution.
   */
  decrement(
    key: string,
    delta: number,
    callback?: NodeCallback<CounterResult>
  ): Promise<CounterResult>;
  decrement(
    key: string,
    delta: number,
    options: DecrementOptions,
    callback?: NodeCallback<CounterResult>
  ): Promise<CounterResult>;
  decrement(
    key: string,
    delta: number,
    options?: DecrementOptions | NodeCallback<CounterResult>,
    callback?: NodeCallback<CounterResult>
  ): Promise<CounterResult> {
    return (this._coll as Collection<any, any, any, any>)._binaryDecrement(
      key,
      delta,
      options as DecrementOptions,
      callback
    );
  }

  /**
   * Appends the specified value to the end of the specified key.
   *
   * @param key The key to append to.
   * @param value The value to adjoin to the end of the document.
   * @param options Optional parameters for this operation.
   * @param callback A node-style callback to be invoked after execution.
   */
  append(
    key: string,
    value: string | Buffer,
    callback?: NodeCallback<MutationResult>
  ): Promise<MutationResult>;
  append(
    key: string,
    value: string | Buffer,
    options: AppendOptions,
    callback?: NodeCallback<MutationResult>
  ): Promise<MutationResult>;
  append(
    key: string,
    value: string | Buffer,
    options?: AppendOptions | NodeCallback<MutationResult>,
    callback?: NodeCallback<MutationResult>
  ): Promise<MutationResult> {
    return (this._coll as AnyCollection)._binaryAppend(
      key,
      value,
      options as AppendOptions,
      callback
    );
  }

  /**
   * Prepends the specified value to the beginning of the specified key.
   *
   * @param key The key to prepend to.
   * @param value The value to adjoin to the beginning of the document.
   * @param callbackOrOptions Optional parameters for this operation or a node-style callback to be invoked after execution.
   */
  prepend(
    key: string,
    value: string | Buffer,
    callbackOrOptions?: PrependOptions | NodeCallback<MutationResult>
  ): Promise<MutationResult>;
  prepend(
    key: string,
    value: string | Buffer,
    options: PrependOptions,
    callback?: NodeCallback<MutationResult>
  ): Promise<MutationResult>;
  prepend(
    key: string,
    value: string | Buffer,
    options?: PrependOptions | NodeCallback<MutationResult>,
    callback?: NodeCallback<MutationResult>
  ): Promise<MutationResult> {
    return (this._coll as Collection<any, any, any, any>)._binaryPrepend(
      key,
      value,
      options as PrependOptions,
      callback
    );
  }
}
