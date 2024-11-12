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

import { OmitNeverValues } from './misc-utils.types.js';
import {
  CodeCompletionSinglePass,
  DocumentCodeCompletion,
  FriendlyPathToArrayIndex,
  KvOperation,
  OpCodeCompletionValue,
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

describe('ArrayAppendCodeCompletion', () => {
  test('array', () => {
    type Test = CodeCompletionSinglePass<'arrayAppend', 'arr', string[]>;
    expectTypeOf<Test>().toEqualTypeOf<['arr', string]>();
  });

  test('readonly array', () => {
    type Test = CodeCompletionSinglePass<'arrayAppend', 'arr', readonly string[]>;
    expectTypeOf<Test>().toEqualTypeOf<never>();
  });

  test('tuple', () => {
    type Test = CodeCompletionSinglePass<'arrayAppend', 'arr', [string]>;
    expectTypeOf<Test>().toEqualTypeOf<never>();
  });

  test('tuple with variadic head', () => {
    type Test = CodeCompletionSinglePass<'arrayAppend', 'arr', [...number[], string]>;
    expectTypeOf<Test>().toEqualTypeOf<never>();
  });

  test('tuple with variadic head same type', () => {
    type Test = CodeCompletionSinglePass<'arrayAppend', 'arr', [...string[], string]>;
    expectTypeOf<Test>().toEqualTypeOf<['arr', string]>();
  });

  test('tuple with variadic tail', () => {
    type Test = CodeCompletionSinglePass<'arrayAppend', 'arr', [string, ...number[]]>;
    expectTypeOf<Test>().toEqualTypeOf<['arr', number]>();
  });

  test('tuple with variadic tail same type', () => {
    type Test = CodeCompletionSinglePass<'arrayAppend', 'arr', [number, ...number[]]>;
    expectTypeOf<Test>().toEqualTypeOf<['arr', number]>();
  });

  test('tuple with optional element', () => {
    type Test = CodeCompletionSinglePass<'arrayAppend', 'arr', [string, number?]>;
    expectTypeOf<Test>().toEqualTypeOf<['arr', number]>();
  });
});

describe('ArrayPrependCodeCompletion', () => {
  test('array', () => {
    type Test = CodeCompletionSinglePass<'arrayPrepend', 'arr', string[]>;
    expectTypeOf<Test>().toEqualTypeOf<['arr', string]>();
  });

  test('readonly array', () => {
    type Test = CodeCompletionSinglePass<'arrayPrepend', 'arr', readonly string[]>;
    expectTypeOf<Test>().toEqualTypeOf<never>();
  });

  test('tuple', () => {
    type Test = CodeCompletionSinglePass<'arrayPrepend', 'arr', [string]>;
    expectTypeOf<Test>().toEqualTypeOf<never>();
  });

  test('tuple with variadic head', () => {
    type Test = CodeCompletionSinglePass<'arrayPrepend', 'arr', [...number[], string]>;
    expectTypeOf<Test>().toEqualTypeOf<['arr', number]>();
  });

  test('tuple with variadic head same type', () => {
    type Test = CodeCompletionSinglePass<'arrayPrepend', 'arr', [...string[], string]>;
    expectTypeOf<Test>().toEqualTypeOf<['arr', string]>();
  });

  test('tuple with variadic tail', () => {
    type Test = CodeCompletionSinglePass<'arrayPrepend', 'arr', [string, ...number[]]>;
    expectTypeOf<Test>().toEqualTypeOf<never>();
  });

  test('tuple with variadic tail same type', () => {
    type Test = CodeCompletionSinglePass<'arrayPrepend', 'arr', [string, ...string[]]>;
    expectTypeOf<Test>().toEqualTypeOf<['arr', string]>();
  });

  test('tuple with optional element', () => {
    type Test = CodeCompletionSinglePass<'arrayPrepend', 'arr', [string, number?]>;
    expectTypeOf<Test>().toEqualTypeOf<never>();
  });
});

describe('ArrayInsertCodeCompletion', () => {
  test('array', () => {
    type Test = CodeCompletionSinglePass<'arrayInsert', 'arr', string[]>;
    expectTypeOf<Test>().toEqualTypeOf<[`arr[${number}]`, string]>();
  });

  test('readonly array', () => {
    type Test = CodeCompletionSinglePass<'arrayInsert', 'arr', readonly string[]>;
    expectTypeOf<Test>().toEqualTypeOf<never>();
  });

  test('tuple', () => {
    type Test = CodeCompletionSinglePass<'arrayInsert', 'arr', [string]>;
    expectTypeOf<Test>().toEqualTypeOf<never>();
  });

  test('tuple with variadic head', () => {
    type Test = CodeCompletionSinglePass<'arrayInsert', 'arr', [...number[], string]>;
    expectTypeOf<Test>().toEqualTypeOf<[`arr[${number}]`, number]>();
  });

  test('tuple with variadic head same type', () => {
    type Test = CodeCompletionSinglePass<'arrayInsert', 'arr', [...string[], string]>;
    expectTypeOf<Test>().toEqualTypeOf<[`arr[${number}]`, string]>();
  });

  test('tuple with variadic tail', () => {
    type Test = CodeCompletionSinglePass<'arrayInsert', 'arr', [string, ...number[]]>;
    expectTypeOf<Test>().toEqualTypeOf<[`arr[0]`, never] | [`arr[${number}]`, number]>();
  });

  test('tuple with variadic tail same type', () => {
    type Test = CodeCompletionSinglePass<'arrayInsert', 'arr', [string, ...string[]]>;
    expectTypeOf<Test>().toEqualTypeOf<[`arr[0]`, string] | [`arr[${number}]`, string]>();
  });

  test('tuple with optional element', () => {
    type Test = CodeCompletionSinglePass<'arrayInsert', 'arr', [string, number?]>;
    expectTypeOf<Test>().toEqualTypeOf<['arr[0]', never] | ['arr[1]', number]>();
  });
});

describe('RemoveCodeCompletion', () => {
  test('array', () => {
    type Test = CodeCompletionSinglePass<'remove', 'arr', string[]>;
    expectTypeOf<Test>().toEqualTypeOf<[`arr[${number}]`, true] | [`arr[-1]`, true]>();
  });

  test('readonly array', () => {
    type Test = CodeCompletionSinglePass<'remove', 'arr', readonly string[]>;
    expectTypeOf<Test>().toEqualTypeOf<never>();
  });

  test('tuple', () => {
    type Test = CodeCompletionSinglePass<'remove', 'arr', [string]>;
    expectTypeOf<Test>().toEqualTypeOf<never>();
  });

  test('tuple with variadic head', () => {
    type Test = CodeCompletionSinglePass<'remove', 'arr', [...number[], string]>;
    expectTypeOf<Test>().toEqualTypeOf<[`arr[-1]`, false] | [`arr[${number}]`, true]>();
  });

  test('tuple with variadic head same type', () => {
    type Test = CodeCompletionSinglePass<'remove', 'arr', [...string[], string]>;
    expectTypeOf<Test>().toEqualTypeOf<[`arr[${number}]`, true] | [`arr[-1]`, true]>();
  });

  test('tuple with variadic tail', () => {
    type Test = CodeCompletionSinglePass<'remove', 'arr', [string, ...number[]]>;
    expectTypeOf<Test>().toEqualTypeOf<
      [`arr[${number}]`, true] | [`arr[0]`, false] | [`arr[-1]`, true]
    >();
  });

  test('tuple with variadic tail same type', () => {
    type Test = CodeCompletionSinglePass<'remove', 'arr', [string, ...string[]]>;
    expectTypeOf<Test>().toEqualTypeOf<
      [`arr[${number}]`, true] | [`arr[0]`, true] | [`arr[-1]`, true]
    >();
  });

  test('tuple with optional element', () => {
    type Test = CodeCompletionSinglePass<'remove', 'arr', [string, number?]>;
    expectTypeOf<Test>().toEqualTypeOf<
      ['arr[0]', false] | ['arr[1]', true] | ['arr[-1]', true]
    >();
  });

  test('object with no optional property', () => {
    type Test = CodeCompletionSinglePass<'remove', 'obj', { title: string }>;
    expectTypeOf<Test>().toEqualTypeOf<never>();
  });

  test('object with some optional properties', () => {
    type Test = CodeCompletionSinglePass<
      'remove',
      'obj',
      { title: string; description?: string; metadata?: { tags: string[] } }
    >;
    expectTypeOf<Test>().toEqualTypeOf<
      ['obj.description', true] | ['obj.metadata', true]
    >();
  });

  test('object with some properties that can be undefined', () => {
    type Test = CodeCompletionSinglePass<
      'remove',
      'obj',
      { title: string; description: string | undefined }
    >;
    expectTypeOf<Test>().toEqualTypeOf<['obj.description', true]>();
  });
});

describe('ReplaceCodeCompletion', () => {
  test('array', () => {
    type Test = CodeCompletionSinglePass<'replace', 'arr', string[]>;
    expectTypeOf<Test>().toEqualTypeOf<
      [`arr[${number}]`, string] | [`arr[-1]`, string]
    >();
  });

  test('readonly array', () => {
    type Test = CodeCompletionSinglePass<'replace', 'arr', readonly string[]>;
    expectTypeOf<Test>().toEqualTypeOf<never>();
  });

  test('tuple', () => {
    type Test = CodeCompletionSinglePass<'replace', 'arr', [string]>;
    expectTypeOf<Test>().toEqualTypeOf<['arr[0]', string] | ['arr[-1]', string]>();
  });

  test('tuple with variadic head', () => {
    type Test = CodeCompletionSinglePass<'replace', 'arr', [...number[], string]>;
    expectTypeOf<Test>().toEqualTypeOf<
      [`arr[${number}]`, number | string] | ['arr[-1]', string]
    >();
  });

  test('tuple with variadic head same type', () => {
    type Test = CodeCompletionSinglePass<'replace', 'arr', [...string[], string]>;
    expectTypeOf<Test>().toEqualTypeOf<
      [`arr[${number}]`, string] | [`arr[-1]`, string]
    >();
  });

  test('tuple with variadic tail', () => {
    type Test = CodeCompletionSinglePass<'replace', 'arr', [string, ...number[]]>;
    expectTypeOf<Test>().toEqualTypeOf<
      | [`arr[${number}]`, string | number]
      | [`arr[0]`, string]
      | [`arr[-1]`, string | number]
    >();
  });

  test('tuple with variadic tail same type', () => {
    type Test = CodeCompletionSinglePass<'replace', 'arr', [string, ...string[]]>;
    expectTypeOf<Test>().toEqualTypeOf<
      [`arr[${number}]`, string] | [`arr[0]`, string] | [`arr[-1]`, string]
    >();
  });

  test('tuple with optional element', () => {
    type Test = CodeCompletionSinglePass<'replace', 'arr', [string, number?]>;
    expectTypeOf<Test>().toEqualTypeOf<
      ['arr[0]', string] | ['arr[1]', number] | ['arr[-1]', string | number]
    >();
  });

  test('object with no optional property', () => {
    type Test = CodeCompletionSinglePass<'replace', 'obj', { title: string }>;
    expectTypeOf<Test>().toEqualTypeOf<['obj.title', string]>();
  });

  test('object with some optional properties', () => {
    type Test = CodeCompletionSinglePass<
      'replace',
      'obj',
      { title: string; description?: string; metadata?: { tags: string[] } }
    >;
    expectTypeOf<Test>().toEqualTypeOf<
      | ['obj.title', string]
      | ['obj.description', string]
      | ['obj.metadata', { tags: string[] }]
    >();
  });

  test('object with some properties that can be undefined', () => {
    type Test = CodeCompletionSinglePass<
      'replace',
      'obj',
      { title: string; description: string | undefined }
    >;
    expectTypeOf<Test>().toEqualTypeOf<
      ['obj.title', string] | ['obj.description', string]
    >();
  });
});

describe('UpsertCodeCompletion', () => {
  test('array', () => {
    type Test = CodeCompletionSinglePass<'upsert', 'arr', string[]>;
    expectTypeOf<Test>().toEqualTypeOf<[`arr`, string[]]>();
  });

  test('readonly array', () => {
    type Test = CodeCompletionSinglePass<'upsert', 'arr', readonly string[]>;
    expectTypeOf<Test>().toEqualTypeOf<never>();
  });

  test('tuple', () => {
    type Test = CodeCompletionSinglePass<'upsert', 'arr', [string]>;
    expectTypeOf<Test>().toEqualTypeOf<[`arr`, [string]]>();
  });

  test('tuple with variadic head', () => {
    type Test = CodeCompletionSinglePass<'upsert', 'arr', [...number[], string]>;
    expectTypeOf<Test>().toEqualTypeOf<[`arr`, [...number[], string]]>();
  });

  test('tuple with variadic head same type', () => {
    type Test = CodeCompletionSinglePass<'upsert', 'arr', [...string[], string]>;
    expectTypeOf<Test>().toEqualTypeOf<[`arr`, [...string[], string]]>();
  });

  test('tuple with variadic tail', () => {
    type Test = CodeCompletionSinglePass<'upsert', 'arr', [string, ...number[]]>;
    expectTypeOf<Test>().toEqualTypeOf<[`arr`, [string, ...number[]]]>();
  });

  test('tuple with variadic tail same type', () => {
    type Test = CodeCompletionSinglePass<'upsert', 'arr', [string, ...string[]]>;
    expectTypeOf<Test>().toEqualTypeOf<[`arr`, [string, ...string[]]]>();
  });

  test('tuple with optional element', () => {
    type Test = CodeCompletionSinglePass<'upsert', 'arr', [string, number?]>;
    expectTypeOf<Test>().toEqualTypeOf<['arr', [string, number?]]>();
  });

  test('object with no optional property', () => {
    type Test = CodeCompletionSinglePass<'upsert', 'obj', { title: string }>;
    expectTypeOf<Test>().toEqualTypeOf<['obj.title', string]>();
  });

  test('object with some optional properties', () => {
    type Test = CodeCompletionSinglePass<
      'upsert',
      'obj',
      { title: string; description?: string; metadata?: { tags: string[] } }
    >;
    expectTypeOf<Test>().toEqualTypeOf<
      | ['obj.title', string]
      | ['obj.description', string]
      | ['obj.metadata', { tags: string[] }]
    >();
  });

  test('object with some readonly properties', () => {
    type Test = CodeCompletionSinglePass<
      'upsert',
      'obj',
      { title: string; description?: string; readonly createdAt: number }
    >;
    expectTypeOf<Test>().toEqualTypeOf<
      ['obj.title', string] | ['obj.description', string] | ['obj.createdAt', number]
    >();
  });

  test('object with some properties that can be undefined', () => {
    type Test = CodeCompletionSinglePass<
      'upsert',
      'obj',
      { title: string; description: string | undefined }
    >;
    expectTypeOf<Test>().toEqualTypeOf<
      ['obj.title', string] | ['obj.description', string]
    >();
  });

  test('object with record', () => {
    type UserId = `user::${string}`;
    type TestDoc = Record<UserId, { name: string }>;
    type Test = CodeCompletionSinglePass<'upsert', 'obj', TestDoc>;

    expectTypeOf<Test>().toEqualTypeOf<[`obj.user::${string}`, { name: string }]>();
  });
});

describe('GetCodeCompletion', () => {
  test('array', () => {
    type Test = CodeCompletionSinglePass<'get', 'arr', string[]>;
    expectTypeOf<Test>().toEqualTypeOf<
      ['arr', string[]] | [`arr[${number}]`, string] | [`arr[-1]`, string]
    >();
  });

  test('readonly array', () => {
    type Test = CodeCompletionSinglePass<'get', 'arr', readonly string[]>;
    expectTypeOf<Test>().toEqualTypeOf<
      ['arr', readonly string[]] | [`arr[${number}]`, string] | [`arr[-1]`, string]
    >();
  });

  test('tuple', () => {
    type Test = CodeCompletionSinglePass<'get', 'arr', [string]>;
    expectTypeOf<Test>().toEqualTypeOf<
      ['arr', [string]] | [`arr[0]`, string] | [`arr[-1]`, string]
    >();
  });

  test('tuple with variadic head', () => {
    type Test = CodeCompletionSinglePass<'get', 'arr', [...number[], string]>;
    expectTypeOf<Test>().toEqualTypeOf<
      | ['arr', [...number[], string]]
      | [`arr[${number}]`, string | number]
      | [`arr[-1]`, string]
    >();
  });

  test('tuple with variadic head same type', () => {
    type Test = CodeCompletionSinglePass<'get', 'arr', [...string[], string]>;
    expectTypeOf<Test>().toEqualTypeOf<
      ['arr', [...string[], string]] | [`arr[${number}]`, string] | [`arr[-1]`, string]
    >();
  });

  test('tuple with variadic tail', () => {
    type Test = CodeCompletionSinglePass<'get', 'arr', [string, ...number[]]>;
    expectTypeOf<Test>().toEqualTypeOf<
      | ['arr', [string, ...number[]]]
      | [`arr[${number}]`, string | number]
      | [`arr[0]`, string]
      | [`arr[-1]`, string | number]
    >();
  });

  test('tuple with variadic tail same type', () => {
    type Test = CodeCompletionSinglePass<'get', 'arr', [string, ...string[]]>;
    expectTypeOf<Test>().toEqualTypeOf<
      | ['arr', [string, ...string[]]]
      | [`arr[${number}]`, string]
      | [`arr[0]`, string]
      | [`arr[-1]`, string]
    >();
  });

  test('tuple with optional element', () => {
    type Test = CodeCompletionSinglePass<'get', 'arr', [string, number?]>;
    expectTypeOf<Test>().toEqualTypeOf<
      | [`arr`, [string, number?]]
      | [`arr[0]`, string]
      | [`arr[1]`, number]
      | [`arr[-1]`, string | number]
    >();
  });

  test('object with no optional property', () => {
    type Test = CodeCompletionSinglePass<'get', 'obj', { title: string }>;
    expectTypeOf<Test>().toEqualTypeOf<
      ['obj', { title: string }] | [`obj.title`, string]
    >();
  });

  test('object with some optional properties', () => {
    type TestDoc = { title: string; description?: string; metadata?: { tags: string[] } };
    type Test = CodeCompletionSinglePass<'get', 'obj', TestDoc>;

    expectTypeOf<Test>().toEqualTypeOf<
      | ['obj', TestDoc]
      | ['obj.title', string]
      | ['obj.description', string]
      | ['obj.metadata', { tags: string[] }]
    >();
  });

  test('object with some properties that can be undefined', () => {
    type TestDoc = { title: string; description: string | undefined };
    type Test = CodeCompletionSinglePass<'get', 'obj', TestDoc>;
    expectTypeOf<Test>().toEqualTypeOf<
      ['obj', TestDoc] | ['obj.title', string] | ['obj.description', string]
    >();
  });
});

describe('CountCodeCompletion', () => {
  type Arr = string[];
  type Obj = { title: string };

  test('array', () => {
    type Test = CodeCompletionSinglePass<'count', 'arr', Arr[]>;
    expectTypeOf<Test>().toEqualTypeOf<[`arr`]>();
  });

  test('object', () => {
    type Test = CodeCompletionSinglePass<'count', 'obj', Obj>;
    expectTypeOf<Test>().toEqualTypeOf<['obj']>();
  });

  test('primitive', () => {
    type Test = CodeCompletionSinglePass<'count', 'prop', string>;
    expectTypeOf<Test>().toEqualTypeOf<never>();
  });
});

describe('BinaryCodeCompletion', () => {
  test('object with property: number', () => {
    type Test = CodeCompletionSinglePass<'binary', 'obj', { sales: number }>;
    expectTypeOf<Test>().toEqualTypeOf<[`obj.sales`, true]>();
  });

  test('array', () => {
    type Test = CodeCompletionSinglePass<'binary', 'arr', number[]>;
    expectTypeOf<Test>().toEqualTypeOf<[`arr[${number}]`, true] | [`arr[-1]`, true]>();
  });

  test('readonly array', () => {
    type Test = CodeCompletionSinglePass<'binary', 'arr', readonly number[]>;
    expectTypeOf<Test>().toEqualTypeOf<never>();
  });

  test('tuple', () => {
    type Test = CodeCompletionSinglePass<'binary', 'arr', [number]>;
    expectTypeOf<Test>().toEqualTypeOf<[`arr[0]`, true] | ['arr[-1]', true]>();
  });

  test('tuple with variadic head', () => {
    type Test = CodeCompletionSinglePass<'binary', 'arr', [...number[], string]>;
    expectTypeOf<Test>().toEqualTypeOf<[`arr[${number}]`, true] | [`arr[-1]`, false]>();

    type Test2 = CodeCompletionSinglePass<'binary', 'arr', [...string[], number]>;
    expectTypeOf<Test2>().toEqualTypeOf<[`arr[-1]`, true]>();
  });

  test('tuple with variadic head same type', () => {
    type Test = CodeCompletionSinglePass<'binary', 'arr', [...number[], number]>;
    expectTypeOf<Test>().toEqualTypeOf<[`arr[${number}]`, true] | [`arr[-1]`, true]>();
  });

  test('tuple with variadic tail', () => {
    type Test = CodeCompletionSinglePass<'binary', 'arr', [string, ...number[]]>;
    expectTypeOf<Test>().toEqualTypeOf<
      [`arr[${number}]`, true] | [`arr[0]`, false] | [`arr[-1]`, true]
    >();

    type Test2 = CodeCompletionSinglePass<'binary', 'arr', [number, ...string[]]>;
    expectTypeOf<Test2>().toEqualTypeOf<[`arr[0]`, true]>();
  });

  test('tuple with variadic tail same type', () => {
    type Test = CodeCompletionSinglePass<'binary', 'arr', [number, ...number[]]>;
    expectTypeOf<Test>().toEqualTypeOf<
      [`arr[${number}]`, true] | [`arr[0]`, true] | [`arr[-1]`, true]
    >();
  });

  test('tuple with optional element', () => {
    type Test = CodeCompletionSinglePass<'binary', 'arr', [string, number?]>;
    expectTypeOf<Test>().toEqualTypeOf<[`arr[-1]`, true] | [`arr[1]`, true]>();
  });
});

describe('DocumentCodeCompletion', () => {
  test('root array', () => {
    type Test = {
      [Op in KvOperation]: DocumentCodeCompletion<Op, string[]>;
    };

    expectTypeOf<Test['get']>().toEqualTypeOf<
      ['', string[]] | [`[${number}]`, string] | [`[-1]`, string]
    >();

    expectTypeOf<Test['exists']>().toEqualTypeOf<[`[${number}]`]>();

    expectTypeOf<Test['count']>().toEqualTypeOf<[``]>();

    expectTypeOf<Test['upsert']>().toEqualTypeOf<['', string[]]>();

    expectTypeOf<Test['replace']>().toEqualTypeOf<
      [`[${number}]`, string] | [`[-1]`, string]
    >();

    expectTypeOf<Test['remove']>().toEqualTypeOf<
      [`[${number}]`, true] | [`[-1]`, true]
    >();

    expectTypeOf<Test['arrayAppend']>().toEqualTypeOf<['', string]>();

    expectTypeOf<Test['arrayPrepend']>().toEqualTypeOf<['', string]>();

    expectTypeOf<Test['arrayInsert']>().toEqualTypeOf<[`[${number}]`, string]>();
  });

  test('root object', () => {
    type TestDoc = { title: string };
    type Test = OmitNeverValues<{
      [Op in KvOperation]: DocumentCodeCompletion<Op, TestDoc>;
    }>;

    expectTypeOf<keyof Test>().toEqualTypeOf<
      'get' | 'exists' | 'count' | 'upsert' | 'replace'
    >();

    expectTypeOf<Test['get']>().toEqualTypeOf<['', TestDoc] | [`title`, string]>();
    expectTypeOf<Test['count']>().toEqualTypeOf<['']>();
    expectTypeOf<Test['exists']>().toEqualTypeOf<['title']>();
    expectTypeOf<Test['replace']>().toEqualTypeOf<[`title`, string]>();
    expectTypeOf<Test['upsert']>().toEqualTypeOf<['', TestDoc] | [`title`, string]>();
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
      readonly codes: [string, string];
      recoveryCodes: readonly [string, string];
    };

    type Test = OmitNeverValues<{
      [Op in KvOperation]: DocumentCodeCompletion<Op, TestDoc>;
    }>;

    type KeyofTest = keyof Test;
    expectTypeOf<KeyofTest>().toEqualTypeOf<
      | 'get'
      | 'count'
      | 'exists'
      | 'insert'
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
      | [``, TestDoc]
      | [`title`, string]
      | [`sales`, number]
      | [`authors`, string[]]
      | [`authors[${number}]`, string]
      | [`authors[-1]`, string]
      | [`metadata`, { tags: string[] }]
      | [`metadata.tags`, string[]]
      | [`metadata.tags[${number}]`, string]
      | [`metadata.tags[-1]`, string]
      | [`audit`, { readonly createdAt: number }]
      | [`audit.createdAt`, number]
      | [`codes`, [string, string]]
      | [`codes[${number}]`, string]
      | [`codes[0]`, string]
      | [`codes[1]`, string]
      | [`codes[-1]`, string]
      | [`recoveryCodes`, readonly [string, string]]
      | [`recoveryCodes[${number}]`, string]
      | [`recoveryCodes[0]`, string]
      | [`recoveryCodes[1]`, string]
      | [`recoveryCodes[-1]`, string]
    >();

    type TestCount = DocumentCodeCompletion<'count', TestDoc>;
    expectTypeOf<TestCount>().toEqualTypeOf<
      | ['']
      | ['metadata']
      | ['metadata.tags']
      | ['authors']
      | ['audit']
      | ['codes']
      | ['recoveryCodes']
    >();

    type TestExists = DocumentCodeCompletion<'exists', TestDoc>;
    expectTypeOf<TestExists>().toEqualTypeOf<
      | [`title`]
      | [`sales`]
      | [`authors`]
      | [`authors[${number}]`]
      | [`metadata`]
      | [`metadata.tags`]
      | [`metadata.tags[${number}]`]
      | [`audit`]
      | [`audit.createdAt`]
      | [`codes`]
      | [`codes[0]`]
      | [`codes[1]`]
      | [`recoveryCodes`]
      | [`recoveryCodes[0]`]
      | [`recoveryCodes[1]`]
    >();

    type TestInsert = DocumentCodeCompletion<'insert', TestDoc>;
    expectTypeOf<TestInsert>().toEqualTypeOf<
      [`sales`, number] | [`metadata`, { tags: string[] }]
    >();

    type TestUpsert = DocumentCodeCompletion<'upsert', TestDoc>;
    expectTypeOf<TestUpsert>().toEqualTypeOf<
      | [``, TestDoc]
      | [`title`, string]
      | [`sales`, number]
      | [`authors`, string[]]
      | [`metadata`, { tags: string[] }]
      | [`metadata.tags`, string[]]
      | [`audit`, { readonly createdAt: number }]
      | [`audit.createdAt`, number]
      | [`codes`, [string, string]]
      | [`recoveryCodes`, readonly [string, string]]
    >();

    type TestReplace = DocumentCodeCompletion<'replace', TestDoc>;
    expectTypeOf<TestReplace>().toEqualTypeOf<
      | [`title`, string]
      | [`sales`, number]
      | [`authors`, string[]]
      | [`authors[${number}]`, string]
      | [`authors[-1]`, string]
      | [`metadata`, { tags: string[] }]
      | [`metadata.tags`, string[]]
      | [`metadata.tags[${number}]`, string]
      | [`metadata.tags[-1]`, string]
      | [`audit`, { readonly createdAt: number }]
      | [`audit.createdAt`, number]
      | [`codes`, [string, string]]
      | [`codes[0]`, string]
      | [`codes[1]`, string]
      | [`codes[-1]`, string]
      | [`recoveryCodes`, readonly [string, string]]
    >();

    type TestRemove = DocumentCodeCompletion<'remove', TestDoc>;
    expectTypeOf<TestRemove>().toEqualTypeOf<
      | [`sales`, true]
      | [`metadata`, true]
      | [`authors[${number}]`, true]
      | [`authors[-1]`, true]
      | [`metadata.tags[${number}]`, true]
      | [`metadata.tags[-1]`, true]
    >();

    type TestArrayAppend = DocumentCodeCompletion<'arrayAppend', TestDoc>;
    expectTypeOf<TestArrayAppend>().toEqualTypeOf<
      [`metadata.tags`, string] | [`authors`, string]
    >();

    type TestArrayPrepend = DocumentCodeCompletion<'arrayPrepend', TestDoc>;
    expectTypeOf<TestArrayPrepend>().toEqualTypeOf<
      [`metadata.tags`, string] | [`authors`, string]
    >();

    type TestArrayInsert = DocumentCodeCompletion<'arrayInsert', TestDoc>;
    expectTypeOf<TestArrayInsert>().toEqualTypeOf<
      [`metadata.tags[${number}]`, string] | [`authors[${number}]`, string]
    >();

    type TestBinary = DocumentCodeCompletion<'binary', TestDoc>;
    expectTypeOf<TestBinary>().toEqualTypeOf<
      ['sales', true] | ['audit.createdAt', true]
    >();

    type TestBinary2 = DocumentCodeCompletion<'binary', { sales: [string, number] }>;
    expectTypeOf<TestBinary2>().toEqualTypeOf<[`sales[-1]`, true] | [`sales[1]`, true]>();

    type TestBinary3 = DocumentCodeCompletion<'binary', { sales: [number, string] }>;
    expectTypeOf<TestBinary3>().toEqualTypeOf<[`sales[0]`, true]>();
  });

  test('document with records', () => {
    type UserId = `user::${string}`;
    type TestDoc = { members: Record<UserId, { name: string }> };

    type Test = DocumentCodeCompletion<'upsert', TestDoc>;

    expectTypeOf<Test>().toEqualTypeOf<
      | ['', TestDoc]
      | ['members', Record<UserId, { name: string }>]
      | [`members.user::${string}`, { name: string }]
      | [`members.user::${string}.name`, string]
    >();
  });

  test('document with unions', () => {
    type TestDoc = {
      events: { type: 'a'; payload: 'pa' } | { type: 'b'; payload: 'pb' };
    };
    type Test = DocumentCodeCompletion<'get', TestDoc>;

    expectTypeOf<Test>().toEqualTypeOf<
      | [``, TestDoc]
      | [`events`, TestDoc['events']]
      | [`events.type`, 'a']
      | [`events.payload`, 'pa']
      | [`events.type`, 'b']
      | [`events.payload`, 'pb']
    >();
  });
});

describe('OpCodeCompletionValue', () => {
  describe('get', () => {
    test('object path', () => {
      type Test = OpCodeCompletionValue<'get', { title: string }, 'title'>;
      expectTypeOf<Test>().toEqualTypeOf<string>();
    });

    test('object nested path', () => {
      type Test = OpCodeCompletionValue<
        'get',
        { metadata?: { tags: string[] } },
        'metadata.tags'
      >;
      expectTypeOf<Test>().toEqualTypeOf<string[]>();
    });

    test('object record with literal index signature', () => {
      type Test = OpCodeCompletionValue<
        'get',
        { memberships?: Record<`user::${string}`, { joinedAt: number }> },
        'memberships.user::001'
      >;
      expectTypeOf<Test>().toEqualTypeOf<{ joinedAt: number }>();
    });
  });

  describe('upsert', () => {
    test('object path', () => {
      type Test = OpCodeCompletionValue<'upsert', { title: string }, 'title'>;
      expectTypeOf<Test>().toEqualTypeOf<string>();
    });

    test('object path to object', () => {
      type Test = OpCodeCompletionValue<
        'upsert',
        { metadata?: { tags: string[] } },
        'metadata'
      >;
      expectTypeOf<Test>().toEqualTypeOf<{ tags: string[] }>();
    });

    test('object nested path', () => {
      type Test = OpCodeCompletionValue<
        'upsert',
        { metadata?: { tags: string[] } },
        'metadata.tags'
      >;
      expectTypeOf<Test>().toEqualTypeOf<string[]>();
    });
  });

  describe('remove', () => {
    type Test = OpCodeCompletionValue<'remove', { arr: [number, ...string[]] }, 'arr[0]'>;
    expectTypeOf<Test>().toEqualTypeOf<never>();

    type Test2 = OpCodeCompletionValue<
      'remove',
      { arr: [number, ...string[]] },
      'arr[1]'
    >;
    expectTypeOf<Test2>().toEqualTypeOf<true>();
  });
});
