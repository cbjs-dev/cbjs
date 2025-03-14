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

/**
 * This file contains the type we expose to userland.
 */

/**
 * A string representing an hexadecimal number.
 */
export type StringHex = `0x${string}`;

/**
 * A string that only contains digits.
 */
export type StringDigits = `${number}`;

/**
 * A string that contains a timestamp in seconds.
 */
export type TimestampSeconds = `${number}`;

// prettier-ignore
export type IsTemplateString<T> =
  T extends string ?
    IsTemplateStringHead<T> extends true ? true : IsTemplateStringTail<T> :
  false
;

export type IsTemplateStringTail<T extends string> = `A${T}` extends T ? true : false;
export type IsTemplateStringHead<T extends string> = `${T}A` extends T ? true : false;
