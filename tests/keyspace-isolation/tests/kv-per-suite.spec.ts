import { beforeAll, describe, it } from 'vitest';

import { DocumentExistsError } from '@cbjsdev/cbjs';
import { setKeyspaceIsolation } from '@cbjsdev/vitest';

describe.sequential('kv per suite', { timeout: 5_000 }, () => {
  beforeAll(() => {
    setKeyspaceIsolation('per-suite');
  });

  describe('suite a', () => {
    it('should insert', async ({ expect, getCluster }) => {
      const cluster = await getCluster();

      const collection = cluster.bucket('store').scope('library').collection('books');
      await collection.insert('docKey', {
        title: 'per-suite',
      });
    });

    it('should get', async ({ expect, getCluster }) => {
      const cluster = await getCluster();

      const { content } = await cluster
        .bucket('store')
        .scope('library')
        .collection('books')
        .get('docKey');

      expect(content).toEqual({ title: 'per-suite' });
    });

    it('should throw the original error', async ({ expect, getCluster }) => {
      const cluster = await getCluster();

      await expect(
        cluster.bucket('store').scope('library').collection('books').insert('docKey', {
          title: 'error',
        })
      ).rejects.toThrowError(DocumentExistsError);
    });
  });

  describe('suite b', () => {
    it('should insert', async ({ expect, getCluster }) => {
      const cluster = await getCluster();

      const collection = cluster.bucket('store').scope('library').collection('books');
      await collection.insert('docKey', {
        title: 'per-suite',
      });
    });

    it('should get', async ({ expect, getCluster }) => {
      const cluster = await getCluster();

      const { content } = await cluster
        .bucket('store')
        .scope('library')
        .collection('books')
        .get('docKey');

      expect(content).toEqual({ title: 'per-suite' });
    });

    it('should throw the original error', async ({ expect, getCluster }) => {
      const cluster = await getCluster();

      await expect(
        cluster.bucket('store').scope('library').collection('books').insert('docKey', {
          title: 'error',
        })
      ).rejects.toThrowError(DocumentExistsError);
    });
  });
});
