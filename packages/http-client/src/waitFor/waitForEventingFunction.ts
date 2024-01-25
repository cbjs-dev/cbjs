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

import { EventingFunctionStatusName } from '@cbjs/shared';
import promiseRetry from 'promise-retry';

import { getPoolNodes, getEventingFunctionStatus } from '../services';
import { CouchbaseApiConfig, WaitForOptions } from '../types';
import { mapNodes } from '../utils/mapNodes';
import { getFastRetryProfile } from '../utils/retryProfiles';

export async function waitForEventingFunction(
  params: CouchbaseApiConfig,
  functionName: string,
  status: Extract<EventingFunctionStatusName, 'deployed' | 'undeployed' | 'paused'>,
  options?: WaitForOptions
): Promise<void>;
export async function waitForEventingFunction(
  params: CouchbaseApiConfig,
  functionName: string,
  options?: WaitForOptions
): Promise<void>;
export async function waitForEventingFunction(
  params: CouchbaseApiConfig,
  functionName: string,
  expectedStatus?:
    | Extract<EventingFunctionStatusName, 'deployed' | 'undeployed' | 'paused'>
    | WaitForOptions,
  options: WaitForOptions = {}
): Promise<void> {
  if (typeof expectedStatus === 'object') {
    options = expectedStatus;
    expectedStatus = undefined;
  }
  const timeout = options.timeout || 30_000;
  const expectMissing = options.expectMissing || false;

  return promiseRetry(getFastRetryProfile({ timeout }), async (retry) => {
    const poolNodes = await getPoolNodes(params);

    const requests = mapNodes(poolNodes, 'eventing', ({ hostname }) =>
      getEventingFunctionStatus({ ...params, hostname })
    );

    const responses = await Promise.all(requests);
    const functionOnNodes = responses
      .map((r) => r.apps?.find((a) => a.name === functionName))
      .filter((r) => !!r);

    const functionVisibleOnAllNodes = functionOnNodes.length === responses.length;

    if (!functionVisibleOnAllNodes && !expectMissing) {
      retry('The function is not visible on all nodes yet');
    }

    if (functionOnNodes.length > 0 && expectMissing)
      retry('The function is still visible on some nodes');

    if (expectedStatus === undefined) return;

    const statusMatching = functionOnNodes.filter(
      (f) => f?.composite_status === expectedStatus
    );

    if (!expectMissing && statusMatching.length !== responses.length)
      retry(`The eventing function is not ${expectedStatus} on all nodes yet`);
    if (expectMissing && statusMatching.length > 0)
      retry(`The eventing function is still ${expectedStatus} on some nodes`);
  });
}
