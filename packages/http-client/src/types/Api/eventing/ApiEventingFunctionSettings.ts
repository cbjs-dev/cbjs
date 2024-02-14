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
  EventingFunctionDcpBoundaryName,
  EventingFunctionLanguageCompatibilityName,
  EventingFunctionLogLevelName,
  QueryScanConsistencyName,
} from '@cbjs/shared';

export type ApiEventingFunctionSettings =
  | {
      // Optional because the time is used for both creation and retrieval
      deployment_status?: false;
    }
  | {
      cpp_worker_thread_count: number;
      dcp_stream_boundary: EventingFunctionDcpBoundaryName;
      description: string;
      log_level: EventingFunctionLogLevelName;
      language_compatibility: EventingFunctionLanguageCompatibilityName;
      execution_timeout: number;
      lcb_inst_capacity: number;
      lcb_retry_count: number;
      lcb_timeout: number;
      n1ql_consistency: QueryScanConsistencyName;
      num_timer_partitions: number;
      sock_batch_size: number;
      tick_duration: number;
      timer_context_size: number;
      user_prefix: string;
      bucket_cache_size: number;
      bucket_cache_age: number;
      curl_max_allowed_resp_size: number;
      worker_count: number;
      n1ql_prepare_all: boolean;
      handler_headers: string[];
      handler_footers: string[];
      enable_applog_rotation: boolean;
      app_log_dir: string;
      app_log_max_size: number;
      app_log_max_files: number;
      checkpoint_interval: number;
      deployment_status: true;
      processing_status: boolean;
    };
