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
import { ServiceType } from './generaltypes.js';

/**
 * Represents the status of an an endpoint in a diagnostics report.
 *
 * @category Diagnostics
 */
export enum EndpointState {
  /**
   * Indicates the endpoint is disconnected.
   */
  Disconnected,

  /**
   * Indicates the endpoint is still connecting.
   */
  Connecting,

  /**
   * Indicates the endpoint is connected.
   */
  Connected,

  /**
   * Indicates the endpoint is disconnecting.
   */
  Disconnecting,
}

/**
 * Represents the status of an an endpoint in a ping report.
 */
export enum PingState {
  /**
   * Indicates the endpoint was pinged successfully.
   */
  Ok,

  /**
   * Indicates the endpoint timed out during the ping.
   */
  Timeout,

  /**
   * Indicates an error occured trying to ping the endpoint.
   */
  Error,
}

/**
 * The JSON-formated output report from a ping operation.
 *
 * @see {PingResult}
 * @category Diagnostics
 */
export interface JsonPingReport {
  /* eslint-disable */
  version: number;
  id: string;
  sdk: string;
  services: {
    [serviceType: string]: {
      latency_us: number;
      remote: string;
      local: string;
      id: string;
      state: string;
      namespace?: string;
      error?: string;
    }[];
  };
  /* eslint-enable */
}

/**
 * The JSON-formated output report from a diagnostics operation.
 *
 * @see {DiagnosticsResult}
 * @category Diagnostics
 */
export interface JsonDiagnosticsReport {
  /* eslint-disable */
  version: number;
  id: string;
  sdk: string;
  services: {
    [serviceType: string]: {
      last_activity_us?: number;
      remote: string;
      local: string;
      id: string;
      state: string;
      namespace?: string;
      details?: string;
    }[];
  };
  /* eslint-enable */
}

/**
 * PingEndpoint represents a single endpoint in a ping result.
 *
 * @category Diagnostics
 */
export class PingEndpoint {
  /**
   * @internal
   */
  constructor(data: PingEndpoint) {
    this.type = data.type;
    this.id = data.id;
    this.latency = data.latency;
    this.remote = data.remote;
    this.local = data.local;
    this.state = data.state;
    this.bucket = data.bucket;
    this.error = data.error;
  }

  /**
   * The type of service this endpoint refers to.
   */
  type: ServiceType;

  /**
   * The unique identifier for this endpoint.
   */
  id: string;

  /**
   * The remote address of this endpoint.
   */
  remote: string;

  /**
   * The local address of this endpoint.
   */
  local: string;

  /**
   * The latency of the ping to the endpoint.
   */
  latency: number;

  /**
   * The current state of this endpoint.
   */
  state: PingState;

  /**
   * The bucket this endpoint is connected to.
   */
  bucket?: string;

  /**
   * Information about errors that occured during pinging.
   */
  error?: any;
}

/**
 * PingResult represents the output of a ping operation.
 *
 * @category Diagnostics
 */
export class PingResult {
  /**
   * @internal
   */
  constructor(data: {
    version: number;
    id: string;
    sdk: string;
    services: { [serviceType: string]: PingEndpoint[] };
  }) {
    this.version = data.version;
    this.id = data.id;
    this.sdk = data.sdk;
    this.services = data.services;
  }

  /**
   * The version number of this report.
   */
  version: number;

  /**
   * The unique identifier for this report.
   */
  id: string;

  /**
   * The name of the SDK which generated this report.
   */
  sdk: string;

  /**
   * A list of service endpoints and their ping results.
   */
  services: { [serviceType: string]: PingEndpoint[] };

  /**
   * Returns a JSON formatted ping report.
   */
  toJSON(): JsonPingReport {
    return {
      version: this.version,
      id: this.id,
      sdk: this.sdk,
      services: Object.fromEntries(
        Object.entries(this.services).map(([serviceType, services]) => {
          return [
            serviceType,
            services.map((svc) => {
              return {
                latency_us: svc.latency * 1000000,
                remote: svc.remote,
                local: svc.local,
                id: svc.id,
                state: svc.state as any, // state enum is already a string
                namespace: svc.bucket,
                error: svc.error,
              };
            }),
          ];
        })
      ),
    };
  }
}

/**
 * @category Diagnostics
 */
export interface PingOptions {
  /**
   * A unique identifier for the report generated by this operation.
   */
  reportId?: string;

  /**
   * The services which should be pinged.
   */
  serviceTypes?: ServiceType[];

  /**
   * The name of the bucket to ping.
   */
  bucket?: string;

  /**
   * The timeout for this operation, represented in milliseconds.
   */
  timeout?: number;
}

/**
 * DiagnosticsEndpoint represents a single endpoint in a diagnostics
 * result.
 *
 * @category Diagnostics
 */
export class DiagnosticsEndpoint {
  /**
   * @internal
   */
  constructor(data: DiagnosticsEndpoint) {
    this.type = data.type;
    this.id = data.id;
    this.local = data.local;
    this.remote = data.remote;
    this.lastActivity = data.lastActivity;
    this.state = data.state;
  }

  /**
   * The type of service this entry represents.
   */
  type: ServiceType;

  /**
   * The unique identifier for this endpoint.
   */
  id: string;

  /**
   * The local address of this endpoint.
   */
  local: string;

  /**
   * The remote address of this endpoint.
   */
  remote: string;

  /**
   * The time in milliseconds since the last activity.
   */
  lastActivity: number;

  /**
   * The current state of this endpoint.
   */
  state: EndpointState;

  /**
   * The name of the bucket this endpoint is connected to.
   */
  bucket?: string;

  /**
   * Various additional details about the endpoint.
   */
  details?: any;
}

/**
 * DiagnosticsResult represents the output of a operation result.
 *
 * @category Diagnostics
 */
export class DiagnosticsResult {
  /**
   * @internal
   */
  constructor(data: {
    version: number;
    id: string;
    sdk: string;
    services: { [serviceType: string]: DiagnosticsEndpoint[] };
  }) {
    this.version = data.version;
    this.id = data.id;
    this.sdk = data.sdk;
    this.services = data.services;
  }

  /**
   * The version number of this report.
   */
  version: number;

  /**
   * The unique identifier for this report.
   */
  id: string;

  /**
   * The name of the SDK which generated this report.
   */
  sdk: string;

  /**
   * A list of service endpoints and their diagnostic status.
   */
  services: { [serviceType: string]: DiagnosticsEndpoint[] };

  /**
   * Returns a JSON formatted diagnostics report.
   */
  toJSON(): JsonDiagnosticsReport {
    return {
      version: this.version,
      id: this.id,
      sdk: this.sdk,
      services: Object.fromEntries(
        Object.entries(this.services).map(([serviceType, services]) => {
          return [
            serviceType,
            services.map((svc) => {
              return {
                last_activity_us: svc.lastActivity * 1000000,
                remote: svc.remote,
                local: svc.local,
                id: svc.id,
                state: svc.state as any, // state enum is already a string
                namespace: svc.bucket,
                details: svc.details,
              };
            }),
          ];
        })
      ),
    };
  }
}

/**
 * @category Diagnostics
 */
export interface DiagnosticsOptions {
  /**
   * A unique identifier for the report generated by this operation.
   */
  reportId?: string;
}
