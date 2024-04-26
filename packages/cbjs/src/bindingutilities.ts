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
import { DurabilityLevelName, invariant } from '@cbjsdev/shared';

import { AnalyticsScanConsistency, AnalyticsStatus } from './analyticstypes';
import binding, {
  CppAnalyticsResponseAnalyticsStatus,
  CppAnalyticsScanConsistency,
  CppDesignDocumentNamespace,
  CppDiagEndpointState,
  CppDiagPingState,
  CppDurabilityLevel,
  CppError,
  CppManagementClusterBucketCompression,
  CppManagementClusterBucketConflictResolution,
  CppManagementClusterBucketEvictionPolicy,
  CppManagementClusterBucketStorageBackend,
  CppManagementClusterBucketType,
  CppManagementEventingFunctionBucketAccess,
  CppManagementEventingFunctionDcpBoundary,
  CppManagementEventingFunctionDeploymentStatus,
  CppManagementEventingFunctionLanguageCompatibility,
  CppManagementEventingFunctionLogLevel,
  CppManagementEventingFunctionProcessingStatus,
  CppManagementEventingFunctionStatus,
  CppMutationState,
  CppPersistTo,
  CppPrefixScan,
  CppQueryProfile,
  CppQueryScanConsistency,
  CppRangeScan,
  CppReplicateTo,
  CppSamplingScan,
  CppSearchHighlightStyle,
  CppSearchScanConsistency,
  CppServiceType,
  CppStoreSemantics,
  CppTransactionKeyspace,
  CppTxnExternalException,
  CppTxnOpException,
  CppVectorQueryCombination,
  CppViewScanConsistency,
  CppViewSortOrder,
} from './binding';
import {
  BucketType,
  CompressionMode,
  ConflictResolutionType,
  EvictionPolicy,
  StorageBackend,
} from './bucketmanager';
import { EndpointState, PingState } from './diagnosticstypes';
import {
  AnalyticsErrorContext,
  HttpErrorContext,
  KeyValueErrorContext,
  QueryErrorContext,
  SearchErrorContext,
  ServiceErrorContext,
  ViewErrorContext,
} from './errorcontexts';
import {
  AmbiguousTimeoutError,
  AuthenticationFailureError,
  BucketExistsError,
  BucketNotFlushableError,
  BucketNotFoundError,
  CasMismatchError,
  CollectionExistsError,
  CollectionNotFoundError,
  CompilationFailureError,
  CouchbaseError,
  DatasetExistsError,
  DatasetNotFoundError,
  DataverseExistsError,
  DataverseNotFoundError,
  DecodingFailureError,
  DeltaInvalidError,
  DesignDocumentNotFoundError,
  DmlFailureError,
  DocumentExistsError,
  DocumentLockedError,
  DocumentNotFoundError,
  DocumentNotJsonError,
  DocumentNotLockedError,
  DocumentUnretrievableError,
  DurabilityAmbiguousError,
  DurabilityImpossibleError,
  DurabilityLevelNotAvailableError,
  DurableWriteInProgressError,
  DurableWriteReCommitInProgressError,
  EventingFunctionCompilationFailureError,
  EventingFunctionDeployedError,
  EventingFunctionIdenticalKeyspaceError,
  EventingFunctionNotBootstrappedError,
  EventingFunctionNotDeployedError,
  EventingFunctionNotFoundError,
  EventingFunctionPausedError,
  FeatureNotAvailableError,
  GroupNotFoundError,
  IndexExistsError,
  IndexFailureError,
  IndexNotFoundError,
  IndexNotReadyError,
  InternalServerFailureError,
  InvalidArgumentError,
  InvalidDurabilityLevel,
  InvalidDurabilityPersistToLevel,
  InvalidDurabilityReplicateToLevel,
  isCppCodedError,
  isCppServiceError,
  isCppTxnError,
  JobQueueFullError,
  LinkExistsError,
  LinkNotFoundError,
  NumberTooBigError,
  ParsingFailureError,
  PathExistsError,
  PathInvalidError,
  PathMismatchError,
  PathNotFoundError,
  PathTooBigError,
  PathTooDeepError,
  PlanningFailureError,
  PreparedStatementFailureError,
  QuotaLimitedError,
  RateLimitedError,
  RequestCanceledError,
  ScopeExistsError,
  ScopeNotFoundError,
  ServiceNotAvailableError,
  TemporaryFailureError,
  TransactionExpiredError,
  TransactionOperationFailedError,
  UnambiguousTimeoutError,
  UnsupportedOperationError,
  UserExistsError,
  UserNotFoundError,
  ValueInvalidError,
  ValueTooDeepError,
  ValueTooLargeError,
  ViewNotFoundError,
} from './errors';
import {
  EventingFunctionBucketAccess,
  EventingFunctionDcpBoundary,
  EventingFunctionDeploymentStatus,
  EventingFunctionLanguageCompatibility,
  EventingFunctionLogLevel,
  EventingFunctionProcessingStatus,
  EventingFunctionStatus,
} from './eventingfunctionmanager';
import { DurabilityLevel, ServiceType, StoreSemantics } from './generaltypes';
import { MutationState } from './mutationstate';
import { QueryProfileMode, QueryScanConsistency } from './querytypes';
import { PrefixScan, RangeScan, SamplingScan } from './rangeScan';
import { HighlightStyle, SearchScanConsistency } from './searchtypes';
import { TransactionKeyspace } from './transactions';
import { nsServerStrToDuraLevel } from './utilities';
import { VectorQueryCombination } from './vectorsearch';
import { DesignDocumentNamespace, ViewOrdering, ViewScanConsistency } from './viewtypes';

/**
 * @internal
 */
export function durabilityToCpp(
  mode: DurabilityLevel | DurabilityLevelName | undefined
): CppDurabilityLevel {
  // Unspecified is allowed, and means no sync durability.
  if (mode === null || mode === undefined) {
    return binding.durability_level.none;
  }

  if (typeof mode === 'string') {
    mode = nsServerStrToDuraLevel(mode);
  }

  if (mode === DurabilityLevel.None) {
    return binding.durability_level.none;
  } else if (mode === DurabilityLevel.Majority) {
    return binding.durability_level.majority;
  } else if (mode === DurabilityLevel.MajorityAndPersistOnMaster) {
    return binding.durability_level.majority_and_persist_to_active;
  } else if (mode === DurabilityLevel.PersistToMajority) {
    return binding.durability_level.persist_to_majority;
  }

  throw new InvalidDurabilityLevel();
}

/**
 * @internal
 */
export function durabilityFromCpp(
  mode: CppDurabilityLevel | undefined
): DurabilityLevel | undefined {
  if (mode === null || mode === undefined) {
    return undefined;
  }

  if (mode === binding.durability_level.none) {
    return DurabilityLevel.None;
  } else if (mode === binding.durability_level.majority) {
    return DurabilityLevel.Majority;
  } else if (mode === binding.durability_level.majority_and_persist_to_active) {
    return DurabilityLevel.MajorityAndPersistOnMaster;
  } else if (mode === binding.durability_level.persist_to_majority) {
    return DurabilityLevel.PersistToMajority;
  }

  throw new InvalidDurabilityLevel();
}

/**
 * @internal
 */
export function queryScanConsistencyFromCpp(
  mode: CppQueryScanConsistency | undefined
): QueryScanConsistency | undefined {
  if (!mode) return undefined;

  if (mode === binding.query_scan_consistency.not_bounded) {
    return QueryScanConsistency.NotBounded;
  } else if (mode === binding.query_scan_consistency.request_plus) {
    return QueryScanConsistency.RequestPlus;
  }

  throw new InvalidArgumentError('Failed to parse query scan_consistency from cpp');
}

/**
 * @internal
 */
export function persistToToCpp(persistTo: number | undefined): CppPersistTo {
  // Unspecified is allowed, and means no persistTo.
  if (persistTo === null || persistTo === undefined) {
    return binding.persist_to.none;
  }

  if (persistTo === 0) {
    return binding.persist_to.none;
  } else if (persistTo === 1) {
    return binding.persist_to.active;
  } else if (persistTo === 2) {
    return binding.persist_to.one;
  } else if (persistTo === 3) {
    return binding.persist_to.two;
  } else if (persistTo === 4) {
    return binding.persist_to.three;
  } else if (persistTo === 5) {
    return binding.persist_to.four;
  }

  throw new InvalidDurabilityPersistToLevel();
}

/**
 * @internal
 */
export function replicateToToCpp(replicateTo: number | undefined): CppReplicateTo {
  // Unspecified is allowed, and means no persistTo.
  if (replicateTo === null || replicateTo === undefined) {
    return binding.replicate_to.none;
  }

  if (replicateTo === 0) {
    return binding.replicate_to.none;
  } else if (replicateTo === 1) {
    return binding.replicate_to.one;
  } else if (replicateTo === 2) {
    return binding.replicate_to.two;
  } else if (replicateTo === 3) {
    return binding.replicate_to.three;
  }

  throw new InvalidDurabilityReplicateToLevel();
}

/**
 * @internal
 */
export function storeSemanticToCpp(mode: StoreSemantics | undefined): CppStoreSemantics {
  if (mode === null || mode === undefined) {
    return binding.store_semantics.replace;
  }

  if (mode === StoreSemantics.Insert) {
    return binding.store_semantics.insert;
  } else if (mode === StoreSemantics.Upsert) {
    return binding.store_semantics.upsert;
  } else if (mode === StoreSemantics.Replace) {
    return binding.store_semantics.replace;
  }

  throw new InvalidArgumentError();
}

/**
 * @internal
 */
export function viewScanConsistencyToCpp(
  mode: ViewScanConsistency | undefined
): CppViewScanConsistency | undefined {
  // Unspecified is allowed, and means no sync durability.
  if (mode === null || mode === undefined) {
    return undefined;
  }

  if (mode === ViewScanConsistency.NotBounded) {
    return binding.view_scan_consistency.not_bounded;
  } else if (mode === ViewScanConsistency.UpdateAfter) {
    return binding.view_scan_consistency.update_after;
  } else if (mode === ViewScanConsistency.RequestPlus) {
    return binding.view_scan_consistency.request_plus;
  }

  throw new InvalidArgumentError();
}

/**
 * @internal
 */
export function viewOrderingToCpp(
  ordering: ViewOrdering | undefined
): CppViewSortOrder | undefined {
  // Unspecified is allowed, and means default ordering.
  if (ordering === null || ordering === undefined) {
    return undefined;
  }

  if (ordering === ViewOrdering.Ascending) {
    return binding.view_sort_order.ascending;
  } else if (ordering === ViewOrdering.Descending) {
    return binding.view_sort_order.descending;
  }

  throw new InvalidArgumentError('Unrecognized view ordering.');
}

/**
 * @internal
 */
export function queryScanConsistencyToCpp(
  mode: QueryScanConsistency | undefined
): CppQueryScanConsistency | undefined {
  // Unspecified is allowed, and means no sync durability.
  if (mode === null || mode === undefined) {
    return undefined;
  }

  if (mode === QueryScanConsistency.NotBounded) {
    return binding.query_scan_consistency.not_bounded;
  } else if (mode === QueryScanConsistency.RequestPlus) {
    return binding.query_scan_consistency.request_plus;
  }

  throw new InvalidArgumentError();
}

/**
 * @internal
 */
export function queryProfileToCpp(mode: QueryProfileMode | undefined): CppQueryProfile {
  // Unspecified is allowed, and means no sync durability.
  if (mode === null || mode === undefined) {
    return binding.query_profile.off;
  }

  if (mode === QueryProfileMode.Off) {
    return binding.query_profile.off;
  } else if (mode === QueryProfileMode.Phases) {
    return binding.query_profile.phases;
  } else if (mode === QueryProfileMode.Timings) {
    return binding.query_profile.timings;
  }

  throw new InvalidArgumentError();
}

/**
 * @internal
 */
export function analyticsScanConsistencyToCpp(
  mode: AnalyticsScanConsistency | undefined
): CppAnalyticsScanConsistency {
  // Unspecified is allowed, and means no sync durability.
  if (mode === null || mode === undefined) {
    return binding.analytics_scan_consistency.not_bounded;
  }

  if (mode === AnalyticsScanConsistency.NotBounded) {
    return binding.analytics_scan_consistency.not_bounded;
  } else if (mode === AnalyticsScanConsistency.RequestPlus) {
    return binding.analytics_scan_consistency.request_plus;
  }

  throw new InvalidArgumentError();
}

/**
 * @internal
 */
export function analyticsStatusFromCpp(
  status: CppAnalyticsResponseAnalyticsStatus
): AnalyticsStatus {
  if (status === binding.analytics_response_analytics_status.running) {
    return AnalyticsStatus.Running;
  } else if (status === binding.analytics_response_analytics_status.success) {
    return AnalyticsStatus.Success;
  } else if (status === binding.analytics_response_analytics_status.errors) {
    return AnalyticsStatus.Errors;
  } else if (status === binding.analytics_response_analytics_status.completed) {
    return AnalyticsStatus.Completed;
  } else if (status === binding.analytics_response_analytics_status.stopped) {
    return AnalyticsStatus.Stopped;
  } else if (status === binding.analytics_response_analytics_status.timedout) {
    return AnalyticsStatus.Timeout;
  } else if (status === binding.analytics_response_analytics_status.closed) {
    return AnalyticsStatus.Closed;
  } else if (status === binding.analytics_response_analytics_status.fatal) {
    return AnalyticsStatus.Fatal;
  } else if (status === binding.analytics_response_analytics_status.aborted) {
    return AnalyticsStatus.Aborted;
  } else if (status === binding.analytics_response_analytics_status.unknown) {
    return AnalyticsStatus.Unknown;
  }

  throw new InvalidArgumentError();
}

/**
 * @internal
 */
export function searchScanConsistencyToCpp(
  mode: SearchScanConsistency | undefined
): CppSearchScanConsistency {
  // Unspecified is allowed, and means no sync durability.
  if (mode === null || mode === undefined) {
    return binding.search_scan_consistency.not_bounded;
  }

  if (mode === SearchScanConsistency.NotBounded) {
    return binding.search_scan_consistency.not_bounded;
  }

  throw new InvalidArgumentError();
}

/**
 * @internal
 */
export function searchHighlightStyleToCpp(
  mode: HighlightStyle | undefined
): CppSearchHighlightStyle | undefined {
  // Unspecified is allowed, and means no sync durability.
  if (mode === null || mode === undefined) {
    return undefined;
  }

  if (mode === HighlightStyle.ANSI) return binding.search_highlight_style.ansi;
  if (mode === HighlightStyle.HTML) return binding.search_highlight_style.html;

  throw new InvalidArgumentError();
}

/**
 * @internal
 */
export function mutationStateToCpp(state: MutationState | undefined): CppMutationState {
  if (state === null || state === undefined) {
    return { tokens: [] };
  }

  return { tokens: state.getTokens() };
}

/**
 * @internal
 */
export function serviceTypeToCpp(service: ServiceType): CppServiceType {
  const map = new Map<ServiceType, CppServiceType>([
    [ServiceType.KeyValue, binding.service_type.key_value],
    [ServiceType.Query, binding.service_type.query],
    [ServiceType.Analytics, binding.service_type.analytics],
    [ServiceType.Search, binding.service_type.search],
    [ServiceType.Views, binding.service_type.view],
    [ServiceType.Management, binding.service_type.management],
    [ServiceType.Eventing, binding.service_type.eventing],
  ]);

  if (map.has(service)) {
    return map.get(service) as CppServiceType;
  }

  throw new InvalidArgumentError();
}

/**
 * @internal
 */
export function serviceTypeFromCpp(service: CppServiceType): ServiceType {
  const map = new Map<CppServiceType, ServiceType>([
    [binding.service_type.key_value, ServiceType.KeyValue],
    [binding.service_type.query, ServiceType.Query],
    [binding.service_type.analytics, ServiceType.Analytics],
    [binding.service_type.search, ServiceType.Search],
    [binding.service_type.view, ServiceType.Views],
    [binding.service_type.management, ServiceType.Management],
    [binding.service_type.eventing, ServiceType.Eventing],
  ]);

  if (map.has(service)) {
    return map.get(service) as ServiceType;
  }

  throw new InvalidArgumentError();
}

/**
 * @internal
 */
export function endpointStateFromCpp(service: CppDiagEndpointState): EndpointState {
  if (service === binding.diag_endpoint_state.disconnected) {
    return EndpointState.Disconnected;
  } else if (service === binding.diag_endpoint_state.connecting) {
    return EndpointState.Connecting;
  } else if (service === binding.diag_endpoint_state.connected) {
    return EndpointState.Connected;
  } else if (service === binding.diag_endpoint_state.disconnecting) {
    return EndpointState.Disconnecting;
  }

  throw new InvalidArgumentError();
}

/**
 * @internal
 */
export function txnExternalExceptionStringFromCpp(
  cause: CppTxnExternalException
): string {
  const knownCauses = Object.entries(binding.txn_external_exception);
  const matchingCause = knownCauses.find(([key, value]) => value === cause);

  if (matchingCause) return matchingCause[0];

  throw new InvalidArgumentError();
}

/**
 * @internal
 */
export function txnOpExceptionFromCpp(
  err: CppTxnOpException,
  context?: ServiceErrorContext
): Error | null {
  if (!err) {
    return null;
  }

  invariant(err instanceof Error);

  switch (err.cause) {
    case binding.txn_external_exception.document_exists_exception:
      return new DocumentExistsError(err, context);

    case binding.txn_external_exception.document_not_found_exception:
      return new DocumentNotFoundError(err, context);

    case binding.txn_external_exception.parsing_failure:
      return new ParsingFailureError(err, context);

    case binding.txn_external_exception.couchbase_exception:
      return new CouchbaseError(
        txnExternalExceptionStringFromCpp(err.cause),
        err,
        context
      );

    default:
      return new CouchbaseError('Unknown Couchbase error', err, context);
  }
}

/**
 * @internal
 */
export function pingStateFromCpp(service: CppDiagPingState): PingState {
  switch (service) {
    case binding.diag_ping_state.ok:
      return PingState.Ok;
    case binding.diag_ping_state.timeout:
      return PingState.Timeout;
    case binding.diag_ping_state.error:
      return PingState.Error;
  }

  throw new InvalidArgumentError();
}

/**
 * @internal
 */
export function contextFromCpp(err: unknown): ServiceErrorContext | undefined {
  if (!err) {
    return;
  }

  if (!isCppServiceError(err)) {
    return;
  }

  switch (err.ctxtype) {
    case 'key_value':
      return new KeyValueErrorContext({
        status_code: err.status_code,
        opaque: err.opaque,
        cas: err.cas,
        key: err.id ? err.id.key : '',
        bucket: err.id ? err.id.bucket : '',
        collection: err.id ? err.id.collection : '',
        scope: err.id ? err.id.scope : '',
        context: err.enhanced_error_info ? err.enhanced_error_info.context : '',
        ref: err.enhanced_error_info ? err.enhanced_error_info.reference : '',
      });

    case 'view':
      return new ViewErrorContext({
        design_document: err.design_document_name,
        view: err.view_name,
        parameters: err.query_string,
        http_response_code: err.http_status,
        http_response_body: err.http_body,
      });

    case 'query':
      return new QueryErrorContext({
        statement: err.statement,
        client_context_id: err.client_context_id,
        parameters: err.parameters,
        http_response_code: err.http_status,
        http_response_body: err.http_body,
      });

    case 'search':
      return new SearchErrorContext({
        index_name: err.index_name,
        query: err.query,
        parameters: err.parameters,
        http_response_code: err.http_status,
        http_response_body: err.http_body,
      });

    case 'analytics':
      return new AnalyticsErrorContext({
        statement: err.statement,
        client_context_id: err.client_context_id,
        parameters: err.parameters,
        http_response_code: err.http_status,
        http_response_body: err.http_body,
      });

    case 'http':
      return new HttpErrorContext({
        method: err.method,
        request_path: err.path,
        response_code: err.http_status,
        response_body: err.http_body,
      });
  }
}

/**
 * @internal
 */
export function errorFromCpp(cppError: undefined): null;
export function errorFromCpp(cppError: null): null;
export function errorFromCpp(cppError: CppError): Error;
export function errorFromCpp(cppError: unknown): Error | null;
export function errorFromCpp(cppError: unknown): Error | null {
  if (!cppError) {
    return null;
  }

  if (isCppTxnError(cppError)) {
    const args = [
      txnExternalExceptionStringFromCpp(cppError.cause),
      new Error(txnExternalExceptionStringFromCpp(cppError.cause)),
    ] as const;

    switch (cppError.ctxtype) {
      case 'transaction_operation_failed':
        return new TransactionOperationFailedError(...args);
      case 'transaction_op_exception':
        return txnOpExceptionFromCpp(
          cppError,
          cppError.ctx?.cause ? contextFromCpp(cppError.ctx?.cause) : undefined
        );
      case 'transaction_exception': {
        switch (cppError.type) {
          case binding.txn_failure_type.fail:
            return new TransactionExpiredError(...args);
          case binding.txn_failure_type.expiry:
            return new TransactionExpiredError(...args);
          case binding.txn_failure_type.commit_ambiguous:
            return new TransactionExpiredError(...args);
          default:
            throw new InvalidArgumentError();
        }
      }
    }
  }

  invariant(cppError instanceof Error, 'cppError is not an instance of node:Error');

  if (!isCppCodedError(cppError)) {
    return cppError;
  }

  const context = contextFromCpp(cppError);

  switch (cppError.code) {
    case binding.errc_common.request_canceled:
      return new RequestCanceledError(cppError, context);
    case binding.errc_common.invalid_argument:
      return new InvalidArgumentError(undefined, cppError, context);
    case binding.errc_common.service_not_available:
      return new ServiceNotAvailableError(cppError, context);
    case binding.errc_common.internal_server_failure:
      return new InternalServerFailureError(cppError, context);
    case binding.errc_common.authentication_failure:
      return new AuthenticationFailureError(cppError, context);
    case binding.errc_common.temporary_failure:
      return new TemporaryFailureError(cppError, context);
    case binding.errc_common.parsing_failure:
      return new ParsingFailureError(cppError, context);
    case binding.errc_common.cas_mismatch:
      return new CasMismatchError(cppError, context);
    case binding.errc_common.bucket_not_found:
      return new BucketNotFoundError(cppError, context);
    case binding.errc_common.collection_not_found:
      return new CollectionNotFoundError(cppError, context);
    case binding.errc_common.unsupported_operation:
      return new UnsupportedOperationError(cppError, context);
    case binding.errc_common.unambiguous_timeout:
      return new UnambiguousTimeoutError(cppError, context);
    case binding.errc_common.ambiguous_timeout:
      return new AmbiguousTimeoutError(cppError, context);
    case binding.errc_key_value.document_not_locked:
      return new DocumentNotLockedError(cppError, context);
    case binding.errc_common.feature_not_available:
      return new FeatureNotAvailableError(cppError, context);
    case binding.errc_common.scope_not_found:
      return new ScopeNotFoundError(cppError, context);
    case binding.errc_common.index_not_found:
      return new IndexNotFoundError(undefined, cppError, context);
    case binding.errc_common.index_exists:
      return new IndexExistsError(cppError, context);
    case binding.errc_common.decoding_failure:
      return new DecodingFailureError(cppError, context);
    case binding.errc_common.rate_limited:
      return new RateLimitedError(cppError, context);
    case binding.errc_common.quota_limited:
      return new QuotaLimitedError(cppError, context);

    case binding.errc_key_value.document_not_found:
      Error.prepareStackTrace;
      return new DocumentNotFoundError(cppError, context);
    case binding.errc_key_value.document_irretrievable:
      return new DocumentUnretrievableError(cppError, context);
    case binding.errc_key_value.document_locked:
      return new DocumentLockedError(cppError, context);
    case binding.errc_key_value.value_too_large:
      return new ValueTooLargeError(cppError, context);
    case binding.errc_key_value.document_exists:
      return new DocumentExistsError(cppError, context);
    case binding.errc_key_value.durability_level_not_available:
      return new DurabilityLevelNotAvailableError(cppError, context);
    case binding.errc_key_value.durability_impossible:
      return new DurabilityImpossibleError(cppError, context);
    case binding.errc_key_value.durability_ambiguous:
      return new DurabilityAmbiguousError(cppError, context);
    case binding.errc_key_value.durable_write_in_progress:
      return new DurableWriteInProgressError(cppError, context);
    case binding.errc_key_value.durable_write_re_commit_in_progress:
      return new DurableWriteReCommitInProgressError(cppError, context);
    case binding.errc_key_value.path_not_found:
      return new PathNotFoundError(cppError, context);
    case binding.errc_key_value.path_mismatch:
      return new PathMismatchError(cppError, context);
    case binding.errc_key_value.path_invalid:
      return new PathInvalidError(cppError, context);
    case binding.errc_key_value.path_too_big:
      return new PathTooBigError(cppError, context);
    case binding.errc_key_value.path_too_deep:
      return new PathTooDeepError(cppError, context);
    case binding.errc_key_value.value_too_deep:
      return new ValueTooDeepError(cppError, context);
    case binding.errc_key_value.value_invalid:
      return new ValueInvalidError(cppError, context);
    case binding.errc_key_value.document_not_json:
      return new DocumentNotJsonError(cppError, context);
    case binding.errc_key_value.number_too_big:
      return new NumberTooBigError(cppError, context);
    case binding.errc_key_value.delta_invalid:
      return new DeltaInvalidError(cppError, context);
    case binding.errc_key_value.path_exists:
      return new PathExistsError(cppError, context);
    case binding.errc_key_value.xattr_unknown_macro:
    case binding.errc_key_value.xattr_invalid_key_combo:
    case binding.errc_key_value.xattr_unknown_virtual_attribute:
    case binding.errc_key_value.xattr_cannot_modify_virtual_attribute:
    case binding.errc_key_value.xattr_no_access:
    case binding.errc_key_value.cannot_revive_living_document:
      // These error types are converted into generic ones instead.
      break;

    case binding.errc_query.planning_failure:
      return new PlanningFailureError(cppError, context);
    case binding.errc_query.index_failure:
      return new IndexFailureError(cppError, context);
    case binding.errc_query.prepared_statement_failure:
      return new PreparedStatementFailureError(cppError, context);
    case binding.errc_query.dml_failure:
      return new DmlFailureError(cppError, context);

    case binding.errc_analytics.compilation_failure:
      return new CompilationFailureError(cppError, context);
    case binding.errc_analytics.job_queue_full:
      return new JobQueueFullError(cppError, context);
    case binding.errc_analytics.dataset_not_found:
      return new DatasetNotFoundError(cppError, context);
    case binding.errc_analytics.dataverse_not_found:
      return new DataverseNotFoundError(cppError, context);
    case binding.errc_analytics.dataset_exists:
      return new DatasetExistsError(cppError, context);
    case binding.errc_analytics.dataverse_exists:
      return new DataverseExistsError(cppError, context);
    case binding.errc_analytics.link_not_found:
      return new LinkNotFoundError(cppError, context);
    case binding.errc_analytics.link_exists:
      return new LinkExistsError(cppError, context);

    case binding.errc_search.index_not_ready:
      return new IndexNotReadyError(cppError, context);
    case binding.errc_search.consistency_mismatch:
      // These error types are converted into generic ones instead.
      break;

    case binding.errc_view.view_not_found:
      return new ViewNotFoundError(cppError, context);
    case binding.errc_view.design_document_not_found:
      return new DesignDocumentNotFoundError(cppError, context);

    case binding.errc_management.collection_exists:
      return new CollectionExistsError(cppError, context);
    case binding.errc_management.scope_exists:
      return new ScopeExistsError(cppError, context);
    case binding.errc_management.user_not_found:
      return new UserNotFoundError(cppError, context);
    case binding.errc_management.group_not_found:
      return new GroupNotFoundError(cppError, context);
    case binding.errc_management.bucket_exists:
      return new BucketExistsError(cppError, context);
    case binding.errc_management.user_exists:
      return new UserExistsError(cppError, context);
    case binding.errc_management.bucket_not_flushable:
      return new BucketNotFlushableError(cppError, context);
    case binding.errc_management.eventing_function_not_found:
      return new EventingFunctionNotFoundError(cppError, context);
    case binding.errc_management.eventing_function_not_deployed:
      return new EventingFunctionNotDeployedError(cppError, context);
    case binding.errc_management.eventing_function_compilation_failure:
      return new EventingFunctionCompilationFailureError(cppError, context);
    case binding.errc_management.eventing_function_identical_keyspace:
      return new EventingFunctionIdenticalKeyspaceError(cppError, context);
    case binding.errc_management.eventing_function_not_bootstrapped:
      return new EventingFunctionNotBootstrappedError(cppError, context);
    case binding.errc_management.eventing_function_deployed:
      return new EventingFunctionDeployedError(cppError, context);
    case binding.errc_management.eventing_function_paused:
      return new EventingFunctionPausedError(cppError, context);
  }

  return new CouchbaseError(`Unknown Couchbase error: ${cppError.message}`, cppError);
}

/**
 * @internal
 */
export function scanTypeToCpp(
  scanType: RangeScan | SamplingScan | PrefixScan
): CppRangeScan | CppSamplingScan | CppPrefixScan {
  if (scanType instanceof RangeScan) {
    return {
      from:
        scanType.start !== undefined
          ? {
              term: scanType.start.term,
              exclusive: scanType.start?.exclusive ?? false,
            }
          : undefined,
      to:
        scanType.end !== undefined
          ? {
              term: scanType.end.term,
              exclusive: scanType.end?.exclusive ?? false,
            }
          : undefined,
    };
  } else if (scanType instanceof SamplingScan) {
    return {
      limit: scanType.limit,
      seed: scanType.seed,
    };
  } else {
    return {
      prefix: scanType.prefix,
    };
  }
}

/**
 * @internal
 */
export function bucketTypeToCpp(
  type: BucketType | string | undefined
): CppManagementClusterBucketType {
  const { couchbase, memcached, ephemeral } = binding.management_cluster_bucket_type;

  if (type === null || type === undefined) {
    return couchbase;
  }

  const cppMap = new Map<string, CppManagementClusterBucketType>([
    [BucketType.Couchbase, couchbase],
    [BucketType.Ephemeral, ephemeral],
    [BucketType.Memcached, memcached],
  ]);

  if (cppMap.has(type)) {
    return cppMap.get(type)!;
  }

  throw new InvalidArgumentError();
}

/**
 * @internal
 */
export function bucketTypeFromCpp(
  type: CppManagementClusterBucketType
): BucketType | undefined {
  if (type === binding.management_cluster_bucket_type.couchbase) {
    return BucketType.Couchbase;
  } else if (type === binding.management_cluster_bucket_type.ephemeral) {
    return BucketType.Ephemeral;
  } else if (type === binding.management_cluster_bucket_type.memcached) {
    return BucketType.Memcached;
  } else if (type === binding.management_cluster_bucket_type.unknown) {
    return undefined;
  }

  throw new InvalidArgumentError();
}

/**
 * @internal
 */
export function bucketCompressionModeToCpp(
  mode: CompressionMode | string | undefined
): CppManagementClusterBucketCompression {
  const { unknown, off, passive, active } = binding.management_cluster_bucket_compression;

  if (mode === null || mode === undefined) {
    return unknown;
  }

  const cppMap = new Map<string, CppManagementClusterBucketCompression>([
    [CompressionMode.Off, off],
    [CompressionMode.Active, active],
    [CompressionMode.Passive, passive],
  ]);

  if (cppMap.has(mode)) {
    return cppMap.get(mode)!;
  }

  throw new InvalidArgumentError();
}

/**
 * @internal
 */
export function bucketCompressionModeFromCpp(
  mode: CppManagementClusterBucketCompression
): CompressionMode | undefined {
  if (mode === binding.management_cluster_bucket_compression.active) {
    return CompressionMode.Active;
  } else if (mode === binding.management_cluster_bucket_compression.passive) {
    return CompressionMode.Passive;
  } else if (mode === binding.management_cluster_bucket_compression.off) {
    return CompressionMode.Off;
  } else if (mode === binding.management_cluster_bucket_compression.unknown) {
    return undefined;
  }

  throw new InvalidArgumentError();
}

/**
 * @internal
 */
export function bucketEvictionPolicyToCpp(
  policy: EvictionPolicy | string | undefined
): CppManagementClusterBucketEvictionPolicy {
  const { unknown, full, no_eviction, not_recently_used, value_only } =
    binding.management_cluster_bucket_eviction_policy;

  if (policy === null || policy === undefined) {
    return unknown;
  }

  const cppMap = new Map<string, CppManagementClusterBucketEvictionPolicy>([
    [EvictionPolicy.FullEviction, full],
    [EvictionPolicy.ValueOnly, value_only],
    [EvictionPolicy.NotRecentlyUsed, not_recently_used],
    [EvictionPolicy.NoEviction, no_eviction],
  ]);

  if (cppMap.has(policy)) {
    return cppMap.get(policy)!;
  }

  throw new InvalidArgumentError();
}

/**
 * @internal
 */
export function bucketEvictionPolicyFromCpp(
  cppPolicy: CppManagementClusterBucketEvictionPolicy
): EvictionPolicy | undefined {
  const { full, value_only, no_eviction, not_recently_used, unknown } =
    binding.management_cluster_bucket_eviction_policy;

  const cppMap = new Map<
    CppManagementClusterBucketEvictionPolicy,
    EvictionPolicy | undefined
  >([
    [unknown, undefined],
    [full, EvictionPolicy.FullEviction],
    [no_eviction, EvictionPolicy.NoEviction],
    [not_recently_used, EvictionPolicy.NotRecentlyUsed],
    [value_only, EvictionPolicy.ValueOnly],
  ]);

  if (cppMap.has(cppPolicy)) {
    return cppMap.get(cppPolicy)!;
  }

  throw new InvalidArgumentError();
}

/**
 * @internal
 */
export function bucketStorageBackendToCpp(
  backend: StorageBackend | string | undefined
): CppManagementClusterBucketStorageBackend {
  const { unknown, couchstore, magma } =
    binding.management_cluster_bucket_storage_backend;

  if (backend === null || backend === undefined) {
    return unknown;
  }

  const cppMap = new Map<string, CppManagementClusterBucketStorageBackend>([
    [StorageBackend.Couchstore, couchstore],
    [StorageBackend.Magma, magma],
  ]);

  if (cppMap.has(backend)) {
    return cppMap.get(backend)!;
  }

  throw new InvalidArgumentError();
}

/**
 * @internal
 */
export function bucketStorageBackendFromCpp(
  backend: CppManagementClusterBucketStorageBackend
): StorageBackend | undefined {
  if (backend === binding.management_cluster_bucket_storage_backend.couchstore) {
    return StorageBackend.Couchstore;
  } else if (backend === binding.management_cluster_bucket_storage_backend.magma) {
    return StorageBackend.Magma;
  } else if (backend === binding.management_cluster_bucket_storage_backend.unknown) {
    return undefined;
  }

  throw new InvalidArgumentError();
}

/**
 * @internal
 */
export function bucketConflictResolutionTypeToCpp(
  type: ConflictResolutionType | string | undefined
): CppManagementClusterBucketConflictResolution {
  const { unknown, custom, sequence_number, timestamp } =
    binding.management_cluster_bucket_conflict_resolution;

  if (type === null || type === undefined) {
    return unknown;
  }

  const cppMap = new Map<string, CppManagementClusterBucketConflictResolution>([
    [ConflictResolutionType.SequenceNumber, sequence_number],
    [ConflictResolutionType.Timestamp, timestamp],
    [ConflictResolutionType.Custom, custom],
  ]);

  if (cppMap.has(type)) {
    return cppMap.get(type)!;
  }

  throw new InvalidArgumentError();
}

/**
 * @internal
 */
export function bucketConflictResolutionTypeFromCpp(
  type: CppManagementClusterBucketConflictResolution
): ConflictResolutionType | undefined {
  if (type === binding.management_cluster_bucket_conflict_resolution.sequence_number) {
    return ConflictResolutionType.SequenceNumber;
  } else if (type === binding.management_cluster_bucket_conflict_resolution.timestamp) {
    return ConflictResolutionType.Timestamp;
  } else if (type === binding.management_cluster_bucket_conflict_resolution.custom) {
    return ConflictResolutionType.Custom;
  } else if (type === binding.management_cluster_bucket_conflict_resolution.unknown) {
    return undefined;
  }

  throw new InvalidArgumentError();
}

/**
 * @internal
 */
export function vectorQueryCombinationToCpp(
  combination: VectorQueryCombination | undefined
): CppVectorQueryCombination {
  if (combination === VectorQueryCombination.AND) {
    return binding.vector_query_combination.combination_and;
  } else if (combination === VectorQueryCombination.OR) {
    return binding.vector_query_combination.combination_or;
  }

  throw new InvalidArgumentError('Unrecognized VectorQueryCombination.');
}

/**
 * @internal
 */
export function designDocumentNamespaceFromCpp(
  namespace: CppDesignDocumentNamespace
): DesignDocumentNamespace {
  if (namespace === binding.design_document_namespace.production) {
    return DesignDocumentNamespace.Production;
  } else if (namespace === binding.design_document_namespace.development) {
    return DesignDocumentNamespace.Development;
  }

  throw new InvalidArgumentError('Unrecognized DesignDocumentNamespace.');
}

/**
 * @internal
 */
export function designDocumentNamespaceToCpp(
  namespace: DesignDocumentNamespace
): CppDesignDocumentNamespace {
  if (namespace === DesignDocumentNamespace.Production) {
    return binding.design_document_namespace.production;
  } else if (namespace === DesignDocumentNamespace.Development) {
    return binding.design_document_namespace.development;
  }

  throw new InvalidArgumentError('Unrecognized DesignDocumentNamespace.');
}

/**
 * @internal
 */
export function transactionKeyspaceToCpp(
  keyspace?: TransactionKeyspace
): CppTransactionKeyspace | undefined {
  if (!keyspace) return undefined;

  return {
    bucket_name: keyspace.bucket,
    scope_name: keyspace.scope ?? '_default',
    collection_name: keyspace.collection ?? '_default',
  };
}

/**
 * @internal
 */
export function eventingBucketBindingAccessToCpp(
  access: EventingFunctionBucketAccess
): CppManagementEventingFunctionBucketAccess {
  if (access === EventingFunctionBucketAccess.ReadOnly) {
    return binding.management_eventing_function_bucket_access.read_only;
  }

  if (access === EventingFunctionBucketAccess.ReadWrite) {
    return binding.management_eventing_function_bucket_access.read_write;
  }

  throw new InvalidArgumentError('Unrecognized EventingFunctionBucketAccess');
}

/**
 * @internal
 */
export function eventingBucketBindingAccessFromCpp(
  access: CppManagementEventingFunctionBucketAccess
): EventingFunctionBucketAccess {
  if (access === binding.management_eventing_function_bucket_access.read_only) {
    return EventingFunctionBucketAccess.ReadOnly;
  }
  if (access === binding.management_eventing_function_bucket_access.read_write) {
    return EventingFunctionBucketAccess.ReadWrite;
  }

  throw new InvalidArgumentError('Unrecognized EventingFunctionBucketAccess');
}

/**
 * @internal
 */
export function eventingFunctionDcpBoundaryToCpp(
  boundary: EventingFunctionDcpBoundary | undefined
): CppManagementEventingFunctionDcpBoundary | undefined {
  if (!boundary) return undefined;

  if (boundary === EventingFunctionDcpBoundary.Everything) {
    return binding.management_eventing_function_dcp_boundary.everything;
  }

  if (boundary === EventingFunctionDcpBoundary.FromNow) {
    return binding.management_eventing_function_dcp_boundary.from_now;
  }

  throw new InvalidArgumentError('Unrecognized EventingFunctionDcpBoundary');
}

/**
 * @internal
 */
export function eventingFunctionDcpBoundaryFromCpp(
  boundary: CppManagementEventingFunctionDcpBoundary | undefined
): EventingFunctionDcpBoundary | undefined {
  if (!boundary) return undefined;

  if (boundary === binding.management_eventing_function_dcp_boundary.everything) {
    return EventingFunctionDcpBoundary.Everything;
  }

  if (boundary === binding.management_eventing_function_dcp_boundary.from_now) {
    return EventingFunctionDcpBoundary.FromNow;
  }

  throw new InvalidArgumentError('Unrecognized EventingFunctionDcpBoundary');
}

/**
 * @internal
 */
export function eventingFunctionDeploymentStatusToCpp(
  status: EventingFunctionDeploymentStatus | undefined
): CppManagementEventingFunctionDeploymentStatus | undefined {
  if (!status) return undefined;

  if (status === EventingFunctionDeploymentStatus.Deployed) {
    return binding.management_eventing_function_deployment_status.deployed;
  }

  if (status === EventingFunctionDeploymentStatus.Undeployed) {
    return binding.management_eventing_function_deployment_status.undeployed;
  }

  throw new InvalidArgumentError('Unrecognized EventingFunctionDeploymentStatus');
}

/**
 * @internal
 */
export function eventingFunctionDeploymentStatusFromCpp(
  status: CppManagementEventingFunctionDeploymentStatus | undefined
): EventingFunctionDeploymentStatus | undefined {
  if (!status) return undefined;

  if (status === binding.management_eventing_function_deployment_status.deployed) {
    return EventingFunctionDeploymentStatus.Deployed;
  }

  if (status === binding.management_eventing_function_deployment_status.undeployed) {
    return EventingFunctionDeploymentStatus.Undeployed;
  }

  throw new InvalidArgumentError('Unrecognized EventingFunctionDeploymentStatus');
}

/**
 * @internal
 */
export function eventingFunctionProcessingStatusToCpp(
  status: EventingFunctionProcessingStatus | undefined
): CppManagementEventingFunctionProcessingStatus | undefined {
  if (!status) return undefined;

  if (status === EventingFunctionProcessingStatus.Running) {
    return binding.management_eventing_function_processing_status.running;
  }

  if (status === EventingFunctionProcessingStatus.Paused) {
    return binding.management_eventing_function_processing_status.paused;
  }

  throw new InvalidArgumentError('Unrecognized EventingFunctionProcessingStatus');
}

/**
 * @internal
 */
export function eventingFunctionProcessingStatusFromCpp(
  status: CppManagementEventingFunctionProcessingStatus | undefined
): EventingFunctionProcessingStatus | undefined {
  if (!status) return undefined;

  if (status === binding.management_eventing_function_processing_status.running) {
    return EventingFunctionProcessingStatus.Running;
  }

  if (status === binding.management_eventing_function_processing_status.paused) {
    return EventingFunctionProcessingStatus.Paused;
  }

  throw new InvalidArgumentError('Unrecognized EventingFunctionProcessingStatus');
}

/**
 * @internal
 */
export function eventingFunctionLogLevelToCpp(
  level: EventingFunctionLogLevel | undefined
): CppManagementEventingFunctionLogLevel | undefined {
  if (!level) return undefined;

  if (level === EventingFunctionLogLevel.Debug) {
    return binding.management_eventing_function_log_level.debug;
  }

  if (level === EventingFunctionLogLevel.Error) {
    return binding.management_eventing_function_log_level.error;
  }

  if (level === EventingFunctionLogLevel.Info) {
    return binding.management_eventing_function_log_level.info;
  }

  if (level === EventingFunctionLogLevel.Trace) {
    return binding.management_eventing_function_log_level.trace;
  }

  if (level === EventingFunctionLogLevel.Warning) {
    return binding.management_eventing_function_log_level.warning;
  }

  throw new InvalidArgumentError('Unrecognized EventingFunctionLogLevel');
}

/**
 * @internal
 */
export function eventingFunctionLogLevelFromCpp(
  level: CppManagementEventingFunctionLogLevel | undefined
): EventingFunctionLogLevel | undefined {
  if (!level) return undefined;

  if (level === binding.management_eventing_function_log_level.debug) {
    return EventingFunctionLogLevel.Debug;
  }

  if (level === binding.management_eventing_function_log_level.error) {
    return EventingFunctionLogLevel.Error;
  }

  if (level === binding.management_eventing_function_log_level.info) {
    return EventingFunctionLogLevel.Info;
  }

  if (level === binding.management_eventing_function_log_level.trace) {
    return EventingFunctionLogLevel.Trace;
  }

  if (level === binding.management_eventing_function_log_level.warning) {
    return EventingFunctionLogLevel.Warning;
  }

  throw new InvalidArgumentError('Unrecognized EventingFunctionLogLevel');
}

/**
 * @internal
 */
export function eventingFunctionLanguageCompatibilityToCpp(
  compatibility: EventingFunctionLanguageCompatibility | undefined
): CppManagementEventingFunctionLanguageCompatibility | undefined {
  if (!compatibility) return undefined;

  if (compatibility === EventingFunctionLanguageCompatibility.Version_6_0_0) {
    return binding.management_eventing_function_language_compatibility.version_6_0_0;
  }

  if (compatibility === EventingFunctionLanguageCompatibility.Version_6_5_0) {
    return binding.management_eventing_function_language_compatibility.version_6_5_0;
  }

  if (compatibility === EventingFunctionLanguageCompatibility.Version_6_6_2) {
    return binding.management_eventing_function_language_compatibility.version_6_6_2;
  }

  if (compatibility === EventingFunctionLanguageCompatibility.Version_7_2_0) {
    return binding.management_eventing_function_language_compatibility.version_7_2_0;
  }

  throw new InvalidArgumentError('Unrecognized EventingFunctionLanguageCompatibility');
}

/**
 * @internal
 */
export function eventingFunctionLanguageCompatibilityFromCpp(
  compatibility: CppManagementEventingFunctionLanguageCompatibility | undefined
): EventingFunctionLanguageCompatibility | undefined {
  if (!compatibility) return undefined;

  if (
    compatibility ===
    binding.management_eventing_function_language_compatibility.version_6_0_0
  ) {
    return EventingFunctionLanguageCompatibility.Version_6_0_0;
  }

  if (
    compatibility ===
    binding.management_eventing_function_language_compatibility.version_6_5_0
  ) {
    return EventingFunctionLanguageCompatibility.Version_6_5_0;
  }

  if (
    compatibility ===
    binding.management_eventing_function_language_compatibility.version_6_6_2
  ) {
    return EventingFunctionLanguageCompatibility.Version_6_6_2;
  }

  if (
    compatibility ===
    binding.management_eventing_function_language_compatibility.version_7_2_0
  ) {
    return EventingFunctionLanguageCompatibility.Version_7_2_0;
  }

  throw new InvalidArgumentError('Unrecognized EventingFunctionLanguageCompatibility');
}

/**
 * @internal
 */
export function eventingFunctionStatusFromCpp(
  status: CppManagementEventingFunctionStatus
): EventingFunctionStatus {
  if (status === binding.management_eventing_function_status.undeployed) {
    return EventingFunctionStatus.Undeployed;
  }
  if (status === binding.management_eventing_function_status.deploying) {
    return EventingFunctionStatus.Deploying;
  }
  if (status === binding.management_eventing_function_status.deployed) {
    return EventingFunctionStatus.Deployed;
  }
  if (status === binding.management_eventing_function_status.undeploying) {
    return EventingFunctionStatus.Undeploying;
  }
  if (status === binding.management_eventing_function_status.paused) {
    return EventingFunctionStatus.Paused;
  }
  if (status === binding.management_eventing_function_status.pausing) {
    return EventingFunctionStatus.Pausing;
  }

  throw new InvalidArgumentError('Unrecognized EventingFunctionStatus');
}
