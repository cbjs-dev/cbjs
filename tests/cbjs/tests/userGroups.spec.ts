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

import { GroupNotFoundError, HttpErrorContext } from '@cbjsdev/cbjs';
import { invariant } from '@cbjsdev/shared';
import { createCouchbaseTest } from '@cbjsdev/vitest';

import { ServerFeatures, serverSupportsFeatures } from '../utils/serverFeature';

describe
  .runIf(serverSupportsFeatures(ServerFeatures.UserGroupManagement))
  .shuffle('userGroups', async () => {
    const test = await createCouchbaseTest();

    test('should successfully upsert & drop a user group', async function ({
      useUserGroup,
    }) {
      await useUserGroup();
    });

    test('should successfully get a group', async function ({
      expect,
      serverTestContext,
      useUserGroup,
    }) {
      const groupName = await useUserGroup({
        roles: ['admin'],
      });
      await expect(serverTestContext.c.users().getGroup(groupName)).resolves.toEqual(
        expect.objectContaining({
          name: groupName,
          roles: expect.arrayContaining([
            expect.objectContaining({
              name: 'admin',
            }),
          ]),
        })
      );
    });

    test('should throw a GroupNotFoundError when getting a missing group', async function ({
      expect,
      serverTestContext,
    }) {
      expect.hasAssertions();

      try {
        await serverTestContext.c.users().getGroup('missingUserGroup');
      } catch (err) {
        expect(err).toBeInstanceOf(GroupNotFoundError);
        invariant(err instanceof GroupNotFoundError);
        expect(err.context).toBeInstanceOf(HttpErrorContext);
      }
    });

    test('should successfully get all groups', async function ({
      expect,
      serverTestContext,
      useUserGroup,
    }) {
      const groupName = await useUserGroup();

      await expect(serverTestContext.c.users().getAllGroups()).resolves.toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: groupName,
          }),
        ])
      );
    });

    test('should throw a GroupNotFoundError when dropping a missing group', async function ({
      expect,
      serverTestContext,
    }) {
      expect.hasAssertions();

      try {
        await serverTestContext.c.users().dropGroup('missingUserGroup');
      } catch (err) {
        expect(err).toBeInstanceOf(GroupNotFoundError);
        invariant(err instanceof GroupNotFoundError);
        expect(err.context).toBeInstanceOf(HttpErrorContext);
      }
    });
  });
