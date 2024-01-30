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

import { getPoolNodes, getViewDesignDocuments } from '../services';
import { CouchbaseHttpApiConfig } from '../types';
import { mapNodes } from '../utils/mapNodes';
import { waitOptionsModerate } from './options';
import { WaitForOptions } from './types';

export async function waitForViewDesignDocument(
  params: CouchbaseHttpApiConfig,
  bucketName: string,
  designDocumentName: string,
  options?: WaitForOptions
) {
  const resolvedOptions = {
    ...waitOptionsModerate,
    ...options,
  };

  const { expectMissing } = resolvedOptions;

  return retry(async () => {
    const poolNodes = await getPoolNodes(params);

    const requests = mapNodes(poolNodes, ({ hostname }) =>
      getViewDesignDocuments({ ...params, hostname }, bucketName)
    );

    const responses = await Promise.all(requests);
    const visible = responses.every((r) =>
      r.rows.find((r) => r.doc.meta.id === `_design/${designDocumentName}`)
    );

    if (!expectMissing && !visible) throw new Error('Design document is not visible yet');
    if (expectMissing && visible) throw new Error('Design document is still visible');
  }, resolvedOptions);
}
