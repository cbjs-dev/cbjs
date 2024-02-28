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

import { connect } from '../../couchbase';
import {
  GetReplicaResult,
  GetResult,
  LookupInResult,
  ScanResult,
} from '../../crudoptypes';
import { PrefixScan, SamplingScan } from '../../rangeScan';
import { LookupInSpec } from '../../sdspecs';
import { StreamableReplicasPromise } from '../../streamablepromises';
import { DocDef } from '../clusterTypes';

type Book = { title: string };
type QuarterSales = { sales: number[] };
type Docs = Book | QuarterSales;

type UserClusterTypes = {
  test: {
    _default: {
      _default:
        | DocDef<`book::${string}`, Book>
        | DocDef<`sales::${string}`, QuarterSales>;
      collectionTwo: DocDef<string, string[]>;
      collectionThree: DocDef<string, number[]>;
    };
  };
};

describe('Collection.get', function () {
  it('should return any if no cluster types are defined', async function () {
    const cluster = await connect('couchbase://127.0.0.1');
    const collection = cluster.bucket('test').defaultCollection();
    expectTypeOf(collection.get).returns.resolves.toEqualTypeOf<GetResult<any>>();
  });

  it('should narrow the doc using the key if types are defined', async function () {
    const cluster = await connect<UserClusterTypes>('couchbase://127.0.0.1');
    const collection = cluster.bucket('test').defaultCollection();
    const doc = await collection.get('book::001');
    expectTypeOf(doc).toEqualTypeOf<GetResult<Book, false>>();
  });
});

describe('Collection.getAnyReplica', function () {
  it('should return any if no cluster types are defined', async function () {
    const cluster = await connect('couchbase://127.0.0.1');
    const collection = cluster.bucket('test').defaultCollection();
    expectTypeOf(collection.getAnyReplica).returns.resolves.toEqualTypeOf<
      GetReplicaResult<any>
    >();
  });

  it('should narrow the doc using the key if types are defined', async function () {
    const cluster = await connect<UserClusterTypes>('couchbase://127.0.0.1');
    const collection = cluster.bucket('test').defaultCollection();
    const doc = await collection.getAnyReplica('book::001');
    expectTypeOf(doc).toEqualTypeOf<GetReplicaResult<Book>>();
  });
});

describe('Collection.getAllReplicas', function () {
  it('should return any if no cluster types are defined', async function () {
    const cluster = await connect('couchbase://127.0.0.1');
    const collection = cluster.bucket('test').defaultCollection();
    expectTypeOf(collection.getAllReplicas).returns.toEqualTypeOf<
      StreamableReplicasPromise<
        [GetReplicaResult<any>, ...GetReplicaResult<any>[]],
        GetReplicaResult<any>
      >
    >();
  });

  it('should narrow the doc using the key if types are defined', async function () {
    const cluster = await connect<UserClusterTypes>('couchbase://127.0.0.1');
    const collection = cluster.bucket('test').defaultCollection();
    const srp = collection.getAllReplicas('book::001');
    const replicas = await srp;

    expectTypeOf(srp).toEqualTypeOf<
      StreamableReplicasPromise<
        [GetReplicaResult<Book>, ...GetReplicaResult<Book>[]],
        GetReplicaResult<Book>
      >
    >();

    expectTypeOf(replicas).toEqualTypeOf<
      [GetReplicaResult<Book>, ...GetReplicaResult<Book>[]]
    >();
  });
});

describe('Collection.getAndTouch', function () {
  it('should return any if no cluster types are defined', async function () {
    const cluster = await connect('couchbase://127.0.0.1');
    const collection = cluster.bucket('test').defaultCollection();
    expectTypeOf(collection.getAndTouch).returns.resolves.toEqualTypeOf<GetResult<any>>();
  });

  it('should narrow the doc using the key if types are defined', async function () {
    const cluster = await connect<UserClusterTypes>('couchbase://127.0.0.1');
    const collection = cluster.bucket('test').defaultCollection();
    const doc = await collection.getAndTouch('book::001', 1);
    expectTypeOf(doc).toEqualTypeOf<GetResult<Book>>();
  });
});

describe('Collection.getAndLock', function () {
  it('should return any if no cluster types are defined', async function () {
    const cluster = await connect('couchbase://127.0.0.1');
    const collection = cluster.bucket('test').defaultCollection();
    expectTypeOf(collection.getAndLock).returns.resolves.toEqualTypeOf<GetResult<any>>();
  });

  it('should narrow the doc using the key if types are defined', async function () {
    const cluster = await connect<UserClusterTypes>('couchbase://127.0.0.1');
    const collection = cluster.bucket('test').defaultCollection();
    const doc = await collection.getAndLock('book::001', 1);
    expectTypeOf(doc).toEqualTypeOf<GetResult<Book>>();
  });
});

describe('Collection.scan', function () {
  it('should return any if no cluster types are defined', async function () {
    const cluster = await connect('couchbase://127.0.0.1');
    const collection = cluster.bucket('test').defaultCollection();
    const scanResult = await collection.scan(new SamplingScan(1));
    expectTypeOf(scanResult).toEqualTypeOf<ScanResult<DocDef<string, any>>[]>();
  });

  it('should narrow the doc using the key if types are defined', async function () {
    const cluster = await connect<UserClusterTypes>('couchbase://127.0.0.1');
    const collection = cluster.bucket('test').defaultCollection();
    const samplingScanResult = await collection.scan(new SamplingScan(1));
    expectTypeOf(samplingScanResult).toEqualTypeOf<
      ScanResult<
        | DocDef<`book::${string}`, { title: string }>
        | DocDef<`sales::${string}`, QuarterSales>
      >[]
    >();

    const prefixScanResult = await collection.scan(new PrefixScan('b'));
    expectTypeOf(prefixScanResult).toEqualTypeOf<
      ScanResult<
        | DocDef<`book::${string}`, { title: string }>
        | DocDef<`sales::${string}`, QuarterSales>
      >[]
    >();
  });
});

describe('Collection.insert', function () {
  it('should accept any value if no cluster types are defined', async function () {
    const cluster = await connect('couchbase://127.0.0.1');
    const collection = cluster.bucket('test').defaultCollection();
    expectTypeOf(collection.insert).parameter(1).toEqualTypeOf<any>();
  });

  it('should accept a collection doc matching the key if types are defined', async function () {
    const cluster = await connect<UserClusterTypes>('couchbase://127.0.0.1');
    const collection = cluster.bucket('test').defaultCollection();
    await collection.insert('book::001', { title: 'Couchbase, No Equal' });

    // @ts-expect-error Invalid value for the key
    await collection.insert('book::001', { sales: [1] });
  });
});

describe('Collection.upsert', function () {
  it('should accept any value if no cluster types are defined', async function () {
    const cluster = await connect('couchbase://127.0.0.1');
    const collection = cluster.bucket('test').defaultCollection();
    expectTypeOf(collection.upsert).parameter(1).toEqualTypeOf<any>();
  });

  it('should return a union of collection doc if types are defined', async function () {
    const cluster = await connect<UserClusterTypes>('couchbase://127.0.0.1');
    const collection = cluster.bucket('test').defaultCollection();
    await collection.upsert('book::001', { title: 'Couchbase, No Equal' });

    // @ts-expect-error Invalid value for the key
    await collection.upsert('book::001', { sales: [1] });
  });
});

describe('Collection.replace', function () {
  it('should accept any value if no cluster types are defined', async function () {
    const cluster = await connect('couchbase://127.0.0.1');
    const collection = cluster.bucket('test').defaultCollection();
    expectTypeOf(collection.replace).parameter(1).toEqualTypeOf<any>();
  });

  it('should return a union of collection doc if types are defined', async function () {
    const cluster = await connect<UserClusterTypes>('couchbase://127.0.0.1');
    const collection = cluster.bucket('test').defaultCollection();
    await collection.replace('book::001', { title: 'Couchbase, No Equal' });

    // @ts-expect-error Invalid value for the key
    await collection.replace('book::001', { sales: [1] });
  });
});

describe('Collection.remove', function () {
  it('should accept any value if no cluster types are defined', async function () {
    const cluster = await connect('couchbase://127.0.0.1');
    const collection = cluster.bucket('test').defaultCollection();
    expectTypeOf(collection.remove).parameter(0).toEqualTypeOf<string>();
  });

  it('should return a union of collection doc if types are defined', async function () {
    const cluster = await connect<UserClusterTypes>('couchbase://127.0.0.1');
    const collection = cluster.bucket('test').defaultCollection();
    await collection.remove('book::001');

    // @ts-expect-error Invalid value for the key
    await collection.remove('unknownKey');
  });
});

describe.todo('Collection.lookupIn', function () {
  it('should return any if no cluster types are defined', async function () {
    const cluster = await connect('couchbase://127.0.0.1');
    const collection = cluster.bucket('test').defaultCollection();
    const doc = await collection.lookupIn('book::001').get('title');
    expectTypeOf(doc).toEqualTypeOf<LookupInResult<[any]>>();
  });

  it('should narrow the doc using the key if types are defined', async function () {
    const cluster = await connect<UserClusterTypes>('couchbase://127.0.0.1');
    const collection = cluster.bucket('test').defaultCollection();
    const doc = await collection.lookupIn('book::001', [LookupInSpec.get('title')]);
    expectTypeOf(doc).toEqualTypeOf<LookupInResult<[string]>>();
  });
});
