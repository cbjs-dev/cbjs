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
  Cas,
  CasInput,
  CollectionName,
  CouchbaseClusterTypes,
  DefaultClusterTypes,
  DocDefMatchingKey,
  If,
  invariant,
  IsNever,
  KeyspaceDocDef,
  QueryContext,
  ScopeName,
} from '@cbjsdev/shared';

import binding, {
  CppTransaction,
  CppTransactionGetMetaData,
  CppTransactionGetResult,
  CppTransactionLinks,
  CppTransactions,
} from './binding.js';
import {
  durabilityToCpp,
  errorFromCpp,
  queryProfileToCpp,
  queryScanConsistencyToCpp,
  transactionKeyspaceToCpp,
} from './bindingutilities.js';
import { Cluster } from './cluster.js';
import { CollectionKeyspace } from './clusterTypes/clusterTypes.js';
import { AnyCollection } from './clusterTypes/index.js';
import { Collection } from './collection.js';
import {
  DocumentNotFoundError,
  TransactionFailedError,
  TransactionOperationFailedError,
} from './errors.js';
import { DurabilityLevel } from './generaltypes.js';
import { QueryExecutor } from './queryexecutor.js';
import {
  QueryMetaData,
  QueryProfileMode,
  QueryResult,
  QueryScanConsistency,
} from './querytypes.js';
import { DefaultTranscoder } from './transcoders.js';
import { NodeCallback, PromiseHelper } from './utilities.js';

/**
 * Represents the path to a document.
 *
 * @category Transactions
 */
export class DocumentId<
  T extends CouchbaseClusterTypes,
  B extends BucketName<T>,
  S extends ScopeName<T, B>,
  C extends CollectionName<T, B, S>,
  const Key extends KeyspaceDocDef<T, B, S, C>['Key'] = KeyspaceDocDef<T, B, S, C>['Key'],
> {
  /**
   * The name of the bucket containing the document.
   */
  bucket: B;

  /**
   * The name of the scope containing the document.
   */
  scope: S;

  /**
   * The name of the collection containing the document.
   */
  collection: C;

  /**
   * The key of the document.
   */
  key: Key;

  constructor(bucket: B, scope: S, collection: C, key: Key) {
    this.bucket = bucket;
    this.scope = scope;
    this.collection = collection;
    this.key = key;
  }
}

/**
 * Specifies the configuration options for a Transaction Keyspace.
 *
 * @category Transactions
 */
export type TransactionKeyspace = {
  /**
   * The name of the bucket for the Keyspace.
   */
  bucket: string;

  /**
   * The name of the scope for the Keyspace.
   */
  scope?: string;

  /**
   * The name of the collection for the Keyspace.
   */
  collection?: string;
};

/**
 * Specifies the configuration options for Transactions cleanup.
 *
 * @category Transactions
 */
export type TransactionsCleanupConfig = {
  /**
   * Specifies the period of the cleanup system.
   */
  cleanupWindow?: number;

  /**
   * Specifies whether or not the cleanup system should clean lost attempts.
   */
  disableLostAttemptCleanup?: boolean;

  /**
   * Specifies whether or not the cleanup system should clean client attempts.
   */
  disableClientAttemptCleanup?: boolean;
};

/**
 * Specifies the configuration options for Transactions queries.
 *
 * @category Transactions
 */
export type TransactionsQueryConfig = {
  /**
   * Specifies the default scan consistency level for queries.
   */
  scanConsistency?: QueryScanConsistency;
};

/**
 * Specifies the configuration options for Transactions.
 *
 * @category Transactions
 */
export type TransactionsConfig = {
  /**
   * Specifies the level of synchronous durability level.
   */
  durabilityLevel?: DurabilityLevel;

  /**
   * Specifies the default timeout for KV operations, specified in millseconds.
   *
   * @deprecated Currently a no-op.  CXXCBC-391: Adds support for ExtSDKIntegration which uses KV durable timeout internally.
   */
  kvTimeout?: number;

  /**
   * Specifies the default timeout for transactions.
   */
  timeout?: number;

  /**
   * Specifies the configuration for queries.
   */
  queryConfig?: TransactionsQueryConfig;

  /**
   * Specifies the configuration for the cleanup system.
   */
  cleanupConfig?: TransactionsCleanupConfig;

  /**
   * Specifies the Keyspace (bucket, scope & collection) for the transaction metadata.
   */
  metadataCollection?: TransactionKeyspace;
};

/**
 * Specifies the configuration options for a Transaction.
 *
 * @category Transactions
 */
export type TransactionOptions = {
  /**
   * Specifies the level of synchronous durability level.
   */
  durabilityLevel?: DurabilityLevel;

  /**
   * Specifies the timeout for the transaction.
   */
  timeout?: number;
};

/**
 * Contains the results of a Transaction.
 *
 * @category Transactions
 */
export class TransactionResult {
  /**
   * @internal
   */
  constructor(data: { transactionId: string; unstagingComplete: boolean }) {
    this.transactionId = data.transactionId;
    this.unstagingComplete = data.unstagingComplete;
  }

  /**
   * The ID of the completed transaction.
   */
  transactionId: string;

  /**
   * Whether all documents were successfully unstaged and are now available
   * for non-transactional operations to see.
   */
  unstagingComplete: boolean;
}

export type TransactionDocInfo<
  T extends CouchbaseClusterTypes = DefaultClusterTypes,
  B extends BucketName<T> = BucketName<T>,
  S extends ScopeName<T, B> = ScopeName<T, B>,
  C extends CollectionName<T, B, S> = CollectionName<T, B, S>,
  Key extends KeyspaceDocDef<T, B, S, C>['Key'] = KeyspaceDocDef<T, B, S, C>['Key'],
> = {
  /**
   * The id of the document.
   */
  id: DocumentId<T, B, S, C, Key>;

  /**
   * The CAS of the document.
   */
  cas: Cas;

  /**
   * @internal
   */
  _links: CppTransactionLinks;

  /**
   * @internal
   */
  _metadata: CppTransactionGetMetaData;
};

/**
 * Contains the results of a transactional Get operation.
 *
 * @category Transactions
 */

export class TransactionGetResult<
  T extends CouchbaseClusterTypes = DefaultClusterTypes,
  B extends BucketName<T> = BucketName<T>,
  S extends ScopeName<T, B> = ScopeName<T, B>,
  C extends CollectionName<T, B, S> = CollectionName<T, B, S>,
  Key extends KeyspaceDocDef<T, B, S, C>['Key'] = KeyspaceDocDef<T, B, S, C>['Key'],
> {
  /**
   * The id of the document.
   */
  id: DocumentId<T, B, S, C, Key>;

  /**
   * The content of the document.
   */
  content: DocDefMatchingKey<Key, T, B, S, C>['Body'];

  /**
   * The CAS of the document.
   */
  cas: Cas;

  /**
   * @internal
   */
  _links: CppTransactionLinks;

  /**
   * @internal
   */
  _metadata: CppTransactionGetMetaData;

  /**
   * @internal
   */
  constructor(data: TransactionGetResult<T, B, S, C, Key>) {
    this.id = data.id;
    this.content = data.content;
    this.cas = data.cas;
    this._links = data._links;
    this._metadata = data._metadata;
  }
}

/**
 * Contains the results of a transactional Exists operation.
 *
 * @category Transactions
 */
export class TransactionExistsResult<
  const Exists extends boolean,
  T extends CouchbaseClusterTypes = DefaultClusterTypes,
  B extends BucketName<T> = BucketName<T>,
  S extends ScopeName<T, B> = ScopeName<T, B>,
  C extends CollectionName<T, B, S> = CollectionName<T, B, S>,
  Key extends KeyspaceDocDef<T, B, S, C>['Key'] = KeyspaceDocDef<T, B, S, C>['Key'],
> {
  /**
   * The id of the document.
   */
  id: DocumentId<T, B, S, C, Key>;

  /**
   * Indicates whether the document existed or not.
   */
  exists: Exists;

  /**
   * The CAS of the document.
   */
  cas: If<Exists, Cas, undefined>;

  /**
   * @internal
   */
  _links: If<Exists, CppTransactionLinks, undefined>;

  /**
   * @internal
   */
  _metadata: If<Exists, CppTransactionGetMetaData, undefined>;

  /**
   * @internal
   */
  constructor(data: {
    id: DocumentId<T, B, S, C, Key>;
    exists: Exists;
    cas: If<Exists, Cas, undefined>;
    _links: If<Exists, CppTransactionLinks, undefined>;
    _metadata: If<Exists, CppTransactionGetMetaData, undefined>;
  }) {
    this.id = data.id;
    this.exists = data.exists;
    this.cas = data.cas;
    this._links = data._links;
    this._metadata = data._metadata;
  }
}

/**
 * Contains the results of a transactional Query operation.
 *
 * @category Transactions
 */
export class TransactionQueryResult<TRow = any, WithMetrics extends boolean = false> {
  /**
   * The rows which have been returned by the query.
   */
  rows: TRow[];

  /**
   * The meta-data which has been returned by the query.
   */
  meta: QueryMetaData<WithMetrics>;

  /**
   * @internal
   */
  constructor(data: QueryResult<TRow, WithMetrics>) {
    this.rows = data.rows;
    this.meta = data.meta;
  }
}

/**
 * @category Transactions
 */
export type TransactionQueryOptions<
  T extends CouchbaseClusterTypes,
  WithMetrics extends boolean = false,
> = {
  queryContext?: QueryContext<T>;

  /**
   * Values to be used for the placeholders within the query.
   */
  parameters?: { [key: string]: any } | any[];

  /**
   * Specifies the consistency requirements when executing the query.
   *
   * @default QueryScanConsistency.NotBounded
   * @see QueryScanConsistency
   */
  scanConsistency?: QueryScanConsistency;

  /**
   * Specifies whether this is an ad-hoc query, or if it should be prepared
   * for faster execution in the future.
   *
   * @default true
   */
  adhoc?: boolean;

  /**
   * The returned client context id for this query.
   */
  clientContextId?: string;

  /**
   * This is an advanced option, see the query service reference for more
   * information on the proper use and tuning of this option.
   */
  maxParallelism?: number;

  /**
   * This is an advanced option, see the query service reference for more
   * information on the proper use and tuning of this option.
   */
  pipelineBatch?: number;

  /**
   * This is an advanced option, see the query service reference for more
   * information on the proper use and tuning of this option.
   */
  pipelineCap?: number;

  /**
   * This is an advanced option, see the query service reference for more
   * information on the proper use and tuning of this option.  Specified
   * in milliseconds.
   */
  scanWait?: number;

  /**
   * This is an advanced option, see the query service reference for more
   * information on the proper use and tuning of this option.
   */
  scanCap?: number;

  /**
   * Specifies that this query should be executed in read-only mode, disabling
   * the ability for the query to make any changes to the data.
   *
   * @default false
   */
  readOnly?: boolean;

  /**
   * Specifies the level of profiling that should be used for the query.
   */
  profile?: QueryProfileMode;

  /**
   * Specifies whether metrics should be captured as part of the execution of
   * the query.
   *
   * @default false
   */
  metrics?: WithMetrics;

  /**
   * Specifies any additional parameters which should be passed to the query engine
   * when executing the query.
   */
  raw?: { [key: string]: any };

  /**
   * Specifies the default function to parse results from the query service.
   *
   * @default {@link JSON.parse}
   */
  queryResultParser?: (value: string) => any;
};

/**
 * @internal
 */
function translateGetResult<
  T extends CouchbaseClusterTypes = DefaultClusterTypes,
  B extends BucketName<T> = BucketName<T>,
  S extends ScopeName<T, B> = ScopeName<T, B>,
  C extends CollectionName<T, B, S> = CollectionName<T, B, S>,
  Key extends KeyspaceDocDef<T, B, S, C>['Key'] = KeyspaceDocDef<T, B, S, C>['Key'],
>(cppRes: CppTransactionGetResult): TransactionGetResult<T, B, S, C, Key> {
  let content: any = cppRes.content;

  try {
    content = JSON.parse(cppRes.content.toString('utf8'));
  } catch (e) {
    /* this is a binary document, let's keep its content as-is */
  }

  const id = new DocumentId<T, B, S, C, Key>(
    cppRes.id.bucket as B,
    cppRes.id.scope as S,
    cppRes.id.collection as C,
    cppRes.id.key as Key
  );

  return new TransactionGetResult({
    id,
    content,
    cas: cppRes.cas,
    _links: cppRes.links,
    _metadata: cppRes.metadata,
  });
}

/**
 * Represents a {@link TransactionAttemptContext} where the bucket has been defined.
 */
export type TransactionAttemptContextBucket<
  T extends CouchbaseClusterTypes,
  B extends BucketName<T> = never,
> = ReturnType<TransactionAttemptContext<T, never, B>['bucket']>;

/**
 * Represents a {@link TransactionAttemptContext} where the bucket and the scope have been defined.
 */
export type TransactionAttemptContextScope<
  T extends CouchbaseClusterTypes,
  B extends BucketName<T> = never,
  S extends ScopeName<T, B> = never,
> = ReturnType<ReturnType<TransactionAttemptContext<T, never, B, S>['bucket']>['scope']>;

/**
 * Provides an interface to preform transactional operations in a transaction.
 *
 * @category Transactions
 */
export class TransactionAttemptContext<
  T extends CouchbaseClusterTypes,
  Instance extends Collection<T, B, S, C> = never,
  B extends BucketName<T> = never,
  S extends ScopeName<T, B> = never,
  C extends CollectionName<T, B, S> = never,
> {
  private cluster: Cluster<T>;
  private _impl: CppTransaction;
  private transcoder: DefaultTranscoder;

  /**
   * @internal
   */
  constructor(txns: Transactions<T>, config?: TransactionOptions) {
    if (!config) {
      config = {};
    }
    this.cluster = txns.cluster;
    this._impl = new binding.Transaction(txns.impl, {
      durability_level: durabilityToCpp(config.durabilityLevel),
      timeout: config.timeout,
      query_scan_consistency: queryScanConsistencyToCpp(undefined),
    });

    this.transcoder = new DefaultTranscoder();
  }

  /**
  @internal
  */
  get impl(): CppTransaction {
    return this._impl;
  }

  /**
   * @internal
   */
  async _newAttempt(): Promise<void> {
    return PromiseHelper.wrap((wrapCallback) => {
      this._impl.newAttempt((cppErr) => {
        const err = errorFromCpp(cppErr);
        wrapCallback(err);
      });
    });
  }

  /**
   * Retrieves the value of a document from the collection.
   *
   * @param collection The collection the document lives in.
   * @param key The document key to retrieve.
   */
  async get<
    LInstance extends AnyCollection,
    CKS extends CollectionKeyspace<LInstance>,
    const LKey extends KeyspaceDocDef<
      T,
      CKS['bucket'],
      CKS['scope'],
      CKS['collection']
    >['Key'],
    const Key extends KeyspaceDocDef<T, B, S, C>['Key'],
  >(
    ...args: If<IsNever<Instance>, [collection: LInstance, key: LKey], [key: Key]>
  ): Promise<
    If<
      IsNever<Instance>,
      TransactionGetResult<
        CKS['clusterTypes'],
        CKS['bucket'],
        CKS['scope'],
        CKS['collection'],
        LKey
      >,
      TransactionGetResult<T, B, S, C, Key>
    >
  > {
    const [collection, key] = args as [LInstance, LKey];

    invariant(collection);

    return (await PromiseHelper.wrap(
      (wrapCallback: NodeCallback<TransactionGetResult>) => {
        const id = collection.getDocId(key);
        this._impl.get(
          {
            id,
          },
          (cppErr, cppRes) => {
            const err = errorFromCpp(cppErr);
            if (err) {
              return wrapCallback(err, null);
            }

            invariant(cppRes);
            wrapCallback(
              null,
              // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
              translateGetResult(cppRes)
            );
          }
        );
      }
    )) as never;
  }

  /**
   * Check if a specific document exists in the collection or not.
   *
   * @param collection The collection the document may lives in.
   * @param key The document key to check.
   */
  async exists<
    LInstance extends AnyCollection,
    CKS extends CollectionKeyspace<LInstance>,
    const LKey extends KeyspaceDocDef<
      T,
      CKS['bucket'],
      CKS['scope'],
      CKS['collection']
    >['Key'],
    const Key extends KeyspaceDocDef<T, B, S, C>['Key'],
  >(
    ...args: If<IsNever<Instance>, [collection: LInstance, key: LKey], [key: Key]>
  ): Promise<
    If<
      IsNever<Instance>,
      | TransactionExistsResult<
          true,
          CKS['clusterTypes'],
          CKS['bucket'],
          CKS['scope'],
          CKS['collection'],
          LKey
        >
      | TransactionExistsResult<
          false,
          CKS['clusterTypes'],
          CKS['bucket'],
          CKS['scope'],
          CKS['collection'],
          LKey
        >,
      | TransactionExistsResult<true, T, B, S, C, Key>
      | TransactionExistsResult<false, T, B, S, C, Key>
    >
  > {
    const [collection, key] = args as [LInstance, LKey];

    invariant(collection);

    try {
      const { cas, id, _metadata, _links } = await this.get(...args);
      return new TransactionExistsResult({
        exists: true,
        cas,
        id,
        _metadata,
        _links,
      }) as never;
    } catch (err) {
      if (err instanceof DocumentNotFoundError) {
        return new TransactionExistsResult({
          exists: false,
          id: (collection as AnyCollection).getDocId(key) as DocumentId<T, B, S, C, Key>,
          cas: undefined,
          _links: undefined,
          _metadata: undefined,
        }) as never;
      }

      throw err;
    }
  }

  /**
   * Inserts a new document to the collection, failing if the document already exists.
   *
   * @param collection The {@link Collection} the document lives in.
   * @param key The document key to insert.
   * @param content The document content to insert.
   */
  async insert<
    LInstance extends AnyCollection,
    CKS extends CollectionKeyspace<LInstance>,
    const LKey extends KeyspaceDocDef<
      T,
      CKS['bucket'],
      CKS['scope'],
      CKS['collection']
    >['Key'],
    const Key extends KeyspaceDocDef<T, B, S, C>['Key'],
  >(
    ...args: If<
      IsNever<Instance>,
      [
        collection: LInstance,
        key: LKey,
        content: DocDefMatchingKey<
          LKey,
          CKS['clusterTypes'],
          CKS['bucket'],
          CKS['scope'],
          CKS['collection']
        >['Body'],
      ],
      [key: Key, content: DocDefMatchingKey<Key, T, B, S, C>['Body']]
    >
  ): Promise<
    If<
      IsNever<Instance>,
      TransactionGetResult<
        CKS['clusterTypes'],
        CKS['bucket'],
        CKS['scope'],
        CKS['collection'],
        LKey
      >,
      TransactionGetResult<T, B, S, C, Key>
    >
  > {
    const [collection, key, content] = args as [
      LInstance,
      LKey,
      DocDefMatchingKey<Key, T, B, S, C>['Body'],
    ];

    invariant(collection);

    return (await PromiseHelper.wrap(
      (wrapCallback: NodeCallback<TransactionGetResult<T, B, S, C, Key>>) => {
        const id = collection.getDocId(key);
        const [data, flags] = this.transcoder.encode(content);

        this._impl.insert(
          {
            id,
            content: { data, flags },
          },
          (cppErr, cppRes) => {
            const err = errorFromCpp(cppErr);

            if (err) {
              return wrapCallback(err, null);
            }

            invariant(cppRes);
            wrapCallback(null, translateGetResult(cppRes));
          }
        );
      }
    )) as never;
  }

  /**
   * Replaces a document in a collection.
   *
   * @param doc The document to replace.
   * @param content The document content to insert.
   */
  async replace<
    LB extends BucketName<T>,
    LS extends ScopeName<T, LB>,
    LC extends CollectionName<T, LB, LS>,
    const Key extends KeyspaceDocDef<T, LB, LS, LC>['Key'],
  >(
    doc: Exclude<TransactionDocInfo<T, LB, LS, LC, Key>, 'cas'> & { cas: CasInput },
    content: DocDefMatchingKey<Key, T, LB, LS, LC>['Body']
  ): Promise<TransactionGetResult<T, LB, LS, LC, Key>> {
    return PromiseHelper.wrap(
      (wrapCallback: NodeCallback<TransactionGetResult<T, LB, LS, LC, Key>>) => {
        const [data, flags] = this.transcoder.encode(content);
        this._impl.replace(
          {
            doc: {
              id: doc.id,
              content: Buffer.from(''),
              cas: doc.cas,
              links: doc._links,
              metadata: doc._metadata,
            },
            content: { data, flags },
          },
          (cppErr, cppRes) => {
            const err = errorFromCpp(cppErr);

            if (err !== null) {
              return wrapCallback(err, null);
            }

            invariant(cppRes);
            wrapCallback(null, translateGetResult(cppRes));
          }
        );
      }
    );
  }

  /**
   * Removes a document from a collection.
   *
   * @param doc The document to remove.
   */
  async remove<
    LB extends BucketName<T>,
    LS extends ScopeName<T, LB>,
    LC extends CollectionName<T, LB, LS>,
    const Key extends KeyspaceDocDef<T, LB, LS, LC>['Key'],
  >(
    doc: Exclude<TransactionDocInfo<T, LB, LS, LC, Key>, 'cas'> & { cas: CasInput }
  ): Promise<void> {
    return PromiseHelper.wrap((wrapCallback) => {
      this._impl.remove(
        {
          doc: {
            id: doc.id,
            content: Buffer.from(''),
            cas: doc.cas,
            links: doc._links,
            metadata: doc._metadata,
          },
        },
        (cppErr) => {
          const err = errorFromCpp(cppErr);
          wrapCallback(err);
        }
      );
    });
  }

  /**
   * Executes a query in the context of this transaction.
   *
   * @param statement The statement to execute.
   * @param options Optional parameters for this operation.
   */
  async query<TRow = any, WithMetrics extends boolean = false>(
    statement: string,
    options?: TransactionQueryOptions<T, WithMetrics>
  ): Promise<TransactionQueryResult<TRow, WithMetrics>> {
    const rowParser = options?.queryResultParser ?? this.cluster.queryResultParser;

    // This await statement is explicit here to ensure our query is completely
    // processed before returning the result to the user (no row streaming).
    const syncQueryRes = await QueryExecutor.execute<TRow, WithMetrics>((callback) => {
      if (!options) {
        options = {};
      }

      if (options.queryContext) {
        options.raw ??= {};
        options.raw.query_context = options.queryContext;
      }

      this._impl.query(
        statement,
        {
          scan_consistency: queryScanConsistencyToCpp(options.scanConsistency),
          ad_hoc: options.adhoc ?? false,
          client_context_id: options.clientContextId,
          pipeline_batch: options.pipelineBatch,
          pipeline_cap: options.pipelineCap,
          max_parallelism: options.maxParallelism,
          scan_wait: options.scanWait,
          scan_cap: options.scanCap,
          readonly: options.readOnly ?? false,
          profile: queryProfileToCpp(options.profile),
          metrics: options.metrics ?? false,
          raw: options.raw
            ? Object.fromEntries(
                Object.entries(options.raw)
                  .filter(([, v]) => v !== undefined)
                  .map(([k, v]) => [k, Buffer.from(JSON.stringify(v))])
              )
            : {},
          positional_parameters:
            options.parameters && Array.isArray(options.parameters)
              ? options.parameters.map((v) => Buffer.from(JSON.stringify(v ?? null)))
              : [],
          named_parameters:
            options.parameters && !Array.isArray(options.parameters)
              ? Object.fromEntries(
                  Object.entries(options.parameters as { [key: string]: any })
                    .filter(([, v]) => v !== undefined)
                    .map(([k, v]) => [k, Buffer.from(JSON.stringify(v))])
                )
              : {},
        },
        (cppErr, resp) => {
          callback(cppErr, resp);
        }
      );
    }, rowParser);
    return new TransactionQueryResult<TRow, WithMetrics>({
      rows: syncQueryRes.rows,
      meta: syncQueryRes.meta,
    });
  }

  /**
   * @internal
   */
  async _commit(): Promise<TransactionResult> {
    return PromiseHelper.wrap((wrapCallback: NodeCallback<TransactionResult>) => {
      this._impl.commit((cppErr, cppRes) => {
        const err = errorFromCpp(cppErr);

        if (err === null) {
          invariant(cppRes);
          const res = new TransactionResult({
            transactionId: cppRes.transaction_id,
            unstagingComplete: cppRes.unstaging_complete,
          });

          wrapCallback(null, res);
          return;
        }

        wrapCallback(err, null);
      });
    });
  }

  /**
   * @internal
   */
  async _rollback(): Promise<void> {
    return PromiseHelper.wrap((wrapCallback) => {
      this._impl.rollback((cppErr) => {
        const err = errorFromCpp(cppErr);
        wrapCallback(err);
      });
    });
  }

  bucket<LB extends BucketName<T>>(this: TransactionAttemptContext<T>, bucketName: LB) {
    return {
      scope: <LS extends ScopeName<T, LB>>(scopeName: LS) => {
        return {
          collection: <LC extends CollectionName<T, LB, LS>>(collectionName: LC) => {
            const collection = this.cluster
              .bucket(bucketName)
              .scope(scopeName)
              .collection(collectionName);

            const ctx = this as any as TransactionAttemptContext<
              T,
              Collection<T, LB, LS, LC>,
              LB,
              LS,
              LC
            >;

            return new Proxy(ctx, {
              get: (
                target,
                prop: keyof TransactionAttemptContext<any>,
                receiver: TransactionAttemptContext<any>
              ) => {
                if (!['insert', 'exists', 'get'].includes(prop)) {
                  return target[prop];
                }
                const value = target[prop as 'insert' | 'exists' | 'get'] as (
                  collection: Collection<T, LB, LS, LC>
                ) => unknown;
                return value.bind(this === receiver ? target : this, collection);
              },
            });
          },
        };
      },
    };
  }
}

/**
 * Provides an interface to access transactions.
 *
 * @category Transactions
 */
export class Transactions<T extends CouchbaseClusterTypes> {
  private _cluster: Cluster<T>;
  private _impl: CppTransactions;

  /**
  @internal
  */
  constructor(cluster: Cluster<T>, config?: TransactionsConfig) {
    if (!config) {
      config = {};
    }
    if (!config.cleanupConfig) {
      config.cleanupConfig = {};
    }
    if (!config.queryConfig) {
      config.queryConfig = {};
    }

    const connImpl = cluster.conn;

    try {
      const txnsImpl = new binding.Transactions(connImpl, {
        durability_level: durabilityToCpp(config.durabilityLevel),
        timeout: config.timeout ?? config.kvTimeout,
        query_scan_consistency: queryScanConsistencyToCpp(
          config.queryConfig.scanConsistency
        ),
        cleanup_window: config.cleanupConfig.cleanupWindow,
        cleanup_lost_attempts: !config.cleanupConfig.disableLostAttemptCleanup,
        cleanup_client_attempts: !config.cleanupConfig.disableClientAttemptCleanup,
        metadata_collection: transactionKeyspaceToCpp(config.metadataCollection),
      });

      this._cluster = cluster;
      this._impl = txnsImpl;
    } catch (err) {
      throw errorFromCpp(err);
    }
  }

  get cluster(): Cluster<T> {
    return this._cluster;
  }

  /**
  @internal
  */
  get impl(): CppTransactions {
    return this._impl;
  }

  /**
  @internal
  */
  async _close(): Promise<void> {
    return PromiseHelper.wrap((wrapCallback) => {
      this._impl.close((cppErr) => {
        const err = errorFromCpp(cppErr);
        wrapCallback(err);
      });
    });
  }

  /**
   * Executes a transaction.
   *
   * @param logicFn The transaction lambda to execute.
   * @param config Configuration operations for the transaction.
   */
  async run(
    logicFn: (attempt: TransactionAttemptContext<T>) => Promise<void>,
    config?: TransactionOptions
  ): Promise<TransactionResult> {
    const txn = new TransactionAttemptContext(this, config);

    for (;;) {
      await txn._newAttempt();

      try {
        await logicFn(txn);
      } catch (e) {
        await txn._rollback();
        if (e instanceof TransactionOperationFailedError) {
          throw new TransactionFailedError(undefined, e.cause, e.context);
        }
        invariant(e instanceof Error);
        throw new TransactionFailedError(undefined, e);
      }

      try {
        const txnResult = await txn._commit(); // this is actually finalize internally
        if (!txnResult) {
          // no result and no error, try again
          continue;
        }

        return txnResult;
      } catch (e) {
        // commit failed, retry...
      }
    }
  }
}
