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

import { AnyDocDef, AssertTests, DocumentPath } from '@cbjsdev/shared';

import { DocDef } from '../../clusterTypes.js';
import type {
  LookupInCountPath,
  LookupInExistsPath,
  LookupInGetPath,
} from './lookupOperations.types.js';

describe('lookup operations', function () {
  type TestDoc = {
    title: string;
    metadata: {
      tags: string[];
    };
  };

  type TestDocDef = DocDef<string, TestDoc>;

  type Paths<Def extends AnyDocDef> = {
    get: LookupInGetPath<Def>;
    exists: LookupInExistsPath<Def>;
    count: LookupInCountPath<Def>;
  };

  type TestPaths<
    F extends keyof Paths<TestDocDef>,
    T extends Record<DocumentPath<TestDoc>, boolean>,
  > = {
    [Path in keyof T]: [T[Path], Path extends Paths<TestDocDef>[F] ? true : false];
  };

  describe('get', function () {
    it('should accept any valid path', function () {
      type Test = TestPaths<
        'get',
        {
          '': true;
          'title': true;
          'metadata': true;
          'metadata.tags': true;
          'metadata.tags[0]': true;
          'metadata.tags[-1]': true;
        }
      >;

      type TestResult = AssertTests<Test>;
      expectTypeOf<TestResult>().toEqualTypeOf<true>();
    });
  });

  describe('exists', function () {
    it("should accept any of the document's paths", function () {
      type Test = TestPaths<
        'exists',
        {
          '': false;
          'title': true;
          'metadata': true;
          'metadata.tags': true;
          'metadata.tags[0]': true;
          'metadata.tags[-1]': true;
        }
      >;

      type TestResult = AssertTests<Test>;
      expectTypeOf<TestResult>().toEqualTypeOf<true>();
    });
  });

  describe('count', function () {
    it('should accept paths that points to an object or an array', function () {
      type Test = TestPaths<
        'count',
        {
          '': true;
          'title': false;
          'metadata': true;
          'metadata.tags': true;
          'metadata.tags[0]': false;
          'metadata.tags[-1]': false;
        }
      >;

      type TestResult = AssertTests<Test>;
      expectTypeOf<TestResult>().toEqualTypeOf<true>();
    });
  });
});
