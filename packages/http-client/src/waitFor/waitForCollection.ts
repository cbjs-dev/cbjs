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
import { retry } from 'ts-retry-promise';

import { getCollections, getPoolNodes } from '../services';
import { CouchbaseHttpApiConfig } from '../types';
import { ApiCollection } from '../types/Api/ApiCollection';
import { mapNodes } from '../utils/mapNodes';
import { waitOptionsModerate } from './options';
import { WaitForOptions } from './types';

export async function waitForCollection(
  params: CouchbaseHttpApiConfig,
  bucketName: string,
  scopeName: string,
  collectionName: string,
  options?: WaitForOptions
) {
  const resolvedOptions = {
    ...waitOptionsModerate,
    ...options,
  };

  const { expectMissing } = resolvedOptions;

  return await retry(async () => {
    const poolNodes = await getPoolNodes(params);

    const requests = mapNodes(poolNodes, ({ hostname }) =>
      getCollections({ ...params, hostname }, bucketName, scopeName).catch(
        () => [] as ApiCollection[]
      )
    );

    const responses = await Promise.all(requests);
    const visible = responses.every((collections) => {
      return collections.some((c) => c.name === collectionName);
    });

    if (!expectMissing && !visible) {
      throw new Error('Collection is not visible yet');
    }

    if (expectMissing && visible) {
      throw new Error('Collection is still visible');
    }
  }, resolvedOptions);
}
