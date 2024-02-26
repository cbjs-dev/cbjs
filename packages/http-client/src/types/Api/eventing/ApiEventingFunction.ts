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
import { EventingFunctionUrlAuthData } from '@cbjsdev/shared';

import { ApiEventingFunctionSettings } from './ApiEventingFunctionSettings';

export type ApiEventingFunctionConstantBinding = {
  value: string;
  literal: string;
};

export type ApiEventingFunctionBucketBinding = {
  bucket_name: string;
  scope_name: string;
  collection_name: string;
  alias: string;
  access: 'r' | 'rw';
};

export type ApiEventingFunctionCurlBinding = {
  hostname: string;
  value: string;
  allow_cookies: boolean;
  validate_ssl_certificate: boolean;
} & EventingFunctionUrlAuthData;

export type ApiEventingFunction = {
  appcode: string;
  depcfg: {
    source_bucket: string;
    source_scope: string;
    source_collection: string;
    metadata_bucket: string;
    metadata_scope: string;
    metadata_collection: string;
    constants: ReadonlyArray<ApiEventingFunctionConstantBinding>;
    buckets: ReadonlyArray<ApiEventingFunctionBucketBinding>;
    curl: ReadonlyArray<ApiEventingFunctionCurlBinding>;
  };
  version: string;
  enforce_schema: boolean;
  handleruuid: number;
  function_instance_id: string;
  appname: string;
  settings: ApiEventingFunctionSettings;
  function_scope: {
    bucket: string;
    scope: string;
  };
};
