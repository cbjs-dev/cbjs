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
import { describe, expect, it } from 'vitest';

import { isKeyspaceNotFoundError } from './isKeyspaceNotFoundError.js';

/**
 * Body the query service answered with when the collection had just been created,
 * captured on a 7.6.4 cluster.
 */
const responseBody = JSON.stringify({
  requestID: '696cc0dc-526c-4873-bd2f-57b2a0055706',
  clientContextID: 'd15140-116f-074d-6979-ad9d784c87766d',
  errors: [
    {
      code: 12003,
      msg: 'Keyspace not found in CB datastore: default:cbjs_c72778c4._default.c72778c4_0',
    },
  ],
  status: 'fatal',
});

describe('isKeyspaceNotFoundError', () => {
  it('should recognize the body the SDK keeps on the cpp error', () => {
    const err = new Error('bucket not found', {
      cause: { http_body: responseBody },
    });

    expect(isKeyspaceNotFoundError(err)).toBe(true);
  });

  it('should recognize the body the SDK exposes through the error context', () => {
    const err = Object.assign(new Error('bucket not found'), {
      context: { response_body: responseBody },
    });

    expect(isKeyspaceNotFoundError(err)).toBe(true);
  });

  it('should recognize the body the http client inlines in the message', () => {
    expect(isKeyspaceNotFoundError(new Error(responseBody))).toBe(true);
  });

  it('should reject an error that is not about a missing keyspace', () => {
    const err = new Error('index not found', {
      cause: { http_body: '{"errors":[{"code":12016,"msg":"Index Not Found"}]}' },
    });

    expect(isKeyspaceNotFoundError(err)).toBe(false);
  });

  it('should reject a value that carries no body at all', () => {
    expect(isKeyspaceNotFoundError(undefined)).toBe(false);
    expect(isKeyspaceNotFoundError(null)).toBe(false);
    expect(isKeyspaceNotFoundError('Keyspace not found')).toBe(false);
  });
});
