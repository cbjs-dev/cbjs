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
import { describe, expectTypeOf, it, test } from 'vitest';

import type {
  CodeCompletionSinglePass,
  DocumentCodeCompletion,
  FriendlyPathToArrayIndex,
  KvOperation,
  UnionToTree,
} from './path-utils.types.js';

describe('FriendlyPathToArrayIndex', () => {
  it('should not add a friendly path to path that do not point to array index', () => {
    // TODO
    // expectTypeOf<
    //   FriendlyPathToArrayIndex<
    //     DocumentPath<{ metadata: { tags: string[] } }> | LookupInMacroShape
    //   >
    // >().toEqualTypeOf<
    //   | 'metadata'
    //   | 'metadata.tags'
    //   | `metadata.tags[${number}]`
    //   | 'metadata.tags[]'
    //   | LookupInMacroShape
    // >();
  });
});

type TestCC<Op extends KvOperation, Prefix extends string, T> = Extract<
  CodeCompletionSinglePass<Prefix, T>,
  [Op, string, unknown?]
>;

describe('ArrayAppendCodeCompletion', () => {
  test('array', () => {
    type Test = TestCC<'arrayAppend', 'arr', string[]>;
    expectTypeOf<Test>().toEqualTypeOf<['arrayAppend', 'arr', string]>();
  });

  test('readonly array', () => {
    type Test = TestCC<'arrayAppend', 'arr', readonly string[]>;
    expectTypeOf<Test>().toEqualTypeOf<never>();
  });

  test('tuple', () => {
    type Test = TestCC<'arrayAppend', 'arr', [string]>;
    expectTypeOf<Test>().toEqualTypeOf<never>();
  });

  test('tuple with variadic head', () => {
    type Test = TestCC<'arrayAppend', 'arr', [...number[], string]>;
    expectTypeOf<Test>().toEqualTypeOf<never>();
  });

  test('tuple with variadic head same type', () => {
    type Test = TestCC<'arrayAppend', 'arr', [...string[], string]>;
    expectTypeOf<Test>().toEqualTypeOf<['arrayAppend', 'arr', string]>();
  });

  test('tuple with variadic tail', () => {
    type Test = TestCC<'arrayAppend', 'arr', [string, ...number[]]>;
    expectTypeOf<Test>().toEqualTypeOf<['arrayAppend', 'arr', number]>();
  });

  test('tuple with variadic tail same type', () => {
    type Test = TestCC<'arrayAppend', 'arr', [number, ...number[]]>;
    expectTypeOf<Test>().toEqualTypeOf<['arrayAppend', 'arr', number]>();
  });

  test('tuple with optional element', () => {
    type Test = TestCC<'arrayAppend', 'arr', [string, number?]>;
    expectTypeOf<Test>().toEqualTypeOf<['arrayAppend', 'arr', number]>();
  });
});

describe('ArrayPrependCodeCompletion', () => {
  test('array', () => {
    type Test = TestCC<'arrayPrepend', 'arr', string[]>;
    expectTypeOf<Test>().toEqualTypeOf<['arrayPrepend', 'arr', string]>();
  });

  test('readonly array', () => {
    type Test = TestCC<'arrayPrepend', 'arr', readonly string[]>;
    expectTypeOf<Test>().toEqualTypeOf<never>();
  });

  test('tuple', () => {
    type Test = TestCC<'arrayPrepend', 'arr', [string]>;
    expectTypeOf<Test>().toEqualTypeOf<never>();
  });

  test('tuple with variadic head', () => {
    type Test = TestCC<'arrayPrepend', 'arr', [...number[], string]>;
    expectTypeOf<Test>().toEqualTypeOf<['arrayPrepend', 'arr', number]>();
  });

  test('tuple with variadic head same type', () => {
    type Test = TestCC<'arrayPrepend', 'arr', [...string[], string]>;
    expectTypeOf<Test>().toEqualTypeOf<['arrayPrepend', 'arr', string]>();
  });

  test('tuple with variadic tail', () => {
    type Test = TestCC<'arrayPrepend', 'arr', [string, ...number[]]>;
    expectTypeOf<Test>().toEqualTypeOf<never>();
  });

  test('tuple with variadic tail same type', () => {
    type Test = TestCC<'arrayPrepend', 'arr', [string, ...string[]]>;
    expectTypeOf<Test>().toEqualTypeOf<['arrayPrepend', 'arr', string]>();
  });

  test('tuple with optional element', () => {
    type Test = TestCC<'arrayPrepend', 'arr', [string, number?]>;
    expectTypeOf<Test>().toEqualTypeOf<never>();
  });
});

describe('ArrayInsertCodeCompletion', () => {
  test('array', () => {
    type Test = TestCC<'arrayInsert', 'arr', string[]>;
    expectTypeOf<Test>().toEqualTypeOf<['arrayInsert', `arr[${number}]`, string]>();
  });

  test('readonly array', () => {
    type Test = TestCC<'arrayInsert', 'arr', readonly string[]>;
    expectTypeOf<Test>().toEqualTypeOf<never>();
  });

  test('tuple', () => {
    type Test = TestCC<'arrayInsert', 'arr', [string]>;
    expectTypeOf<Test>().toEqualTypeOf<never>();
  });

  test('tuple with variadic head', () => {
    type Test = TestCC<'arrayInsert', 'arr', [...number[], string]>;
    expectTypeOf<Test>().toEqualTypeOf<['arrayInsert', `arr[${number}]`, number]>();
  });

  test('tuple with variadic head same type', () => {
    type Test = TestCC<'arrayInsert', 'arr', [...string[], string]>;
    expectTypeOf<Test>().toEqualTypeOf<['arrayInsert', `arr[${number}]`, string]>();
  });

  test('tuple with variadic tail', () => {
    type Test = TestCC<'arrayInsert', 'arr', [string, ...number[]]>;
    expectTypeOf<Test>().toEqualTypeOf<
      ['arrayInsert', `arr[0]`, never] | ['arrayInsert', `arr[${number}]`, number]
    >();
  });

  test('tuple with variadic tail same type', () => {
    type Test = TestCC<'arrayInsert', 'arr', [string, ...string[]]>;
    expectTypeOf<Test>().toEqualTypeOf<
      ['arrayInsert', `arr[0]`, string] | ['arrayInsert', `arr[${number}]`, string]
    >();
  });

  test('tuple with optional element', () => {
    type Test = TestCC<'arrayInsert', 'arr', [string, number?]>;
    expectTypeOf<Test>().toEqualTypeOf<
      ['arrayInsert', 'arr[0]', never] | ['arrayInsert', 'arr[1]', number]
    >();
  });
});

describe('RemoveCodeCompletion', () => {
  test('array', () => {
    type Test = TestCC<'remove', 'arr', string[]>;
    expectTypeOf<Test>().toEqualTypeOf<
      ['remove', `arr[${number}]`, true] | ['remove', `arr[-1]`, true]
    >();
  });

  test('readonly array', () => {
    type Test = TestCC<'remove', 'arr', readonly string[]>;
    expectTypeOf<Test>().toEqualTypeOf<never>();
  });

  test('tuple', () => {
    type Test = TestCC<'remove', 'arr', [string]>;
    expectTypeOf<Test>().toEqualTypeOf<never>();
  });

  test('tuple with variadic head', () => {
    type Test = TestCC<'remove', 'arr', [...number[], string]>;
    expectTypeOf<Test>().toEqualTypeOf<
      ['remove', `arr[-1]`, false] | ['remove', `arr[${number}]`, true]
    >();
  });

  test('tuple with variadic head same type', () => {
    type Test = TestCC<'remove', 'arr', [...string[], string]>;
    expectTypeOf<Test>().toEqualTypeOf<
      ['remove', `arr[${number}]`, true] | ['remove', `arr[-1]`, true]
    >();
  });

  test('tuple with variadic tail', () => {
    type Test = TestCC<'remove', 'arr', [string, ...number[]]>;
    expectTypeOf<Test>().toEqualTypeOf<
      | ['remove', `arr[${number}]`, true]
      | ['remove', `arr[0]`, false]
      | ['remove', `arr[-1]`, true]
    >();
  });

  test('tuple with variadic tail same type', () => {
    type Test = TestCC<'remove', 'arr', [string, ...string[]]>;
    expectTypeOf<Test>().toEqualTypeOf<
      | ['remove', `arr[${number}]`, true]
      | ['remove', `arr[0]`, true]
      | ['remove', `arr[-1]`, true]
    >();
  });

  test('tuple with optional element', () => {
    type Test = TestCC<'remove', 'arr', [string, number?]>;
    expectTypeOf<Test>().toEqualTypeOf<
      | ['remove', 'arr[0]', false]
      | ['remove', 'arr[1]', true]
      | ['remove', 'arr[-1]', true]
    >();
  });

  test('object with no optional property', () => {
    type Test = TestCC<'remove', 'obj', { title: string }>;
    expectTypeOf<Test>().toEqualTypeOf<never>();
  });

  test('object with some optional properties', () => {
    type Test = TestCC<
      'remove',
      'obj',
      { title: string; description?: string; metadata?: { tags: string[] } }
    >;
    expectTypeOf<Test>().toEqualTypeOf<
      ['remove', 'obj.description', true] | ['remove', 'obj.metadata', true]
    >();
  });

  test('object with some properties that can be undefined', () => {
    type Test = TestCC<
      'remove',
      'obj',
      { title: string; description: string | undefined }
    >;
    expectTypeOf<Test>().toEqualTypeOf<never>();
  });
});

describe('ReplaceCodeCompletion', () => {
  test('array', () => {
    type Test = TestCC<'replace', 'arr', string[]>;
    expectTypeOf<Test>().toEqualTypeOf<
      ['replace', `arr[${number}]`, string] | ['replace', `arr[-1]`, string]
    >();
  });

  test('readonly array', () => {
    type Test = TestCC<'replace', 'arr', readonly string[]>;
    expectTypeOf<Test>().toEqualTypeOf<never>();
  });

  test('tuple', () => {
    type Test = TestCC<'replace', 'arr', [string]>;
    expectTypeOf<Test>().toEqualTypeOf<
      ['replace', 'arr[0]', string] | ['replace', 'arr[-1]', string]
    >();
  });

  test('tuple with variadic head', () => {
    type Test = TestCC<'replace', 'arr', [...number[], string]>;
    expectTypeOf<Test>().toEqualTypeOf<
      ['replace', `arr[${number}]`, number | string] | ['replace', 'arr[-1]', string]
    >();
  });

  test('tuple with variadic head same type', () => {
    type Test = TestCC<'replace', 'arr', [...string[], string]>;
    expectTypeOf<Test>().toEqualTypeOf<
      ['replace', `arr[${number}]`, string] | ['replace', `arr[-1]`, string]
    >();
  });

  test('tuple with variadic tail', () => {
    type Test = TestCC<'replace', 'arr', [string, ...number[]]>;
    expectTypeOf<Test>().toEqualTypeOf<
      | ['replace', `arr[${number}]`, string | number]
      | ['replace', `arr[0]`, string]
      | ['replace', `arr[-1]`, string | number]
    >();
  });

  test('tuple with variadic tail same type', () => {
    type Test = TestCC<'replace', 'arr', [string, ...string[]]>;
    expectTypeOf<Test>().toEqualTypeOf<
      | ['replace', `arr[${number}]`, string]
      | ['replace', `arr[0]`, string]
      | ['replace', `arr[-1]`, string]
    >();
  });

  test('tuple with optional element', () => {
    type Test = TestCC<'replace', 'arr', [string, number?]>;
    expectTypeOf<Test>().toEqualTypeOf<
      | ['replace', 'arr[0]', string]
      | ['replace', 'arr[1]', number]
      | ['replace', 'arr[-1]', string | number]
    >();
  });

  test('object with no optional property', () => {
    type Test = TestCC<'replace', 'obj', { title: string }>;
    expectTypeOf<Test>().toEqualTypeOf<['replace', 'obj.title', string]>();
  });

  test('object with some optional properties', () => {
    type Test = TestCC<
      'replace',
      'obj',
      { title: string; description?: string; metadata?: { tags: string[] } }
    >;
    expectTypeOf<Test>().toEqualTypeOf<
      | ['replace', 'obj.title', string]
      | ['replace', 'obj.description', string]
      | ['replace', 'obj.metadata', { tags: string[] }]
    >();
  });

  test('object with some properties that can be undefined', () => {
    type Test = TestCC<
      'replace',
      'obj',
      { title: string; description: string | undefined }
    >;
    expectTypeOf<Test>().toEqualTypeOf<
      ['replace', 'obj.title', string] | ['replace', 'obj.description', string]
    >();
  });
});

describe('GetCodeCompletion', () => {
  test('array', () => {
    type Test = TestCC<'get', 'arr', string[]>;
    expectTypeOf<Test>().toEqualTypeOf<
      | ['get', 'arr', string[]]
      | ['get', `arr[${number}]`, string]
      | ['get', `arr[-1]`, string]
    >();
  });

  test('readonly array', () => {
    type Test = TestCC<'get', 'arr', readonly string[]>;
    expectTypeOf<Test>().toEqualTypeOf<
      | ['get', 'arr', readonly string[]]
      | ['get', `arr[${number}]`, string]
      | ['get', `arr[-1]`, string]
    >();
  });

  test('tuple', () => {
    type Test = TestCC<'get', 'arr', [string]>;
    expectTypeOf<Test>().toEqualTypeOf<
      ['get', 'arr', [string]] | ['get', `arr[0]`, string] | ['get', `arr[-1]`, string]
    >();
  });

  test('tuple with variadic head', () => {
    type Test = TestCC<'get', 'arr', [...number[], string]>;
    expectTypeOf<Test>().toEqualTypeOf<
      | ['get', 'arr', [...number[], string]]
      | ['get', `arr[${number}]`, string | number]
      | ['get', `arr[-1]`, string] // TODO test is correct, fix impl
    >();
  });

  test('tuple with variadic head same type', () => {
    type Test = TestCC<'get', 'arr', [...string[], string]>;
    expectTypeOf<Test>().toEqualTypeOf<
      | ['get', 'arr', [...string[], string]]
      | ['get', `arr[${number}]`, string]
      | ['get', `arr[-1]`, string]
    >();
  });

  test('tuple with variadic tail', () => {
    type Test = TestCC<'get', 'arr', [string, ...number[]]>;
    expectTypeOf<Test>().toEqualTypeOf<
      | ['get', 'arr', [string, ...number[]]]
      | ['get', `arr[${number}]`, string | number]
      | ['get', `arr[0]`, string]
      | ['get', `arr[-1]`, string | number]
    >();
  });

  test('tuple with variadic tail same type', () => {
    type Test = TestCC<'get', 'arr', [string, ...string[]]>;
    expectTypeOf<Test>().toEqualTypeOf<
      | ['get', 'arr', [string, ...string[]]]
      | ['get', `arr[${number}]`, string]
      | ['get', `arr[0]`, string]
      | ['get', `arr[-1]`, string]
    >();
  });

  test('tuple with optional element', () => {
    type Test = TestCC<'get', 'arr', [string, number?]>;
    expectTypeOf<Test>().toEqualTypeOf<
      | ['get', `arr`, [string, number?]]
      | ['get', `arr[0]`, string]
      | ['get', `arr[1]`, number] // TODO test is correct, fix impl exclude undefined
      | ['get', `arr[-1]`, string | number]
    >();
  });

  test('object with no optional property', () => {
    type Test = TestCC<'get', 'obj', { title: string }>;
    expectTypeOf<Test>().toEqualTypeOf<
      ['get', 'obj', { title: string }] | ['get', `obj.title`, string]
    >();
  });

  test('object with some optional properties', () => {
    type TestDoc = { title: string; description?: string; metadata?: { tags: string[] } };
    type Test = TestCC<'get', 'obj', TestDoc>;

    expectTypeOf<Test>().toEqualTypeOf<
      | ['get', 'obj', TestDoc]
      | ['get', 'obj.title', string]
      | ['get', 'obj.description', string]
      | ['get', 'obj.metadata', { tags: string[] }]
    >();
  });

  test('object with some properties that can be undefined', () => {
    type TestDoc = { title: string; description: string | undefined };
    type Test = TestCC<'get', 'obj', TestDoc>;
    expectTypeOf<Test>().toEqualTypeOf<
      | ['get', 'obj', TestDoc]
      | ['get', 'obj.title', string]
      | ['get', 'obj.description', string]
    >();
  });
});

describe('CountCodeCompletion', () => {
  type Arr = string[];
  type Obj = { title: string };

  test('array', () => {
    type Test = TestCC<'count', 'arr', Arr[]>;
    expectTypeOf<Test>().toEqualTypeOf<['count', `arr`]>();
  });

  test('object', () => {
    type Test = TestCC<'count', 'obj', Obj>;
    expectTypeOf<Test>().toEqualTypeOf<['count', 'obj']>();
  });

  test('primitive', () => {
    type Test = TestCC<'count', 'prop', string>;
    expectTypeOf<Test>().toEqualTypeOf<never>();
  });
});

describe('DocumentCodeCompletion', () => {
  test('root array', () => {
    type Test = UnionToTree<DocumentCodeCompletion<KvOperation, string[]>>;

    expectTypeOf<Test['get']>().toEqualTypeOf<
      ['get', '', string[]] | ['get', `[${number}]`, string] | ['get', `[-1]`, string]
    >();

    expectTypeOf<Test['exists']>().toEqualTypeOf<['exists', `[${number}]`]>();

    expectTypeOf<Test['count']>().toEqualTypeOf<['count', ``]>();

    expectTypeOf<Test['upsert']>().toEqualTypeOf<['upsert', '', string[]]>();

    expectTypeOf<Test['replace']>().toEqualTypeOf<
      ['replace', `[${number}]`, string] | ['replace', `[-1]`, string]
    >();

    expectTypeOf<Test['remove']>().toEqualTypeOf<
      ['remove', `[${number}]`, true] | ['remove', `[-1]`, true]
    >();

    expectTypeOf<Test['arrayAppend']>().toEqualTypeOf<['arrayAppend', '', string]>();

    expectTypeOf<Test['arrayPrepend']>().toEqualTypeOf<['arrayPrepend', '', string]>();

    expectTypeOf<Test['arrayInsert']>().toEqualTypeOf<
      ['arrayInsert', `[${number}]`, string]
    >();
  });

  test('root object', () => {
    type TestDoc = { title: string };
    type Test = UnionToTree<DocumentCodeCompletion<KvOperation, TestDoc>>;

    expectTypeOf<keyof Test>().toEqualTypeOf<
      'get' | 'exists' | 'count' | 'upsert' | 'replace'
    >();

    expectTypeOf<Test['get']>().toEqualTypeOf<
      ['get', '', TestDoc] | ['get', `title`, string]
    >();
    expectTypeOf<Test['count']>().toEqualTypeOf<['count', '']>();
    expectTypeOf<Test['exists']>().toEqualTypeOf<['exists', 'title']>();
    expectTypeOf<Test['replace']>().toEqualTypeOf<['replace', `title`, string]>();
    expectTypeOf<Test['upsert']>().toEqualTypeOf<
      ['upsert', '', TestDoc] | ['upsert', `title`, string]
    >();
  });

  test('deep document', () => {
    type TestDoc = {
      title: string;
      sales?: number;
      authors: string[];
      audit: {
        readonly createdAt: number;
      };
      metadata?: { tags: string[] };
    };

    type Test = UnionToTree<DocumentCodeCompletion<KvOperation, TestDoc>>;

    type KeyofTest = keyof Test;
    expectTypeOf<KeyofTest>().toEqualTypeOf<
      | 'get'
      | 'count'
      | 'exists'
      // | 'insert' TODO
      | 'upsert'
      | 'replace'
      | 'remove'
      | 'arrayAppend'
      | 'arrayPrepend'
      | 'arrayInsert'
      | 'binary'
    >();

    type TestGet = DocumentCodeCompletion<'get', TestDoc>;

    expectTypeOf<TestGet>().toEqualTypeOf<
      | ['get', ``, TestDoc]
      | ['get', `title`, string]
      | ['get', `sales`, number]
      | ['get', `authors`, string[]]
      | ['get', `authors[${number}]`, string]
      | ['get', `authors[-1]`, string]
      | ['get', `metadata`, { tags: string[] }]
      | ['get', `metadata.tags`, string[]]
      | ['get', `metadata.tags[${number}]`, string]
      | ['get', `metadata.tags[-1]`, string]
      | ['get', `audit`, { readonly createdAt: number }]
      | ['get', `audit.createdAt`, number]
    >();

    type TestCount = DocumentCodeCompletion<'count', TestDoc>;
    expectTypeOf<TestCount>().toEqualTypeOf<
      | ['count', '']
      | ['count', 'metadata']
      | ['count', 'metadata.tags']
      | ['count', 'authors']
      | ['count', 'audit']
    >();

    type TestExists = DocumentCodeCompletion<'exists', TestDoc>;
    expectTypeOf<TestExists>().toEqualTypeOf<
      | ['exists', `title`]
      | ['exists', `sales`]
      | ['exists', `authors`]
      | ['exists', `authors[${number}]`]
      | ['exists', `metadata`]
      | ['exists', `metadata.tags`]
      | ['exists', `metadata.tags[${number}]`]
      | ['exists', `audit`]
      | ['exists', `audit.createdAt`]
    >();

    type TestUpsert = DocumentCodeCompletion<'upsert', TestDoc>;

    expectTypeOf<TestUpsert>().toEqualTypeOf<
      | ['upsert', ``, TestDoc]
      | ['upsert', `title`, string]
      | ['upsert', `sales`, number]
      | ['upsert', `authors`, string[]]
      | ['upsert', `metadata`, { tags: string[] }]
      | ['upsert', `metadata.tags`, string[]]
      | ['upsert', `audit`, { readonly createdAt: number }]
    >();

    type TestReplace = DocumentCodeCompletion<'replace', TestDoc>;
    expectTypeOf<TestReplace>().toEqualTypeOf<
      | ['replace', `title`, string]
      | ['replace', `sales`, number]
      | ['replace', `authors`, string[]]
      | ['replace', `authors[${number}]`, string]
      | ['replace', `authors[-1]`, string]
      | ['replace', `metadata`, { tags: string[] }]
      | ['replace', `metadata.tags`, string[]]
      | ['replace', `metadata.tags[${number}]`, string]
      | ['replace', `metadata.tags[-1]`, string]
      | ['replace', `audit`, { readonly createdAt: number }]
    >();

    type TestRemove = DocumentCodeCompletion<'remove', TestDoc>;
    expectTypeOf<TestRemove>().toEqualTypeOf<
      | ['remove', `sales`, true]
      | ['remove', `metadata`, true]
      | ['remove', `authors[${number}]`, true]
      | ['remove', `authors[-1]`, true]
      | ['remove', `metadata.tags[${number}]`, true]
      | ['remove', `metadata.tags[-1]`, true]
    >();

    type TestArrayAppend = DocumentCodeCompletion<'arrayAppend', TestDoc>;
    expectTypeOf<TestArrayAppend>().toEqualTypeOf<
      ['arrayAppend', `metadata.tags`, string] | ['arrayAppend', `authors`, string]
    >();

    type TestArrayPrepend = DocumentCodeCompletion<'arrayPrepend', TestDoc>;
    expectTypeOf<TestArrayPrepend>().toEqualTypeOf<
      ['arrayPrepend', `metadata.tags`, string] | ['arrayPrepend', `authors`, string]
    >();

    type TestArrayInsert = DocumentCodeCompletion<'arrayInsert', TestDoc>;
    expectTypeOf<TestArrayInsert>().toEqualTypeOf<
      | ['arrayInsert', `metadata.tags[${number}]`, string]
      | ['arrayInsert', `authors[${number}]`, string]
    >();

    type TestBinary = DocumentCodeCompletion<'binary', TestDoc>;
    expectTypeOf<TestBinary>().toEqualTypeOf<['binary', 'sales']>();

    type TestBinary2 = DocumentCodeCompletion<'binary', { sales: [string, number] }>;
    expectTypeOf<TestBinary2>().toEqualTypeOf<
      ['binary', `sales[-1]`] | ['binary', `sales[1]`]
    >();

    type TestBinary3 = DocumentCodeCompletion<'binary', { sales: [number, string] }>;
    expectTypeOf<TestBinary3>().toEqualTypeOf<['binary', `sales[0]`]>();
  });
});
