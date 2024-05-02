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
import { CppConnection } from '@cbjsdev/cbjs/internal';

export const passthrough = [
  'connect',
  'shutdown',
  'httpNoop',
  'diagnostics',
  'analytics',
  'search',
  'documentView',
  'managementChangePassword',

  'managementGroupUpsert',
  'managementGroupGetAll',
  'managementGroupGet',
  'managementGroupDrop',

  'managementRoleGetAll',

  'managementUserUpsert',
  'managementUserGet',
  'managementUserGetAll',
  'managementUserDrop',

  'managementClusterDescribe',
  'managementClusterDeveloperPreviewEnable',
  'managementViewIndexDrop',
  'managementViewIndexGet',
  'managementViewIndexUpsert',
  'managementViewIndexGetAll',
  'managementFreeform',

  'managementEventingGetFunction',
  'managementEventingGetAllFunctions',
  'managementEventingGetStatus',
  'managementEventingUpsertFunction',
  'managementEventingDeployFunction',
  'managementEventingPauseFunction',
  'managementEventingResumeFunction',
  'managementEventingUndeployFunction',
  'managementEventingDropFunction',

  // Will do, when requested
  'managementBucketCreate',
  'managementBucketUpdate',
  'managementBucketDescribe',
  'managementBucketGet',
  'managementBucketFlush',
  'managementBucketDrop',
  'managementBucketGetAll',

  'managementScopeCreate',
  'managementScopeDrop',
  'managementScopeGetAll',

  'managementQueryIndexBuild',
  'managementQueryIndexCreate',
  'managementQueryIndexDrop',
  'managementQueryIndexBuildDeferred',
  'managementQueryIndexGetAll',
  'managementQueryIndexGetAllDeferred',

  'managementSearchGetStats',
  'managementSearchIndexUpsert',
  'managementSearchIndexGet',
  'managementSearchIndexGetAll',
  'managementSearchIndexDrop',
  'managementSearchIndexControlIngest',
  'managementSearchIndexControlPlanFreeze',
  'managementSearchIndexAnalyzeDocument',
  'managementSearchIndexGetStats',
  'managementSearchIndexGetDocumentsCount',
  'managementSearchIndexControlQuery',

  'managementCollectionCreate',
  'managementCollectionUpdate',
  'managementCollectionsManifestGet',
  'managementCollectionDrop',

  // Maybe one day

  'managementAnalyticsDataverseCreate',
  'managementAnalyticsDataverseDrop',
  'managementAnalyticsDatasetCreate',
  'managementAnalyticsDatasetDrop',
  'managementAnalyticsDatasetGetAll',
  'managementAnalyticsGetPendingMutations',
  'managementAnalyticsIndexCreate',
  'managementAnalyticsIndexDrop',
  'managementAnalyticsIndexGetAll',
  'managementAnalyticsLinkConnect',
  'managementAnalyticsLinkDisconnect',
  'managementAnalyticsLinkDrop',
  'managementAnalyticsLinkGetAll',
] as const satisfies readonly (keyof CppConnection)[];
