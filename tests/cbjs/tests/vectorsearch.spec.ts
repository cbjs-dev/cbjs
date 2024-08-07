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

import { InvalidArgumentError, VectorQuery } from '@cbjsdev/cbjs';
import { ServerFeatures } from '@cbjsdev/http-client';

// import vector from '../data/test_vector.json';
// import searchDocuments from '../data/test_vector_search_docs.json';
// import { getVectorSearchIndexConfig } from '../data/vectorSearchIndexConfig';
import { serverSupportsFeatures } from '../utils/serverFeature.js';

describe.runIf(serverSupportsFeatures(ServerFeatures.VectorSearch))(
  'vector search',
  async () => {
    // const test = createCouchbaseTest(async ({ serverTestContext }) => {
    //   const dataSample = new DataSample(serverTestContext, searchDocuments);
    //   await dataSample.upsertSample(serverTestContext.defaultCollection);
    //
    //   return {};
    // });

    it('should throw an InvalidArgumentError when constructing a VectorQuery with an empty field name', ({
      expect,
    }) => {
      const testVector = 1 as never;

      expect(() => new VectorQuery('', testVector)).toThrowError(InvalidArgumentError);
      // @ts-expect-error invalid argument
      expect(() => new VectorQuery(null, testVector)).toThrowError(InvalidArgumentError);
      // @ts-expect-error invalid argument
      expect(() => new VectorQuery(undefined, testVector)).toThrowError(
        InvalidArgumentError
      );
    });
  }
);
