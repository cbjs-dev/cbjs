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
import { Cas } from './utilities.js';

/**
 * Generic base class for all known error context types.
 *
 * @category Error Handling
 */
export class ErrorContext {}

export type ServiceErrorContext =
  | KeyValueErrorContext
  | ViewErrorContext
  | QueryErrorContext
  | SearchErrorContext
  | AnalyticsErrorContext
  | HttpErrorContext;

/**
 * The error context information for a key-value operation.
 *
 * @category Error Handling
 */
export class KeyValueErrorContext extends ErrorContext {
  /**
   * The memcached status code returned by the server.
   */
  status_code: number;

  /**
   * The opaque identifier for the request.
   */
  opaque: number;

  /**
   * The cas returned by the server.
   */
  cas: Cas;

  /**
   * The key that was being operated on.
   */
  key?: string;

  /**
   * The name of the bucket that was being operated on.
   */
  bucket?: string;

  /**
   * The name of the collection that was being operated on.
   */
  collection?: string;

  /**
   * The name of the scope that was being operated on.
   */
  scope?: string;

  /**
   * The context returned by the server helping describing the error.
   */
  context: string;

  /**
   * The reference id returned by the server for correlation in server logs.
   */
  ref: string;

  /**
   * @internal
   */
  constructor(data: KeyValueErrorContext) {
    super();

    this.status_code = data.status_code;
    this.opaque = data.opaque;
    this.cas = data.cas;
    this.key = data.key;
    this.bucket = data.bucket;
    this.collection = data.collection;
    this.scope = data.scope;
    this.context = data.context;
    this.ref = data.ref;
  }
}

/**
 * The error context information for a views operation.
 *
 * @category Error Handling
 */
export class ViewErrorContext extends ErrorContext {
  /**
   * The name of the design document that was being operated on.
   */
  design_document: string;

  /**
   * The name of the view that was being operated on.
   */
  view: string;

  /**
   * A list of the parameters in use for the operation.
   */
  parameters: any;

  /**
   * The http response status code which was received.
   */
  http_response_code: number;

  /**
   * The http response body which was received.
   */
  http_response_body: string;

  /**
   * @internal
   */
  constructor(data: ViewErrorContext) {
    super();

    this.design_document = data.design_document;
    this.view = data.view;
    this.parameters = data.parameters;
    this.http_response_code = data.http_response_code;
    this.http_response_body = data.http_response_body;
  }
}

/**
 * The error context information for a query operation.
 *
 * @category Error Handling
 */
export class QueryErrorContext extends ErrorContext {
  /**
   * The statement that was being executed when the error occured.
   */
  statement: string;

  /**
   * The client context id which was sent to the service for correlation
   * between requests and responses.
   */
  client_context_id: string;

  /**
   * A list of the parameters in use for the operation.
   */
  parameters: any;

  /**
   * The http response status code which was received.
   */
  http_response_code: number;

  /**
   * The http response body which was received.
   */
  http_response_body: string;

  /**
   * @internal
   */
  constructor(data: QueryErrorContext) {
    super();

    this.statement = data.statement;
    this.client_context_id = data.client_context_id;
    this.parameters = data.parameters;
    this.http_response_code = data.http_response_code;
    this.http_response_body = data.http_response_body;
  }
}

/**
 * The error context information for a search query operation.
 *
 * @category Error Handling
 */
export class SearchErrorContext extends ErrorContext {
  /**
   * The name of the index which was being operated on.
   */
  index_name: string;

  /**
   * The full query that was being executed.
   */
  query: any;

  /**
   * A list of the parameters in use for the operation.
   */
  parameters: any;

  /**
   * The http response status code which was received.
   */
  http_response_code: number;

  /**
   * The http response body which was received.
   */
  http_response_body?: string;

  /**
   * @internal
   */
  constructor(data: SearchErrorContext) {
    super();

    this.index_name = data.index_name;
    this.query = data.query;
    this.parameters = data.parameters;
    this.http_response_code = data.http_response_code;
    this.http_response_body = data.http_response_body;
  }
}

/**
 * The error context information for an analytics query operation.
 *
 * @category Error Handling
 */
export class AnalyticsErrorContext extends ErrorContext {
  /**
   * The statement that was being executed when the error occured.
   */
  statement: string;

  /**
   * The client context id which was sent to the service for correlation
   * between requests and responses.
   */
  client_context_id: string;

  /**
   * A list of the parameters in use for the operation.
   */
  parameters: any;

  /**
   * The http response status code which was received.
   */
  http_response_code: number;

  /**
   * The http response body which was received.
   */
  http_response_body: string;

  /**
   * @internal
   */
  constructor(data: QueryErrorContext) {
    super();

    this.statement = data.statement;
    this.client_context_id = data.client_context_id;
    this.parameters = data.parameters;
    this.http_response_code = data.http_response_code;
    this.http_response_body = data.http_response_body;
  }
}

/**
 * The error context information for a http operation.
 *
 * @category Error Handling
 */
export class HttpErrorContext extends ErrorContext {
  /**
   * The HTTP method of the request that was performed.
   */
  method: string;

  /**
   * The request path for the request that was being performed.
   */
  request_path: string;

  /**
   * The http response status code which was received.
   */
  response_code: number;

  /**
   * The http response body which was received.
   */
  response_body: string;

  /**
   * @internal
   */
  constructor(data: HttpErrorContext) {
    super();

    this.method = data.method;
    this.request_path = data.request_path;
    this.response_code = data.response_code;
    this.response_body = data.response_body;
  }
}
