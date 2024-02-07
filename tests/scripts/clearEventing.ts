/*
 * Copyright (c) 2023-Present Jonathan MASSUCHETTI.
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
import {
  dropEventingFunction,
  getEventingFunctions,
  undeployEventingFunction,
} from '@cbjs/http-client';
import { getApiConfig } from '@cbjs/shared';

const apiConfig = getApiConfig();

const result = await getEventingFunctions(apiConfig);
for (const f of result) {
  if (f.settings.deployment_status === true) {
    await undeployEventingFunction(apiConfig, f.appname, f.function_scope);
  }

  await dropEventingFunction(apiConfig, f.appname, f.function_scope);
}
