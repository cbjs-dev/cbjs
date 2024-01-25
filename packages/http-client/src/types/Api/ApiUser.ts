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

import { RoleName } from '@cbjs/shared';

export type ApiUser = {
  "id": string,
  "domain": "local" | (string & NonNullable<unknown>),
  "roles": Array<
    {
      "role": RoleName,
      "origins": Array<{
        type: string;
        name?: string;
      }>
    }
  >,
  "groups": string[],
  "external_groups": string[],
  "name": "",
  "uuid": string,

  /**
   * Date string ISO
   *
   * @example 2024-01-16T20:09:52.000Z
   */
  "password_change_date": string;
}