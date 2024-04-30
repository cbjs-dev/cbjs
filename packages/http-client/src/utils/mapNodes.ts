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
import { ServiceName } from '@cbjsdev/shared';

import { ApiNode } from '../types/Api/cluster/ApiNode.js';
import { ApiPoolNodes } from '../types/Api/cluster/ApiPoolNodes.js';
import { extractNodeHostnames } from './extractNodeHostnames.js';

type NodeMapArguments = {
  hostname: string;
};

type MapNodesCallback<T> = (args: NodeMapArguments) => T;

export function mapNodes<T>(
  poolNodes: ApiPoolNodes,
  service: ServiceName,
  fn: MapNodesCallback<T>
): T[];
export function mapNodes<T>(poolNodes: ApiPoolNodes, fn: MapNodesCallback<T>): T[];
export function mapNodes<T>(
  poolNodes: ApiPoolNodes,
  ...args: [ServiceName, MapNodesCallback<T>] | [MapNodesCallback<T>]
): T[] {
  let nodes: ApiNode[] = poolNodes.nodes;
  const fn = args[args.length - 1] as MapNodesCallback<T>;

  if (args.length == 2) {
    const [serviceName] = args;
    nodes = poolNodes.nodes.filter((n) => n.services.includes(serviceName));
  }

  const nodeHostnames = extractNodeHostnames(nodes);
  return nodeHostnames.map((hostname) => fn({ hostname }));
}
