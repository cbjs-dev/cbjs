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

export type ApiQueryIndexStats = {
  avg_array_length: number;
  avg_drain_rate: number;
  avg_item_size: number;
  avg_scan_latency: number;
  cache_hit_percent: number;
  cache_hits: number;
  cache_misses: number;
  data_size: number;
  disk_size: number;
  docid_count: number;
  frag_percent: number;
  initial_build_progress: number;
  items_count: number;

  /**
   * This number is bigger than Number.MAX_SAFE_INTEGER, so use a custom JSON deserializer to handle it properly.
   */
  last_known_scan_time: number;
  memory_used: number;
  num_docs_indexed: number;
  num_docs_pending: number;
  num_docs_queued: number;
  num_items_flushed: number;
  num_pending_requests: number;
  num_requests: number;
  num_rows_returned: number;
  num_scan_errors: number;
  num_scan_timeouts: number;
  recs_in_mem: number;
  recs_on_disk: number;
  resident_percent: number;
  scan_bytes_read: number;
  total_scan_duration: 9945124;
};
