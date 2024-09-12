/*
 * Copyright (c) 2023-Present Jonathan MASSUCHETTI <jonathan.massuchetti@dappit.fr>.
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
import { describe, it } from 'vitest';

import { connect } from '@cbjsdev/cbjs';
import {
  applyCouchbaseClusterChanges,
  CouchbaseClusterConfig,
  getCouchbaseClusterChanges,
} from '@cbjsdev/deploy';
import { getApiConfig, getConnectionParams, invariant } from '@cbjsdev/shared';
import { getRandomId } from '@cbjsdev/vitest';

describe('applyCouchbaseClusterChanges', () => {
  it('should apply all the changes', { timeout: 180_000 }, async ({ expect }) => {
    const bucketName = 'cbjs_' + getRandomId();
    const scopeName = getRandomId();
    const collectionName1 = getRandomId();
    const collectionName2 = getRandomId();

    const clusterConfig: CouchbaseClusterConfig = {
      [bucketName]: {
        ramQuotaMB: 100,
        numReplicas: 0,
        scopes: {
          [scopeName]: {
            collections: {
              [collectionName1]: {
                indexes: {
                  c1_title: {
                    keys: ['title'],
                  },
                },
              },
              [collectionName2]: {
                indexes: {
                  c2_group: {
                    keys: ['groupId'],
                  },
                },
              },
            },
          },
        },
      },
    };

    const params = getConnectionParams();
    const cluster = await connect(params.connectionString, params.credentials);
    const changes = getCouchbaseClusterChanges({}, clusterConfig);

    console.log(
      `The following changes have been detected in the cluster : \n\t${changes.map((c) => JSON.stringify(c)).join('\n\t')}`
    );

    await applyCouchbaseClusterChanges(cluster, getApiConfig(false), changes, {
      timeout: 30_000,
    });

    await expect(cluster.buckets().getBucket(bucketName)).resolves.toBeDefined();

    const scopes = await cluster.bucket(bucketName).collections().getAllScopes();
    const scope = scopes.find((s) => s.name === scopeName);

    expect(scope).toBeDefined();

    invariant(scope);

    expect(scope.collections.find((c) => c.name === collectionName1)).toBeDefined();
    expect(scope.collections.find((c) => c.name === collectionName2)).toBeDefined();

    console.log('Cleaning up...');

    await cluster.buckets().dropBucket(bucketName);
  });
});
