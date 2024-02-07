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
import { durabilityLevels } from '@cbjs/shared';

/**
 * Represents the various service types available.
 */
export enum ServiceType {
  /**
   * The key-value service, responsible for data storage.
   */
  KeyValue = 'kv',

  /**
   * The management service, responsible for managing the cluster.
   */
  Management = 'mgmt',

  /**
   * The views service, responsible for views querying.
   */
  Views = 'views',

  /**
   * The query service, responsible for N1QL querying.
   */
  Query = 'query',

  /**
   * The search service, responsible for full-text search querying.
   */
  Search = 'search',

  /**
   * The analytics service, responsible for analytics querying.
   */
  Analytics = 'analytics',

  /**
   * The eventing service, responsible for event-driven actions.
   */
  Eventing = 'eventing',
}

/**
 * Represents the durability level required for an operation.
 */
export enum DurabilityLevel {
  /**
   * Indicates that no durability is needed.
   */
  None = durabilityLevels[0].value,

  /**
   * Indicates that mutations should be replicated to a majority of the
   * nodes in the cluster before the operation is marked as successful.
   */
  Majority = durabilityLevels[1].value,

  /**
   * Indicates that mutations should be replicated to a majority of the
   * nodes in the cluster and persisted to the master node before the
   * operation is marked as successful.
   */
  MajorityAndPersistOnMaster = durabilityLevels[2].value,

  /**
   * Indicates that mutations should be persisted to the majority of the
   * nodes in the cluster before the operation is marked as successful.
   */
  PersistToMajority = durabilityLevels[3].value,
}

/**
 * Represents the storage semantics to use for some types of operations.
 */
export enum StoreSemantics {
  /**
   * Indicates that replace semantics should be used.  This will replace
   * the document if it exists, and the operation will fail if the
   * document does not exist.
   */
  Replace = 0,

  /**
   * Indicates that upsert semantics should be used.  This will replace
   * the document if it exists, and create it if it does not.
   */
  Upsert = 1,

  /**
   * Indicates that insert semantics should be used.  This will insert
   * the document if it does not exist, and fail the operation if the
   * document already exists.
   */
  Insert = 2,
}
