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
import { ApiAnalyticsLinkSharedProperties } from './ApiAnalyticsLink.js';

export type ApiAnalyticsAzureAuthSharedKey = {
  /**
   * Account name.
   * Used for Azure Active Directory with client certificate authentication.
   */
  accountName: string;

  /**
   * Account key for shared key authentication.
   */
  accountKey: string;
};

export type ApiAnalyticsAzureAuthClientSecret = {
  /**
   * The client ID for the registered application.
   *
   * Used for Azure Active Directory with client secret authentication.
   */
  clientId: string;

  /**
   * The client secret for the registered application.
   *
   * Used for Azure Active Directory with client secret authentication.
   */
  clientSecret: string;

  /**
   * The tenant ID where the registered application is created.
   *
   * Used for Azure Active Directory with client secret authentication.
   */
  tenantId?: string;
};

export type ApiAnalyticsAzureAuthClientCertificate = {
  /**
   * The client ID for the registered application.
   *
   * Used for Azure Active Directory with client certificate authentication.
   */
  clientId: string;

  /**
   * The client certificate.
   *
   * Used for Azure Active Directory with client certificate authentication.
   */
  clientCertificate: string;

  /**
   * The client certificate password for the registered application, if the client certificate is password-protected.
   *
   * Used for Azure Active Directory with client certificate authentication.
   */
  clientCertificatePassword?: string;

  /**
   * The tenant ID where the registered application is created.
   *
   * Used for Azure Active Directory with client certificate authentication.
   */
  tenantId?: string;
};

export type ApiAnalyticsAzureAuthSharedAccessSignature = {
  /**
   * Used for Azure shared access signature.
   */
  sharedAccessSignature: string;
};

export type ApiAnalyticsAzureAuthManagedIdentity = {
  /**
   * Used for managed identity authentication.
   *
   * Only available if the application is running on an Azure instance, e.g. an Azure virtual machine.
   */
  managedIdentityId: string;
};

export type ApiAnalyticsAzureAuthenticationConfig =
  | ApiAnalyticsAzureAuthSharedKey
  | ApiAnalyticsAzureAuthClientCertificate
  | ApiAnalyticsAzureAuthClientSecret
  | ApiAnalyticsAzureAuthSharedAccessSignature
  | ApiAnalyticsAzureAuthManagedIdentity;

export type ApiAnalyticsAzureRemoteLink = {
  type: 'azureblob';
  endpoint?: string;
} & ApiAnalyticsLinkSharedProperties &
  ApiAnalyticsAzureAuthenticationConfig;
