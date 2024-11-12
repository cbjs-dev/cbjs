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
import type { IsNever } from '../../../misc/index.js';

/**
 * Return the type argument wrapped into a tuple.
 * Used in order to access the original type within a distributed condition.
 *
 * @example
 * SaveIdentity<T> extends [infer Self] ?
 *   T extends unknown ?
 *     // `T` is distributed, `Self` is not
 *   never :
 * never
 */
export type SaveIdentity<T> = [T];
/**
 * Return a union of the required keys of the type argument.
 */
export type RequiredKeys<T> = Extract<
  {
    [K in keyof T]-?: NonNullable<unknown> extends Pick<T, K> ? never : K;
  }[keyof T],
  keyof T
>;

/**
 * Return a union of the optional keys of the type argument.
 */
export type OptionalKeys<T> =
  // eslint-disable-next-line @typescript-eslint/ban-types
  {} extends Record<keyof T, unknown>
    ? keyof T
    : Exclude<
        {
          [Key in keyof T]: T extends Record<Key, T[Key]> ? never : Key;
        }[keyof T],
        undefined
      >;

// prettier-ignore
export type OmitNeverValues<T> = {
  [K in keyof T as IsNever<T[K]> extends true ? never : K]: T[K]
}
;
