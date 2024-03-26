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
import { ParserRuleContext } from 'antlr4';

import {
  C_exprContext,
  Keyspace_nameContext,
  n1qlListener,
  Namespace_nameContext,
  Namespace_termContext,
  Path_partContext,
  Permitted_identifiersContext,
  Simple_from_termContext,
} from '@cbjsdev/n1ql-parser';
import { invariant } from '@cbjsdev/shared';

type FoundKeyspace = {
  namespace: string | undefined;
  keyspaceParts: [string] | [string, string] | [string, string, string];
};

export class N1qlListener extends n1qlListener {
  private readonly consumedContexts = new Set<ParserRuleContext>();
  private readonly keyspaces: FoundKeyspace[] = [];

  getKeyspaces() {
    return this.keyspaces;
  }

  // This handle the case where an alias has been used
  override exitSimple_from_term = (ctx: Simple_from_termContext) => {
    invariant(ctx.children);
    // const containsIdentifier = ctx.children.children.some(c => c instanceof IdentContext);
    const firstChild = ctx.getChild(0);
    invariant(firstChild instanceof ParserRuleContext);

    const grandChild = firstChild.getChild(0);
    invariant(grandChild instanceof ParserRuleContext);

    if (
      firstChild.getChild(0) instanceof C_exprContext &&
      !(grandChild.getChild(0) instanceof Permitted_identifiersContext)
    )
      return;

    if (ctx.children && ctx.children.length > 1) {
      this.keyspaces.push({
        namespace: undefined,
        keyspaceParts: ctx.getChild(0).getText().split('.'),
      } as FoundKeyspace);
    }
  };

  getKeyspaceFromChildren = (ctx: ParserRuleContext) => {
    invariant(ctx.children);

    let namespace: string | undefined = undefined;
    const keyspaceParts: string[] = [];

    for (const child of ctx.children) {
      if (
        child instanceof Namespace_nameContext ||
        child instanceof Namespace_termContext
      ) {
        const childText = child.getText();
        namespace = childText.substring(0, childText.length - 1);
        continue;
      }

      if (child instanceof Path_partContext || child instanceof Keyspace_nameContext) {
        keyspaceParts.push(child.getText());
      }
    }

    return {
      namespace,
      keyspaceParts,
    } as FoundKeyspace;
  };

  // path_part || keyspace_name => filter namespace_name || path_part || keyspace_name
  override exitPath_part = (ctx: Path_partContext) => {
    invariant(ctx.parentCtx);
    invariant(ctx.parentCtx.children);

    if (this.consumedContexts.has(ctx.parentCtx)) return;
    this.consumedContexts.add(ctx.parentCtx);

    this.keyspaces.push(this.getKeyspaceFromChildren(ctx.parentCtx));
  };

  override exitKeyspace_name = (ctx: Keyspace_nameContext) => {
    invariant(ctx.parentCtx);
    invariant(ctx.parentCtx.children);

    if (this.consumedContexts.has(ctx.parentCtx)) return;
    this.consumedContexts.add(ctx.parentCtx);

    this.keyspaces.push(this.getKeyspaceFromChildren(ctx.parentCtx));
  };
}
