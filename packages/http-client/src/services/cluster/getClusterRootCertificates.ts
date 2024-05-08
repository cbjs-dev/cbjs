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
import { CouchbaseHttpApiConfig } from '../../types.js';
import { requestGetRootCertificates } from './requests/requestGetRootCertificates.js';

export async function getClusterRootCertificates(apiConfig: CouchbaseHttpApiConfig) {
  const response = await requestGetRootCertificates(apiConfig);
  return (await response.json()) as ApiCertificate[];
}

export type ApiCertificate = {
  id: number;
  /**
   * Despite its name, it's an ISO string.
   */
  loadTimestamp: string;
  subject: string;
  /**
   * ISO string.
   */
  notBefore: string;
  /**
   * ISO string.
   */
  notAfter: string;
  type: 'generated' | (string & NonNullable<unknown>);

  /**
   * Certificate itself.
   */
  pem: string;
  warnings: Array<{
    name: string;
    message: string;
    severity: number;
    severityName: 'minimal' | (string & NonNullable<unknown>);
  }>;
  nodes: [string, ...string[]];
  client_cert_nodes: [string, ...string[]];
};
