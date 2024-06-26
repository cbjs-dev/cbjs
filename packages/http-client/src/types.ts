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
import { CouchbaseApiConfig } from '@cbjsdev/shared';

import { ApiPool } from './types/Api/index.js';

export type CouchbaseHttpApiConfig = CouchbaseApiConfig & {
  /**
   * This property is used to cache the pool nodes when multiple API calls are chained.
   *
   * @internal
   */
  poolNodes?: ApiPool;

  /**
   * Client timeout in milliseconds.
   */
  timeout?: number;
};

export type URLSearchParamsConstructor = ConstructorParameters<typeof URLSearchParams>;
