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

type HasOwn<T, K extends PropertyKey> =
  [Extract<T, { [key in K]: unknown }>] extends [never] ?
    T & Record<K, unknown> :
  Extract<T, { [key in K]: unknown }>
;

export function hasOwn<T, K extends PropertyKey>(
  obj: T,
  prop: K
): obj is HasOwn<T, K> {
  if (typeof obj !== 'object' || obj === null) return false;
  return Object.hasOwn(obj, prop);
}
