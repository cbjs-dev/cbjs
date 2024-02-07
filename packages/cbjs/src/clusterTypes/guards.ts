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
import { LookupInMacro, MutateInMacro } from '../sdspecs';

/**
 * The value is an instance of {@link LookupInMacro}.
 *
 * @param value Value to guard against.
 */
export function isLookupInMacro(value: unknown): value is LookupInMacro {
  return value instanceof LookupInMacro;
}

/**
 * The value is an instance of {@link MutateInMacro}.
 *
 * @param value Value to guard against.
 */
export function isMutateInMacro(value: unknown): value is MutateInMacro {
  return value instanceof MutateInMacro;
}

/**
 * The value is not an empty array.
 *
 * @param value Value to guard against.
 */
export function arrayIsNotEmpty<T>(value: ReadonlyArray<T>): value is [T, ...T[]] {
  return value.length > 0;
}
