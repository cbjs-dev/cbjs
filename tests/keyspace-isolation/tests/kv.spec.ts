import { beforeAll, describe, it } from 'vitest';

import { DocumentExistsError } from '@cbjsdev/cbjs';
import { setKeyspaceIsolation } from '@cbjsdev/vitest';

// TODO reproduce the segfault and get its stacktrace
describe('kv', { timeout: 5_000 }, () => {
  beforeAll(() => {
    setKeyspaceIsolation('per-test');
  });

  it('whatev', ({ expect }) => {
    expect(true).toBe(true);
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

  // TODO en regardant le segfault je vois "unknown_collection", peut-être que la collection n'est pas encore connue
  // TODO de la bucket map du client
  it('should isolate a get', async ({ expect, getCluster }) => {
    const cluster = await getCluster();

    await expect(
      cluster.bucket('store').scope('library').collection('books').get('docKey')
    ).rejects.toThrowError();
  });

  it('should throw the original error', async ({ expect, getCluster }) => {
    const cluster = await getCluster();

    await cluster.bucket('store').scope('library').collection('books').insert('docKey', {
      title: 'test',
    });

    await expect(
      cluster.bucket('store').scope('library').collection('books').insert('docKey', {
        title: 'error',
      })
    ).rejects.toThrowError(DocumentExistsError);
  });
});
