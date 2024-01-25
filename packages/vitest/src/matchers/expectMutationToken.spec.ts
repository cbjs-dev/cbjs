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
import { describe, it } from 'vitest';

import './expectMutationToken';

describe('toBeMutationToken', () => {
  it('should succeed when given a mutation token', ({ expect }) => {
    expect({
      toJSON: () => ({
        partition_uuid: 'partition_uuid',
        sequence_number: 'sequence_number',
        partition_id: 0,
        bucket_name: 'bucket_name',
      }),
    }).toBeMutationToken();
  });

  it.fails('should fail when not given a mutation token', ({ expect }) => {
    expect({
      toJSON: () => ({
        partition_uuid: 'partition_uuid',
        sequence_number: 'sequence_number',
        partition_id: 'should be a number',
        bucket_name: 'bucket_name',
      }),
    }).toBeMutationToken();
  });

  it.fails('should fail when given a string', ({ expect }) => {
    expect('im not a mutation token').toBeMutationToken();
  });
});
