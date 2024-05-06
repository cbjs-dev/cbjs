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
import { CouchbaseHttpApiConfig } from '../../types.js';
import { ApiSearchGetIndex } from '../../types/Api/index.js';
import { createHttpError } from '../../utils/createHttpError.js';
import { requestGetSearchIndexStatistics } from './requests/requestGetSearchIndexStatistics.js';

export async function getSearchIndexStatistics(
  params: CouchbaseHttpApiConfig,
  indexName: string
) {
  const response = await requestGetSearchIndexStatistics(params, indexName);

  if (response.status !== 200) {
    throw await createHttpError('GET', response);
  }

  return (await response.json()) as SearchIndexStatistics;
}

export type SearchIndexStatistics = {
  feeds: {
    [key: string]: {
      agentDCPStats: {
        TotDCPStreamReqs: number;
        TotDCPStreamEnds: number;
        TotDCPRollbacks: number;
        TotDCPSnapshotMarkers: number;
        TotDCPMutations: number;
        TotDCPDeletions: number;
        TotDCPSeqNoAdvanceds: number;
        TotDCPCreateCollections: number;
      };
      destStats: {
        TotError: number;
        TimerDataUpdate: {
          count: number;
          min: number;
          max: number;
          mean: number;
          stddev: number;
          percentiles: {
            '95%': number;
            '99%': number;
            '99.9%': number;
            'median': number;
            '75%': number;
          };
          rates: {
            '1-min': number;
            '5-min': number;
            '15-min': number;
            'mean': number;
          };
        };
        TimerDataDelete: {
          count: number;
          min: number;
          max: number;
          mean: number;
          stddev: number;
          percentiles: {
            '99.9%': number;
            'median': number;
            '75%': number;
            '95%': number;
            '99%': number;
          };
          rates: {
            'mean': number;
            '1-min': number;
            '5-min': number;
            '15-min': number;
          };
        };
        TimerSnapshotStart: {
          count: number;
          min: number;
          max: number;
          mean: number;
          stddev: number;
          percentiles: {
            '75%': number;
            '95%': number;
            '99%': number;
            '99.9%': number;
            'median': number;
          };
          rates: {
            'mean': number;
            '1-min': number;
            '5-min': number;
            '15-min': number;
          };
        };
        TimerOpaqueGet: {
          count: number;
          min: number;
          max: number;
          mean: number;
          stddev: number;
          percentiles: {
            'median': number;
            '75%': number;
            '95%': number;
            '99%': number;
            '99.9%': number;
          };
          rates: {
            '5-min': number;
            '15-min': number;
            'mean': number;
            '1-min': number;
          };
        };
        TimerOpaqueSet: {
          count: number;
          min: number;
          max: number;
          mean: number;
          stddev: number;
          percentiles: {
            'median': number;
            '75%': number;
            '95%': number;
            '99%': number;
            '99.9%': number;
          };
          rates: {
            '5-min': number;
            '15-min': number;
            'mean': number;
            '1-min': number;
          };
        };
        TimerRollback: {
          count: number;
          min: number;
          max: number;
          mean: number;
          stddev: number;
          percentiles: {
            '75%': number;
            '95%': number;
            '99%': number;
            '99.9%': number;
            'median': number;
          };
          rates: {
            '1-min': number;
            '5-min': number;
            '15-min': number;
            'mean': number;
          };
        };
        TimerCreateCollection: {
          count: number;
          min: number;
          max: number;
          mean: number;
          stddev: number;
          percentiles: {
            '99%': number;
            '99.9%': number;
            'median': number;
            '75%': number;
            '95%': number;
          };
          rates: {
            '1-min': number;
            '5-min': number;
            '15-min': number;
            'mean': number;
          };
        };
        TimerSeqNoAdvanced: {
          count: number;
          min: number;
          max: number;
          mean: number;
          stddev: number;
          percentiles: {
            '99.9%': number;
            'median': number;
            '75%': number;
            '95%': number;
            '99%': number;
          };
          rates: {
            'mean': number;
            '1-min': number;
            '5-min': number;
            '15-min': number;
          };
        };
      };
    };
  };
  pindexes: {
    [key: string]: {
      pindexStoreStats: {
        TimerBatchStore: {
          count: number;
          min: number;
          max: number;
          mean: number;
          stddev: number;
          percentiles: {
            '99.9%': number;
            'median': number;
            '75%': number;
            '95%': number;
            '99%': number;
          };
          rates: {
            '1-min': number;
            '5-min': number;
            '15-min': number;
            'mean': number;
          };
        };
        Errors: [];
      };
      bleveIndexStats: {
        index: {
          CurFilesIneligibleForRemoval: number;
          CurOnDiskBytes: number;
          CurOnDiskFiles: number;
          CurRootEpoch: number;
          LastMergedEpoch: number;
          LastPersistedEpoch: number;
          MaxBatchIntroTime: number;
          MaxFileMergeZapIntroductionTime: number;
          MaxFileMergeZapTime: number;
          MaxMemMergeZapTime: number;
          TotAnalysisTime: number;
          TotBatchIntroTime: number;
          TotBatches: number;
          TotBatchesEmpty: number;
          TotDeletes: number;
          TotEventTriggerCompleted: number;
          TotEventTriggerStarted: number;
          TotFileMergeForceOpsCompleted: number;
          TotFileMergeForceOpsStarted: number;
          TotFileMergeIntroductions: number;
          TotFileMergeIntroductionsDone: number;
          TotFileMergeIntroductionsObsoleted: number;
          TotFileMergeIntroductionsSkipped: number;
          TotFileMergeLoopBeg: number;
          TotFileMergeLoopEnd: number;
          TotFileMergeLoopErr: number;
          TotFileMergePlan: number;
          TotFileMergePlanErr: number;
          TotFileMergePlanNone: number;
          TotFileMergePlanOk: number;
          TotFileMergePlanTasks: number;
          TotFileMergePlanTasksDone: number;
          TotFileMergePlanTasksErr: number;
          TotFileMergePlanTasksSegments: number;
          TotFileMergePlanTasksSegmentsEmpty: number;
          TotFileMergeSegments: number;
          TotFileMergeSegmentsEmpty: number;
          TotFileMergeWrittenBytes: number;
          TotFileMergeZapBeg: number;
          TotFileMergeZapEnd: number;
          TotFileMergeZapIntroductionTime: number;
          TotFileMergeZapTime: number;
          TotFileSegmentsAtRoot: number;
          TotIndexTime: number;
          TotIndexedPlainTextBytes: number;
          TotIntroduceLoop: number;
          TotIntroduceMergeBeg: number;
          TotIntroduceMergeEnd: number;
          TotIntroducePersistBeg: number;
          TotIntroducePersistEnd: number;
          TotIntroduceRevertBeg: number;
          TotIntroduceRevertEnd: number;
          TotIntroduceSegmentBeg: number;
          TotIntroduceSegmentEnd: number;
          TotIntroducedItems: number;
          TotIntroducedSegmentsBatch: number;
          TotIntroducedSegmentsMerge: number;
          TotItemsToPersist: number;
          TotMemMergeBeg: number;
          TotMemMergeDone: number;
          TotMemMergeErr: number;
          TotMemMergeSegments: number;
          TotMemMergeZapBeg: number;
          TotMemMergeZapEnd: number;
          TotMemMergeZapTime: number;
          TotMemorySegmentsAtRoot: number;
          TotOnErrors: number;
          TotPersistLoopBeg: number;
          TotPersistLoopEnd: number;
          TotPersistLoopErr: number;
          TotPersistLoopProgress: number;
          TotPersistLoopWait: number;
          TotPersistLoopWaitNotified: number;
          TotPersistedItems: number;
          TotPersistedSegments: number;
          TotPersisterMergerNapBreak: number;
          TotPersisterNapPauseCompleted: number;
          TotPersisterSlowMergerPause: number;
          TotPersisterSlowMergerResume: number;
          TotSnapshotsRemovedFromMetaStore: number;
          TotTermSearchersFinished: number;
          TotTermSearchersStarted: number;
          TotUpdates: number;
          analysis_time: number;
          batches: number;
          deletes: number;
          errors: number;
          index_time: number;
          num_bytes_used_disk: number;
          num_bytes_used_disk_by_root: number;
          num_bytes_used_disk_by_root_reclaimable: number;
          num_files_on_disk: number;
          num_items_introduced: number;
          num_items_persisted: number;
          num_persister_nap_merger_break: number;
          num_persister_nap_pause_completed: number;
          num_plain_text_bytes_indexed: number;
          num_recs_to_persist: number;
          num_root_filesegments: number;
          num_root_memorysegments: number;
          term_searchers_finished: number;
          term_searchers_started: number;
          total_compaction_written_bytes: number;
          updates: number;
        };
        search_time: number;
        searches: number;
      };
      basic: {
        DocCount: number;
      };
      partitions: {
        [partitionId: string]: {
          seq: number;
          seqReceived: number;
          sourceSeq: number;
          uuid: string;
        };
      };
      copyPartitionStats: {
        TotCopyPartitionStart: number;
        TotCopyPartitionFinished: number;
        TotCopyPartitionTimeInMs: number;
        TotCopyPartitionFailed: number;
        TotCopyPartitionRetries: number;
        TotCopyPartitionErrors: number;
        TotCopyPartitionSkipped: number;
        TotCopyPartitionCancelled: number;
        TotCopyPartitionOnHttp2: number;
      };
    };
  };
};
