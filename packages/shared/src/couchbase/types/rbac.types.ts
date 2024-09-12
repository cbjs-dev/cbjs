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

export type RoleScope = {
  admin: [];
  ro_admin: [];
  security_admin_local: [];
  security_admin_external: [];
  cluster_admin: [];
  eventing_admin: [];
  backup_admin: [];
  bucket_admin: ['bucket'];
  scope_admin: ['bucket', 'scope'];
  bucket_full_access: ['bucket'];
  views_admin: ['bucket'];
  views_reader: ['bucket'];
  replication_admin: [];
  data_reader: ['bucket', 'scope', 'collection'];
  data_writer: ['bucket', 'scope', 'collection'];
  data_dcp_reader: ['bucket', 'scope', 'collection'];
  data_backup: ['bucket'];
  data_monitoring: ['bucket', 'scope', 'collection'];
  fts_admin: ['bucket'];
  fts_searcher: ['bucket', 'scope', 'collection'];
  query_select: ['bucket', 'scope', 'collection'];
  query_update: ['bucket', 'scope', 'collection'];
  query_insert: ['bucket', 'scope', 'collection'];
  query_delete: ['bucket', 'scope', 'collection'];
  query_manage_index: ['bucket', 'scope', 'collection'];
  query_system_catalog: [];
  query_external_access: [];
  query_manage_global_functions: [];
  query_execute_global_functions: [];
  query_manage_functions: ['bucket', 'scope'];
  query_execute_functions: ['bucket', 'scope'];
  query_manage_global_external_functions: [];
  query_execute_global_external_functions: [];
  query_manage_external_functions: ['bucket', 'scope'];
  query_execute_external_functions: ['bucket', 'scope'];
  replication_target: ['bucket'];
  analytics_manager: ['bucket'];
  analytics_reader: [];
  analytics_select: ['bucket', 'scope', 'collection'];
  analytics_admin: [];
  mobile_sync_gateway: ['bucket'];
  sync_gateway_configurator: ['bucket', 'scope', 'collection'];
  sync_gateway_app: ['bucket', 'scope', 'collection'];
  sync_gateway_app_ro: ['bucket', 'scope', 'collection'];
  sync_gateway_replicator: ['bucket', 'scope', 'collection'];
  sync_gateway_dev_ops: [];
  external_stats_reader: [];
  eventing_manage_functions: ['bucket', 'scope'];
};

export type RoleName = keyof RoleScope;

export type ApiScopedRole = Pretty<
  {
    [key in RoleName]: {
      role: key;
    } & {
      [scope in `${RoleScope[key][number]}_name`]: string;
    };
  }[RoleName]
>;
