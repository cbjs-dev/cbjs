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
import { jsonToUrlSearchParams } from '@cbjsdev/shared';

import { CouchbaseHttpApiConfig } from '../../../types';
import { ApiAnalyticsLink } from '../../../types/Api';
import { apiPOST } from '../../../utils/apiPOST';
import { ANALYTICS_PORT } from '../../../utils/ports';

export async function requestAnalyticsCreateLink(
  apiConfig: CouchbaseHttpApiConfig,
  link: ApiAnalyticsLink
) {
  const { scope, dataverse, name, ...rest } = link as {
    scope: string;
    dataverse?: string;
    name: string;
  };

  const resolvedScope = scope ?? dataverse;
  const encodedScope = encodeURIComponent(resolvedScope);

  const body = jsonToUrlSearchParams({
    ...rest,
    name,
    scope: resolvedScope,
  });

  return await apiPOST(
    apiConfig,
    `/analytics/link/${encodedScope}/${name}`,
    body,
    ANALYTICS_PORT,
    undefined,
    {
      'Content-Type': 'application/x-www-form-urlencoded',
    }
  );
}
