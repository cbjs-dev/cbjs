import { beforeAll, describe, it } from 'vitest';

import { CouchbaseError, DocumentNotFoundError } from '@cbjsdev/cbjs';
import { setKeyspaceIsolation } from '@cbjsdev/vitest';

describe('kv', { timeout: 30_000 }, () => {
  beforeAll(() => {
    setKeyspaceIsolation('per-test');
  });

  it('should isolate an insert', async ({ expect, getCluster }) => {
    const cluster = await getCluster();

    const collection = cluster.bucket('store').scope('library').collection('books');
    await collection.upsert('docKey', {
      title: 'insert',
    });

    const { content } = await collection.get('docKey');

    expect(content).toEqual({ title: 'insert' });
  });

  it('should isolate a get', async ({ expect, getCluster }) => {
    const cluster = await getCluster();

    await expect(
      cluster.bucket('store').scope('library').collection('books').get('docKey')
    ).rejects.toThrowError(CouchbaseError);
  });
});
