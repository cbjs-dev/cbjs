import { describe, it, vi } from 'vitest';

import {
  CanonicalQueryIndexDefinition,
  CouchbaseHttpApiConfig,
} from '@cbjsdev/http-client';

import { canonicalizeIndexConfigs } from './canonicalizeIndexConfigs.js';
import { getCouchbaseClusterChanges } from './getCouchbaseClusterChanges.js';
import {
  CouchbaseClusterCollectionIndexConfig,
  CouchbaseClusterConfig,
} from './types.js';

const apiConfig = {} as CouchbaseHttpApiConfig;

function makeConfig(
  indexes: Record<string, CouchbaseClusterCollectionIndexConfig> | undefined
): CouchbaseClusterConfig {
  return {
    users: [],
    keyspaces: {
      b: {
        ramQuotaMB: 100,
        scopes: {
          s: {
            collections: {
              c: { indexes },
            },
          },
        },
      },
    },
  };
}

function getIndex(config: CouchbaseClusterConfig, name: string) {
  return config.keyspaces.b.scopes.s.collections.c.indexes?.[name];
}

/**
 * Simulates the server printer: maps the declared definition (JSON of keys + where)
 * to its canonical form.
 */
function fakeExplain(prints: Map<string, CanonicalQueryIndexDefinition>) {
  return vi.fn(
    async (
      _apiConfig: CouchbaseHttpApiConfig,
      _indexName: string,
      _keyspace: unknown,
      config: { keys: string[]; where?: string }
    ): Promise<CanonicalQueryIndexDefinition> => {
      const canonical = prints.get(JSON.stringify([config.keys, config.where]));

      if (!canonical) {
        throw new Error(`Unexpected definition: ${JSON.stringify(config)}`);
      }

      return canonical;
    }
  );
}

describe('canonicalizeIndexConfigs', () => {
  it('should not contact the server for an index without a live counterpart', async ({
    expect,
  }) => {
    const explain = fakeExplain(new Map());
    const nextConfig = makeConfig({
      idx_test: { keys: ['OBJECT_LENGTH(timeEntries) > 0'] },
    });

    const result = await canonicalizeIndexConfigs(
      apiConfig,
      makeConfig(undefined),
      nextConfig,
      {
        explain,
      }
    );

    expect(explain).not.toHaveBeenCalled();
    expect(result).toEqual(nextConfig);
  });

  it('should not contact the server when the definitions already match textually', async ({
    expect,
  }) => {
    const explain = fakeExplain(new Map());
    const currentConfig = makeConfig({
      idx_test: { keys: ['`title`', '(`body`.`email`) DESC'] },
    });
    const nextConfig = makeConfig({
      idx_test: { keys: ['title', 'body.email DESC'] },
    });

    const result = await canonicalizeIndexConfigs(apiConfig, currentConfig, nextConfig, {
      explain,
    });

    expect(explain).not.toHaveBeenCalled();
    expect(result).toEqual(nextConfig);
  });

  it('should replace the declared definition by the live one when their canonical forms match', async ({
    expect,
  }) => {
    const declared: CouchbaseClusterCollectionIndexConfig = {
      keys: ['type', 'OBJECT_LENGTH(timeEntries) > 0'],
      where: "type = 'new'",
      numReplicas: 1,
    };
    const live: CouchbaseClusterCollectionIndexConfig = {
      keys: ['`type`', '(0 < object_length(`timeEntries`))'],
      where: '(`type` = "new")',
    };

    const explain = fakeExplain(
      new Map([
        [
          JSON.stringify([declared.keys, declared.where]),
          { keys: live.keys, where: live.where },
        ],
      ])
    );

    const currentConfig = makeConfig({ idx_test: live });
    const nextConfig = makeConfig({ idx_test: declared });

    const result = await canonicalizeIndexConfigs(apiConfig, currentConfig, nextConfig, {
      explain,
    });

    expect(explain).toHaveBeenCalledTimes(1);
    expect(getIndex(result, 'idx_test')).toEqual({
      keys: live.keys,
      where: live.where,
      numReplicas: 1,
    });

    const changes = getCouchbaseClusterChanges(currentConfig, result);
    expect(changes.filter((c) => c.type !== 'updateIndex')).toEqual([]);
  });

  it('should round-trip the live definition when it was printed by an older server', async ({
    expect,
  }) => {
    const declared: CouchbaseClusterCollectionIndexConfig = {
      keys: ['OBJECT_LENGTH(timeEntries) > 0'],
    };
    // The stored text predates a printer change: it no longer matches the
    // current canonical form, but both definitions round-trip to the same one.
    const live: CouchbaseClusterCollectionIndexConfig = {
      keys: ['0 < OBJECT_LENGTH(`timeEntries`)'],
    };
    const canonical = { keys: ['(0 < object_length(`timeEntries`))'] };

    const explain = fakeExplain(
      new Map([
        [JSON.stringify([declared.keys, undefined]), canonical],
        [JSON.stringify([live.keys, undefined]), canonical],
      ])
    );

    const currentConfig = makeConfig({ idx_test: live });
    const nextConfig = makeConfig({ idx_test: declared });

    const result = await canonicalizeIndexConfigs(apiConfig, currentConfig, nextConfig, {
      explain,
    });

    expect(explain).toHaveBeenCalledTimes(2);
    expect(getIndex(result, 'idx_test')).toEqual(live);
    expect(getCouchbaseClusterChanges(currentConfig, result)).toEqual([]);
  });

  it('should use the canonical form of the definition when the index has really changed', async ({
    expect,
  }) => {
    const declared: CouchbaseClusterCollectionIndexConfig = {
      keys: ['OBJECT_LENGTH(timeEntries) > 1'],
    };
    const live: CouchbaseClusterCollectionIndexConfig = {
      keys: ['(0 < object_length(`timeEntries`))'],
    };
    const canonicalDeclared = { keys: ['(1 < object_length(`timeEntries`))'] };

    const explain = fakeExplain(
      new Map([
        [JSON.stringify([declared.keys, undefined]), canonicalDeclared],
        [JSON.stringify([live.keys, undefined]), { keys: live.keys }],
      ])
    );

    const currentConfig = makeConfig({ idx_test: live });
    const nextConfig = makeConfig({ idx_test: declared });

    const result = await canonicalizeIndexConfigs(apiConfig, currentConfig, nextConfig, {
      explain,
    });

    expect(explain).toHaveBeenCalledTimes(2);
    expect(getIndex(result, 'idx_test')).toEqual(canonicalDeclared);

    const changes = getCouchbaseClusterChanges(currentConfig, result);
    expect(changes).toEqual([
      expect.objectContaining({
        type: 'recreateIndex',
        name: 'idx_test',
        changedProperties: ['keys'],
      }),
    ]);
  });

  it('should report the faulty index when the server refuses to plan its definition', async ({
    expect,
  }) => {
    const explain = fakeExplain(new Map());

    const currentConfig = makeConfig({ idx_test: { keys: ['`other`'] } });
    const nextConfig = makeConfig({ idx_test: { keys: ['OBJECT_LENGTH('] } });

    await expect(
      canonicalizeIndexConfigs(apiConfig, currentConfig, nextConfig, { explain })
    ).rejects.toThrowError('b.s.c#idx_test');
  });

  it('should leave everything but the index definitions untouched', async ({
    expect,
  }) => {
    const explain = fakeExplain(new Map());
    const nextConfig: CouchbaseClusterConfig = {
      users: [{ username: 'cbjsUser_a', password: 'secret' }],
      keyspaces: {
        b: {
          ramQuotaMB: 256,
          numReplicas: 2,
          scopes: {
            s: {
              searchIndexes: {},
              collections: {
                c: { maxExpiry: 60, history: true },
              },
            },
          },
        },
      },
    };

    const result = await canonicalizeIndexConfigs(apiConfig, {}, nextConfig, { explain });

    expect(explain).not.toHaveBeenCalled();
    expect(result).toEqual(nextConfig);
  });
});
