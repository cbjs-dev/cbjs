import { Cluster, keyspacePath } from '@cbjsdev/cbjs';
import {
  CouchbaseHttpApiConfig,
  createQueryIndex,
  updateQueryIndex,
  waitForBucket,
  waitForCollection,
  waitForQueryIndex,
  waitForScope,
} from '@cbjsdev/http-client';

import {
  CouchbaseClusterChange,
  CouchbaseClusterChangeCreateBucket,
  CouchbaseClusterChangeCreateCollection,
  CouchbaseClusterChangeCreateIndex,
  CouchbaseClusterChangeCreateScope,
  CouchbaseClusterChangeDropBucket,
  CouchbaseClusterChangeDropCollection,
  CouchbaseClusterChangeDropIndex,
  CouchbaseClusterChangeDropScope,
  CouchbaseClusterChangeRecreateBucket,
  CouchbaseClusterChangeRecreateIndex,
  CouchbaseClusterChangeUpdateBucket,
  CouchbaseClusterChangeUpdateCollection,
  CouchbaseClusterChangeUpdateIndex,
} from './types.js';

export type ChangeOptions = {
  /**
   * Timeout for each individual operation.
   *
   * @default 10_000
   */
  timeout?: number;
};

export async function applyCouchbaseClusterChanges(
  cluster: Cluster,
  apiConfig: CouchbaseHttpApiConfig,
  changes: CouchbaseClusterChange[],
  options?: ChangeOptions
) {
  const defaultOptions = { timeout: 10_000 };
  const resolvedOptions = { ...defaultOptions, ...options };

  const operations: Record<
    CouchbaseClusterChange['type'],
    (
      cluster: Cluster,
      apiConfig: CouchbaseHttpApiConfig,
      change: never,
      opts: { timeout?: number }
    ) => Promise<void>
  > = {
    createBucket: applyCreateBucket,
    dropBucket: applyDropBucket,
    updateBucket: applyUpdateBucket,
    recreateBucket: applyRecreateBucket,
    createScope: applyCreateScope,
    dropScope: applyDropScope,
    createCollection: applyCreateCollection,
    updateCollection: applyUpdateCollection,
    dropCollection: applyDropCollection,
    createIndex: applyCreateIndex,
    dropIndex: applyDropIndex,
    recreateIndex: applyRecreateIndex,
    updateIndex: applyUpdateIndex,
  };

  for (const change of changes) {
    const operation = operations[change.type];
    await operation(cluster, apiConfig, change as never, resolvedOptions);
  }
}

async function applyCreateBucket(
  cluster: Cluster,
  apiConfig: CouchbaseHttpApiConfig,
  change: CouchbaseClusterChangeCreateBucket,
  opts: ChangeOptions
) {
  const buckets = await cluster.buckets().getAllBuckets();

  if (buckets.some((b) => b.name === change.config.name)) {
    return;
  }

  console.log(`Requesting creation of bucket "${change.config.name}"`);
  await cluster.buckets().createBucket(change.config, opts);
  console.log(`Waiting for bucket "${change.config.name}" to be created`);
  await waitForBucket(apiConfig, change.config.name, opts);
  console.log(`Bucket "${change.config.name}" created`);
}

async function applyDropBucket(
  cluster: Cluster,
  apiConfig: CouchbaseHttpApiConfig,
  change: CouchbaseClusterChangeDropBucket,
  opts: ChangeOptions
) {
  const buckets = await cluster.buckets().getAllBuckets();

  if (!buckets.some((b) => b.name === change.name)) {
    return;
  }

  console.log(`Requesting deletion of bucket "${change.name}"`);
  await cluster.buckets().dropBucket(change.name, opts);
  console.log(`Waiting for bucket "${change.name}" to be dropped`);
  await waitForBucket(apiConfig, change.name, {
    ...opts,
    expectMissing: true,
  });
  console.log(`Bucket "${change.name}" dropped`);
}

async function applyUpdateBucket(
  cluster: Cluster,
  apiConfig: CouchbaseHttpApiConfig,
  change: CouchbaseClusterChangeUpdateBucket,
  opts: ChangeOptions
) {
  const buckets = await cluster.buckets().getAllBuckets();

  if (!buckets.some((b) => b.name === change.config.name)) {
    throw new Error(
      `Bucket "${change.config.name}" scheduled for update but was not found`
    );
  }

  const currentSettings = await cluster.buckets().getBucket(change.config.name);
  console.log(`Requesting update of bucket "${change.config.name}"`);
  await cluster.buckets().updateBucket(
    {
      ...currentSettings,
      ...change.config,
    },
    opts
  );
  console.log(`Bucket "${change.config.name}" updated`);
}

async function applyRecreateBucket(
  cluster: Cluster,
  apiConfig: CouchbaseHttpApiConfig,
  change: CouchbaseClusterChangeRecreateBucket,
  opts: ChangeOptions
) {
  const buckets = await cluster.buckets().getAllBuckets();

  if (buckets.some((b) => b.name === change.config.name)) {
    console.log(`Requesting deletion of bucket "${change.config.name}"`);
    await cluster.buckets().dropBucket(change.config.name, opts);
    console.log(`Waiting for bucket "${change.config.name}" to be dropped`);
    await waitForBucket(apiConfig, change.config.name, opts);
    console.log(`Bucket "${change.config.name}" created`);
  }

  console.log(`Requesting creation of bucket "${change.config.name}"`);
  await cluster.buckets().createBucket(change.config, opts);
  console.log(`Waiting for bucket "${change.config.name}" to be created`);
  await waitForBucket(apiConfig, change.config.name, opts);
  console.log(`Bucket "${change.config.name}" created`);
}

async function applyCreateScope(
  cluster: Cluster,
  apiConfig: CouchbaseHttpApiConfig,
  change: CouchbaseClusterChangeCreateScope,
  opts: ChangeOptions
) {
  const scopes = await cluster.bucket(change.bucket).collections().getAllScopes();

  if (scopes.some((s) => s.name === change.name)) {
    return;
  }

  console.log(`Requesting creation of scope "${change.bucket}.${change.name}"`);
  await cluster.bucket(change.bucket).collections().createScope(change.name, opts);
  console.log(`Waiting for scope "${change.bucket}.${change.name}" to be created`);
  await waitForScope(apiConfig, change.bucket, change.name, opts);
  console.log(`Scope "${change.bucket}.${change.name}" created`);
}

async function applyDropScope(
  cluster: Cluster,
  apiConfig: CouchbaseHttpApiConfig,
  change: CouchbaseClusterChangeDropScope,
  opts: ChangeOptions
) {
  const scopes = await cluster.bucket(change.bucket).collections().getAllScopes();

  if (!scopes.some((s) => s.name === change.name)) {
    return;
  }

  console.log(`Requesting deletion of scope "${change.bucket}.${change.name}"`);
  await cluster.bucket(change.bucket).collections().dropScope(change.name, opts);
  console.log(`Waiting for scope "${change.bucket}.${change.name}" to be dropped`);
  await waitForScope(apiConfig, change.bucket, change.name, {
    ...opts,
    expectMissing: true,
  });
  console.log(`Scope "${change.bucket}.${change.name}" dropped`);
}

async function applyCreateCollection(
  cluster: Cluster,
  apiConfig: CouchbaseHttpApiConfig,
  change: CouchbaseClusterChangeCreateCollection,
  opts: ChangeOptions
) {
  const scopes = await cluster.bucket(change.bucket).collections().getAllScopes();

  if (
    scopes.some((s) =>
      s.collections.some((c) => c.name === change.name && c.scopeName === change.scope)
    )
  ) {
    return;
  }

  console.log(
    `Requesting creation of collection "${change.bucket}.${change.scope}.${change.name}"`
  );
  await cluster
    .bucket(change.bucket)
    .collections()
    .createCollection(change.name, change.scope, change, opts);
  console.log(
    `Waiting for collection "${change.bucket}.${change.scope}.${change.name}" to be created`
  );
  await waitForCollection(apiConfig, change.bucket, change.scope, change.name, opts);
  console.log(`Collection "${change.bucket}.${change.scope}.${change.name}" created`);
}

async function applyDropCollection(
  cluster: Cluster,
  apiConfig: CouchbaseHttpApiConfig,
  change: CouchbaseClusterChangeDropCollection,
  opts: ChangeOptions
) {
  const scopes = await cluster.bucket(change.bucket).collections().getAllScopes();

  if (
    !scopes.some((s) =>
      s.collections.some((c) => c.name === change.name && c.scopeName === change.scope)
    )
  ) {
    return;
  }

  console.log(
    `Requesting deletion of collection "${change.bucket}.${change.scope}.${change.name}"`
  );
  await cluster
    .bucket(change.bucket)
    .collections()
    .dropCollection(change.name, change.scope, opts);
  console.log(
    `Waiting for collection "${change.bucket}.${change.scope}.${change.name}" to be dropped`
  );
  await waitForCollection(apiConfig, change.bucket, change.scope, change.name, opts);
  console.log(`Collection "${change.bucket}.${change.scope}.${change.name}" dropped`);
}

async function applyUpdateCollection(
  cluster: Cluster,
  apiConfig: CouchbaseHttpApiConfig,
  change: CouchbaseClusterChangeUpdateCollection,
  opts: ChangeOptions
) {
  const scopes = await cluster.bucket(change.bucket).collections().getAllScopes();

  if (
    !scopes.some((s) =>
      s.collections.some((c) => c.name === change.name && c.scopeName === change.scope)
    )
  ) {
    throw new Error(
      `Collection ${keyspacePath({
        bucket: change.bucket,
        scope: change.scope,
        collection: change.name,
      })} was scheduled for an update but was not found.`
    );
  }

  console.log(
    `Requesting update of collection "${change.bucket}.${change.scope}.${change.name}"`
  );
  await cluster
    .bucket(change.bucket)
    .collections()
    .updateCollection(change.name, change.scope, change, opts);
}

async function applyCreateIndex(
  cluster: Cluster,
  apiConfig: CouchbaseHttpApiConfig,
  change: CouchbaseClusterChangeCreateIndex,
  opts: ChangeOptions
) {
  const queryIndexes = await cluster
    .bucket(change.bucket)
    .scope(change.scope)
    .collection(change.collection)
    .queryIndexes()
    .getAllIndexes();

  if (queryIndexes.some((qi) => qi.name === change.name)) {
    return;
  }

  console.log(
    `Requesting creation of index "${change.bucket}.${change.scope}.${change.collection} # ${change.name}"`
  );
  await createQueryIndex(
    apiConfig,
    change.name,
    {
      bucket: change.bucket,
      scope: change.scope,
      collection: change.collection,
    },
    {
      keys: change.keys,
      where: change.where,
    }
  );
  console.log(
    `Waiting for index "${change.bucket}.${change.scope}.${change.collection} # ${change.name}" to be created`
  );
  await waitForQueryIndex(
    apiConfig,
    change.name,
    {
      bucket: change.bucket,
      scope: change.scope,
      collection: change.collection,
    },
    opts
  );
  console.log(
    `Index "${change.bucket}.${change.scope}.${change.collection} # ${change.name}" created`
  );
}

async function applyDropIndex(
  cluster: Cluster,
  apiConfig: CouchbaseHttpApiConfig,
  change: CouchbaseClusterChangeDropIndex,
  opts: ChangeOptions
) {
  const queryIndexes = await cluster
    .bucket(change.bucket)
    .scope(change.scope)
    .collection(change.collection)
    .queryIndexes()
    .getAllIndexes();

  if (!queryIndexes.some((qi) => qi.name === change.name)) {
    return;
  }

  console.log(
    `Requesting deletion of index "${change.bucket}.${change.scope}.${change.collection} # ${change.name}"`
  );
  await cluster
    .bucket(change.bucket)
    .scope(change.scope)
    .collection(change.collection)
    .queryIndexes()
    .dropIndex(change.name, opts);

  console.log(
    `Waiting for index "${change.bucket}.${change.scope}.${change.collection} # ${change.name}" to be dropped`
  );
  await waitForQueryIndex(
    apiConfig,
    change.name,
    {
      bucket: change.bucket,
      scope: change.scope,
      collection: change.collection,
    },
    {
      ...opts,
      expectMissing: true,
    }
  );
  console.log(
    `Index "${change.bucket}.${change.scope}.${change.collection} # ${change.name}" dropped`
  );
}

async function applyUpdateIndex(
  cluster: Cluster,
  apiConfig: CouchbaseHttpApiConfig,
  change: CouchbaseClusterChangeUpdateIndex,
  opts: ChangeOptions
) {
  const queryIndexes = await cluster
    .bucket(change.bucket)
    .scope(change.scope)
    .collection(change.collection)
    .queryIndexes()
    .getAllIndexes();

  if (!queryIndexes.some((qi) => qi.name === change.name)) {
    throw new Error(
      `Index ${change.name} on ${keyspacePath({
        bucket: change.bucket,
        scope: change.scope,
        collection: change.name,
      })} was scheduled for an update but was not found.`
    );
  }

  console.log(
    `Requesting update of index "${change.bucket}.${change.scope}.${change.collection} # ${change.name}"`
  );
  await updateQueryIndex(
    apiConfig,
    change.name,
    {
      bucket: change.bucket,
      scope: change.scope,
      collection: change.collection,
    },
    { action: 'replica_count', num_replica: change.numReplicas }
  );
}

async function applyRecreateIndex(
  cluster: Cluster,
  apiConfig: CouchbaseHttpApiConfig,
  change: CouchbaseClusterChangeRecreateIndex,
  opts: ChangeOptions
) {
  const queryIndexes = await cluster
    .bucket(change.bucket)
    .scope(change.scope)
    .collection(change.collection)
    .queryIndexes()
    .getAllIndexes();

  if (queryIndexes.some((qi) => qi.name === change.name)) {
    await applyDropIndex(cluster, apiConfig, { ...change, type: 'dropIndex' }, opts);
  }

  await applyCreateIndex(cluster, apiConfig, { ...change, type: 'createIndex' }, opts);
}
