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
import type { Task } from 'vitest';

import type { CouchbaseLogger } from '@cbjsdev/shared';

import type { KeyspaceIsolationRealm } from '../keyspaceIsolation/KeyspaceIsolationRealm.js';
import type {
  KeyspaceIsolationLevel,
  KeyspaceIsolationScope,
} from '../keyspaceIsolation/types.js';

export type CbjsContextKeyspaceIsolation = {
  keyspaceIsolationScope: KeyspaceIsolationScope;
  keyspaceIsolationLevel: KeyspaceIsolationLevel;
  keyspaceIsolationRealm: KeyspaceIsolationRealm | null;
};

export type CbjsTaskContextData = {
  logger?: CouchbaseLogger;
  asyncId: number;
  taskId: string;
  task: Task;
} & CbjsContextKeyspaceIsolation;
