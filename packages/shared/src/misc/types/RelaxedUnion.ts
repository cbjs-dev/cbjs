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
import { Pretty, UnionToTuple } from '../utils';

type SoftIntersection<T, V> = Pretty<
  {
    [Key in keyof T & keyof V]: T[Key] | V[Key];
  } & {
    [Key in Exclude<keyof T, keyof V>]?: T[Key];
  } & {
    [Key in Exclude<keyof V, keyof T>]?: V[Key];
  }
>;

// prettier-ignore
export type RelaxedUnion<T> =
  UnionToTuple<T> extends infer UT extends ReadonlyArray<unknown> ?
    UT extends readonly [infer Head, ...infer Rest extends [unknown, ...unknown[]]] ?
       SoftIntersection<Head, RelaxedUnion<Rest[number]>> :
    UT[number] :
  NonNullable<unknown>
;
