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
import { describe, expectTypeOf, it } from 'vitest';

import { ClusterTypes, connect, DocDef, QueryMetrics, Scope } from './index.js';

describe('cluster', () => {
  describe('DefaultClusterTypes', async () => {
    const cluster = await connect('couchbase://localhost');

    it('Cluster should accept any bucket name', async () => {
      cluster.bucket('foobar');
    });

    it('Bucket should accept any scope name', async () => {
      cluster.bucket('foobar').scope('foobar');
    });

    it('Scope should accept any collection name', async () => {
      cluster.bucket('foobar').scope('foobar').collection('foobar');
    });

    it("should return the bucket's default collection", async () => {
      expectTypeOf(cluster.bucket('foobar').defaultCollection()).not.toBeNever();
    });
  });

  describe('UserClusterTypes', async () => {
    type Book = {
      title: string;
    };

    type User = {
      name: string;
    };

    type Order = {
      id: string;
    };

    type UserClusterTypes = ClusterTypes<{
      backend: {
        users: {
          admins: [DocDef<`user::${string}`, User>];
        };
      };
      store: {
        grocery: {
          orders: [DocDef<`order::${string}`, Order>];
        };
        library: {
          books: [DocDef<`book::${string}`, Book>];
        };
      };
    }>;

    const cluster = await connect<UserClusterTypes>('couchbase://localhost');

    it('Cluster should accept any registered bucket name', async () => {
      const bucket = cluster.bucket('backend');
    });

    it('Cluster should preserve all registered buckets', async () => {
      const bucket = cluster.bucket('backend');
      bucket.cluster.bucket('store');
    });

    it('Bucket should accept any registered scope name', async () => {
      const bucket = cluster.bucket('backend').scope('users');
    });

    it('Bucket should preserve all registered scopes', async () => {
      const userScope = cluster.bucket('backend').scope('users');
      const libraryScope = userScope.cluster.bucket('store').scope('library');
    });

    it('Scope should accept any registered collection name', async () => {
      const adminsCollection = cluster
        .bucket('backend')
        .scope('users')
        .collection('admins');
    });

    it('Scope should preserve any registered collection name', async () => {
      const adminsCollection = cluster
        .bucket('backend')
        .scope('users')
        .collection('admins');
      const booksCollection = adminsCollection.cluster
        .bucket('store')
        .scope('library')
        .collection('books');
    });

    it("should return the bucket's default collection", async () => {
      expectTypeOf(cluster.bucket('backend').defaultCollection()).not.toBeNever();
    });
  });

  it('should infer the metrics type from the query options', async () => {
    const cluster = await connect('...');

    // Missing metrics
    const result = await cluster.query('SELECT * FROM store');
    expectTypeOf(result.meta.metrics).toEqualTypeOf<undefined>();

    // Metrics present
    const resultWithMetrics = await cluster.query('SELECT * FROM store', {
      metrics: true,
    });

    expectTypeOf(resultWithMetrics.meta.metrics).toEqualTypeOf<QueryMetrics>();
  });
});
