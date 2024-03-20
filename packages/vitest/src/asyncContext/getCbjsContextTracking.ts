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
import { CbjsAsyncContextData } from './CbjsAsyncContextData';

export function getCbjsContextTracking() {
  if (global.cbjsContextTracking !== undefined) {
    return global.cbjsContextTracking;
  }

  global.cbjsContextTracking = {
    trackingEnabled: false,
    parentMap: new Map<number, number>(),
    parentReversedMap: new Map<number, number[]>(),
    taskAsyncIdMap: new Map<string, number>(),
    taskAsyncIdReversedMap: new Map<number, string>(),
    contextMap: new Map<number, CbjsAsyncContextData>(),
  };

  return global.cbjsContextTracking;
}
