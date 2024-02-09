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
  EventingFunctionLogLevelName,
} from '@cbjs/shared';

export type ApiEventingFunction = {
  appcode: string;
  depcfg: {
    source_bucket: string;
    source_scope: string;
    source_collection: string;
    metadata_bucket: string;
    metadata_scope: string;
    metadata_collection: string;
  };
  version: string;
  enforce_schema: boolean;
  handleruuid: number;
  function_instance_id: string;
  appname: string;
  settings: {
    dcp_stream_boundary: EventingFunctionDcpBoundaryName;
    deployment_status: boolean;
    description: string;
    execution_timeout: number;

    /**
     * Couchbase Server version, i.e: "7.2.0".
     */
    language_compatibility: string;
    log_level: EventingFunctionLogLevelName;
    n1ql_consistency: 'none' | 'request';
    processing_status: boolean;
    timer_context_size: number;
    user_prefix: 'eventing' | (string & NonNullable<unknown>);
    worker_count: number;
  };
  function_scope: {
    bucket: string;
    scope: string;
  };
};
