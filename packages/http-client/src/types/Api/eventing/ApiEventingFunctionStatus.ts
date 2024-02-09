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
import { EventingFunctionStatusName } from '@cbjs/shared';

type FunctionStatusDescription = {
  composite_status: EventingFunctionStatusName;
  name: string;
  function_scope: {
    bucket: string;
    scope: string;
  };
  num_bootstrapping_nodes: number;
  num_deployed_nodes: number;
  deployment_status: boolean;
  processing_status: boolean;
  redeploy_required: boolean;
};

export type ApiEventingFunctionStatus = {
  apps: FunctionStatusDescription[];
  num_eventing_nodes: number;
};
