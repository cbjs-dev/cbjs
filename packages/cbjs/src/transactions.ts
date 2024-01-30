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
import binding, {
  CppQueryResponse,
  CppTransaction,
  CppTransactionGetMetaData,
  CppTransactionGetResult,
  CppTransactionLinks,
  CppTransactions,
} from './binding';
import {
  durabilityToCpp,
  errorFromCpp,
  queryProfileToCpp,
  queryScanConsistencyToCpp,
} from './bindingutilities';
import { Cluster } from './cluster';
import { CollectionAmong, CouchbaseClusterTypes } from './clusterTypes';
import {
  ExtractBodyByKey,
  ExtractCollectionDocumentBag,
  ExtractCollectionDocumentDef,
} from './clusterTypes/clusterTypes';
import { TransactionFailedError, TransactionOperationFailedError } from './errors';
import { DurabilityLevel } from './generaltypes';
import { QueryExecutor } from './queryexecutor';
import {
  QueryMetaData,
  QueryProfileMode,
  QueryResult,
  QueryScanConsistency,
} from './querytypes';
import { Scope } from './scope';
import { Cas, NodeCallback, PromiseHelper } from './utilities';
import { invariant } from '@cbjs/shared';

/**
 * Represents the path to a document.
 *
 * @category Transactions
 */
export class DocumentId {
  constructor() {
    this.bucket = '';
    this.scope = '';
    this.collection = '';
    this.key = '';
  }

  /**
   * The name of the bucket containing the document.
   */
  bucket: string;

  /**
   * The name of the scope containing the document.
   */
  scope: string;

  /**
   * The name of the collection containing the document.
   */
  collection: string;

  /**
   * The key of the docuemnt.
   */
  key: string;
}

/**
 * Specifies the configuration options for Transactions cleanup.
 *
 * @category Transactions
 */
export interface TransactionsCleanupConfig {
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
}

/**
 * Specifies the configuration options for Transactions queries.
 *
 * @category Transactions
 */
export interface TransactionsQueryConfig {
  /**
   * Specifies the default scan consistency level for queries.
   */
  scanConsistency?: QueryScanConsistency;
}

/**
 * Specifies the configuration options for Transactions.
 *
 * @category Transactions
 */
export interface TransactionsConfig {
  /**
   * Specifies the level of synchronous durability level.
   */
  durabilityLevel?: DurabilityLevel;

  /**
   * Specifies the default timeout for KV operations, specified in millseconds.
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
}

/**
 * Specifies the configuration options for a Transaction.
 *
 * @category Transactions
 */
export interface TransactionOptions {
  /**
   * Specifies the level of synchronous durability level.
   */
  durabilityLevel?: DurabilityLevel;

  /**
   * Specifies the timeout for the transaction.
   */
  timeout?: number;
}

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

/**
 * Contains the results of a transactional Get operation.
 *
 * @category Transactions
 */
export class TransactionGetResult<Doc> {
  /**
   * The id of the document.
   */
  id: DocumentId;

  /**
   * The content of the document.
   */
  content: Doc;

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
  constructor(data: TransactionGetResult<Doc>) {
    this.id = data.id;
    this.content = data.content;
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
export class TransactionQueryResult<TRow = any> {
  /**
   * The rows which have been returned by the query.
   */
  rows: TRow[];

  /**
   * The meta-data which has been returned by the query.
   */
  meta: QueryMetaData;

  /**
   * @internal
   */
  constructor(data: QueryResult) {
    this.rows = data.rows;
    this.meta = data.meta;
  }
}

/**
 * @category Transactions
 */
export interface TransactionQueryOptions {
  /**
   * Values to be used for the placeholders within the query.
   */
  parameters?: { [key: string]: any } | any[];

  /**
   * Specifies the consistency requirements when executing the query.
   *
   * @see QueryScanConsistency
   */
  scanConsistency?: QueryScanConsistency;

  /**
   * Specifies whether this is an ad-hoc query, or if it should be prepared
   * for faster execution in the future.
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
   */
  readOnly?: boolean;

  /**
   * Specifies the level of profiling that should be used for the query.
   */
  profile?: QueryProfileMode;

  /**
   * Specifies whether metrics should be captured as part of the execution of
   * the query.
   */
  metrics?: boolean;

  /**
   * Specifies any additional parameters which should be passed to the query engine
   * when executing the query.
   */
  raw?: { [key: string]: any };

  /**
   * Specifies the scope to run this query in.
   */
  scope?: Scope<any, any, any>;
}

/**
 * @internal
 */
function translateGetResult<Doc>(
  cppRes: CppTransactionGetResult
): TransactionGetResult<Doc> {
  return new TransactionGetResult({
    id: cppRes.id,
    content:
      cppRes.content && cppRes.content.length > 0
        ? JSON.parse(cppRes.content.toString('utf8'))
        : undefined,
    cas: cppRes.cas,
    _links: cppRes.links,
    _metadata: cppRes.metadata,
  });
}

/**
 * Provides an interface to preform transactional operations in a transaction.
 *
 * @category Transactions
 */
export class TransactionAttemptContext<T extends CouchbaseClusterTypes> {
  private _impl: CppTransaction;

  /**
   * @internal
   */
  constructor(txns: Transactions<T>, config?: TransactionOptions) {
    if (!config) {
      config = {};
    }
    this._impl = new binding.Transaction(txns.impl, {
      durability_level: durabilityToCpp(config.durabilityLevel),
      expiration_time: config.timeout,
      query_scan_consistency: queryScanConsistencyToCpp(undefined),
    });
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
    C extends CollectionAmong<T>,
    Key extends ExtractCollectionDocumentBag<C>['Key'],
    Doc extends ExtractBodyByKey<Key, ExtractCollectionDocumentDef<C>> = ExtractBodyByKey<
      Key,
      ExtractCollectionDocumentDef<C>
    >
  >(collection: C, key: Key): Promise<TransactionGetResult<Doc>> {
    return PromiseHelper.wrap((wrapCallback: NodeCallback<TransactionGetResult<Doc>>) => {
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
          wrapCallback(null, translateGetResult(cppRes));
        }
      );
    });
  }

  /**
   * Inserts a new document to the collection, failing if the document already exists.
   *
   * @param collection The {@link Collection} the document lives in.
   * @param key The document key to insert.
   * @param content The document content to insert.
   */
  async insert<
    C extends CollectionAmong<T>,
    Key extends ExtractCollectionDocumentBag<C>['Key'],
    Doc extends ExtractBodyByKey<Key, ExtractCollectionDocumentDef<C>> = ExtractBodyByKey<
      Key,
      ExtractCollectionDocumentDef<C>
    >
  >(collection: C, key: Key, content: Doc): Promise<TransactionGetResult<Doc>> {
    return PromiseHelper.wrap((wrapCallback: NodeCallback<TransactionGetResult<Doc>>) => {
      const id = collection.getDocId(key);
      this._impl.insert(
        {
          id,
          content: Buffer.from(JSON.stringify(content)),
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
    });
  }

  /**
   * Replaces a document in a collection.
   *
   * @param doc The document to replace.
   * @param content The document content to insert.
   */
  async replace<Doc>(
    doc: TransactionGetResult<Doc>,
    content: Doc
  ): Promise<TransactionGetResult<Doc>> {
    return PromiseHelper.wrap((wrapCallback: NodeCallback<TransactionGetResult<Doc>>) => {
      this._impl.replace(
        {
          doc: {
            id: doc.id,
            content: Buffer.from(''),
            cas: doc.cas,
            links: doc._links,
            metadata: doc._metadata,
          },
          content: Buffer.from(JSON.stringify(content)),
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
    });
  }

  /**
   * Removes a document from a collection.
   *
   * @param doc The document to remove.
   */
  async remove<Doc>(doc: TransactionGetResult<Doc>): Promise<void> {
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
  async query<TRow = any>(
    statement: string,
    options?: TransactionQueryOptions
  ): Promise<TransactionQueryResult<TRow>> {
    // This await statement is explicit here to ensure our query is completely
    // processed before returning the result to the user (no row streaming).
    const syncQueryRes = await QueryExecutor.execute((callback) => {
      if (!options) {
        options = {};
      }

      this._impl.query(
        statement,
        {
          scan_consistency: queryScanConsistencyToCpp(options.scanConsistency),
          ad_hoc: options.adhoc === false ? false : true,
          client_context_id: options.clientContextId,
          pipeline_batch: options.pipelineBatch,
          pipeline_cap: options.pipelineCap,
          max_parallelism: options.maxParallelism,
          scan_wait: options.scanWait,
          scan_cap: options.scanCap,
          readonly: options.readOnly || false,
          profile: queryProfileToCpp(options.profile),
          metrics: options.metrics || false,
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
          callback(cppErr, resp as CppQueryResponse);
        }
      );
    });
    return new TransactionQueryResult({
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
    const txnsImpl = new binding.Transactions(connImpl, {
      durability_level: durabilityToCpp(config.durabilityLevel),
      kv_timeout: config.kvTimeout,
      expiration_time: config.timeout,
      query_scan_consistency: queryScanConsistencyToCpp(
        config.queryConfig.scanConsistency
      ),
      cleanup_window: config.cleanupConfig.cleanupWindow,
      cleanup_lost_attempts: !config.cleanupConfig.disableLostAttemptCleanup,
      cleanup_client_attempts: !config.cleanupConfig.disableClientAttemptCleanup,
    });

    this._cluster = cluster;
    this._impl = txnsImpl;
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