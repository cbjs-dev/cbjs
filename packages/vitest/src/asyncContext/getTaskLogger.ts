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
import { getVitestLogger } from '../logger.js';
import { AsyncContextNotFoundError } from './AsyncContextNotFoundError.js';
import { getCurrentTaskAsyncContext } from './getCurrentTaskAsyncContext.js';

/**
 * Return the logger associated with the task context.
 * If not available, fallback to the generic test logger.
 */
export function getTaskLogger() {
  try {
    const { logger } = getCurrentTaskAsyncContext();
    return logger;
  } catch (error) {
    if (error instanceof AsyncContextNotFoundError) {
      return getVitestLogger();
    }

    throw error;
  }
}
