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

import { EventingFunctionStatusName } from '@cbjsdev/shared';

import { getEventingFunctionStatus, getPoolNodes } from '../services';
import { CouchbaseHttpApiConfig } from '../types';
import { mapNodes } from '../utils/mapNodes';
import { waitOptionsModerate } from './options';
import { WaitForOptions } from './types';

type ExpectableStatus = Extract<
  EventingFunctionStatusName,
  'deployed' | 'undeployed' | 'paused'
>;

export async function waitForEventingFunction(
  params: CouchbaseHttpApiConfig,
  functionName: string,
  options?: WaitForOptions
): Promise<void>;

export async function waitForEventingFunction(
  params: CouchbaseHttpApiConfig,
  functionName: string,
  status: ExpectableStatus,
  options?: WaitForOptions
): Promise<void>;

export async function waitForEventingFunction(
  params: CouchbaseHttpApiConfig,
  functionName: string,
  ...optionalArgs: [ExpectableStatus, WaitForOptions?] | [WaitForOptions?]
): Promise<void> {
  const resolvedOptionalArgs = {
    expectedStatus: undefined as ExpectableStatus | undefined,
    options: {} as WaitForOptions,
  };

  if (optionalArgs.length === 2) {
    resolvedOptionalArgs.expectedStatus = optionalArgs[0];
    resolvedOptionalArgs.options = optionalArgs[1] ?? {};
  }

  if (optionalArgs.length === 1 && typeof optionalArgs[0] === 'string') {
    resolvedOptionalArgs.expectedStatus = optionalArgs[0];
  }

  if (optionalArgs.length === 1 && typeof optionalArgs[0] === 'object') {
    resolvedOptionalArgs.options = optionalArgs[0];
  }

  const resolvedOptions = {
    ...waitOptionsModerate,
    ...resolvedOptionalArgs.options,
  };

  const { expectMissing } = resolvedOptions;
  const { expectedStatus } = resolvedOptionalArgs;

  return await retry(async () => {
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
      throw new Error('The function is not visible on all nodes yet');
    }

    if (functionOnNodes.length > 0 && expectMissing)
      throw new Error('The function is still visible on some nodes');

    if (expectedStatus === undefined) return;

    const statusMatching = functionOnNodes.filter(
      (f) => f?.composite_status === expectedStatus
    );

    if (!expectMissing && statusMatching.length !== responses.length)
      throw new Error(`The eventing function is not ${expectedStatus} on all nodes yet`);
    if (expectMissing && statusMatching.length > 0)
      throw new Error(`The eventing function is still ${expectedStatus} on some nodes`);
  }, resolvedOptions);
}
