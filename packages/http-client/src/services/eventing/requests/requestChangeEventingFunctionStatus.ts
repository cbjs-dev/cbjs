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
import type { EventingFunctionScope } from '@cbjs/cbjs';
import type { CouchbaseApiConfig } from '../../../types';
import { apiPOST } from '../../../utils/apiPOST';
import { EVENTING_PORT } from '../../../utils/ports';

export async function requestChangeEventingFunctionStatus(
  apiParams: Omit<CouchbaseApiConfig, 'poolNodes'>,
  name: string,
  scope: EventingFunctionScope = { bucket: '*', scope: '*' },
  status: 'deploy' | 'undeploy' | 'pause' | 'resume'
) {
  if (name === '') throw new Error('A function name must be provided');

  return apiPOST(
    apiParams,
    `/api/v1/functions/${name}/${status}`,
    JSON.stringify({
      bucket: scope.bucket,
      scope: scope.scope,
    }),
    EVENTING_PORT
  );
}
