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
import { OneOf } from '@cbjsdev/shared';

import { ApiAnalyticsAzureRemoteLink } from './ApiAnalyticsAzureRemoteLink.js';
import { ApiAnalyticsCouchbaseRemoteLink } from './ApiAnalyticsCouchbaseRemoteLink.js';
import { ApiAnalyticsGoogleStorageRemoteLink } from './ApiAnalyticsGoogleStorageRemoteLink.js';
import { ApiAnalyticsS3RemoteLink } from './ApiAnalyticsS3RemoteLink.js';

export type ApiAnalyticsLinkSharedProperties = {
  /**
   * The scope name may contain one or two identifiers, separated by a slash (/).
   */
  scope: string;

  /**
   * Arbitrary name for the link.
   */
  name: string;
};

export type ApiAnalyticsLink = OneOf<
  [
    // ApiAnalyticsCouchbaseRemoteLink,
    ApiAnalyticsS3RemoteLink,
    ApiAnalyticsAzureRemoteLink,
    ApiAnalyticsGoogleStorageRemoteLink,
  ]
>;
