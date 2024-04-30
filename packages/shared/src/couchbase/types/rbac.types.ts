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
import { Pretty } from '../../misc/index.js';

type RoleScope = {
  admin: [];
  ro_admin: [];
  security_admin_local: [];
  security_admin_external: [];
  cluster_admin: [];
  eventing_admin: [];
  backup_admin: [];
  bucket_admin: ['bucket_name'];
  scope_admin: ['bucket_name', 'scope_name'];
  bucket_full_access: ['bucket_name'];
  views_admin: ['bucket_name'];
  views_reader: ['bucket_name'];
  replication_admin: [];
  data_reader: ['bucket_name', 'scope_name', 'collection_name'];
  data_writer: ['bucket_name', 'scope_name', 'collection_name'];
  data_dcp_reader: ['bucket_name', 'scope_name', 'collection_name'];
  data_backup: ['bucket_name'];
  data_monitoring: ['bucket_name', 'scope_name', 'collection_name'];
  fts_admin: ['bucket_name'];
  fts_searcher: ['bucket_name', 'scope_name', 'collection_name'];
  query_select: ['bucket_name', 'scope_name', 'collection_name'];
  query_update: ['bucket_name', 'scope_name', 'collection_name'];
  query_insert: ['bucket_name', 'scope_name', 'collection_name'];
  query_delete: ['bucket_name', 'scope_name', 'collection_name'];
  query_manage_index: ['bucket_name', 'scope_name', 'collection_name'];
  query_system_catalog: [];
  query_external_access: [];
  query_manage_global_functions: [];
  query_execute_global_functions: [];
  query_manage_functions: ['bucket_name', 'scope_name'];
  query_execute_functions: ['bucket_name', 'scope_name'];
  query_manage_global_external_functions: [];
  query_execute_global_external_functions: [];
  query_manage_external_functions: ['bucket_name', 'scope_name'];
  query_execute_external_functions: ['bucket_name', 'scope_name'];
  replication_target: ['bucket_name'];
  analytics_manager: ['bucket_name'];
  analytics_reader: [];
  analytics_select: ['bucket_name', 'scope_name', 'collection_name'];
  analytics_admin: [];
  mobile_sync_gateway: ['bucket_name'];
  sync_gateway_configurator: ['bucket_name', 'scope_name', 'collection_name'];
  sync_gateway_app: ['bucket_name', 'scope_name', 'collection_name'];
  sync_gateway_app_ro: ['bucket_name', 'scope_name', 'collection_name'];
  sync_gateway_replicator: ['bucket_name', 'scope_name', 'collection_name'];
  sync_gateway_dev_ops: [];
  external_stats_reader: [];
  eventing_manage_functions: ['bucket_name', 'scope_name'];
};

export type RoleName = keyof RoleScope;

export type ScopedRole = Pretty<
  {
    [key in RoleName]: {
      role: key;
    } & {
      [scope in RoleScope[key][number]]: string;
    };
  }[RoleName]
>;
