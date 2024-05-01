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
import { Pretty } from '../utils/index.js';

// Credits https://github.com/Microsoft/TypeScript/issues/14094#issuecomment-373782604

type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };
type XOR<T, U> =
  T | U extends NonNullable<unknown> ? (Without<T, U> & U) | (Without<U, T> & T) : T | U;

// prettier-ignore
export type OneOf<T extends ReadonlyArray<unknown>> = Pretty<
  T extends readonly [infer Head] ?
    Head :
  T extends readonly [infer A, infer B, ...infer Rest extends unknown[]] ?
    OneOf<[XOR<A, B>, ...Rest]>:
  never
>;
