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
import type { EventingFunctionScope } from '@cbjsdev/shared';

import { CouchbaseHttpApiConfig } from '../../types';
import { createHttpError } from '../../utils/createHttpError';
import { requestChangeEventingFunctionStatus } from './requests/requestChangeEventingFunctionStatus';

export async function deployEventingFunction(
  params: Omit<CouchbaseHttpApiConfig, 'poolNodes'>,
  name: string,
  scope: EventingFunctionScope = { bucket: '*', scope: '*' }
) {
  const response = await requestChangeEventingFunctionStatus(
    params,
    name,
    scope,
    'deploy'
  );

  if (!response.ok) {
    throw await createHttpError('POST', response);
  }
}
