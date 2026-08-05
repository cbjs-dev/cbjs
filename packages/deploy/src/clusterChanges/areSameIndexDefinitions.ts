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
import { areSameIndexKeys } from './areSameIndexKeys.js';

export type QueryIndexDefinition = {
  keys: string[];
  where?: string;
};

/**
 * Compare two index definitions textually: keys and `WHERE` predicate.
 *
 * The comparison is purely textual, modulo path quoting and key attribute order.
 * The server re-prints expressions from its own AST, so a definition read from the
 * cluster only compares equal to a declared one when the latter has been rewritten
 * into the server-canonical form — see `canonicalizeIndexConfigs`.
 */
export function areSameIndexDefinitions(
  a: QueryIndexDefinition,
  b: QueryIndexDefinition
) {
  return (
    areSameIndexKeys(a.keys, b.keys) &&
    normalizeWhereClause(a.where) === normalizeWhereClause(b.where)
  );
}

/**
 * An absent predicate and an empty one are the same thing.
 */
export function normalizeWhereClause(where: string | undefined) {
  return where === '' ? undefined : where;
}
