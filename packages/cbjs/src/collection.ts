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
import { promisify } from 'node:util';

import {
  ArrayElement,
  BucketName,
  CasInput,
  CollectionName,
  CouchbaseClusterTypes,
  DefaultClusterTypes,
  DocDef,
  DocDefBodyShape,
  DocDefMatchingBody,
  DocDefMatchingKey,
  hasOwn,
  If,
  invariant,
  IsAny,
  IsFuzzyDocument,
  IsNever,
  keyspacePath,
  LookupInMacroResult,
  OneOf,
  ScopeName,
} from '@cbjsdev/shared';

import {
  AppendOptions,
  BinaryCollection,
  DecrementOptions,
  IncrementOptions,
  PrependOptions,
} from './binarycollection.js';
import type {
  CppAppendResponse,
  CppConnection,
  CppDecrementResponse,
  CppDocumentId,
  CppError,
  CppImplSubdocCommand,
  CppIncrementResponse,
  CppInsertResponse,
  CppMutateInResponse,
  CppPrependResponse,
  CppRangeScanOrchestratorOptions,
  CppRemoveResponse,
  CppReplaceResponse,
  CppScanIterator,
  CppUpsertResponse,
} from './binding.js';
import binding, { zeroCas } from './binding.js';
import {
  durabilityToCpp,
  errorFromCpp,
  mutationStateToCpp,
  persistToToCpp,
  replicateToToCpp,
  scanTypeToCpp,
  storeSemanticToCpp,
} from './bindingutilities.js';
import type { Cluster } from './cluster.js';
import {
  AnyCollection,
  CollectionDocDef,
  CollectionDocDefMatchingKey,
  CollectionMatchingDocDef,
  CollectionOptions,
  ExtractCollectionJsonDocDef,
  ExtractCollectionJsonDocKey,
} from './clusterTypes/clusterTypes.js';
import { isLookupInMacro } from './clusterTypes/guards.js';
import type {
  LookupInResultEntries,
  LookupInSpecResults,
  NarrowLookupSpecs,
} from './clusterTypes/kv/lookup/lookupIn.types.js';
import {
  MutateInResultEntries,
  MutateInSpecResults,
  NarrowMutationSpecs,
} from './clusterTypes/kv/mutation/mutateIn.types.js';
import {
  CounterResult,
  ExistsResult,
  GetReplicaResult,
  GetResult,
  LookupInReplicaResult,
  LookupInResult,
  LookupInResultEntry,
  MutateInResult,
  MutateInResultEntry,
  MutationResult,
  ScanResult,
} from './crudoptypes.js';
import {
  DocumentNotFoundError,
  DocumentUnretrievableError,
  InvalidArgumentError,
} from './errors.js';
import { DurabilityLevel, StoreSemantics } from './generaltypes.js';
import { MutationState } from './mutationstate.js';
import { CollectionQueryIndexManager } from './queryindexmanager.js';
import { PrefixScan, RangeScan, SamplingScan } from './rangeScan.js';
import type { Scope } from './scope.js';
import { LookupInMacro, LookupInSpec, MutateInSpec } from './sdspecs.js';
import { SdUtils } from './sdutils.js';
import {
  CouchbaseList,
  CouchbaseMap,
  CouchbaseQueue,
  CouchbaseSet,
} from './services/kv/dataStructures/index.js';
import { ChainableLookupIn } from './services/kv/lookupIn/ChainableLookupIn.js';
import { resolveLookupInArgs } from './services/kv/lookupIn/resolveLookupInArgs.js';
import { LookupResult } from './services/kv/lookupIn/types.js';
import { ChainableMutateIn } from './services/kv/mutateIn/ChainableMutateIn.js';
import { resolveMutateInArgs } from './services/kv/mutateIn/resolveMutateInArgs.js';
import type { MutateInReturnType } from './services/kv/mutateIn/types.js';
import {
  StreamableReplicasPromise,
  StreamableScanPromise,
} from './streamablepromises.js';
import type { Transcoder } from './transcoders.js';
import {
  expiryToTimestamp,
  getDocId,
  NodeCallback,
  PromiseHelper,
  VoidNodeCallback,
} from './utilities.js';

/**
 * @category Key-Value
 */
export interface GetOptions<
  Def extends DocDefBodyShape,
  WithExpiry extends boolean = boolean,
  ThrowIfMissing extends boolean = boolean,
> {
  /**
   * Specifies a list of fields within the document which should be fetched.
   * This allows for easy retrieval of select fields without incurring the
   * overhead of fetching the whole document.
   */
  // TODO
  project?: string | string[];

  /**
   * Indicates that the expiry of the document should be fetched alongside
   * the data itself.
   */
  withExpiry?: WithExpiry;

  /**
   * Specifies an explicit transcoder to use for this specific operation.
   */
  transcoder?: Transcoder;

  /**
   * The timeout for this operation, represented in milliseconds.
   */
  timeout?: number;

  /**
   * When true, throws a `DocumentNotFoundError` if the document is not found.
   * When false, returns undefined.
   * @default true
   */
  throwIfMissing?: ThrowIfMissing;
}

/**
 * @category Key-Value
 */
export interface ExistsOptions {
  /**
   * The timeout for this operation, represented in milliseconds.
   */
  timeout?: number;
}

export type ClientDurabilityOptions = {
  /**
   * Specifies the number of nodes this operation should be persisted to
   * before it is considered successful.  Note that this option is mutually
   * exclusive of {@link durabilityLevel}.
   */
  durabilityPersistTo: number;

  /**
   * Specifies the number of nodes this operation should be replicated to
   * before it is considered successful.  Note that this option is mutually
   * exclusive of {@link durabilityLevel}.
   */
  durabilityReplicateTo: number;
};

export type ServerDurabilityOptions = {
  /**
   * Specifies the level of synchronous durability for this operation.
   */
  durabilityLevel: DurabilityLevel;
};

export type DurabilityOptions = OneOf<[ClientDurabilityOptions, ServerDurabilityOptions]>;

export type MutationOptions = Partial<DurabilityOptions> & {
  /**
   * Specifies the expiry time for this document, specified in seconds.
   */
  expiry?: number;

  /**
   * Specifies that any existing expiry on the document should be preserved.
   */
  preserveExpiry?: boolean;

  /**
   * If specified, indicates that operation should be failed if the CAS
   * has changed from this value, indicating that the document has changed.
   */
  cas?: CasInput;

  /**
   * The timeout for this operation, represented in milliseconds.
   */
  timeout?: number;

  /**
   * Specifies an explicit transcoder to use for this specific operation.
   */
  transcoder?: Transcoder;
};

/**
 * @category Key-Value
 */
export type InsertOptions = Omit<MutationOptions, 'cas' | 'preserveExpiry'>;

/**
 * @category Key-Value
 */
export type UpsertOptions = Omit<MutationOptions, 'cas'>;

/**
 * @category Key-Value
 */
export type ReplaceOptions = MutationOptions;

/**
 * @category Key-Value
 */
export type RemoveOptions = Omit<
  MutationOptions,
  'expiry' | 'preserveExpiry' | 'transcoder'
>;

/**
 * @category Key-Value
 */
export interface GetAnyReplicaOptions<ThrowIfMissing extends boolean = boolean> {
  /**
   * Specifies an explicit transcoder to use for this specific operation.
   */
  transcoder?: Transcoder;

  /**
   * The timeout for this operation, represented in milliseconds.
   */
  timeout?: number;

  /**
   * When true, throws a `DocumentNotFoundError` if the document is not found.
   * When false, returns undefined.
   * @default true
   */
  throwIfMissing?: ThrowIfMissing;
}

/**
 * @category Key-Value
 */
export interface GetAllReplicasOptions {
  /**
   * Specifies an explicit transcoder to use for this specific operation.
   */
  transcoder?: Transcoder;

  /**
   * The timeout for this operation, represented in milliseconds.
   */
  timeout?: number;
}

/**
 * @category Key-Value
 */
export interface TouchOptions {
  /**
   * Specifies the level of synchronous durability for this operation.
   */
  durabilityLevel?: DurabilityLevel;

  /**
   * The timeout for this operation, represented in milliseconds.
   */
  timeout?: number;
}

/**
 * @category Key-Value
 */
export interface GetAndTouchOptions {
  /**
   * Specifies an explicit transcoder to use for this specific operation.
   */
  transcoder?: Transcoder;

  /**
   * The timeout for this operation, represented in milliseconds.
   */
  timeout?: number;
}

/**
 * @category Key-Value
 */
export interface GetAndLockOptions {
  /**
   * Specifies an explicit transcoder to use for this specific operation.
   */
  transcoder?: Transcoder;

  /**
   * The timeout for this operation, represented in milliseconds.
   */
  timeout?: number;
}

/**
 * @category Key-Value
 */
export interface UnlockOptions {
  /**
   * The timeout for this operation, represented in milliseconds.
   */
  timeout?: number;
}

/**
 * @category Key-Value
 */
export interface LookupInOptions<ThrowOnSpecError extends boolean = false> {
  /**
   * The timeout for this operation, represented in milliseconds.
   */
  timeout?: number;

  /**
   * For internal use only - allows access to deleted documents that are in 'tombstone' form
   *
   * @internal
   */
  accessDeleted?: boolean;

  /**
   * When `true`, the operation will throw if any {@link LookupInSpec} fails.
   * The first spec error will be thrown.
   *
   * @default false
   */
  throwOnSpecError?: ThrowOnSpecError;
}

/**
 * @category Key-Value
 */
export interface LookupInAnyReplicaOptions<ThrowOnSpecError extends boolean = false> {
  /**
   * The timeout for this operation, represented in milliseconds.
   */
  timeout?: number;

  /**
   * When `true`, the operation will throw if any {@link LookupInSpec} fails.
   * The first spec error will be thrown.
   *
   * @default false
   */
  throwOnSpecError?: ThrowOnSpecError;
}

/**
 * @category Key-Value
 */
export interface LookupInAllReplicasOptions<ThrowOnSpecError extends boolean = false> {
  /**
   * The timeout for this operation, represented in milliseconds.
   */
  timeout?: number;

  /**
   * When `true`, the operation will throw if any {@link LookupInSpec} fails.
   * The first spec error will be thrown.
   *
   * @default false
   */
  throwOnSpecError?: ThrowOnSpecError;
}

/**
 * @category Key-Value
 */
export type MutateInOptions = MutationOptions & {
  /**
   * Specifies the store semantics to use for this operation.
   */
  storeSemantics?: StoreSemantics;

  /**
   * Specifies whether the operation should be performed with upsert semantics,
   * creating the document if it does not already exist.
   *
   * @deprecated Use {@link MutateInOptions.storeSemantics} instead.
   */
  upsertDocument?: boolean;
};

/**
 * @category Key-Value
 */
export interface ScanOptions {
  /**
   * Specifies an explicit transcoder to use for this specific operation.
   */
  transcoder?: Transcoder;

  /**
   * The timeout for this operation, represented in milliseconds.
   */
  timeout?: number;

  /**
   * If the scan should only return document ids.
   */
  idsOnly?: boolean;

  /**
   * The limit applied to the number of bytes returned from the server
   * for each partition batch.
   */
  batchByteLimit?: number;

  /**
   * The limit applied to the number of items returned from the server
   * for each partition batch.
   */
  batchItemLimit?: number;

  /**
   * Specifies a MutationState which the scan should be consistent with.
   *
   * @see MutationState
   */
  consistentWith?: MutationState;

  /**
   * Specifies the number of vBuckets which the client should scan in parallel.
   */
  concurrency?: number;
}

/**
 * Exposes the operations which are available to be performed against a collection.
 * Namely the ability to perform KV operations.
 *
 * @category Core
 */
export class Collection<
  in out T extends CouchbaseClusterTypes = DefaultClusterTypes,
  in out B extends BucketName<T> = BucketName<T>,
  in out S extends ScopeName<T, B> = ScopeName<T, B>,
  in out C extends CollectionName<T, B, S> = CollectionName<T, B, S>,
> {
  /**
   * @internal
   */
  readonly DEFAULT_NAME = '_default';

  readonly scope: Scope<T, B, S>;
  readonly name: C;
  readonly conn: CppConnection;
  readonly kvScanTimeout: number;
  readonly scanBatchItemLimit: number;
  readonly scanBatchByteLimit: number;

  /**
  @internal
  */
  constructor(scope: Scope<T, B, S>, collectionName: C) {
    this.scope = scope;
    this.name = collectionName;
    this.conn = scope.conn;
    this.kvScanTimeout = 75000;
    this.scanBatchByteLimit = 15000;
    this.scanBatchItemLimit = 50;
  }

  /**
  @internal
  */
  get cluster(): Cluster<T> {
    return this.scope.bucket.cluster;
  }

  getKeyspace() {
    return {
      bucket: this.scope.bucket.name,
      scope: this.scope.name,
      collection: this.name,
    };
  }

  getKeyspacePath() {
    return keyspacePath(this.getKeyspace());
  }

  /**
  @internal
  */
  get transcoder(): Transcoder {
    return this.scope.transcoder;
  }

  /**
  @internal
  */
  _mutationTimeout(durabilityLevel?: DurabilityLevel): number {
    if (
      durabilityLevel !== undefined &&
      durabilityLevel !== null &&
      durabilityLevel !== DurabilityLevel.None
    ) {
      return this.cluster.kvDurableTimeout;
    }
    return this.cluster.kvTimeout;
  }

  /**
   * @internal
   */
  getDocId(key: string): CppDocumentId {
    return getDocId(this as AnyCollection, key);
  }

  private encodeSubDocument(value: any): any {
    return Buffer.from(value);
  }

  private decodeSubDocument(bytes: Buffer): any {
    try {
      return JSON.parse(bytes.toString('utf8'));
    } catch (e) {
      // If we encounter a parse error, assume that we need
      // to return bytes instead of an object.
      return bytes;
    }
  }

  async get<
    const Key extends CollectionDocDef<this>['Key'],
    Doc extends DocDefMatchingKey<Key, T, B, S, C>['Body'],
    WithExpiry extends boolean = false,
    ThrowIfMissing extends boolean = true,
  >(
    key: Key,
    callbackOrOptions?:
      | GetOptions<Doc, WithExpiry, ThrowIfMissing>
      | NodeCallback<GetResult<Doc, WithExpiry>>
  ): Promise<CollectionGetReturn<Doc, WithExpiry, ThrowIfMissing>>;

  async get<
    const Key extends CollectionDocDef<this>['Key'],
    Doc extends DocDefMatchingKey<Key, T, B, S, C>['Body'],
    WithExpiry extends boolean = false,
    ThrowIfMissing extends boolean = true,
  >(
    key: Key,
    options: GetOptions<Doc, WithExpiry, ThrowIfMissing>,
    callback: NodeCallback<GetResult<Doc, WithExpiry>>
  ): Promise<CollectionGetReturn<Doc, WithExpiry, ThrowIfMissing>>;
  /**
   * Retrieves the value of a document from the collection.
   *
   * @param key The document key to retrieve.
   * @param options Optional parameters for this operation.
   * @param callback Optional node-style callback to be invoked after execution.
   */
  async get<
    const Key extends CollectionDocDef<this>['Key'],
    Doc extends DocDefMatchingKey<Key, T, B, S, C>['Body'],
    WithExpiry extends boolean,
    ThrowIfMissing extends boolean = true,
  >(
    key: Key,
    options?:
      | GetOptions<Doc, WithExpiry, ThrowIfMissing>
      | NodeCallback<GetResult<Doc, WithExpiry>>,
    callback?: NodeCallback<GetResult<Doc, WithExpiry>>
  ): Promise<CollectionGetReturn<Doc, WithExpiry, ThrowIfMissing>> {
    if (options instanceof Function) {
      callback = options;
      options = undefined;
    }

    if (!options) {
      options = {};
    }

    if (options.project !== undefined || options.withExpiry === true) {
      return this._projectedGet(key as never, options, callback);
    }

    const transcoder = options.transcoder ?? this.transcoder;
    const timeout = options.timeout ?? this.cluster.kvTimeout;
    const docId = this.getDocId(key);

    const get = promisify(this.conn.get).bind(this.conn);

    try {
      const response = await get({
        id: docId,
        timeout,
        partition: 0,
        opaque: 0,
      });

      const docBody = transcoder.decode(response.value, response.flags);
      const result = new GetResult({
        content: docBody,
        cas: response.cas,
      });

      if (callback) {
        callback(null, result);
      }

      return result;
    } catch (cppError: unknown) {
      const err = errorFromCpp(cppError as CppError);

      if (callback) {
        callback(err, null);
      }

      const { throwIfMissing = true } = options;

      if (!throwIfMissing && err instanceof DocumentNotFoundError) {
        return undefined as CollectionGetReturn<Doc, WithExpiry, ThrowIfMissing>;
      }

      throw err;
    }
  }

  private async _projectedGet<
    Def extends DocDefMatchingKey<Key, T, B, S, C>,
    Key extends ExtractCollectionJsonDocKey<this>,
    WithExpiry extends boolean = boolean,
  >(
    key: Key,
    options: GetOptions<Def, WithExpiry>,
    callback?: NodeCallback<GetResult>
  ): Promise<GetResult> {
    let expiryStart = -1;
    let projStart = -1;
    let paths: string[] = [];
    let specs: LookupInSpec[] = [];
    let needReproject = false;

    if (options.withExpiry) {
      expiryStart = specs.length;
      specs.push(LookupInSpec.get(LookupInMacro.Expiry));
    }

    projStart = specs.length;
    if (!options.project) {
      paths = [''];
      specs.push(LookupInSpec.get(''));
    } else {
      const projects: string[] = Array.isArray(options.project)
        ? options.project
        : [options.project];

      for (const projection of projects) {
        const specPath: string = isLookupInMacro(projection)
          ? projection._value
          : projection;

        paths.push(specPath);
        specs.push(LookupInSpec.get(projection));
      }
    }

    // The following code relies on the projections being
    // the last segment of the specs array, this way we handle
    // an overburdened operation in a single area.
    if (specs.length > 16) {
      specs = specs.splice(0, projStart);
      specs.push(LookupInSpec.get(''));
      needReproject = true;
    }

    try {
      const res = await this.lookupIn(key, specs as never, {
        ...options,
      });

      let content: any = null;
      let expiry: number | undefined = undefined;

      if (expiryStart >= 0) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const expiryRes = res.content[expiryStart] as LookupInResultEntry<
          LookupInMacroResult<typeof LookupInMacro.Expiry>
        >;
        expiry = expiryRes.value;
      }

      if (projStart >= 0) {
        if (!needReproject) {
          for (let i = 0; i < paths.length; ++i) {
            const projPath = paths[i];
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            const projRes = res.content[projStart + i] as LookupInResultEntry;
            if (!projRes.error) {
              content = SdUtils.insertByPath(content, projPath, projRes.value);
            }
          }
        } else {
          content = {};

          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          const reprojRes = res.content[projStart] as LookupInResultEntry;
          for (const reprojPath of paths) {
            const value = SdUtils.getByPath(reprojRes.value, reprojPath);
            content = SdUtils.insertByPath(content, reprojPath, value);
          }
        }
      }

      const result = new GetResult({
        content: content,
        cas: res.cas,
        expiryTime: expiry as never,
      });

      if (callback) {
        callback(null, result);
      }

      return result;
    } catch (cppError: unknown) {
      const err = errorFromCpp(cppError as CppError);

      if (callback) {
        callback(err, null);
      }

      throw err;
    }
  }
  /**
   * Checks whether a specific document exists or not.
   *
   * @param key The document key to check for existence.
   * @param callback A node-style callback to be invoked after execution.
   */
  async exists<Key extends CollectionDocDef<this>['Key']>(
    key: Key,
    callback?: NodeCallback<ExistsResult>
  ): Promise<ExistsResult>;
  /**
   * Checks whether a specific document exists or not.
   *
   * @param key The document key to check for existence.
   * @param options Optional parameters for this operation.
   * @param callback A node-style callback to be invoked after execution.
   */
  async exists<Key extends CollectionDocDef<this>['Key']>(
    key: Key,
    options: ExistsOptions,
    callback?: NodeCallback<ExistsResult>
  ): Promise<ExistsResult>;
  async exists<Key extends CollectionDocDef<this>['Key']>(
    key: Key,
    options?: ExistsOptions | NodeCallback<ExistsResult>,
    callback?: NodeCallback<ExistsResult>
  ): Promise<ExistsResult> {
    if (options instanceof Function) {
      callback = options;
      options = undefined;
    }
    if (!options) {
      options = {};
    }

    const timeout = options.timeout ?? this.cluster.kvTimeout;
    const exists = promisify(this.conn.exists).bind(this.conn);

    try {
      const response = await exists({
        id: this.getDocId(key),
        partition: 0,
        opaque: 0,
        timeout,
      });

      const result = new ExistsResult({
        cas: response.deleted ? undefined : response.cas,
        exists: response.deleted ? false : response.document_exists,
      });

      if (callback) {
        callback(null, result);
      }

      return result;
    } catch (cppError: unknown) {
      const err = errorFromCpp(cppError as CppError);

      if (callback) {
        callback(err, null);
      }

      throw err;
    }
  }

  /**
   * @internal
   */
  private _getReplica(
    key: string,
    getAllReplicas: boolean,
    options: { transcoder?: Transcoder; timeout?: number }
  ): StreamableReplicasPromise<
    [GetReplicaResult<unknown>, ...GetReplicaResult<unknown>[]],
    GetReplicaResult<unknown>
  >;
  private _getReplica(
    key: string,
    getAllReplicas: boolean
  ): StreamableReplicasPromise<
    [GetReplicaResult<unknown>, ...GetReplicaResult<unknown>[]],
    GetReplicaResult<unknown>
  >;
  private _getReplica(
    key: string,
    getAllReplicas: boolean,
    options?: { transcoder?: Transcoder; timeout?: number }
  ): StreamableReplicasPromise<
    [GetReplicaResult<unknown>, ...GetReplicaResult<unknown>[]],
    GetReplicaResult<unknown>
  > {
    if (!options) {
      options = {};
    }

    const emitter = new StreamableReplicasPromise<
      [GetReplicaResult<unknown>, ...GetReplicaResult<unknown>[]],
      GetReplicaResult<unknown>
    >(
      (replicas: [GetReplicaResult<unknown>, ...GetReplicaResult<unknown>[]]) => replicas
    );

    const transcoder = options.transcoder ?? this.transcoder;
    const timeout = options.timeout ?? this.cluster.kvTimeout;
    const request = {
      id: this.getDocId(key),
      timeout: timeout,
    };

    const getReplicas = getAllReplicas
      ? this.conn.getAllReplicas.bind(this.conn)
      : this.conn.getAnyReplica.bind(this.conn);

    getReplicas(request, (cppErr, res) => {
      const err = errorFromCpp(cppErr);
      if (err) {
        emitter.emit('error', err);
        emitter.emit('end');
        return;
      }

      const responses = hasOwn(res, 'entries') ? res.entries : [res];

      responses.forEach((response) => {
        try {
          const docBody = transcoder.decode(response.value, response.flags);

          emitter.emit(
            'replica',
            new GetReplicaResult({
              content: docBody,
              cas: response.cas,
              isReplica: response.replica,
            })
          );

          emitter.emit('end');
        } catch (err) {
          invariant(err instanceof Error);

          emitter.emit('error', err);
          emitter.emit('end');
        }
      });
    });

    return emitter;
  }

  /**
   * Retrieves the value of the document from any of the available replicas.  This
   * will return as soon as the first response is received from any replica node.
   *
   * @overload
   * @param key The document key to retrieve.
   * @param options Optional parameters for this operation.
   * @param callback A node-style callback to be invoked after execution.
   */
  async getAnyReplica<
    Key extends CollectionDocDef<this>['Key'],
    Def extends DocDefMatchingKey<Key, T, B, S, C>,
    ThrowIfMissing extends boolean = true,
  >(
    key: Key,
    options: GetAnyReplicaOptions<ThrowIfMissing>,
    callback?: NodeCallback<GetReplicaResult<Def['Body']>>
  ): Promise<CollectionGetAnyReplicaReturn<Def['Body'], ThrowIfMissing>>;

  /**
   * Retrieves the value of the document from any of the available replicas.  This
   * will return as soon as the first response is received from any replica node.
   *
   * @overload
   * @param key The document key to retrieve.
   * @param callbackOrOptions A node-style callback to be invoked after execution.
   */
  async getAnyReplica<
    Key extends CollectionDocDef<this>['Key'],
    Def extends DocDefMatchingKey<Key, T, B, S, C>,
    ThrowIfMissing extends boolean = true,
  >(
    key: Key,
    callbackOrOptions?:
      | GetAnyReplicaOptions<ThrowIfMissing>
      | NodeCallback<GetReplicaResult<Def['Body']>>
  ): Promise<CollectionGetAnyReplicaReturn<Def['Body'], ThrowIfMissing>>;

  async getAnyReplica<
    Key extends CollectionDocDef<this>['Key'],
    Def extends DocDefMatchingKey<Key, T, B, S, C>,
    ThrowIfMissing extends boolean = true,
  >(
    key: Key,
    options?:
      | GetAnyReplicaOptions<ThrowIfMissing>
      | NodeCallback<GetReplicaResult<Def['Body']>>,
    callback?: NodeCallback<GetReplicaResult<Def['Body']>>
  ): Promise<CollectionGetAnyReplicaReturn<Def['Body'], ThrowIfMissing>> {
    if (options instanceof Function) {
      callback = options;
      options = undefined;
    }

    if (!options) {
      options = {};
    }

    try {
      const response = await this._getReplica(
        key,
        false,
        options as GetAnyReplicaOptions
      );

      const result = response[0];

      if (callback) {
        callback(null, result as Def['Body']);
      }

      return result as Def['Body'];
    } catch (cppError: unknown) {
      const err = errorFromCpp(cppError as CppError);

      if (callback) {
        callback(err, null);
      }

      const { throwIfMissing = true } = options;

      if (!throwIfMissing && err instanceof DocumentUnretrievableError) {
        return undefined as CollectionGetAnyReplicaReturn<Def['Body'], ThrowIfMissing>;
      }

      throw err;
    }
  }

  getAllReplicas<
    Key extends CollectionDocDef<this>['Key'],
    Def extends DocDefMatchingKey<Key, T, B, S, C>,
  >(
    key: Key,
    callbackOrOptions?:
      | GetAllReplicasOptions
      | NodeCallback<[GetReplicaResult<Def['Body']>, ...GetReplicaResult<Def['Body']>[]]>
  ): StreamableReplicasPromise<
    [GetReplicaResult<Def['Body']>, ...GetReplicaResult<Def['Body']>[]],
    GetReplicaResult<Def['Body']>
  >;
  /**
   * Retrieves the value of the document from all available replicas.  Note that
   * as replication is asynchronous, each node may return a different value.
   *
   * @param key The document key to retrieve.
   * @param options Optional parameters for this operation.
   * @param callback A node-style callback to be invoked after execution.
   */
  getAllReplicas<
    Key extends CollectionDocDef<this>['Key'],
    Def extends DocDefMatchingKey<Key, T, B, S, C>,
  >(
    key: Key,
    options: GetAllReplicasOptions,
    callback?: NodeCallback<
      [GetReplicaResult<Def['Body']>, ...GetReplicaResult<Def['Body']>[]]
    >
  ): StreamableReplicasPromise<
    [GetReplicaResult<Def['Body']>, ...GetReplicaResult<Def['Body']>[]],
    GetReplicaResult<Def['Body']>
  >;
  getAllReplicas<
    Key extends CollectionDocDef<this>['Key'],
    Def extends DocDefMatchingKey<Key, T, B, S, C>,
  >(
    key: Key,
    options?:
      | GetAllReplicasOptions
      | NodeCallback<[GetReplicaResult<Def['Body']>, ...GetReplicaResult<Def['Body']>[]]>,
    callback?: NodeCallback<
      [GetReplicaResult<Def['Body']>, ...GetReplicaResult<Def['Body']>[]]
    >
  ): StreamableReplicasPromise<
    [GetReplicaResult<Def['Body']>, ...GetReplicaResult<Def['Body']>[]],
    GetReplicaResult<Def['Body']>
  > {
    if (options instanceof Function) {
      callback = options;
      options = undefined;
    }
    if (!options) {
      options = {};
    }

    return PromiseHelper.wrapAsync(
      () => this._getReplica(key, true, options) as Def['Body'],
      callback
    );
  }

  /**
   * Inserts a new document to the collection, failing if the document already exists.
   *
   * @param key The document key to insert.
   * @param value The value of the document to insert.
   * @param options Optional parameters for this operation.
   * @param callback A node-style callback to be invoked after execution.
   */
  async insert<
    Key extends CollectionDocDef<this>['Key'],
    Def extends DocDefMatchingKey<Key, T, B, S, C>,
  >(
    key: Key,
    value: Def['Body'],
    options: InsertOptions,
    callback?: NodeCallback<MutationResult>
  ): Promise<MutationResult>;
  async insert<
    Key extends CollectionDocDef<this>['Key'],
    Def extends DocDefMatchingKey<Key, T, B, S, C>,
  >(
    key: Key,
    value: Def['Body'],
    callback?: NodeCallback<MutationResult>
  ): Promise<MutationResult>;
  async insert(
    key: string,
    value: unknown,
    options?: InsertOptions | NodeCallback<MutationResult>,
    callback?: NodeCallback<MutationResult>
  ): Promise<MutationResult> {
    if (options instanceof Function) {
      callback = options;
      options = undefined;
    }
    if (!options) {
      options = {};
    }

    const expiry = options.expiry ? expiryToTimestamp(options.expiry) : 0;
    const transcoder = options.transcoder ?? this.transcoder;
    const durabilityLevel = options.durabilityLevel;
    const persistTo = options.durabilityPersistTo;
    const replicateTo = options.durabilityReplicateTo;
    const timeout = options.timeout ?? this._mutationTimeout(durabilityLevel);

    try {
      const [bytes, flags] = transcoder.encode(value);

      const insertReq = {
        id: this.getDocId(key),
        value: bytes,
        flags,
        expiry,
        timeout,
        partition: 0,
        opaque: 0,
      };

      let insert: (() => Promise<CppInsertResponse>) | undefined = undefined;

      if (persistTo !== undefined || replicateTo !== undefined) {
        insert = promisify(this.conn.insertWithLegacyDurability).bind(this.conn, {
          ...insertReq,
          persist_to: persistToToCpp(persistTo),
          replicate_to: replicateToToCpp(replicateTo),
        });
      } else {
        insert = promisify(this.conn.insert).bind(this.conn, {
          ...insertReq,
          durability_level: durabilityToCpp(durabilityLevel),
        });
      }

      const response = await insert();
      const result = new MutationResult({
        cas: response.cas,
        token: response.token,
      });

      if (callback) {
        callback(null, result);
      }

      return result;
    } catch (cppError: unknown) {
      const err = errorFromCpp(cppError as CppError);

      if (callback) {
        callback(err, null);
      }

      throw err;
    }
  }

  /**
   * Upserts a document to the collection.  This operation succeeds whether or not the
   * document already exists.
   *
   * @param key The document key to upsert.
   * @param value The new value for the document.
   * @param options Optional parameters for this operation.
   * @param callback A node-style callback to be invoked after execution.
   */
  async upsert<
    Key extends CollectionDocDef<this>['Key'],
    Def extends DocDefMatchingKey<Key, T, B, S, C>,
  >(
    key: Key,
    value: Def['Body'],
    options: UpsertOptions,
    callback?: NodeCallback<MutationResult>
  ): Promise<MutationResult>;
  async upsert<
    Key extends CollectionDocDef<this>['Key'],
    Def extends DocDefMatchingKey<Key, T, B, S, C>,
  >(
    key: Key,
    value: Def['Body'],
    callback?: NodeCallback<MutationResult>
  ): Promise<MutationResult>;
  async upsert(
    key: string,
    value: unknown,
    options?: UpsertOptions | NodeCallback<MutationResult>,
    callback?: NodeCallback<MutationResult>
  ): Promise<MutationResult> {
    if (options instanceof Function) {
      callback = options;
      options = undefined;
    }
    if (!options) {
      options = {};
    }

    const expiry = options.expiry ? expiryToTimestamp(options.expiry) : 0;
    const preserve_expiry = options.preserveExpiry ?? false;
    const transcoder = options.transcoder ?? this.transcoder;
    const durabilityLevel = options.durabilityLevel;
    const persistTo = options.durabilityPersistTo;
    const replicateTo = options.durabilityReplicateTo;
    const timeout = options.timeout ?? this._mutationTimeout(durabilityLevel);

    try {
      const [bytes, flags] = transcoder.encode(value);
      const upsertReq = {
        id: this.getDocId(key),
        value: bytes,
        flags,
        expiry,
        preserve_expiry,
        timeout,
        partition: 0,
        opaque: 0,
      };

      let upsert: (() => Promise<CppUpsertResponse>) | undefined = undefined;

      if (persistTo !== undefined || replicateTo !== undefined) {
        upsert = promisify(this.conn.upsertWithLegacyDurability).bind(this.conn, {
          ...upsertReq,
          persist_to: persistToToCpp(persistTo),
          replicate_to: replicateToToCpp(replicateTo),
        });
      } else {
        upsert = promisify(this.conn.upsert).bind(this.conn, {
          ...upsertReq,
          durability_level: durabilityToCpp(durabilityLevel),
        });
      }

      const response = await upsert();
      const result = new MutationResult({
        cas: response.cas,
        token: response.token,
      });

      if (callback) {
        callback(null, result);
      }

      return result;
    } catch (cppError: unknown) {
      const err = errorFromCpp(cppError as CppError);

      if (callback) {
        callback(err, null);
      }

      throw err;
    }
  }

  /**
   * Replaces the value of an existing document.  Failing if the document does not exist.
   *
   * @param key The document key to replace.
   * @param value The new value for the document.
   * @param options Optional parameters for this operation.
   * @param callback A node-style callback to be invoked after execution.
   */
  async replace<
    Key extends CollectionDocDef<this>['Key'],
    Def extends DocDefMatchingKey<Key, T, B, S, C>,
  >(
    key: Key,
    value: Def['Body'],
    options: ReplaceOptions,
    callback?: NodeCallback<MutationResult>
  ): Promise<MutationResult>;
  async replace<
    Key extends CollectionDocDef<this>['Key'],
    Def extends DocDefMatchingKey<Key, T, B, S, C>,
  >(
    key: Key,
    value: Def['Body'],
    callback?: NodeCallback<MutationResult>
  ): Promise<MutationResult>;
  async replace(
    key: string,
    value: unknown,
    options?: ReplaceOptions | NodeCallback<MutationResult>,
    callback?: NodeCallback<MutationResult>
  ): Promise<MutationResult> {
    if (options instanceof Function) {
      callback = options;
      options = undefined;
    }
    if (!options) {
      options = {};
    }

    const expiry = options.expiry ? expiryToTimestamp(options.expiry) : 0;
    const cas = options.cas ?? zeroCas;
    const preserve_expiry = options.preserveExpiry ?? false;
    const transcoder = options.transcoder ?? this.transcoder;
    const durabilityLevel = options.durabilityLevel;
    const persistTo = options.durabilityPersistTo;
    const replicateTo = options.durabilityReplicateTo;
    const timeout = options.timeout ?? this._mutationTimeout(durabilityLevel);

    try {
      const [bytes, flags] = transcoder.encode(value);
      const replaceReq = {
        id: this.getDocId(key),
        value: bytes,
        flags,
        expiry,
        cas,
        preserve_expiry,
        timeout,
        partition: 0,
        opaque: 0,
      };

      let replace: (() => Promise<CppReplaceResponse>) | undefined = undefined;

      if (persistTo !== undefined || replicateTo !== undefined) {
        replace = promisify(this.conn.replaceWithLegacyDurability).bind(this.conn, {
          ...replaceReq,
          persist_to: persistToToCpp(persistTo),
          replicate_to: replicateToToCpp(replicateTo),
        });
      } else {
        replace = promisify(this.conn.replace).bind(this.conn, {
          ...replaceReq,
          durability_level: durabilityToCpp(durabilityLevel),
        });
      }

      const response = await replace();
      const result = new MutationResult({
        cas: response.cas,
        token: response.token,
      });

      if (callback) {
        callback(null, result);
      }

      return result;
    } catch (cppError: unknown) {
      const err = errorFromCpp(cppError as CppError);

      if (callback) {
        callback(err, null);
      }

      throw err;
    }
  }

  /**
   * Remove an existing document from the collection.
   *
   * @param key The document key to remove.
   * @param options Optional parameters for this operation.
   * @param callback A node-style callback to be invoked after execution.
   */
  async remove<Key extends CollectionDocDef<this>['Key']>(
    key: Key,
    options: RemoveOptions,
    callback?: NodeCallback<MutationResult>
  ): Promise<MutationResult>;
  async remove<Key extends CollectionDocDef<this>['Key']>(
    key: Key,
    callback?: NodeCallback<MutationResult>
  ): Promise<MutationResult>;
  async remove(
    key: string,
    options?: RemoveOptions | NodeCallback<MutationResult>,
    callback?: NodeCallback<MutationResult>
  ): Promise<MutationResult> {
    if (options instanceof Function) {
      callback = options;
      options = undefined;
    }
    if (!options) {
      options = {};
    }

    const cas = options.cas ?? zeroCas;
    const durabilityLevel = options.durabilityLevel;
    const persistTo = options.durabilityPersistTo;
    const replicateTo = options.durabilityReplicateTo;
    const timeout = options.timeout ?? this._mutationTimeout(durabilityLevel);

    try {
      const removeReq = {
        id: this.getDocId(key),
        cas,
        timeout,
        partition: 0,
        opaque: 0,
      };

      let remove: (() => Promise<CppRemoveResponse>) | undefined = undefined;

      if (persistTo !== undefined || replicateTo !== undefined) {
        remove = promisify(this.conn.removeWithLegacyDurability).bind(this.conn, {
          ...removeReq,
          persist_to: persistToToCpp(persistTo),
          replicate_to: replicateToToCpp(replicateTo),
        });
      } else {
        remove = promisify(this.conn.remove).bind(this.conn, {
          ...removeReq,
          durability_level: durabilityToCpp(durabilityLevel),
        });
      }

      const response = await remove();
      const result = new MutationResult({
        cas: response.cas,
        token: response.token,
      });

      if (callback) {
        callback(null, result);
      }

      return result;
    } catch (cppError: unknown) {
      const err = errorFromCpp(cppError as CppError);

      if (callback) {
        callback(err, null);
      }

      throw err;
    }
  }

  /**
   * Retrieves the value of the document and simultaneously updates the expiry time
   * for the same document.
   *
   * @param key The document to fetch and touch.
   * @param expiry The new expiry to apply to the document, specified in seconds.
   * @param options Optional parameters for this operation.
   * @param callback A node-style callback to be invoked after execution.
   */
  async getAndTouch<
    Key extends CollectionDocDef<this>['Key'],
    Def extends DocDefMatchingKey<Key, T, B, S, C>,
  >(
    key: Key,
    expiry: number,
    options: GetAndTouchOptions,
    callback?: NodeCallback<GetResult<Def['Body']>>
  ): Promise<GetResult<Def['Body']>>;
  async getAndTouch<
    Key extends CollectionDocDef<this>['Key'],
    Def extends DocDefMatchingKey<Key, T, B, S, C>,
  >(
    key: Key,
    expiry: number,
    callback?: NodeCallback<GetResult<Def['Body']>>
  ): Promise<GetResult<Def['Body']>>;
  async getAndTouch(
    key: string,
    expiry: number,
    options?: GetAndTouchOptions | NodeCallback<GetResult<unknown>>,
    callback?: NodeCallback<GetResult<unknown>>
  ): Promise<GetResult<unknown>> {
    if (options instanceof Function) {
      callback = options;
      options = undefined;
    }
    if (!options) {
      options = {};
    }

    const transcoder = options.transcoder ?? this.transcoder;
    const timeout = options.timeout ?? this.cluster.kvTimeout;

    try {
      const getAndTouch = promisify(this.conn.getAndTouch).bind(this.conn);

      const response = await getAndTouch({
        id: this.getDocId(key),
        expiry: expiryToTimestamp(expiry),
        timeout,
        partition: 0,
        opaque: 0,
      });

      const docBody = transcoder.decode(response.value, response.flags);

      const result = new GetResult({
        content: docBody,
        cas: response.cas,
      });

      if (callback) {
        callback(null, result);
      }

      return result;
    } catch (cppError: unknown) {
      const err = errorFromCpp(cppError as CppError);

      if (callback) {
        callback(err, null);
      }

      throw err;
    }
  }

  /**
   * Updates the expiry on an existing document.
   *
   * @param key The document key to touch.
   * @param expiry The new expiry to set for the document, specified in seconds.
   * @param options Optional parameters for this operation.
   * @param callback A node-style callback to be invoked after execution.
   */
  async touch<Key extends CollectionDocDef<this>['Key']>(
    key: Key,
    expiry: number,
    options: TouchOptions,
    callback?: NodeCallback<MutationResult<undefined>>
  ): Promise<MutationResult<undefined>>;
  async touch<Key extends CollectionDocDef<this>['Key']>(
    key: Key,
    expiry: number,
    callback?: NodeCallback<MutationResult<undefined>>
  ): Promise<MutationResult<undefined>>;
  async touch(
    key: string,
    expiry: number,
    options?: TouchOptions | NodeCallback<MutationResult<undefined>>,
    callback?: NodeCallback<MutationResult<undefined>>
  ): Promise<MutationResult<undefined>> {
    if (options instanceof Function) {
      callback = options;
      options = undefined;
    }
    if (!options) {
      options = {};
    }

    const timeout = options.timeout ?? this.cluster.kvTimeout;

    try {
      const touch = promisify(this.conn.touch).bind(this.conn);

      const response = await touch({
        id: this.getDocId(key),
        expiry: expiryToTimestamp(expiry),
        timeout,
        partition: 0,
        opaque: 0,
      });

      const result = new MutationResult({
        cas: response.cas,
        token: undefined,
      });

      if (callback) {
        callback(null, result);
      }

      return result;
    } catch (cppError: unknown) {
      const err = errorFromCpp(cppError as CppError);

      if (callback) {
        callback(err, null);
      }

      throw err;
    }
  }

  /**
   * Locks a document and retrieves the value of that document at the time it is locked.
   *
   * @param key The document key to retrieve and lock.
   * @param lockTime The amount of time to lock the document for, specified in seconds.
   * @param options Optional parameters for this operation.
   * @param callback A node-style callback to be invoked after execution.
   */
  async getAndLock<
    Key extends CollectionDocDef<this>['Key'],
    Def extends DocDefMatchingKey<Key, T, B, S, C>,
  >(
    key: Key,
    lockTime: number,
    options: GetAndLockOptions,
    callback?: NodeCallback<GetResult<Def['Body']>>
  ): Promise<GetResult<Def['Body']>>;
  async getAndLock<
    Key extends CollectionDocDef<this>['Key'],
    Def extends DocDefMatchingKey<Key, T, B, S, C>,
  >(
    key: Key,
    lockTime: number,
    callback?: NodeCallback<GetResult<Def['Body']>>
  ): Promise<GetResult<Def['Body']>>;
  async getAndLock(
    key: string,
    lockTime: number,
    options?: GetAndLockOptions | NodeCallback<GetResult<unknown>>,
    callback?: NodeCallback<GetResult<unknown>>
  ): Promise<GetResult<unknown>> {
    if (options instanceof Function) {
      callback = options;
      options = undefined;
    }
    if (!options) {
      options = {};
    }

    const transcoder = options.transcoder ?? this.transcoder;
    const timeout = options.timeout ?? this.cluster.kvTimeout;

    try {
      const getAndLock = promisify(this.conn.getAndLock).bind(this.conn);
      const response = await getAndLock({
        id: this.getDocId(key),
        lock_time: lockTime,
        timeout,
        partition: 0,
        opaque: 0,
      });

      const docBody = transcoder.decode(response.value, response.flags);
      const result = new GetResult({
        content: docBody,
        cas: response.cas,
      });

      if (callback) {
        callback(null, result);
      }

      return result;
    } catch (cppError: unknown) {
      const err = errorFromCpp(cppError as CppError);

      if (callback) {
        callback(err, null);
      }

      throw err;
    }
  }

  /**
   * Unlocks a previously locked document.
   *
   * @param key The document key to unlock.
   * @param cas The CAS of the document, used to validate lock ownership.
   * @param options Optional parameters for this operation.
   * @param callback A node-style callback to be invoked after execution.
   */
  async unlock<Key extends CollectionDocDef<this>['Key']>(
    key: Key,
    cas: CasInput,
    options: UnlockOptions,
    callback?: VoidNodeCallback
  ): Promise<void>;
  async unlock<Key extends CollectionDocDef<this>['Key']>(
    key: Key,
    cas: CasInput,
    callback?: VoidNodeCallback
  ): Promise<void>;
  async unlock(
    key: string,
    cas: CasInput,
    options?: UnlockOptions | VoidNodeCallback,
    callback?: VoidNodeCallback
  ): Promise<void> {
    if (options instanceof Function) {
      callback = options;
      options = undefined;
    }
    if (!options) {
      options = {};
    }

    const timeout = options.timeout ?? this.cluster.kvTimeout;
    const unlock = promisify(this.conn.unlock).bind(this.conn);

    try {
      await unlock({
        id: this.getDocId(key),
        cas,
        timeout,
        partition: 0,
        opaque: 0,
      });

      if (callback) {
        callback(null);
      }

      return;
    } catch (cppError: unknown) {
      const err = errorFromCpp(cppError as CppError);

      if (callback) {
        callback(err);
        return;
      }

      throw err;
    }
  }

  /**
   * @internal
   */
  _continueScan(
    iterator: CppScanIterator,
    transcoder: Transcoder,
    emitter: StreamableScanPromise<ScanResult[], ScanResult>
  ): void {
    iterator.next((cppErr, resp) => {
      const err = errorFromCpp(cppErr);
      if (err) {
        emitter.emit('error', err);
        emitter.emit('end');
        return;
      }

      if (typeof resp === 'undefined') {
        emitter.emit('end');
        return;
      }

      const { key, body } = resp;

      if (typeof body !== 'undefined') {
        const { cas, expiry, value, flags } = body;

        try {
          const docBody = transcoder.decode(value, flags);

          emitter.emit(
            'result',
            new ScanResult({
              id: key,
              content: docBody,
              cas: cas,
              expiryTime: expiry,
            })
          );
        } catch (err) {
          invariant(err instanceof Error);

          emitter.emit('error', err);
          emitter.emit('end');
        }
      } else {
        emitter.emit(
          'result',
          new ScanResult({
            id: key,
          })
        );
      }

      if (emitter.cancelRequested && !iterator.cancelled) {
        iterator.cancel();
      }

      this._continueScan(iterator, transcoder, emitter);
      return;
    });
  }

  /**
   * @internal
   */
  _doScan(
    scanType: RangeScan | SamplingScan | PrefixScan,
    options: CppRangeScanOrchestratorOptions,
    transcoder: Transcoder,
    callback?: NodeCallback<ScanResult[]>
  ): StreamableScanPromise<ScanResult[], ScanResult> {
    const bucketName = this.scope.bucket.name;
    const scopeName = this.scope.name;
    const collectionName = this.name;

    return PromiseHelper.wrapAsync(() => {
      const { cppErr, result } = this.conn.scan(
        bucketName,
        scopeName,
        collectionName,
        scanType.getScanType(),
        scanTypeToCpp(scanType),
        options
      );

      const err = errorFromCpp(cppErr);
      if (err) {
        throw err;
      }

      const emitter = new StreamableScanPromise<ScanResult[], ScanResult>(
        (results: ScanResult[]) => results
      );

      this._continueScan(result, transcoder, emitter);

      return emitter;
    }, callback);
  }

  /**
   * Performs a key-value scan operation.
   *
   * Use this API for low concurrency batch queries where latency is not a critical as the system
   * may have to scan a lot of documents to find the matching documents.
   * For low latency range queries, it is recommended that you use SQL++ with the necessary indexes.
   *
   * @param scanType The type of scan to execute.
   * @param options Optional parameters for the scan operation.
   * @param callback A node-style callback to be invoked after execution.
   */
  scan<Def extends CollectionDocDef<this>>(
    scanType: RangeScan | SamplingScan | PrefixScan,
    options: ScanOptions,
    callback?: NodeCallback<ScanResult<Def>[]>
  ): StreamableScanPromise<ScanResult<Def>[], ScanResult<Def>>;
  scan<Def extends CollectionDocDef<this>>(
    scanType: RangeScan | SamplingScan | PrefixScan,
    callback?: NodeCallback<ScanResult<Def>[]>
  ): StreamableScanPromise<ScanResult<Def>[], ScanResult<Def>>;
  scan(
    scanType: RangeScan | SamplingScan | PrefixScan,
    options?: ScanOptions | NodeCallback<ScanResult[]>,
    callback?: NodeCallback<ScanResult[]>
  ): StreamableScanPromise<ScanResult[], ScanResult> {
    if (options instanceof Function) {
      callback = options;
      options = undefined;
    }
    if (!options) {
      options = {};
    }

    const transcoder = options.transcoder ?? this.transcoder;
    const timeout = options.timeout ?? this.kvScanTimeout;
    const idsOnly = options.idsOnly ?? false;
    const batchByteLimit = options.batchByteLimit ?? this.scanBatchByteLimit;
    const batchItemLimit = options.batchByteLimit ?? this.scanBatchItemLimit;

    if (typeof options.concurrency !== 'undefined' && options.concurrency < 1) {
      throw new InvalidArgumentError('Concurrency option must be positive');
    }
    const concurrency = options.concurrency ?? 1;

    if (scanType instanceof SamplingScan && scanType.limit < 1) {
      throw new InvalidArgumentError('Sampling scan limit must be positive');
    }

    const orchestratorOptions = {
      ids_only: idsOnly,
      consistent_with: mutationStateToCpp(options.consistentWith),
      batch_item_limit: batchItemLimit,
      batch_byte_limit: batchByteLimit,
      concurrency: concurrency,
      timeout: timeout,
    };

    return this._doScan(scanType, orchestratorOptions, transcoder, callback);
  }

  // Classic
  lookupIn<
    Key extends ExtractCollectionJsonDocKey<this>,
    SpecDefinitions,
    ThrowOnSpecError extends boolean = false,
  >(
    key: Key,
    specs: NarrowLookupSpecs<
      CollectionOptions<this>,
      ExtractCollectionJsonDocDef<Collection<T, B, S, C>, Key>,
      SpecDefinitions
    >,
    options: LookupInOptions<ThrowOnSpecError>,
    callback?: NodeCallback<
      LookupInResult<
        LookupInSpecResults<
          CollectionOptions<this>,
          SpecDefinitions,
          ExtractCollectionJsonDocDef<Collection<T, B, S, C>, Key>
        >,
        ThrowOnSpecError
      >
    >
  ): Promise<
    LookupResult<
      CollectionOptions<this>,
      'lookupIn',
      SpecDefinitions,
      ExtractCollectionJsonDocDef<Collection<T, B, S, C>, Key>,
      ThrowOnSpecError
    >
  >;

  // Classic
  lookupIn<
    Key extends ExtractCollectionJsonDocKey<this>,
    SpecDefinitions,
    ThrowOnSpecError extends boolean = false,
  >(
    key: Key,
    specs: NarrowLookupSpecs<
      CollectionOptions<this>,
      ExtractCollectionJsonDocDef<Collection<T, B, S, C>, NoInfer<Key>>,
      SpecDefinitions
    >,
    callback?: NodeCallback<
      LookupInResult<
        LookupInSpecResults<
          CollectionOptions<this>,
          SpecDefinitions,
          ExtractCollectionJsonDocDef<Collection<T, B, S, C>, NoInfer<Key>>
        >,
        ThrowOnSpecError
      >
    >
  ): Promise<
    LookupResult<
      CollectionOptions<this>,
      'lookupIn',
      SpecDefinitions,
      ExtractCollectionJsonDocDef<Collection<T, B, S, C>, Key>,
      ThrowOnSpecError
    >
  >;

  // Chainable
  lookupIn<
    const Key extends ExtractCollectionJsonDocKey<this>,
    ThrowOnSpecError extends boolean = false,
  >(
    key: Key,
    options?: LookupInOptions<ThrowOnSpecError>
  ): ChainableLookupIn<
    this,
    'lookupIn',
    Key,
    [],
    ThrowOnSpecError,
    CollectionDocDefMatchingKey<this, Key>
  >;

  /**
   * Performs a lookup-in operation against a document, fetching individual fields or
   * information about specific fields inside the document value.
   */
  lookupIn(key: string, ...args: never[]): any {
    const {
      specs,
      options,
      callback: resolvedCallback,
    } = resolveLookupInArgs(args as never);

    if (specs === undefined) {
      return ChainableLookupIn.for(this, 'lookupIn', key as never, options);
    }

    return this._lookupIn(key as never, specs, options, resolvedCallback);
  }

  private async _lookupIn<
    Key extends ExtractCollectionJsonDocKey<this>,
    SpecDefinitions extends ReadonlyArray<LookupInSpec>,
    ThrowOnSpecError extends boolean = false,
  >(
    key: Key,
    specs: SpecDefinitions,
    options: LookupInOptions<ThrowOnSpecError>,
    callback?: NodeCallback<
      LookupInResult<
        LookupInSpecResults<
          CollectionOptions<this>,
          SpecDefinitions,
          CollectionDocDefMatchingKey<this, Key>
        >,
        ThrowOnSpecError
      >
    >
  ): Promise<
    LookupInResult<
      LookupInSpecResults<
        CollectionOptions<this>,
        SpecDefinitions,
        CollectionDocDefMatchingKey<this, Key>
      >,
      ThrowOnSpecError
    >
  > {
    try {
      const defaultOptions = {
        timeout: this.cluster.kvTimeout,
        accessDeleted: false,
        throwOnSpecError: false,
      } satisfies LookupInOptions;

      const resolvedOptions = {
        ...defaultOptions,
        ...options,
      };

      const { timeout, accessDeleted } = resolvedOptions;
      const lookupIn = promisify(this.conn.lookupIn).bind(this.conn);

      const cppSpecs: CppImplSubdocCommand[] = specs.map((spec, i) => ({
        opcode_: spec._op,
        flags_: spec._flags,
        path_: spec._path,
        original_index_: i,
      }));

      const response = await lookupIn({
        id: this.getDocId(key),
        specs: cppSpecs,
        timeout,
        partition: 0,
        opaque: 0,
        access_deleted: accessDeleted,
      });

      const content: LookupInResultEntry[] = [];

      for (const itemRes of response.fields) {
        if (options.throwOnSpecError && itemRes.ec) {
          throw itemRes.ec;
        }

        let error: Error | null = errorFromCpp(itemRes.ec);

        let value: any = undefined;
        if (itemRes.value && itemRes.value.length > 0) {
          value = this.decodeSubDocument(itemRes.value);
        }

        if (itemRes.opcode === binding.protocol_subdoc_opcode.exists) {
          value = itemRes.exists;
          error = null;
        }

        content.push(
          new LookupInResultEntry({
            error,
            value,
          })
        );
      }

      const result = new LookupInResult({
        content: content as LookupInResultEntries<
          LookupInSpecResults<
            CollectionOptions<this>,
            SpecDefinitions,
            ExtractCollectionJsonDocDef<Collection<T, B, S, C>, Key>
          >,
          ThrowOnSpecError
        >,
        cas: response.cas,
      });
      if (callback) {
        callback(null, result as never);
      }

      return result as never;
    } catch (cppError: unknown) {
      const err = errorFromCpp(cppError as CppError);

      if (callback) {
        callback(err, null);
      }

      throw err;
    }
  }

  private _lookupInReplica<
    Key extends ExtractCollectionJsonDocKey<this>,
    SpecDefinitions extends ReadonlyArray<LookupInSpec>,
    ThrowOnSpecError extends boolean = false,
  >(
    key: Key,
    lookupInAllReplicas: boolean,
    specs: SpecDefinitions,
    options: LookupInAllReplicasOptions<ThrowOnSpecError> = {}
  ): StreamableReplicasPromise<
    [
      LookupInReplicaResult<
        LookupInSpecResults<
          CollectionOptions<this>,
          SpecDefinitions,
          CollectionDocDefMatchingKey<this, Key>
        >,
        ThrowOnSpecError
      >,
      ...LookupInReplicaResult<
        LookupInSpecResults<
          CollectionOptions<this>,
          SpecDefinitions,
          CollectionDocDefMatchingKey<this, Key>
        >,
        ThrowOnSpecError
      >[],
    ],
    LookupInReplicaResult<
      LookupInSpecResults<
        CollectionOptions<this>,
        SpecDefinitions,
        CollectionDocDefMatchingKey<this, Key>
      >,
      ThrowOnSpecError
    >
  > {
    type ResultFromReplica = LookupInReplicaResult<
      LookupInSpecResults<
        CollectionOptions<this>,
        SpecDefinitions,
        CollectionDocDefMatchingKey<this, Key>
      >,
      ThrowOnSpecError
    >;

    const emitter = new StreamableReplicasPromise<
      [ResultFromReplica, ...ResultFromReplica[]],
      ResultFromReplica
    >((replicas: [ResultFromReplica, ...ResultFromReplica[]]) => replicas);

    const cppSpecs: CppImplSubdocCommand[] = [];
    for (let i = 0; i < specs.length; ++i) {
      cppSpecs.push({
        opcode_: specs[i]._op,
        flags_: specs[i]._flags,
        path_: specs[i]._path,
        original_index_: i,
      });
    }

    const timeout = options.timeout ?? this.cluster.kvTimeout;

    const lookupIn = lookupInAllReplicas
      ? this.conn.lookupInAllReplicas
      : this.conn.lookupInAnyReplica;

    lookupIn.bind(this.conn)(
      {
        id: this.getDocId(key),
        specs: cppSpecs,
        timeout: timeout,
      },
      (cppErr, res) => {
        if (cppErr) {
          emitter.emit('error', errorFromCpp(cppErr));
          emitter.emit('end');
          return;
        }

        const responses = hasOwn(res, 'entries') ? res.entries : [res];

        responses.forEach((response) => {
          const content: LookupInResultEntry[] = [];

          for (const item of response.fields) {
            const { ec, value, opcode, exists } = item;

            if (options.throwOnSpecError && ec) {
              emitter.emit('error', errorFromCpp(ec));
              emitter.emit('end');
              return;
            }

            const error = errorFromCpp(ec);

            let docBody: any = undefined;

            if (value && value.length > 0) {
              docBody = this.decodeSubDocument(value);
            }

            if (opcode === binding.protocol_subdoc_opcode.exists) {
              docBody = exists;
            }

            content.push(
              new LookupInResultEntry({
                error,
                value: docBody,
              })
            );
          }

          emitter.emit(
            'replica',
            new LookupInReplicaResult({
              content: content as ResultFromReplica['content'],
              cas: response.cas,
              isReplica: response.is_replica,
            })
          );
        });

        emitter.emit('end');
      }
    );

    return emitter;
  }

  /**
   * Performs a lookup-in operation against a document, fetching individual fields or
   * information about specific fields inside the document value from any of the available
   * replicas in the cluster.
   *
   * @param key The document key to look in.
   * @param specs A list of specs describing the data to fetch from the document.
   * @param options Optional parameters for this operation.
   * @param callback A node-style callback to be invoked after execution.
   */
  // Classic
  lookupInAnyReplica<
    Key extends ExtractCollectionJsonDocKey<this>,
    SpecDefinitions,
    ThrowOnSpecError extends boolean = false,
  >(
    key: Key,
    specs: NarrowLookupSpecs<
      CollectionOptions<this>,
      CollectionDocDefMatchingKey<this, Key>,
      SpecDefinitions
    >,
    options: LookupInAnyReplicaOptions<ThrowOnSpecError>,
    callback?: NodeCallback<
      LookupResult<
        CollectionOptions<this>,
        'lookupInAnyReplica',
        SpecDefinitions,
        CollectionDocDefMatchingKey<this, Key>,
        ThrowOnSpecError
      >
    >
  ): Promise<
    LookupResult<
      CollectionOptions<this>,
      'lookupInAnyReplica',
      SpecDefinitions,
      CollectionDocDefMatchingKey<this, Key>,
      ThrowOnSpecError
    >
  >;

  // Classic
  lookupInAnyReplica<
    Key extends ExtractCollectionJsonDocKey<this>,
    SpecDefinitions,
    ThrowOnSpecError extends boolean = false,
  >(
    key: Key,
    specs: NarrowLookupSpecs<
      CollectionOptions<this>,
      CollectionDocDefMatchingKey<this, Key>,
      SpecDefinitions
    >,
    callback?: NodeCallback<
      LookupResult<
        CollectionOptions<this>,
        'lookupInAnyReplica',
        SpecDefinitions,
        CollectionDocDefMatchingKey<this, Key>,
        ThrowOnSpecError
      >
    >
  ): Promise<
    LookupResult<
      CollectionOptions<this>,
      'lookupInAnyReplica',
      SpecDefinitions,
      CollectionDocDefMatchingKey<this, Key>,
      ThrowOnSpecError
    >
  >;

  // Chainable
  lookupInAnyReplica<
    const Key extends ExtractCollectionJsonDocKey<this>,
    ThrowOnSpecError extends boolean = false,
  >(
    key: Key,
    options?: LookupInAnyReplicaOptions<ThrowOnSpecError>
  ): ChainableLookupIn<
    this,
    'lookupInAnyReplica',
    Key,
    [],
    ThrowOnSpecError,
    CollectionDocDefMatchingKey<this, Key>
  >;

  lookupInAnyReplica(key: string, ...args: never[]): any {
    const { specs, options, callback } = resolveLookupInArgs(args as never);

    if (specs === undefined) {
      return ChainableLookupIn.for(this, 'lookupInAnyReplica', key as never, options);
    }

    return PromiseHelper.wrapAsync(async () => {
      const replicas = await this._lookupInReplica(key as never, false, specs, options);
      return replicas[0];
    }, callback);
  }

  /**
   * Performs a lookup-in operation against a document, fetching individual fields or
   * information about specific fields inside the document value from all available replicas.
   * Note that as replication is asynchronous, each node may return a different value.
   *
   * @param key The document key to look in.
   * @param specs A list of specs describing the data to fetch from the document.
   * @param options Optional parameters for this operation.
   * @param callback A node-style callback to be invoked after execution.
   */
  // Classic
  lookupInAllReplicas<
    Key extends ExtractCollectionJsonDocKey<this>,
    SpecDefinitions,
    ThrowOnSpecError extends boolean = false,
  >(
    key: Key,
    specs: NarrowLookupSpecs<
      CollectionOptions<this>,
      CollectionDocDefMatchingKey<this, Key>,
      SpecDefinitions
    >,
    options: LookupInAllReplicasOptions<ThrowOnSpecError>,
    callback?: NodeCallback<
      LookupInReplicaResult<
        LookupInSpecResults<
          CollectionOptions<this>,
          SpecDefinitions,
          CollectionDocDefMatchingKey<this, Key>
        >,
        ThrowOnSpecError
      >[]
    >
  ): Promise<
    LookupInReplicaResult<
      LookupInSpecResults<
        CollectionOptions<this>,
        SpecDefinitions,
        CollectionDocDefMatchingKey<this, Key>
      >,
      ThrowOnSpecError
    >[]
  >;

  // Classic
  lookupInAllReplicas<
    Key extends ExtractCollectionJsonDocKey<this>,
    SpecDefinitions,
    ThrowOnSpecError extends boolean = false,
  >(
    key: Key,
    specs: NarrowLookupSpecs<
      CollectionOptions<this>,
      CollectionDocDefMatchingKey<this, Key>,
      SpecDefinitions
    >,
    callback?: NodeCallback<
      LookupInReplicaResult<
        LookupInSpecResults<
          CollectionOptions<this>,
          SpecDefinitions,
          CollectionDocDefMatchingKey<this, Key>
        >,
        ThrowOnSpecError
      >[]
    >
  ): Promise<
    LookupInReplicaResult<
      LookupInSpecResults<
        CollectionOptions<this>,
        SpecDefinitions,
        CollectionDocDefMatchingKey<this, Key>
      >,
      ThrowOnSpecError
    >[]
  >;

  // Chainable
  lookupInAllReplicas<
    const Key extends ExtractCollectionJsonDocKey<this>,
    ThrowOnSpecError extends boolean = false,
  >(
    key: Key,
    options?: LookupInOptions<ThrowOnSpecError>
  ): ChainableLookupIn<
    this,
    'lookupInAllReplicas',
    Key,
    [],
    ThrowOnSpecError,
    CollectionDocDefMatchingKey<this, Key>
  >;

  lookupInAllReplicas(key: string, ...args: never[]): any {
    const { specs, options, callback } = resolveLookupInArgs(args as never);

    if (specs === undefined) {
      return ChainableLookupIn.for(this, 'lookupInAllReplicas', key as never, options);
    }

    return PromiseHelper.wrapAsync(
      () => this._lookupInReplica(key as never, true, specs, options),
      callback
    );
  }

  mutateIn<
    const Key extends ExtractCollectionJsonDocKey<this>,
    Def extends DocDefMatchingKey<Key, T, B, S, C>,
    SpecDefinitions extends ReadonlyArray<MutateInSpec>,
  >(
    key: Key,
    specsOrOptions?:
      | MutateInOptions
      | NarrowMutationSpecs<CollectionOptions<this>, Def, SpecDefinitions>,
    optionsOrCallback?:
      | MutateInOptions
      | NodeCallback<MutateInResult<MutateInSpecResults<NoInfer<SpecDefinitions>>>>,
    callback?: NodeCallback<MutateInResult<MutateInSpecResults<NoInfer<SpecDefinitions>>>>
  ): MutateInReturnType<this, Key, SpecDefinitions> {
    const {
      specs,
      options,
      callback: resolvedCallback,
    } = resolveMutateInArgs([specsOrOptions, optionsOrCallback, callback]);

    if (specs === undefined) {
      return ChainableMutateIn.for(this, key, options) as MutateInReturnType<
        this,
        Key,
        SpecDefinitions
      >;
    }

    return this._mutateIn(key, specs, options, resolvedCallback) as MutateInReturnType<
      this,
      Key,
      SpecDefinitions
    >;
  }

  private async _mutateIn<
    Key extends ExtractCollectionJsonDocKey<this>,
    SpecDefinitions extends ReadonlyArray<MutateInSpec>,
  >(
    key: Key,
    specs: SpecDefinitions,
    options: MutateInOptions,
    callback?: NodeCallback<MutateInResult<MutateInSpecResults<SpecDefinitions>>>
  ): Promise<MutateInResult<MutateInSpecResults<SpecDefinitions>>> {
    const cppSpecs: CppImplSubdocCommand[] = specs.map((spec) => ({
      opcode_: spec._op,
      flags_: spec._flags,
      path_: spec._path,
      value_: spec._data ? this.encodeSubDocument(spec._data) : spec._data,
      original_index_: 0,
    }));

    const storeSemantics = options.upsertDocument
      ? StoreSemantics.Upsert
      : options.storeSemantics;
    const expiry = options.expiry ? expiryToTimestamp(options.expiry) : undefined;
    const preserveExpiry = options.preserveExpiry ?? false;
    const cas = options.cas ?? zeroCas;
    const durabilityLevel = options.durabilityLevel;
    const persistTo = options.durabilityPersistTo;
    const replicateTo = options.durabilityReplicateTo;
    const timeout = options.timeout ?? this._mutationTimeout(durabilityLevel);

    try {
      const mutateInReq = {
        id: this.getDocId(key),
        store_semantics: storeSemanticToCpp(storeSemantics),
        specs: cppSpecs,
        expiry,
        preserve_expiry: preserveExpiry,
        cas,
        timeout,
        partition: 0,
        opaque: 0,
        access_deleted: false,
        create_as_deleted: false,
      };

      let mutateIn: (() => Promise<CppMutateInResponse>) | undefined = undefined;

      if (persistTo !== undefined || replicateTo !== undefined) {
        mutateIn = promisify(this.conn.mutateInWithLegacyDurability).bind(this.conn, {
          ...mutateInReq,
          persist_to: persistToToCpp(persistTo),
          replicate_to: replicateToToCpp(replicateTo),
        });
      } else {
        mutateIn = promisify(this.conn.mutateIn).bind(this.conn, {
          ...mutateInReq,
          durability_level: durabilityToCpp(durabilityLevel),
        });
      }

      const response = await mutateIn();

      const resultEntries = response.fields.map(({ value }) => {
        return new MutateInResultEntry({
          value: value && value.length > 0 ? this.decodeSubDocument(value) : undefined,
        });
      }) as unknown as MutateInResultEntries<MutateInSpecResults<SpecDefinitions>>;

      const result = new MutateInResult({
        content: resultEntries,
        cas: response.cas,
        token: response.token,
      });

      if (callback) {
        callback(null, result);
      }

      return result;
    } catch (cppError: unknown) {
      const err = errorFromCpp(cppError as CppError);

      if (callback) {
        callback(err, null);
      }

      throw err;
    }
  }
  /**
   * Returns a CouchbaseList permitting simple list storage in a document.
   *
   * @param key The document key the data-structure resides in.
   */
  list<Key extends DocDefMatchingBody<ReadonlyArray<unknown>, T, B, S, C>['Key']>(
    key: Key
  ): CollectionListReturn<T, B, S, C, Key> {
    return new CouchbaseList(this, key) as CollectionListReturn<T, B, S, C, Key>;
  }

  /**
   * Returns a CouchbaseQueue permitting simple queue storage in a document.
   *
   * @param key The document key the data-structure resides in.
   */
  queue<Key extends DocDefMatchingBody<ReadonlyArray<unknown>, T, B, S, C>['Key']>(
    key: Key
  ): CollectionQueueReturn<T, B, S, C, Key> {
    return new CouchbaseQueue(this, key) as CollectionQueueReturn<T, B, S, C, Key>;
  }

  /**
   * Returns a CouchbaseMap permitting simple map storage in a document.
   *
   * @param key The document key the data-structure resides in.
   */
  map<
    Key extends DocDefMatchingBody<Record<string, unknown>, T, B, S, C>['Key'],
    Doc extends Extract<
      DocDefMatchingKey<Key, T, B, S, C>['Body'],
      Record<string, unknown>
    >,
    MapDoc extends If<IsAny<Doc>, Record<string, any>, Doc>,
    R = IsNever<CollectionMatchingDocDef<T, DocDef<Key, MapDoc>>> extends true
      ? CouchbaseMap<T, B, S, C, Key, MapDoc>
      : this extends CollectionMatchingDocDef<T, DocDef<Key, MapDoc>>
        ? CouchbaseMap<T, B, S, C, Key, MapDoc>
        : 'This collection does not contain any map.',
  >(key: Key): R {
    return new CouchbaseMap(this as never, key) as R;
  }

  /**
   * Returns a CouchbaseSet permitting simple set storage in a document.
   *
   * @param key The document key the data-structure resides in.
   */
  set<Key extends DocDefMatchingBody<ReadonlyArray<unknown>, T, B, S, C>['Key']>(
    key: Key
  ): CollectionSetReturn<T, B, S, C, Key> {
    return new CouchbaseSet(this, key) as CollectionSetReturn<T, B, S, C, Key>;
  }

  /**
   * Returns a BinaryCollection object reference, allowing access to various
   * binary operations possible against a collection.
   */
  binary() {
    return new BinaryCollection(this);
  }

  /**
   * @internal
   */
  async _binaryIncrement(
    key: string,
    delta: number,
    options: IncrementOptions,
    callback?: NodeCallback<CounterResult>
  ): Promise<CounterResult>;
  async _binaryIncrement(
    key: string,
    delta: number,
    callback?: NodeCallback<CounterResult>
  ): Promise<CounterResult>;
  async _binaryIncrement(
    key: string,
    delta: number,
    options?: IncrementOptions | NodeCallback<CounterResult>,
    callback?: NodeCallback<CounterResult>
  ): Promise<CounterResult> {
    if (options instanceof Function) {
      callback = options;
      options = undefined;
    }
    if (!options) {
      options = {};
    }

    const initial_value = options.initial;
    const expiry = options.expiry ? expiryToTimestamp(options.expiry) : 0;
    const durabilityLevel = options.durabilityLevel;
    const persistTo = options.durabilityPersistTo;
    const replicateTo = options.durabilityReplicateTo;
    const timeout = options.timeout ?? this.cluster.kvTimeout;

    try {
      const incrementReq = {
        id: this.getDocId(key),
        delta,
        initial_value,
        expiry,
        timeout,
        partition: 0,
        opaque: 0,
      };

      let increment: (() => Promise<CppIncrementResponse>) | undefined = undefined;

      if (persistTo !== undefined || replicateTo !== undefined) {
        increment = promisify(this.conn.incrementWithLegacyDurability).bind(this.conn, {
          ...incrementReq,
          persist_to: persistToToCpp(persistTo),
          replicate_to: replicateToToCpp(replicateTo),
        });
      } else {
        increment = promisify(this.conn.increment).bind(this.conn, {
          ...incrementReq,
          durability_level: durabilityToCpp(durabilityLevel),
        });
      }

      const response = await increment();
      const result = new CounterResult({
        cas: response.cas,
        value: response.content,
        token: response.token,
      });

      if (callback) {
        callback(null, result);
      }

      return result;
    } catch (cppError: unknown) {
      const err = errorFromCpp(cppError as CppError);

      if (callback) {
        callback(err, null);
      }

      throw err;
    }
  }

  /**
   * @internal
   */
  async _binaryDecrement(
    key: string,
    delta: number,
    options: DecrementOptions,
    callback?: NodeCallback<CounterResult>
  ): Promise<CounterResult>;
  async _binaryDecrement(
    key: string,
    delta: number,
    callback?: NodeCallback<CounterResult>
  ): Promise<CounterResult>;
  async _binaryDecrement(
    key: string,
    delta: number,
    options?: DecrementOptions | NodeCallback<CounterResult>,
    callback?: NodeCallback<CounterResult>
  ): Promise<CounterResult> {
    if (options instanceof Function) {
      callback = options;
      options = undefined;
    }
    if (!options) {
      options = {};
    }

    const initial_value = options.initial;
    const expiry = options.expiry ? expiryToTimestamp(options.expiry) : 0;
    const durabilityLevel = options.durabilityLevel;
    const persistTo = options.durabilityPersistTo;
    const replicateTo = options.durabilityReplicateTo;
    const timeout = options.timeout ?? this.cluster.kvTimeout;

    try {
      const decrementReq = {
        id: this.getDocId(key),
        delta,
        initial_value,
        expiry,
        timeout,
        partition: 0,
        opaque: 0,
      };

      let decrement: (() => Promise<CppDecrementResponse>) | undefined = undefined;

      if (persistTo !== undefined || replicateTo !== undefined) {
        decrement = promisify(this.conn.decrementWithLegacyDurability).bind(this.conn, {
          ...decrementReq,
          persist_to: persistToToCpp(persistTo),
          replicate_to: replicateToToCpp(replicateTo),
        });
      } else {
        decrement = promisify(this.conn.decrement).bind(this.conn, {
          ...decrementReq,
          durability_level: durabilityToCpp(durabilityLevel),
        });
      }

      const response = await decrement();
      const result = new CounterResult({
        cas: response.cas,
        value: response.content,
        token: response.token,
      });

      if (callback) {
        callback(null, result);
      }

      return result;
    } catch (cppError: unknown) {
      const err = errorFromCpp(cppError as CppError);

      if (callback) {
        callback(err, null);
      }

      throw err;
    }
  }

  /**
   * @internal
   */
  async _binaryAppend(
    key: string,
    value: string | Buffer,
    options: AppendOptions,
    callback?: NodeCallback<MutationResult>
  ): Promise<MutationResult>;
  async _binaryAppend(
    key: string,
    value: string | Buffer,
    callback?: NodeCallback<MutationResult>
  ): Promise<MutationResult>;
  async _binaryAppend(
    key: string,
    value: string | Buffer,
    options?: AppendOptions | NodeCallback<MutationResult>,
    callback?: NodeCallback<MutationResult>
  ): Promise<MutationResult> {
    if (options instanceof Function) {
      callback = options;
      options = undefined;
    }
    if (!options) {
      options = {};
    }

    const durabilityLevel = options.durabilityLevel;
    const persistTo = options.durabilityPersistTo;
    const replicateTo = options.durabilityReplicateTo;
    const timeout = options.timeout ?? this.cluster.kvTimeout;

    try {
      if (!Buffer.isBuffer(value)) {
        value = Buffer.from(value);
      }

      const appendReq = {
        id: this.getDocId(key),
        value,
        timeout,
        partition: 0,
        opaque: 0,
      };

      let append: (() => Promise<CppAppendResponse>) | undefined = undefined;

      if (persistTo !== undefined || replicateTo !== undefined) {
        append = promisify(this.conn.appendWithLegacyDurability).bind(this.conn, {
          ...appendReq,
          persist_to: persistToToCpp(persistTo),
          replicate_to: replicateToToCpp(replicateTo),
        });
      } else {
        append = promisify(this.conn.append).bind(this.conn, {
          ...appendReq,
          durability_level: durabilityToCpp(durabilityLevel),
        });
      }

      const response = await append();
      const result = new MutationResult({
        cas: response.cas,
        token: response.token,
      });

      if (callback) {
        callback(null, result);
      }

      return result;
    } catch (cppError: unknown) {
      const err = errorFromCpp(cppError as CppError);

      if (callback) {
        callback(err, null);
      }

      throw err;
    }
  }

  /**
   * @internal
   */
  async _binaryPrepend(
    key: string,
    value: string | Buffer,
    options: PrependOptions,
    callback?: NodeCallback<MutationResult>
  ): Promise<MutationResult>;
  async _binaryPrepend(
    key: string,
    value: string | Buffer,
    callback?: NodeCallback<MutationResult>
  ): Promise<MutationResult>;
  async _binaryPrepend(
    key: string,
    value: string | Buffer,
    options?: PrependOptions | NodeCallback<MutationResult>,
    callback?: NodeCallback<MutationResult>
  ): Promise<MutationResult> {
    if (options instanceof Function) {
      callback = options;
      options = undefined;
    }
    if (!options) {
      options = {};
    }

    const durabilityLevel = options.durabilityLevel;
    const persistTo = options.durabilityPersistTo;
    const replicateTo = options.durabilityReplicateTo;
    const timeout = options.timeout ?? this.cluster.kvTimeout;

    try {
      if (!Buffer.isBuffer(value)) {
        value = Buffer.from(value);
      }

      const prependReq = {
        id: this.getDocId(key),
        value,
        timeout,
        partition: 0,
        opaque: 0,
      };

      let prepend: (() => Promise<CppPrependResponse>) | undefined = undefined;

      if (persistTo !== undefined || replicateTo !== undefined) {
        prepend = promisify(this.conn.prependWithLegacyDurability).bind(this.conn, {
          ...prependReq,
          persist_to: persistToToCpp(persistTo),
          replicate_to: replicateToToCpp(replicateTo),
        });
      } else {
        prepend = promisify(this.conn.prepend).bind(this.conn, {
          ...prependReq,
          durability_level: durabilityToCpp(durabilityLevel),
        });
      }

      const response = await prepend();
      const result = new MutationResult({
        cas: response.cas,
        token: response.token,
      });

      if (callback) {
        callback(null, result);
      }

      return result;
    } catch (cppError: unknown) {
      const err = errorFromCpp(cppError as CppError);

      if (callback) {
        callback(err, null);
      }

      throw err;
    }
  }

  /**
   * Returns a CollectionQueryIndexManager which can be used to manage the query indexes
   * of this collection.
   */
  queryIndexes(): CollectionQueryIndexManager<T, B, S, C> {
    return new CollectionQueryIndexManager(this);
  }
}

// prettier-ignore
type CollectionSetReturn<
  T extends CouchbaseClusterTypes,
  B extends BucketName<T>,
  S extends ScopeName<T, B>,
  C extends CollectionName<T, B, S>,
  Key extends DocDefMatchingBody<ReadonlyArray<unknown>, T, B, S, C>['Key'],
> =
  Extract<DocDefMatchingKey<Key, T, B, S, C>['Body'], unknown[]> extends infer Doc ?
    IsNever<Doc> extends true ?
      'This collection does not contain any set.' :
    If<IsFuzzyDocument<Doc>, any, ArrayElement<Doc>> extends infer Item ?
      CouchbaseSet<T, B, S, C, Key, Item> :
    never :
  never
;

// prettier-ignore
type CollectionListReturn<
  T extends CouchbaseClusterTypes,
  B extends BucketName<T>,
  S extends ScopeName<T, B>,
  C extends CollectionName<T, B, S>,
  Key extends DocDefMatchingBody<ReadonlyArray<unknown>, T, B, S, C>['Key'],
> =
  Extract<DocDefMatchingKey<Key, T, B, S, C>['Body'], unknown[]> extends infer Doc ?
    IsNever<Doc> extends true ?
      'This collection does not contain any list.' :
    If<IsFuzzyDocument<Doc>, any, ArrayElement<Doc>> extends infer Item ?
      CouchbaseList<T, B, S, C, Key, Item> :
    never :
  never
;

// prettier-ignore
type CollectionQueueReturn<
  T extends CouchbaseClusterTypes,
  B extends BucketName<T>,
  S extends ScopeName<T, B>,
  C extends CollectionName<T, B, S>,
  Key extends DocDefMatchingBody<ReadonlyArray<unknown>, T, B, S, C>['Key'],
> =
  Extract<DocDefMatchingKey<Key, T, B, S, C>['Body'], unknown[]> extends infer Doc ?
    IsNever<Doc> extends true ?
      'This collection does not contain any queue.' :
    If<IsFuzzyDocument<Doc>, any, ArrayElement<Doc>> extends infer Item ?
      CouchbaseQueue<T, B, S, C, Key, Item> :
    never :
  never
;

type CollectionGetReturn<
  Doc,
  WithExpiry extends boolean,
  ThrowIfMissing extends boolean,
> = ThrowIfMissing extends true
  ? GetResult<Doc, WithExpiry>
  : GetResult<Doc, WithExpiry> | undefined;

type CollectionGetAnyReplicaReturn<
  Doc,
  ThrowIfMissing extends boolean,
> = ThrowIfMissing extends true
  ? GetReplicaResult<Doc>
  : GetReplicaResult<Doc> | undefined;
