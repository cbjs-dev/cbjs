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
import { AnalyticsEncryptionLevelName, OneOf } from '@cbjsdev/shared';

import { ApiAnalyticsLinkSharedProperties } from './ApiAnalyticsLink.js';

export type ApiAnalyticsCouchbaseAuthBasic = {
  /**
   * Used for basic authentication.
   */
  username: string;

  /**
   * Used for basic authentication.
   */
  password: string;
};

export type ApiAnalyticsCouchbaseAuthClientCertificate = {
  /**
   * Content of the root certificate.
   *
   * Used for certificate based authenticated.
   */
  certificate: string;

  /**
   * Content of the client certificate.
   *
   * Used for certificate based authenticated.
   */
  clientCertificate: string;

  /**
   * Content of the client key.
   *
   * Used for certificate based authenticated.
   */
  clientKey: string;
};

export type ApiAnalyticsCouchbaseAuth = OneOf<
  [ApiAnalyticsCouchbaseAuthBasic, ApiAnalyticsCouchbaseAuthClientCertificate]
>;

export type ApiAnalyticsCouchbaseRemoteLink = ApiAnalyticsCouchbaseAuth & {
  type: 'couchbase';
  hostname: string;
  encryption: AnalyticsEncryptionLevelName;
} & ApiAnalyticsLinkSharedProperties;
