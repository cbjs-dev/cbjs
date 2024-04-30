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
import { serverTestContexts } from './context.js';
import { flushLogger, getTestLogger } from './logger.js';

const testCleanupHooks: Array<{ description: string; action: () => Promise<void> }> = [];
const contextCleanupHooks: Array<{ description: string; action: () => Promise<void> }> =
  [];

export function registerTestCleanupAction(
  description: string,
  action: () => Promise<void>
) {
  getTestLogger()?.debug(`Register test cleanup action: ${description}`);
  testCleanupHooks.push({
    description,
    action,
  });
}

export function registerContextCleanupAction(
  description: string,
  action: () => Promise<void>
) {
  getTestLogger()?.debug(`Register context cleanup action: ${description}`);
  contextCleanupHooks.push({
    description,
    action,
  });
}

export async function cleanupCouchbaseAfterEach() {
  const logger = getTestLogger();
  logger?.debug(`Cleanup begins (${testCleanupHooks.length} actions)`);

  for (const hook of testCleanupHooks.reverse()) {
    try {
      logger?.trace(`Cleanup test action started: ${hook.description}`);
      await hook.action();
      logger?.trace(`Cleanup test action completed: ${hook.description}`);
    } catch (err) {
      logger?.error(`Cleanup test action failed: ${hook.description} threw: ${err}`);
    }
  }

  testCleanupHooks.length = 0;
}

export async function cleanupCouchbaseAfterAll() {
  const logger = getTestLogger();

  for (const hook of contextCleanupHooks.reverse()) {
    try {
      logger?.trace(`Cleanup context action started: ${hook.description}`);
      await hook.action();
      logger?.trace(`Cleanup context action completed: ${hook.description}`);
    } catch (err) {
      logger?.error(`Cleanup context action failed: ${hook.description} threw: ${err}`);
    }
  }

  contextCleanupHooks.length = 0;

  logger?.debug('awaiting all contexts to setup so we can cleanup gracefully.');
  await Promise.allSettled(
    serverTestContexts.map(async (stc) => {
      await stc.start();
      await stc.cleanup();
    })
  );

  logger?.debug('cleanup is done');

  await flushLogger();
}
