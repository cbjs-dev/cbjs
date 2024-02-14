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
import {
  BucketCapability,
  BucketTypeName,
  CompressionModeName,
  ConflictResolutionTypeName,
  DurabilityLevelName,
  EvictionPolicyName,
  ReplicaNumber,
  StorageBackendName,
} from '@cbjs/shared';

import type { ApiNode } from '../cluster/ApiNode';

export type ApiBucket = {
  name: string;
  nodeLocator: 'vbucket' | (string & NonNullable<unknown>);
  bucketType: BucketTypeName;
  storageBackend: StorageBackendName;
  uuid: string;
  uri: string;
  streamingUri: string;
  bucketCapabilitiesVer: string;
  bucketCapabilities: BucketCapability[];
  collectionsManifestUid: string;
  ddocs: {
    uri: string;
  };
  vBucketServerMap: {
    hashAlgorithm: 'CRC' | (string & NonNullable<unknown>);
    numReplicas: ReplicaNumber;
    serverList: [string, ...string[]];
    vBucketMap: [number][];
  };
  localRandomKeyUri: string;
  controllers: {
    compactAll: string;
    compactDB: string;
    purgeDeletes: string;
    startRecovery: string;
  };
  nodes: [ApiNode, ...ApiNode[]];
  stats: {
    uri: string;
    directoryURI: string;
    nodeStatsListURI: string;
  };
  authType: 'sasl' | (string & NonNullable<unknown>);
  autoCompactionSettings: boolean;
  replicaIndex: boolean;
  replicaNumber: ReplicaNumber;
  threadsNumber: number;
  quota: {
    ram: number;
    rawRAM: number;
  };
  basicStats: {
    quotaPercentUsed: number;
    opsPerSec: number;
    diskFetches: number;
    itemCount: number;
    diskUsed: number;
    dataUsed: number;
    memUsed: number;
    vbActiveNumNonResident: number;
  };
  evictionPolicy: EvictionPolicyName;
  durabilityMinLevel: DurabilityLevelName;
  pitrEnabled: boolean;
  pitrGranularity: number;
  pitrMaxHistoryAge: number;
  conflictResolutionType: ConflictResolutionTypeName;
  maxTTL: number;
  compressionMode: CompressionModeName;
};
