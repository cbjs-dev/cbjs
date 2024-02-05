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
import { describe, it } from 'vitest';

import { AnyCollection } from '../../../clusterTypes';
import { LookupInSpec } from '../../../sdspecs';
import { ChainableLookupIn } from './ChainableLookupIn';

describe('ChainableLookupIn', function () {
  it('should return all the specs, in order, when the getter is called', function ({
    expect,
  }) {
    const collection: AnyCollection = true as any;
    const specs = ChainableLookupIn.for(collection, 'lookupIn', 'book::001', {})
      .get('title')
      .count('metadata.tags')
      .exists('title')
      .getSpecs();

    expect(specs).toStrictEqual([
      LookupInSpec.get('title'),
      LookupInSpec.count('metadata.tags'),
      LookupInSpec.exists('title'),
    ]);
  });
});
