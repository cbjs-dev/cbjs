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
  BucketTypeName,
  CompressionModeName,
  CouchbaseClusterTypes,
  DurabilityLevelName,
  EvictionPolicyName,
  ReplicaNumber,
  RequiredProps,
  StorageBackendName,
} from '@cbjsdev/shared';
import { promisify } from 'node:util';

import { CppManagementClusterBucketSettings } from './binding';
import {
  bucketCompressionModeFromCpp,
  bucketCompressionModeToCpp,
  bucketConflictResolutionTypeToCpp,
  bucketEvictionPolicyFromCpp,
  bucketEvictionPolicyToCpp,
  bucketStorageBackendFromCpp,
  bucketStorageBackendToCpp,
  bucketTypeFromCpp,
  bucketTypeToCpp,
  durabilityFromCpp,
  durabilityToCpp,
  errorFromCpp,
} from './bindingutilities';
import { Cluster } from './cluster';
import { DurabilityLevel } from './generaltypes';
import {
  duraLevelToNsServerStr,
  NodeCallback,
  nsServerStrToDuraLevel,
  PromiseHelper,
  VoidNodeCallback,
} from './utilities';
import { toEnumMember } from './utilities_internal';

/**
 * Represents the various conflict resolution modes which can be used for
 * XDCR synchronization against a bucket.
 *
 * @category Management
 */
export enum ConflictResolutionType {
  /**
   * Indicates that timestamps should be used for conflict resolution.  The most
   * recently modified document (according to each server, ie: time synchronization
   * is important) is the one selected to win.
   */
  Timestamp = 'lww',

  /**
   * Indicates that the seqno of the document should be used for conflict resolution.
   */
  SequenceNumber = 'seqno',

  /**
   * Indicates that custom conflict resolution should be used.
   *
   * @experimental This mode is only available in Couchbase Server 7.1 with the
   * "developer-preview" mode enabled.
   */
  Custom = 'custom',
}

/**
 * Represents the type of a bucket.
 *
 * @category Management
 */
export enum BucketType {
  /**
   * Indicates the bucket should be a Couchbase bucket.
   */
  Couchbase = 'membase',

  /**
   * Indicates the bucket should be a Memcached bucket.
   */
  Memcached = 'memcached',

  /**
   * Indicates the bucket should be a Ephemeral bucket.
   */
  Ephemeral = 'ephemeral',
}

/**
 * Represents the storage backend to use for a bucket.
 *
 * @category Management
 */
export enum StorageBackend {
  /**
   * Indicates the bucket should use the Couchstore storage engine.
   */
  Couchstore = 'couchstore',

  /**
   * Indicates the bucket should use the Magma storage engine.
   */
  Magma = 'magma',
}

/**
 * Represents the eviction policy that should be used for a bucket.
 *
 * @category Management
 */
export enum EvictionPolicy {
  /**
   * Indicates that both the document meta-data and value should be evicted.
   */
  FullEviction = 'fullEviction',

  /**
   * Indicates that only the value of a document should be evicted.
   */
  ValueOnly = 'valueOnly',

  /**
   * Indicates that the least recently used documents are evicted.
   */
  NotRecentlyUsed = 'nruEviction',

  /**
   * Indicates that nothing should be evicted.
   */
  NoEviction = 'noEviction',
}

/**
 * Specifies the compression mode that should be used for a bucket.
 *
 * @category Management
 */
export enum CompressionMode {
  /**
   * Indicates that compression should not be used on the server.
   */
  Off = 'off',

  /**
   * Indicates that compression should be used passively.  That is that if the
   * client sends data which is encrypted, it is stored on the server in its
   * compressed form, but the server does not actively compress documents.
   */
  Passive = 'passive',

  /**
   * Indicates that compression should be performed actively.  Even if the
   * client does not transmit the document in a compressed form.
   */
  Active = 'active',
}

/**
 * Specifies a number of options which can be used when updating a buckets
 * settings.
 *
 * @category Management
 */
export interface IBucketSettings {
  /**
   * The name of the bucket.
   */
  name: string;

  /**
   * Whether the flush operation (truncating all data in the bucket) should
   * be enabled.
   */
  flushEnabled?: boolean;

  /**
   * The amount of RAM which should be allocated to this bucket, expressed in
   * megabytes.
   */
  ramQuotaMB: number;

  /**
   * The number of replicas that should exist for this bucket.
   */
  numReplicas?: ReplicaNumber;

  /**
   * Whether the indexes on this bucket should be replicated.
   */
  replicaIndexes?: boolean;

  /**
   * Specifies the type of bucket that should be used.
   */
  bucketType?: BucketType | BucketTypeName;

  /**
   * Specifies the storage backend to use for the bucket.
   */
  storageBackend?: StorageBackend | StorageBackendName;

  /**
   * Specifies the ejection method that should be used.
   */
  evictionPolicy?: EvictionPolicy | EvictionPolicyName;

  /**
   * Specifies the maximum expiry time that any document should be permitted
   * to have.  Any documents stored with an expiry configured higher than this
   * will be forced to this number.
   */
  maxExpiry?: number;

  /**
   * Specifies the compression mode that should be used.
   */
  compressionMode?: CompressionMode | CompressionModeName;

  /**
   * Specifies the minimum durability level that should be used for any write
   * operations which are performed against this bucket.
   */
  minimumDurabilityLevel?: DurabilityLevel | DurabilityLevelName;

  /**
   * Specifies the default history retention on all collections in this bucket.
   * Only available on Magma Buckets.
   *
   * @see {@link StorageBackend.Magma}.
   */
  historyRetentionCollectionDefault?: boolean;

  /**
   * Specifies the maximum history retention in bytes on all collections in this bucket.
   */
  historyRetentionBytes?: number;

  /**
   * Specifies the maximum duration in seconds to be covered by the change history that is written
   * to disk for all collections in this bucket.
   */
  historyRetentionDuration?: number;

  /**
   * Same as {@link IBucketSettings.maxExpiry}.
   *
   * @deprecated Use {@link IBucketSettings.maxExpiry} instead.
   */
  maxTTL?: number;

  /**
   * Same as {@link IBucketSettings.minimumDurabilityLevel}, but represented as
   * the raw server-side configuration string.
   *
   * @deprecated Use {@link IBucketSettings.minimumDurabilityLevel} instead.
   */
  durabilityMinLevel?: string;

  /**
   * Same as {@link IBucketSettings.evictionPolicy}, but represented as
   * the raw server-side configuration string.
   *
   * @deprecated Use {@link IBucketSettings.evictionPolicy} instead.
   */
  ejectionMethod?: EvictionPolicy | string;
}

/**
 * Represents the configured options for a bucket.
 *
 * @category Management
 */
export class BucketSettings implements IBucketSettings {
  /**
   * The name of the bucket.
   */
  name: string;

  /**
   * Whether the flush operation (truncating all data in the bucket) should
   * be enabled.
   */
  flushEnabled?: boolean;

  /**
   * The amount of RAM which should be allocated to this bucket, expressed in
   * megabytes.
   */
  ramQuotaMB: number;

  /**
   * The number of replicas that should exist for this bucket.
   */
  numReplicas?: ReplicaNumber;

  /**
   * Whether the indexes on this bucket should be replicated.
   */
  replicaIndexes?: boolean;

  /**
   * Specifies the type of bucket that should be used.
   */
  bucketType?: BucketType;

  /**
   * Specifies the storage backend to use for the bucket.
   */
  storageBackend?: StorageBackend;

  /**
   * Specifies the ejection method that should be used.
   */
  evictionPolicy?: EvictionPolicy;

  /**
   * Specifies the maximum expiry time that any document should be permitted
   * to have.  Any documents stored with an expiry configured higher than this
   * will be forced to this number.
   */
  maxExpiry?: number;

  /**
   * Specifies the compression mode that should be used.
   */
  compressionMode?: CompressionMode;

  /**
   * Specifies the minimum durability level that should be used for any write
   * operations which are performed against this bucket.
   */
  minimumDurabilityLevel?: DurabilityLevel;

  /**
   * Specifies the default history retention on all collections in this bucket.
   * Only available on Magma Buckets.
   *
   * @see {@link StorageBackend.Magma}.
   */
  historyRetentionCollectionDefault?: boolean;

  /**
   * Specifies the maximum history retention in bytes on all collections in this bucket.
   */
  historyRetentionBytes?: number;

  /**
   * Specifies the maximum duration in seconds to be covered by the change history that is written
   * to disk for all collections in this bucket.
   */
  historyRetentionDuration?: number;

  /**
   * @internal
   */
  constructor(data: IBucketSettings) {
    this.name = data.name;
    this.flushEnabled = data.flushEnabled;
    this.ramQuotaMB = data.ramQuotaMB;
    this.numReplicas = data.numReplicas;
    this.replicaIndexes = data.replicaIndexes;
    this.bucketType = toEnumMember(BucketType, data.bucketType);
    this.storageBackend = toEnumMember(StorageBackend, data.storageBackend);
    this.evictionPolicy = toEnumMember(EvictionPolicy, data.evictionPolicy);
    this.maxExpiry = data.maxExpiry;
    this.compressionMode = toEnumMember(CompressionMode, data.compressionMode);
    this.minimumDurabilityLevel = data.minimumDurabilityLevel
      ? nsServerStrToDuraLevel(data.minimumDurabilityLevel)
      : undefined;
    this.historyRetentionCollectionDefault = data.historyRetentionCollectionDefault;
    this.historyRetentionDuration = data.historyRetentionDuration;
    this.historyRetentionBytes = data.historyRetentionBytes;
  }

  /**
   * Same as {@link IBucketSettings.maxExpiry}.
   *
   * @deprecated Use {@link IBucketSettings.maxExpiry} instead.
   */
  get maxTTL(): number {
    return this.maxExpiry ?? 0;
  }
  set maxTTL(val: number) {
    this.maxExpiry = val;
  }

  /**
   * Same as {@link IBucketSettings.evictionPolicy}.
   *
   * @deprecated Use {@link IBucketSettings.evictionPolicy} instead.
   */
  get ejectionMethod(): EvictionPolicy | string {
    return this.evictionPolicy as string;
  }
  set ejectionMethod(val: EvictionPolicy | string) {
    this.evictionPolicy = val as EvictionPolicy;
  }

  /**
   * Same as {@link IBucketSettings.minimumDurabilityLevel}, but represented as
   * the raw server-side configuration string.
   *
   * @deprecated Use {@link IBucketSettings.minimumDurabilityLevel} instead.
   */
  get durabilityMinLevel(): string {
    return duraLevelToNsServerStr(this.minimumDurabilityLevel) as string;
  }

  /**
   * @internal
   */
  static _toCppData(data: IBucketSettings): any {
    return {
      name: data.name,
      bucket_type: bucketTypeToCpp(data.bucketType),
      ram_quota_mb: data.ramQuotaMB,
      max_expiry: data.maxTTL ?? data.maxExpiry,
      compression_mode: bucketCompressionModeToCpp(data.compressionMode),
      minimum_durability_level:
        durabilityToCpp(
          nsServerStrToDuraLevel(data.durabilityMinLevel as DurabilityLevelName)
        ) || durabilityToCpp(data.minimumDurabilityLevel),
      num_replicas: data.numReplicas,
      replica_indexes: data.replicaIndexes,
      flush_enabled: data.flushEnabled,
      eviction_policy: bucketEvictionPolicyToCpp(data.evictionPolicy),
      storage_backend: bucketStorageBackendToCpp(data.storageBackend),
      history_retention_collection_default: data.historyRetentionCollectionDefault,
      history_retention_bytes: data.historyRetentionBytes,
      history_retention_duration: data.historyRetentionDuration,
    };
  }

  /**
   * @internal
   */
  static _fromCppData(data: CppManagementClusterBucketSettings): BucketSettings {
    return new BucketSettings({
      name: data.name,
      flushEnabled: data.flush_enabled,
      ramQuotaMB: data.ram_quota_mb,
      numReplicas: data.num_replicas,
      replicaIndexes: data.replica_indexes,
      bucketType: bucketTypeFromCpp(data.bucket_type),
      storageBackend: bucketStorageBackendFromCpp(data.storage_backend),
      evictionPolicy: bucketEvictionPolicyFromCpp(data.eviction_policy),
      maxExpiry: data.max_expiry,
      compressionMode: bucketCompressionModeFromCpp(data.compression_mode),
      historyRetentionCollectionDefault: data.history_retention_collection_default,
      historyRetentionBytes: data.history_retention_bytes,
      historyRetentionDuration: data.history_retention_duration,
      minimumDurabilityLevel: durabilityFromCpp(data.minimum_durability_level),
      maxTTL: 0,
      durabilityMinLevel: '',
      ejectionMethod: '',
    });
  }
}

/**
 * Specifies a number of settings which can be set when creating a bucket.
 *
 * @category Management
 */
export interface ICreateBucketSettings extends IBucketSettings {
  /**
   * Specifies the conflict resolution mode to use for XDCR of this bucket.
   */
  conflictResolutionType?: ConflictResolutionType | string;
}

/**
 * We intentionally do not export this class as it is never returned back
 * to the user, but we still need the ability to translate to NS data.
 *
 * @internal
 */
class CreateBucketSettings extends BucketSettings implements ICreateBucketSettings {
  /**
   * Specifies the conflict resolution mode to use for XDCR of this bucket.
   */
  conflictResolutionType?: ConflictResolutionType;

  /**
   * @internal
   */
  constructor(data: CreateBucketSettings) {
    super(data);
    this.conflictResolutionType = data.conflictResolutionType;
  }

  /**
   * @internal
   */
  static override _toCppData(data: ICreateBucketSettings): any {
    return {
      ...BucketSettings._toCppData(data),
      conflict_resolution_type: bucketConflictResolutionTypeToCpp(
        data.conflictResolutionType
      ),
    };
  }
}

export type UpdateBucketSettings = Omit<
  RequiredProps<IBucketSettings, 'name' | 'ramQuotaMB'> & Partial<IBucketSettings>,
  'bucketType' | 'storageBackend' | 'replicaIndex' | 'conflictResolutionType'
>;

/**
 * @category Management
 */
export interface CreateBucketOptions {
  /**
   * The timeout for this operation, represented in milliseconds.
   */
  timeout?: number;
}

/**
 * @category Management
 */
export interface UpdateBucketOptions {
  /**
   * The timeout for this operation, represented in milliseconds.
   */
  timeout?: number;
}

/**
 * @category Management
 */
export interface DropBucketOptions {
  /**
   * The timeout for this operation, represented in milliseconds.
   */
  timeout?: number;
}

/**
 * @category Management
 */
export interface GetBucketOptions {
  /**
   * The timeout for this operation, represented in milliseconds.
   */
  timeout?: number;
}

/**
 * @category Management
 */
export interface GetAllBucketsOptions {
  /**
   * The timeout for this operation, represented in milliseconds.
   */
  timeout?: number;
}

/**
 * @category Management
 */
export interface FlushBucketOptions {
  /**
   * The timeout for this operation, represented in milliseconds.
   */
  timeout?: number;
}

/**
 * BucketManager provides an interface for adding/removing/updating
 * buckets within the cluster.
 *
 * @category Management
 */
export class BucketManager<T extends CouchbaseClusterTypes = CouchbaseClusterTypes> {
  private _cluster: Cluster<T>;

  /**
   * @internal
   */
  constructor(cluster: Cluster<T>) {
    this._cluster = cluster;
  }

  /**
   * Creates a new bucket.
   *
   * @param settings The settings to use for the new bucket.
   * @param options Optional parameters for this operation.
   * @param callback A node-style callback to be invoked after execution.
   */
  async createBucket(
    settings: ICreateBucketSettings,
    callback?: VoidNodeCallback
  ): Promise<void>;
  async createBucket(
    settings: ICreateBucketSettings,
    options: CreateBucketOptions,
    callback?: VoidNodeCallback
  ): Promise<void>;
  async createBucket(
    settings: ICreateBucketSettings,
    options?: CreateBucketOptions | VoidNodeCallback,
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

    try {
      const createBucket = promisify(this._cluster.conn.managementBucketCreate).bind(
        this._cluster.conn
      );

      const bucketData = CreateBucketSettings._toCppData(settings);
      await createBucket({
        bucket: bucketData,
        timeout: timeout,
      });
    } catch (cppError: unknown) {
      const err = errorFromCpp(cppError);

      if (callback) {
        callback(err);
        return;
      }

      throw err;
    }
  }

  /**
   * Updates the settings for an existing bucket.
   *
   * @param settings The new settings to use for the bucket.
   * @param options Optional parameters for this operation.
   * @param callback A node-style callback to be invoked after execution.
   */
  async updateBucket(
    settings: UpdateBucketSettings,
    callback?: VoidNodeCallback
  ): Promise<void>;
  async updateBucket(
    settings: UpdateBucketSettings,
    options: UpdateBucketOptions,
    callback?: VoidNodeCallback
  ): Promise<void>;
  async updateBucket(
    settings: UpdateBucketSettings,
    options?: UpdateBucketOptions | VoidNodeCallback,
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

    return PromiseHelper.wrap((wrapCallback) => {
      const bucketData = BucketSettings._toCppData(settings as IBucketSettings);
      this._cluster.conn.managementBucketUpdate(
        {
          bucket: bucketData,
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
   * Drops an existing bucket.
   *
   * @param bucketName The name of the bucket to drop.
   * @param options Optional parameters for this operation.
   * @param callback A node-style callback to be invoked after execution.
   */
  async dropBucket(bucketName: string, callback?: VoidNodeCallback): Promise<void>;
  async dropBucket(
    bucketName: string,
    options: DropBucketOptions,
    callback?: VoidNodeCallback
  ): Promise<void>;
  async dropBucket(
    bucketName: string,
    options?: DropBucketOptions | VoidNodeCallback,
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

    return PromiseHelper.wrap((wrapCallback) => {
      this._cluster.conn.managementBucketDrop(
        {
          name: bucketName,
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
   * Fetches the settings in use for a specified bucket.
   *
   * @param bucketName The name of the bucket to fetch settings for.
   * @param options Optional parameters for this operation.
   * @param callback A node-style callback to be invoked after execution.
   */
  async getBucket(
    bucketName: string,
    callback?: NodeCallback<BucketSettings>
  ): Promise<BucketSettings>;
  async getBucket(
    bucketName: string,
    options: GetBucketOptions,
    callback?: NodeCallback<BucketSettings>
  ): Promise<BucketSettings>;
  async getBucket(
    bucketName: string,
    options?: GetBucketOptions | NodeCallback<BucketSettings>,
    callback?: NodeCallback<BucketSettings>
  ): Promise<BucketSettings> {
    if (options instanceof Function) {
      callback = options;
      options = undefined;
    }
    if (!options) {
      options = {};
    }

    const timeout = options.timeout ?? this._cluster.managementTimeout;

    return PromiseHelper.wrap((wrapCallback) => {
      this._cluster.conn.managementBucketGet(
        {
          name: bucketName,
          timeout: timeout,
        },
        (cppErr, resp) => {
          const err = errorFromCpp(cppErr);
          if (err) {
            return wrapCallback(err, null);
          }

          const bucket = BucketSettings._fromCppData(resp.bucket);

          wrapCallback(null, bucket);
        }
      );
    }, callback);
  }

  /**
   * Returns a list of existing buckets in the cluster.
   *
   * @param options Optional parameters for this operation.
   * @param callback A node-style callback to be invoked after execution.
   */
  async getAllBuckets(
    callback?: NodeCallback<BucketSettings[]>
  ): Promise<BucketSettings[]>;
  async getAllBuckets(
    options: GetAllBucketsOptions,
    callback?: NodeCallback<BucketSettings[]>
  ): Promise<BucketSettings[]>;
  async getAllBuckets(
    options?: GetAllBucketsOptions | NodeCallback<BucketSettings[]>,
    callback?: NodeCallback<BucketSettings[]>
  ): Promise<BucketSettings[]> {
    if (options instanceof Function) {
      callback = options;
      options = undefined;
    }
    if (!options) {
      options = {};
    }

    const timeout = options.timeout ?? this._cluster.managementTimeout;

    return PromiseHelper.wrap((wrapCallback) => {
      this._cluster.conn.managementBucketGetAll(
        {
          timeout: timeout,
        },
        (cppErr, resp) => {
          const err = errorFromCpp(cppErr);
          if (err) {
            return wrapCallback(err, null);
          }

          const buckets = resp.buckets.map((bucketData: any) =>
            BucketSettings._fromCppData(bucketData)
          );

          wrapCallback(null, buckets);
        }
      );
    }, callback);
  }

  /**
   * Flushes the bucket, deleting all the existing data that is stored in it.
   *
   * @param bucketName The name of the bucket to flush.
   * @param options Optional parameters for this operation.
   * @param callback A node-style callback to be invoked after execution.
   */
  async flushBucket(bucketName: string, callback?: VoidNodeCallback): Promise<void>;
  async flushBucket(
    bucketName: string,
    options: FlushBucketOptions,
    callback?: VoidNodeCallback
  ): Promise<void>;
  async flushBucket(
    bucketName: string,
    options?: FlushBucketOptions | VoidNodeCallback,
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

    return PromiseHelper.wrap((wrapCallback) => {
      this._cluster.conn.managementBucketFlush(
        {
          name: bucketName,
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
