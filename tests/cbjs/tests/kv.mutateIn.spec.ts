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
import {
  CasMismatchError,
  CouchbaseCas,
  DocumentExistsError,
  DocumentNotFoundError,
  MutateInSpec,
  StoreSemantics,
} from '@cbjs/cbjs';
import { getPool } from '@cbjs/http-client';
import { invariant } from '@cbjs/shared';
import { createCouchbaseTest, TestFixtures } from '@cbjs/vitest';
import { beforeEach, describe } from 'vitest';
import { apiConfig } from '../setupTests';

describe.shuffle('kv mutateIn', async () => {
  const test = await createCouchbaseTest(async ({ useDocumentKey }) => {
    return {
      testDocKey: useDocumentKey(),
      testDocContent: {
        int: 14,
        str: 'hello',
        arr: [1, 2, 3],
      },
      replicaNumber: (await getPool(apiConfig).then((p) => p.nodes.length)) - 1,
    };
  });

  beforeEach<TestFixtures<typeof test>>(async function ({
    serverTestContext,
    testDocKey,
    testDocContent,
  }) {
    await serverTestContext.collection.insert(testDocKey, testDocContent);
  });

  test('should mutateIn given specs', async ({
    serverTestContext,
    testDocKey,
    expect,
    useLogger,
  }) => {
    useLogger().trace(testDocKey);

    const res = await serverTestContext.collection.mutateIn(testDocKey, [
      MutateInSpec.increment('int', 3),
      MutateInSpec.upsert('str', 'newStr'),
      MutateInSpec.insert('newProp', 'newPropValue'),
      MutateInSpec.arrayAppend('arr', 4),
      MutateInSpec.arrayAppend('arr', [5, 6], { multi: true }),
    ]);

    expect(res.cas).toBeNonZeroCAS();
    expect(res.token).toBeMutationToken();

    expect(res.content[0].value).toEqual(17);
    expect(res.content[1]).toHaveProperty('value', undefined);
    expect(res.content[2]).toHaveProperty('value', undefined);
    expect(res.content[3]).toHaveProperty('value', undefined);
    expect(res.content[4]).toHaveProperty('value', undefined);

    const resultGet = await serverTestContext.collection.get(testDocKey);

    expect(resultGet.content).toStrictEqual({
      int: 17,
      str: 'newStr',
      newProp: 'newPropValue',
      arr: [1, 2, 3, 4, 5, 6],
    });
  });

  test('should create the document when mutateIn a missing document with StoreSemantics.Insert ', async ({
    serverTestContext,
    useDocumentKey,
    expect,
  }) => {
    const docKey = useDocumentKey();
    const res = await serverTestContext.collection.mutateIn(
      docKey,
      [
        MutateInSpec.increment('int', 3),
        MutateInSpec.upsert('str', 'newStr'),
        MutateInSpec.insert('newProp', 'newPropValue'),
        MutateInSpec.arrayAppend('arr', 1),
        MutateInSpec.arrayAppend('arr', [2, 3], { multi: true }),
      ],
      {
        storeSemantics: StoreSemantics.Insert,
      }
    );

    expect(res.cas).toBeNonZeroCAS();
    expect(res.token).toBeMutationToken();

    expect(res.content[0].value).toEqual(3);
    expect(res.content[1]).toHaveProperty('value', undefined);
    expect(res.content[2]).toHaveProperty('value', undefined);
    expect(res.content[3]).toHaveProperty('value', undefined);
    expect(res.content[4]).toHaveProperty('value', undefined);

    const resultGet = await serverTestContext.collection.get(docKey);

    expect(resultGet.content).toStrictEqual({
      int: 3,
      str: 'newStr',
      newProp: 'newPropValue',
      arr: [1, 2, 3],
    });
  });

  test('should throw DocumentExistsError when mutateIn an existing document with StoreSemantics.Insert ', async ({
    serverTestContext,
    testDocKey,
    expect,
  }) => {
    expect.hasAssertions();

    try {
      await serverTestContext.collection.mutateIn(
        testDocKey,
        [MutateInSpec.insert('prop', 'value')],
        {
          storeSemantics: StoreSemantics.Insert,
        }
      );
    } catch (err) {
      expect(err).toBeInstanceOf(DocumentExistsError);
      invariant(err instanceof DocumentExistsError);
      // TODO uncomment once the issue is fixed: JSCBC-1228
      // expect(err.context).toBeInstanceOf(HttpErrorContext);
    }
  });

  test('should throw DocumentNotFoundError when mutateIn a missing document with StoreSemantics.Replace ', async ({
    serverTestContext,
    useDocumentKey,
    expect,
  }) => {
    expect.hasAssertions();
    const docKey = useDocumentKey();

    try {
      await serverTestContext.collection.mutateIn(
        docKey,
        [MutateInSpec.insert('prop', 'value')],
        {
          storeSemantics: StoreSemantics.Replace,
        }
      );
    } catch (err) {
      expect(err).toBeInstanceOf(DocumentNotFoundError);
      invariant(err instanceof DocumentNotFoundError);
      // TODO uncomment once the issue is fixed: JSCBC-1228
      // expect(err.context).toBeInstanceOf(HttpErrorContext);
    }
  });

  test('should throw DocumentNotFoundError when mutateIn a missing document', async ({
    serverTestContext,
    expect,
  }) => {
    expect.hasAssertions();

    try {
      await serverTestContext.collection.mutateIn('missingDoc', [
        MutateInSpec.increment('int', 1),
      ]);
    } catch (err) {
      expect(err).toBeInstanceOf(DocumentNotFoundError);
      invariant(err instanceof DocumentNotFoundError);
      // TODO uncomment once the issue is fixed: JSCBC-1228
      // expect(err.context).toBeInstanceOf(HttpErrorContext);
    }
  });

  test('should throw CasMismatchError when mutateIn with the wrong CAS', async ({
    serverTestContext,
    testDocKey,
    expect,
  }) => {
    expect.hasAssertions();

    try {
      await serverTestContext.collection.mutateIn(
        testDocKey,
        [MutateInSpec.increment('int', 1)],
        {
          cas: CouchbaseCas.from(100),
        }
      );
    } catch (err) {
      expect(err).toBeInstanceOf(CasMismatchError);
      invariant(err instanceof CasMismatchError);
      // TODO uncomment once the issue is fixed: JSCBC-1228
      // expect(err.context).toBeInstanceOf(HttpErrorContext);
    }
  });
});
