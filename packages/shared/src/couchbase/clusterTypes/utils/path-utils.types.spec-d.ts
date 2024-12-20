/* eslint-disable */

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

import { LookupInMacroShape } from '../lookupInMacro.types.js';
import { DropTupleHead } from './array-utils.types.js';
import { OmitNeverValues, OptionalKeys } from './misc-utils.types.js';
import {
  DocumentCodeCompletion,
  Keys,
  KvOperation,
  OpCodeCompletionPath,
  OpCodeCompletionValue,
} from './path-utils.types.js';

// prettier-ignore
type FilterStringContains<T, Match extends string, Exclude extends string = 'ZOEUAZIOEUZOIJLKFDKSFJKDSQ'> =
  T extends `${string}${Match}${string}` ?
    T extends `${string}${Exclude}${string}` ?
      never :
    T :
  never
;

// prettier-ignore
type FilterCCContains<T, Text extends string, Exclude extends string = 'ZOEUAZIOEUZOIJLKFDKSFJKDSQ'> =
  T extends [`${string}${Text}${string}`, unknown?] ?
    T extends [`${string}${Exclude}${string}`, unknown?] ?
      never :
    T extends [infer Path, unknown?] ?
      [Path] :
    never :
  never
;

type TestResult<Actual, Expected> =
  | Unexpected<Expected, Actual>
  | Missing<Expected, Actual>;

// prettier-ignore
type Unexpected<Expected, Actual> =
  Exclude<Actual, Expected> extends infer Unexpected ?
    Unexpected extends unknown ?
      ['unexpected', Unexpected] :
    never :
  never
;

// prettier-ignore
type Missing<Expected, Actual> =
  Exclude<Expected, Actual> extends infer Missing ?
    Missing extends unknown ?
      ['missing', Missing] :
    never :
  never
;

type DocumentCodeCompletionTest<Op extends KvOperation, Options, Doc> = DropTupleHead<
  DocumentCodeCompletion<Op, Options, Doc>
>;

type OptionsFriendly = { codeCompletion: { array: 'friendly'; record: 'friendly' } };

describe('FriendlyPathToArrayIndex', () => {
  it(`should add a friendly path to arr[number]`, () => {
    type TestDoc = {
      metadata: { tags: string[] };
      memberships: Array<{
        userId: string;
        friends: Array<{ name: string }>;
      }>;
    };

    type Test = DocumentCodeCompletionTest<
      'get',
      { codeCompletion: { array: 'friendly' } },
      TestDoc
    >;

    type Basic = FilterCCContains<Test, '', 'memberships['>;
    type TestBasic = TestResult<
      Basic,
      | ['']
      | ['metadata']
      | ['metadata.tags']
      | [`metadata.tags[${number}]`]
      | ['metadata.tags[]']
      | ['memberships']
    >;
    expectTypeOf<TestBasic>().toEqualTypeOf<never>();

    type MembershipsFriendly = FilterCCContains<Test, 'memberships[]'>;
    type TestMembershipsFriendly = TestResult<
      MembershipsFriendly,
      | [`memberships[]`]
      | ['memberships[].userId']
      | [`memberships[].friends`]
      | [`memberships[].friends[]`]
      | [`memberships[].friends[].name`]
    >;

    expectTypeOf<TestMembershipsFriendly>().toEqualTypeOf<never>();

    type MembershipsNegativeOne = FilterCCContains<Test, 'memberships[-1'>;
    type TestMembershipsNegativeOne = TestResult<
      MembershipsNegativeOne,
      | [`memberships[-1]`]
      | ['memberships[-1].userId']
      | [`memberships[-1].friends`]
      | [`memberships[-1].friends[]`]
      | [`memberships[-1].friends[${number}]`]
      | [`memberships[-1].friends[].name`]
      | [`memberships[-1].friends[${number}].name`]
    >;
    expectTypeOf<TestMembershipsNegativeOne>().toEqualTypeOf<never>();

    type MembershipsStrict = FilterCCContains<
      Test,
      `memberships[${number}]`,
      'memberships[-1]'
    >;
    type TestMembershipsStrict = TestResult<
      MembershipsStrict,
      | [`memberships[${number}]`]
      | [`memberships[${number}].userId`]
      | [`memberships[${number}].friends`]
      | [`memberships[${number}].friends[-1]`]
      | [`memberships[${number}].friends[-1].name`]
      | [`memberships[${number}].friends[${number}]`]
      | [`memberships[${number}].friends[${number}].name`]
    >;
    expectTypeOf<TestMembershipsStrict>().toEqualTypeOf<never>();

    // We make sure we have not forgotten to test anything
    type MissingTest = Exclude<
      FilterCCContains<Test, ''>,
      | LookupInMacroShape
      | Basic
      | MembershipsStrict
      | MembershipsNegativeOne
      | MembershipsFriendly
    >;
    expectTypeOf<MissingTest>().toEqualTypeOf<never>();
  });
});

describe('FriendlyPathToRecordKey', () => {
  it('should add a friendly path to records key', () => {
    type TestDoc = {
      metadata: { tags: string[] };
      memberships: Record<`team::${string}`, { title: string }>;
    };
    type Test = OpCodeCompletionPath<
      'get',
      { codeCompletion: { record: 'friendly' } },
      TestDoc
    >;

    expectTypeOf<Test>().toEqualTypeOf<
      | ''
      | 'metadata'
      | 'metadata.tags'
      | `metadata.tags[${number}]`
      | 'memberships'
      | `memberships.team::${string}`
      | `memberships.team::${string}.title`
      | `memberships.#`
      | `memberships.#.title`
    >();
  });
});

type NoOptions = NonNullable<unknown>;

describe('MixedFriendlyPath', () => {
  test('nested obj into array', () => {
    type TestDoc = {
      users: Array<{ subscriptions: Record<`sub::${string}`, { startedAt: number }> }>;
    };

    type Test = OpCodeCompletionPath<
      'get',
      { codeCompletion: { array: 'friendly'; record: 'friendly' } },
      TestDoc
    >;

    expectTypeOf<Test>().toEqualTypeOf<
      | ''
      | 'users'
      | 'users[]'
      | 'users[].subscriptions'
      | 'users[].subscriptions.#'
      | 'users[].subscriptions.#.startedAt'
      | 'users[-1]'
      | 'users[-1].subscriptions'
      | 'users[-1].subscriptions.#'
      | 'users[-1].subscriptions.#.startedAt'
      | `users[${number}]`
      | `users[${number}].subscriptions`
      | `users[${number}].subscriptions.sub::${string}`
      | `users[${number}].subscriptions.sub::${string}.startedAt`
      | `users[-1]`
      | `users[-1].subscriptions`
      | `users[-1].subscriptions.sub::${string}`
      | `users[-1].subscriptions.sub::${string}.startedAt`
    >();
  });
});

describe('ArrayAppendCodeCompletion', () => {
  test('array', () => {
    type Test = DocumentCodeCompletionTest<'arrayAppend', NoOptions, string[]>;
    expectTypeOf<Test>().toEqualTypeOf<['', string]>();
  });

  test('readonly array', () => {
    type Test = DocumentCodeCompletionTest<'arrayAppend', NoOptions, readonly string[]>;
    expectTypeOf<Test>().toEqualTypeOf<never>();
  });

  test('tuple', () => {
    type Test = DocumentCodeCompletionTest<'arrayAppend', NoOptions, [string]>;
    expectTypeOf<Test>().toEqualTypeOf<never>();
  });

  test('tuple with variadic head', () => {
    type Test = DocumentCodeCompletionTest<
      'arrayAppend',
      NoOptions,
      [...number[], string]
    >;
    expectTypeOf<Test>().toEqualTypeOf<never>();
  });

  test('tuple with variadic head same type', () => {
    type Test = DocumentCodeCompletionTest<
      'arrayAppend',
      NoOptions,
      [...string[], string]
    >;
    expectTypeOf<Test>().toEqualTypeOf<['', string]>();
  });

  test('tuple with variadic tail', () => {
    type Test = DocumentCodeCompletionTest<
      'arrayAppend',
      NoOptions,
      [string, ...number[]]
    >;
    expectTypeOf<Test>().toEqualTypeOf<['', number]>();
  });

  test('tuple with variadic tail same type', () => {
    type Test = DocumentCodeCompletionTest<
      'arrayAppend',
      NoOptions,
      [number, ...number[]]
    >;
    expectTypeOf<Test>().toEqualTypeOf<['', number]>();
  });

  test('tuple with optional element', () => {
    type Test = DocumentCodeCompletionTest<'arrayAppend', NoOptions, [string, number?]>;
    expectTypeOf<Test>().toEqualTypeOf<['', number]>();
  });
});

describe('ArrayPrependCodeCompletion', () => {
  test('array', () => {
    type Test = DocumentCodeCompletionTest<'arrayPrepend', NoOptions, string[]>;
    expectTypeOf<Test>().toEqualTypeOf<['', string]>();
  });

  test('readonly array', () => {
    type Test = DocumentCodeCompletionTest<'arrayPrepend', NoOptions, readonly string[]>;
    expectTypeOf<Test>().toEqualTypeOf<never>();
  });

  test('tuple', () => {
    type Test = DocumentCodeCompletionTest<'arrayPrepend', NoOptions, [string]>;
    expectTypeOf<Test>().toEqualTypeOf<never>();
  });

  test('tuple with variadic head', () => {
    type Test = DocumentCodeCompletionTest<
      'arrayPrepend',
      NoOptions,
      [...number[], string]
    >;
    expectTypeOf<Test>().toEqualTypeOf<['', number]>();
  });

  test('tuple with variadic head same type', () => {
    type Test = DocumentCodeCompletionTest<
      'arrayPrepend',
      NoOptions,
      [...string[], string]
    >;
    expectTypeOf<Test>().toEqualTypeOf<['', string]>();
  });

  test('tuple with variadic tail', () => {
    type Test = DocumentCodeCompletionTest<
      'arrayPrepend',
      NoOptions,
      [string, ...number[]]
    >;
    expectTypeOf<Test>().toEqualTypeOf<never>();
  });

  test('tuple with variadic tail same type', () => {
    type Test = DocumentCodeCompletionTest<
      'arrayPrepend',
      NoOptions,
      [string, ...string[]]
    >;
    expectTypeOf<Test>().toEqualTypeOf<['', string]>();
  });

  test('tuple with optional element', () => {
    type Test = DocumentCodeCompletionTest<'arrayPrepend', NoOptions, [string, number?]>;
    expectTypeOf<Test>().toEqualTypeOf<never>();
  });
});

describe('ArrayInsertCodeCompletion', () => {
  test('array', () => {
    type Test = DocumentCodeCompletionTest<'arrayInsert', NoOptions, string[]>;
    expectTypeOf<Test>().toEqualTypeOf<[`[${number}]`, string]>();
  });

  test('readonly array', () => {
    type Test = DocumentCodeCompletionTest<'arrayInsert', NoOptions, readonly string[]>;
    expectTypeOf<Test>().toEqualTypeOf<[`[${number}]`, string]>();
  });

  test('tuple', () => {
    type Test = DocumentCodeCompletionTest<'arrayInsert', NoOptions, [string]>;
    expectTypeOf<Test>().toEqualTypeOf<never>();
  });

  test('tuple with variadic head', () => {
    type Test = DocumentCodeCompletionTest<
      'arrayInsert',
      NoOptions,
      [...number[], string]
    >;
    expectTypeOf<Test>().toEqualTypeOf<[`[${number}]`, number]>();
  });

  test('tuple with variadic head same type', () => {
    type Test = DocumentCodeCompletionTest<
      'arrayInsert',
      NoOptions,
      [...string[], string]
    >;
    expectTypeOf<Test>().toEqualTypeOf<[`[${number}]`, string]>();
  });

  test('tuple with variadic tail', () => {
    type Test = DocumentCodeCompletionTest<
      'arrayInsert',
      NoOptions,
      [string, ...number[]]
    >;
    expectTypeOf<Test>().toEqualTypeOf<[`[0]`, never] | [`[${number}]`, number]>();
  });

  test('tuple with variadic tail same type', () => {
    type Test = DocumentCodeCompletionTest<
      'arrayInsert',
      NoOptions,
      [string, ...string[]]
    >;
    expectTypeOf<Test>().toEqualTypeOf<[`[0]`, string] | [`[${number}]`, string]>();
  });

  test('tuple with optional element', () => {
    type Test = DocumentCodeCompletionTest<'arrayInsert', NoOptions, [string, number?]>;
    expectTypeOf<Test>().toEqualTypeOf<['[0]', never] | ['[1]', number]>();
  });
});

describe('RemoveCodeCompletion', () => {
  test('array', () => {
    type Test = DocumentCodeCompletionTest<'remove', NoOptions, string[]>;
    expectTypeOf<Test>().toEqualTypeOf<[`[${number}]`, true] | [`[-1]`, true]>();
  });

  test('readonly array', () => {
    type Test = DocumentCodeCompletionTest<'remove', NoOptions, readonly string[]>;
    expectTypeOf<Test>().toEqualTypeOf<[`[${number}]`, true] | [`[-1]`, true]>();
  });

  test('tuple', () => {
    type Test = DocumentCodeCompletionTest<'remove', NoOptions, [string]>;
    expectTypeOf<Test>().toEqualTypeOf<never>();
  });

  test('tuple with variadic head', () => {
    type Test = DocumentCodeCompletionTest<'remove', NoOptions, [...number[], string]>;
    expectTypeOf<Test>().toEqualTypeOf<[`[-1]`, false] | [`[${number}]`, true]>();
  });

  test('tuple with variadic head same type', () => {
    type Test = DocumentCodeCompletionTest<'remove', NoOptions, [...string[], string]>;
    expectTypeOf<Test>().toEqualTypeOf<[`[${number}]`, true] | [`[-1]`, true]>();
  });

  test('tuple with variadic tail', () => {
    type Test = DocumentCodeCompletionTest<'remove', NoOptions, [string, ...number[]]>;
    expectTypeOf<Test>().toEqualTypeOf<
      [`[${number}]`, true] | [`[0]`, false] | [`[-1]`, true]
    >();
  });

  test('tuple with variadic tail same type', () => {
    type Test = DocumentCodeCompletionTest<'remove', NoOptions, [string, ...string[]]>;
    expectTypeOf<Test>().toEqualTypeOf<
      [`[${number}]`, true] | [`[0]`, true] | [`[-1]`, true]
    >();
  });

  test('tuple with optional element', () => {
    type Test = DocumentCodeCompletionTest<'remove', NoOptions, [string, number?]>;
    expectTypeOf<Test>().toEqualTypeOf<['[0]', false] | ['[1]', true] | ['[-1]', true]>();
  });

  test('object with no optional property', () => {
    type Test = DocumentCodeCompletionTest<'remove', NoOptions, { title: string }>;
    expectTypeOf<Test>().toEqualTypeOf<never>();
  });

  test('object with some optional properties', () => {
    type Test = DocumentCodeCompletionTest<
      'remove',
      NoOptions,
      { title: string; description?: string }
    >;
    expectTypeOf<Test>().toEqualTypeOf<['description', true]>();
  });

  test('object with some properties that can be undefined', () => {
    type Test = DocumentCodeCompletionTest<
      'remove',
      NoOptions,
      { title: string; description: string | undefined }
    >;
    expectTypeOf<Test>().toEqualTypeOf<['description', true]>();
  });

  test('object with record', () => {
    type UserId = `user::${string}`;
    type TestDoc = { members: Record<UserId, { name: string }> };
    type Test = DocumentCodeCompletionTest<'remove', NoOptions, TestDoc>;

    expectTypeOf<Test>().toEqualTypeOf<[`members.user::${string}`, true]>();

    type TestFriendly = DocumentCodeCompletionTest<'remove', OptionsFriendly, TestDoc>;

    expectTypeOf<TestFriendly>().toEqualTypeOf<
      [`members.user::${string}`, true] | ['members.#', true]
    >();
  });
});

describe('ReplaceCodeCompletion', () => {
  test('array', () => {
    type Test = DocumentCodeCompletionTest<'replace', NoOptions, { arr: string[] }>;
    expectTypeOf<Test>().toEqualTypeOf<
      ['arr', string[]] | [`arr[${number}]`, string] | [`arr[-1]`, string]
    >();
  });

  test('readonly array', () => {
    type Test = DocumentCodeCompletionTest<'replace', NoOptions, readonly string[]>;
    expectTypeOf<Test>().toEqualTypeOf<[`[${number}]`, string] | ['[-1]', string]>();
  });

  test('tuple', () => {
    type Test = DocumentCodeCompletionTest<'replace', NoOptions, [string]>;
    expectTypeOf<Test>().toEqualTypeOf<['[0]', string] | ['[-1]', string]>();
  });

  test('tuple with variadic head', () => {
    type Test = DocumentCodeCompletionTest<'replace', NoOptions, [...number[], string]>;
    expectTypeOf<Test>().toEqualTypeOf<
      [`[${number}]`, number | string] | ['[-1]', string]
    >();
  });

  test('tuple with variadic head same type', () => {
    type Test = DocumentCodeCompletionTest<'replace', NoOptions, [...string[], string]>;
    expectTypeOf<Test>().toEqualTypeOf<[`[${number}]`, string] | [`[-1]`, string]>();
  });

  test('tuple with variadic tail', () => {
    type Test = DocumentCodeCompletionTest<'replace', NoOptions, [string, ...number[]]>;
    expectTypeOf<Test>().toEqualTypeOf<
      [`[${number}]`, string | number] | [`[0]`, string] | [`[-1]`, string | number]
    >();
  });

  test('tuple with variadic tail same type', () => {
    type Test = DocumentCodeCompletionTest<'replace', NoOptions, [string, ...string[]]>;
    expectTypeOf<Test>().toEqualTypeOf<
      [`[${number}]`, string] | [`[0]`, string] | [`[-1]`, string]
    >();
  });

  test('tuple with optional element', () => {
    type Test = DocumentCodeCompletionTest<'replace', NoOptions, [string, number?]>;
    expectTypeOf<Test>().toEqualTypeOf<
      ['[0]', string] | ['[1]', number] | ['[-1]', string | number]
    >();
  });

  test('object with no optional property', () => {
    type Test = DocumentCodeCompletionTest<'replace', NoOptions, { title: string }>;
    expectTypeOf<Test>().toEqualTypeOf<['title', string]>();
  });

  test('object with some optional properties', () => {
    type Test = DocumentCodeCompletionTest<
      'replace',
      NoOptions,
      { title: string; description?: string; metadata?: { tags: string[] } }
    >;

    expectTypeOf<Test>().toEqualTypeOf<
      | ['title', string]
      | ['description', string]
      | ['metadata', { tags: string[] }]
      | ['metadata.tags', string[]]
      | ['metadata.tags[-1]', string]
      | [`metadata.tags[${number}]`, string]
    >();
  });

  test('object with some properties that can be undefined', () => {
    type Test = DocumentCodeCompletionTest<
      'replace',
      NoOptions,
      { title: string; description: string | undefined }
    >;
    expectTypeOf<Test>().toEqualTypeOf<['title', string] | ['description', string]>();
  });
});

describe('UpsertCodeCompletion', () => {
  test('array', () => {
    type Test = DocumentCodeCompletionTest<'upsert', NoOptions, string[]>;
    expectTypeOf<Test>().toEqualTypeOf<['', string[]]>();
  });

  test('readonly array', () => {
    type Test = DocumentCodeCompletionTest<'upsert', NoOptions, readonly string[]>;
    expectTypeOf<Test>().toEqualTypeOf<['', readonly string[]]>();
  });

  test('tuple', () => {
    type Test = DocumentCodeCompletionTest<'upsert', NoOptions, [string]>;
    expectTypeOf<Test>().toEqualTypeOf<['', [string]]>();
  });

  test('tuple with variadic head', () => {
    type Test = DocumentCodeCompletionTest<'upsert', NoOptions, [...number[], string]>;
    expectTypeOf<Test>().toEqualTypeOf<['', [...number[], string]]>();
  });

  test('tuple with variadic head same type', () => {
    type Test = DocumentCodeCompletionTest<'upsert', NoOptions, [...string[], string]>;
    expectTypeOf<Test>().toEqualTypeOf<['', [...string[], string]]>();
  });

  test('tuple with variadic tail', () => {
    type Test = DocumentCodeCompletionTest<'upsert', NoOptions, [string, ...number[]]>;
    expectTypeOf<Test>().toEqualTypeOf<['', [string, ...number[]]]>();
  });

  test('tuple with variadic tail same type', () => {
    type Test = DocumentCodeCompletionTest<'upsert', NoOptions, [string, ...string[]]>;
    expectTypeOf<Test>().toEqualTypeOf<['', [string, ...string[]]]>();
  });

  test('tuple with optional element', () => {
    type Test = DocumentCodeCompletionTest<'upsert', NoOptions, [string, number?]>;
    expectTypeOf<Test>().toEqualTypeOf<['', [string, number?]]>();
  });

  test('object with no optional property', () => {
    type TestDoc = { title: string };
    type Test = DocumentCodeCompletionTest<'upsert', NoOptions, TestDoc>;
    expectTypeOf<Test>().toEqualTypeOf<['', TestDoc] | ['title', string]>();
  });

  test('object with some optional properties', () => {
    type TestDoc = { title: string; description?: string; metadata?: { tags: string[] } };
    type Test = DocumentCodeCompletionTest<'upsert', NoOptions, TestDoc>;
    expectTypeOf<Test>().toEqualTypeOf<
      | ['', TestDoc]
      | ['title', string]
      | ['description', string]
      | ['metadata', { tags: string[] }]
      | ['metadata.tags', string[]]
    >();
  });

  test('object with some readonly properties', () => {
    type TestDoc = { title: string; description?: string; readonly createdAt: number };
    type Test = DocumentCodeCompletionTest<'upsert', NoOptions, TestDoc>;
    expectTypeOf<Test>().toEqualTypeOf<
      ['', TestDoc] | ['title', string] | ['description', string] | ['createdAt', number]
    >();
  });

  test('object with some properties that can be undefined', () => {
    type TestDoc = { title: string; description: string | undefined };
    type Test = DocumentCodeCompletionTest<'upsert', NoOptions, TestDoc>;
    expectTypeOf<Test>().toEqualTypeOf<
      ['', TestDoc] | ['title', string] | ['description', string]
    >();
  });

  test('object with record', () => {
    type UserId = `user::${string}`;
    type TestDoc = Record<UserId, { name: string }>;
    type Test = DocumentCodeCompletionTest<'upsert', NoOptions, TestDoc>;

    expectTypeOf<Test>().toEqualTypeOf<
      | ['', TestDoc]
      | [`user::${string}`, { name: string }]
      | [`user::${string}.name`, string]
    >();
  });
});

describe('GetCodeCompletion', () => {
  test('array', () => {
    type Test = DocumentCodeCompletionTest<'get', NoOptions, string[]>;
    expectTypeOf<Test>().toEqualTypeOf<
      ['', string[]] | [`[${number}]`, string] | [`[-1]`, string]
    >();
  });

  test('readonly array', () => {
    type Test = DocumentCodeCompletionTest<'get', NoOptions, readonly string[]>;
    expectTypeOf<Test>().toEqualTypeOf<
      ['', readonly string[]] | [`[${number}]`, string] | [`[-1]`, string]
    >();
  });

  test('tuple', () => {
    type Test = DocumentCodeCompletionTest<'get', NoOptions, [string]>;
    expectTypeOf<Test>().toEqualTypeOf<
      ['', [string]] | [`[0]`, string] | [`[-1]`, string]
    >();
  });

  test('tuple with variadic head', () => {
    type Test = DocumentCodeCompletionTest<'get', NoOptions, [...number[], string]>;
    expectTypeOf<Test>().toEqualTypeOf<
      ['', [...number[], string]] | [`[${number}]`, string | number] | [`[-1]`, string]
    >();
  });

  test('tuple with variadic head same type', () => {
    type Test = DocumentCodeCompletionTest<'get', NoOptions, [...string[], string]>;
    expectTypeOf<Test>().toEqualTypeOf<
      ['', [...string[], string]] | [`[${number}]`, string] | [`[-1]`, string]
    >();
  });

  test('tuple with variadic tail', () => {
    type Test = DocumentCodeCompletionTest<'get', NoOptions, [string, ...number[]]>;
    expectTypeOf<Test>().toEqualTypeOf<
      | ['', [string, ...number[]]]
      | [`[${number}]`, string | number]
      | [`[0]`, string]
      | [`[-1]`, string | number]
    >();
  });

  test('tuple with variadic tail same type', () => {
    type Test = DocumentCodeCompletionTest<'get', NoOptions, [string, ...string[]]>;
    expectTypeOf<Test>().toEqualTypeOf<
      | ['', [string, ...string[]]]
      | [`[${number}]`, string]
      | [`[0]`, string]
      | [`[-1]`, string]
    >();
  });

  test('tuple with optional element', () => {
    type Test = DocumentCodeCompletionTest<'get', NoOptions, [string, number?]>;
    expectTypeOf<Test>().toEqualTypeOf<
      | [``, [string, number?]]
      | [`[0]`, string]
      | [`[1]`, number]
      | [`[-1]`, string | number]
    >();
  });

  test('object with no optional property', () => {
    type Test = DocumentCodeCompletionTest<'get', NoOptions, { title: string }>;
    expectTypeOf<Test>().toEqualTypeOf<['', { title: string }] | [`title`, string]>();
  });

  test('object with some optional properties', () => {
    type TestDoc = { title: string; description?: string; metadata?: { tags: string[] } };
    type Test = DocumentCodeCompletionTest<'get', NoOptions, TestDoc>;

    expectTypeOf<Test>().toEqualTypeOf<
      | ['', TestDoc]
      | ['title', string]
      | ['description', string]
      | ['metadata', { tags: string[] }]
      | ['metadata.tags', string[]]
      | [`metadata.tags[${number}]`, string]
      | [`metadata.tags[-1]`, string]
    >();
  });

  test('object with some properties that can be undefined', () => {
    type TestDoc = { title: string; description: string | undefined };
    type Test = DocumentCodeCompletionTest<'get', NoOptions, TestDoc>;
    expectTypeOf<Test>().toEqualTypeOf<
      ['', TestDoc] | ['title', string] | ['description', string]
    >();
  });
});

describe('CountCodeCompletion', () => {
  type Arr = string[];
  type Obj = { title: string };

  test('array', () => {
    type Test = DocumentCodeCompletionTest<'count', NoOptions, Arr[]>;
    expectTypeOf<Test>().toEqualTypeOf<[''] | ['[-1]'] | [`[${number}]`]>();
  });

  test('object', () => {
    type Test = DocumentCodeCompletionTest<'count', NoOptions, Obj>;
    expectTypeOf<Test>().toEqualTypeOf<['']>();
  });

  test('primitive', () => {
    type Test = DocumentCodeCompletionTest<'count', NoOptions, string>;
    expectTypeOf<Test>().toEqualTypeOf<never>();
  });
});

describe('BinaryCodeCompletion', () => {
  test('object with property: number', () => {
    type Test = DocumentCodeCompletionTest<'binary', NoOptions, { sales: number }>;
    expectTypeOf<Test>().toEqualTypeOf<[`sales`, true]>();
  });

  test('array', () => {
    type Test = DocumentCodeCompletionTest<'binary', NoOptions, number[]>;
    expectTypeOf<Test>().toEqualTypeOf<[`[${number}]`, true] | [`[-1]`, true]>();
  });

  test('readonly array', () => {
    type Test = DocumentCodeCompletionTest<'binary', NoOptions, readonly number[]>;
    expectTypeOf<Test>().toEqualTypeOf<[`[${number}]`, true] | [`[-1]`, true]>();
  });

  test('tuple', () => {
    type Test = DocumentCodeCompletionTest<'binary', NoOptions, [number]>;
    expectTypeOf<Test>().toEqualTypeOf<[`[0]`, true] | ['[-1]', true]>();
  });

  test('tuple with variadic head', () => {
    type Test = DocumentCodeCompletionTest<'binary', NoOptions, [...number[], string]>;
    expectTypeOf<Test>().toEqualTypeOf<[`[${number}]`, true] | [`[-1]`, false]>();

    type Test2 = DocumentCodeCompletionTest<'binary', NoOptions, [...string[], number]>;
    expectTypeOf<Test2>().toEqualTypeOf<[`[${number}]`, true] | [`[-1]`, true]>();
  });

  test('tuple with variadic head same type', () => {
    type Test = DocumentCodeCompletionTest<'binary', NoOptions, [...number[], number]>;
    expectTypeOf<Test>().toEqualTypeOf<[`[${number}]`, true] | [`[-1]`, true]>();
  });

  test('tuple with variadic tail', () => {
    type Test = DocumentCodeCompletionTest<'binary', NoOptions, [string, ...number[]]>;
    expectTypeOf<Test>().toEqualTypeOf<
      [`[${number}]`, true] | [`[0]`, false] | [`[-1]`, true]
    >();

    type Test2 = DocumentCodeCompletionTest<'binary', NoOptions, [number, ...string[]]>;
    expectTypeOf<Test2>().toEqualTypeOf<[`[0]`, true] | ['[-1]', true]>();
  });

  test('tuple with variadic tail same type', () => {
    type Test = DocumentCodeCompletionTest<'binary', NoOptions, [number, ...number[]]>;
    expectTypeOf<Test>().toEqualTypeOf<
      [`[${number}]`, true] | [`[0]`, true] | [`[-1]`, true]
    >();
  });

  test('tuple with optional element', () => {
    type Test = DocumentCodeCompletionTest<'binary', NoOptions, [string, number?]>;
    expectTypeOf<Test>().toEqualTypeOf<[`[-1]`, true] | [`[1]`, true]>();
  });
});

describe('DocumentCodeCompletionTest', () => {
  test('root array', () => {
    type Test = {
      [Op in KvOperation]: DocumentCodeCompletionTest<Op, NoOptions, string[]>;
    };

    expectTypeOf<Test['get']>().toEqualTypeOf<
      ['', string[]] | [`[${number}]`, string] | [`[-1]`, string]
    >();

    expectTypeOf<Test['exists']>().toEqualTypeOf<[`[${number}]`] | ['[-1]']>();

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
      [Op in KvOperation]: DocumentCodeCompletionTest<Op, NoOptions, TestDoc>;
    }>;

    type TestKeyof = keyof Test;
    expectTypeOf<TestKeyof>().toEqualTypeOf<
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
      [Op in KvOperation]: DocumentCodeCompletionTest<Op, NoOptions, TestDoc>;
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

    type TestGet = DocumentCodeCompletionTest<'get', NoOptions, TestDoc>;

    expectTypeOf<TestGet>().toEqualTypeOf<
      | [``, TestDoc]
      | [`title`, string]
      | [`sales`, number]
      | [`authors`, string[]]
      | [`authors[-1]`, string]
      | [`authors[${number}]`, string]
      | [`metadata`, { tags: string[] }]
      | [`metadata.tags`, string[]]
      | [`metadata.tags[-1]`, string]
      | [`metadata.tags[${number}]`, string]
      | [`audit`, { readonly createdAt: number }]
      | [`audit.createdAt`, number]
      | [`codes`, [string, string]]
      | [`codes[0]`, string]
      | [`codes[1]`, string]
      | [`codes[-1]`, string]
      | [`recoveryCodes`, readonly [string, string]]
      | [`recoveryCodes[0]`, string]
      | [`recoveryCodes[1]`, string]
      | [`recoveryCodes[-1]`, string]
    >();

    type TestCount = DocumentCodeCompletionTest<'count', NoOptions, TestDoc>;
    expectTypeOf<TestCount>().toEqualTypeOf<
      | ['']
      | ['metadata']
      | ['metadata.tags']
      | ['authors']
      | ['audit']
      | ['codes']
      | ['recoveryCodes']
    >();

    type TestExists = DocumentCodeCompletionTest<'exists', NoOptions, TestDoc>;
    expectTypeOf<TestExists>().toEqualTypeOf<
      | [`title`]
      | [`sales`]
      | [`authors`]
      | [`authors[-1]`]
      | [`authors[${number}]`]
      | [`metadata`]
      | [`metadata.tags`]
      | [`metadata.tags[-1]`]
      | [`metadata.tags[${number}]`]
      | [`audit`]
      | [`audit.createdAt`]
      | [`codes`]
      | [`codes[0]`]
      | [`codes[1]`]
      | [`codes[-1]`]
      | [`recoveryCodes`]
      | [`recoveryCodes[0]`]
      | [`recoveryCodes[1]`]
      | [`recoveryCodes[-1]`]
    >();

    type TestInsert = DocumentCodeCompletionTest<'insert', NoOptions, TestDoc>;
    expectTypeOf<TestInsert>().toEqualTypeOf<
      [`sales`, number] | [`metadata`, { tags: string[] }]
    >();

    type TestUpsert = DocumentCodeCompletionTest<'upsert', NoOptions, TestDoc>;
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

    type TestReplace = DocumentCodeCompletionTest<'replace', NoOptions, TestDoc>;
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
      | [`recoveryCodes[0]`, string]
      | [`recoveryCodes[1]`, string]
      | [`recoveryCodes[-1]`, string]
    >();

    type TestRemove = DocumentCodeCompletionTest<'remove', NoOptions, TestDoc>;
    expectTypeOf<TestRemove>().toEqualTypeOf<
      | [`sales`, true]
      | [`metadata`, true]
      | [`authors[${number}]`, true]
      | [`authors[-1]`, true]
      | [`metadata.tags[${number}]`, true]
      | [`metadata.tags[-1]`, true]
    >();

    type TestArrayAppend = DocumentCodeCompletionTest<'arrayAppend', NoOptions, TestDoc>;
    expectTypeOf<TestArrayAppend>().toEqualTypeOf<
      [`metadata.tags`, string] | [`authors`, string]
    >();

    type TestArrayPrepend = DocumentCodeCompletionTest<
      'arrayPrepend',
      NoOptions,
      TestDoc
    >;
    expectTypeOf<TestArrayPrepend>().toEqualTypeOf<
      [`metadata.tags`, string] | [`authors`, string]
    >();

    type TestArrayInsert = DocumentCodeCompletionTest<'arrayInsert', NoOptions, TestDoc>;
    expectTypeOf<TestArrayInsert>().toEqualTypeOf<
      [`metadata.tags[${number}]`, string] | [`authors[${number}]`, string]
    >();

    type TestBinary = DocumentCodeCompletionTest<'binary', NoOptions, TestDoc>;
    expectTypeOf<TestBinary>().toEqualTypeOf<
      ['sales', true] | ['audit.createdAt', true]
    >();

    type TestBinary2 = DocumentCodeCompletionTest<
      'binary',
      NoOptions,
      { sales: [string, number] }
    >;
    expectTypeOf<TestBinary2>().toEqualTypeOf<[`sales[-1]`, true] | [`sales[1]`, true]>();

    type TestBinary3 = DocumentCodeCompletionTest<
      'binary',
      NoOptions,
      { sales: [number, string] }
    >;
    expectTypeOf<TestBinary3>().toEqualTypeOf<[`sales[0]`, true]>();
  });

  test('document with records', () => {
    type UserId = `user::${string}`;
    type TestDoc = { members: Record<UserId, { name: string }> };

    type Test = DocumentCodeCompletionTest<'upsert', NoOptions, TestDoc>;

    expectTypeOf<Test>().toEqualTypeOf<
      | ['', TestDoc]
      | ['members', Record<UserId, { name: string }>]
      | [`members.user::${string}`, { name: string }]
      | [`members.user::${string}.name`, string]
    >();
  });

  test('document with unions', () => {
    type TestDoc = {
      events:
        | { type: 'a'; propA: { title: string } }
        | { type: 'b'; propB: { status: string } };
    };
    type Test = DocumentCodeCompletionTest<'get', NoOptions, TestDoc>;

    expectTypeOf<Test>().toEqualTypeOf<
      | [``, TestDoc]
      | [`events`, TestDoc['events']]
      | [`events.type`, 'a' | 'b']
      | [`events.propA`, { title: string }]
      | [`events.propA.title`, string]
      | [`events.propB`, { status: string }]
      | [`events.propB.status`, string]
    >();
  });
});

describe('OpCodeCompletionValue', () => {
  describe('get', () => {
    test('object path', () => {
      type Test = OpCodeCompletionValue<
        'get',
        NonNullable<unknown>,
        { title: string },
        'title'
      >;
      expectTypeOf<Test>().toEqualTypeOf<string>();
    });

    test('object nested path', () => {
      type Test = OpCodeCompletionValue<
        'get',
        NonNullable<unknown>,
        { metadata?: { tags: string[] } },
        'metadata.tags'
      >;
      expectTypeOf<Test>().toEqualTypeOf<string[]>();
    });

    test('object record with literal index signature', () => {
      type Test = OpCodeCompletionValue<
        'get',
        NonNullable<unknown>,
        { memberships?: Record<`user::${string}`, { joinedAt: number }> },
        'memberships.user::001'
      >;
      expectTypeOf<Test>().toEqualTypeOf<{ joinedAt: number }>();
    });
  });

  describe('upsert', () => {
    test('object path', () => {
      type Test = OpCodeCompletionValue<
        'upsert',
        NonNullable<unknown>,
        { title: string },
        'title'
      >;
      expectTypeOf<Test>().toEqualTypeOf<string>();
    });

    test('object path to object', () => {
      type Test = OpCodeCompletionValue<
        'upsert',
        NonNullable<unknown>,
        { metadata?: { tags: string[] } },
        'metadata'
      >;
      expectTypeOf<Test>().toEqualTypeOf<{ tags: string[] }>();
    });

    test('object nested path', () => {
      type Test = OpCodeCompletionValue<
        'upsert',
        NonNullable<unknown>,
        { metadata?: { tags: string[] } },
        'metadata.tags'
      >;
      expectTypeOf<Test>().toEqualTypeOf<string[]>();
    });

    test('friendly path', () => {
      type Test = OpCodeCompletionValue<
        'arrayInsert',
        { codeCompletion: { array: 'friendly' } },
        { metadata?: { tags: string[] } },
        'metadata.tags[]'
      >;

      expectTypeOf<Test>().toEqualTypeOf<never>();
    });

    test('deep object friendly path', () => {
      type Test = OpCodeCompletionValue<
        'upsert',
        { codeCompletion: { array: 'friendly'; record: 'friendly' } },
        {
          memberships: Record<
            `membership::${string}`,
            { joinedAt: number; leftAt?: number }
          >;
        },
        'memberships.#.leftAt'
      >;

      expectTypeOf<Test>().toEqualTypeOf<never>();
    });
  });

  test('remove', () => {
    type Test = OpCodeCompletionValue<
      'remove',
      NonNullable<unknown>,
      { arr: [number, ...string[]] },
      'arr[0]'
    >;
    expectTypeOf<Test>().toEqualTypeOf<never>();

    type Test2 = OpCodeCompletionValue<
      'remove',
      NonNullable<unknown>,
      { arr: [number, ...string[]] },
      'arr[1]'
    >;
    expectTypeOf<Test2>().toEqualTypeOf<true>();
  });

  test('binary', () => {
    type TestDoc = { arr: [number, ...string[]] };
    type Test = OpCodeCompletionValue<'binary', NonNullable<unknown>, TestDoc, 'arr[0]'>;
    expectTypeOf<Test>().toEqualTypeOf<number>();

    type Test2 = OpCodeCompletionValue<
      'binary',
      NonNullable<unknown>,
      { arr: [number, ...string[]] },
      'arr[1]'
    >;
    expectTypeOf<Test2>().toEqualTypeOf<never>();
  });

  test('deep binary', () => {
    type NestedDoc = { attempt: number };
    type TestDoc = { arr: NestedDoc[] };
    type Test = OpCodeCompletionValue<
      'binary',
      NonNullable<unknown>,
      TestDoc,
      'arr[0].attempt'
    >;
    expectTypeOf<Test>().toEqualTypeOf<number>();
  });
});
