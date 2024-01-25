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

import { z } from 'zod';

const zConnectionParams = z.object({
  connectionString: z.string({
    required_error: 'Missing env connection string (CONNECTION_STRING)',
  }),
  credentials: z.object({
    username: z.string({ required_error: 'Missing env username (USER)' }),
    password: z.string({ required_error: 'Missing env password (PASSWORD)' }),
  }),
});

export type ConnectionParams = z.output<typeof zConnectionParams>;

export function getConnectionParams(): ConnectionParams {
  const env = {
    connectionString: process.env.CONNECTION_STRING as string,
    credentials: {
      username: process.env.USER,
      password: process.env.PASSWORD,
    },
  };

  return zConnectionParams.parse(env);
}
