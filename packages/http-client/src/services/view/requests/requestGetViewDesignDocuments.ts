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
import 'node-fetch';

import { CouchbaseHttpApiConfig } from '../../../types.js';
import { apiGET } from '../../../utils/apiGET.js';
import { pathname } from '../../../utils/pathname.js';
import { getPool } from '../../cluster/index.js';

export async function requestGetViewDesignDocuments(
  params: CouchbaseHttpApiConfig,
  bucketName: string
) {
  const poolNodes = params.poolNodes ?? (await getPool(params));

  return await apiGET(
    { ...params },
    `${pathname(poolNodes.buckets.uri)}/${bucketName}/ddocs`,
    'management'
  );
}
