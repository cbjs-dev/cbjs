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
import { hasOwn } from '../../misc/utils/hasOwn.js';

/**
 * Every place the server may have put the body of the response it rejected an operation
 * with : the SDK exposes it through the error context and through the cpp error kept as
 * the cause, while the HTTP client inlines it in the error message.
 *
 * Internal : not part of the public API of the package.
 */
export function errorBodyCandidates(err: unknown): string[] {
  if (typeof err !== 'object' || err === null) return [];

  const candidates = [
    hasOwn(err, 'message') ? err.message : undefined,
    hasOwn(err, 'context') && hasOwn(err.context, 'response_body')
      ? err.context.response_body
      : undefined,
    hasOwn(err, 'cause') && hasOwn(err.cause, 'http_body')
      ? err.cause.http_body
      : undefined,
  ];

  return candidates.filter(
    (candidate): candidate is string => typeof candidate === 'string'
  );
}
