/*
 * Copyright (c) 2024-Present Jonathan MASSUCHETTI <jonathan.massuchetti@dappit.fr>.
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

// @ts-expect-error js import
import { buildBinaryUrl } from './downloadBinary.mjs';
// @ts-expect-error js import
import { resolveBinaryTarget } from './resolveBinaryTarget.mjs';

describe('resolveBinaryTarget', () => {
  it('produces the historical output when no env override is set', ({ expect }) => {
    const target = resolveBinaryTarget({
      env: {},
      platform: 'darwin',
      arch: 'arm64',
      version: '4.6.1',
    });

    // Byte-identical to the previous inline literals (backward-compat).
    expect(target.binaryPackageName).toBe('couchbase-darwin-arm64-napi');
    expect(target.binarySourcePath).toBe(
      'package/couchbase-v4.6.1-napi-v6-darwin-arm64-boringssl.node'
    );
    expect(target.isOverridden).toBe(false);
    expect(target.platform).toBe('darwin');
    expect(target.arch).toBe('arm64');
    expect(target.version).toBe('4.6.1');
  });

  it('honors COUCHBASE_BINARY_PLATFORM and COUCHBASE_BINARY_ARCH overrides', ({
    expect,
  }) => {
    const target = resolveBinaryTarget({
      env: { COUCHBASE_BINARY_PLATFORM: 'linux', COUCHBASE_BINARY_ARCH: 'x64' },
      platform: 'darwin',
      arch: 'arm64',
      version: '4.6.1',
    });

    expect(target.binaryPackageName).toBe('couchbase-linux-x64-napi');
    expect(target.binarySourcePath).toBe(
      'package/couchbase-v4.6.1-napi-v6-linux-x64-boringssl.node'
    );
    expect(target.isOverridden).toBe(true);
    expect(target.platform).toBe('linux');
    expect(target.arch).toBe('x64');
  });

  it('flags isOverridden when only the platform is overridden, keeping the detected arch', ({
    expect,
  }) => {
    const target = resolveBinaryTarget({
      env: { COUCHBASE_BINARY_PLATFORM: 'linux' },
      platform: 'darwin',
      arch: 'arm64',
      version: '4.6.1',
    });

    expect(target.isOverridden).toBe(true);
    expect(target.platform).toBe('linux');
    expect(target.arch).toBe('arm64');
    expect(target.binaryPackageName).toBe('couchbase-linux-arm64-napi');
  });

  it('lets COUCHBASE_BINARY_VERSION win over the passed version', ({ expect }) => {
    const target = resolveBinaryTarget({
      env: { COUCHBASE_BINARY_VERSION: '4.7.0' },
      platform: 'linux',
      arch: 'x64',
      version: '4.6.1',
    });

    expect(target.version).toBe('4.7.0');
    expect(target.binarySourcePath).toBe(
      'package/couchbase-v4.7.0-napi-v6-linux-x64-boringssl.node'
    );
    // Version override alone does not count as a platform/arch override.
    expect(target.isOverridden).toBe(false);
  });
});

describe('buildBinaryUrl', () => {
  it('builds the npm registry tarball URL', ({ expect }) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    expect(buildBinaryUrl('couchbase-linux-x64-napi', '4.6.1')).toBe(
      'https://registry.npmjs.org/@couchbase/couchbase-linux-x64-napi/-/couchbase-linux-x64-napi-4.6.1.tgz'
    );
  });
});
