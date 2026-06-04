/**
 * Resolve which native Couchbase binary to fetch for the target environment.
 *
 * Each environment override wins over the auto-detected runtime value, so a build
 * machine can produce a bundle for a different target (e.g. building a Linux/x64
 * Lambda artifact from a darwin/arm64 Mac):
 *
 *   COUCHBASE_BINARY_PLATFORM → process.platform (e.g. `linux`)
 *   COUCHBASE_BINARY_ARCH     → process.arch     (e.g. `x64`)
 *   COUCHBASE_BINARY_VERSION  → fallback version (e.g. the `argv[2]` passed by the
 *                               `install` lifecycle script)
 *
 * @param {object} [options]
 * @param {NodeJS.ProcessEnv} [options.env] - defaults to `process.env`
 * @param {string} [options.platform] - defaults to `process.platform`
 * @param {string} [options.arch] - defaults to `process.arch`
 * @param {string} [options.version] - fallback version when `COUCHBASE_BINARY_VERSION` is unset
 * @returns {{
 *   platform: string,
 *   arch: string,
 *   version: string | undefined,
 *   isOverridden: boolean,
 *   binaryPackageName: string,
 *   binarySourcePath: string,
 * }}
 */
export function resolveBinaryTarget({
  env = process.env,
  platform = process.platform,
  arch = process.arch,
  version,
} = {}) {
  const sslType = 'boringssl';
  const napiVersion = 'napi-v6';

  const resolvedPlatform = env.COUCHBASE_BINARY_PLATFORM || platform;
  const resolvedArch = env.COUCHBASE_BINARY_ARCH || arch;
  const resolvedVersion = env.COUCHBASE_BINARY_VERSION || version;

  const isOverridden =
    Boolean(env.COUCHBASE_BINARY_PLATFORM) || Boolean(env.COUCHBASE_BINARY_ARCH);

  const binaryPackageName = `couchbase-${resolvedPlatform}-${resolvedArch}-napi`;
  const binarySourcePath = `package/couchbase-v${resolvedVersion}-${napiVersion}-${resolvedPlatform}-${resolvedArch}-${sslType}.node`;

  return {
    platform: resolvedPlatform,
    arch: resolvedArch,
    version: resolvedVersion,
    isOverridden,
    binaryPackageName,
    binarySourcePath,
  };
}
