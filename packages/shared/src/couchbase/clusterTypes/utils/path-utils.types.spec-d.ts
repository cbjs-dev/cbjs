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

import type { OmitNeverValues } from './misc-utils.types.js';
import type {
  ArrayAppendCodeCompletion,
  ArrayInsertCodeCompletion,
  ArrayPrependCodeCompletion,
  CountCodeCompletion,
  DocumentCodeCompletion,
  FriendlyPathToArrayIndex,
  GetCodeCompletion,
  KvOperation,
  RemoveCodeCompletion,
  ReplaceCodeCompletion,
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

describe('ArrayAppendCodeCompletion', () => {
  test('array', () => {
    type Test = ArrayAppendCodeCompletion<'arr', string[]>;
    expectTypeOf<Test>().toEqualTypeOf<['arrayAppend', 'arr', string]>();
  });

  test('readonly array', () => {
    type Test = ArrayAppendCodeCompletion<'arr', readonly string[]>;
    expectTypeOf<Test>().toEqualTypeOf<never>();
  });

  test('tuple', () => {
    type Test = ArrayAppendCodeCompletion<'arr', [string]>;
    expectTypeOf<Test>().toEqualTypeOf<never>();
  });

  test('tuple with variadic head', () => {
    type Test = ArrayAppendCodeCompletion<'arr', [...number[], string]>;
    expectTypeOf<Test>().toEqualTypeOf<never>();
  });

  test('tuple with variadic head same type', () => {
    type Test = ArrayAppendCodeCompletion<'arr', [...string[], string]>;
    expectTypeOf<Test>().toEqualTypeOf<['arrayAppend', 'arr', string]>();
  });

  test('tuple with variadic tail', () => {
    type Test = ArrayAppendCodeCompletion<'arr', [string, ...number[]]>;
    expectTypeOf<Test>().toEqualTypeOf<['arrayAppend', 'arr', number]>();
  });

  test('tuple with variadic tail same type', () => {
    type Test = ArrayAppendCodeCompletion<'arr', [number, ...number[]]>;
    expectTypeOf<Test>().toEqualTypeOf<['arrayAppend', 'arr', number]>();
  });

  test('tuple with optional element', () => {
    type Test = ArrayAppendCodeCompletion<'arr', [string, number?]>;
    expectTypeOf<Test>().toEqualTypeOf<['arrayAppend', 'arr', number]>();
  });
});

describe('ArrayPrependCodeCompletion', () => {
  test('array', () => {
    type Test = ArrayPrependCodeCompletion<'arr', string[]>;
    expectTypeOf<Test>().toEqualTypeOf<['arrayPrepend', 'arr', string]>();
  });

  test('readonly array', () => {
    type Test = ArrayPrependCodeCompletion<'arr', readonly string[]>;
    expectTypeOf<Test>().toEqualTypeOf<never>();
  });

  test('tuple', () => {
    type Test = ArrayPrependCodeCompletion<'arr', [string]>;
    expectTypeOf<Test>().toEqualTypeOf<never>();
  });

  test('tuple with variadic head', () => {
    type Test = ArrayPrependCodeCompletion<'arr', [...number[], string]>;
    expectTypeOf<Test>().toEqualTypeOf<['arrayPrepend', 'arr', number]>();
  });

  test('tuple with variadic head same type', () => {
    type Test = ArrayPrependCodeCompletion<'arr', [...string[], string]>;
    expectTypeOf<Test>().toEqualTypeOf<['arrayPrepend', 'arr', string]>();
  });

  test('tuple with variadic tail', () => {
    type Test = ArrayPrependCodeCompletion<'arr', [string, ...number[]]>;
    expectTypeOf<Test>().toEqualTypeOf<never>();
  });

  test('tuple with variadic tail same type', () => {
    type Test = ArrayPrependCodeCompletion<'arr', [string, ...string[]]>;
    expectTypeOf<Test>().toEqualTypeOf<['arrayPrepend', 'arr', string]>();
  });

  test('tuple with optional element', () => {
    type Test = ArrayPrependCodeCompletion<'arr', [string, number?]>;
    expectTypeOf<Test>().toEqualTypeOf<never>();
  });
});

describe('ArrayInsertCodeCompletion', () => {
  test('array', () => {
    type Test = ArrayInsertCodeCompletion<'arr', string[]>;
    expectTypeOf<Test>().toEqualTypeOf<['arrayInsert', `arr[${number}]`, string]>();
  });

  test('readonly array', () => {
    type Test = ArrayInsertCodeCompletion<'arr', readonly string[]>;
    expectTypeOf<Test>().toEqualTypeOf<never>();
  });

  test('tuple', () => {
    type Test = ArrayInsertCodeCompletion<'arr', [string]>;
    expectTypeOf<Test>().toEqualTypeOf<never>();
  });

  test('tuple with variadic head', () => {
    type Test = ArrayInsertCodeCompletion<'arr', [...number[], string]>;
    expectTypeOf<Test>().toEqualTypeOf<['arrayInsert', `arr[${number}]`, number]>();
  });

  test('tuple with variadic head same type', () => {
    type Test = ArrayInsertCodeCompletion<'arr', [...string[], string]>;
    expectTypeOf<Test>().toEqualTypeOf<['arrayInsert', `arr[${number}]`, string]>();
  });

  test('tuple with variadic tail', () => {
    type Test = ArrayInsertCodeCompletion<'arr', [string, ...number[]]>;
    expectTypeOf<Test>().toEqualTypeOf<['arrayInsert', `arr[${number}]`, number]>();
  });

  test('tuple with variadic tail same type', () => {
    type Test = ArrayInsertCodeCompletion<'arr', [string, ...string[]]>;
    expectTypeOf<Test>().toEqualTypeOf<['arrayInsert', `arr[${number}]`, string]>();
  });

  test('tuple with optional element', () => {
    type Test = ArrayInsertCodeCompletion<'arr', [string, number?]>;
    expectTypeOf<Test>().toEqualTypeOf<['arrayInsert', 'arr[1]', number]>();
  });
});

describe('RemoveCodeCompletion', () => {
  test('array', () => {
    type Test = RemoveCodeCompletion<'arr', string[]>;
    expectTypeOf<Test>().toEqualTypeOf<
      ['remove', `arr[${number}]`] | ['remove', `arr[-1]`]
    >();
  });

  test('readonly array', () => {
    type Test = RemoveCodeCompletion<'arr', readonly string[]>;
    expectTypeOf<Test>().toEqualTypeOf<never>();
  });

  test('tuple', () => {
    type Test = RemoveCodeCompletion<'arr', [string]>;
    expectTypeOf<Test>().toEqualTypeOf<never>();
  });

  test('tuple with variadic head', () => {
    type Test = RemoveCodeCompletion<'arr', [...number[], string]>;
    expectTypeOf<Test>().toEqualTypeOf<['remove', `arr[${number}]`]>();
  });

  test('tuple with variadic head same type', () => {
    type Test = RemoveCodeCompletion<'arr', [...string[], string]>;
    expectTypeOf<Test>().toEqualTypeOf<
      ['remove', `arr[${number}]`] | ['remove', `arr[-1]`]
    >();
  });

  test('tuple with variadic tail', () => {
    type Test = RemoveCodeCompletion<'arr', [string, ...number[]]>;
    expectTypeOf<Test>().toEqualTypeOf<
      ['remove', `arr[${number}]`] | ['remove', `arr[-1]`]
    >();
  });

  test('tuple with variadic tail same type', () => {
    type Test = RemoveCodeCompletion<'arr', [string, ...string[]]>;
    expectTypeOf<Test>().toEqualTypeOf<
      ['remove', `arr[${number}]`] | ['remove', `arr[-1]`]
    >();
  });

  test('tuple with optional element', () => {
    type Test = RemoveCodeCompletion<'arr', [string, number?]>;
    expectTypeOf<Test>().toEqualTypeOf<['remove', 'arr[-1]'] | ['remove', 'arr[1]']>();
  });

  test('object with no optional property', () => {
    type Test = RemoveCodeCompletion<'obj.', { title: string }>;
    expectTypeOf<Test>().toEqualTypeOf<never>();
  });

  test('object with some optional properties', () => {
    type Test = RemoveCodeCompletion<
      'obj.',
      { title: string; description?: string; metadata?: { tags: string[] } }
    >;
    expectTypeOf<Test>().toEqualTypeOf<
      ['remove', 'obj.description'] | ['remove', 'obj.metadata']
    >();
  });

  test('object with some properties that can be undefined', () => {
    type Test = RemoveCodeCompletion<
      'obj.',
      { title: string; description: string | undefined }
    >;
    expectTypeOf<Test>().toEqualTypeOf<never>();
  });
});

describe('ReplaceCodeCompletion', () => {
  test('array', () => {
    type Test = ReplaceCodeCompletion<'arr', string[]>;
    expectTypeOf<Test>().toEqualTypeOf<
      ['replace', `arr[${number}]`, string] | ['replace', `arr[-1]`, string]
    >();
  });

  test('readonly array', () => {
    type Test = ReplaceCodeCompletion<'arr', readonly string[]>;
    expectTypeOf<Test>().toEqualTypeOf<never>();
  });

  test('tuple', () => {
    type Test = ReplaceCodeCompletion<'arr', [string]>;
    expectTypeOf<Test>().toEqualTypeOf<
      ['replace', 'arr[0]', string] | ['replace', 'arr[-1]', string]
    >();
  });

  test('tuple with variadic head', () => {
    type Test = ReplaceCodeCompletion<'arr', [...number[], string]>;
    expectTypeOf<Test>().toEqualTypeOf<
      ['replace', `arr[${number}]`, number | string] | ['replace', 'arr[-1]', string]
    >();
  });

  test('tuple with variadic head same type', () => {
    type Test = ReplaceCodeCompletion<'arr', [...string[], string]>;
    expectTypeOf<Test>().toEqualTypeOf<
      ['replace', `arr[${number}]`, string] | ['replace', `arr[-1]`, string]
    >();
  });

  test('tuple with variadic tail', () => {
    type Test = ReplaceCodeCompletion<'arr', [string, ...number[]]>;
    expectTypeOf<Test>().toEqualTypeOf<
      | ['replace', `arr[${number}]`, string | number]
      | ['replace', `arr[-1]`, string | number]
    >();
  });

  test('tuple with variadic tail same type', () => {
    type Test = ReplaceCodeCompletion<'arr', [string, ...string[]]>;
    expectTypeOf<Test>().toEqualTypeOf<
      ['replace', `arr[${number}]`, string] | ['replace', `arr[-1]`, string]
    >();
  });

  test('tuple with optional element', () => {
    type Test = ReplaceCodeCompletion<'arr', [string, number?]>;
    expectTypeOf<Test>().toEqualTypeOf<
      | ['replace', 'arr[0]', string]
      | ['replace', 'arr[1]', number]
      | ['replace', 'arr[-1]', string | number]
    >();
  });

  test('object with no optional property', () => {
    type Test = ReplaceCodeCompletion<'obj.', { title: string }>;
    expectTypeOf<Test>().toEqualTypeOf<['replace', 'obj.title', string]>();
  });

  test('object with some optional properties', () => {
    type Test = ReplaceCodeCompletion<
      'obj.',
      { title: string; description?: string; metadata?: { tags: string[] } }
    >;
    expectTypeOf<Test>().toEqualTypeOf<
      | ['replace', 'obj.title', string]
      | ['replace', 'obj.description', string]
      | ['replace', 'obj.metadata', { tags: string[] }]
    >();
  });

  test('object with some properties that can be undefined', () => {
    type Test = ReplaceCodeCompletion<
      'obj.',
      { title: string; description: string | undefined }
    >;
    expectTypeOf<Test>().toEqualTypeOf<
      ['replace', 'obj.title', string] | ['replace', 'obj.description', string]
    >();
  });
});

describe('GetCodeCompletion', () => {
  test('array', () => {
    type Test = GetCodeCompletion<{}, 'arr', string[]>;
    expectTypeOf<Test>().toEqualTypeOf<{
      get: {
        [x: `arr[${number}]`]: string;
      } & {
        ['arr[-1]']: string;
      };
    }>();
  });

  test('readonly array', () => {
    type Test = GetCodeCompletion<{}, 'arr', readonly string[]>;
    expectTypeOf<Test>().toEqualTypeOf<
      ['get', `arr[${number}]`, string] | ['get', `arr[-1]`, string]
    >();
  });

  test('tuple', () => {
    type Test = GetCodeCompletion<'arr', [string]>;
    expectTypeOf<Test>().toEqualTypeOf<
      ['get', `arr[0]`, string] | ['get', `arr[-1]`, string]
    >();
  });

  test('tuple with variadic head', () => {
    type Test = GetCodeCompletion<'arr', [...number[], string]>;
    expectTypeOf<Test>().toEqualTypeOf<
      ['get', `arr[${number}]`, string | number] | ['get', `arr[-1]`, string]
    >();
  });

  test('tuple with variadic head same type', () => {
    type Test = GetCodeCompletion<'arr', [...string[], string]>;
    expectTypeOf<Test>().toEqualTypeOf<
      ['get', `arr[${number}]`, string] | ['get', `arr[-1]`, string]
    >();
  });

  test('tuple with variadic tail', () => {
    type Test = GetCodeCompletion<'arr', [string, ...number[]]>;
    expectTypeOf<Test>().toEqualTypeOf<
      ['get', `arr[${number}]`, string | number] | ['get', `arr[-1]`, string | number]
    >();
  });

  test('tuple with variadic tail same type', () => {
    type Test = GetCodeCompletion<'arr', [string, ...string[]]>;
    expectTypeOf<Test>().toEqualTypeOf<
      ['get', `arr[${number}]`, string] | ['get', `arr[-1]`, string]
    >();
  });

  test('tuple with optional element', () => {
    type Test = GetCodeCompletion<'arr', [string, number?]>;
    expectTypeOf<Test>().toEqualTypeOf<
      | ['get', `arr[0]`, string]
      | ['get', `arr[1]`, number | undefined]
      | ['get', `arr[-1]`, string | number | undefined]
    >();
  });

  test('object with no optional property', () => {
    type Test = GetCodeCompletion<'obj.', { title: string }>;
    expectTypeOf<Test>().toEqualTypeOf<['get', `obj.title`, string]>();
  });

  test('object with some optional properties', () => {
    type Test = GetCodeCompletion<
      'obj.',
      { title: string; description?: string; metadata?: { tags: string[] } }
    >;
    expectTypeOf<Test>().toEqualTypeOf<
      | ['get', 'obj.title', string]
      | ['get', 'obj.description', string]
      | ['get', 'obj.metadata', { tags: string[] }]
    >();
  });

  test('object with some properties that can be undefined', () => {
    type Test = GetCodeCompletion<
      'obj.',
      { title: string; description: string | undefined }
    >;
    expectTypeOf<Test>().toEqualTypeOf<
      ['get', 'obj.title', string] | ['get', 'obj.description', string]
    >();
  });
});

describe('CountCodeCompletion', () => {
  type Arr = string[];
  type Obj = { title: string };

  test('array', () => {
    type Test = CountCodeCompletion<'arr', Arr[]>;
    expectTypeOf<Test>().toEqualTypeOf<['count', `arr`]>();
  });

  test('object', () => {
    type Test = CountCodeCompletion<'obj', Obj>;
    expectTypeOf<Test>().toEqualTypeOf<['count', 'obj']>();
  });

  test('primitive', () => {
    type Test = CountCodeCompletion<'prop', string>;
    expectTypeOf<Test>().toEqualTypeOf<never>();
  });
});

describe('DocumentCodeCompletion', () => {
  test('root array', () => {
    type Test = UnionToTree<DocumentCodeCompletion<KvOperation, string[]>>;

    expectTypeOf<Test['get']>().toEqualTypeOf<
      ['get', `[${number}]`, string] | ['get', `[-1]`, string]
    >();

    expectTypeOf<Test['count']>().toEqualTypeOf<['count', ``]>();

    expectTypeOf<Test['exists']>().toEqualTypeOf<['exists', `[${number}]`]>();

    expectTypeOf<Test['arrayAppend']>().toEqualTypeOf<['arrayAppend', '', string]>();

    expectTypeOf<Test['arrayPrepend']>().toEqualTypeOf<['arrayPrepend', '', string]>();

    expectTypeOf<Test['arrayInsert']>().toEqualTypeOf<
      ['arrayInsert', `[${number}]`, string]
    >();

    expectTypeOf<Test['replace']>().toEqualTypeOf<
      ['replace', `[${number}]`, string] | ['replace', `[-1]`, string]
    >();

    expectTypeOf<Test['remove']>().toEqualTypeOf<
      ['remove', `[${number}]`] | ['remove', `[-1]`]
    >();
  });

  test('root object', () => {
    type TestDoc = { title: string };
    type Test = OmitNeverValues<{
      [Op in KvOperation]: DocumentCodeCompletion<Op, TestDoc>;
    }>;

    expectTypeOf<keyof Test>().toEqualTypeOf<
      'get' | 'exists' | 'count' | 'upsert' | 'replace'
    >();

    expectTypeOf<Test['get']>().toEqualTypeOf<['get', `title`, string]>();
    expectTypeOf<Test['count']>().toEqualTypeOf<['count', '']>();
    expectTypeOf<Test['exists']>().toEqualTypeOf<['exists', 'title']>();
    expectTypeOf<Test['replace']>().toEqualTypeOf<['replace', `title`, string]>();
    expectTypeOf<Test['upsert']>().toEqualTypeOf<['upsert', `title`, string]>();
  });

  test('deep document', () => {
    type TestDoc = {
      title: string;
      sales?: number;
      metadata?: { tags: string[] };
    };

    type Test = OmitNeverValues<{
      [Op in KvOperation]: DocumentCodeCompletion<Op, TestDoc>;
    }>;

    type KeyofTest = keyof Test;
    expectTypeOf<KeyofTest>().toEqualTypeOf<
      | 'get'
      | 'count'
      | 'exists'
      | 'upsert'
      | 'replace'
      | 'remove'
      | 'arrayAppend'
      | 'arrayPrepend'
      | 'arrayInsert'
      | 'binary'
    >();

    expectTypeOf<Test['get']>().toEqualTypeOf<
      | ['get', `title`, string]
      | ['get', `sales`, number]
      | ['get', `metadata`, { tags: string[] }]
      | ['get', `metadata.tags`, string[]]
      | ['get', `metadata.tags[${number}]`, string]
      | ['get', `metadata.tags[-1]`, string]
    >();

    expectTypeOf<Test['count']>().toEqualTypeOf<
      ['count', ''] | ['count', 'metadata'] | ['count', 'metadata.tags']
    >();

    expectTypeOf<Test['exists']>().toEqualTypeOf<
      | ['exists', `title`]
      | ['exists', `sales`]
      | ['exists', `metadata`]
      | ['exists', `metadata.tags`]
      | ['exists', `metadata.tags[${number}]`]
    >();

    expectTypeOf<Test['upsert']>().toEqualTypeOf<
      | ['upsert', `title`, string]
      | ['upsert', `sales`, number]
      | ['upsert', `metadata`, { tags: string[] }]
      | ['upsert', `metadata.tags`, string[]]
      | ['upsert', `metadata.tags[${number}]`, string]
      | ['upsert', `metadata.tags[-1]`, string]
    >();

    expectTypeOf<Test['replace']>().toEqualTypeOf<
      | ['replace', `title`, string]
      | ['replace', `sales`, number]
      | ['replace', `metadata`, { tags: string[] }]
      | ['replace', `metadata.tags`, string[]]
      | ['replace', `metadata.tags[${number}]`, string]
      | ['replace', `metadata.tags[-1]`, string]
    >();

    expectTypeOf<Test['remove']>().toEqualTypeOf<
      | ['remove', `sales`]
      | ['remove', `metadata`]
      | ['remove', `metadata.tags[${number}]`]
      | ['remove', `metadata.tags[-1]`]
    >();

    expectTypeOf<Test['arrayAppend']>().toEqualTypeOf<
      ['arrayAppend', `metadata.tags`, string]
    >();
    expectTypeOf<Test['arrayPrepend']>().toEqualTypeOf<
      ['arrayPrepend', `metadata.tags`, string]
    >();
    expectTypeOf<Test['arrayInsert']>().toEqualTypeOf<
      ['arrayInsert', `metadata.tags[${number}]`, string]
    >();

    expectTypeOf<Test['binary']>().toEqualTypeOf<['binary', `sales`]>();
  });
});
