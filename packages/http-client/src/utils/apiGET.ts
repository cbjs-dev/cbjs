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

import { getHttpClientLogger } from '../logger';
import { CouchbaseApiConfig, URLSearchParamsConstructor } from '../types';
import { MANAGEMENT_PORT } from './ports';

/**
 *
 * @param hostname i.e. localhost
 * @param credentials used for authentication
 * @param secure use TLS
 * @param pathname with a leading slash '/'.
 * @param port duh
 * @param query ?pretty=1
 */
export async function apiGET(
  { hostname, credentials, secure }: CouchbaseApiConfig,
  pathname: string,
  port?: number,
  query?: URLSearchParamsConstructor
) {
  const base64Credentials = Buffer.from(
    `${credentials.username}:${credentials.password}`
  ).toString('base64');

  port ??= MANAGEMENT_PORT;
  const protocol = secure ? 'https' : 'http';
  const queryString = query ? `?${new URLSearchParams(query).toString()}` : '';
  const url = `${protocol}://${hostname}:${port}${pathname}${queryString}`;

  getHttpClientLogger()?.trace(`GET ${url}`);

  return fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Basic ${base64Credentials}`,
    },
  });
}
