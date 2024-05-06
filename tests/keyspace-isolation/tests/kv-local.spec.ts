import { beforeAll, describe, it } from 'vitest';

import { setKeyspaceIsolation } from '@cbjsdev/vitest';

describe.sequential('kv local', { timeout: 5_000 }, () => {
  beforeAll(() => {
    setKeyspaceIsolation('local');
  });

  describe('suite a', () => {
    it('should insert', async ({ expect, getCluster }) => {
      const cluster = await getCluster();

      const collection = cluster.bucket('store').scope('library').collection('books');
      await collection.insert('docKey', {
        title: 'local',
      });
    });
  });

  describe('suite b', () => {
    it('should get', async ({ expect, getCluster }) => {
      const cluster = await getCluster();

      const { content } = await cluster
        .bucket('store')
        .scope('library')
        .collection('books')
        .get('docKey');

      expect(content).toEqual({ title: 'local' });
    });
  });
});
