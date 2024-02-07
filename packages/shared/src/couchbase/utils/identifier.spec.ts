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
import { describe, test } from 'vitest';

import { isValidBucketName } from './identifier';

describe('validateIdentifier', () => {
  test('should return true with a valid identifier', ({ expect }) => {
    expect(isValidBucketName('valid')).toBeTruthy();
    expect(isValidBucketName('bond007')).toBeTruthy();
    expect(isValidBucketName('my.dad.text.like.that')).toBeTruthy();
    expect(isValidBucketName('30%_of_the_time-it.works.all.the.time')).toBeTruthy();
  });

  test('should return false with an invalid identifier', ({ expect }) => {
    expect(isValidBucketName('foo`bar')).toBeFalsy();
    expect(isValidBucketName('yo/lo')).toBeFalsy();
  });
});
