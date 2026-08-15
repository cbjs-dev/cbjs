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
import { ApiNodeServices } from '../../types/Api/cluster/ApiNodeServices.js';
import { createHttpError } from '../../utils/createHttpError.js';
import { requestGetNodeServices } from './requests/requestGetNodeServices.js';

/**
 * Ports published by each node of the cluster, per service.
 *
 * This is how a service that doesn't run on the node you are connected to, or
 * that doesn't listen on its standard port, is reached.
 * See {@link extractNodeServiceAddresses} to turn the response into addresses.
 */
export async function getNodeServices(
  apiConfig: Omit<CouchbaseHttpApiConfig, 'poolNodes'>,
  poolName = 'default'
): Promise<ApiNodeServices> {
  const response = await requestGetNodeServices(apiConfig, poolName);

  if (response.status !== 200) {
    throw await createHttpError('GET', response);
  }

  return (await response.json()) as ApiNodeServices;
}
