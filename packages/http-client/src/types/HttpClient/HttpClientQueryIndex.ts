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
export type HttpClientQueryIndex = (
  | {
      bucketName: string;
      scopeName: undefined;
      collectionName: undefined;
    }
  | {
      bucketName: string;
      scopeName: string;
      collectionName: string;
    }
) &
  (
    | {
        isPrimary: true;
        fields: [];
      }
    | {
        isPrimary: false;
        fields: [string, ...string[]];
      }
  ) & {
    id: string;
    name: string;
    node: string;
    namespace: string;
    numReplicas: number;
    state: 'online' | 'deferred' | (string & NonNullable<unknown>);
    using: 'gsi' | (string & NonNullable<unknown>);
  };
