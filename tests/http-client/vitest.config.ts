/*
 * Copyright (c) 2024-Present Jonathan MASSUCHETTI.
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
import { defineProject, mergeConfig } from 'vitest/config';

import sharedProjectConfig from '../../vitest.shared.projects';

export default mergeConfig(
  sharedProjectConfig,
  defineProject({
    test: {
      name: 'project:@cbjs/http-client',
      pool: 'forks',
      minWorkers: 1,
      maxWorkers: 1,
    },
  })
);
