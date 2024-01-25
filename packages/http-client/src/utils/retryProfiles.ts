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

import { OperationOptions } from 'retry';

export function getStandardRetryProfile({ timeout }: { timeout: number }) {
  const delayBetweenCalls = 1000;
  const retries = Math.floor(timeout / delayBetweenCalls);
  return {
    factor: 1,
    minTimeout: delayBetweenCalls,
    retries,
  } satisfies OperationOptions;
}

export function getFastRetryProfile({ timeout }: { timeout: number }) {
  const delayBetweenCalls = 200;
  const retries = Math.floor(timeout / delayBetweenCalls);
  return {
    factor: 1,
    minTimeout: delayBetweenCalls,
    retries,
  } satisfies OperationOptions;
}
