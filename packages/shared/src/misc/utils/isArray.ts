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
import { If, IsAny, Try } from './types';

type SelectArrayType<T> = If<IsAny<T>, any[], Try<T, ReadonlyArray<any>, unknown[]>>;

type ArrayType<T> = Extract<SelectArrayType<T>, T>;

export function isArray<T>(arg: T): arg is ArrayType<T> {
  return Array.isArray(arg);
}
