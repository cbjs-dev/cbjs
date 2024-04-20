import { beforeAll, describe, it } from 'vitest';

import { DocumentNotFoundError } from '@cbjsdev/cbjs';
import { getKeyspaceIsolation, setKeyspaceIsolation } from '@cbjsdev/vitest';

describe('kv', { timeout: 30_000 }, () => {
  beforeAll(() => {
    setKeyspaceIsolation('per-test');
  });

  it('should isolate an insert', async ({ expect, getCluster }) => {
    const cluster = await getCluster();
    const collection = cluster.bucket('store').scope('library').collection('books');
    await collection.insert('docKey', {
      title: 'insert',
    });

    const { content } = await collection.get('docKey');

    expect(content).toEqual({ title: 'insert' });
  });

  it('should isolate a get', async ({ getCluster, expect }) => {
    const cluster = await getCluster();
    await expect(
      cluster.bucket('store').scope('library').collection('books').get('docKey')
    ).rejects.toThrowError(DocumentNotFoundError);

    console.log(JSON.stringify(getKeyspaceIsolation().realm));
  });
});
