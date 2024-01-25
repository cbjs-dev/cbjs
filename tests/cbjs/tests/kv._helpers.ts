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

import { Buffer } from 'node:buffer';

export function getLargeTestDocument() {
  return {
    foo: 'bar',
    baz: 19,
    c: 1,
    d: 'str',
    e: true,
    f: false,
    g: 5,
    h: 6,
    i: 7,
    j: 8,
    k: 9,
    l: 10,
    m: 11,
    n: 12,
    o: 13,
    p: 14,
    q: 15,
    r: 16,
    utf8: 'é',
  };
}

export function getBinaryTestDocument() {
  return Buffer.from(
    '00092bc691fb824300a6871ceddf7090d7092bc691fb824300a6871ceddf7090d7',
    'hex'
  );
}

export function getUtf8TestDocument() {
  return 'é';
}
