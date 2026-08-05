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
import { Keyspace } from '@cbjsdev/shared';

import { CouchbaseHttpApiConfig } from '../../types.js';
import {
  buildCreateQueryIndexStatement,
  CreateQueryIndexStatementConfig,
} from './buildCreateQueryIndexStatement.js';
import { executeStatement } from './executeStatement.js';

/**
 * An index key within an `EXPLAIN CREATE INDEX` plan.
 * The attributes are absent when they don't apply.
 */
type ExplainCreateIndexPlanKey =
  | string
  | {
      expr: string;
      desc?: boolean;
      missing?: boolean;
      vector?: boolean;
    };

type ExplainCreateIndexResult = {
  plan: {
    '#operator': 'CreateIndex';
    'keys': ExplainCreateIndexPlanKey[];
    'where'?: string;
  };
  text: string;
};

export type CanonicalQueryIndexDefinition = {
  /**
   * The index keys as the server prints them, in the same form as
   * `system:indexes.index_key`, e.g. `` '(`body`.`email`) DESC' ``.
   */
  keys: string[];
  /**
   * The partial-index predicate as the server prints it, in the same form as
   * `system:indexes.condition`. Absent when the index has no predicate.
   */
  where?: string;
};

/**
 * Ask the query service to parse and re-print an index definition, without executing it.
 *
 * `EXPLAIN` stops at the planner: nothing is sent to the indexer and no index is created.
 * The returned keys and predicate are canonical: the server prints them from its own AST,
 * in the exact form `system:indexes` would report for an index created with this
 * definition. Two definitions are therefore semantically identical if and only if their
 * canonical forms are equal.
 */
export async function explainCreateQueryIndex(
  params: CouchbaseHttpApiConfig,
  indexName: string,
  keyspace: Keyspace,
  config: CreateQueryIndexStatementConfig
): Promise<CanonicalQueryIndexDefinition> {
  const statement = buildCreateQueryIndexStatement(indexName, keyspace, config);
  const body = await executeStatement<[ExplainCreateIndexResult]>(
    params,
    `EXPLAIN ${statement}`
  );

  const plan = body.results[0]?.plan;

  if (!plan || !Array.isArray(plan.keys)) {
    throw new Error(`Unexpected EXPLAIN CREATE INDEX response for index "${indexName}".`);
  }

  const definition: CanonicalQueryIndexDefinition = {
    keys: plan.keys.map(toIndexKeyString),
  };

  if (plan.where) {
    definition.where = plan.where;
  }

  return definition;
}

/**
 * Print a plan key the way `system:indexes.index_key` reports it.
 */
function toIndexKeyString(key: ExplainCreateIndexPlanKey): string {
  if (typeof key === 'string') {
    return key;
  }

  let str = key.expr;

  if (key.vector) {
    str += ' VECTOR';
  }

  if (key.desc) {
    str += ' DESC';
  }

  if (key.missing) {
    str += ' INCLUDE MISSING';
  }

  return str;
}
