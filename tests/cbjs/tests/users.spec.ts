/*
 * Copyright (c) 2023-Present Jonathan MASSUCHETTI <jonathan.massuchetti@dappit.fr>.
 * Copyright (c) 2013-Present Couchbase Inc.
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
import { describe } from 'vitest';

import { HttpErrorContext, UserNotFoundError } from '@cbjsdev/cbjs';
import { getConnectionParams, invariant } from '@cbjsdev/shared';
import { createCouchbaseTest, getRandomId } from '@cbjsdev/vitest';

import { ServerFeatures, serverSupportsFeatures } from '../utils/serverFeature.js';

describe
  .runIf(serverSupportsFeatures(ServerFeatures.UserManagement))
  .shuffle('users', { retry: 1 }, async () => {
    const test = await createCouchbaseTest();

    test('should successfully get all roles', async function ({
      expect,
      serverTestContext,
    }) {
      await expect(serverTestContext.cluster.users().getRoles()).resolves.toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: 'admin',
          }),
        ])
      );
    });

    test('should successfully create & drop a user', async function ({ useUser }) {
      await useUser();
    });

    test('should successfully get user', async function ({
      expect,
      serverTestContext,
      useUser,
    }) {
      const { username } = await useUser();
      await expect(serverTestContext.cluster.users().getUser(username)).resolves.toEqual(
        expect.objectContaining({
          username,
        })
      );
    });

    test('should throw a UserNotFoundError when getting a missing user', async function ({
      expect,
      serverTestContext,
    }) {
      expect.hasAssertions();

      try {
        await serverTestContext.cluster.users().getUser('missingUsername');
      } catch (err) {
        expect(err).toBeInstanceOf(UserNotFoundError);
        invariant(err instanceof UserNotFoundError);
        expect(err.context).toBeInstanceOf(HttpErrorContext);
      }
    });

    test('should successfully change current user password', async function ({
      expect,
      serverTestContext,
      useUser,
    }) {
      const { username, password } = await useUser();
      const newPassword = getRandomId();

      await expect(
        serverTestContext.cluster.users().upsertUser({
          username,
          password: newPassword,
          roles: ['admin'],
        })
      ).resolves.toBeUndefined();

      await expect(
        serverTestContext.newConnection({
          ...getConnectionParams(),
          credentials: {
            username,
            password: newPassword,
          },
        })
      ).resolves.toBeDefined();

      await expect(
        serverTestContext.newConnection({
          ...getConnectionParams(),
          credentials: {
            username,
            password,
          },
        })
      ).rejects.toThrowError();
    });

    test('should throw a UserNotFoundError when dropping a missing user', async function ({
      expect,
      serverTestContext,
    }) {
      expect.hasAssertions();

      try {
        await serverTestContext.cluster.users().dropUser('missingUsername');
      } catch (err) {
        expect(err).toBeInstanceOf(UserNotFoundError);
        invariant(err instanceof UserNotFoundError);
        expect(err.context).toBeInstanceOf(HttpErrorContext);
      }
    });
  });
