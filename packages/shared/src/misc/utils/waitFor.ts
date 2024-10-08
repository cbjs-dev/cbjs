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
import { sleep } from './sleep.js';

export type WaitForOptions = {
  /**
   * @default 10_000
   */
  timeout?: number;

  /**
   * Time to wait between two retries. Milliseconds.
   * @default 500
   */
  retryInterval?: number;
};

/**
 * Retry until the operation succeeds.
 * Throws the last error if the operation never succeeds.
 *
 * @returns the operation return value.
 * @example
 * await waitFor(async () => {
 *   const things = await getAll();
 *   expect(things).toHaveLength(2);
 * });
 */
export async function waitFor<T>(
  fn: () => T | Promise<T>,
  opts: WaitForOptions = {}
): Promise<T> {
  const defaultOpts = {
    timeout: 10_000,
    retryInterval: 500,
  };

  const localOpts = { ...defaultOpts, ...opts };

  const startTime = Date.now();
  let elapsedTime = 0;
  let lastError;

  while (elapsedTime < localOpts.timeout) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      elapsedTime = Date.now() - startTime;
      if (elapsedTime > localOpts.timeout) break;

      await sleep(localOpts.retryInterval);
      elapsedTime = Date.now() - startTime;
    }
  }

  throw lastError;
}
