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
import JSONBigint from 'json-bigint';

import { CouchbaseHttpApiConfig } from '../../types.js';
import { ApiIndexServiceStatus } from '../../types/Api/indexer/ApiIndexServiceStatus.js';
import { createHttpError } from '../../utils/createHttpError.js';
import { NodeServiceAddress } from '../../utils/extractNodeServiceAddresses.js';
import { getIndexServiceAddresses } from './getIndexServiceAddresses.js';
import { requestGetIndexServiceStatus } from './requests/requestGetIndexServiceStatus.js';

/**
 * `defnId` and `instId` are above `Number.MAX_SAFE_INTEGER`.
 */
const { parse: parseJson } = JSONBigint({ useNativeBigInt: true });

/**
 * Status of every index of the cluster, as reported by the index service itself.
 *
 * Prefer {@link getQueryIndexStatus} unless you need what only the index service
 * reports : the number of centroids an IVF vector index has been trained with
 * (`numCentroids`), the options it was created with (`with`) and whether it
 * indexes a vector (`isVectorIndex`).
 *
 * The index service API runs on its own port, on the nodes running that service
 * only, so the node to query is looked up first. It reports the whole cluster, so
 * any of them answers ; they are tried in turn until one does.
 *
 * On Capella, that port may not be published on the external network, in which
 * case this throws and the information is only reachable from within the
 * deployment. See {@link getIndexServiceAddresses}.
 */
export async function getIndexServiceStatus(
  apiConfig: Omit<CouchbaseHttpApiConfig, 'poolNodes'>,
  poolName = 'default'
): Promise<ApiIndexServiceStatus> {
  const addresses = await getIndexServiceAddresses(apiConfig, poolName);

  if (addresses.length === 0) {
    throw new Error(
      'No node of this cluster publishes the index service HTTP API on the network it has been reached from.'
    );
  }

  let lastError: unknown;

  for (const address of addresses) {
    try {
      return await getIndexServiceStatusFrom(apiConfig, address);
    } catch (err) {
      lastError = err;
    }
  }

  throw new Error(
    `Could not read the index status from any node running the index service : ${addresses
      .map(({ hostname, port }) => `${hostname}:${port}`)
      .join(', ')}`,
    { cause: lastError }
  );
}

async function getIndexServiceStatusFrom(
  apiConfig: Omit<CouchbaseHttpApiConfig, 'poolNodes'>,
  address: NodeServiceAddress
): Promise<ApiIndexServiceStatus> {
  const response = await requestGetIndexServiceStatus(apiConfig, address);

  if (response.status !== 200) {
    throw await createHttpError('GET', response);
  }

  return parseJson(await response.text()) as ApiIndexServiceStatus;
}
