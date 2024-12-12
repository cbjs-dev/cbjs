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

import {
  HttpErrorContext,
  InvalidArgumentError,
  Role,
  SdkScopedRole,
  UserNotFoundError,
} from '@cbjsdev/cbjs';
import { ServerFeatures, waitForUser } from '@cbjsdev/http-client';
import { getConnectionParams, getRandomId, invariant, waitFor } from '@cbjsdev/shared';
import { createCouchbaseTest } from '@cbjsdev/vitest';

import { serverSupportsFeatures } from '../utils/serverFeature.js';

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

    test('should successfully create a user with groups', async function ({
      serverTestContext,
      useUserGroup,
    }) {
      const groupName = await useUserGroup();
      await serverTestContext.cluster.users().upsertUser({
        username: getRandomId(),
        password: getRandomId(),
        roles: [
          new Role({
            name: 'data_reader',
            bucket: serverTestContext.bucket.name,
            scope: '*',
            collection: '*',
          }),
          new Role({
            name: 'data_writer',
            bucket: serverTestContext.bucket.name,
            scope: '*',
            collection: '*',
          }),
        ],
        groups: [groupName],
      });
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

    test('should successfully update a user', async function ({
      expect,
      serverTestContext,
      useUser,
    }) {
      const { username } = await useUser();
      const user = await serverTestContext.cluster.users().getUser(username);

      const role = new Role({
        name: 'ro_admin',
      });
      user.roles = [role];

      await serverTestContext.cluster.users().upsertUser(user);

      await waitFor(async () => {
        await expect(
          serverTestContext.cluster.users().getUser(username)
        ).resolves.toEqual(
          expect.objectContaining({
            username,
            roles: [
              {
                name: 'ro_admin',
              },
            ],
          })
        );
      });
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

    test('should successfully set roles to a user', async ({
      expect,
      apiConfig,
      serverTestContext,
    }) => {
      const username = 'cbjs_' + getRandomId();
      await expect(
        serverTestContext.cluster.users().upsertUser({
          username,
          password: getRandomId(),
          roles: [
            new Role({
              name: 'scope_admin',
              bucket: serverTestContext.bucket.name,
              scope: '*',
              collection: undefined,
            }),
            {
              name: 'fts_admin',
              bucket: serverTestContext.bucket.name,
            },
          ],
        })
      ).resolves.toBeUndefined();

      await waitForUser(apiConfig, username);

      await serverTestContext.cluster.users().dropUser(username);
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

      await waitFor(async () => {
        await expect(
          serverTestContext.newConnection({
            ...getConnectionParams(),
            credentials: {
              username,
              password: newPassword,
            },
          })
        ).resolves.toBeDefined();
      });

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

    test('should throw an InvalidArgumentError when upserting an external user with password', async ({
      expect,
      serverTestContext,
    }) => {
      await expect(
        serverTestContext.cluster.users().upsertUser(
          {
            username: getRandomId(),
            password: getRandomId(),
          },
          { domainName: 'external' }
        )
      ).rejects.toThrowError(InvalidArgumentError);
    });

    test('should throw an InvalidArgumentError when upserting a user with an invalid domain', async ({
      expect,
      serverTestContext,
    }) => {
      await expect(
        serverTestContext.cluster.users().upsertUser(
          {
            username: getRandomId(),
            password: getRandomId(),
          },
          { domainName: 'whatever' }
        )
      ).rejects.toThrowError(InvalidArgumentError);
    });

    test('should throw an InvalidArgumentError when getting a user from an invalid domain', async ({
      expect,
      useUser,
      serverTestContext,
    }) => {
      const { username } = await useUser();

      await expect(
        serverTestContext.cluster.users().getUser(username, { domainName: 'whatever' })
      ).rejects.toThrowError(InvalidArgumentError);
    });

    test('should throw an InvalidArgumentError when dropping a user from an invalid domain', async ({
      expect,
      useUser,
      serverTestContext,
    }) => {
      const { username } = await useUser();

      await expect(
        serverTestContext.cluster.users().dropUser(username, { domainName: 'whatever' })
      ).rejects.toThrowError(InvalidArgumentError);
    });

    test('should throw an InvalidArgumentError when getting all users from an invalid domain', async ({
      expect,
      useUser,
      serverTestContext,
    }) => {
      const { username } = await useUser();

      await expect(
        serverTestContext.cluster.users().dropUser(username, { domainName: 'whatever' })
      ).rejects.toThrowError(InvalidArgumentError);
    });

    test('should throw an InvalidArgumentError when upserting a user with invalid roles', async ({
      expect,
      useUser,
      serverTestContext,
    }) => {
      const { username } = await useUser();

      await expect(
        serverTestContext.cluster.users().upsertUser({
          username,
          // @ts-expect-error invalid role
          roles: [{ name: 'data_reader', bucket: 'not-a-bucket' }],
        })
      ).rejects.toThrowError(InvalidArgumentError);
    });
  });
