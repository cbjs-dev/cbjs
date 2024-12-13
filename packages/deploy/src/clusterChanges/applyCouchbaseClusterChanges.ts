import { Cluster, keyspacePath } from '@cbjsdev/cbjs';
import {
  CouchbaseHttpApiConfig,
  createQueryIndex,
  getBucket,
  updateQueryIndex,
  updateUserPassword,
  waitForBucket,
  waitForCollection,
  waitForQueryIndex,
  waitForScope,
  waitForSearchIndex,
  waitForUser,
  whoami,
} from '@cbjsdev/http-client';
import { waitFor } from '@cbjsdev/shared';

import {
  CouchbaseClusterChange,
  CouchbaseClusterChangeCreateBucket,
  CouchbaseClusterChangeCreateCollection,
  CouchbaseClusterChangeCreateIndex,
  CouchbaseClusterChangeCreateScope,
  CouchbaseClusterChangeCreateSearchIndex,
  CouchbaseClusterChangeCreateUser,
  CouchbaseClusterChangeDropBucket,
  CouchbaseClusterChangeDropCollection,
  CouchbaseClusterChangeDropIndex,
  CouchbaseClusterChangeDropScope,
  CouchbaseClusterChangeDropSearchIndex,
  CouchbaseClusterChangeDropUser,
  CouchbaseClusterChangeRecreateBucket,
  CouchbaseClusterChangeRecreateIndex,
  CouchbaseClusterChangeRecreateUser,
  CouchbaseClusterChangeUpdateBucket,
  CouchbaseClusterChangeUpdateCollection,
  CouchbaseClusterChangeUpdateIndex,
  CouchbaseClusterChangeUpdateSearchIndex,
  CouchbaseClusterChangeUpdateUser,
  CouchbaseClusterChangeUpdateUserPassword,
} from './types.js';

export type ChangeOptions = {
  /**
   * Timeout for each individual operation.
   *
   * @default 10_000
   */
  timeout?: number;
};

function getTimePrefix() {
  const d = new Date();
  return `[${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}]`;
}

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
    createUser: applyCreateUser,
    updateUser: applyUpdateUser,
    dropUser: applyDropUser,
    recreateUser: applyRecreateUser,
    updateUserPassword: applyUpdateUserPassword,
    createSearchIndex: applyCreateSearchIndex,
    updateSearchIndex: applyCreateSearchIndex,
    dropSearchIndex: applyDropSearchIndex,
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

  console.log(`${getTimePrefix()} Requesting creation of bucket "${change.config.name}"`);
  await cluster.buckets().createBucket(change.config, opts);
  console.log(
    `${getTimePrefix()} Waiting for bucket "${change.config.name}" to be created`
  );
  await waitForBucket(apiConfig, change.config.name, opts);
  console.log(`${getTimePrefix()} Bucket "${change.config.name}" created`);
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

  console.log(`${getTimePrefix()} Requesting deletion of bucket "${change.name}"`);
  await cluster.buckets().dropBucket(change.name, opts);
  console.log(`${getTimePrefix()} Waiting for bucket "${change.name}" to be dropped`);
  await waitForBucket(apiConfig, change.name, {
    ...opts,
    expectMissing: true,
  });
  console.log(`${getTimePrefix()} Bucket "${change.name}" dropped`);
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
  console.log(`${getTimePrefix()} Requesting update of bucket "${change.config.name}"`);
  await cluster.buckets().updateBucket(
    {
      ...currentSettings,
      ...change.config,
    },
    opts
  );
  console.log(`${getTimePrefix()} Bucket "${change.config.name}" updated`);
}

async function applyRecreateBucket(
  cluster: Cluster,
  apiConfig: CouchbaseHttpApiConfig,
  change: CouchbaseClusterChangeRecreateBucket,
  opts: ChangeOptions
) {
  const buckets = await cluster.buckets().getAllBuckets();

  if (buckets.some((b) => b.name === change.config.name)) {
    console.log(
      `${getTimePrefix()} Requesting deletion of bucket "${change.config.name}"`
    );
    await cluster.buckets().dropBucket(change.config.name, opts);
    console.log(
      `${getTimePrefix()} Waiting for bucket "${change.config.name}" to be dropped`
    );
    await waitForBucket(apiConfig, change.config.name, opts);
    console.log(`${getTimePrefix()} Bucket "${change.config.name}" created`);
  }

  console.log(`${getTimePrefix()} Requesting creation of bucket "${change.config.name}"`);
  await cluster.buckets().createBucket(change.config, opts);
  console.log(
    `${getTimePrefix()} Waiting for bucket "${change.config.name}" to be created`
  );
  await waitForBucket(apiConfig, change.config.name, opts);
  console.log(`${getTimePrefix()} Bucket "${change.config.name}" created`);
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

  console.log(
    `${getTimePrefix()} Requesting creation of scope "${change.bucket}.${change.name}"`
  );
  await cluster.bucket(change.bucket).collections().createScope(change.name, opts);
  console.log(
    `${getTimePrefix()} Waiting for scope "${change.bucket}.${change.name}" to be created`
  );
  await waitForScope(apiConfig, change.bucket, change.name, opts);
  console.log(`${getTimePrefix()} Scope "${change.bucket}.${change.name}" created`);
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

  console.log(
    `${getTimePrefix()} Requesting deletion of scope "${change.bucket}.${change.name}"`
  );
  await cluster.bucket(change.bucket).collections().dropScope(change.name, opts);
  console.log(
    `${getTimePrefix()} Waiting for scope "${change.bucket}.${change.name}" to be dropped`
  );
  await waitForScope(apiConfig, change.bucket, change.name, {
    ...opts,
    expectMissing: true,
  });
  console.log(`${getTimePrefix()} Scope "${change.bucket}.${change.name}" dropped`);
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
    `${getTimePrefix()} Requesting creation of collection "${change.bucket}.${change.scope}.${change.name}"`
  );
  await cluster
    .bucket(change.bucket)
    .collections()
    .createCollection(change.name, change.scope, change, opts);
  console.log(
    `${getTimePrefix()} Waiting for collection "${change.bucket}.${change.scope}.${change.name}" to be created`
  );
  await waitForCollection(apiConfig, change.bucket, change.scope, change.name, opts);
  console.log(
    `${getTimePrefix()} Collection "${change.bucket}.${change.scope}.${change.name}" created`
  );
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
    `${getTimePrefix()} Requesting deletion of collection "${change.bucket}.${change.scope}.${change.name}"`
  );
  await cluster
    .bucket(change.bucket)
    .collections()
    .dropCollection(change.name, change.scope, opts);
  console.log(
    `${getTimePrefix()} Waiting for collection "${change.bucket}.${change.scope}.${change.name}" to be dropped`
  );
  await waitForCollection(apiConfig, change.bucket, change.scope, change.name, opts);
  console.log(
    `${getTimePrefix()} Collection "${change.bucket}.${change.scope}.${change.name}" dropped`
  );
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
    `${getTimePrefix()} Requesting update of collection "${change.bucket}.${change.scope}.${change.name}"`
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
    `${getTimePrefix()} Requesting creation of index "${change.bucket}.${change.scope}.${change.collection} # ${change.name}"`
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
    `${getTimePrefix()} Waiting for index "${change.bucket}.${change.scope}.${change.collection} # ${change.name}" to be created`
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
    `${getTimePrefix()} Index "${change.bucket}.${change.scope}.${change.collection} # ${change.name}" created`
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
    `${getTimePrefix()} Requesting deletion of index "${change.bucket}.${change.scope}.${change.collection} # ${change.name}"`
  );
  await cluster
    .bucket(change.bucket)
    .scope(change.scope)
    .collection(change.collection)
    .queryIndexes()
    .dropIndex(change.name, opts);

  console.log(
    `${getTimePrefix()} Waiting for index "${change.bucket}.${change.scope}.${change.collection} # ${change.name}" to be dropped`
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
    `${getTimePrefix()} Index "${change.bucket}.${change.scope}.${change.collection} # ${change.name}" dropped`
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
    `${getTimePrefix()} Requesting update of index "${change.bucket}.${change.scope}.${change.collection} # ${change.name}"`
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

async function applyCreateUser(
  cluster: Cluster,
  apiConfig: CouchbaseHttpApiConfig,
  change: CouchbaseClusterChangeCreateUser,
  opts: ChangeOptions
) {
  console.log(`${getTimePrefix()} Requesting creation of user "${change.user.username}"`);
  await cluster.users().upsertUser(change.user, {
    ...opts,
    domainName: change.user.domain,
  });
  console.log(`${getTimePrefix()} Awaiting user "${change.user.username}" to be created`);
  await waitForUser(apiConfig, change.user.username, change.user.domain, opts);
  console.log(`${getTimePrefix()} User "${change.user.username}" created`);
}

async function applyUpdateUser(
  cluster: Cluster,
  apiConfig: CouchbaseHttpApiConfig,
  change: CouchbaseClusterChangeUpdateUser,
  opts: ChangeOptions
) {
  const users = await cluster.users().getAllUsers();
  const currentUser = users.find(
    (u) =>
      u.username === change.user.username && (u.domain ?? 'local') === change.user.domain
  );

  if (!currentUser) {
    throw new Error(
      `User ${change.user.username} in domain ${change.user.domain} was scheduled for an update but was not found.`
    );
  }

  if (
    currentUser.displayName !== change.user.displayName ||
    currentUser.domain !== change.user.domain ||
    JSON.stringify(currentUser.groups) !== JSON.stringify(change.user.groups) ||
    JSON.stringify(currentUser.roles) !== JSON.stringify(change.user.roles)
  ) {
    console.log(`${getTimePrefix()} Requesting update of user "${change.user.username}"`);
    await cluster.users().upsertUser(change.user, {
      ...opts,
      domainName: change.user.domain,
    });

    console.log(
      `${getTimePrefix()} Awaiting user "${change.user.username}" to be updated`
    );
    await waitForUser(apiConfig, change.user.username, change.user.domain, opts);
    console.log(`${getTimePrefix()} User "${change.user.username}" updated`);
  }
}

async function applyUpdateUserPassword(
  cluster: Cluster,
  apiConfig: CouchbaseHttpApiConfig,
  change: CouchbaseClusterChangeUpdateUserPassword,
  opts: ChangeOptions
) {
  const localApiConfig: CouchbaseHttpApiConfig = {
    ...apiConfig,
    credentials: {
      username: change.username,
      password: change.password,
    },
  };

  await updateUserPassword(localApiConfig, change.newPassword);

  console.log(`${getTimePrefix()} Awaiting user "${change.username}" to be updated`);

  await waitForUser(apiConfig, change.username, 'local', opts);
  await waitFor(async () => {
    await whoami({
      ...apiConfig,
      credentials: {
        username: change.username,
        password: change.newPassword,
      },
    });
  }, opts);

  console.log(`${getTimePrefix()} User "${change.username}" updated`);
}

async function applyRecreateUser(
  cluster: Cluster,
  apiConfig: CouchbaseHttpApiConfig,
  change: CouchbaseClusterChangeRecreateUser,
  opts: ChangeOptions
) {
  const users = await cluster.users().getAllUsers();
  const user = users.find(
    (u) =>
      u.username === change.user.username && (u.domain ?? 'local') === change.user.domain
  );

  if (user) {
    await applyDropUser(cluster, apiConfig, { ...change, type: 'dropUser' }, opts);
  }

  await applyCreateUser(cluster, apiConfig, { ...change, type: 'createUser' }, opts);
}

async function applyDropUser(
  cluster: Cluster,
  apiConfig: CouchbaseHttpApiConfig,
  change: CouchbaseClusterChangeDropUser,
  opts: ChangeOptions
) {
  console.log(`${getTimePrefix()} Requesting deletion of user "${change.user.username}"`);
  await cluster.users().dropUser(change.user.username, {
    ...opts,
    domainName: change.user.domain,
  });
  console.log(`${getTimePrefix()} Awaiting user "${change.user.username}" to be dropped`);
  await waitForUser(apiConfig, change.user.username, change.user.domain, {
    ...opts,
    expectMissing: true,
  });
  console.log(`${getTimePrefix()} User "${change.user.username}" dropped`);
}

async function applyCreateSearchIndex(
  cluster: Cluster,
  apiConfig: CouchbaseHttpApiConfig,
  change:
    | CouchbaseClusterChangeCreateSearchIndex
    | CouchbaseClusterChangeUpdateSearchIndex,
  opts: ChangeOptions
) {
  const bucket = await getBucket(apiConfig, change.bucket);
  const config = change.configFn({ sourceName: change.bucket, sourceUUID: bucket.uuid });

  console.log(
    `${getTimePrefix()} Requesting creation of search index "${change.bucket} # ${change.name}"`
  );

  await cluster.searchIndexes().upsertIndex(
    {
      ...config,
      name: change.name,
    },
    opts
  );

  console.log(
    `${getTimePrefix()} Waiting for search index "${change.bucket} # ${change.name}" to be created`
  );
  await waitForSearchIndex(
    apiConfig,
    change.name,
    {
      bucket: change.bucket,
    },
    opts
  );
  console.log(
    `${getTimePrefix()} Search index "${change.bucket} # ${change.name}" created`
  );
}

async function applyDropSearchIndex(
  cluster: Cluster,
  apiConfig: CouchbaseHttpApiConfig,
  change: CouchbaseClusterChangeDropSearchIndex,
  opts: ChangeOptions
) {
  console.log(
    `${getTimePrefix()} Requesting deletion of search index "${change.bucket} # ${change.name}"`
  );

  await cluster.searchIndexes().dropIndex(change.name);

  console.log(
    `${getTimePrefix()} Waiting for search index "${change.bucket} # ${change.name}" to be deleted`
  );
  await waitForSearchIndex(
    apiConfig,
    change.name,
    {
      bucket: change.bucket,
    },
    {
      ...opts,
      expectMissing: true,
    }
  );
  console.log(
    `${getTimePrefix()} Search index "${change.bucket} # ${change.name}" deleted`
  );
}
