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
import { hasOwn } from '@cbjsdev/shared';

import { CppCodedError, CppServiceError, CppTxnAnyError } from './binding.js';
import {
  AnalyticsErrorContext,
  HttpErrorContext,
  KeyValueErrorContext,
  QueryErrorContext,
  SearchErrorContext,
  ServiceErrorContext,
  ViewErrorContext,
} from './errorcontexts.js';

function appendReason(reason?: string) {
  if (reason) return `: ${reason}`;
  return '';
}

export function isCppCodedError(v: unknown): v is CppCodedError {
  return hasOwn(v, 'code');
}

export function isCppServiceError(v: unknown): v is CppServiceError {
  return hasOwn(v, 'code') && hasOwn(v, 'ctxtype');
}

export function isCppTxnError(v: unknown): v is CppTxnAnyError {
  return hasOwn(v, 'ctxtype') && hasOwn(v, 'cause');
}

/**
 * A generic base error that all errors inherit.  Exposes the cause and
 * context of the error to enable easier debugging.
 *
 * @category Error Handling
 */
export class CouchbaseError extends Error {
  /**
   * Specifies the underlying cause of this error, if one is available.
   */
  override cause?: unknown;

  /**
   * Specifies additional contextual information which is available for this
   * error.  Depending on the service that generated it.
   */
  context:
    | KeyValueErrorContext
    | ViewErrorContext
    | QueryErrorContext
    | SearchErrorContext
    | AnalyticsErrorContext
    | HttpErrorContext
    | undefined;

  constructor(message: string, cause?: unknown, context?: unknown) {
    super(message);
    this.name = this.constructor.name;
    this.cause = cause;
    this.context = context as
      | KeyValueErrorContext
      | ViewErrorContext
      | QueryErrorContext
      | SearchErrorContext
      | AnalyticsErrorContext
      | HttpErrorContext;
  }
}

/**
 * Indicates that an operation was performed after a connection was closed.
 *
 * @category Error Handling
 */
export class ConnectionClosedError extends CouchbaseError {
  constructor() {
    super('The connection has been closed.');
  }
}

/**
 * Indicates that an operation was performed after the cluster object was explicitly
 * closed by the user.
 *
 * @category Error Handling
 */
export class ClusterClosedError extends CouchbaseError {
  constructor() {
    super('The parent cluster object has been closed.');
  }
}

/**
 * Indicates that an cluster-level operation could not be performed as no buckets
 * were open.  This occurs with pre-6.0 clusters which were not able to fetch cluster
 * topology without knowing the name of a bucket.
 *
 * @category Error Handling
 */
export class NeedOpenBucketError extends CouchbaseError {
  constructor() {
    super('You must have one open bucket before you can perform queries.');
  }
}

/**
 * Indicates that the specific durability level was invalid.
 *
 * @category Error Handling
 */
export class InvalidDurabilityLevel extends CouchbaseError {
  constructor() {
    super('An invalid durability level was specified.');
  }
}

/**
 * Indicates that the specific durabilityPersistTo level was invalid.
 *
 * @category Error Handling
 */
export class InvalidDurabilityPersistToLevel extends CouchbaseError {
  constructor() {
    super('An invalid durability PersistTo level was specified.');
  }
}

/**
 * Indicates that the specific durabilityReplicateTo level was invalid.
 *
 * @category Error Handling
 */
export class InvalidDurabilityReplicateToLevel extends CouchbaseError {
  constructor() {
    super('An invalid durability ReplicateTo level was specified.');
  }
}

/**
 * Indicates that the operation timed out.
 *
 * @category Error Handling
 */
export class TimeoutError extends CouchbaseError {
  declare cause: Error;
  constructor(cause?: Error, context?: ServiceErrorContext) {
    super('timeout', cause, context);
  }
}

/**
 * Indicates that the request was explicitly cancelled.
 *
 * @category Error Handling
 */
export class RequestCanceledError extends CouchbaseError {
  declare cause: Error;
  constructor(cause?: Error, context?: ServiceErrorContext) {
    super('request canceled', cause, context);
  }
}

/**
 * Indicates that one of the passed arguments was invalid.
 *
 * @category Error Handling
 */
export class InvalidArgumentError extends CouchbaseError {
  constructor(reason?: string, cause?: CppCodedError, context?: ServiceErrorContext) {
    super(`invalid argument${appendReason(reason)}`, cause, context);
  }
}

/**
 * Indicates that the operation requires a service which was not available.
 * For instance, attempting to perform a query without the query service
 * being enabled.
 *
 * @category Error Handling
 */
export class ServiceNotAvailableError extends CouchbaseError {
  declare cause: Error;
  constructor(cause?: Error, context?: ServiceErrorContext) {
    super('service not available', cause, context);
  }
}

/**
 * Indicates some form of internal error occured on the server and the
 * request could not be completed.
 *
 * @category Error Handling
 */
export class InternalServerFailureError extends CouchbaseError {
  declare cause: Error;
  constructor(cause?: Error, context?: ServiceErrorContext) {
    super('internal server failure', cause, context);
  }
}

/**
 * Indicates that an error occurred authenticating the user to the cluster.
 *
 * @category Error Handling
 */
export class AuthenticationFailureError extends CouchbaseError {
  declare cause: Error;
  declare context: never;
  constructor(cause?: Error, context?: ServiceErrorContext) {
    super('authentication failure', cause, context);
  }
}

/**
 * Indicates that a temporary failure occured, attempting the same operation
 * in the future may succeed.
 *
 * @category Error Handling
 */
export class TemporaryFailureError extends CouchbaseError {
  declare cause: Error;
  constructor(cause?: Error, context?: ServiceErrorContext) {
    super('temporary failure', cause, context);
  }
}

/**
 * Indicates that a parsing failure occurred.
 *
 * @category Error Handling
 */
export class ParsingFailureError extends CouchbaseError {
  declare cause: Error;
  constructor(cause?: Error, context?: ServiceErrorContext) {
    super('parsing failure', cause, context);
  }
}

/**
 * Indicates that a CAS mismatch occurred.  This means that the document
 * has changed since the last access and should be fetched again before
 * attempting to make further changes.
 *
 * @category Error Handling
 */
export class CasMismatchError extends CouchbaseError {
  declare cause: Error;
  declare context: KeyValueErrorContext;
  constructor(cause?: Error, context?: ServiceErrorContext) {
    super('cas mismatch', cause, context);
  }
}

/**
 * Indicates that the bucket being referenced does not exist.
 *
 * @category Error Handling
 */
export class BucketNotFoundError extends CouchbaseError {
  declare cause: Error;
  declare context: HttpErrorContext;
  constructor(cause?: Error, context?: ServiceErrorContext) {
    super('bucket not found', cause, context);
  }
}

/**
 * Indicates that the collection being referenced does not exist.
 *
 * @category Error Handling
 */
export class CollectionNotFoundError extends CouchbaseError {
  declare cause: Error;
  declare context: HttpErrorContext;
  constructor(cause?: Error, context?: ServiceErrorContext) {
    super('collection not found', cause, context);
  }
}

/**
 * Indicates that there was a failure during encoding.
 *
 * @category Error Handling
 */
export class EncodingFailureError extends CouchbaseError {
  declare cause: Error;
  constructor(cause?: Error, context?: ServiceErrorContext) {
    super('encoding failure', cause, context);
  }
}

/**
 * Indicates that there was a failure during decoding.
 *
 * @category Error Handling
 */
export class DecodingFailureError extends CouchbaseError {
  declare cause: Error;
  constructor(cause?: Error, context?: ServiceErrorContext) {
    super('decoding failure', cause, context);
  }
}

/**
 * Indicates that an operation which is not supported was executed.
 *
 * @category Error Handling
 */
export class UnsupportedOperationError extends CouchbaseError {
  declare cause: Error;
  constructor(cause?: Error, context?: ServiceErrorContext) {
    super('unsupported operation', cause, context);
  }
}

/**
 * Indicates that an ambiguous timeout has occured.  The outcome of the
 * operation is unknown, and it is possible that it completed after the
 * generation of this error.
 *
 * @category Error Handling
 */
export class AmbiguousTimeoutError extends TimeoutError {
  declare cause: Error;
  constructor(cause?: Error, context?: ServiceErrorContext) {
    super(cause, context);
    this.message = 'ambiguous timeout';
  }
}

/**
 * Indicates an unambiguous timeout has occurred.  The outcome of the
 * operation is objective failure and it is known to have not completed.
 *
 * @category Error Handling
 */
export class UnambiguousTimeoutError extends TimeoutError {
  declare cause: Error;
  constructor(cause?: Error, context?: ServiceErrorContext) {
    super(cause, context);
    this.message = 'unambiguous timeout';
  }
}

/**
 * Indicates a feature which is not available was used.  This primarily can
 * occur if you attempt to perform a query when no query services are enabled
 * on the cluster, or if a newer server feature which is not available in the
 * connected server version is used.
 *
 * @category Error Handling
 */
export class FeatureNotAvailableError extends CouchbaseError {
  declare cause: Error;
  constructor(reason?: string, cause?: Error, context?: ServiceErrorContext) {
    super(`feature not available${appendReason(reason)}`, cause, context);
  }
}

/**
 * Indicates that the referenced scope does not exist.
 *
 * @category Error Handling
 */
export class ScopeNotFoundError extends CouchbaseError {
  declare cause: Error;
  declare context: HttpErrorContext;
  constructor(cause?: Error, context?: ServiceErrorContext) {
    super('scope not found', cause, context);
  }
}

/**
 * Indicates that the referenced index does not exist.
 *
 * @category Error Handling
 */
export class IndexNotFoundError extends CouchbaseError {
  constructor(reason?: string, cause?: CppCodedError, context?: ServiceErrorContext) {
    super(`index not found${appendReason(reason)}`, cause, context);
  }
}

/**
 * Indicates that a rate limit was exceeded while attempting to
 * execute the operation.
 *
 * @category Error Handling
 */
export class RateLimitedError extends CouchbaseError {
  declare cause: Error;
  constructor(cause?: Error, context?: ServiceErrorContext) {
    super('operation was rate limited', cause, context);
  }
}

/**
 * Indicates that a quota limit was exceeded while attempting to
 * execute the operation.
 *
 * @category Error Handling
 */
export class QuotaLimitedError extends CouchbaseError {
  declare cause: Error;
  constructor(cause?: Error, context?: ServiceErrorContext) {
    super('operation was quota limited', cause, context);
  }
}

/**
 * Indicates that the referenced index already existed, but was expected
 * to not yet exist for the operation.
 *
 * @category Error Handling
 */
export class IndexExistsError extends CouchbaseError {
  declare cause: Error;
  declare context: HttpErrorContext;
  constructor(cause?: Error, context?: ServiceErrorContext) {
    super('index exists', cause, context);
  }
}

/**
 * Indicates that the referenced document does not exist.
 *
 * @category Error Handling
 */
export class DocumentNotFoundError extends CouchbaseError {
  declare cause: Error;
  declare context: KeyValueErrorContext;
  constructor(cause?: Error, context?: ServiceErrorContext) {
    super('document not found', cause, context);
  }
}

/**
 * Indicates that the referenced document could not be retrieved.
 *
 * @category Error Handling
 */
export class DocumentUnretrievableError extends CouchbaseError {
  declare cause: Error;
  declare context: KeyValueErrorContext;
  constructor(cause?: Error, context?: ServiceErrorContext) {
    super('document unretrievable', cause, context);
  }
}

/**
 * Indicates that the referenced document could not be used as it is currently
 * locked, likely by another actor in the system.
 *
 * @category Error Handling
 */
export class DocumentLockedError extends CouchbaseError {
  declare cause: Error;
  declare context: KeyValueErrorContext;

  constructor(cause?: Error, context?: ServiceErrorContext) {
    super('document locked', cause, context);
  }
}

/**
 * Indicates that the referenced document is not locked.  Generally raised when an unlock
 * operation is performed.
 *
 * @category Error Handling
 */
export class DocumentNotLockedError extends CouchbaseError {
  declare cause: Error;
  declare context: KeyValueErrorContext;

  constructor(cause?: Error, context?: ServiceErrorContext) {
    super('document not locked', cause, context);
  }
}

/**
 * Indicates that a value could not be stored as it was too large.
 *
 * @category Error Handling
 */
export class ValueTooLargeError extends CouchbaseError {
  declare cause: Error;
  constructor(cause?: Error, context?: ServiceErrorContext) {
    super('value too large', cause, context);
  }
}

/**
 * Indicates that the referenced document exists already, but the operation
 * was not expecting it to exist.
 *
 * @category Error Handling
 */
export class DocumentExistsError extends CouchbaseError {
  declare cause: Error;
  declare context: KeyValueErrorContext;
  constructor(cause?: Error, context?: ServiceErrorContext) {
    super('document exists', cause, context);
  }
}

/**
 * Indicates that a JSON operation was attempted with non-JSON data.
 *
 * @category Error Handling
 */
export class ValueNotJsonError extends CouchbaseError {
  declare cause: Error;
  constructor(cause?: Error, context?: ServiceErrorContext) {
    super('value not json', cause, context);
  }
}

/**
 * Indicates that a durability level which is not available was specified.
 *
 * @category Error Handling
 */
export class DurabilityLevelNotAvailableError extends CouchbaseError {
  declare cause: Error;
  constructor(cause?: Error, context?: ServiceErrorContext) {
    super('durability level not available', cause, context);
  }
}

/**
 * Indicates that a durability level which is impossible to achieve was
 * specified.  This can occur when you try to use Majority but there is
 * less than the majority of nodes available.
 *
 * @category Error Handling
 */
export class DurabilityImpossibleError extends CouchbaseError {
  declare cause: Error;
  constructor(cause?: Error, context?: ServiceErrorContext) {
    super('durability impossible', cause, context);
  }
}

/**
 * Indicates that the durable operation that was performed has failed
 * ambiguously and may or may not have completed, or may complete in
 * the future.
 *
 * @category Error Handling
 */
export class DurabilityAmbiguousError extends CouchbaseError {
  declare cause: Error;
  constructor(cause?: Error, context?: ServiceErrorContext) {
    super('durability ambiguous', cause, context);
  }
}

/**
 * Indicates that a write was failed as an existing durable write against
 * that key is already in progress.
 *
 * @category Error Handling
 */
export class DurableWriteInProgressError extends CouchbaseError {
  declare cause: Error;
  constructor(cause?: Error, context?: ServiceErrorContext) {
    super('durable write in progress', cause, context);
  }
}

/**
 * Indicates that a write was failed as the server is currently reconstructing
 * it's durable data following a failover.
 *
 * @category Error Handling
 */
export class DurableWriteReCommitInProgressError extends CouchbaseError {
  declare cause: Error;
  constructor(cause?: Error, context?: ServiceErrorContext) {
    super('durable write recommit in progress', cause, context);
  }
}

/**
 * Indicates that a mutation was lost.
 *
 * @category Error Handling
 */
export class MutationLostError extends CouchbaseError {
  declare cause: Error;
  constructor(cause?: Error, context?: ServiceErrorContext) {
    super('mutation lost', cause, context);
  }
}

/**
 * Indicates that the reference path was not found.
 *
 * @category Error Handling
 */
export class PathNotFoundError extends CouchbaseError {
  declare cause: Error;
  constructor(cause?: Error, context?: ServiceErrorContext) {
    super('path not found', cause, context);
  }
}

/**
 * Indicates that the referenced path made incorrect assumptions about
 * the structure of a document, for instance attempting to access a field
 * as an object when in fact it is an array.
 *
 * @category Error Handling
 */
export class PathMismatchError extends CouchbaseError {
  declare cause: Error;
  constructor(cause?: Error, context?: ServiceErrorContext) {
    super('path mismatch', cause, context);
  }
}

/**
 * Indicates that the referenced path is not valid.
 *
 * @category Error Handling
 */
export class PathInvalidError extends CouchbaseError {
  declare cause: Error;
  constructor(cause?: Error, context?: ServiceErrorContext) {
    super('path invalid', cause, context);
  }
}

/**
 * Indicates that the specified path was too large to parse.
 *
 * @category Error Handling
 */
export class PathTooBigError extends CouchbaseError {
  declare cause: Error;
  constructor(cause?: Error, context?: ServiceErrorContext) {
    super('path too big', cause, context);
  }
}

/**
 * Indicates that the referenced path was too deep to parse.
 *
 * @category Error Handling
 */
export class PathTooDeepError extends CouchbaseError {
  declare cause: Error;
  constructor(cause?: Error, context?: ServiceErrorContext) {
    super('path too deep', cause, context);
  }
}

/**
 * Indicates that the document created by the operation would become
 * too deep to operate on.
 *
 * @category Error Handling
 */
export class ValueTooDeepError extends CouchbaseError {
  declare cause: Error;
  constructor(cause?: Error, context?: ServiceErrorContext) {
    super('value too deep', cause, context);
  }
}

/**
 * Indicates that the value passed is invalid.
 *
 * @category Error Handling
 */
export class ValueInvalidError extends CouchbaseError {
  declare cause: Error;
  constructor(cause?: Error, context?: ServiceErrorContext) {
    super('value invalid', cause, context);
  }
}

/**
 * Indicates that an operation expecting JSON was performed against a document
 * which is not JSON.
 *
 * @category Error Handling
 */
export class DocumentNotJsonError extends CouchbaseError {
  declare cause: Error;
  constructor(cause?: Error, context?: ServiceErrorContext) {
    super('document not json', cause, context);
  }
}

/**
 * Indicates that a number has grown too large.
 *
 * @category Error Handling
 */
export class NumberTooBigError extends CouchbaseError {
  declare cause: Error;
  constructor(cause?: Error, context?: ServiceErrorContext) {
    super('number too big', cause, context);
  }
}

/**
 * Indicates that the delta specified is invalid.
 *
 * @category Error Handling
 */
export class DeltaInvalidError extends CouchbaseError {
  declare cause: Error;
  constructor(cause?: Error, context?: ServiceErrorContext) {
    super('delta invalid', cause, context);
  }
}

/**
 * Indicates that the reference path already existed, but the operation
 * expected that it did not.
 *
 * @category Error Handling
 */
export class PathExistsError extends CouchbaseError {
  declare cause: Error;
  constructor(cause?: Error, context?: ServiceErrorContext) {
    super('path exists', cause, context);
  }
}

/**
 * Indicates that a failure occurred while planning a query.
 *
 * @category Error Handling
 */
export class PlanningFailureError extends CouchbaseError {
  declare cause: Error;
  constructor(cause?: Error, context?: ServiceErrorContext) {
    super('planning failure', cause, context);
  }
}

/**
 * Indicates that a failure occured while querying an index.
 *
 * @category Error Handling
 */
export class IndexFailureError extends CouchbaseError {
  declare cause: Error;
  constructor(cause?: Error, context?: ServiceErrorContext) {
    super('index failure', cause, context);
  }
}

/**
 * Indicates that an error occurred with a prepared statement.
 *
 * @category Error Handling
 */
export class PreparedStatementFailureError extends CouchbaseError {
  declare cause: Error;
  constructor(cause?: Error, context?: ServiceErrorContext) {
    super('prepared statement failure', cause, context);
  }
}

/**
 * Indicates that a generic DML error occurred with a query.
 *
 * @category Error Handling
 */
export class DmlFailureError extends CouchbaseError {
  declare cause: Error;
  constructor(cause?: Error, context?: ServiceErrorContext) {
    super('generic dml failure', cause, context);
  }
}

/**
 * Indicates that the index was not ready yet.
 *
 * @category Error Handling
 */
export class IndexNotReadyError extends CouchbaseError {
  declare cause: Error;
  constructor(cause?: Error, context?: ServiceErrorContext) {
    super('index not ready', cause, context);
  }
}

/**
 * Indicates that an error occurred while compiling a query.
 *
 * @category Error Handling
 */
export class CompilationFailureError extends CouchbaseError {
  declare cause: Error;
  constructor(cause?: Error, context?: ServiceErrorContext) {
    super('compilation failure', cause, context);
  }
}

/**
 * Indicates that the job queue for the service was full and further requests will
 * be rejected for a period of time until the queue shrinks.
 *
 * @category Error Handling
 */
export class JobQueueFullError extends CouchbaseError {
  declare cause: Error;
  constructor(cause?: Error, context?: ServiceErrorContext) {
    super('job queue full', cause, context);
  }
}

/**
 * Indicates that the referenced dataset does not exist.
 *
 * @category Error Handling
 */
export class DatasetNotFoundError extends CouchbaseError {
  declare cause: Error;
  constructor(cause?: Error, context?: ServiceErrorContext) {
    super('dataset not found', cause, context);
  }
}

/**
 * Indicates that the referenced dataverse does not exist.
 *
 * @category Error Handling
 */
export class DataverseNotFoundError extends CouchbaseError {
  declare cause: Error;
  constructor(cause?: Error, context?: ServiceErrorContext) {
    super('dataverse not found', cause, context);
  }
}

/**
 * Indicates that the referenced dataset already exists, but the operation
 * expected that it did not.
 *
 * @category Error Handling
 */
export class DatasetExistsError extends CouchbaseError {
  declare cause: Error;
  constructor(cause?: Error, context?: ServiceErrorContext) {
    super('dataset exists', cause, context);
  }
}

/**
 * Indicates that the referenced dataverse already exists, but the operation
 * expected that it did not.
 *
 * @category Error Handling
 */
export class DataverseExistsError extends CouchbaseError {
  declare cause: Error;
  constructor(cause?: Error, context?: ServiceErrorContext) {
    super('dataverse exists', cause, context);
  }
}

/**
 * Indicates that the referenced link does not exist.
 *
 * @category Error Handling
 */
export class LinkNotFoundError extends CouchbaseError {
  declare cause: Error;
  constructor(cause?: Error, context?: ServiceErrorContext) {
    super('link not found', cause, context);
  }
}

/**
 * Indicates that the link already exists.
 *
 * @category Error Handling
 */
export class LinkExistsError extends CouchbaseError {
  declare cause: Error;
  constructor(cause?: Error, context?: ServiceErrorContext) {
    super('link already exists', cause, context);
  }
}

/**
 * Indicates that the referenced view does not exist.
 *
 * @category Error Handling
 */
export class ViewNotFoundError extends CouchbaseError {
  declare cause: Error;
  constructor(cause?: Error, context?: ServiceErrorContext) {
    super('view not found', cause, context);
  }
}

/**
 * Indicates that the referenced design document does not exist.
 *
 * @category Error Handling
 */
export class DesignDocumentNotFoundError extends CouchbaseError {
  declare cause: Error;
  constructor(cause?: Error, context?: ServiceErrorContext) {
    super('design document not found', cause, context);
  }
}

/**
 * Indicates that the referenced collection already exists, but the operation
 * expected that it did not.
 *
 * @category Error Handling
 */
export class CollectionExistsError extends CouchbaseError {
  declare cause: Error;
  declare context: HttpErrorContext;
  constructor(cause?: Error, context?: ServiceErrorContext) {
    super('collection exists', cause, context);
  }
}

/**
 * Indicates that the referenced scope already exists, but the operation
 * expected that it did not.
 *
 * @category Error Handling
 */
export class ScopeExistsError extends CouchbaseError {
  declare cause: Error;
  declare context: HttpErrorContext;
  constructor(cause?: Error, context?: ServiceErrorContext) {
    super('scope exists', cause, context);
  }
}

/**
 * Indicates that the referenced user does not exist.
 *
 * @category Error Handling
 */
export class UserNotFoundError extends CouchbaseError {
  declare cause: Error;
  declare context: HttpErrorContext;
  constructor(cause?: Error, context?: ServiceErrorContext) {
    super('user not found', cause, context);
  }
}

/**
 * Indicates that the referenced group does not exist.
 *
 * @category Error Handling
 */
export class GroupNotFoundError extends CouchbaseError {
  declare cause: Error;
  declare context: HttpErrorContext;
  constructor(cause?: Error, context?: ServiceErrorContext) {
    super('group not found', cause, context);
  }
}

/**
 * Indicates that the referenced bucket already exists, but the operation
 * expected it to not exist.
 *
 * @category Error Handling
 */
export class BucketExistsError extends CouchbaseError {
  declare cause: Error;
  declare context: HttpErrorContext;
  constructor(cause?: Error, context?: ServiceErrorContext) {
    super('bucket exists', cause, context);
  }
}

/**
 * Indicates that the referenced user already exists, but the operation
 * expected it to not exist.
 *
 * @category Error Handling
 */
export class UserExistsError extends CouchbaseError {
  declare cause: Error;
  declare context: HttpErrorContext;
  constructor(cause?: Error, context?: ServiceErrorContext) {
    super('user exists', cause, context);
  }
}

/**
 * Indicates that the bucket could not be flushed due to not having the flush
 * option enabled.  This option can be dynamically adjusted.
 *
 * @category Error Handling
 */
export class BucketNotFlushableError extends CouchbaseError {
  declare cause: Error;
  declare context: HttpErrorContext;
  constructor(cause?: Error, context?: ServiceErrorContext) {
    super('bucket not flushable', cause, context);
  }
}

/**
 * Indicates that the referenced eventing function does not exist.
 *
 * @category Error Handling
 */
export class EventingFunctionNotFoundError extends CouchbaseError {
  declare cause: Error;
  constructor(cause?: Error, context?: ServiceErrorContext) {
    super('eventing function not found', cause, context);
  }
}

/**
 * Indicates that the referenced eventing function was not deployed but was
 * expected to have been.
 *
 * @category Error Handling
 */
export class EventingFunctionNotDeployedError extends CouchbaseError {
  declare cause: Error;
  constructor(cause?: Error, context?: ServiceErrorContext) {
    super('eventing function not deployed', cause, context);
  }
}

/**
 * Indicates that the eventing function was not able to be compiled.
 *
 * @category Error Handling
 */
export class EventingFunctionCompilationFailureError extends CouchbaseError {
  declare cause: Error;
  constructor(cause?: Error, context?: ServiceErrorContext) {
    super('eventing function compilation failed', cause, context);
  }
}

/**
 * Indicates that the source and metadata keyspaces both referenced the same
 * place for an eventing function.
 *
 * @category Error Handling
 */
export class EventingFunctionIdenticalKeyspaceError extends CouchbaseError {
  declare cause: Error;
  constructor(cause?: Error, context?: ServiceErrorContext) {
    super('eventing function identical keyspace', cause, context);
  }
}

/**
 * Indicates that an eventing function was deployed but has not yet fully
 * completed the bootstrapping process.
 *
 * @category Error Handling
 */
export class EventingFunctionNotBootstrappedError extends CouchbaseError {
  declare cause: Error;
  constructor(cause?: Error, context?: ServiceErrorContext) {
    super('eventing function not bootstrapped', cause, context);
  }
}

/**
 * Indicates that an eventing function is deployed but the operation expected
 * that it was not.
 *
 * @category Error Handling
 */
export class EventingFunctionDeployedError extends CouchbaseError {
  declare cause: Error;
  constructor(cause?: Error, context?: ServiceErrorContext) {
    super('eventing function deployed', cause, context);
  }
}

/**
 * Indicates that an eventing function is paused but the operation expected
 * that it was not.
 *
 * @category Error Handling
 */
export class EventingFunctionPausedError extends CouchbaseError {
  declare cause: Error;
  constructor(cause?: Error, context?: ServiceErrorContext) {
    super('eventing function paused', cause, context);
  }
}

/**
 * Indicates a transaction operation failed to complete.
 *
 * @category Error Handling
 */
export class TransactionOperationFailedError extends CouchbaseError {
  declare cause: Error;
  constructor(reason?: string, cause?: Error, context?: ServiceErrorContext) {
    super(`transaction operation failed${appendReason(reason)}`, cause, context);
  }
}

/**
 * Indicates a transaction failed to complete.
 *
 * @category Error Handling
 */
export class TransactionFailedError extends CouchbaseError {
  declare cause: Error;
  constructor(reason?: string, cause?: Error, context?: ServiceErrorContext) {
    super(reason ?? `transaction failed`, cause, context);
  }
}

/**
 * Indicates a transaction failed to complete due to expiring.
 *
 * @category Error Handling
 */
export class TransactionExpiredError extends CouchbaseError {
  declare cause: Error;
  constructor(reason: string, cause?: Error) {
    super(`transaction expired${appendReason(reason)}`, cause);
  }
}

/**
 * Indicates the state of a transaction ended as ambiguous and may or
 * may not have committed successfully.
 *
 * @category Error Handling
 */
export class TransactionCommitAmbiguousError extends CouchbaseError {
  declare cause: Error;
  constructor(reason: string, cause?: Error) {
    super(`transaction commit ambiguous${appendReason(reason)}`, cause);
  }
}

export class SearchIndexManagementError extends CouchbaseError {
  declare cause: undefined;
  declare context: HttpErrorContext;

  constructor(message: string, cause?: Error, context?: HttpErrorContext) {
    super(message, cause, context);
  }
}

/**
 * Indicates that the referenced search index does not exist.
 *
 * @category Error Handling
 */
export class SearchIndexNotFoundError extends SearchIndexManagementError {
  constructor(indexName: string, context?: HttpErrorContext) {
    super(`search index '${indexName}' not found`, undefined, context);
  }
}
