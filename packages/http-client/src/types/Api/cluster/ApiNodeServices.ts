/*
 * Copyright (c) 2023-Present Jonathan MASSUCHETTI <jonathan.massuchetti@dappit.fr>.
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

/**
 * Ports published by a node, keyed by service.
 *
 * The set of keys grows with the server version, so unknown keys resolve to
 * `number | undefined` rather than being an error.
 */
type ApiKnownNodeServicePorts = {
  backupAPI?: number;
  backupAPIHTTPS?: number;
  backupGRPC?: number;
  capi?: number;
  capiSSL?: number;
  cbas?: number;
  cbasSSL?: number;
  eventingAdminPort?: number;
  eventingDebug?: number;
  eventingSSL?: number;
  fts?: number;
  ftsGRPC?: number;
  ftsGRPCSSL?: number;
  ftsSSL?: number;
  /**
   * Index service internal admin port, not the HTTP API.
   */
  indexAdmin?: number;
  /**
   * Index service HTTP API, unsecure. `/getIndexStatus` lives there.
   */
  indexHttp?: number;
  /**
   * Index service HTTP API, secure. `/getIndexStatus` lives there.
   */
  indexHttps?: number;
  indexScan?: number;
  indexStreamCatchup?: number;
  indexStreamInit?: number;
  indexStreamMaint?: number;
  kv?: number;
  kvSSL?: number;
  mgmt?: number;
  mgmtSSL?: number;
  n1ql?: number;
  n1qlSSL?: number;
  projector?: number;
};

export type ApiNodeServicePorts = ApiKnownNodeServicePorts &
  Record<string, number | undefined>;

export type ApiNodeServiceName =
  | keyof ApiKnownNodeServicePorts
  | (string & NonNullable<unknown>);

export type ApiNodeAlternateAddress = {
  hostname: string;
  /**
   * Ports of the alternate network. They may differ from the ones of the default
   * network, so they must never be mixed with the default `services` map.
   */
  ports?: ApiNodeServicePorts;
};

export type ApiNodeExt = {
  /**
   * Address of the node on the default network.
   *
   * Omitted when the node is the one that served the request, which is always the
   * case on a single node cluster.
   */
  hostname?: string;
  nodeUUID?: string;
  services: ApiNodeServicePorts;
  thisNode?: true;
  serverGroup?: string;
  appTelemetryPath?: string;
  /**
   * Addresses of the node on the other networks it is reachable from.
   *
   * On Capella, `hostname` is the address internal to the deployment
   * (`cb-0000.cb.<uuid>.svc`) and `alternateAddresses.external` carries the only
   * address resolvable from outside of it.
   */
  alternateAddresses?: {
    external?: ApiNodeAlternateAddress;
  } & Record<string, ApiNodeAlternateAddress | undefined>;
};

/**
 * Response body of `GET /pools/default/nodeServices`.
 */
export type ApiNodeServices = {
  rev: number;
  revEpoch?: number;
  nodesExt: [ApiNodeExt, ...ApiNodeExt[]];
  clusterCapabilitiesVer: number[];
  clusterCapabilities: Record<string, string[]>;
  clusterUUID: string;
  clusterName: string;
  prod?: string;
  prodName?: string;
};
