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
import { ArrayElement, ArrayMap } from '../../couchbase';
import { hasOwn } from './hasOwn';

export function arrayMap<
  const T extends ReadonlyArray<object>,
  U extends keyof ArrayElement<T>,
>(arr: T, prop: U) {
  return arr.map((e) => {
    if (hasOwn(e, prop)) {
      return e[prop];
    }

    throw new Error(`Property ${prop.toString()} not found on an array element.`);
  }) as ArrayMap<T, U>;
}
