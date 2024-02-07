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
import { z } from 'zod';

export const zRoleName = z.enum([
  'admin',
  'ro_admin',
  'security_admin_local',
  'security_admin_external',
  'cluster_admin',
  'eventing_admin',
  'backup_admin',
  'external_stats_reader',
  'query_system_catalog',
  'query_external_access',
  'query_manage_global_functions',
  'query_execute_global_functions',
  'query_manage_global_external_functions',
  'query_execute_global_external_functions',
  'analytics_reader',
  'analytics_admin',
  'replication_admin',
  'sync_gateway_dev_ops',
]);

export const zApiUser = z.object({
  id: z.string(),
  domain: z.string(),
  roles: z.array(
    z.object({
      role: zRoleName,
      origins: z
        .array(
          z.object({
            type: z.string(),
            name: z.string().optional(),
          })
        )
        .optional(),
      bucket_name: z.string().optional(),
      scope_name: z.string().optional(),
      collection_name: z.string().optional(),
    })
  ),
  groups: z.array(z.string()),
  external_groups: z.array(z.string()),
  name: z.literal(''),
  uuid: z.string(),

  password_change_date: z.string().datetime(),
});
