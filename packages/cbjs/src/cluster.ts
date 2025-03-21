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
import { inspect, promisify } from 'util';

import { BucketName, CouchbaseClusterTypes, DefaultClusterTypes } from '@cbjsdev/shared';

import { AnalyticsExecutor } from './analyticsexecutor.js';
import { AnalyticsIndexManager } from './analyticsindexmanager.js';
import {
  AnalyticsMetaData,
  AnalyticsQueryOptions,
  AnalyticsResult,
} from './analyticstypes.js';
import {
  Authenticator,
  CertificateAuthenticator,
  PasswordAuthenticator,
} from './authenticators.js';
import binding, { CppClusterCredentials, CppConnection } from './binding.js';
import { errorFromCpp } from './bindingutilities.js';
import { Bucket } from './bucket.js';
import { BucketManager } from './bucketmanager.js';
import { connectionProfiles } from './configProfile.js';
import { ConnSpec } from './connspec.js';
import { DiagnoticsExecutor, PingExecutor } from './diagnosticsexecutor.js';
import {
  DiagnosticsOptions,
  DiagnosticsResult,
  PingOptions,
  PingResult,
} from './diagnosticstypes.js';
import { CouchbaseError } from './errors.js';
import { EventingFunctionManager } from './eventingfunctionmanager.js';
import { QueryExecutor } from './queryexecutor.js';
import { QueryIndexManager } from './queryindexmanager.js';
import { QueryMetaData, QueryOptions, QueryResult } from './querytypes.js';
import { SearchExecutor } from './searchexecutor.js';
import { SearchIndexManager } from './searchindexmanager.js';
import { SearchQuery } from './searchquery.js';
import {
  SearchMetaData,
  SearchQueryOptions,
  SearchRequest,
  SearchResult,
  SearchRow,
} from './searchtypes.js';
import { StreamableRowPromise } from './streamablepromises.js';
import { Transactions, TransactionsConfig } from './transactions.js';
import { DefaultTranscoder, Transcoder } from './transcoders.js';
import { UserManager } from './usermanager.js';
import { NodeCallback, PromiseHelper, VoidNodeCallback } from './utilities.js';
import { generateClientString } from './utilities_internal.js';
import { resolveOptionsAndCallback } from './utils/resolveOptionsAndCallback.js';

/**
 * Specifies the timeout options for the client.
 *
 * @category Core
 */
export type TimeoutConfig = {
  /**
   * Specifies the default timeout for KV operations, specified in millseconds.
   */
  kvTimeout?: number;

  /**
   * Specifies the default timeout for durable KV operations, specified in millseconds.
   */
  kvDurableTimeout?: number;

  /**
   * Specifies the default timeout for views operations, specified in millseconds.
   */
  viewTimeout?: number;

  /**
   * Specifies the default timeout for query operations, specified in millseconds.
   */
  queryTimeout?: number;

  /**
   * Specifies the default timeout for analytics query operations, specified in millseconds.
   */
  analyticsTimeout?: number;

  /**
   * Specifies the default timeout for search query operations, specified in millseconds.
   */
  searchTimeout?: number;

  /**
   * Specifies the default timeout for management operations, specified in millseconds.
   */
  managementTimeout?: number;

  /**
   * Specifies the default timeout allocated to complete bootstrap, specified in millseconds.
   */
  bootstrapTimeout?: number;

  /**
   * Specifies the default timeout for attempting to connect to a node’s KV service via a socket, specified in millseconds.
   */
  connectTimeout?: number;

  /**
   * Specifies the default timeout to resolve DNS name of the node to IP address, specified in millseconds.
   */
  resolveTimeout?: number;
};

/**
 * Specifies security options for the client.
 *
 * @category Core
 */
export type SecurityConfig = {
  /**
   * Specifies the path to a trust store file to be used when validating the
   * authenticity of the server when connecting over SSL.
   */
  trustStorePath?: string;
};

/**
 * Specifies DNS options for the client.
 *
 * Volatile: This API is subject to change at any time.
 *
 * @category Core
 */
export type DnsConfig = {
  /**
   * Specifies the nameserver to be used for DNS query when connecting.
   */
  nameserver?: string;

  /**
   * Specifies the port to be used for DNS query when connecting.
   */
  port?: number;

  /**
   * Specifies the default timeout for DNS SRV operations, specified in millseconds.
   */
  dnsSrvTimeout?: number;
};

export type Hooks<T extends CouchbaseClusterTypes> = {
  /**
   * Any error thrown in a hook will be swallowed and this function will be called
   * @param err The error thrown by the hook function.
   */
  onHookError: (err: unknown) => void;
  onQueryStart: (opts: {
    statement: string;
    options: QueryOptions<T, boolean>;
  }) => unknown;
  onQueryEnd: (
    opts:
      | {
          statement: string;
          options: QueryOptions<T, boolean>;
          result: QueryResult<any, boolean>;
        }
      | {
          statement: string;
          options: QueryOptions<T, boolean>;
          error: Error;
        },
    returnOfOnQueryStart: unknown
  ) => void;
};

/**
 * Specifies the options which can be specified when connecting
 * to a cluster.
 *
 * @category Core
 */
export type ConnectOptions<T extends CouchbaseClusterTypes = any> = {
  /**
   * Specifies a username to use for an implicitly created IPasswordAuthenticator
   * used for authentication with the cluster.
   */
  username?: string;

  /**
   * Specifies a password to be used in concert with username for authentication.
   *
   * @see ConnectOptions.username
   */
  password?: string;

  /**
   * Specifies a specific authenticator to use when connecting to the cluster.
   */
  authenticator?: Authenticator;

  /**
   * Specifies the security config for connections of this cluster.
   */
  security?: SecurityConfig;

  /**
   * Specifies the default timeouts for various operations performed by the SDK.
   */
  timeouts?: TimeoutConfig;

  /**
   * Specifies the default transcoder to use when encoding or decoding document values.
   * This is specific to the KV service.
   */
  transcoder?: Transcoder;

  /**
   * Specifies the default function to parse results from the query service.
   *
   * @default {@link JSON.parse}
   */
  queryResultParser?: (value: string) => any;

  /**
   * Specifies hook functions that allow you to perform actions before and after some Couchbase operations.
   */
  hooks?: Partial<Hooks<T>>;

  /**
   * Specifies the options for transactions.
   */
  transactions?: TransactionsConfig;

  /**
   * Specifies the DNS config for connections of this cluster.
   *
   * Volatile: This API is subject to change at any time.
   *
   */
  dnsConfig?: DnsConfig;

  /**
   * Applies the specified ConfigProfile options to the cluster.
   *
   * Volatile: This API is subject to change at any time.
   *
   */
  configProfile?: string;
};

/**
 * Exposes the operations which are available to be performed against a cluster.
 * Namely the ability to access to Buckets as well as performing management
 * operations against the cluster.
 *
 * @category Core
 */
export class Cluster<in out T extends CouchbaseClusterTypes = DefaultClusterTypes> {
  private _connStr: string;
  private _trustStorePath: string;
  private _kvTimeout: number;
  private _kvDurableTimeout: number;
  private _viewTimeout: number;
  private _queryTimeout: number;
  private _analyticsTimeout: number;
  private _searchTimeout: number;
  private _managementTimeout: number;
  private _connectTimeout: number | undefined;
  private _bootstrapTimeout: number | undefined;
  private _resolveTimeout: number | undefined;
  private _auth: Authenticator;
  private _conn: CppConnection;
  private _transcoder: Transcoder;
  private _queryResultParser: (value: string) => any;
  private _hooks?: Partial<Hooks<T>>;
  private _txnConfig: TransactionsConfig;
  private _transactions?: Transactions<T>;
  private readonly _openBuckets: Map<BucketName<T>, Promise<void>>;
  private _dnsConfig: DnsConfig | null;

  /**
   * @internal
   */
  get conn(): CppConnection {
    return this._conn;
  }

  /**
  @internal
  */
  get transcoder(): Transcoder {
    return this._transcoder;
  }

  /**
  @internal
  */
  get queryResultParser(): (value: string) => any {
    return this._queryResultParser;
  }

  /**
  @internal
  */
  get hooks(): Partial<Hooks<T>> | undefined {
    return this._hooks;
  }

  /**
  @internal
  */
  get kvTimeout(): number {
    return this._kvTimeout;
  }

  /**
  @internal
  */
  get kvDurableTimeout(): number {
    return this._kvDurableTimeout;
  }

  /**
  @internal
  */
  get viewTimeout(): number {
    return this._viewTimeout;
  }

  /**
  @internal
  */
  get queryTimeout(): number {
    return this._queryTimeout;
  }

  /**
  @internal
  */
  get analyticsTimeout(): number {
    return this._analyticsTimeout;
  }

  /**
  @internal
  */
  get searchTimeout(): number {
    return this._searchTimeout;
  }

  /**
  @internal
  */
  get managementTimeout(): number {
    return this._managementTimeout;
  }

  /**
  @internal
  */
  get bootstrapTimeout(): number | undefined {
    return this._bootstrapTimeout;
  }

  /**
  @internal
  */
  get connectTimeout(): number | undefined {
    return this._connectTimeout;
  }

  /**
  @internal
  */
  get resolveTimeout(): number | undefined {
    return this._resolveTimeout;
  }

  /**
   * @internal
   */
  [inspect.custom](): Record<string, any> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _auth, ...rest } = this;
    return { ...rest, _auth: '***hidden***' };
  }
  /**
   * @internal
   */
  toJSON(): Record<string, any> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _auth, ...rest } = this;
    return { ...rest, _auth: '***hidden***' };
  }

  /**
  @internal
  @deprecated Use the static sdk-level {@link connect} method instead.
  */
  constructor(connStr: string, options?: ConnectOptions<T>) {
    if (!options) {
      options = {};
    }

    if (!options.security) {
      options.security = {};
    }
    if (!options.timeouts) {
      options.timeouts = {};
    }

    this._connStr = connStr;
    this._trustStorePath = options.security.trustStorePath ?? '';

    if (options.configProfile) {
      connectionProfiles.applyProfile(options.configProfile, options as never);
    }
    this._kvTimeout = options.timeouts.kvTimeout ?? 2500;
    this._kvDurableTimeout = options.timeouts.kvDurableTimeout ?? 10000;
    this._viewTimeout = options.timeouts.viewTimeout ?? 75000;
    this._queryTimeout = options.timeouts.queryTimeout ?? 75000;
    this._analyticsTimeout = options.timeouts.analyticsTimeout ?? 75000;
    this._searchTimeout = options.timeouts.searchTimeout ?? 75000;
    this._managementTimeout = options.timeouts.managementTimeout ?? 75000;
    this._bootstrapTimeout = options.timeouts?.bootstrapTimeout;
    this._connectTimeout = options.timeouts?.connectTimeout;
    this._resolveTimeout = options.timeouts?.resolveTimeout;

    this._transcoder = options.transcoder ?? new DefaultTranscoder();
    this._queryResultParser = options.queryResultParser ?? JSON.parse;
    this._hooks = options.hooks;

    if (options.transactions) {
      this._txnConfig = options.transactions;
    } else {
      this._txnConfig = {};
    }

    if (options.username !== undefined || options.password !== undefined) {
      if (options.authenticator) {
        throw new Error('Cannot specify authenticator along with username/password.');
      }

      this._auth = {
        username: options.username ?? '',
        password: options.password ?? '',
      };
    } else if (options.authenticator) {
      this._auth = options.authenticator;
    } else {
      this._auth = {
        username: '',
        password: '',
      };
    }

    if (
      options.dnsConfig &&
      (options.dnsConfig.nameserver ??
        options.dnsConfig.port ??
        options.dnsConfig.dnsSrvTimeout)
    ) {
      this._dnsConfig = {
        nameserver: options.dnsConfig.nameserver,
        port: options.dnsConfig.port,
        dnsSrvTimeout: options.dnsConfig.dnsSrvTimeout ?? 500,
      };
    } else {
      this._dnsConfig = null;
    }

    this._openBuckets = new Map();
    this._conn = new binding.Connection();
  }

  /**
    @internal
    @throws AuthenticationFailureError
  */
  static async connect<T extends CouchbaseClusterTypes = DefaultClusterTypes>(
    connStr: string,
    options?: ConnectOptions<T>,
    callback?: NodeCallback<Cluster<T>>
  ): Promise<Cluster<T>> {
    return await PromiseHelper.wrapAsync(async () => {
      const cluster = new Cluster<T>(connStr, options);
      await cluster._connect();
      return cluster;
    }, callback);
  }

  /**
   * Creates a Bucket object reference to a specific bucket.
   *
   * @param bucketName The name of the bucket to reference.
   */
  bucket<B extends BucketName<T>>(bucketName: B): Bucket<T, B> {
    if (!this._openBuckets.has(bucketName)) {
      const openBucket = promisify(this.conn.openBucket).bind(this.conn);
      this._openBuckets.set(bucketName, openBucket(bucketName));
    }

    return new Bucket(this, bucketName);
  }

  /**
   * Returns a UserManager which can be used to manage the users
   * of this cluster.
   */
  users(): UserManager<T> {
    return new UserManager(this);
  }

  /**
   * Returns a BucketManager which can be used to manage the buckets
   * of this cluster.
   */
  buckets(): BucketManager<T> {
    return new BucketManager(this);
  }

  /**
   * Returns a QueryIndexManager which can be used to manage the query indexes
   * of this cluster.
   */
  queryIndexes(): QueryIndexManager<T> {
    return new QueryIndexManager(this);
  }

  /**
   * Returns a AnalyticsIndexManager which can be used to manage the analytics
   * indexes of this cluster.
   */
  analyticsIndexes(): AnalyticsIndexManager<T> {
    return new AnalyticsIndexManager(this);
  }

  /**
   * Returns a SearchIndexManager which can be used to manage the search
   * indexes of this cluster.
   */
  searchIndexes(): SearchIndexManager<T> {
    return new SearchIndexManager(this);
  }

  /**
   * Returns a EventingFunctionManager which can be used to manage the eventing
   * functions of this cluster.
   * Uncommitted: This API is subject to change in the future.
   */
  eventingFunctions(): EventingFunctionManager<T> {
    return new EventingFunctionManager(this);
  }

  /**
   * Returns a Transactions object which can be used to perform transactions
   * on this cluster.
   */
  transactions(): Transactions<T> {
    if (!this._transactions) {
      this._transactions = new Transactions(this, this._txnConfig);
    }
    return this._transactions;
  }

  /**
   * Executes a N1QL query against the cluster.
   *
   * @param statement The N1QL statement to execute.
   * @param callback A node-style callback to be invoked after execution.
   */
  query<TRow = any>(
    statement: string,
    callback?: NodeCallback<QueryResult<TRow>>
  ): StreamableRowPromise<QueryResult<TRow>, TRow, QueryMetaData>;

  /**
   * Executes a N1QL query against the cluster.
   *
   * @param statement The N1QL statement to execute.
   * @param options Optional parameters for this operation.
   * @param callback A node-style callback to be invoked after execution.
   */
  query<TRow = any, WithMetrics extends boolean = false>(
    statement: string,
    options: QueryOptions<T, WithMetrics>,
    callback?: NodeCallback<QueryResult<TRow>>
  ): StreamableRowPromise<QueryResult<TRow, WithMetrics>, TRow, QueryMetaData>;

  query<TRow = any, WithMetrics extends boolean = false>(
    statement: string,
    options?: QueryOptions<T, WithMetrics> | NodeCallback<QueryResult<TRow>>,
    callback?: NodeCallback<QueryResult<TRow>>
  ): StreamableRowPromise<QueryResult<TRow>, TRow, QueryMetaData> {
    if (options instanceof Function) {
      callback = options;
      options = undefined;
    }
    if (!options) {
      options = {} as QueryOptions<T, WithMetrics>;
    }

    const exec = new QueryExecutor(this);

    return PromiseHelper.wrapAsync(
      () =>
        exec.query<TRow, WithMetrics>(statement, {
          ...options,
        }),
      callback
    );
  }

  /**
   * Executes an analytics query against the cluster.
   *
   * @param statement The analytics statement to execute.
   * @param callback A node-style callback to be invoked after execution.
   */
  analyticsQuery<TRow = any>(
    statement: string,
    callback?: NodeCallback<AnalyticsResult<TRow>>
  ): StreamableRowPromise<AnalyticsResult<TRow>, TRow, AnalyticsMetaData>;

  /**
   * Executes an analytics query against the cluster.
   *
   * @param statement The analytics statement to execute.
   * @param options Optional parameters for this operation.
   * @param callback A node-style callback to be invoked after execution.
   */
  analyticsQuery<TRow = any>(
    statement: string,
    options: AnalyticsQueryOptions,
    callback?: NodeCallback<AnalyticsResult<TRow>>
  ): StreamableRowPromise<AnalyticsResult<TRow>, TRow, AnalyticsMetaData>;

  analyticsQuery<TRow = any>(
    statement: string,
    options?: AnalyticsQueryOptions | NodeCallback<AnalyticsResult<TRow>>,
    callback?: NodeCallback<AnalyticsResult<TRow>>
  ): StreamableRowPromise<AnalyticsResult<TRow>, TRow, AnalyticsMetaData> {
    if (options instanceof Function) {
      callback = options;
      options = undefined;
    }
    if (!options) {
      options = {};
    }

    const exec = new AnalyticsExecutor(this);

    const options_ = options;
    return PromiseHelper.wrapAsync(() => exec.query<TRow>(statement, options_), callback);
  }

  /**
   * Executes a search query against the cluster.
   *
   * @param indexName The name of the index to query.
   * @param query The SearchQuery describing the query to execute.
   * @param callback A node-style callback to be invoked after execution.
   */
  searchQuery(
    indexName: string,
    query: SearchQuery,
    callback?: NodeCallback<SearchResult>
  ): StreamableRowPromise<SearchResult, SearchRow, SearchMetaData>;

  /**
   * Executes a search query against the cluster.
   *
   * @param indexName The name of the index to query.
   * @param query The SearchQuery describing the query to execute.
   * @param options Optional parameters for this operation.
   * @param callback A node-style callback to be invoked after execution.
   */
  searchQuery(
    indexName: string,
    query: SearchQuery,
    options: SearchQueryOptions,
    callback?: NodeCallback<SearchResult>
  ): StreamableRowPromise<SearchResult, SearchRow, SearchMetaData>;

  searchQuery(
    indexName: string,
    query: SearchQuery,
    options?: SearchQueryOptions | NodeCallback<SearchResult>,
    callback?: NodeCallback<SearchResult>
  ): StreamableRowPromise<SearchResult, SearchRow, SearchMetaData> {
    if (options instanceof Function) {
      callback = options;
      options = undefined;
    }
    if (!options) {
      options = {};
    }

    const exec = new SearchExecutor(this);

    const options_ = options;
    return PromiseHelper.wrapAsync(
      () => exec.query(indexName, query, options_),
      callback
    );
  }

  /**
   * Executes a search query against the cluster.
   *
   * @param indexName The name of the index to query.
   * @param request The SearchRequest describing the search to execute.
   * @param options Optional parameters for this operation.
   * @param callback A node-style callback to be invoked after execution.
   */
  search(
    indexName: string,
    request: SearchRequest,
    options: SearchQueryOptions,
    callback?: NodeCallback<SearchResult>
  ): StreamableRowPromise<SearchResult, SearchRow, SearchMetaData>;

  /**
   * Executes a search query against the cluster.
   *
   * @param indexName The name of the index to query.
   * @param request The SearchRequest describing the search to execute.
   * @param callback A node-style callback to be invoked after execution.
   */
  search(
    indexName: string,
    request: SearchRequest,
    callback?: NodeCallback<SearchResult>
  ): StreamableRowPromise<SearchResult, SearchRow, SearchMetaData>;

  search(
    indexName: string,
    request: SearchRequest,
    ...args:
      | [SearchQueryOptions, NodeCallback<SearchResult>?]
      | [NodeCallback<SearchResult>?]
  ): StreamableRowPromise<SearchResult, SearchRow, SearchMetaData> {
    const [options = {}, callback] = resolveOptionsAndCallback(args);

    const exec = new SearchExecutor(this);

    const options_ = options;
    return PromiseHelper.wrapAsync(
      () => exec.query(indexName, request, options_),
      callback
    );
  }

  /**
   * Returns a diagnostics report about the currently active connections with the
   * cluster.  Includes information about remote and local addresses, last activity,
   * and other diagnostics information.
   *
   * @param callback A node-style callback to be invoked after execution.
   */
  diagnostics(callback?: NodeCallback<DiagnosticsResult>): Promise<DiagnosticsResult>;

  /**
   * Returns a diagnostics report about the currently active connections with the
   * cluster.  Includes information about remote and local addresses, last activity,
   * and other diagnostics information.
   *
   * @param options Optional parameters for this operation.
   * @param callback A node-style callback to be invoked after execution.
   */
  diagnostics(
    options: DiagnosticsOptions,
    callback?: NodeCallback<DiagnosticsResult>
  ): Promise<DiagnosticsResult>;

  diagnostics(
    options?: DiagnosticsOptions | NodeCallback<DiagnosticsResult>,
    callback?: NodeCallback<DiagnosticsResult>
  ): Promise<DiagnosticsResult> {
    if (options instanceof Function) {
      callback = options;
      options = undefined;
    }
    if (!options) {
      options = {};
    }

    const exec = new DiagnoticsExecutor(this);

    const options_ = options;
    return PromiseHelper.wrapAsync(() => exec.diagnostics(options_), callback);
  }

  /**
   * Performs a ping operation against the cluster.  Pinging the services which
   * are specified (or all services if none are specified).  Returns a report
   * which describes the outcome of the ping operations which were performed.
   *
   * @param callback A node-style callback to be invoked after execution.
   */
  async ping(callback?: NodeCallback<PingResult>): Promise<PingResult>;

  /**
   * Performs a ping operation against the cluster.  Pinging the services which
   * are specified (or all services if none are specified).  Returns a report
   * which describes the outcome of the ping operations which were performed.
   *
   * @param options Optional parameters for this operation.
   * @param callback A node-style callback to be invoked after execution.
   */
  async ping(
    options: PingOptions,
    callback?: NodeCallback<PingResult>
  ): Promise<PingResult>;

  async ping(
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

    const exec = new PingExecutor(this);

    const options_ = options;
    return await PromiseHelper.wrapAsync(() => exec.ping(options_), callback);
  }

  /**
   * Shuts down this cluster object.  Cleaning up all resources associated with it.
   *
   * @param callback A node-style callback to be invoked after execution.
   */
  async close(callback?: VoidNodeCallback): Promise<void> {
    if (this._transactions) {
      await this._transactions._close();
      this._transactions = undefined;
    }

    return await PromiseHelper.wrap((wrapCallback) => {
      this.conn.shutdown((cppErr) => {
        wrapCallback(errorFromCpp(cppErr));
      });
    }, callback);
  }

  /**
   * Do a best effort to await for pending, internal, operations to settle before closing the cluster.
   *
   * Experimental.
   */
  async closeGracefully(callback?: VoidNodeCallback) {
    try {
      await Promise.allSettled(this._openBuckets.values());
      await this.close(callback);
    } catch (err) {
      console.error(err);
    }
  }

  async waitForBuckets() {
    await Promise.allSettled(this._openBuckets.values());
  }

  /**
   * @throws AuthenticationFailureError
   * @private
   */
  private async _connect() {
    return new Promise((resolve, reject) => {
      const dsnObj = ConnSpec.parse(this._connStr);

      dsnObj.options.user_agent_extra = generateClientString();

      //trust_store_path is legacy, C++ SDK expects trust_certificate
      if (
        'trust_store_path' in dsnObj.options &&
        !('trust_certificate' in dsnObj.options)
      ) {
        dsnObj.options.trust_certificate = dsnObj.options.trust_store_path;
        delete dsnObj.options.trust_store_path;
      }
      //if trust store was passed in via `SecurityConfig` override connstr
      if (this._trustStorePath) {
        dsnObj.options.trust_certificate = this._trustStorePath;
      }

      if (this.bootstrapTimeout) {
        dsnObj.options.bootstrap_timeout = this.bootstrapTimeout.toString();
      }
      if (this.connectTimeout) {
        dsnObj.options.kv_connect_timeout = this.connectTimeout.toString();
      }
      if (this.resolveTimeout) {
        dsnObj.options.resolve_timeout = this.resolveTimeout.toString();
      }

      const connStr = dsnObj.toString();

      const authOpts: CppClusterCredentials = {};

      // lets allow `allowed_sasl_mechanisms` to override legacy connstr option
      for (const saslKey of ['sasl_mech_force', 'allowed_sasl_mechanisms']) {
        if (!(saslKey in dsnObj.options)) {
          continue;
        }
        if (typeof dsnObj.options[saslKey] === 'string') {
          authOpts.allowed_sasl_mechanisms = [dsnObj.options[saslKey] as string];
        } else {
          authOpts.allowed_sasl_mechanisms = dsnObj.options[saslKey] as string[];
        }
        delete dsnObj.options[saslKey];
      }

      if (this._auth) {
        const passAuth = this._auth as PasswordAuthenticator;
        if (passAuth.username || passAuth.password) {
          authOpts.username = passAuth.username;
          authOpts.password = passAuth.password;

          if (passAuth.allowed_sasl_mechanisms) {
            authOpts.allowed_sasl_mechanisms = passAuth.allowed_sasl_mechanisms;
          }
        }

        const certAuth = this._auth as CertificateAuthenticator;
        if (certAuth.certificatePath || certAuth.keyPath) {
          authOpts.certificate_path = certAuth.certificatePath;
          authOpts.key_path = certAuth.keyPath;
        }
      }

      this.conn.connect(connStr, authOpts, this._dnsConfig, (cppErr) => {
        if (cppErr) {
          const err = errorFromCpp(cppErr);
          return reject(err);
        }
        resolve(null);
      });
    });
  }
}
