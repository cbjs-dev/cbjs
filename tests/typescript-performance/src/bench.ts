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
import { bench } from '@ark/attest';

import {
  BuildOptionalProperties,
  BuildReadonlyArrayProperties,
  BuildReadonlyProperties,
  DocumentCodeCompletion,
  DocumentCodeCompletionAll,
  TestDocRequiredProperties,
} from '@cbjsdev/shared';

// Creating a baseline expression that does not appear in the benchmarked
// code gives more accurate results
// bench.baseline(() => {
//   const v: string[] = [];
// });

type TestDocS = {
  title: string;
  sales?: number;
  authors: string[];
  audit: {
    readonly createdAt: number;
  };
  metadata?: { tags: string[] };
};

type TestDocXXL = TestDocRequiredProperties &
  BuildOptionalProperties<TestDocRequiredProperties> &
  BuildReadonlyProperties<TestDocRequiredProperties> &
  BuildReadonlyArrayProperties<TestDocRequiredProperties>;

bench('cc doc S', () => {
  type CC = DocumentCodeCompletionAll<TestDocS>;
}).types([1, 'instantiations']);

bench('cc doc XXL', () => {
  type CC = DocumentCodeCompletionAll<TestDocXXL>;
}).types([1, 'instantiations']);

bench('cc doc XXL single OP', () => {
  type CC = DocumentCodeCompletion<'get', TestDocXXL>;
}).types([1, 'instantiations']);
