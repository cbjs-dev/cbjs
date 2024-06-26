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
import { describe, vi } from 'vitest';

import {
  CollectionExistsError,
  CollectionNotFoundError,
  FeatureNotAvailableError,
  HttpErrorContext,
  ScopeExistsError,
  ScopeNotFoundError,
} from '@cbjsdev/cbjs';
import { getCollections, ServerFeatures } from '@cbjsdev/http-client';
import { invariant } from '@cbjsdev/shared';
import { createCouchbaseTest } from '@cbjsdev/vitest';

import { serverSupportsFeatures } from '../utils/serverFeature.js';
import { serverVersionSatisfies } from '../utils/testConditions/serverVersionSatisfies.js';

describe
  .runIf(serverSupportsFeatures(ServerFeatures.Collections))
  .shuffle('collection manager', async () => {
    const test = await createCouchbaseTest();

    test('should successfully create and drop a scope', async function ({
      useScope,
      expect,
    }) {
      await expect(useScope()).resolves.toBeTypeOf('string');
    });

    test('should throw a ScopeExistsError on duplicate scopes', async function ({
      expect,
      useScope,
    }) {
      expect.hasAssertions();
      const scopeName = await useScope();

      try {
        await useScope({ scopeName });
      } catch (err) {
        expect(err).toBeInstanceOf(ScopeExistsError);
        invariant(err instanceof ScopeExistsError);
        expect(err.context).toBeInstanceOf(HttpErrorContext);
      }
    });

    test('should successfully create & drop a collection', async function ({
      expect,
      useCollection,
    }) {
      await expect(useCollection()).resolves.toBeTypeOf('string');
    });

    test('should throw a CollectionExistsError on duplicate collections', async function ({
      expect,
      useCollection,
    }) {
      expect.hasAssertions();
      const collectionName = await useCollection();

      try {
        await useCollection({ collectionName });
      } catch (err) {
        expect(err).toBeInstanceOf(CollectionExistsError);
        invariant(err instanceof CollectionExistsError);
        expect(err.context).toBeInstanceOf(HttpErrorContext);
      }
    });

    test('should successfully fetch all scopes and their collections', async function ({
      serverTestContext,
      expect,
      useBucket,
      useScope,
      useCollection,
    }) {
      const bucketName = await useBucket();
      const scopeName = await useScope({ bucketName });
      const collectionName = await useCollection({ scopeName, bucketName });

      const scopes = await serverTestContext.cluster
        .bucket(bucketName)
        .collections()
        .getAllScopes();

      const defaultScopeCount = serverVersionSatisfies('>=7.6.0') ? 3 : 2; // _default + _system + ours

      expect(scopes).toHaveLength(defaultScopeCount);
      expect(scopes).toContainEqual(expect.objectContaining({ name: '_default' }));
      expect(scopes).toContainEqual(expect.objectContaining({ name: scopeName }));

      const scope = scopes.find((s) => s.name === scopeName);

      invariant(scope);

      expect(scope.collections).toEqual([
        expect.objectContaining({ name: collectionName }),
      ]);
    });

    test('should throw a ScopeNotFoundError when creating a collection into a missing scope', async function ({
      expect,
      useCollection,
    }) {
      expect.hasAssertions();

      try {
        await useCollection({ scopeName: 'missingScope' });
      } catch (err) {
        expect(err).toBeInstanceOf(ScopeNotFoundError);
        invariant(err instanceof ScopeNotFoundError);
        expect(err.context).toBeInstanceOf(HttpErrorContext);
      }
    });

    test('should throw a CollectionNotFoundError when dropping missing collection', async function ({
      serverTestContext,
      expect,
      useScope,
    }) {
      expect.hasAssertions();
      const scopeName = await useScope();
      const collectionManager = serverTestContext.b.collections();

      try {
        await collectionManager.dropCollection('missingCollection', scopeName);
      } catch (err) {
        expect(err).toBeInstanceOf(CollectionNotFoundError);
        invariant(err instanceof CollectionNotFoundError);
        expect(err.context).toBeInstanceOf(HttpErrorContext);
      }
    });

    test('should successfully create a collection with a collection spec', async function ({
      expect,
      serverTestContext,
      useScope,
    }) {
      const scopeName = await useScope();
      const collectionName = serverTestContext.newUid();

      const collectionManager = serverTestContext.b.collections();

      await expect(
        collectionManager.createCollection(
          { name: collectionName, scopeName: scopeName, maxExpiry: 3 },
          { timeout: 4000 }
        )
      ).resolves.toBeUndefined();

      await collectionManager.dropCollection(collectionName, scopeName);
    });

    test('should should successfully create a collection with callback', async ({
      serverTestContext,
      expect,
      useScope,
    }) => {
      const scopeName = await useScope();
      const collectionName = serverTestContext.newUid();
      const callback = vi.fn();

      const collectionManager = serverTestContext.b.collections();
      await collectionManager.createCollection(
        collectionName,
        scopeName,
        { maxExpiry: 3 },
        undefined,
        (err: unknown) => {
          callback(err);
        }
      );

      expect(callback).toHaveBeenCalledWith(null);
    });

    test('should should successfully create a collection with callback and options', async ({
      serverTestContext,
      expect,
      useScope,
    }) => {
      const scopeName = await useScope();
      const collectionName = serverTestContext.newUid();
      const callback = vi.fn();

      const collectionManager = serverTestContext.b.collections();
      await collectionManager.createCollection(
        collectionName,
        scopeName,
        { maxExpiry: 3 },
        { timeout: 5000 },
        (err) => {
          callback(err);
        }
      );

      expect(callback).toHaveBeenCalledWith(null);
    });

    test('should should successfully create a collection with callback and options no settings', async ({
      serverTestContext,
      expect,
      useScope,
    }) => {
      const scopeName = await useScope();
      const collectionName = serverTestContext.newUid();
      const callback = vi.fn();

      const collectionManager = serverTestContext.b.collections();
      await collectionManager.createCollection(
        collectionName,
        scopeName,
        { timeout: 5000 },
        (err) => {
          callback(err);
        }
      );

      expect(callback).toHaveBeenCalledWith(null);
    });

    test('should should successfully create a collection with callback no settings', async ({
      serverTestContext,
      expect,
      useScope,
    }) => {
      const scopeName = await useScope();
      const collectionName = serverTestContext.newUid();
      const callback = vi.fn();

      const collectionManager = serverTestContext.b.collections();
      await collectionManager.createCollection(
        collectionName,
        scopeName,
        (err: unknown) => {
          callback(err);
        }
      );

      expect(callback).toHaveBeenCalledWith(null);
    });

    test('should successfully create a collection with callback deprecated API', async ({
      serverTestContext,
      expect,
      useScope,
    }) => {
      const scopeName = await useScope();
      const collectionName = serverTestContext.newUid();
      const callback = vi.fn();

      const collectionManager = serverTestContext.b.collections();
      await collectionManager.createCollection(
        { name: collectionName, scopeName: scopeName },
        (err: unknown) => {
          callback(err);
        }
      );

      expect(callback).toHaveBeenCalledWith(null);
    });

    test('should successfully create a collection with callback and options deprecated API', async ({
      serverTestContext,
      expect,
      useScope,
    }) => {
      const scopeName = await useScope();
      const collectionName = serverTestContext.newUid();
      const callback = vi.fn();

      const collectionManager = serverTestContext.b.collections();
      await collectionManager.createCollection(
        { name: collectionName, scopeName: scopeName },
        { timeout: 5000 },
        (err: unknown) => {
          callback(err);
        }
      );

      expect(callback).toHaveBeenCalledWith(null);
    });

    test('should successfully create a collection with settings', async function ({
      serverTestContext,
      expect,
      useScope,
    }) {
      const scopeName = await useScope();
      const collectionName = serverTestContext.newUid();

      const collectionManager = serverTestContext.b.collections();
      await collectionManager.createCollection(collectionName, scopeName, {
        maxExpiry: 3,
      });
      const scopes = await collectionManager.getAllScopes();
      const scope = scopes.find((s) => s.name === scopeName);

      invariant(scope);

      expect(scope.collections).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ name: collectionName, maxExpiry: 3 }),
        ])
      );
    });

    // Couchbase native bug: {"maxTTL":"Unsupported key"}
    test
      .runIf(serverSupportsFeatures(ServerFeatures.UpdateCollectionMaxExpiry))
      .skip(
        'should successfully update a collection maxExpiry',
        async ({ serverTestContext, expect, useScope }) => {
          const scopeName = await useScope();
          const collectionName = serverTestContext.newUid();

          const collectionManager = serverTestContext.b.collections();
          await collectionManager.createCollection(collectionName, scopeName, {
            maxExpiry: 3,
          });
          await collectionManager.updateCollection(collectionName, scopeName, {
            maxExpiry: 1,
          });
          const scopes = await collectionManager.getAllScopes();

          const scope = scopes.find((s) => s.name === scopeName);

          invariant(scope);

          expect(scope.collections).toEqual(
            expect.arrayContaining([
              expect.objectContaining({ name: collectionName, maxExpiry: 1 }),
            ])
          );
        }
      );

    test('should throw a ScopeNotFoundError when dropping a missing scope', async function ({
      serverTestContext,
      expect,
    }) {
      expect.hasAssertions();
      const collectionManager = serverTestContext.b.collections();

      try {
        await collectionManager.dropScope('missingScope');
      } catch (err) {
        expect(err).toBeInstanceOf(ScopeNotFoundError);
        invariant(err instanceof ScopeNotFoundError);
        expect(err.context).toBeInstanceOf(HttpErrorContext);
      }
    });

    test.runIf(serverSupportsFeatures(ServerFeatures.BucketDedup))(
      'should throw a FeatureNotAvailableError when creating a collection with history on a couchstore bucket',
      async function ({ serverTestContext, expect, useBucket, useScope }) {
        expect.hasAssertions();

        const bucketName = await useBucket();
        const scopeName = await useScope({ bucketName });

        const collectionManager = serverTestContext.c.bucket(bucketName).collections();

        try {
          await collectionManager.createCollection(
            serverTestContext.newUid(),
            scopeName,
            {
              history: true,
            }
          );
        } catch (err) {
          expect(err).toBeInstanceOf(FeatureNotAvailableError);
          invariant(err instanceof FeatureNotAvailableError);
          expect(err.context).toBeInstanceOf(HttpErrorContext);
        }
      }
    );

    test.runIf(serverSupportsFeatures(ServerFeatures.BucketDedup))(
      'should throw a FeatureNotAvailableError when updating a collection with history on a couchstore bucket',
      async function ({ serverTestContext, expect, useBucket, useScope, useCollection }) {
        const bucketName = serverTestContext.b.name;
        const scopeName = await useScope({ bucketName });
        const collectionName = await useCollection({
          scopeName,
          bucketName,
        });

        const collectionManager = serverTestContext.c.bucket(bucketName).collections();

        await expect(
          collectionManager.updateCollection(collectionName, scopeName, {
            history: true,
          })
        ).rejects.toThrowError(FeatureNotAvailableError);
      }
    );

    test.runIf(serverSupportsFeatures(ServerFeatures.BucketDedup))(
      'should successfully create a collection with history',
      async function ({ serverTestContext, expect, useBucket, useScope }) {
        const bucketName = await useBucket({
          storageBackend: 'magma',
          historyRetentionDuration: 120,
        });
        const scopeName = await useScope({ bucketName });
        const collectionName = serverTestContext.newUid();

        const collectionManager = serverTestContext.c.bucket(bucketName).collections();
        await collectionManager.createCollection(collectionName, scopeName, {
          history: true,
        });
        const scopes = await collectionManager.getAllScopes();
        const scope = scopes.find((s) => s.name === scopeName);

        invariant(scope);

        expect(scope.collections).toEqual(
          expect.arrayContaining([
            expect.objectContaining({ name: collectionName, history: true }),
          ])
        );
      }
    );

    test.runIf(serverSupportsFeatures(ServerFeatures.BucketDedup))(
      'should successfully update a collection with history',
      async function ({ serverTestContext, expect, useBucket, useScope }) {
        const bucketName = await useBucket({
          storageBackend: 'magma',
          historyRetentionDuration: 120,
        });
        const scopeName = await useScope({ bucketName });
        const collectionName = serverTestContext.newUid();

        const collectionManager = serverTestContext.c.bucket(bucketName).collections();
        await collectionManager.createCollection(collectionName, scopeName, {
          history: true,
        });
        await collectionManager.updateCollection(collectionName, scopeName, {
          history: false,
        });
        const scopes = await collectionManager.getAllScopes();
        const scope = scopes.find((s) => s.name === scopeName);

        invariant(scope);

        expect(scope.collections).toEqual(
          expect.arrayContaining([
            expect.objectContaining({ name: collectionName, history: false }),
          ])
        );
      }
    );

    test.runIf(serverSupportsFeatures(ServerFeatures.NegativeCollectionMaxExpiry))(
      'should create a collection with max expiry when an empty settings object is provided',
      async function ({ apiConfig, expect, serverTestContext, useScope, useCollection }) {
        const bucketName = serverTestContext.b.name;
        const scopeName = await useScope({ bucketName });
        const collectionName = await useCollection({
          scopeName,
          bucketName,
        });

        const collections = await getCollections(apiConfig, bucketName, scopeName);
        const testCollection = collections.find((c) => c.name === collectionName);

        expect(testCollection?.maxTTL).toEqual(0);
      }
    );

    test.runIf(serverSupportsFeatures(ServerFeatures.NegativeCollectionMaxExpiry))(
      'should successfully create a collection with no expiry (-1)',
      async function ({ apiConfig, expect, serverTestContext, useScope, useCollection }) {
        const bucketName = serverTestContext.b.name;
        const scopeName = await useScope({ bucketName });
        const collectionName = await useCollection(
          {
            scopeName,
            bucketName,
          },
          { maxExpiry: -1 }
        );

        const collections = await getCollections(apiConfig, bucketName, scopeName);
        const testCollection = collections.find((c) => c.name === collectionName);

        expect(testCollection?.maxTTL).toEqual(-1);
      }
    );

    test
      .runIf(serverSupportsFeatures(ServerFeatures.NegativeCollectionMaxExpiry))
      .fails(
        'should fail to create a collection with an invalid maxExpiry',
        async function ({
          apiConfig,
          expect,
          serverTestContext,
          useScope,
          useCollection,
        }) {
          const bucketName = serverTestContext.b.name;
          const scopeName = await useScope({ bucketName });
          const collectionName = await useCollection(
            {
              scopeName,
              bucketName,
            },
            { maxExpiry: -2 }
          );

          const collections = await getCollections(apiConfig, bucketName, scopeName);
          const testCollection = collections.find((c) => c.name === collectionName);

          expect(testCollection?.maxTTL).toEqual(0);
        }
      );

    test.runIf(serverSupportsFeatures(ServerFeatures.NegativeCollectionMaxExpiry))(
      'should successfully update a collection with a custom maxExpiry to the default maxExpiry',
      async function ({
        apiConfig,
        expect,
        useBucket,
        useScope,
        useCollection,
        serverTestContext,
      }) {
        const bucketName = serverTestContext.b.name;
        const scopeName = await useScope({ bucketName });
        const collectionName = await useCollection(
          {
            scopeName,
            bucketName,
          },
          { maxExpiry: 5 }
        );

        await expect(
          serverTestContext.b.collections().updateCollection(collectionName, scopeName, {
            maxExpiry: 0,
          })
        ).resolves.toBeUndefined();

        const collections = await getCollections(apiConfig, bucketName, scopeName);
        const testCollection = collections.find((c) => c.name === collectionName);

        expect(testCollection?.maxTTL).toEqual(0);
      }
    );

    test.runIf(serverSupportsFeatures(ServerFeatures.NegativeCollectionMaxExpiry))(
      'should successfully update a collection with the default maxExpiry to no maxExpiry',
      async function ({ apiConfig, expect, useScope, useCollection, serverTestContext }) {
        const bucketName = serverTestContext.b.name;
        const scopeName = await useScope({ bucketName });
        const collectionName = await useCollection(
          {
            scopeName,
            bucketName,
          },
          { maxExpiry: 0 }
        );

        await expect(
          serverTestContext.b.collections().updateCollection(collectionName, scopeName, {
            maxExpiry: -1,
          })
        ).resolves.toBeUndefined();

        const collections = await getCollections(apiConfig, bucketName, scopeName);
        const testCollection = collections.find((c) => c.name === collectionName);

        expect(testCollection?.maxTTL).toEqual(-1);
      }
    );
  });
