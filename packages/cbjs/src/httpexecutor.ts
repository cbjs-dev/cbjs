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
import { EventEmitter } from 'events';

import binding from './binding.js';
import { CppConnection } from './binding.js';
import { errorFromCpp } from './bindingutilities.js';
import { HttpErrorContext } from './errorcontexts.js';
import { TypedEmitter } from './utils/TypedEmitter.js';

/**
 * @internal
 */
export enum HttpServiceType {
  Management = 'MGMT',
  Views = 'VIEW',
  Query = 'QUERY',
  Search = 'SEARCH',
  Analytics = 'ANALYTICS',
  Eventing = 'EVENTING',
}

/**
 * @internal
 */
export enum HttpMethod {
  Get = 'GET',
  Post = 'POST',
  Put = 'PUT',
  Delete = 'DELETE',
}

/**
 * @internal
 */
export interface HttpRequestOptions {
  type: HttpServiceType;
  method: HttpMethod;
  path: string;
  contentType?: string;
  body?: string | Buffer;
  timeout: number;
}

/**
 * @internal
 */
export interface HttpResponse {
  requestOptions: HttpRequestOptions;
  statusCode: number;
  headers: { [key: string]: string };
  body: Buffer;
}

/**
 * @internal
 */
export class HttpExecutor {
  private _conn: CppConnection;

  /**
   * @internal
   */
  constructor(conn: CppConnection) {
    this._conn = conn;
  }

  /**
   * @internal
   */
  streamRequest(options: HttpRequestOptions) {
    const emitter = new EventEmitter() as TypedEmitter<{
      meta: (metadata: { statusCode: number; headers: Record<string, string> }) => void;
      data: (data: Buffer) => void;
      error: (err: Error) => void;
      end: () => void;
    }>;

    let cppHttpType;
    if (options.type === HttpServiceType.Management) {
      cppHttpType = binding.service_type.management;
    } else if (options.type === HttpServiceType.Views) {
      cppHttpType = binding.service_type.view;
    } else if (options.type === HttpServiceType.Query) {
      cppHttpType = binding.service_type.query;
    } else if (options.type === HttpServiceType.Search) {
      cppHttpType = binding.service_type.search;
    } else if (options.type === HttpServiceType.Analytics) {
      cppHttpType = binding.service_type.analytics;
    } else if (options.type === HttpServiceType.Eventing) {
      cppHttpType = binding.service_type.eventing;
    } else {
      throw new Error('unexpected http request type');
    }

    let cppHttpMethod;
    if (options.method === HttpMethod.Get) {
      cppHttpMethod = 'GET';
    } else if (options.method === HttpMethod.Post) {
      cppHttpMethod = 'POST';
    } else if (options.method === HttpMethod.Put) {
      cppHttpMethod = 'PUT';
    } else if (options.method === HttpMethod.Delete) {
      cppHttpMethod = 'DELETE';
    } else {
      throw new Error('unexpected http request method');
    }

    const headers: { [key: string]: string } = {};
    if (options.contentType) {
      headers['Content-Type'] = options.contentType;
    }

    let body = '';
    if (!options.body) {
      // empty body is acceptable
    } else if (options.body instanceof Buffer) {
      body = options.body.toString();
    } else if (typeof options.body === 'string') {
      body = options.body;
    } else {
      throw new Error('unexpected http body type');
    }

    this._conn.managementFreeform(
      {
        type: cppHttpType,
        method: cppHttpMethod,
        path: options.path,
        headers: headers,
        body: body,
        timeout: options.timeout,
      },
      (cppErr, res) => {
        const err = errorFromCpp(cppErr);
        if (err) {
          emitter.emit('error', err);
          return;
        }

        emitter.emit('meta', {
          statusCode: res.status,
          headers: res.headers,
        });

        emitter.emit('data', Buffer.from(res.body));
        emitter.emit('end');
      }
    );

    return emitter;
  }

  async request(options: HttpRequestOptions): Promise<HttpResponse> {
    return new Promise((resolve, reject) => {
      const emitter = this.streamRequest(options);

      emitter.on('error', (err) => {
        reject(err);
      });

      let dataCache = Buffer.allocUnsafe(0);
      emitter.on('data', (data) => {
        dataCache = Buffer.concat([dataCache, data]);
      });

      let metaCache: {
        statusCode: number;
        headers: Record<string, string>;
      } | null = null;
      emitter.on('meta', (meta) => {
        metaCache = meta;
      });

      emitter.on('end', () => {
        if (metaCache === null) {
          reject(new Error('Unexpected null metadata'));
          return;
        }

        resolve({
          requestOptions: options,
          statusCode: metaCache.statusCode,
          headers: metaCache.headers,
          body: dataCache,
        });
      });
    });
  }

  static errorContextFromResponse(resp: HttpResponse): HttpErrorContext {
    return new HttpErrorContext({
      method: resp.requestOptions.method,
      request_path: resp.requestOptions.path,
      response_code: resp.statusCode,
      response_body: resp.body.toString(),
    });
  }
}
