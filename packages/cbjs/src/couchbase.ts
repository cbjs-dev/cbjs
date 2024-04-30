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
import { CouchbaseClusterTypes, DefaultClusterTypes } from '@cbjsdev/shared';

import binding from './binding.js';
import { Cluster, ConnectOptions } from './cluster.js';
import { NodeCallback } from './utilities.js';

/**
 * Acts as the entrypoint into the rest of the library.  Connecting to the cluster
 * and exposing the various services and features.
 *
 * @param connStr The connection string to use to connect to the cluster.
 * @param options Optional parameters for this operation.
 * @param callback A node-style callback to be invoked after execution.
 * @throws AuthenticationFailureError
 * @category Core
 */
export async function connect<T extends CouchbaseClusterTypes = DefaultClusterTypes>(
  connStr: `couchbase://` | (string & NonNullable<unknown>),
  options?: ConnectOptions,
  callback?: NodeCallback<Cluster<T>>
): Promise<Cluster<T>> {
  return await Cluster.connect<T>(connStr, options, callback);
}

/**
 * Exposes the underlying couchbase++ library version that is being used by the
 * SDK to perform I/O with the cluster.
 *
 * @deprecated Use {@link cbppVersion} instead.
 */
export const lcbVersion: string = binding.cbppVersion;

/**
 * Exposes the underlying couchbase++ library version that is being used by the
 * SDK to perform I/O with the cluster.
 */
export const cbppVersion: string = binding.cbppVersion;
export const cbppMetadata: string = binding.cbppMetadata;

/**
 * Volatile: This API is subject to change at any time.
 *
 * Exposes the underlying couchbase++ library protocol logger.  This method is for
 * logging/debugging purposes and must be used with caution as network details will
 * be logged to the provided file.
 */
export function enableProtocolLoggerToSaveNetworkTrafficToFile(filename: string): void {
  binding.enableProtocolLogger(filename);
}

/**
 * Volatile: This API is subject to change at any time.
 *
 * Shutdowns the underlying couchbase++ logger.
 *
 */
export function shutdownLogger(): void {
  binding.shutdownLogger();
}
