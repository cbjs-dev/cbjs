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
import https from 'https';
import fetch, { RequestInit } from 'node-fetch';

import { CapellaCaCertPem } from '../constants.js';
import { getHttpClientLogger } from '../logger.js';
import { CouchbaseHttpApiConfig } from '../types.js';
import { getPort, PortService } from './ports.js';

/**
 *
 * @param apiConfig CouchbaseHttpApiConfig
 * @param pathname with a leading slash '/'.
 * @param portService
 * @param query ?pretty=1
 */
export async function apiGET(
  { hostname, credentials, secure, timeout, certificate }: CouchbaseHttpApiConfig,
  pathname: string,
  portService?: PortService,
  query?: Record<string, string> | URLSearchParams
) {
  const base64Credentials = Buffer.from(
    `${credentials.username}:${credentials.password}`
  ).toString('base64');

  const port = getPort(portService ?? 'management', secure);
  const protocol = secure ? 'https' : 'http';
  const queryString = query ? `?${new URLSearchParams(query).toString()}` : '';
  const url = `${protocol}://${hostname}:${port}${pathname}${queryString}`;

  getHttpClientLogger()?.trace(`GET ${url}`);

  const abortController = new AbortController();

  if (timeout) {
    setTimeout(() => abortController.abort('Client timeout'), timeout);
  }

  const request: RequestInit = {
    method: 'GET',
    signal: abortController.signal,
    headers: {
      Authorization: `Basic ${base64Credentials}`,
    },
  };

  if (protocol === 'https') {
    request.agent = new https.Agent({
      ca: certificate ?? CapellaCaCertPem,
    });
  }

  return await fetch(url, request);
}
