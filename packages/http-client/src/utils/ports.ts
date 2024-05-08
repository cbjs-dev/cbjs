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

const unsecurePorts = {
  management: 8091,
  views: 8092,
  query: 8093,
  search: 8094,
  analytics: 8095,
  eventing: 8096,
  indexer: 9102,
};

const securePorts = {
  management: 18091,
  views: 18092,
  query: 18093,
  search: 18094,
  analytics: 18095,
  eventing: 18096,
  indexer: 19102,
};

export type PortService = keyof typeof unsecurePorts;

export function getPort(service: PortService, secure = false): number {
  if (secure) {
    return securePorts[service];
  }

  return unsecurePorts[service];
}
