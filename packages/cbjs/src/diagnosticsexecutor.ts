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
import { CouchbaseClusterTypes } from '@cbjsdev/shared';

import {
  endpointStateFromCpp,
  errorFromCpp,
  pingStateFromCpp,
  serviceTypeFromCpp,
  serviceTypeToCpp,
} from './bindingutilities';
import { Cluster } from './cluster';
import {
  DiagnosticsEndpoint,
  DiagnosticsOptions,
  DiagnosticsResult,
  PingEndpoint,
  PingOptions,
  PingResult,
} from './diagnosticstypes';

/**
 * @internal
 */
export class DiagnoticsExecutor<T extends CouchbaseClusterTypes = CouchbaseClusterTypes> {
  private _cluster: Cluster<T>;

  /**
   * @internal
   */
  constructor(cluster: Cluster<T>) {
    this._cluster = cluster;
  }

  /**
   * @internal
   */
  async diagnostics(options: DiagnosticsOptions): Promise<DiagnosticsResult> {
    return new Promise((resolve, reject) => {
      this._cluster.conn.diagnostics(
        {
          report_id: options.reportId,
        },
        (cppErr, resp) => {
          const err = errorFromCpp(cppErr);
          if (err !== null || !resp) {
            reject(err);
            return;
          }

          resolve(
            new DiagnosticsResult({
              version: resp.version,
              id: resp.id,
              sdk: resp.sdk,
              services: Object.fromEntries(
                Object.entries(resp.services).map(([serviceType, services]) => {
                  return [
                    serviceTypeFromCpp(parseInt(serviceType)),
                    services.map((svc) => {
                      return new DiagnosticsEndpoint({
                        type: serviceTypeFromCpp(svc.type),
                        id: svc.id,
                        local: svc.local,
                        remote: svc.remote,
                        lastActivity: svc.last_activity,
                        state: endpointStateFromCpp(svc.state),
                      });
                    }),
                  ];
                })
              ),
            })
          );
        }
      );
    });
  }
}

/**
 * @internal
 */
export class PingExecutor<T extends CouchbaseClusterTypes = CouchbaseClusterTypes> {
  private _cluster: Cluster<T>;

  /**
   * @internal
   */
  constructor(cluster: Cluster<T>) {
    this._cluster = cluster;
  }

  /**
   * @internal
   */
  async ping(options: PingOptions): Promise<PingResult> {
    return new Promise((resolve, reject) => {
      // BUG(JSCBC-993): timeout is not currently sent to the C++ client
      options.timeout;

      this._cluster.conn.ping(
        {
          report_id: options.reportId,
          services: options.serviceTypes
            ? options.serviceTypes.map((svc) => serviceTypeToCpp(svc))
            : undefined,
        },
        (cppErr, resp) => {
          const err = errorFromCpp(cppErr);
          if (err !== null || !resp) {
            reject(err);
            return;
          }

          resolve(
            new PingResult({
              version: resp.version,
              id: resp.id,
              sdk: resp.sdk,
              services: Object.fromEntries(
                Object.entries(resp.services).map(([serviceType, services]) => {
                  return [
                    serviceTypeFromCpp(parseInt(serviceType)),
                    services.map((svc) => {
                      return new PingEndpoint({
                        type: serviceTypeFromCpp(svc.type),
                        id: svc.id,
                        latency: svc.latency,
                        remote: svc.remote,
                        local: svc.local,
                        state: pingStateFromCpp(svc.state),
                        bucket: svc.bucket,
                        error: svc.error,
                      });
                    }),
                  ];
                })
              ),
            })
          );
        }
      );
    });
  }
}
