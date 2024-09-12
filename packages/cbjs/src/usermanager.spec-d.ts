import { describe, it } from 'vitest';

import { Cluster } from './cluster.js';
import { Role } from './usermanager.js';

declare const cluster: Cluster;

describe('user manager', async () => {
  describe('upsert user', async () => {
    it('should require the exact scope from a role definition', async () => {
      await cluster.users().upsertUser({
        username: 'test',
        roles: [
          new Role({ name: 'admin' }),
          // @ts-expect-error missing "scope"
          new Role({ name: 'fts_admin' }),
        ],
      });
    });
  });
});
