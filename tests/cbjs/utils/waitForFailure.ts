/*
 * Copyright (c) 2023-Present Jonathan MASSUCHETTI <jonathan.massuchetti@dappit.fr>.
 * Copyright (c) 2013-Present Couchbase Inc.
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
import { sleep } from '@cbjs/shared';

type WaitForOptions = {
  timeout?: number;
  retryInterval?: number;
};

/**
 * Retry until the operation fails.
 * To avoid unnecessary mind gym, {@link waitForFailure} throws once the operation fails.
 *
 * @example
 * expect(waitForFailure(async () => {
 *   await H.co.get(testKeyOpts)
 * })).rejects.toThrow();
 */
export async function waitForFailure(
  fn: () => unknown,
  opts: WaitForOptions = {}
): Promise<void> {
  const defaultOpts = {
    timeout: 10_000,
    retryInterval: 500,
  };

  const localOpts = { ...defaultOpts, ...opts };

  const startTime = Date.now();
  let elapsedTime = 0;

  while (elapsedTime < localOpts.timeout) {
    await fn();
    // The operation is expected to fail, if not, we execute the operation again
    elapsedTime = Date.now() - startTime;
    if (elapsedTime > localOpts.timeout) break;

    await sleep(localOpts.retryInterval);
    elapsedTime = Date.now() - startTime;
  }
}
