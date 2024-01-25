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

import { ApiNode } from './ApiNode';

export type ApiPoolNodes = {
  name: string;
  nodes: [ApiNode, ...ApiNode[]];
  buckets: {
    uri: string;
    terseBucketsBase: string;
    terseStreamingBucketsBase: string;
  };
  bucketNames: Array<{
    bucketName: string;
    uuid: string;
  }>;
  remoteClusters: {
    uri: string;
    validateURI: string;
  };
  alerts: string[]; // TODO
  alertsSilenceURL: string;
  controllers: {
    addNode: {
      uri: string;
    };
    rebalance: {
      uri: string;
    };
    failOver: {
      uri: string;
    };
    startGracefulFailover: {
      uri: string;
    };
    reAddNode: {
      uri: string;
    };
    reFailOver: {
      uri: string;
    };
    ejectNode: {
      uri: string;
    };
    setRecoveryType: {
      uri: string;
    };
    setAutoCompaction: {
      uri: string;
      validateURI: string;
    };
    clusterLogsCollection: {
      startURI: string;
      cancelURI: string;
    };
    replication: {
      createURI: string;
      validateURI: string;
    };
  };
  rebalanceStatus: 'none' | (string & NonNullable<unknown>);
  rebalanceProgressUri: string;
  stopRebalanceUri: string;
  nodeStatusesUri: string;
  nodeServicesUri: string;
  maxBucketCount: number;
  maxCollectionCount: number;
  maxScopeCount: number;
  autoCompactionSettings: {
    parallelDBAndViewCompaction: boolean;
    magmaFragmentationPercentage: number;
    databaseFragmentationThreshold: {
      percentage: number;
      size: 'undefined' | (string & NonNullable<unknown>);
    };
    viewFragmentationThreshold: {
      percentage: number;
      size: 'undefined' | (string & NonNullable<unknown>);
    };
    indexCompactionMode: 'circular' | (string & NonNullable<unknown>);
    indexCircularCompaction: {
      daysOfWeek: string;
      interval: {
        fromHour: number;
        toHour: number;
        fromMinute: number;
        toMinute: number;
        abortOutside: boolean;
      };
    };
    indexFragmentationThreshold: {
      percentage: number;
    };
  };
  tasks: {
    uri: string;
  };
  counters: {
    rebalance_failure?: number;
    rebalance_success?: number;
    rebalance_start?: number;
  };
  indexStatusURI: string;
  trustedCAsURI: string;
  clusterName: string;
  clusterEncryptionLevel: 'none' | (string & NonNullable<unknown>);
  balanced: true;
  checkPermissionsURI: string;
  memoryQuota: number;
  indexMemoryQuota: number;
  ftsMemoryQuota: number;
  cbasMemoryQuota: number;
  eventingMemoryQuota: number;
  storageTotals: {
    ram: {
      total: number;
      quotaTotal: number;
      quotaUsed: number;
      used: number;
      usedByData: number;
      quotaUsedPerNode: number;
      quotaTotalPerNode: number;
    };
    hdd: {
      total: number;
      quotaTotal: number;
      used: number;
      usedByData: number;
      free: number;
    };
  };
  serverGroupsUri: string;
};
