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
import { invariant } from '../../misc';

export type ConnectionParams = {
  connectionString: string;
  credentials: {
    username: string;
    password: string;
  };
};

export function getConnectionParams(): ConnectionParams {
  const env = {
    connectionString: process.env.CB_CONNECTION_STRING,
    credentials: {
      username: process.env.CB_USER,
      password: process.env.CB_PASSWORD,
    },
  };

  invariant(env.connectionString, 'Missing env connection string (CB_CONNECTION_STRING)');
  invariant(env.credentials.username, 'Missing env username (CB_USER)');
  invariant(env.credentials.password, 'Missing env password (CB_PASSWORD)');

  return env as ConnectionParams;
}
